import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../context/SettingsContext';
import type { League } from '../constants';
import type { User as AdminUser } from '../data/users';
import type { Transaction } from '../types';

// --- Icons ---
const BackIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const CoinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const GiftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>;


// --- Helper Functions ---
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

interface UserWithWeeklyScore extends AdminUser {
    weeklyCoins: number;
}

const formatTimeLeft = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${days} روز و ${hours} ساعت و ${minutes} دقیقه`;
};

// --- Page Component ---
const LeaguesPage: React.FC = () => {
    const { userIdentifier, transactions } = useAuth();
    const { leagues } = useSettings();
    const navigate = useNavigate();
    const [allUsersData, setAllUsersData] = useState<UserWithWeeklyScore[]>([]);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const startOfWeek = getStartOfWeek();
        
        // Fetch and process all users' data
        try {
            const usersJSON = localStorage.getItem('karma_users');
            const allUsers: AdminUser[] = usersJSON ? JSON.parse(usersJSON) : [];

            const usersWithScores = allUsers.map(user => {
                const txJSON = localStorage.getItem(`transactions_${user.identifier}`);
                const userTransactions: Transaction[] = txJSON ? JSON.parse(txJSON) : [];
                const weeklyCoins = calculateWeeklyCoins(userTransactions, startOfWeek);
                return { ...user, weeklyCoins };
            }).sort((a, b) => b.weeklyCoins - a.weeklyCoins);

            setAllUsersData(usersWithScores);
        } catch (error) {
            console.error("Error fetching user data for leagues:", error);
        }

        // Countdown timer
        const updateTimer = () => {
             const now = new Date();
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 7);
            const msLeft = endOfWeek.getTime() - now.getTime();
            if (msLeft > 0) {
                setTimeLeft(formatTimeLeft(msLeft));
            } else {
                setTimeLeft('هفته به پایان رسید!');
                 // Potentially reset leagues here or trigger a data refresh
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000 * 60); // Update every minute

        return () => clearInterval(interval);
    }, []);

    const { currentUserLeague, currentUserWeeklyCoins, progressToNextLeague } = useMemo(() => {
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
                    progress = (achieved / range) * 100;
                } else {
                    progress = 100; // Diamond league
                }
                break;
            }
        }

        return { currentUserLeague: league, currentUserWeeklyCoins: weeklyCoins, progressToNextLeague: progress };
    }, [transactions, leagues]);
    
    const usersByLeague = useMemo(() => {
        const grouped: Record<string, UserWithWeeklyScore[]> = {};
        leagues.forEach(league => {
            grouped[league.name] = allUsersData.filter(user => user.weeklyCoins >= league.minCoins && user.weeklyCoins <= league.maxCoins);
        });
        return grouped;
    }, [allUsersData, leagues]);

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            <header className="sticky top-0 bg-white/80 backdrop-blur-md z-10 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="w-10"></div>
                    <h1 className="text-xl font-bold text-gray-800">لیگ‌ها و جوایز ماهانه</h1>
                    <button onClick={() => navigate(-1)} className="text-gray-600 p-2">
                        <BackIcon />
                    </button>
                </div>
            </header>

            <main className="container mx-auto p-4 space-y-8">
                {/* User's Current League Status */}
                <section className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">وضعیت شما در این هفته</h2>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <p className="text-sm text-gray-500">لیگ فعلی شما</p>
                            <p className={`text-3xl font-extrabold ${currentUserLeague?.textColor}`}>{currentUserLeague?.name || '---'}</p>
                        </div>
                        <div className="flex items-center text-lg font-bold">
                            <CoinIcon />
                            <span className="mr-1">{currentUserWeeklyCoins} سکه</span>
                        </div>
                    </div>
                    {currentUserLeague && currentUserLeague.maxCoins !== Infinity && (
                        <div className="mt-4">
                            <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                                <span>پیشرفت تا لیگ بعدی</span>
                                <span>{Math.round(progressToNextLeague)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2.5 rounded-full" style={{ width: `${progressToNextLeague}%` }}></div>
                            </div>
                        </div>
                    )}
                    <div className="mt-4 text-center bg-gray-100 p-2 rounded-lg text-sm font-semibold text-gray-700 flex items-center justify-center">
                       <ClockIcon/> زمان باقی مانده: {timeLeft}
                    </div>
                </section>
                
                {/* League Tiers */}
                <section className="space-y-6">
                    {leagues.map(league => {
                        const isCurrentUserLeague = league.name === currentUserLeague?.name;
                        const leagueUsers = usersByLeague[league.name] || [];
                        return (
                            <div key={league.name} className={`rounded-2xl shadow-md border-2 p-6 transition-all ${isCurrentUserLeague ? 'border-emerald-500 bg-emerald-50' : 'bg-white border-transparent'}`}>
                                <div className="flex items-center gap-4">
                                    <span className={`text-4xl ${league.iconColor}`}>{league.icon}</span>
                                    <div>
                                        <h3 className={`text-2xl font-bold ${league.textColor}`}>لیگ {league.name}</h3>
                                        <p className="text-sm text-gray-600">{league.minCoins} تا {league.maxCoins === Infinity ? 'بیشتر' : league.maxCoins} سکه در هفته</p>
                                    </div>
                                </div>
                                <div className="mt-4 bg-white/70 p-3 rounded-lg flex items-center">
                                    <GiftIcon/>
                                    <p className="font-semibold text-gray-800">{league.prizeDescription}</p>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">برترین‌های این لیگ:</p>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        {leagueUsers.slice(0, 5).map(user => (
                                            <img
                                                key={user.id}
                                                src={`https://i.pravatar.cc/150?u=${user.identifier}`}
                                                alt={user.identifier}
                                                title={`${user.identifier.split('@')[0]} (${user.weeklyCoins} سکه)`}
                                                className="w-10 h-10 rounded-full border-2 border-white shadow"
                                            />
                                        ))}
                                        {leagueUsers.length > 5 && (
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                +{leagueUsers.length - 5}
                                            </div>
                                        )}
                                        {leagueUsers.length === 0 && <p className="text-xs text-gray-500">هنوز کسی در این لیگ قرار نگرفته است.</p>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </section>

            </main>
        </div>
    );
};

export default LeaguesPage;