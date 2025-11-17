
import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationsContext';
import NewsCard from '../components/NotificationCard';
import { useAuth } from '../hooks/useAuth';
import type { Notification } from '../context/NotificationsContext';
import { useLanguage } from '../hooks/useLanguage';

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const { formatRelativeTime } = useLanguage();
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border animate-fadeInUp">
            <p className="text-gray-800">{notification.message}</p>
            {notification.videoUrl && (
                <video src={notification.videoUrl} controls className="mt-2 rounded-lg w-full"></video>
            )}
            <p className="text-xs text-gray-400 mt-2 text-left">{formatRelativeTime(notification.timestamp)}</p>
        </div>
    );
};

const NotificationsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'news' | 'personal'>('news');
    const { newsArticles, personalNotifications, newsNotifications, karmaClubNotifications } = useNotifications();
    const { isAuthenticated } = useAuth();
    const { t } = useLanguage();

    const generalNotifications = [...newsNotifications, ...karmaClubNotifications].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const sortedPersonalNotifications = [...personalNotifications].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());


    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 py-8">
                <h1 className="text-center text-3xl sm:text-4xl font-extrabold text-gray-800 mb-8">
                    اخبار و اعلان‌ها
                </h1>

                {isAuthenticated && (
                    <div className="mb-8 sticky top-[69px] bg-gray-100/90 backdrop-blur-sm py-2 z-10">
                        <div className="flex justify-center border-b border-gray-300">
                             <button
                                onClick={() => setActiveTab('news')}
                                className={`px-6 py-3 text-lg font-bold transition-colors duration-300 relative ${
                                    activeTab === 'news' ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-500'
                                }`}
                            >
                                عمومی
                                {activeTab === 'news' && <span className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-full"></span>}
                            </button>
                             <button
                                onClick={() => setActiveTab('personal')}
                                className={`px-6 py-3 text-lg font-bold transition-colors duration-300 relative ${
                                    activeTab === 'personal' ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-500'
                                }`}
                            >
                                شخصی
                                {activeTab === 'personal' && <span className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-full"></span>}
                            </button>
                        </div>
                    </div>
                )}
                
                <div className="space-y-6 max-w-3xl mx-auto">
                    {activeTab === 'news' && (
                        <>
                             {generalNotifications.map(notif => (
                                <NotificationItem key={notif.id} notification={notif} />
                            ))}
                            {newsArticles.map(article => (
                                <NewsCard key={article.id} article={article} />
                            ))}
                        </>
                    )}
                    
                    {activeTab === 'personal' && isAuthenticated && (
                         <>
                            {sortedPersonalNotifications.length > 0 ? (
                                sortedPersonalNotifications.map(notif => (
                                    <NotificationItem key={notif.id} notification={notif} />
                                ))
                            ) : (
                                <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md border">
                                    <h2 className="mt-4 text-2xl font-semibold text-gray-700">هیچ پیام شخصی ندارید</h2>
                                    <p className="mt-4 text-gray-500">اعلان‌های مربوط به فعالیت‌های شما در اینجا نمایش داده می‌شوند.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
