import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { NEWS_DATA } from '../data/notifications';
import type { NewsArticle } from '../types';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/api';

export interface Notification {
  id: string;
  type: 'news' | 'karmaClub' | 'personal';
  message: string;
  timestamp: string; // ISO string
  read: boolean;
  videoUrl?: string;
  userId?: string; // For personal notifications
}

interface NotificationsContextType {
  newsNotifications: Notification[];
  karmaClubNotifications: Notification[];
  personalNotifications: Notification[];
  newsArticles: NewsArticle[];
  addAnnouncement: (type: 'news' | 'karmaClub', message: string, videoUrl?: string) => void;
  deleteNotification: (id: string) => void;
  sendPersonalNotification: (userId: string, message: string) => void;
  sendBulkPersonalNotification: (message: string) => void;
  markAsRead: (type: 'news' | 'karmaClub' | 'personal', userId?: string) => void;
}

export const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { userIdentifier } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newsArticles] = useState<NewsArticle[]>(NEWS_DATA);

  useEffect(() => {
    api.fetchNotifications().then(savedNotifications => {
        setNotifications(savedNotifications);
    }).catch(error => {
        console.error("Failed to load notifications:", error);
    });
  }, []);

  const saveNotifications = (updatedNotifications: Notification[]) => {
    setNotifications(updatedNotifications);
    api.saveNotifications(updatedNotifications);
  };
  
  const addAnnouncement = (type: 'news' | 'karmaClub', message: string, videoUrl?: string) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      type,
      message,
      videoUrl,
      timestamp: new Date().toISOString(),
      read: false,
    };
    saveNotifications([...notifications, newNotif]);
  };
  
  const sendPersonalNotification = (userId: string, message: string) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      type: 'personal',
      message,
      userId,
      timestamp: new Date().toISOString(),
      read: false,
    };
    saveNotifications([...notifications, newNotif]);
  };

  const sendBulkPersonalNotification = async (message: string) => {
      try {
            const allUsers = await api.fetchUsers();
            const newNotifications = allUsers.map(user => ({
                id: `notif-${Date.now()}-${Math.random()}`,
                type: 'personal' as const,
                message,
                userId: user.identifier,
                timestamp: new Date().toISOString(),
                read: false,
            }));
            saveNotifications([...notifications, ...newNotifications]);
        } catch (error) {
            console.error("Failed to send bulk notifications:", error);
        }
  };

  const deleteNotification = (id: string) => {
    saveNotifications(notifications.filter(n => n.id !== id));
  };

  const markAsRead = (type: 'news' | 'karmaClub' | 'personal', userId?: string) => {
    // This is a simplified version. A real implementation would be more robust.
  };

  const newsNotifications = notifications.filter(n => n.type === 'news');
  const karmaClubNotifications = notifications.filter(n => n.type === 'karmaClub');
  const personalNotifications = notifications.filter(n => n.type === 'personal' && n.userId === userIdentifier);


  return (
    <NotificationsContext.Provider value={{
      newsNotifications,
      karmaClubNotifications,
      personalNotifications,
      newsArticles,
      addAnnouncement,
      deleteNotification,
      sendPersonalNotification,
      sendBulkPersonalNotification,
      markAsRead
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
      throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
};
