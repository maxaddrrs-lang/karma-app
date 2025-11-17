import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  optionValues?: string[]; // Optional array for values, parallel to options
  hasError?: boolean;
}

const Select: React.FC<SelectProps> = ({ label, id, options, optionValues, hasError, className, ...props }) => {
  const { t } = useLanguage();
  const errorClasses = 'border-red-500 focus:border-red-500 focus:ring-red-500';
  const normalClasses = 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500';
  
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        id={id}
        {...props}
        className={`w-full px-4 py-2 border rounded-lg shadow-sm transition-colors bg-white text-gray-900 ${hasError ? errorClasses : normalClasses} ${className || ''}`}
      >
        <option value="">{t('general.select')}</option>
        {options.map((option, index) => (
          <option key={optionValues ? optionValues[index] : option} value={optionValues ? optionValues[index] : option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;