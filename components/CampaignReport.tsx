import React, { useMemo } from 'react';
import type { Campaign, TaskCompletion } from '../types';
import { useLanguage } from '../hooks/useLanguage';

// --- Icons ---
const UsersIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg>;
const TasksIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ImpactIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const EngagementIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

interface CampaignReportProps {
    campaign: Campaign;
    onBack: () => void;
    taskCompletions: TaskCompletion[];
    totalUsers: number;
}

const formatNumber = (num: number) => new Intl.NumberFormat('fa-IR').format(num);

const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4 space-x-reverse">
        <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);


const CampaignReport: React.FC<CampaignReportProps> = ({ campaign, onBack, taskCompletions, totalUsers }) => {
    const { t } = useLanguage();

    const campaignCompletions = useMemo(() =>
        taskCompletions.filter(tc => tc.campaignId === campaign.id && tc.status === 'approved'),
        [taskCompletions, campaign.id]
    );

    const participants = useMemo(() =>
        new Set(campaignCompletions.map(tc => tc.userId)).size,
        [campaignCompletions]
    );

    const tasksCompletedCount = campaignCompletions.length;

    const totalImpact = useMemo(() =>
        campaignCompletions.reduce((sum, tc) => sum + tc.impactPoints, 0),
        [campaignCompletions]
    );

    const engagementRate = useMemo(() =>
        totalUsers > 0 ? ((participants / totalUsers) * 100).toFixed(1) : '0.0',
        [participants, totalUsers]
    );

    const participantData = useMemo(() => {
        const participantsMap = new Map<string, { tasksCompleted: number; totalImpact: number }>();

        campaignCompletions.forEach(completion => {
            const user = participantsMap.get(completion.userId) || { tasksCompleted: 0, totalImpact: 0 };
            user.tasksCompleted += 1;
            user.totalImpact += completion.impactPoints;
            participantsMap.set(completion.userId, user);
        });

        return Array.from(participantsMap.entries()).map(([userId, data]) => ({
            userId,
            ...data
        })).sort((a, b) => b.totalImpact - a.totalImpact);

    }, [campaignCompletions]);
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg printable-report">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 no-print">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">گزارش کمپین</h1>
                    <p className="text-gray-500">تاریخ گزارش: {new Date().toLocaleDateString('fa-IR')}</p>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                    <button onClick={onBack} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">بازگشت</button>
                    <button onClick={handlePrint} className="py-2 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">چاپ گزارش</button>
                </div>
            </div>

            {/* Campaign Summary */}
            <section className="border-b pb-6 mb-6">
                <h2 className="text-2xl font-bold text-emerald-600 mb-2">{campaign.mission}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
                    <div><strong>برند:</strong> {campaign.brandName}</div>
                    <div><strong>دسته بندی:</strong> {t(`categories_list.${campaign.category}`)}</div>
                    <div><strong>مکان:</strong> {campaign.location}</div>
                    <div><strong>روزهای باقی مانده:</strong> {campaign.daysLeft}</div>
                    <div><strong>مبلغ هدف:</strong> {formatNumber(campaign.targetAmount)} تومان</div>
                    <div><strong>پیشرفت فعلی:</strong> {campaign.progress}%</div>
                </div>
            </section>
            
             {/* KPIs */}
            <section className="mb-8">
                 <h3 className="text-xl font-semibold text-gray-800 mb-4">شاخص‌های کلیدی عملکرد</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard title="تعداد شرکت کنندگان" value={formatNumber(participants)} icon={<UsersIcon />} />
                    <KpiCard title="ماموریت‌های انجام شده" value={formatNumber(tasksCompletedCount)} icon={<TasksIcon />} />
                    <KpiCard title="امتیاز تاثیرگذاری" value={formatNumber(totalImpact)} icon={<ImpactIcon />} />
                    <KpiCard title="نرخ تعامل" value={`${engagementRate}%`} icon={<EngagementIcon />} />
                 </div>
            </section>

             {/* Visualizations */}
            <section className="mb-8">
                 <h3 className="text-xl font-semibold text-gray-800 mb-4">عملکرد ماموریت‌ها</h3>
                 <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="font-semibold mb-2">تفکیک ماموریت‌های انجام شده</p>
                    <div className="space-y-3">
                        {campaign.tasks.map(task => {
                            const completionsForThisTask = campaignCompletions.filter(tc => tc.taskId === task.id).length;
                            const percentage = tasksCompletedCount > 0 ? (completionsForThisTask / tasksCompletedCount) * 100 : 0;
                            return (
                                <div key={task.id}>
                                    <p className="text-sm text-gray-600 mb-1">{task.description}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div 
                                            className="bg-emerald-500 h-4 rounded-full text-right px-2 text-white text-xs flex items-center justify-center" 
                                            style={{ width: `${percentage}%` }}
                                        >
                                           {formatNumber(completionsForThisTask)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                 </div>
            </section>

             {/* Participants List */}
            <section>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">لیست شرکت‌کنندگان</h3>
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm text-right text-gray-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="px-6 py-3">ردیف</th>
                                <th className="px-6 py-3">شناسه کاربر</th>
                                <th className="px-6 py-3">ماموریت‌های انجام شده</th>
                                <th className="px-6 py-3">امتیاز تاثیر کل</th>
                            </tr>
                        </thead>
                        <tbody>
                            {participantData.length > 0 ? (
                                participantData.map((user, index) => (
                                    <tr key={user.userId} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-4">{user.userId}</td>
                                        <td className="px-6 py-4">{formatNumber(user.tasksCompleted)}</td>
                                        <td className="px-6 py-4 font-bold">{formatNumber(user.totalImpact)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-gray-500">
                                        هیچ شرکت‌کننده فعالی برای این کمپین یافت نشد.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default CampaignReport;