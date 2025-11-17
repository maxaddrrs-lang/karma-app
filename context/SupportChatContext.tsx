import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import type { SupportChatMessage } from '../types';
import * as api from '../services/api';

interface SupportChatContextType {
  chats: Record<string, SupportChatMessage[]>;
  sendMessage: (userId: string, text: string, sender: 'user' | 'support') => void;
  markAsRead: (userId: string) => void;
  getUnreadCount: (userId: string) => number;
  initializeChat: (userId: string) => void;
}

export const SupportChatContext = createContext<SupportChatContextType | undefined>(undefined);

export const SupportChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Record<string, SupportChatMessage[]>>({});

  useEffect(() => {
    api.fetchChats().then(savedChats => {
      setChats(savedChats);
    }).catch(error => {
      console.error("Failed to load support chats:", error);
    });
  }, []);

  const saveChats = (updatedChats: Record<string, SupportChatMessage[]>) => {
    api.saveChats(updatedChats);
    setChats(updatedChats);
  };

  const initializeChat = (userId: string) => {
    setChats(prevChats => {
      if (prevChats[userId] && prevChats[userId].length > 0) {
        return prevChats; // Chat already initialized
      }
      
      const welcomeMessage: SupportChatMessage = {
        id: `${Date.now()}-welcome`,
        sender: 'support',
        text: "سلام! به بخش پشتیبانی کارما خوش آمدید. چطور می‌توانیم به شما کمک کنیم؟",
        timestamp: new Date().toISOString(),
        readByAdmin: true,
      };
      
      const updatedChats = { ...prevChats, [userId]: [welcomeMessage] };
      saveChats(updatedChats);
      return updatedChats;
    });
  };

  const sendMessage = (userId: string, text: string, sender: 'user' | 'support') => {
    const newMessage: SupportChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      sender,
      text,
      timestamp: new Date().toISOString(),
      readByAdmin: sender === 'support', // Messages from support are "read" by admin
    };

    setChats(prevChats => {
      const userChatHistory = prevChats[userId] || [];
      const updatedHistory = [...userChatHistory, newMessage];
      const updatedChats = { ...prevChats, [userId]: updatedHistory };
      saveChats(updatedChats);
      return updatedChats;
    });
  };

  const markAsRead = (userId: string) => {
    setChats(prevChats => {
      const userChatHistory = prevChats[userId];
      if (!userChatHistory || userChatHistory.every(m => m.readByAdmin)) {
        return prevChats; // No changes needed
      }
      const updatedHistory = userChatHistory.map(message => ({ ...message, readByAdmin: true }));
      const updatedChats = { ...prevChats, [userId]: updatedHistory };
      saveChats(updatedChats);
      return updatedChats;
    });
  };

  const getUnreadCount = (userId: string): number => {
    const userChatHistory = chats[userId] || [];
    return userChatHistory.filter(m => m.sender === 'user' && !m.readByAdmin).length;
  };

  return (
    <SupportChatContext.Provider value={{ chats, sendMessage, markAsRead, getUnreadCount, initializeChat }}>
      {children}
    </SupportChatContext.Provider>
  );
};

export const useSupportChat = () => {
    const context = useContext(SupportChatContext);
    if (context === undefined) {
      throw new Error('useSupportChat must be used within a SupportChatProvider');
    }
    return context;
};
