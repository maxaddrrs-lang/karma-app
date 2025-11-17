import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationsContext';
import type { User as AdminUser } from '../data/users';
import Button from './Button';

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser;
}

const SendNotificationModal: React.FC<SendNotificationModalProps> = ({ isOpen, onClose, user }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { sendPersonalNotification } = useNotifications();

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {
    if (message.trim() === '') {
      setError('لطفا متن پیام را وارد کنید.');
      return;
    }
    setError('');
    sendPersonalNotification(user.identifier, message);
    alert(`پیام شما برای کاربر ${user.identifier} با موفقیت ارسال شد.`);
    onClose();
  };
  
  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  }

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
        onClick={handleClose}
        aria-modal="true"
        role="dialog"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative transform transition-all scale-100">
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">ارسال پیام شخصی</h2>
        <p className="text-gray-600 mb-6 text-sm">
            این پیام فقط برای کاربر <span className="font-semibold text-emerald-600">{user.identifier}</span> ارسال خواهد شد.
        </p>
        
        <div className="space-y-4">
           <div>
              <label htmlFor="personal-message" className="block text-sm font-medium text-gray-700 mb-2">متن پیام</label>
              <textarea
                  id="personal-message"
                  value={message}
                  onChange={(e) => {
                      setMessage(e.target.value);
                      if(error) setError('');
                  }}
                  rows={5}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="پیام خود را اینجا بنویسید..."
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="mt-8">
          <Button onClick={handleSubmit} className="w-full">
            ارسال پیام
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendNotificationModal;