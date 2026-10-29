import { useState, useRef, useEffect } from 'react';
import { properties } from '../data/properties';
import type { Property } from '../data/properties';
import { useNavigate } from 'react-router-dom';
import { useSaved } from '../context/SavedPropertiesContext';
import { getApiBaseUrl, setApiBaseUrl } from '../config/api';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  source?: 'gemini' | 'local';
  results?: Property[];
}

function localSearch(query: string): Property[] {
  const q = query.toLowerCase();

  let districtFilter = '';
  if (q.includes('raigad')) districtFilter = 'Raigad';
  else if (q.includes('palghar')) districtFilter = 'Palghar';

  // Area parsing
  let minArea: number | null = null;
  let minAreaStrict = false;
  const areaAtLeast = q.match(/(?:at least|minimum of|min)\s*(\d+(?:\.\d+)?)\s*(?:acres?|acre)?/);
  if (areaAtLeast) {
    minArea = parseFloat(areaAtLeast[1]);
  } else {
    const areaAbove = q.match(/(?:above|more than|greater than|>)\s*(\d+(?:\.\d+)?)\s*(?:acres?|acre)?/);
    if (areaAbove) {
      minArea = parseFloat(areaAbove[1]);
      minAreaStrict = true;
    }
  }

  // Price parsing (e.g. ₹30 lakh, 30 lakhs, 1.5 lakh)
  let maxPrice: number | null = null;
  const lakhMatch = q.match(/(?:under|below|less than|up to|max)?\s*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs)/);
  if (lakhMatch) {
    maxPrice = parseFloat(lakhMatch[1]) * 100_000;
  }

  return properties.filter((p) => {
    if (districtFilter && p.district !== districtFilter) return false;
    if (minArea !== null) {
      if (minAreaStrict && p.areaAcres <= minArea) return false;
      if (!minAreaStrict && p.areaAcres < minArea) return false;
    }
    if (maxPrice !== null && p.totalPrice > maxPrice) return false;

    // Keyword match if no structured filters caught
    if (!districtFilter && minArea === null && maxPrice === null) {
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
  const [apiUrl, setApiUrlState] = useState<string>(() => getApiBaseUrl());
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

      {/* Suggestions with updated prompt matching demo listing R-003 */}
      <div className="px-3 sm:px-4 py-2 bg-gray-50 border-t border-gray-200 flex gap-2 overflow-x-auto flex-shrink-0 no-scrollbar">
        {['Farms under ₹30 lakh in Raigad', 'Farms in Raigad', 'Land in Dahanu', 'Palghar farms'].map((s) => (
          <button
            key={s}
            onClick={() => { setInput(s); }}
            className="whitespace-nowrap text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:bg-green-50 hover:border-green-300 transition-colors shadow-2xs"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-200 flex gap-2 flex-shrink-0 z-10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about land in Raigad or Palghar…"
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
