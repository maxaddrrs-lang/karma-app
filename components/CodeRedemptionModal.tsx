
import React, { useState } from 'react';
import type { Task } from '../types';
import Button from './Button';
import Input from './Input';

interface CodeRedemptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  task: Task;
}

const CodeRedemptionModal: React.FC<CodeRedemptionModalProps> = ({ isOpen, onClose, onSubmit, task }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {
    if (code.trim() === '') {
      setError('لطفا کد دریافت شده را وارد کنید.');
      return;
    }
    setError('');
    onSubmit(code);
  };
  
  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  }
  
  const darkInputStyles = "bg-gray-700 text-white placeholder-gray-400 focus:bg-gray-800 border-gray-600 focus:border-emerald-500 focus:ring-emerald-500";

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
            برای تکمیل ماموریت <span className="font-semibold text-emerald-600">"{task.description}"</span>، لطفا کدی را که از برنامه همکار دریافت کرده‌اید در کادر زیر وارد کنید.
        </p>
        
        <div className="space-y-4">
            <Input 
                label="کد تایید"
                id="redemptionCode"
                value={code}
                onChange={(e) => {
                    setCode(e.target.value);
                    if(error) setError('');
                }}
                placeholder="کد را اینجا وارد کنید"
                className={darkInputStyles}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="mt-8">
          <Button onClick={handleSubmit} className="w-full">
            ثبت و تکمیل ماموریت
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeRedemptionModal;
