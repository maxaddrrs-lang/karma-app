import { useContext } from 'react';
import { SupportChatContext } from '../context/SupportChatContext';

export const useSupportChat = () => {
  const context = useContext(SupportChatContext);
  if (context === undefined) {
    throw new Error('useSupportChat must be used within a SupportChatProvider');
  }
  return context;
};