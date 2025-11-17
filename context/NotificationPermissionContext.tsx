import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

type PermissionState = 'granted' | 'denied' | 'default';

interface NotificationPermissionContextType {
  isSupported: boolean;
  permission: PermissionState;
  isSubscribed: boolean;
  requestPermissionAndSubscribe: () => Promise<void>;
}

export const NotificationPermissionContext = createContext<NotificationPermissionContextType | undefined>(undefined);

const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

export const NotificationPermissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<PermissionState>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission as PermissionState);

      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
          setIsSubscribed(!!subscription);
        });
      });
    }
  }, []);
  
  useEffect(() => {
    if (isSupported) {
      const registerServiceWorker = () => {
        navigator.serviceWorker.register('sw.js')
          .then(registration => {
            console.log('Service Worker registered successfully with scope:', registration.scope);
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      };
      
      // Defer registration until after the page has fully loaded.
      window.addEventListener('load', registerServiceWorker);
      
      // Clean up the event listener when the component unmounts.
      return () => window.removeEventListener('load', registerServiceWorker);
    }
  }, [isSupported]);


  const requestPermissionAndSubscribe = async () => {
    if (!isSupported) {
        alert('مرورگر شما از اعلان‌ها پشتیبانی نمی‌کند.');
        return;
    }
    
    // Check if permission is already denied and show a helpful message.
    if (Notification.permission === 'denied') {
        alert('شما قبلا اجازه ارسال اعلان‌ها را رد کرده‌اید. برای فعال‌سازی، لطفا از تنظیمات مرورگر خود اقدام کنید.');
        return;
    }

    const currentPermission = await Notification.requestPermission();
    setPermission(currentPermission);

    if (currentPermission === 'granted') {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          // VAPID public key should be provided by the server in a real app
          // applicationServerKey: urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
        });
        
        // In a real app, you'd send this subscription object to your server.
        // For this local-only app, we'll just store it to know the user is subscribed.
        localStorage.setItem('karma_push_subscription', JSON.stringify(subscription));
        setIsSubscribed(true);
        alert('اعلان‌ها با موفقیت فعال شدند!');

      } catch (error) {
        console.error('Failed to subscribe the user: ', error);
        alert('خطا در فعال‌سازی اعلان‌ها.');
      }
    } else if (currentPermission === 'denied') {
        // This only runs if the user clicks "Block" on the prompt
        alert('شما اجازه ارسال اعلان‌ها را ندادید.');
    }
  };

  return (
    <NotificationPermissionContext.Provider value={{
      isSupported,
      permission,
      isSubscribed,
      requestPermissionAndSubscribe
    }}>
      {children}
    </NotificationPermissionContext.Provider>
  );
};

export const useNotificationPermission = () => {
  const context = useContext(NotificationPermissionContext);
  if (context === undefined) {
    throw new Error('useNotificationPermission must be used within a NotificationPermissionProvider');
  }
  return context;
};