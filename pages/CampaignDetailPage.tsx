import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCampaigns } from '../hooks/useCampaigns';
import type { Task, SocialPlatform } from '../types';
import SocialMediaTaskModal from '../components/SocialMediaTaskModal';
import CodeRedemptionModal from '../components/CodeRedemptionModal';
import { useAuth } from '../hooks/useAuth';
import Toast from '../components/Toast';
import { getCategoryIcon } from '../components/CategoryIcons';
import Button from '../components/Button';
import ConfirmationModal from '../components/ConfirmationModal';
import { useLanguage } from '../hooks/useLanguage';

// --- Icons ---
const BackIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
const ShareIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
const VerifiedIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={`w-5 h-5 text-blue-500 mr-2 ${className || ''}`} viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm-1.4,13.7L6.45,11.55l1.41-1.41L10.6,13.47l5.25-5.25,1.41,1.41Z" /></svg>
const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const DeleteIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className || ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;
const ExternalLinkIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;


const platformIcons: Record<SocialPlatform | 'shop' | 'generic' | 'code', React.ReactNode> = {
    instagram: (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
        </div>
    ),
    x: (
        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        </div>
    ),
    youtube: (
        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.25,4,12,4,12,4S5.75,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.75,2,12,2,12s0,4.25,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.75,20,12,20,12,20s6.25,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.25,22,12,22,12S22,7.75,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" />
            </svg>
        </div>
    ),
    telegram: (
         <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15.91L18.23 16.2c-.24.62-.67.78-1.21.49l-4.46-3.3-4.52 4.13c-.39.37-.87.57-1.4.57-.78 0-1.02-.37-1.12-.75L9.78 18.65z" />
            </svg>
        </div>
    ),
    linkedin: (
        <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
        </div>
    ),
    facebook: (
        <div className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
        </div>
    ),
    shop: (
        <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        </div>
    ),
    code: (
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        </div>
    ),
    generic: <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center"><svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>,
};

const getTaskIcon = (task: Task) => {
    if (task.type === 'code_redemption') {
        return platformIcons['code'];
    }
    if (task.type === 'social_media' && task.platform) {
        return platformIcons[task.platform];
    }
    if (task.description.includes('فروشگاه')) {
        return platformIcons['shop'];
    }
    return platformIcons.generic;
};


const SPONSOR_MESSAGE_TRUNCATE_LENGTH = 150;
const formatNumber = (num: number) => new Intl.NumberFormat('fa-IR').format(num);


const CampaignDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { campaigns, submitSocialMediaTask, completeGenericTask, comments, addComment, deleteComment, taskCompletions } = useCampaigns();
    const { isAuthenticated, userIdentifier, socialIds, isAdmin } = useAuth();
    const { t, formatRelativeTime } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isSponsorMessageExpanded, setIsSponsorMessageExpanded] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [taskToConfirm, setTaskToConfirm] = useState<Task | null>(null);

    const campaignId = Number(id);
    const campaign = campaigns.find(c => c.id === campaignId);
    const userCompletions = taskCompletions.filter(tc => tc.userId === userIdentifier && tc.campaignId === campaignId);
    const isCampaignCompleted = campaign?.status === 'completed';
    const campaignComments = comments
        .filter(c => c.campaignId === campaignId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (!campaign) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold">کمپین مورد نظر یافت نشد.</h2>
                <Link to="/campaigns" className="mt-4 inline-block bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600">
                    بازگشت به لیست کمپین‌ها
                </Link>
            </div>
        );
    }
    
    const handleTaskClick = (task: Task) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const completion = userCompletions.find(uc => uc.taskId === task.id);

        if (completion?.status === 'approved') {
            setToast({ message: 'شما قبلا این ماموریت را با موفقیت انجام داده‌اید.', type: 'error' });
            return;
        }
        if (completion?.status === 'pending') {
            setToast({ message: 'این ماموریت در انتظار تایید ادمین است.', type: 'error' });
            return;
        }

        if (task.type === 'social_media' && task.platform) {
            const savedId = socialIds[task.platform];
            if (savedId && userIdentifier) {
                submitSocialMediaTask(campaign.id, task.id, savedId, task, userIdentifier);
                setToast({ message: 'درخواست شما با شناسه ذخیره شده ارسال شد.', type: 'success' });
            } else {
                setSelectedTask(task);
                setIsModalOpen(true);
            }
        } else if (task.type === 'code_redemption') {
            setSelectedTask(task);
            setIsCodeModalOpen(true);
        } else {
            setTaskToConfirm(task);
            setIsConfirmModalOpen(true);
        }
    };

    const handleModalSubmit = (socialId: string) => {
        if (selectedTask && userIdentifier) {
            submitSocialMediaTask(campaign.id, selectedTask.id, socialId, selectedTask, userIdentifier);
            setToast({ message: 'درخواست شما برای بررسی ارسال شد.', type: 'success' });
        }
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const handleCodeModalSubmit = (code: string) => {
        if (selectedTask && userIdentifier) {
            completeGenericTask(campaign.id, selectedTask.id, selectedTask, userIdentifier, code);
            setToast({ message: `ماموریت با موفقیت انجام و کد شما ثبت شد!`, type: 'success' });
        }
        setIsCodeModalOpen(false);
        setSelectedTask(null);
    };

    const handleConfirmCompleteTask = () => {
        if (taskToConfirm && userIdentifier) {
            completeGenericTask(campaign.id, taskToConfirm.id, taskToConfirm, userIdentifier);
            setToast({ message: `ماموریت "${taskToConfirm.description}" با موفقیت انجام شد!`, type: 'success' });
        }
        setIsConfirmModalOpen(false);
        setTaskToConfirm(null);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim() && userIdentifier) {
            addComment(campaign.id, userIdentifier, newComment.trim());
            setNewComment('');
        }
    };
    
    const handleScrollToTasks = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const tasksSection = document.getElementById('tasks-section');
        if (tasksSection) {
            tasksSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleShare = async () => {
        if (!campaign) return;
        const shareData = {
            title: campaign.mission,
            text: `در کمپین "${campaign.mission}" در پلتفرم کارما شرکت کنید!`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                setToast({ message: 'لینک کمپین در کلیپ‌بورد شما کپی شد!', type: 'success' });
            }
        } catch (err) {
            console.error('Error sharing:', err);
            if ((err as Error).name !== 'AbortError') {
                setToast({ message: 'خطا در به اشتراک گذاری.', type: 'error' });
            }
        }
    };

    const isMessageTruncated = campaign.sponsorMessage.length > SPONSOR_MESSAGE_TRUNCATE_LENGTH;
    const sponsorMessageContent = isMessageTruncated && !isSponsorMessageExpanded
        ? `${campaign.sponsorMessage.substring(0, SPONSOR_MESSAGE_TRUNCATE_LENGTH)}...`
        : campaign.sponsorMessage;

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <header className="sticky top-0 bg-white/80 backdrop-blur-md z-20 flex justify-between items-center p-4 border-b border-gray-200">
                <button onClick={() => navigate(-1)} className="p-2 -m-2 rounded-full hover:bg-gray-100"><BackIcon className="transform scale-x-[-1]" /></button>
                <h1 className="font-bold text-lg text-gray-800">توضیحات کمپین</h1>
                <button onClick={handleShare} className="p-2 -m-2 rounded-full hover:bg-gray-100"><ShareIcon /></button>
            </header>

            <main className="max-w-3xl mx-auto p-4 space-y-6 pb-28">
                {/* Single Image */}
                <section>
                    <img src={campaign.imageUrl} alt={campaign.mission} className="w-full h-72 object-cover rounded-xl shadow-lg" />
                </section>
                
                {/* Campaign Info Card */}
                <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200/80">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="font-bold text-2xl sm:text-3xl text-gray-800 mb-2">{campaign.mission}</h2>
                            <div className="mt-2 flex items-center text-sm text-emerald-700 font-semibold">
                                {getCategoryIcon(campaign.category, "h-5 w-5 me-1")}
                                <span>{t(`categories_list.${campaign.category}`)}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">زمان ایجاد {new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString('fa-IR')}</p>
                        </div>
                        <span className="bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full flex-shrink-0">ماموریت</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-semibold text-emerald-600">{campaign.progress}% تکمیل شده</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full" style={{width: `${campaign.progress}%`}}></div>
                        </div>
                        <div className="flex justify-between text-2xl text-gray-800 font-extrabold mt-3">
                            <span className="font-bold">{formatNumber(campaign.targetAmount)} <span className="text-lg font-normal">تومان</span></span>
                            <span className="font-bold">{campaign.daysLeft} <span className="text-lg font-normal">روز مانده</span></span>
                        </div>
                    </div>
                </section>

                {isCampaignCompleted && (
                    <section className="bg-blue-50 border-r-4 border-blue-500 text-blue-800 p-4 rounded-lg shadow-sm" role="alert">
                        <p className="font-bold">تکمیل شده!</p>
                        <p>این کمپین با موفقیت به هدف خود رسیده است. از تمام شرکت‌کنندگان سپاسگزاریم.</p>
                    </section>
                )}

                {/* Campaigner Section Card */}
                <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200/80">
                    <h3 className="font-bold text-gray-500 mb-3 text-sm tracking-wider">{t('campaignDetail.campaigner')}</h3>
                    <div className="flex items-center space-x-4">
                        <img src={campaign.brandLogoUrl || `https://ui-avatars.com/api/?name=${campaign.brandName.charAt(0)}&background=a7f3d0&color=047857&size=48`} alt={`${campaign.brandName} logo`} className="w-12 h-12 rounded-full bg-emerald-100 p-1 object-contain" />
                        <div>
                            <div className="flex items-center">
                                <span className="font-bold text-lg text-gray-800">{campaign.brandName}</span>
                                <VerifiedIcon />
                            </div>
                            <p className="text-xs text-gray-500">{t('campaignDetail.verifiedAccount')}</p>
                        </div>
                    </div>
                </section>
                
                {/* Sponsor Message Card */}
                <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200/80">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">گفت گو با مدیر {campaign.brandName}</h3>
                    <p className="text-gray-700 text-base whitespace-pre-wrap leading-loose">{sponsorMessageContent}</p>
                    {isMessageTruncated && (
                        <button onClick={() => setIsSponsorMessageExpanded(!isSponsorMessageExpanded)} className="text-emerald-600 font-semibold text-sm mt-2">
                            {isSponsorMessageExpanded ? 'بستن' : 'ادامه دارد'}
                        </button>
                    )}
                </section>
                
                {/* Tasks Section Card */}
                <section id="tasks-section" className="bg-white p-6 rounded-xl shadow-md border border-gray-200/80">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-lg text-gray-800">ماموریت ها</h3>
                            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">{campaign.tasks.length}</span>
                        </div>
                        <ChevronRightIcon className="text-gray-400" />
                    </div>
                    <div className="space-y-3">
                        {campaign.tasks.map(task => {
                             const completion = userCompletions.find(uc => uc.taskId === task.id);
                             const isCompleted = completion?.status === 'approved';
                             const isPending = completion?.status === 'pending';
                             const isRejected = completion?.status === 'rejected';
                             const isDisabled = isCompleted || isCampaignCompleted || isPending;
                             return (
                                <div key={task.id} onClick={() => !isDisabled && handleTaskClick(task)} className={`flex items-center p-3 rounded-xl transition-all duration-200 ${isDisabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : 'bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5'}`}>
                                    <div className="flex-shrink-0 w-8 h-8 me-4">{getTaskIcon(task)}</div>
                                    <div className="flex-grow">
                                        <p className="font-semibold text-gray-800 text-sm">{task.description}</p>
                                        <p className="text-xs text-gray-500 mt-1">{task.impactPoints}% تکمیل چرخه • <span className="text-yellow-600">{task.karmaCoins} سکه</span></p>
                                    </div>
                                    <div className="flex items-center space-x-3 flex-shrink-0">
                                        {task.targetUrl && (
                                            <a href={task.targetUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-2 -m-2 rounded-full hover:bg-emerald-200 text-emerald-600" aria-label="رفتن به صفحه ماموریت">
                                                <ExternalLinkIcon />
                                            </a>
                                        )}
                                        {isCompleted && <span className="text-sm font-bold text-green-600">تایید شده</span>}
                                        {isPending && <span className="text-xs font-bold text-yellow-600 animate-pulse">در حال بررسی</span>}
                                        {isRejected && <span className="text-xs font-bold text-red-600">رد شده</span>}
                                        {isCampaignCompleted && !isCompleted && !isPending && !isRejected && <span className="text-sm font-bold text-blue-600">پایان یافته</span>}
                                    </div>
                                </div>
                             );
                        })}
                    </div>
                </section>

                {/* Comments Section Card */}
                <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200/80">
                     <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-lg text-gray-800">کامنت‌ها</h3>
                            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{campaignComments.length}</span>
                        </div>
                         <ChevronRightIcon className="text-gray-400" />
                    </div>

                    {isAuthenticated && (
                        <form onSubmit={handleCommentSubmit} className="mb-6">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="نظر خود را بنویسید..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                rows={3}
                            />
                            <div className="text-left mt-2">
                                <Button type="submit" disabled={!newComment.trim()}>ارسال کامنت</Button>
                            </div>
                        </form>
                    )}

                    <div className="space-y-4">
                        {campaignComments.map(comment => (
                            <div key={comment.id} className="bg-gray-50 p-4 rounded-xl relative group border border-gray-200/80">
                                <div className="flex items-center space-x-3">
                                    <img src={comment.userAvatar} alt={comment.userName} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-bold text-sm text-gray-800">{comment.userName}</p>
                                        <p className="text-xs text-gray-500">{formatRelativeTime(comment.createdAt)}</p>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                                {isAdmin && (
                                    <button 
                                        onClick={() => deleteComment(comment.id)} 
                                        className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="حذف کامنت"
                                    >
                                        <DeleteIcon />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            {/* Floating Action Button */}
            <div className="fixed bottom-24 left-0 right-0 px-4 z-10 flex justify-center">
                <button
                    onClick={handleScrollToTasks}
                    disabled={isCampaignCompleted}
                    className={`w-full max-w-sm text-center font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform ${
                    isCampaignCompleted 
                    ? 'bg-gray-400 text-gray-800 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
                }`}>
                    {isCampaignCompleted ? 'ماموریت‌ها پایان یافته' : 'انجام ماموریت‌ها'}
                </button>
            </div>

            {selectedTask && isModalOpen && (
                <SocialMediaTaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                    task={selectedTask}
                />
            )}

            {selectedTask && isCodeModalOpen && (
                <CodeRedemptionModal
                    isOpen={isCodeModalOpen}
                    onClose={() => setIsCodeModalOpen(false)}
                    onSubmit={handleCodeModalSubmit}
                    task={selectedTask}
                />
            )}

            {taskToConfirm && (
                <ConfirmationModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => {
                        setIsConfirmModalOpen(false);
                        setTaskToConfirm(null);
                    }}
                    onConfirm={handleConfirmCompleteTask}
                    title="تکمیل ماموریت"
                    message="آیا از تکمیل این ماموریت اطمینان دارید؟"
                    confirmText="بله، تکمیل کن"
                    cancelText="انصراف"
                />
            )}
        </div>
    );
};

export default CampaignDetailPage;