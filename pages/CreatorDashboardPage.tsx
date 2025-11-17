import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaigns } from '../hooks/useCampaigns';
import { useLanguage } from '../hooks/useLanguage';

// Icons
const StatIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full">{children}</div>;
const CampaignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2-2z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg>;
const SubmissionsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 space-x-reverse">
        <StatIcon>{icon}</StatIcon>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const CreatorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { campaigns, taskCompletions } = useCampaigns();
  const { formatRelativeTime } = useLanguage();
  const [creatorEmail, setCreatorEmail] = useState<string | null>(null);
  const [creatorBrandName, setCreatorBrandName] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem('creatorEmail');
    const brandName = localStorage.getItem('creatorBrandName');
    if (!email || !brandName) {
      navigate('/creator/login');
    } else {
      setCreatorEmail(email);
      setCreatorBrandName(brandName);
    }
  }, [navigate]);

  const {
    creatorCampaigns,
    activeCampaigns,
    pendingCampaigns,
    totalParticipants,
    pendingSubmissions,
    liveActivityFeed
  } = useMemo(() => {
    if (!creatorEmail) {
      return { creatorCampaigns: [], activeCampaigns: 0, pendingCampaigns: 0, totalParticipants: 0, pendingSubmissions: 0, liveActivityFeed: [] };
    }

    const filteredCampaigns = campaigns.filter(c => c.creatorEmail.toLowerCase() === creatorEmail.toLowerCase());
    const campaignIds = new Set(filteredCampaigns.map(c => c.id));
    const relevantCompletions = taskCompletions.filter(tc => campaignIds.has(tc.campaignId));
    
    const participants = new Set(relevantCompletions.map(tc => tc.userId));
    const pending = relevantCompletions.filter(tc => tc.status === 'pending');

    const feed = relevantCompletions
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
        .slice(0, 10);

    return {
      creatorCampaigns: filteredCampaigns,
      activeCampaigns: filteredCampaigns.filter(c => c.status === 'active').length,
      pendingCampaigns: filteredCampaigns.filter(c => c.status === 'pending').length,
      totalParticipants: participants.size,
      pendingSubmissions: pending.length,
      liveActivityFeed: feed
    };
  }, [creatorEmail, campaigns, taskCompletions]);

  const handleLogout = () => {
    localStorage.removeItem('creatorEmail');
    localStorage.removeItem('creatorBrandName');
    navigate('/creator/login');
  };

  if (!creatorEmail || !creatorBrandName) {
    return null; // Or a loading spinner
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">داشبورد برگزارکننده</h1>
                <p className="text-lg font-semibold text-emerald-700">{creatorBrandName}</p>
            </div>
            <button onClick={handleLogout} className="font-medium text-red-600 hover:text-red-800">خروج</button>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="تعداد کل کمپین‌ها" value={creatorCampaigns.length} icon={<CampaignIcon />} />
            <StatCard title="کمپین‌های فعال/درانتظار" value={`${activeCampaigns} / ${pendingCampaigns}`} icon={<CampaignIcon />} />
            <StatCard title="تعداد کل مشارکت‌کنندگان" value={totalParticipants} icon={<UsersIcon />} />
            <StatCard title="ماموریت‌های در حال بررسی" value={pendingSubmissions} icon={<SubmissionsIcon />} />
        </section>

        {/* Live Activity Feed */}
        <section className="bg-white p-6 rounded-lg shadow">
             <h2 className="text-xl font-bold text-gray-800 mb-4">فید زنده فعالیت</h2>
             {liveActivityFeed.length > 0 ? (
                 <div className="space-y-4">
                     {liveActivityFeed.map(activity => {
                         const campaign = campaigns.find(c => c.id === activity.campaignId);
                         return (
                             <div key={activity.id} className="p-4 bg-gray-50 rounded-lg border flex justify-between items-center">
                                 <div>
                                     <p className="font-semibold text-gray-800">
                                         کاربر <span className="font-mono text-blue-600">{activity.userId.split('@')[0]}</span> ماموریت "{activity.taskDescription}" را انجام داد.
                                     </p>
                                     <p className="text-xs text-gray-500 mt-1">
                                         در کمپین: "{campaign?.mission || 'نامشخص'}"
                                     </p>
                                 </div>
                                 <div className="text-right flex-shrink-0">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        activity.status === 'approved' ? 'text-green-800 bg-green-100' :
                                        activity.status === 'pending' ? 'text-yellow-800 bg-yellow-100' :
                                        'text-red-800 bg-red-100'
                                    }`}>
                                        {activity.status === 'approved' ? 'تایید شده' : activity.status === 'pending' ? 'در حال بررسی' : 'رد شده'}
                                    </span>
                                     <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(activity.completedAt)}</p>
                                 </div>
                             </div>
                         );
                     })}
                 </div>
             ) : (
                <p className="text-center text-gray-500 py-8">هنوز فعالیتی برای کمپین‌های شما ثبت نشده است.</p>
             )}
        </section>
    </div>
  );
};

export default CreatorDashboardPage;
