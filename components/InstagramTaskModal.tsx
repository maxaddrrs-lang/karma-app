
import React, { useState } from 'react';
import type { Task } from '../types';
import Button from './Button';
import Input from './Input';

interface InstagramTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (instagramId: string) => void;
  task: Task;
}

const InstagramTaskModal: React.FC<InstagramTaskModalProps> = ({ isOpen, onClose, onSubmit, task }) => {
  const [instagramId, setInstagramId] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {
    if (instagramId.trim() === '') {
      setError('لطفا آیدی اینستاگرام خود را وارد کنید.');
      return;
    }
    setError('');
    onSubmit(instagramId);
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
            برای تایید انجام ماموریت <span className="font-semibold text-emerald-600">"{task.description}"</span>، لطفا آیدی صفحه اینستاگرام خود را وارد کنید. پس از بررسی توسط کارشناس، وضعیت این ماموریت برای شما بروزرسانی خواهد شد.
        </p>
        
        <div className="space-y-4">
            <Input 
                label="آیدی اینستاگرام (بدون @)"
                id="instagramId"
                value={instagramId}
                onChange={(e) => {
                    setInstagramId(e.target.value);
                    if(error) setError('');
                }}
                placeholder="your.username"
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

export default InstagramTaskModal;