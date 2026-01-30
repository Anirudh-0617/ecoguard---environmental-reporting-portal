
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { getCurrentUser, logoutUser, isOfficial, isAuthenticated } from '../../utils/auth';

const NavigationBar: React.FC = () => {
  const { language, changeLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const loggedIn = isAuthenticated();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const navItems = isOfficial()
    ? [
      { name: 'Dashboard', path: '/official/dashboard' },
      { name: 'Analytics', path: '/official/analytics' },
    ]
    : loggedIn
      ? [
        { name: 'Dashboard', path: '/' },
        { name: t('reportButton'), path: '/report' },
        { name: t('trackButton'), path: '/track' },
        { name: 'Resources', path: '/resources' },
      ]
      : [
        { name: 'Home', path: '/' },
        { name: 'Resources', path: '/resources' },
      ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 text-emerald-600 font-bold text-xl">
              <Leaf className="w-8 h-8" />
              <span>EcoGuard</span>
            </Link>
            <div className="hidden lg:flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Powered by Gemini AI</span>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${isActive(item.path)
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-emerald-500'
                  } px-1 py-2 text-sm font-medium transition-colors`}
              >
                {item.name}
              </Link>
            ))}

            <div className="flex items-center ml-4 border-l border-gray-100 pl-4">
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value as any)}
                className="bg-transparent border-none text-gray-600 text-sm font-medium focus:ring-0 cursor-pointer"
              >
                <option value="english">EN</option>
                <option value="hindi">हिन्दी</option>
                <option value="telugu">తెలుగు</option>
              </select>
            </div>

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold capitalize">{user.type}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 hover:bg-red-500 hover:text-white p-2 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-emerald-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-3 rounded-xl text-base font-medium ${isActive(item.path) ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-4 border-t mt-4 flex items-center justify-between px-3">
              <span className="text-sm font-bold text-gray-400">Language</span>
              <div className="flex gap-4">
                <button onClick={() => { changeLanguage('english'); setIsOpen(false); }} className={`text-sm font-bold ${language === 'english' ? 'text-emerald-600' : 'text-gray-400'}`}>EN</button>
                <button onClick={() => { changeLanguage('hindi'); setIsOpen(false); }} className={`text-sm font-bold ${language === 'hindi' ? 'text-emerald-600' : 'text-gray-400'}`}>हिन्दी</button>
                <button onClick={() => { changeLanguage('telugu'); setIsOpen(false); }} className={`text-sm font-bold ${language === 'telugu' ? 'text-emerald-600' : 'text-gray-400'}`}>తెలుగు</button>
              </div>
            </div>

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-4 text-red-600 font-bold border-t mt-4 flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-4 text-emerald-600 font-bold border-t mt-4"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
