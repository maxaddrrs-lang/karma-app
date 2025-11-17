import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaigns } from '../hooks/useCampaigns';
import { useLanguage } from '../hooks/useLanguage';
import { useSupportChat } from '../hooks/useSupportChat';
import type { Campaign, TaskCompletion } from '../types';
import type { User as AdminUser } from '../data/users';
import { USERS_DATA } from '../data/users';
import Button from '../components/Button';
import CampaignReport from '../components/CampaignReport';
import UserActivityReportModal from '../components/UserActivityReportModal';
import SendNotificationModal from '../components/SendNotificationModal';

// Page components for different views
import AdminNotificationsPage from './AdminNotificationsPage';
import AdminSupportChatPage from './AdminSupportChatPage';
import AdminKarmaClubPage from './AdminKarmaClubPage';
import AdminMissionsPage from './AdminMissionsPage';
import AdminTemplatesPage from './AdminTemplatesPage';
import AdminPartnersPage from './AdminPartnersPage';
import AdminLeaguesPage from './AdminLeaguesPage';
import AdminSettingsPage from './AdminSettingsPage';

// --- Icons ---
const OverviewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const CampaignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2-2z" /></svg>;
const SubmissionsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg>;
const NotificationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426-1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826 3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;


const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

// --- Overview Component ---
const Overview: React.FC = () => {
    const { campaigns, taskCompletions } = useCampaigns();
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        const usersJSON = localStorage.getItem('karma_users');
        const users: AdminUser[] = usersJSON ? JSON.parse(usersJSON) : USERS_DATA;
        setTotalUsers(users.length);
    }, []);

    const pendingCampaigns = campaigns.filter(c => c.status === 'pending').length;
    const pendingSubmissions = taskCompletions.filter(c => c.status === 'pending').length;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">خلاصه عملکرد</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="کل کمپین‌ها" value={campaigns.length} icon={<CampaignIcon />} />
                <StatCard title="کمپین‌های در انتظار تایید" value={pendingCampaigns} icon={<CampaignIcon />} />
                <StatCard title="کل کاربران" value={totalUsers} icon={<UsersIcon />} />
                <StatCard title="ماموریت‌های در انتظار تایید" value={pendingSubmissions} icon={<SubmissionsIcon />} />
            </div>
            {/* Can add more charts or summaries here */}
        </div>
    );
};

