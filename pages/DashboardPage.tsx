import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCampaigns } from '../hooks/useCampaigns';
import CampaignCard from '../components/CampaignCard';
import { useSettings } from '../context/SettingsContext';
import { getCategoryIcon } from '../components/CategoryIcons';
import { useAuth } from '../hooks/useAuth';
import type { Transaction } from '../types';
import type { League } from '../constants';
import { useLanguage } from '../hooks/useLanguage';


// Icons
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;


// --- Helper Functions for Leagues ---
const getStartOfWeek = () => {
    const now = new Date();
    // Assuming week starts on Saturday (day 6 in JS)
    const currentDay = now.getDay();
    const distanceToSaturday = (currentDay + 1) % 7;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - distanceToSaturday);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
};

const calculateWeeklyCoins = (transactions: Transaction[], startOfWeek: Date): number => {
    return transactions
        .filter(tx => tx.type === 'earn' && new Date(tx.date) >= startOfWeek)
        .reduce((sum, tx) => sum + tx.amount, 0);
};

const DashboardPage: React.FC = () => {
    const { campaigns } = useCampaigns();
    const { categories, isLeaguesEnabled } = useSettings();
    const { contributionValue, transactions } = useAuth();
    const { leagues } = useSettings();
    const { t, formatNumber } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const activeCampaigns = campaigns.filter(c => c.status === 'active');

    const featuredCampaign = activeCampaigns.length > 1 ? activeCampaigns[1] : (activeCampaigns.length > 0 ? activeCampaigns[0] : null);
    const suggestedCampaigns = activeCampaigns.slice(0, 4);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/campaigns?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };
    
    const { currentUserLeague, currentUserWeeklyCoins, progressToNextLeague } = useMemo(() => {
        if (!isLeaguesEnabled) return { currentUserLeague: undefined, currentUserWeeklyCoins: 0, progressToNextLeague: 0 };
        
        const startOfWeek = getStartOfWeek();
        const weeklyCoins = calculateWeeklyCoins(transactions, startOfWeek);
        
        let league: League | undefined;
        let progress = 0;

        for (let i = 0; i < leagues.length; i++) {
            if (weeklyCoins >= leagues[i].minCoins && weeklyCoins <= leagues[i].maxCoins) {
                league = leagues[i];
                const nextLeague = leagues[i + 1];
                if (nextLeague) {
                    const range = nextLeague.minCoins - league.minCoins;
                    const achieved = weeklyCoins - league.minCoins;
                    progress = range > 0 ? (achieved / range) * 100 : 100;
                } else {
                    progress = 100; // Diamond league
                }
                break;
            }
        }

        return { currentUserLeague: league, currentUserWeeklyCoins: weeklyCoins, progressToNextLeague: progress };
    }, [transactions, leagues, isLeaguesEnabled]);


    return (
        <div className="bg-gray-50">
            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center text-center">
                        <p className="text-sm opacity-80 font-medium">{t('dashboard.contributionValue')}</p>
                        <p className="text-3xl font-bold mt-2">{formatNumber(Math.round(contributionValue))} <span className="text-lg font-normal">{t('dashboard.toman')}</span></p>
                    </div>
                     <Link to="/donation-balance" className="bg-white p-6 rounded-2xl shadow-md flex flex-col justify-center items-center hover:bg-gray-100 transition-colors border border-gray-200/80 text-center">
                        <p className="text-sm text-gray-500">{t('dashboard.viewTransactions')}</p>
                        <p className="text-2xl font-bold text-gray-800 mt-2">{t('dashboard.history')}</p>
                    </Link>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder={t('dashboard.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white rounded-full py-3 ps-12 pe-4 shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400" 
                        />
                         <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-1" aria-label={t('dashboard.searchLabel')}>
                            <SearchIcon/>
                        </button>
                    </div>
                </form>
                
                 {/* Leagues Section */}
                {isLeaguesEnabled && currentUserLeague && (
                    <Link to="/leagues" className="block bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-200/80">
                        <section>
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-800">{t('dashboard.weeklyLeague')}</h3>
                                <span className="text-sm font-medium text-emerald-600 hover:text-emerald-700">{t('dashboard.viewLeagues')}</span>
                            </div>
                            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-xl">
                                <div>
                                    <p className="text-sm text-gray-500">{t('dashboard.currentLeague')}</p>
                                    <p className={`text-2xl font-extrabold flex items-center gap-2 ${currentUserLeague.textColor}`}>
                                        <span className={`text-2xl ${currentUserLeague.iconColor}`}>{currentUserLeague.icon}</span>
                                        {currentUserLeague.name}
                                    </p>
                                </div>
                                <div className="flex items-center text-lg font-bold">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                                    <span className="mr-1">{t('dashboard.weeklyCoins', { count: currentUserWeeklyCoins })}</span>
                                </div>
                            </div>
                             {currentUserLeague && currentUserLeague.maxCoins !== Infinity && (
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                                        <span>{t('dashboard.progressToNext')}</span>
                                        <span>{Math.round(progressToNextLeague)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2.5 rounded-full" style={{ width: `${progressToNextLeague}%` }}></div>
                                    </div>
                                </div>
                            )}
                        </section>
                    </Link>
                )}
                
                {/* Featured Campaign */}
                {featuredCampaign && (
                <section>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{t('dashboard.featuredMission')}</h3>
                    <CampaignCard campaign={featuredCampaign} />
                </section>
                )}


                {/* Categories */}
                <section>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{t('dashboard.categories')}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {categories.slice(0, 4).map(category => (
                            <Link key={category.name} to={`/campaigns?category=${encodeURIComponent(category.name)}`} className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200/80 text-center flex flex-col items-center justify-center space-y-2">
                                <span className="text-emerald-500">{getCategoryIcon(category.name, "h-8 w-8")}</span>
                                <span className="font-semibold text-gray-700">{t(`categories_list.${category.name}`)}</span>
                            </Link>
                        ))}
                    </div>
                </section>


                {/* Suggested Missions */}
                {suggestedCampaigns.length > 0 && (
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">{t('dashboard.suggestedMissions')}</h3>
                        <Link to="/campaigns" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">{t('dashboard.viewAll')}</Link>
                    </div>
                    <div className="flex overflow-x-auto space-x-4 pb-4">
                        {suggestedCampaigns.map(campaign => (
                            <CampaignCard key={campaign.id} campaign={campaign} variant="suggested"/>
                        ))}
                    </div>
                </section>
                )}
            </main>
        </div>
    );
};

export default DashboardPage;