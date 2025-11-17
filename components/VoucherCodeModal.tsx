import React, { useState } from 'react';
import Button from './Button';

interface VoucherCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}

const VoucherCodeModal: React.FC<VoucherCodeModalProps> = ({ isOpen, onClose, code }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  }

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
        onClick={handleClose}
        aria-modal="true"
        role="dialog"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative transform transition-all scale-100 text-center">
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">جایزه شما!</h2>
        <p className="text-gray-600 mb-6">
            تبریک! کد تخفیف زیر برای شما فعال شد.
        </p>
        
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 mb-6">
            <p className="font-mono text-2xl font-bold text-emerald-600 tracking-widest">{code}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleCopy} className="w-full">
            {copied ? 'کپی شد!' : 'کپی کردن کد'}
          </Button>
          <Button onClick={onClose} variant="secondary" className="w-full">
            بستن
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoucherCodeModal;