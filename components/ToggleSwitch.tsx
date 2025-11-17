import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label, disabled = false }) => {
  const switchCore = (
    <>
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={(e) => !disabled && onChange(e.target.checked)} 
        className="sr-only peer" 
        disabled={disabled} 
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-emerald-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
    </>
  );

  if (label) {
    return (
      <label className={`flex items-center justify-between p-4 border rounded-lg ${disabled ? 'cursor-not-allowed opacity-50 bg-gray-100' : 'cursor-pointer bg-white'}`}>
        <span className="font-semibold text-gray-700">{label}</span>
        <div className="relative inline-flex items-center">{switchCore}</div>
      </label>
    );
  }

  // No label version, for use inside other components
  return (
    <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
      {switchCore}
    </label>
  );
};

export default ToggleSwitch;
