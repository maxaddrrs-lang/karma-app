import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface CampaignProgressBarProps {
  progress: number;
  targetAmount: number;
  daysLeft: number;
}


const CampaignProgressBar: React.FC<CampaignProgressBarProps> = ({ progress, targetAmount, daysLeft }) => {
  const { t, formatNumber } = useLanguage();
  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-1 text-base font-medium">
        <span className="text-emerald-600">{t('campaignProgressBar.progress')}</span>
        <span className="text-gray-500">%{progress}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center mt-3 text-center">
        <div>
          <p className="text-base text-gray-500">{t('campaignProgressBar.target')}</p>
          <p className="font-bold text-gray-800 text-lg">{formatNumber(targetAmount)} <span className="text-sm">{t('campaignProgressBar.toman')}</span></p>
        </div>
        <div>
           <p className="text-base text-gray-500">{t('campaignProgressBar.daysLeft')}</p>
           <p className="font-bold text-gray-800 text-lg">{daysLeft}</p>
        </div>
      </div>
    </div>
  );
};

export default CampaignProgressBar;