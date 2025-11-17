import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

// Icon components
const HomeIcon = ({ isActive }: { isActive: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-all ${isActive ? 'text-emerald-600' : 'text-gray-500'}`} fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        {isActive && <circle cx="12" cy="18" r="2.5" fill="currentColor" className="text-emerald-600"/>}
    </svg>
);
const MissionsIcon = ({ isActive }: { isActive: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
);
const KarmaClubIcon = ({ isActive }: { isActive: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 16l-4-4 6.293-6.293a1 1 0 011.414 0z" />
    </svg>
);
const ProfileIcon = ({ isActive }: { isActive: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const NewsIcon = ({ isActive }: { isActive: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-7 8h12a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);


const NavItem: React.FC<{ to: string; label: string; icon: React.FC<{ isActive: boolean }> }> = ({ to, label, icon: Icon }) => {
    return (
        <NavLink
            to={to}
            end
            className={({ isActive }) =>
                `flex flex-col items-center justify-center space-y-1 transition-all w-full pt-2 pb-1 rounded-lg ${
                isActive ? 'text-emerald-600 bg-emerald-100/80' : 'text-gray-500 hover:text-emerald-500 hover:bg-gray-100'
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <Icon isActive={isActive} />
                    <span className={`text-xs font-medium transition-all ${isActive ? 'font-bold' : ''}`}>{label}</span>
                </>
            )}
        </NavLink>
    );
};

const BottomNav: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useLanguage();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScrollOrResize = () => {
        const isMobile = window.innerWidth < 768; // md breakpoint
        if (!isMobile) {
            setIsVisible(true);
            return;
        }

        const currentScrollY = window.scrollY;
        // Hide on scroll down, but only after a certain point to avoid hiding on small scrolls
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setIsVisible(false);
        } else {
            // Show on scroll up
            setIsVisible(true);
        }
        lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, []);

  return (
    <nav className={`fixed bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around items-center z-50 rounded-t-2xl transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : 'translate-y-full'} p-2 gap-1`}>
        <NavItem to="/" label={t('bottomNav.home')} icon={HomeIcon} />
        <NavItem to="/campaigns" label={t('bottomNav.missions')} icon={MissionsIcon} />
        <NavItem to="/news" label={t('bottomNav.news')} icon={NewsIcon} />
        <NavItem to="/karma-club" label={t('bottomNav.karmaClub')} icon={KarmaClubIcon} />
        <NavItem to="/profile" label={t('bottomNav.profile')} icon={ProfileIcon} />
    </nav>
  );
};

export default BottomNav;
