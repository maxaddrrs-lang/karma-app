import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LEADERBOARD_DATA } from '../data/leaderboard';
import type { LeaderboardUser } from '../data/leaderboard';


// --- Icons ---
const BackIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
const GoldMedal = () => <div className="text-3xl">🥇</div>
const SilverMedal = () => <div className="text-3xl">🥈</div>
const BronzeMedal = () => <div className="text-3xl">🥉</div>
const PointsIcon = () => <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 5a3 3 0 015.292-2.121C11.16 1.89 12 2.857 12 4c0 1.143-.84 2.11-1.708 3.121A3 3 0 015 9c-1.657 0-3-1.343-3-3s1.343-3 3-3zm10 0a3 3 0 015.292-2.121C21.16 1.89 22 2.857 22 4c0 1.143-.84 2.11-1.708 3.121A3 3 0 0115 9c-1.657 0-3-1.343-3-3s1.343-3 3-3zm-5 7a3 3 0 015.292-2.121C16.16 8.89 17 9.857 17 11c0 1.143-.84 2.11-1.708 3.121A3 3 0 0110 16c-1.657 0-3-1.343-3-3s1.343-3 3-3z" clipRule="evenodd" /></svg>


// --- Components ---
const TopPlayerCard: React.FC<{ user: LeaderboardUser; rank: number }> = ({ user, rank }) => {
    const rankColors = [
        'border-yellow-400 bg-yellow-50', // 1st
        'border-gray-400 bg-gray-50', // 2nd
        'border-orange-400 bg-orange-50', // 3rd
    ];
    const rankIcons = [<GoldMedal key="1" />, <SilverMedal key="2" />, <BronzeMedal key="3" />];

    return (
        <div className={`text-center p-4 rounded-2xl border-2 ${rankColors[rank-1]}`}>
            <div className="relative inline-block">
                <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-lg" />
                <div className="absolute -bottom-2 -left-2">{rankIcons[rank-1]}</div>
            </div>
            <h3 className="mt-3 font-bold text-gray-800">{user.name}</h3>
            <p className="text-sm text-yellow-600 font-semibold">{user.score} امتیاز</p>
        </div>
    );
};

const PlayerRow: React.FC<{ user: LeaderboardUser; rank: number, isCurrentUser: boolean }> = ({ user, rank, isCurrentUser }) => (
    <div className={`flex items-center p-3 rounded-lg ${isCurrentUser ? 'bg-emerald-100' : 'bg-white'}`}>
        <div className="w-8 text-center text-lg font-bold text-gray-500">{rank}</div>
        <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full mx-4" />
        <div className="flex-grow">
            <p className={`font-bold ${isCurrentUser ? 'text-emerald-800' : 'text-gray-800'}`}>{user.name}</p>
        </div>
        <div className="flex items-center font-semibold text-yellow-600">
            <span>{user.score}</span>
            <PointsIcon />
        </div>
    </div>
);


// --- Page ---
const LeaderboardPage: React.FC = () => {
    const { userIdentifier, impactScore } = useAuth();
    const navigate = useNavigate();

    const currentUser: LeaderboardUser = {
        id: userIdentifier || 'currentUser',
        name: 'شما',
        avatarUrl: `https://i.pravatar.cc/150?u=${userIdentifier}`,
        score: impactScore,
    };

    const allUsers = [...LEADERBOARD_DATA, currentUser]
        .filter((u, index, self) => index === self.findIndex(t => t.id === u.id)) // Ensure unique users
        .sort((a, b) => b.score - a.score);
    
    const currentUserRank = allUsers.findIndex(u => u.id === currentUser.id) + 1;
    
    const topThree = allUsers.slice(0, 3);
    const restOfPlayers = allUsers.slice(3);

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            <header className="sticky top-0 bg-white z-10 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="text-gray-600 p-2">
                        <BackIcon />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">تابلوی امتیازات</h1>
                    <div className="w-10"></div> {/* Spacer */}
                </div>
            </header>
            
            <main className="container mx-auto p-4">
                {/* Top 3 Players */}
                <section className="grid grid-cols-3 gap-4 mb-8">
                    {topThree[1] && <TopPlayerCard user={topThree[1]} rank={2} />}
                    {topThree[0] && <TopPlayerCard user={topThree[0]} rank={1} />}
                    {topThree[2] && <TopPlayerCard user={topThree[2]} rank={3} />}
                </section>

                {/* Rest of the list */}
                <section className="space-y-2">
                    {restOfPlayers.map((user, index) => (
                         <PlayerRow 
                            key={user.id}
                            user={user} 
                            rank={index + 4}
                            isCurrentUser={user.id === currentUser.id}
                        />
                    ))}
                </section>
            </main>
            
            {/* Sticky Current User Rank */}
            <footer className="fixed bottom-20 left-0 right-0 p-4 z-20">
                 <div className="container mx-auto">
                    <div className="bg-white rounded-xl shadow-lg border border-emerald-300">
                        <PlayerRow user={currentUser} rank={currentUserRank} isCurrentUser={true} />
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default LeaderboardPage;