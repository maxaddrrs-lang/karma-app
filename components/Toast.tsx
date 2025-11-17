import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-emerald-500' : 'bg-red-500';

  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 p-4 rounded-lg text-white shadow-lg z-50 animate-fadeInUp ${bgColor}`}>
      {message}
    </div>
  );
};

export default Toast;
