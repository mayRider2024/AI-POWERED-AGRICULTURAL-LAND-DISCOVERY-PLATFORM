import { useState, useRef, useEffect } from 'react';
import { properties } from '../data/properties';
import type { Property } from '../data/properties';
import { useNavigate } from 'react-router-dom';
import { useSaved } from '../context/SavedPropertiesContext';
import { getApiBaseUrl, setApiBaseUrl } from '../config/api';
import { startVoiceRecognition } from '../services/speech';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  source?: 'gemini' | 'local';
  results?: Property[];
}

function localSearch(query: string): Property[] {
  const q = query.toLowerCase();

  let districtFilter = '';
  if (q.includes('raigad') || q.includes('रायगड')) districtFilter = 'Raigad';
  else if (q.includes('palghar') || q.includes('पालघर')) districtFilter = 'Palghar';

  let talukaFilter = '';
  const talukasMap: Record<string, string> = {
    panvel: 'Panvel',
    पनवेल: 'Panvel',
    alibag: 'Alibag',
    alibaug: 'Alibag',
    अलिबाग: 'Alibag',
    pen: 'Pen',
    पेण: 'Pen',
    mhasala: 'Mhasala',
    म्हसळा: 'Mhasala',
    talasari: 'Talasari',
    तलासरी: 'Talasari',
    vikramgad: 'Vikramgad',
    विक्रमगड: 'Vikramgad',
    dahanu: 'Dahanu',
    डहाणू: 'Dahanu',
  };
  for (const [key, name] of Object.entries(talukasMap)) {
    if (q.includes(key)) {
      talukaFilter = name;
      if (['Panvel', 'Alibag', 'Pen', 'Mhasala'].includes(name) && !districtFilter) {
        districtFilter = 'Raigad';
      } else if (['Talasari', 'Vikramgad', 'Dahanu'].includes(name) && !districtFilter) {
        districtFilter = 'Palghar';
      }
      break;
    }
  }

  // Survey number parsing
  let surveyFilter = '';
  const surveyMatch = q.match(/(?:survey(?:\s*(?:no\.?|number))?|gat(?:\s*(?:no\.?|number))?|सर्व्हे|गट)\s*[:#-]?\s*([a-zA-Z0-9]+(?:\/[0-9]+)?)/i);
  if (surveyMatch) {
    surveyFilter = surveyMatch[1].toUpperCase();
  } else {
    const codeMatch = q.match(/\b([rp]-[0-9]{3})\b/i);
    if (codeMatch) surveyFilter = codeMatch[1].toUpperCase();
  }

  // Area parsing (supports Marathi numbers: ५ एकर)
  let minArea: number | null = null;
  let minAreaStrict = false;
  let maxArea: number | null = null;

  const marathiNums: Record<string, string> = { '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9' };
  let qTrans = q;
  for (const [m, e] of Object.entries(marathiNums)) {
    qTrans = qTrans.replaceAll(m, e);
  }

  const areaRange = qTrans.match(/(?:between\s+)?(\d+(?:\.\d+)?)\s*(?:-|to|and)\s*(\d+(?:\.\d+)?)\s*(?:acres?|acre|एकर)/);
  if (areaRange) {
    minArea = parseFloat(areaRange[1]);
    maxArea = parseFloat(areaRange[2]);
  } else {
    const areaAtLeast = qTrans.match(/(?:at least|minimum of|min|कमीतकमी)\s*(\d+(?:\.\d+)?)\s*(?:acres?|acre|एकर)?/);
    const areaAbove = qTrans.match(/(?:above|more than|greater than|>|पेक्षा जास्त)\s*(\d+(?:\.\d+)?)\s*(?:acres?|acre|एकर)?/);
    const areaUnder = qTrans.match(/(?:under|less than|below|<|पेक्षा कमी|पर्यंत)\s*(\d+(?:\.\d+)?)\s*(?:acres?|acre|एकर)?/);
    const areaExact = qTrans.match(/(\d+(?:\.\d+)?)\s*(?:acres?|acre|एकर)/);

    if (areaAtLeast) {
      minArea = parseFloat(areaAtLeast[1]);
      minAreaStrict = false;
    } else if (areaAbove) {
      minArea = parseFloat(areaAbove[1]);
      minAreaStrict = true;
    } else if (areaUnder) {
      maxArea = parseFloat(areaUnder[1]);
    } else if (areaExact) {
      minArea = parseFloat(areaExact[1]);
      minAreaStrict = false;
    }
  }

  // Price per guntha parsing
  let minPricePerGuntha: number | null = null;
  let maxPricePerGuntha: number | null = null;
  const gunthaRange = qTrans.match(/(?:between\s+)?(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs)?\s*(?:to|and|-)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs)\s*(?:per|\/)\s*(?:guntha|गुंठा)/);
  if (gunthaRange) {
    const g1 = parseFloat(gunthaRange[1]);
    const g2 = parseFloat(gunthaRange[2]);
    minPricePerGuntha = g1 < 1000 ? g1 * 100_000 : g1;
    maxPricePerGuntha = g2 < 1000 ? g2 * 100_000 : g2;
  }

  // Total price parsing
  let maxTotalPrice: number | null = null;
  if (!maxPricePerGuntha) {
    const lakhMatch = qTrans.match(/(?:under|below|less than|up to|max|कमी|खाली)?\s*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs|लाख)/);
    if (lakhMatch && !qTrans.includes('per guntha') && !qTrans.includes('गुंठा')) {
      maxTotalPrice = parseFloat(lakhMatch[1]) * 100_000;
    }
    if (maxTotalPrice === null) {
      const directMatch = qTrans.match(/(?:under|below|less than|up to)\s*(?:₹|rs\.?|inr)?\s*(\d{5,10})/);
      if (directMatch) {
        maxTotalPrice = parseFloat(directMatch[1]);
      }
    }
  }

  // Road distance parsing
  let maxRoadDistance: number | null = null;
  const roadMatch = qTrans.match(/(?:within|under|near|कमी)?\s*(\d+(?:\.\d+)?)\s*(?:m|meters?|metres?|मीटर)\s*(?:of\s*(?:a\s*)?)?(?:road|highway|रस्ता)/);
  if (roadMatch) {
    maxRoadDistance = parseFloat(roadMatch[1]);
  }

  return properties.filter((p) => {
    if (districtFilter && p.district !== districtFilter) return false;
    if (talukaFilter && p.taluka.toLowerCase() !== talukaFilter.toLowerCase()) return false;
    if (surveyFilter && !p.surveyNumber.toUpperCase().includes(surveyFilter)) return false;
    if (minArea !== null) {
      if (minAreaStrict && p.areaAcres <= minArea) return false;
      if (!minAreaStrict && p.areaAcres < minArea) return false;
    }
    if (maxArea !== null && p.areaAcres > maxArea) return false;
    if (minPricePerGuntha !== null && p.pricePerGuntha < minPricePerGuntha) return false;
    if (maxPricePerGuntha !== null && p.pricePerGuntha > maxPricePerGuntha) return false;
    if (maxTotalPrice !== null && p.totalPrice > maxTotalPrice) return false;
    if (maxRoadDistance !== null && p.roadDistanceMeters && p.roadDistanceMeters > maxRoadDistance) return false;

    // Keyword match if no structured filters caught
    if (!districtFilter && !talukaFilter && !surveyFilter && minArea === null && maxArea === null && maxTotalPrice === null && maxRoadDistance === null) {
      return (
        p.district.toLowerCase().includes(q) ||
        p.taluka.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q) ||
        p.surveyNumber.toLowerCase().includes(q) ||
        q.includes(p.district.toLowerCase()) ||
        q.includes(p.taluka.toLowerCase())
      );
    }
    return true;
  });
}

