import React, { useState } from 'react';
import type { Task, SocialPlatform } from '../types';
import Button from './Button';
import Input from './Input';

interface SocialMediaTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (socialId: string) => void;
  task: Task;
}

const platformLabels: Record<SocialPlatform, { name: string; label: string }> = {
  instagram: { name: 'اینستاگرام', label: 'آیدی اینستاگرام (بدون @)' },
  telegram: { name: 'تلگرام', label: 'آیدی تلگرام (بدون @)' },
  youtube: { name: 'یوتیوب', label: 'نام کانال یوتیوب' },
  x: { name: 'ایکس (توییتر سابق)', label: 'آیدی ایکس (بدون @)' },
  linkedin: { name: 'لینکدین', label: 'آدرس پروفایل لینکدین' },
  facebook: { name: 'فیسبوک', label: 'آدرس پروفایل فیسبوک' },
};

const SocialMediaTaskModal: React.FC<SocialMediaTaskModalProps> = ({ isOpen, onClose, onSubmit, task }) => {
  const [socialId, setSocialId] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || task.type !== 'social_media' || !task.platform) {
    return null;
  }
  
  const platformInfo = platformLabels[task.platform];
  const darkInputStyles = "bg-gray-700 text-white placeholder-gray-400 focus:bg-gray-800 border-gray-600 focus:border-emerald-500 focus:ring-emerald-500";


  const handleSubmit = () => {
    if (socialId.trim() === '') {
      setError(`لطفا شناسه ${platformInfo.name} خود را وارد کنید.`);
      return;
    }
    setError('');
    onSubmit(socialId);
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">انجام ماموریت</h2>
        <p className="text-gray-600 mb-6">
            برای تایید انجام ماموریت <span className="font-semibold text-emerald-600">"{task.description}"</span>، لطفا شناسه کاربری خود در {platformInfo.name} را وارد کنید.
        </p>
        
        <div className="space-y-4">
            <Input 
                label={platformInfo.label}
                id="socialId"
                value={socialId}
                onChange={(e) => {
                    setSocialId(e.target.value);
                    if(error) setError('');
                }}
                placeholder="your.username"
                className={darkInputStyles}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="mt-8">
          <Button onClick={handleSubmit} className="w-full">
            ارسال برای بررسی
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaTaskModal;