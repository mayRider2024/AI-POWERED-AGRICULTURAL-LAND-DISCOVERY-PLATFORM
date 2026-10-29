import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/explore', icon: '🗺', label: 'Explore' },
  { to: '/saved', icon: '♥', label: 'Saved' },
  { to: '/assistant', icon: '🤖', label: 'AI Assistant' },
  { to: '/activity', icon: '📋', label: 'Activity' },
  { to: '/profile', icon: '👤', label: 'Profile' },
  { to: '/admin', icon: '⚙', label: 'Admin' },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm">
      {/* Brand header */}
      <div className="px-4 py-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <div>
            <p className="font-bold text-green-700 text-sm leading-tight">LandLens AI</p>
            <p className="text-gray-400 text-xs leading-tight">Raigad · Palghar</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col px-2 py-3 gap-0.5 flex-1">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors ${
                isActive
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            <span className="text-base w-5 text-center">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer note */}
      <div className="px-4 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-400">Demo MVP · Data is fictional</p>
      </div>
    </aside>
  );
}