function normalizeProperty(p: any): Property {
  // If already matches frontend Property
  if (p.surveyNumber && p.areaAcres && p.totalPrice) {
    return p as Property;
  }
  // Otherwise map from backend schema
  const matchingFrontend = properties.find(
    (fp) => fp.id === `p${p.id}` || fp.surveyNumber === p.survey_number
  );
  if (matchingFrontend) {
    return matchingFrontend;
  }
  return {
    id: p.id ? `p${p.id}` : `p${Date.now()}`,
    surveyNumber: p.survey_number ?? 'DEMO',
    district: p.district ?? 'Raigad',
    taluka: p.taluka ?? '',
    village: p.village ?? '',
    areaAcres: Number(p.area_acres ?? 1.0),
    pricePerGuntha: Number(p.price_per_guntha ?? 50000),
    totalPrice: Number(p.total_price ?? 100000),
    coordinates: [Number(p.longitude ?? 73.15), Number(p.latitude ?? 18.6)],
    verificationStatus: 'unverified',
  };
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hello! I can help you search for agricultural land in Raigad and Palghar. Try asking: "Farms under ₹30 lakh in Raigad" or "Find land in Alibag".',
      source: 'local',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState('en-IN');
  const voiceStopRef = useRef<(() => void) | null>(null);
  const [apiUrl, setApiUrlState] = useState<string>(() => getApiBaseUrl());

  const toggleListening = () => {
    if (isListening) {
      voiceStopRef.current?.();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    const listener = startVoiceRecognition(
      (transcript) => {
        setInput(transcript);
        setIsListening(false);
      },
      (err) => {
        console.warn('Voice error:', err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      },
      voiceLang
    );
    voiceStopRef.current = listener.stop;
  };
  const [showConfig, setShowConfig] = useState(false);
  const [configInput, setConfigInput] = useState(apiUrl);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { savedIds, toggleSave } = useSaved();

  const checkHealth = async (urlToCheck: string) => {
    setBackendStatus('checking');
    try {
      const resp = await fetch(`${urlToCheck}/health`, { signal: AbortSignal.timeout(3500) });
      if (resp.ok) {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch {
      setBackendStatus('offline');
    }
  };

  // Check health on mount and when apiUrl changes
  useEffect(() => {
    checkHealth(apiUrl);
  }, [apiUrl]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSaveConfig = () => {
    const trimmed = configInput.trim().replace(/\/+$/, '');
    setApiBaseUrl(trimmed);
    const updated = getApiBaseUrl();
    setApiUrlState(updated);
    setShowConfig(false);
    checkHealth(updated);
  };

  const sendMessage = async () => {
    const query = input.trim();
    if (!query) return;

    const userMsg: Message = { role: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      let results: Property[] = [];
      let responseText = '';
      let source: 'gemini' | 'local' = 'local';

      if (backendStatus === 'online') {
        // Try backend AI search
        const resp = await fetch(`${apiUrl}/api/ai/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
          signal: AbortSignal.timeout(8000),
        });
        if (resp.ok) {
          const data = await resp.json();
          const rawProps = data.properties ?? data.results ?? [];
          results = rawProps.map(normalizeProperty);
          responseText = data.message ?? `Found ${results.length} matching properties.`;
          source = 'gemini';
        } else {
          throw new Error(`Backend returned ${resp.status}`);
        }
      } else {
        // Offline: use local keyword search on demo data
        results = localSearch(query);
        responseText =
          results.length > 0
            ? `Found ${results.length} demo properties matching "${query}".`
            : `No demo properties matched "${query}". Try "Farms under ₹30 lakh in Raigad" or "Alibag".`;
        source = 'local';
      }

      const assistantMsg: Message = { role: 'assistant', text: responseText, source, results };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Fallback to local demo search on network failure
      const localResults = localSearch(query);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Backend connection error. Showing local demo results for "${query}".`,
          source: 'local',
          results: localResults,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto min-w-0 bg-gray-50 relative">
      {/* Header */}
      <div className="px-4 py-2.5 bg-white border-b border-gray-200 flex items-center justify-between gap-3 flex-shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-2xl">🤖</span>
          <div className="min-w-0">
            <h1 className="font-bold text-gray-800 text-sm sm:text-base leading-tight truncate">AI Land Assistant</h1>
            <p className="text-xs text-gray-500 leading-tight flex items-center gap-1.5 truncate">
              <span>Backend:</span>
              <span className={`inline-flex items-center gap-1 font-medium ${
                backendStatus === 'online' ? 'text-green-600' : backendStatus === 'offline' ? 'text-orange-600' : 'text-gray-500'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  backendStatus === 'online' ? 'bg-green-600' : backendStatus === 'offline' ? 'bg-orange-500' : 'bg-gray-400'
                }`} />
                {backendStatus === 'online' ? 'Online (Gemini AI)' : backendStatus === 'offline' ? 'Offline (Local Demo)' : 'Connecting…'}
              </span>
            </p>
          </div>
        </div>

        {/* Server config button */}
        <button
          onClick={() => { setConfigInput(apiUrl); setShowConfig(!showConfig); }}
          className="text-xs px-2.5 py-1 rounded border border-gray-300 hover:bg-gray-100 text-gray-600 flex items-center gap-1 font-medium whitespace-nowrap"
          title="Configure API Server IP / URL"
        >
          ⚙ Server
        </button>
      </div>

      {/* Config URL drawer / modal */}
      {showConfig && (
        <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs flex-shrink-0 z-20 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-800">API Server URL (LAN / Cloud / Deployed)</span>
            <button onClick={() => setShowConfig(false)} className="text-gray-500 hover:text-gray-700 text-sm">✕</button>
          </div>
          <p className="text-gray-600">
            To connect from a physical Android phone, enter your Mac's LAN IP (e.g. <code>http://192.168.x.x:8001</code>) or your deployed HTTPS URL:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={configInput}
              onChange={(e) => setConfigInput(e.target.value)}
              placeholder="http://192.168.1.100:8001"
              className="flex-1 border border-gray-300 rounded px-2.5 py-1.5 bg-white text-xs text-gray-800 outline-none focus:border-green-600"
            />
            <button
              onClick={handleSaveConfig}
              className="px-3 py-1.5 bg-green-700 text-white font-medium rounded hover:bg-green-800 transition-colors"
            >
              Save & Test
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] sm:max-w-md rounded-2xl px-4 py-2.5 break-words ${
              msg.role === 'user'
                ? 'bg-green-700 text-white rounded-br-sm'
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
            }`}>
              {msg.role === 'assistant' && msg.source && (
                <div className="mb-1 flex items-center gap-1.5">
                  {msg.source === 'gemini' ? (
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      ✨ Gemini AI Powered
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      ⚡ Local Demo Search
                    </span>
                  )}
                </div>
              )}

              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              {msg.results && msg.results.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.results.map((p) => (
                    <div key={p.id} className="bg-gray-50 rounded-lg p-2.5 border border-gray-100 text-left">
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-medium text-xs text-gray-800">{p.surveyNumber}</span>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded font-medium whitespace-nowrap">DEMO</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{p.district} · {p.taluka} · {p.village}</p>
                      <p className="text-xs text-green-700 font-semibold mt-1">₹{p.totalPrice.toLocaleString()} · {p.areaAcres} acres</p>
                      <div className="flex gap-1.5 mt-2">
                        <button
                          onClick={() => navigate(`/property/${p.id}`)}
                          className="text-xs px-2.5 py-1 bg-green-700 text-white rounded hover:bg-green-800 font-medium"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => toggleSave(p.id)}
                          className="text-xs px-2.5 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium"
                        >
                          {savedIds.includes(p.id) ? '♥ Saved' : '♡ Save'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions with official prompts */}
      <div className="px-3 sm:px-4 py-2 bg-gray-50 border-t border-gray-200 flex gap-2 overflow-x-auto flex-shrink-0 no-scrollbar">
        {[
          'Farms under ₹30 lakh in Raigad',
          'Find survey number 125/2 in Panvel',
          'मला पालघरमध्ये ५ एकर शेतीची जमीन दाखवा',
          'Find 10 acres in Palghar between ₹10 lakh and ₹15 lakh per guntha, within 100 metres of a road',
        ].map((s) => (
          <button
            key={s}
            onClick={() => { setInput(s); }}
            className="whitespace-nowrap text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:bg-green-50 hover:border-green-300 transition-colors shadow-2xs font-medium text-gray-700"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Voice status feedback */}
      {isListening && (
        <div className="px-4 py-1.5 bg-red-50 border-t border-red-200 flex items-center justify-between text-xs text-red-700 font-medium animate-pulse">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            Listening in {voiceLang === 'en-IN' ? 'English' : voiceLang === 'hi-IN' ? 'Hindi' : 'Marathi'}… Speak now
          </span>
          <button onClick={toggleListening} className="underline text-red-800 text-xs">Stop</button>
        </div>
      )}

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 flex-shrink-0 z-10">
        <select
          value={voiceLang}
          onChange={(e) => setVoiceLang(e.target.value)}
          className="border border-gray-300 rounded-lg px-2 py-2 text-xs bg-gray-50 text-gray-700 outline-none"
          title="Voice Language"
        >
          <option value="en-IN">EN</option>
          <option value="mr-IN">मराठी</option>
          <option value="hi-IN">हिंदी</option>
        </select>

        <button
          type="button"
          onClick={toggleListening}
          className={`p-2 rounded-lg border text-sm transition-colors flex items-center justify-center ${
            isListening
              ? 'bg-red-600 text-white border-red-700 animate-bounce'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
          }`}
          title="Voice search"
        >
          🎤
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask in English or मराठी (e.g. 5 acres in Panvel)…"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          Send
        </button>
      </div>
    </div>
  );
}
