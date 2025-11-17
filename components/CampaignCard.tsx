import React from 'react';
import { Link } from 'react-router-dom';
import type { Campaign } from '../types';
import CampaignProgressBar from './CampaignProgressBar';
import { getCategoryIcon } from './CategoryIcons';
import { useLanguage } from '../hooks/useLanguage';

interface CampaignCardProps {
  campaign: Campaign;
  variant?: 'default' | 'suggested';
}

const VerifiedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm-1.4,13.7L6.45,11.55l1.41-1.41L10.6,13.47l5.25-5.25,1.41,1.41Z" />
    </svg>
);


const DefaultCard: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
    const { t } = useLanguage();
    const categoryToDisplay = t(`categories_list.${campaign.category}`);

    return (
        <div className="group bg-white rounded-xl shadow-md border border-gray-200/80 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
            <img className="w-full h-48 object-cover" src={campaign.imageUrl} alt={campaign.mission} />
            <div className="p-5 flex flex-col flex-grow">
                <span className="inline-flex items-center bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                    <span className="me-1">{getCategoryIcon(campaign.category, "h-4 w-4")}</span>
                    {categoryToDisplay}
                </span>
                <h3 className="mt-3 font-bold text-xl leading-tight text-gray-800 truncate group-hover:text-emerald-600 transition-colors">{campaign.mission}</h3>
                <div className="mt-2 text-gray-700 flex items-center space-x-3 text-lg">
                    {campaign.brandLogoUrl && <img src={campaign.brandLogoUrl} onError={(e) => e.currentTarget.style.display='none'} alt={`${campaign.brandName} logo`} className="w-12 h-12 rounded-full object-contain" />}
                    <span>{t('campaignCard.by')} <span className="font-semibold text-gray-800">{campaign.brandName}</span></span>
                    <VerifiedIcon />
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ms-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{campaign.location}</span>
                </div>
                
                <div className="mt-6">
                    <CampaignProgressBar
                        progress={campaign.progress}
                        targetAmount={campaign.targetAmount}
                        daysLeft={campaign.daysLeft}
                    />
                </div>

                <div className="mt-auto pt-6">
                    <Link to={`/campaigns/${campaign.id}`} className="block w-full text-center bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors shadow-md hover:shadow-lg">
                        {t('campaignCard.viewAndJoin')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

const SuggestedCard: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
    const { t, formatNumber } = useLanguage();
    return (
        <Link to={`/campaigns/${campaign.id}`} className="bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 w-72 md:w-80 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all">
            <img className="w-full h-36 object-cover" src={campaign.imageUrl} alt={campaign.mission} />
            <div className="p-4">
                <div className="flex items-center space-x-3 text-lg font-semibold text-gray-600">
                     {campaign.brandLogoUrl && <img src={campaign.brandLogoUrl} onError={(e) => e.currentTarget.style.display='none'} alt={`${campaign.brandName} logo`} className="w-10 h-10 rounded-full object-contain" />}
                    <span>{campaign.brandName}</span>
                    <VerifiedIcon />
                </div>
                <h4 className="mt-2 font-bold text-lg text-gray-900 truncate">{campaign.mission}</h4>
                <p className="text-sm text-gray-600 mt-1">{campaign.location}</p>

                <div className="mt-4">
                     <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${campaign.progress}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
                        <span>{t('campaignCard.completed', { percent: campaign.progress })}</span>
                        <span>{t('campaignCard.totalAmount')} <span className="font-bold">{formatNumber(campaign.targetAmount / 1000000)} {t('campaignCard.million')} {t('campaignCard.toman')}</span></span>
                    </div>
                </div>

                <div className="mt-4">
                     <div className="w-full bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-emerald-600 transition-colors text-center text-base">
                        {t('campaignCard.missionReport')}
                    </div>
                </div>
            </div>
        </Link>
    );
};


const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, variant = 'default' }) => {
  if (variant === 'suggested') {
    return <SuggestedCard campaign={campaign} />;
  }
  return <DefaultCard campaign={campaign} />;
};

export default CampaignCard;