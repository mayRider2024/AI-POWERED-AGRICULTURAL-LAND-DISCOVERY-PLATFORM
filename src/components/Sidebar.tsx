import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalization } from '../utils/localization';

export default function Sidebar() {
  const { t } = useTranslation();
  const { localizeDistrict } = useLocalization();

  const navItems = [
    { to: '/home', icon: '🏠', label: t('nav.home') },
    { to: '/explore', icon: '🗺️', label: t('nav.explore') },
    { to: '/saved', icon: '♥', label: t('nav.saved') },
    { to: '/assistant', icon: '🤖', label: t('nav.aiAssistant') },
    { to: '/records', icon: '📜', label: t('nav.landRecords') },
    { to: '/intelligence', icon: '📊', label: t('nav.intelligence') },
    { to: '/compare', icon: '⚖️', label: t('nav.compare') },
    { to: '/broker', icon: '🤝', label: t('nav.brokerPortal') },
    { to: '/activity', icon: '📋', label: t('nav.activity') },
    { to: '/profile', icon: '👤', label: t('nav.profile') },
    { to: '/admin', icon: '⚙', label: t('nav.admin') },
  ];

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm">
      {/* Brand header */}
      <div className="px-4 py-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <div>
            <p className="font-bold text-green-700 text-sm leading-tight">LandLens AI</p>
            <p className="text-gray-400 text-xs leading-tight">
              {localizeDistrict('Raigad')} · {localizeDistrict('Palghar')}
            </p>
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
        <p className="text-xs text-gray-400">{t('disclaimer.shortNote')}</p>
      </div>
    </aside>
  );
}
