import { useContext } from 'react';
import { NotificationPermissionContext } from '../context/NotificationPermissionContext';

export const useNotificationPermission = () => {
  const context = useContext(NotificationPermissionContext);
  if (context === undefined) {
    throw new Error('useNotificationPermission must be used within a NotificationPermissionProvider');
  }
  return context;
};
