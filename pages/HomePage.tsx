import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DashboardPage from './DashboardPage';
import { useLanguage } from '../hooks/useLanguage';

const WelcomePage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="relative bg-gray-50 flex flex-col items-center justify-center text-center py-20 px-4 min-h-[calc(100vh-70px)] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10" 
        style={{backgroundImage: 'url(https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1200&auto=format&fit=crop)'}}
      ></div>
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight animate-fadeInUp" style={{animationDelay: '100ms'}}>
          {t('home.welcome', { platformName: '' })}<span className="text-emerald-500">{t('home.karma')}</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fadeInUp" style={{animationDelay: '300ms'}}>
          {t('home.subtitle')}
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fadeInUp" style={{animationDelay: '500ms'}}>
          <Link
            to="/create-options"
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-xl"
          >
            {t('home.createCampaign')}
          </Link>
          <Link
            to="/campaigns"
            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg border-2 border-gray-300"
          >
            {t('home.joinCampaign')}
          </Link>
        </div>
      </div>
    </div>
  );
}

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <DashboardPage /> : <WelcomePage />;
};

export default HomePage;