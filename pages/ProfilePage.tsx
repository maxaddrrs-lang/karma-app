import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCampaigns } from '../hooks/useCampaigns';
import { useNotifications } from '../context/NotificationsContext';
import { useLanguage } from '../hooks/useLanguage';
import CampaignCard from '../components/CampaignCard';

// Icons
const CoinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>;
const ImpactIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-300 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);
const LeaguesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const SupportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const AboutUsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PartnersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const LeaderboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;


const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/80">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        {children}
    </section>
);

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-center space-x-3 space-x-reverse">
        {icon}
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const InfoLink: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => (
    <Link to={to} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 transition-colors">
        <div className="flex items-center gap-4">
            {icon}
            <span className="font-semibold text-gray-800">{label}</span>
        </div>
        <ChevronLeftIcon />
    </Link>
);


const ProfilePage: React.FC = () => {
    const { logout, karmaCoins, impactScore, userIdentifier, redeemedCodes } = useAuth();
    const { taskCompletions, campaigns } = useCampaigns();
    const { personalNotifications } = useNotifications();
    const { t, formatRelativeTime } = useLanguage();
    const navigate = useNavigate();
    const [isActivitiesOpen, setIsActivitiesOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    const userActivities = useMemo(() => 
        taskCompletions
            .filter(tc => tc.userId === userIdentifier)
            .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
            .slice(0, 5)
    , [taskCompletions, userIdentifier]);

    const completedCampaignsUserParticipatedIn = useMemo(() => {
        const participatedCampaignIds = new Set(
            taskCompletions
                .filter(tc => tc.userId === userIdentifier)
                .map(tc => tc.campaignId)
        );

        return campaigns.filter(campaign => 
            campaign.status === 'completed' && 
            participatedCampaignIds.has(campaign.id)
        );
    }, [campaigns, taskCompletions, userIdentifier]);
    
    const sortedPersonalNotifications = useMemo(() => 
        [...personalNotifications].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    , [personalNotifications]);


    return (
        <div className="bg-gray-100 min-h-screen p-4 pb-24 space-y-6">
            {/* User Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4 space-x-reverse">
                    <img src={`https://i.pravatar.cc/150?u=${userIdentifier}`} alt="Profile" className="w-16 h-16 rounded-full border-2 border-white shadow-md" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 capitalize">{userIdentifier?.split('@')[0] || "کاربر"}</h1>
                        <p className="text-sm text-gray-500">{userIdentifier}</p>
                    </div>
                </div>
                 <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors" aria-label="خروج">
                    <LogoutIcon />
                </button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 gap-4">
                <StatCard icon={<CoinIcon />} label="سکه کارما" value={karmaCoins} />
                <StatCard icon={<ImpactIcon />} label="امتیاز تاثیر" value={impactScore} />
            </div>
            
            {/* Recent Activities */}
            <section className="bg-white rounded-2xl shadow-md border border-gray-200/80 overflow-hidden">
                <button
                    className="w-full flex justify-between items-center p-6 text-right"
                    onClick={() => setIsActivitiesOpen(!isActivitiesOpen)}
                    aria-expanded={isActivitiesOpen}
                    aria-controls="activities-content"
                >
                    <h2 className="text-xl font-bold text-gray-800">فعالیت‌های اخیر</h2>
                    <ChevronDownIcon className={isActivitiesOpen ? 'rotate-180' : ''} />
                </button>
                <div
                    id="activities-content"
                    className={`transition-all duration-500 ease-in-out ${isActivitiesOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                    style={{ overflow: 'hidden' }}
                >
                    <div className="px-6 pb-6 pt-0">
                        {userActivities.length > 0 ? (
                            <div className="space-y-3 border-t pt-4">
                                {userActivities.map(activity => (
                                    <div key={activity.id} className="bg-gray-50 p-3 rounded-lg border">
                                        <p className="text-sm font-semibold text-gray-800">{activity.taskDescription}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            در کمپین "{campaigns.find(c=>c.id === activity.campaignId)?.mission || 'نامشخص'}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-gray-500 text-center pt-4 border-t">هنوز فعالیتی ثبت نشده است.</p>}
                    </div>
                </div>
            </section>
            
            {/* Redeemed Codes */}
            <Section title="کدهای دریافتی شما">
                {redeemedCodes.length > 0 ? (
                    <div className="space-y-3">
                        {redeemedCodes.map(item => (
                             <div key={item.code} className="bg-gray-50 p-3 rounded-lg border">
                                <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                                <p className="font-mono text-emerald-600 text-center bg-gray-200 rounded-md py-1 mt-2">{item.code}</p>
                                <p className="text-xs text-gray-400 mt-1 text-left">{formatRelativeTime(item.date)}</p>
                             </div>
                        ))}
                    </div>
                ) : <p className="text-gray-500 text-center">هنوز کدی دریافت نکرده‌اید.</p>}
            </Section>
            
            {/* Completed Campaigns */}
            {completedCampaignsUserParticipatedIn.length > 0 && (
                <Section title="گزارش کمپین‌های پایان‌یافته">
                     <div className="flex overflow-x-auto space-x-4 pb-4">
                        {completedCampaignsUserParticipatedIn.map(campaign => (
                            <CampaignCard key={campaign.id} campaign={campaign} variant="suggested"/>
                        ))}
                    </div>
                </Section>
            )}

            {/* Personal Messages */}
            <Section title="پیام‌های شخصی">
                 {sortedPersonalNotifications.length > 0 ? (
                    <div className="space-y-3">
                        {sortedPersonalNotifications.map(notif => (
                            <div key={notif.id} className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                                <p className="text-sm text-emerald-800">{notif.message}</p>
                                <p className="text-xs text-emerald-500 mt-2 text-left">{formatRelativeTime(notif.timestamp)}</p>
                            </div>
                        ))}
                    </div>
                 ) : <p className="text-gray-500 text-center">هیچ پیام شخصی ندارید.</p>}
            </Section>

            {/* More Info Links */}
            <Section title="اطلاعات بیشتر">
                <div className="space-y-3">
                    <InfoLink to="/leagues" icon={<LeaguesIcon />} label="لیگ‌ها" />
                    <InfoLink to="/leaderboard" icon={<LeaderboardIcon />} label={t('profile.leaderboard')} />
                    <InfoLink to="/support" icon={<SupportIcon />} label="چت با پشتیبانی" />
                    <InfoLink to="/about-us" icon={<AboutUsIcon />} label="درباره ما" />
                    <InfoLink to="/partners" icon={<PartnersIcon />} label="همکاران ما" />
                </div>
            </Section>

        </div>
    );
};

export default ProfilePage;