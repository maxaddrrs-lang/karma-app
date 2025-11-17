import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationsContext';
import Button from '../components/Button';
import type { Notification } from '../context/NotificationsContext';
import { useLanguage } from '../hooks/useLanguage';
import Select from '../components/Select';

const AdminNotificationsPage: React.FC = () => {
    const { 
        newsNotifications, 
        karmaClubNotifications, 
        addAnnouncement,
        deleteNotification,
        sendBulkPersonalNotification
    } = useNotifications();
    const { t } = useLanguage();

    const [message, setMessage] = useState('');
    const [type, setType] = useState<'news' | 'karmaClub'>('news');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [bulkMessage, setBulkMessage] = useState('');

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
        }
    };

    const handleAddAnnouncement = () => {
        if (!message.trim()) {
            alert(t('admin.notifications.enterText'));
            return;
        }
        if (videoFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                addAnnouncement(type, message, reader.result as string);
                setMessage('');
                setVideoFile(null);
                const fileInput = document.getElementById('video-upload') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            };
            reader.readAsDataURL(videoFile);
        } else {
            addAnnouncement(type, message);
            setMessage('');
        }
    };
    
    const handleSendBulk = () => {
        if (!bulkMessage.trim()) {
            alert(t('admin.notifications.enterText'));
            return;
        }
        sendBulkPersonalNotification(bulkMessage);
        alert(t('admin.notifications.bulkSuccessAlert'));
        setBulkMessage('');
    };

    const NotificationList: React.FC<{ title: string, notifications: Notification[] }> = ({ title, notifications }) => (
        <div>
            <h3 className="font-semibold text-lg text-gray-700 mb-3">{title}</h3>
            {notifications.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {notifications.map(n => (
                        <div key={n.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                            <p className="text-gray-800 text-sm truncate">{n.message}</p>
                            <button onClick={() => deleteNotification(n.id)} className="text-red-500 hover:text-red-700 font-semibold py-1 px-3 text-sm transition-colors flex-shrink-0">{t('admin.notifications.delete')}</button>
                        </div>
                    ))}
                </div>
            ) : <p className="text-gray-500 text-center p-4">{t('admin.notifications.noItems')}</p>}
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('admin.notifications.title')}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Create Announcement Form */}
                <section className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">{t('admin.notifications.createTitle')}</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="announcement-message" className="block text-sm font-medium text-gray-700 mb-2">{t('admin.notifications.messageLabel')}</label>
                            <textarea
                                id="announcement-message"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                rows={5}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                placeholder={t('admin.notifications.placeholder')}
                            />
                        </div>
                         <Select
                            label={t('admin.notifications.typeLabel')}
                            id="announcement-type"
                            value={type}
                            onChange={(e) => setType(e.target.value as 'news' | 'karmaClub')}
                            options={[t('notifications.news'), t('notifications.karmaClub')]}
                            optionValues={['news', 'karmaClub']}
                        />
                        <div>
                            <label htmlFor="video-upload" className="block text-sm font-medium text-gray-700 mb-2">{t('admin.notifications.videoLabel')}</label>
                            <input
                                id="video-upload"
                                type="file"
                                accept="video/*"
                                onChange={handleVideoChange}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                            />
                        </div>
                        <Button onClick={handleAddAnnouncement} className="w-full">{t('admin.notifications.sendButton')}</Button>
                    </div>
                </section>

                {/* Lists */}
                <section className="lg:col-span-3 bg-white p-6 rounded-lg shadow space-y-6">
                    <NotificationList title={t('admin.notifications.newsListTitle')} notifications={newsNotifications} />
                     <hr/>
                    <NotificationList title={t('admin.notifications.karmaListTitle')} notifications={karmaClubNotifications} />
                </section>
            </div>
            
            {/* New Section for Bulk Messages */}
            <section className="mt-8 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{t('admin.notifications.bulkTitle')}</h2>
                <p className="text-sm text-gray-500 mb-4">{t('admin.notifications.bulkDescription')}</p>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="bulk-message" className="block text-sm font-medium text-gray-700 mb-2">{t('admin.notifications.bulkMessageLabel')}</label>
                        <textarea
                            id="bulk-message"
                            value={bulkMessage}
                            onChange={e => setBulkMessage(e.target.value)}
                            rows={5}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder={t('admin.notifications.placeholder')}
                        />
                    </div>
                    <Button onClick={handleSendBulk} className="w-full">{t('admin.notifications.bulkSendButton')}</Button>
                </div>
            </section>
        </div>
    );
};

export default AdminNotificationsPage;