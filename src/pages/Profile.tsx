import { useState } from 'react';

const DEMO_PREFS_KEY = 'll_prefs';

function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_PREFS_KEY) ?? '{}') as Record<string, string>;
  } catch {
    return {};
  }
}

export default function Profile() {
  const [prefs, setPrefs] = useState(loadPrefs);
  const [saved, setSaved] = useState(false);

  const update = (key: string, value: string) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const save = () => {
    localStorage.setItem(DEMO_PREFS_KEY, JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-3xl">
          {prefs.avatar || '👤'}
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800">{prefs.name || 'Demo User'}</h1>
          <p className="text-sm text-gray-500">{prefs.role || 'Land Seeker'}</p>
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium mt-1 inline-block">
            DEMO PROFILE — No real auth
          </span>
        </div>
      </div>

      {/* Preferences form */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-700 text-sm">Demo Preferences</h2>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Display name</label>
          <input
            type="text"
            value={prefs.name ?? ''}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Your name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
          <select
            value={prefs.role ?? ''}
            onChange={(e) => update('role', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
          >
            <option value="">Select role…</option>
            <option>Land Seeker</option>
            <option>Farmer</option>
            <option>Investor</option>
            <option>Agent</option>
            <option>Researcher</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Preferred district</label>
          <select
            value={prefs.district ?? ''}
            onChange={(e) => update('district', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
          >
            <option value="">Any district</option>
            <option>Raigad</option>
            <option>Palghar</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Budget range (₹)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={prefs.budgetMin ?? ''}
              onChange={(e) => update('budgetMin', e.target.value)}
              placeholder="Min"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
            />
            <input
              type="number"
              value={prefs.budgetMax ?? ''}
              onChange={(e) => update('budgetMax', e.target.value)}
              placeholder="Max"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        <button
          onClick={save}
          className="w-full py-2 bg-green-700 text-white rounded-lg font-medium text-sm hover:bg-green-800 transition-colors"
        >
          {saved ? '✓ Saved to browser' : 'Save preferences'}
        </button>
        <p className="text-xs text-gray-400 text-center">Preferences are stored locally in your browser only.</p>
      </div>

      {/* Feature Navigation Shortcuts */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
        <h2 className="font-semibold text-gray-700 text-sm">Platform Tools</h2>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <a
            href="/records"
            className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-100 font-medium text-gray-800"
          >
            <span>📜</span> Land Records (7/12)
          </a>
          <a
            href="/intelligence"
            className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-100 font-medium text-gray-800"
          >
            <span>📊</span> Intelligence Report
          </a>
          <a
            href="/compare"
            className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-100 font-medium text-gray-800"
          >
            <span>⚖️</span> Compare Lands
          </a>
          <a
            href="/broker"
            className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-100 font-medium text-gray-800"
          >
            <span>🤝</span> Broker Portal
          </a>
        </div>
      </div>

      {/* About section */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <h3 className="font-semibold text-blue-800 text-sm mb-1">About LandLens AI</h3>
        <p className="text-xs text-blue-700 leading-relaxed">
          This is a demonstration MVP for an agricultural land discovery platform covering Raigad and Palghar districts.
          All property listings are fictional and unverified. For official land records, visit{' '}
          <a
            href="https://bhulekh.mahabhumi.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium"
          >
            bhulekh.mahabhumi.gov.in
          </a>.
        </p>
      </div>
    </div>
  );
}
