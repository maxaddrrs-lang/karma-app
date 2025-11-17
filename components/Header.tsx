import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';

// --- Icons ---
const CoinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
    </svg>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);


const Header: React.FC = () => {
  const { isAuthenticated, userIdentifier, logout, karmaCoins, isAdmin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/'); // Redirect to home page after logout
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md z-30 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 h-[70px] flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold text-emerald-500">
          {t('home.karma')}
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={({isActive}) => `font-semibold transition-colors ${isActive ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-500'}`}>{t('header.home')}</NavLink>
            <NavLink to="/campaigns" className={({isActive}) => `font-semibold transition-colors ${isActive ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-500'}`}>{t('header.campaigns')}</NavLink>
            <NavLink to="/karma-club" className={({isActive}) => `font-semibold transition-colors ${isActive ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-500'}`}>{t('header.karmaClub')}</NavLink>
            {isAdmin && <NavLink to="/admin" className="font-semibold text-red-600 hover:text-red-700 transition-colors">{t('header.adminPanel')}</NavLink>}
        </nav>

        {/* User/Auth section */}
        <div className="flex items-center gap-4">
          <NavLink to="/create-options" className="hidden sm:flex items-center gap-2 bg-amber-500 text-white font-bold py-2 px-4 rounded-full hover:bg-amber-600 transition-colors shadow-md">
            <PlusIcon/>
            <span>{t('header.createCampaign')}</span>
          </NavLink>
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <img src={`https://i.pravatar.cc/150?u=${userIdentifier}`} alt="user avatar" className="w-8 h-8 rounded-full"/>
                <div className="hidden sm:flex items-center gap-1 font-semibold text-yellow-700">
                    <CoinIcon />
                    <span>{karmaCoins}</span>
                </div>
                <ChevronDownIcon className="w-5 h-5 text-gray-500 hidden sm:block" />
              </button>
              {isUserMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border z-40 py-2 animate-fadeInUp">
                  <div className="px-4 py-2 border-b">
                    <p className="font-semibold text-gray-800 truncate">{userIdentifier}</p>
                  </div>
                  <NavLink to="/profile" onClick={() => setIsUserMenuOpen(false)} className="block w-full text-right px-4 py-2 text-gray-700 hover:bg-gray-100">{t('header.userProfile')}</NavLink>
                  <NavLink to="/creator/login" onClick={() => setIsUserMenuOpen(false)} className="block w-full text-right px-4 py-2 text-gray-700 hover:bg-gray-100">پنل برگزارکننده</NavLink>
                  {isAdmin && <NavLink to="/admin" onClick={() => setIsUserMenuOpen(false)} className="block w-full text-right px-4 py-2 text-red-600 hover:bg-red-50">{t('header.adminPanel')}</NavLink>}
                  <button onClick={handleLogout} className="block w-full text-right px-4 py-2 text-gray-700 hover:bg-gray-100">{t('header.logout')}</button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
              {t('header.login')}
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;