// --- Campaigns Management Component ---
const Campaigns: React.FC = () => {
    const { campaigns, setCampaignStatus, deleteCampaign, taskCompletions } = useCampaigns();
    const navigate = useNavigate();
    const [selectedCampaignForReport, setSelectedCampaignForReport] = useState<Campaign | null>(null);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        const usersJSON = localStorage.getItem('karma_users');
        const users: AdminUser[] = usersJSON ? JSON.parse(usersJSON) : [];
        setTotalUsers(users.length);
    }, []);

    const getStatusChip = (status: Campaign['status']) => {
        switch (status) {
            case 'active': return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">فعال</span>;
            case 'pending': return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">در انتظار</span>;
            case 'rejected': return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">رد شده</span>;
            case 'completed': return <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">تکمیل شده</span>;
        }
    };

    if (selectedCampaignForReport) {
        return <CampaignReport campaign={selectedCampaignForReport} onBack={() => setSelectedCampaignForReport(null)} taskCompletions={taskCompletions} totalUsers={totalUsers} />;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">مدیریت کمپین‌ها</h1>
            <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-right min-w-[600px]">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">ماموریت</th>
                            <th className="px-6 py-3">برند</th>
                            <th className="px-6 py-3">وضعیت</th>
                            <th className="px-6 py-3">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.map(c => (
                            <tr key={c.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{c.mission}</td>
                                <td className="px-6 py-4">{c.brandName}</td>
                                <td className="px-6 py-4">{getStatusChip(c.status)}</td>
                                <td className="px-6 py-4 space-x-2 space-x-reverse whitespace-nowrap">
                                    {c.status === 'pending' && (
                                        <>
                                            <button onClick={() => setCampaignStatus(c.id, 'active')} className="font-medium text-green-600 hover:underline">تایید</button>
                                            <button onClick={() => setCampaignStatus(c.id, 'rejected')} className="font-medium text-red-600 hover:underline">رد</button>
                                        </>
                                    )}
                                    <button onClick={() => navigate(`/admin/edit-campaign/${c.id}`)} className="font-medium text-blue-600 hover:underline">ویرایش</button>
                                    <button onClick={() => setSelectedCampaignForReport(c)} className="font-medium text-indigo-600 hover:underline">گزارش</button>
                                    <button onClick={() => {if(window.confirm('آیا از حذف این کمپین اطمینان دارید؟')) deleteCampaign(c.id)}} className="font-medium text-gray-500 hover:underline">حذف</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Submissions Management Component ---
const Submissions: React.FC = () => {
    const { taskCompletions, approveTaskCompletion, rejectTaskCompletion, campaigns } = useCampaigns();
    const pendingSubmissions = taskCompletions.filter(tc => tc.status === 'pending');

    const getCampaignName = (id: number) => campaigns.find(c => c.id === id)?.mission || 'نامشخص';

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">بررسی ماموریت‌های ارسالی</h1>
            <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
                {pendingSubmissions.length > 0 ? (
                    <table className="w-full text-sm text-right min-w-[600px]">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">کاربر</th>
                                <th className="px-6 py-3">ماموریت</th>
                                <th className="px-6 py-3">کمپین</th>
                                <th className="px-6 py-3">داده ارسالی</th>
                                <th className="px-6 py-3">عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingSubmissions.map(s => (
                                <tr key={s.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{s.userId}</td>
                                    <td className="px-6 py-4">{s.taskDescription}</td>
                                    <td className="px-6 py-4">{getCampaignName(s.campaignId)}</td>
                                    <td className="px-6 py-4 font-mono text-blue-600">{s.submittedData}</td>
                                    <td className="px-6 py-4 space-x-2 space-x-reverse whitespace-nowrap">
                                        <button onClick={() => approveTaskCompletion(s.id)} className="font-medium text-green-600 hover:underline">تایید</button>
                                        <button onClick={() => rejectTaskCompletion(s.id)} className="font-medium text-red-600 hover:underline">رد</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-gray-500 py-8">هیچ ماموریتی در انتظار تایید وجود ندارد.</p>
                )}
            </div>
        </div>
    );
};

// --- Users Management Component ---
type UserWithProgress = AdminUser & { averageProgress: number };

const Users: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
    const { campaigns, taskCompletions, approveTaskCompletion, rejectTaskCompletion } = useCampaigns();
    const [sortConfig, setSortConfig] = useState<{ key: keyof UserWithProgress; direction: 'asc' | 'desc' } | null>({ key: 'averageProgress', direction: 'desc' });


    useEffect(() => {
        const usersJSON = localStorage.getItem('karma_users');
        const allUsers: AdminUser[] = usersJSON ? JSON.parse(usersJSON) : USERS_DATA;
        setUsers(allUsers);
    }, []);

    const usersWithProgress = useMemo(() => {
        return users.map(user => {
            const userCompletions = taskCompletions.filter(
                c => c.userId === user.identifier && c.status === 'approved'
            );
            
            if (userCompletions.length === 0) {
                return { ...user, averageProgress: 0 };
            }
    
            const totalImpactPoints = userCompletions.reduce((sum, c) => sum + c.impactPoints, 0);
            const averageProgress = totalImpactPoints / userCompletions.length;
            
            return { ...user, averageProgress: averageProgress };
        });
    }, [users, taskCompletions]);

    const sortedUsers = useMemo(() => {
        let sortableUsers: UserWithProgress[] = [...usersWithProgress];
        if (sortConfig !== null) {
            sortableUsers.sort((a, b) => {
                const aValue = a[sortConfig.key] as number | string;
                const bValue = b[sortConfig.key] as number | string;
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableUsers;
    }, [usersWithProgress, sortConfig]);

    const requestSort = (key: keyof UserWithProgress) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof UserWithProgress) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <svg className="w-4 h-4 inline-block text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>;
        }
        if (sortConfig.direction === 'asc') {
            return <svg className="w-4 h-4 inline-block text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>;
        }
        return <svg className="w-4 h-4 inline-block text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" /></svg>;
    };

    const handleOpenReport = (user: AdminUser) => {
        setSelectedUser(user);
        setIsReportModalOpen(true);
    };
    
    const handleOpenNotification = (user: AdminUser) => {
        setSelectedUser(user);
        setIsNotificationModalOpen(true);
    };

    const closeModals = () => {
        setSelectedUser(null);
        setIsReportModalOpen(false);
        setIsNotificationModalOpen(false);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">مدیریت کاربران</h1>
            <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-right min-w-[600px]">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 cursor-pointer" onClick={() => requestSort('identifier')}>شناسه {getSortIcon('identifier')}</th>
                            <th className="px-6 py-3 cursor-pointer" onClick={() => requestSort('karmaCoins')}>سکه کارما {getSortIcon('karmaCoins')}</th>
                            <th className="px-6 py-3 cursor-pointer" onClick={() => requestSort('impactScore')}>امتیاز تاثیر {getSortIcon('impactScore')}</th>
                            <th className="px-6 py-3 cursor-pointer" onClick={() => requestSort('averageProgress')}>پیشرفت کلی {getSortIcon('averageProgress')}</th>
                            <th className="px-6 py-3">وضعیت</th>
                            <th className="px-6 py-3">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.map(u => (
                            <tr key={u.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{u.identifier}</td>
                                <td className="px-6 py-4">{u.karmaCoins}</td>
                                <td className="px-6 py-4">{u.impactScore}</td>
                                <td className="px-6 py-4 font-semibold text-emerald-700">{u.averageProgress.toFixed(1)}%</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${u.status === 'active' ? 'text-green-800 bg-green-100' : 'text-gray-800 bg-gray-100'}`}>
                                        {u.status === 'active' ? 'فعال' : 'غیرفعال'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 space-x-2 space-x-reverse whitespace-nowrap">
                                    <button onClick={() => handleOpenReport(u)} className="font-medium text-blue-600 hover:underline">مشاهده فعالیت</button>
                                    <button onClick={() => handleOpenNotification(u)} className="font-medium text-emerald-600 hover:underline">ارسال پیام</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedUser && (
                <>
                    <UserActivityReportModal
                        isOpen={isReportModalOpen}
                        onClose={closeModals}
                        user={selectedUser}
                        completions={taskCompletions}
                        campaigns={campaigns}
                        approveTaskCompletion={approveTaskCompletion}
                        rejectTaskCompletion={rejectTaskCompletion}
                    />
                    <SendNotificationModal
                        isOpen={isNotificationModalOpen}
                        onClose={closeModals}
                        user={selectedUser}
                    />
                </>
             )}
        </div>
    );
};

// --- Main AdminDashboardPage Component ---
const AdminDashboardPage: React.FC = () => {
    const [activeView, setActiveView] = useState('overview');
    const { chats, getUnreadCount } = useSupportChat();
    const { campaigns, taskCompletions } = useCampaigns();

    const pendingSubmissionsCount = useMemo(() => taskCompletions.filter(c => c.status === 'pending').length, [taskCompletions]);
    const pendingCampaignsCount = useMemo(() => campaigns.filter(c => c.status === 'pending').length, [campaigns]);
    const totalUnreadChats = useMemo(() => {
        const usersWithChats = Object.keys(chats);
        return usersWithChats.reduce((sum, userId) => sum + getUnreadCount(userId), 0);
    }, [chats, getUnreadCount]);

    const views = [
        { id: 'overview', label: 'خلاصه عملکرد', icon: <OverviewIcon />, component: <Overview />, notificationCount: 0 },
        { id: 'campaigns', label: 'مدیریت کمپین‌ها', icon: <CampaignIcon />, component: <Campaigns />, notificationCount: pendingCampaignsCount },
        { id: 'submissions', label: 'بررسی ماموریت‌ها', icon: <SubmissionsIcon />, component: <Submissions />, notificationCount: pendingSubmissionsCount },
        { id: 'users', label: 'مدیریت کاربران', icon: <UsersIcon />, component: <Users />, notificationCount: 0 },
        { id: 'notifications', label: 'اطلاع‌رسانی', icon: <NotificationIcon />, component: <AdminNotificationsPage />, notificationCount: 0 },
        { id: 'support', label: 'پشتیبانی', icon: <ChatIcon />, component: <AdminSupportChatPage />, notificationCount: totalUnreadChats },
        { id: 'karma_club', label: 'باشگاه کارما', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 16l-4-4 6.293-6.293a1 1 0 011.414 0z" /></svg>, component: <AdminKarmaClubPage />, notificationCount: 0 },
        { id: 'missions', label: 'ماموریت‌های پیش‌فرض', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>, component: <AdminMissionsPage />, notificationCount: 0 },
        { id: 'templates', label: 'الگوهای کمپین', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>, component: <AdminTemplatesPage />, notificationCount: 0 },
        { id: 'partners', label: 'همکاران', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>, component: <AdminPartnersPage />, notificationCount: 0 },
        { id: 'leagues', label: 'لیگ‌ها', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" /></svg>, component: <AdminLeaguesPage />, notificationCount: 0 },
        { id: 'settings', label: 'تنظیمات', icon: <SettingsIcon />, component: <AdminSettingsPage />, notificationCount: 0 },
    ];

    const activeComponent = views.find(v => v.id === activeView)?.component || <Overview />;

    return (
        <div className="flex h-[calc(100vh-70px)] bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col flex-shrink-0">
                <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-gray-700">
                    پنل ادمین کارما
                </div>
                <nav className="flex-grow overflow-y-auto">
                    <ul className="py-4">
                        {views.map(view => (
                            <li key={view.id}>
                                <button
                                    onClick={() => setActiveView(view.id)}
                                    className={`w-full text-right flex items-center px-6 py-3 transition-colors ${activeView === view.id ? 'bg-emerald-600 text-white' : 'hover:bg-gray-700'}`}
                                >
                                    {view.icon}
                                    <span className="me-4">{view.label}</span>
                                    {view.notificationCount > 0 && (
                                        <span className="ms-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {view.notificationCount}
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            {/* Main Content */}
            <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
                {activeComponent}
            </main>
        </div>
    );
};

export default AdminDashboardPage;