import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hasError?: boolean;
}

const Input: React.FC<InputProps> = ({ label, id, hasError, className, ...props }) => {
  const errorClasses = 'border-red-500 focus:border-red-500 focus:ring-red-500';
  const normalClasses = 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500';

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className={`w-full px-4 py-2 border rounded-lg shadow-sm transition-colors ${hasError ? errorClasses : normalClasses} ${className || ''}`}
      />
    </div>
  );
};

export default Input;