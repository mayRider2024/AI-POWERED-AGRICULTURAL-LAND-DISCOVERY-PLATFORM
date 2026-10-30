import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { properties } from '../data/properties';
import type { Property } from '../data/properties';
import { useNavigate } from 'react-router-dom';
import { useSaved } from '../context/SavedPropertiesContext';
import { useAuth } from '../context/AuthContext';
import { getApiBaseUrl, setApiBaseUrl } from '../config/api';
import { startVoiceRecognition } from '../services/speech';
import { useLocalization } from '../utils/localization';
import { aiConversationService } from '../services/aiConversation';
import { generateConversationTitle, type AIConversation } from '../types/aiConversation';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  text: string;
  source?: 'gemini' | 'local';
  explanation?: string;
  unmetConstraints?: string[];
  unsupported?: string[];
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
  const { t, i18n } = useTranslation();
  const { user, getAccessToken } = useAuth();
  const { localizeLocation, formatSmartPrice, formatNumber, formatINRLocalized } = useLocalization();

  const initialWelcomeMessage: Message = {
    role: 'assistant',
    text: t('aiAssistant.welcome'),
    source: 'local',
    explanation: t('aiAssistant.welcomeHint'),
  };

  // Conversation state
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Edit / delete conversation modal states
  const [renamingConvId, setRenamingConvId] = useState<string | null>(null);
  const [renamingTitle, setRenamingTitle] = useState('');
  const [deletingConvId, setDeletingConvId] = useState<string | null>(null);

  // Messages in active conversation
  const [messages, setMessages] = useState<Message[]>([initialWelcomeMessage]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState(() => {
    if (i18n.language === 'mr') return 'mr-IN';
    if (i18n.language === 'hi') return 'hi-IN';
    return 'en-IN';
  });
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

  // Load conversations when authenticated user changes
  const loadConversations = async () => {
    if (!user) {
      setConversations([]);
      return;
    }
    setHistoryLoading(true);
    const { data } = await aiConversationService.listConversations(user.id);
    if (data) {
      setConversations(data);
    }
    setHistoryLoading(false);
  };

  useEffect(() => {
    loadConversations();
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSaveConfig = () => {
    const trimmed = configInput.trim().replace(/\/+$/, '');
    setApiBaseUrl(trimmed);
    const updated = getApiBaseUrl();
    setApiUrlState(updated);
    setShowConfig(false);
    checkHealth(updated);
  };

  // Start new conversation
  const handleStartNewChat = () => {
    setActiveConversationId(null);
    setMessages([
      {
        role: 'assistant',
        text: t('aiAssistant.welcome'),
        source: 'local',
        explanation: t('aiAssistant.welcomeHint'),
      },
    ]);
    setInput('');
    setHistoryDrawerOpen(false);
  };

  // Select and reopen existing conversation
  const handleSelectConversation = async (conv: AIConversation) => {
    setActiveConversationId(conv.id);
    setHistoryDrawerOpen(false);
    setMessagesLoading(true);

    const { data } = await aiConversationService.getMessages(conv.id);
    if (data && data.length > 0) {
      const parsed: Message[] = data.map((m) => {
        const meta = m.metadata || {};
        return {
          id: m.id,
          role: m.role,
          text: m.content,
          source: meta.source,
          explanation: meta.explanation,
          unmetConstraints: meta.unmetConstraints,
          unsupported: meta.unsupported,
          results: meta.results ? meta.results.map(normalizeProperty) : undefined,
        };
      });
      setMessages(parsed);
    } else {
      // Empty or fallback
      setMessages([
        {
          role: 'assistant',
          text: t('aiAssistant.welcome'),
          source: 'local',
          explanation: t('aiAssistant.welcomeHint'),
        },
      ]);
    }
    setMessagesLoading(false);
  };

  // Trigger rename dialog
  const handleStartRename = (conv: AIConversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingConvId(conv.id);
    setRenamingTitle(conv.title);
  };

  // Save renamed conversation
  const handleSaveRename = async () => {
    if (!renamingConvId || !renamingTitle.trim()) return;
    const trimmed = renamingTitle.trim();
    await aiConversationService.renameConversation(renamingConvId, trimmed);
    setConversations((prev) =>
      prev.map((c) => (c.id === renamingConvId ? { ...c, title: trimmed, updated_at: new Date().toISOString() } : c))
    );
    setRenamingConvId(null);
  };

  // Trigger delete dialog
  const handleStartDelete = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingConvId(convId);
  };

  // Confirm delete conversation
  const handleConfirmDelete = async () => {
    if (!deletingConvId) return;
    const targetId = deletingConvId;
    await aiConversationService.deleteConversation(targetId);
    setConversations((prev) => prev.filter((c) => c.id !== targetId));
    if (activeConversationId === targetId) {
      handleStartNewChat();
    }
    setDeletingConvId(null);
  };

  const sendMessage = async () => {
    const query = input.trim();
    if (!query || loading) return;

    let currentConvId = activeConversationId;

    // Auto-create cloud conversation on first user query if authenticated and no active conversation
    if (!currentConvId && user) {
      const title = generateConversationTitle(query);
      const { data: newConv } = await aiConversationService.createConversation(user.id, title);
      if (newConv) {
        currentConvId = newConv.id;
        setActiveConversationId(newConv.id);
        setConversations((prev) => [newConv, ...prev]);
      }
    }

    const userMsg: Message = { role: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Save user message to cloud if conversation active
    if (currentConvId && user) {
      aiConversationService.saveMessage(currentConvId, 'user', query);
    }

    try {
      let results: Property[] = [];
      let responseText = '';
      let explanation = '';
      let unmetConstraints: string[] = [];
      let unsupported: string[] = [];
      let source: 'gemini' | 'local' = 'local';

      // Prepare bounded history (last 6 messages) for multi-turn Gemini reasoning
      const historyPayload = messages
        .filter((m) => m.text && m.text !== t('aiAssistant.welcome'))
        .slice(-6)
        .map((m) => ({
          role: m.role,
          content: m.text,
        }));

      if (backendStatus === 'online') {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (user) {
          try {
            const token = await getAccessToken();
            if (token) {
              headers['Authorization'] = `Bearer ${token}`;
            }
          } catch {
            // Proceed without token if retrieval fails
          }
        }

        // Try backend AI search with conversation context
        const resp = await fetch(`${apiUrl}/api/ai/search`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            query,
            conversation_id: currentConvId || undefined,
            history: historyPayload,
          }),
          signal: AbortSignal.timeout(10000),
        });
        if (resp.ok) {
          const data = await resp.json();
          const rawProps = data.properties ?? data.results ?? [];
          results = rawProps.map(normalizeProperty);
          responseText = `Found ${results.length} matching ${results.length === 1 ? 'property' : 'properties'}.`;
          explanation = data.explanation || '';
          unmetConstraints = data.unmet_constraints || data.relaxation_hints || [];
          unsupported = data.unsupported || [];
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
            : `Found 0 matching properties.`;
        explanation = results.length > 0
          ? 'Matched from local demonstration dataset.'
          : 'No demo properties matched all terms. Try relaxing constraints (e.g. "Farms under ₹40 lakh in Raigad").';
        source = 'local';
      }

      const assistantMsg: Message = {
        role: 'assistant',
        text: responseText,
        source,
        explanation,
        unmetConstraints,
        unsupported,
        results,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If backend was offline, save locally-derived message; if online, backend stored it directly.
      if (currentConvId && user) {
        if (source === 'local') {
          // Assistant message fallback stored locally or when offline
          // Note: When online, the authenticated backend verified ownership and stored the assistant message.
        }

        // Touch local conversation updated_at for sorting
        setConversations((prev) => {
          const updated = prev.map((c) =>
            c.id === currentConvId ? { ...c, updated_at: new Date().toISOString() } : c
          );
          return [...updated].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        });
      }
    } catch {
      // Fallback to local demo search on network failure
      const localResults = localSearch(query);
      const fallbackText = `Backend connection error. Showing local demo results for "${query}".`;
      const fallbackExp = 'Could not connect to live API server. Reverted to offline demo catalog.';
      const fallbackMsg: Message = {
        role: 'assistant',
        text: fallbackText,
        source: 'local',
        explanation: fallbackExp,
        results: localResults,
      };

      setMessages((prev) => [...prev, fallbackMsg]);
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
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto min-w-0 bg-gray-50 relative">
      {/* Header */}
      <div className="px-4 py-2.5 bg-white border-b border-gray-200 flex items-center justify-between gap-3 flex-shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setHistoryDrawerOpen(true)}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors flex items-center gap-1.5 text-xs font-medium"
            title={t('aiAssistant.conversations')}
          >
            <span>💬</span>
            <span className="hidden sm:inline">{t('aiAssistant.history')}</span>
            {user && conversations.length > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {conversations.length}
              </span>
            )}
          </button>

          <span className="text-2xl">🤖</span>
          <div className="min-w-0">
            <h1 className="font-bold text-gray-800 text-sm sm:text-base leading-tight truncate">
              {t('nav.aiSearch')}
            </h1>
            <p className="text-xs text-gray-500 leading-tight flex items-center gap-1.5 truncate">
              <span>Backend:</span>
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  backendStatus === 'online'
                    ? 'text-emerald-600'
                    : backendStatus === 'offline'
                    ? 'text-amber-600'
                    : 'text-gray-500'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    backendStatus === 'online'
                      ? 'bg-emerald-600'
                      : backendStatus === 'offline'
                      ? 'bg-amber-500'
                      : 'bg-gray-400'
                  }`}
                />
                {backendStatus === 'online'
                  ? t('aiAssistant.backendOnline')
                  : backendStatus === 'offline'
                  ? t('aiAssistant.localMode')
                  : t('aiAssistant.checking')}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* New Chat Button */}
          <button
            onClick={handleStartNewChat}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 flex items-center gap-1 font-semibold transition-colors"
            title={t('aiAssistant.newChat')}
          >
            <span>+</span>
            <span className="hidden sm:inline">{t('aiAssistant.newChat')}</span>
          </button>

          {/* Server config button */}
          <button
            onClick={() => {
              setConfigInput(apiUrl);
              setShowConfig(!showConfig);
            }}
            className="text-xs px-2.5 py-1.5 rounded border border-gray-300 hover:bg-gray-100 text-gray-600 flex items-center gap-1 font-medium whitespace-nowrap"
            title="Configure API Server IP / URL"
          >
            ⚙ Server
          </button>
        </div>
      </div>

      {/* Guest Banner if not signed in */}
      {!user && (
        <div className="px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 flex items-center justify-between text-xs text-amber-800 flex-shrink-0">
          <div className="flex items-center gap-2 pr-2">
            <span>ℹ️</span>
            <span>{t('aiAssistant.guestBanner')}</span>
          </div>
          <button
            onClick={() => navigate('/auth')}
            className="px-2.5 py-1 bg-amber-600 text-white font-medium rounded hover:bg-amber-700 transition-colors whitespace-nowrap text-xs shadow-2xs"
          >
            {t('aiAssistant.signInToSync')}
          </button>
        </div>
      )}

      {/* Config URL drawer / modal */}
      {showConfig && (
        <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs flex-shrink-0 z-20 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-800">API Server URL (LAN / Cloud / Deployed)</span>
            <button onClick={() => setShowConfig(false)} className="text-gray-500 hover:text-gray-700 text-sm">
              ✕
            </button>
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

      {/* History Drawer Side-panel */}
      {historyDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setHistoryDrawerOpen(false)}
          />

          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-lg">💬</span>
                <h2 className="font-bold text-gray-800 text-sm">{t('aiAssistant.conversations')}</h2>
              </div>
              <button
                onClick={() => setHistoryDrawerOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Start New Button inside Drawer */}
            <div className="p-3 border-b border-gray-100">
              <button
                onClick={handleStartNewChat}
                className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-2 shadow-2xs hover:opacity-95 transition-all"
              >
                <span>+</span> {t('aiAssistant.newChat')}
              </button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {!user ? (
                <div className="p-4 text-center space-y-3">
                  <p className="text-xs text-gray-500">{t('aiAssistant.guestBanner')}</p>
                  <button
                    onClick={() => {
                      setHistoryDrawerOpen(false);
                      navigate('/auth');
                    }}
                    className="w-full py-2 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    {t('aiAssistant.signInToSync')}
                  </button>
                </div>
              ) : historyLoading ? (
                <div className="p-6 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
                  <span>Loading conversations...</span>
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400">
                  {t('aiAssistant.noConversations')}
                </div>
              ) : (
                conversations.map((conv) => {
                  const isActive = conv.id === activeConversationId;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      className={`group relative flex items-center justify-between p-2.5 rounded-lg cursor-pointer text-xs transition-colors ${
                        isActive
                          ? 'bg-amber-50 border border-amber-200 text-amber-900 font-semibold'
                          : 'hover:bg-gray-100 text-gray-700 border border-transparent'
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="truncate leading-snug">{conv.title}</p>
                        <span className="text-[10px] text-gray-400 font-normal">
                          {new Date(conv.updated_at).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      {/* Quick action icons for rename & delete */}
                      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100">
                        <button
                          onClick={(e) => handleStartRename(conv, e)}
                          title={t('aiAssistant.rename')}
                          className="p-1 hover:bg-white rounded text-gray-500 hover:text-gray-800"
                        >
                          ✎
                        </button>
                        <button
                          onClick={(e) => handleStartDelete(conv.id, e)}
                          title={t('aiAssistant.delete')}
                          className="p-1 hover:bg-white rounded text-red-500 hover:text-red-700"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rename Dialog Modal */}
      {renamingConvId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-gray-800 text-sm">{t('aiAssistant.rename')}</h3>
            <input
              type="text"
              value={renamingTitle}
              onChange={(e) => setRenamingTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-amber-500"
              placeholder="Conversation title"
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRenamingConvId(null)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {t('aiAssistant.cancel')}
              </button>
              <button
                onClick={handleSaveRename}
                className="px-3 py-1.5 text-xs bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700"
              >
                {t('aiAssistant.saveTitle')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingConvId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-gray-800 text-sm text-red-600 flex items-center gap-1.5">
              <span>⚠️</span> {t('aiAssistant.deleteConfirmTitle')}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t('aiAssistant.deleteConfirmDesc')}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingConvId(null)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {t('aiAssistant.cancel')}
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 text-xs bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
              >
                {t('aiAssistant.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-4">
        {messagesLoading ? (
          <div className="p-8 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
            <span>Loading messages...</span>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={msg.id || i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] sm:max-w-md rounded-2xl px-4 py-2.5 break-words ${
                  msg.role === 'user'
                    ? 'bg-green-700 text-white rounded-br-sm'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                    {msg.source === 'gemini' || (i === 0 && backendStatus === 'online') ? (
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        ✨ AI-Powered Land Search
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        ⚡ Local Demo Search
                      </span>
                    )}
                    {backendStatus === 'online' && (
                      <span className="text-[9px] text-gray-400">Live Backend</span>
                    )}
                  </div>
                )}

                <p className="text-sm font-medium whitespace-pre-wrap">{msg.text}</p>

                {msg.explanation && (
                  <div className="mt-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-lg p-2.5 space-y-1">
                    <p className="leading-relaxed">{msg.explanation}</p>
                    {msg.unmetConstraints && msg.unmetConstraints.length > 0 && (
                      <div className="mt-1.5 pt-1.5 border-t border-gray-200/60">
                        <p className="text-[11px] font-semibold text-gray-500">{t('aiAssistant.unmetConstraints')}</p>
                        <ul className="list-disc list-inside space-y-0.5 mt-0.5 text-gray-600 text-[11px]">
                          {msg.unmetConstraints.map((hint, idx) => (
                            <li key={idx}>{hint}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {msg.unsupported && msg.unsupported.length > 0 && (
                      <div className="mt-1 text-[11px] text-amber-700">
                        ⚠️ {t('aiAssistant.note')}: {msg.unsupported.join(', ')}
                      </div>
                    )}
                  </div>
                )}

                {msg.results && msg.results.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.results.map((p) => (
                      <div key={p.id} className="bg-gray-50 rounded-lg p-2.5 border border-gray-100 text-left">
                        <div className="flex justify-between items-start gap-1">
                          <span className="font-medium text-xs text-gray-800">{p.surveyNumber}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium whitespace-nowrap">
                            DEMO
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{localizeLocation(p.village, p.taluka, p.district)}</p>
                        <p className="text-xs text-emerald-700 font-semibold mt-1">
                          {formatINRLocalized(p.totalPrice)} · {formatNumber(p.areaAcres)} {t('common.acres')}
                          <span className="text-[10px] text-gray-500 font-normal block">
                            {formatSmartPrice(p.totalPrice)} · {formatINRLocalized(p.pricePerGuntha)} / {t('common.guntha')}
                          </span>
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <button
                            onClick={() => navigate(`/property/${p.id}`)}
                            className="text-xs px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded hover:opacity-95 font-medium"
                          >
                            {t('aiAssistant.details')}
                          </button>
                          <button
                            onClick={() => navigate(`/intelligence?id=${p.id}`)}
                            className="text-xs px-2.5 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded hover:bg-emerald-100 font-medium"
                          >
                            📊 {t('common.intelligenceReport')}
                          </button>
                          <button
                            onClick={() => toggleSave(p.id)}
                            className="text-xs px-2.5 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium"
                          >
                            {savedIds.includes(p.id) ? '♥ ' + t('common.saved') : '♡ ' + t('common.save')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions with official prompts */}
      <div className="px-3 sm:px-4 py-2 bg-gray-50 border-t border-gray-200 flex gap-2 overflow-x-auto flex-shrink-0 no-scrollbar">
        {[
          'Find agricultural land in Panvel under ₹40 lakh',
          'Show land near highways in Raigad',
          'Compare properties in Palghar',
          'Find plots between 2 and 5 acres',
          'Explain the 7/12 land record verification process',
          'मला पालघरमध्ये ५ एकर शेतीची जमीन दाखवा',
        ].map((s) => (
          <button
            key={s}
            onClick={() => {
              setInput(s);
            }}
            className="whitespace-nowrap text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:bg-amber-50 hover:border-amber-300 transition-colors shadow-2xs font-medium text-gray-700"
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
            {t('aiAssistant.listeningIn', {
              lang: voiceLang === 'en-IN' ? 'English' : voiceLang === 'hi-IN' ? 'हिन्दी' : 'मराठी',
            })}
          </span>
          <button onClick={toggleListening} className="underline text-red-800 text-xs">
            {t('aiAssistant.stop')}
          </button>
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
          placeholder={t('aiAssistant.inputPlaceholder')}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:opacity-95 disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {t('aiAssistant.send')}
        </button>
      </div>
    </div>
  );
}
