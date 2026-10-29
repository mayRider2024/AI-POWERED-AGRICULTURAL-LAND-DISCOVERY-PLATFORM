import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/explore', icon: '🗺', label: 'Explore' },
  { to: '/saved', icon: '♥', label: 'Saved' },
  { to: '/assistant', icon: '🤖', label: 'AI' },
  { to: '/activity', icon: '📋', label: 'Activity' },
  { to: '/profile', icon: '👤', label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav className="bg-white border-t border-gray-200 flex justify-around items-center py-1.5 px-2 safe-area-bottom flex-shrink-0 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] select-none">
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-lg no-underline transition-colors ${
              isActive ? 'text-green-700 font-semibold' : 'text-gray-500 hover:text-gray-800'
            }`
          }
        >
          <span className="text-xl leading-none mb-1">{icon}</span>
          <span className="text-[11px] leading-tight tracking-tight">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
