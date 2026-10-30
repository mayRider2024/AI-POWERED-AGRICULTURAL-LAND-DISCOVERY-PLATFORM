import { NavLink } from 'react-router-dom';
import { Home, Compass, Bookmark, Sparkles, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function BottomNav() {
  const { t } = useTranslation();

  const navItems = [
    { to: '/home', icon: Home, label: t('nav.home') },
    { to: '/explore', icon: Compass, label: t('nav.explore') },
    { to: '/saved', icon: Bookmark, label: t('nav.saved') },
    { to: '/assistant', icon: Sparkles, label: t('nav.aiSearch') },
    { to: '/profile', icon: User, label: t('nav.profile') },
  ];

  return (
    <nav className="bg-[#FFFDFB] border-t border-[#F2DCC4] flex justify-around items-center px-2 py-2 safe-area-bottom flex-shrink-0 z-40 shadow-[0_-2px_12px_rgba(232,106,23,0.06)] select-none">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 rounded-xl no-underline transition-all active:scale-95 ${
              isActive
                ? 'text-[#C54E12]'
                : 'text-stone-400 hover:text-stone-700'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`w-9 h-7 rounded-lg flex items-center justify-center mb-0.5 transition-all ${
                  isActive ? 'bg-[#FFE8D1] text-[#E86A17]' : 'bg-transparent text-stone-400'
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.4 : 1.75}
                  className={isActive ? 'text-[#E86A17]' : 'text-stone-400'}
                />
              </div>
              <span
                className={`text-[11px] tracking-tight leading-none ${
                  isActive ? 'font-bold text-[#C54E12]' : 'font-medium text-stone-500'
                }`}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

