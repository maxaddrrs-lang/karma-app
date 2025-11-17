import React from 'react';
import type { User as AdminUser } from '../data/users';
import type { TaskCompletion, Campaign } from '../types';
import { taskTranslations } from '../constants';

interface UserActivityReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  completions: TaskCompletion[];
  campaigns: Campaign[];
  approveTaskCompletion: (completionId: string) => void;
  rejectTaskCompletion: (completionId: string) => void;
}

const UserActivityReportModal: React.FC<UserActivityReportModalProps> = ({ isOpen, onClose, user, completions, campaigns, approveTaskCompletion, rejectTaskCompletion }) => {
  if (!isOpen || !user) {
    return null;
  }
  
  const userPendingCompletions = completions.filter(c => c.userId === user.identifier && c.status === 'pending');
  const userActivityHistory = completions.filter(c => c.userId === user.identifier && c.status !== 'pending');


  const getCampaignMission = (campaignId: number): string => {
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign ? campaign.mission : 'کمپین نامشخص';
  };
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  }

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
        onClick={handleOverlayClick}
        aria-modal="true"
        role="dialog"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full relative transform transition-all scale-100 flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">گزارش فعالیت کاربر</h2>
        <p className="text-gray-600 mb-6 text-sm">
            نمایش و تایید ماموریت‌های انجام شده توسط <span className="font-semibold text-emerald-600">{user.identifier}</span>.
        </p>

        {/* Pending Tasks Section */}
        {userPendingCompletions.length > 0 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex-shrink-0">
            <h3 className="font-bold text-lg text-yellow-800 mb-3">ماموریت‌های در انتظار تایید</h3>
            <div className="space-y-3">
              {userPendingCompletions.map(completion => (
                <div key={completion.id} className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div className="flex-grow">
                      <p className="font-semibold text-gray-800">{taskTranslations[completion.taskDescription] || completion.taskDescription}</p>
                      <p className="text-xs text-gray-500 mt-1">در کمپین: "{getCampaignMission(completion.campaignId)}"</p>
                      <p className="text-sm font-mono text-blue-600 mt-1">ID: {completion.submittedData}</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2 self-end sm:self-center">
                    <button onClick={() => approveTaskCompletion(completion.id)} className="py-2 px-4 text-sm bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors">تایید</button>
                    <button onClick={() => rejectTaskCompletion(completion.id)} className="py-2 px-4 text-sm bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors">رد</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <h3 className="font-bold text-lg text-gray-800 mb-3">تاریخچه کامل فعالیت</h3>
        <div className="flex-grow overflow-y-auto border rounded-lg">
          {userActivityHistory.length > 0 ? (
            <table className="w-full text-sm text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                    <tr>
                        <th className="px-6 py-3">کمپین (ماموریت)</th>
                        <th className="px-6 py-3">وضعیت</th>
                        <th className="px-6 py-3">شناسه ثبت شده</th>
                        <th className="px-6 py-3">تاریخ</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y">
                    {userActivityHistory.map(completion => (
                        <tr key={completion.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <p className="font-medium text-gray-900">{taskTranslations[completion.taskDescription] || completion.taskDescription}</p>
                                <p className="text-xs text-gray-500">{getCampaignMission(completion.campaignId)}</p>
                            </td>
                            <td className="px-6 py-4">
                                {completion.status === 'approved' && <span className="text-xs font-bold text-green-600">تایید شده</span>}
                                {completion.status === 'rejected' && <span className="text-xs font-bold text-red-600">رد شده</span>}
                            </td>
                            <td className="px-6 py-4 font-mono text-blue-600">{completion.submittedData || '---'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{new Date(completion.completedAt).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
          ) : (
            <div className="text-center py-16 px-6">
                <h3 className="text-xl font-semibold text-gray-700">هیچ فعالیتی ثبت نشده است.</h3>
                <p className="mt-2 text-gray-500">این کاربر هنوز هیچ ماموریتی را انجام نداده است.</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-left flex-shrink-0">
          <button onClick={onClose} className="py-2 px-5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors">
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserActivityReportModal;