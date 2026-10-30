import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { properties } from '../data/properties';
import { useSaved } from '../context/SavedPropertiesContext';
import { useLocalization } from '../utils/localization';

interface ActivityEvent {
  id: string;
  type: 'view' | 'save' | 'search' | 'filter';
  label: string;
  detail: string;
  timestamp: number;
}

const STORAGE_KEY = 'll_activity';

export function logActivity(event: Omit<ActivityEvent, 'id' | 'timestamp'>) {
  const stored: ActivityEvent[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  const newEvent: ActivityEvent = {
    ...event,
    id: `${Date.now()}-${Math.random()}`,
    timestamp: Date.now(),
  };
  const updated = [newEvent, ...stored].slice(0, 50); // keep last 50
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

const typeIcon: Record<ActivityEvent['type'], string> = {
  view: '👁',
  save: '♥',
  search: '🔍',
  filter: '⚙',
};
const typeLabel: Record<ActivityEvent['type'], string> = {
  view: 'Viewed',
  save: 'Saved',
  search: 'Searched',
  filter: 'Filtered',
};

function timeAgo(ts: number) {
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Activity() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const navigate = useNavigate();
  const { savedIds } = useSaved();
  const { formatDigits, formatINRLocalized, localizeDistrict, localizeTaluka, localizeVillage } = useLocalization();

  useEffect(() => {
    const stored: ActivityEvent[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    setEvents(stored);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setEvents([]);
  };

  const savedProperties = properties.filter((p) => savedIds.includes(p.id));

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Activity</h1>
          <p className="text-sm text-gray-500">Your recent interactions with demo data</p>
        </div>
        {events.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-xs text-red-500 hover:text-red-700 border border-red-200 rounded px-2 py-1"
          >
            Clear history
          </button>
        )}
      </div>

      {/* Saved count summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-3xl font-bold text-green-700">{formatDigits(savedIds.length)}</p>
          <p className="text-sm text-green-600 mt-1">Properties saved</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-3xl font-bold text-blue-700">{formatDigits(events.length)}</p>
          <p className="text-sm text-blue-600 mt-1">Actions recorded</p>
        </div>
      </div>

      {/* Saved properties quick list */}
      {savedProperties.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Saved Properties</h2>
          <div className="space-y-2">
            {savedProperties.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/property/${p.id}`)}
              >
                <span className="text-lg">🌾</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">{p.surveyNumber} · {localizeDistrict(p.district)}</p>
                  <p className="text-xs text-gray-500 truncate">{localizeTaluka(p.taluka)}, {localizeVillage(p.village)}</p>
                </div>
                <span className="text-xs text-green-700 font-medium">{formatINRLocalized(p.totalPrice)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity feed */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Recent activity</h2>
        {events.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-500 text-sm">No activity recorded yet.</p>
            <p className="text-gray-400 text-xs mt-1">Browse properties on the Explore page to see your history here.</p>
            <button
              onClick={() => navigate('/explore')}
              className="mt-4 px-4 py-2 bg-green-700 text-white rounded-lg text-sm hover:bg-green-800"
            >
              Go to Explore
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {events.map((ev) => (
              <div key={ev.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2.5">
                <span className="text-lg w-7 text-center">{typeIcon[ev.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800"><span className="font-medium">{typeLabel[ev.type]}</span> · {ev.label}</p>
                  {ev.detail && <p className="text-xs text-gray-400 truncate">{ev.detail}</p>}
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo(ev.timestamp)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">Activity is stored locally in your browser only.</p>
    </div>
  );
}
