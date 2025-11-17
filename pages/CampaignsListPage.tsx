import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CampaignCard from '../components/CampaignCard';
import { useCampaigns } from '../hooks/useCampaigns';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import { CATEGORY_KEYS } from '../constants';
import { useLanguage } from '../hooks/useLanguage';

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const EmptyStateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 10.5h.008v.008h-.008v-.008zm0 0h.008v.008h-.008v-.008zm4.5-.001h.008v.008h-.008v-.008zm0 0h.008v.008h-.008v-.008z" />
    </svg>
);


const CampaignsListPage: React.FC = () => {
  const { campaigns } = useCampaigns();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [locationFilter, setLocationFilter] = useState('');
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const translatedCategoryNames = CATEGORY_KEYS.map(key => t(`categories_list.${key}`));

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setLocationFilter('');
  };

  const filteredCampaigns = campaigns
    .filter(campaign => campaign.status === 'active')
    .filter(campaign => {
      const searchTermMatch = searchTerm === '' ||
        campaign.mission.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.brandName.toLowerCase().includes(searchTerm.toLowerCase());

      const categoryMatch = selectedCategory === '' || campaign.category === selectedCategory;

      const locationMatch = locationFilter === '' ||
        campaign.location.toLowerCase().includes(locationFilter.toLowerCase());

      return searchTermMatch && categoryMatch && locationMatch;
    });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">{t('campaignsList.title')}</h1>
            <p className="mt-4 text-lg text-gray-600">{t('campaignsList.subtitle')}</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg mb-10 border border-gray-200/80">
            <button 
                className="w-full flex justify-between items-center md:hidden"
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                aria-expanded={filtersExpanded}
                aria-controls="filters-content"
            >
                <span className="text-lg font-bold text-gray-700">{t('campaignsList.filters')}</span>
                <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${filtersExpanded ? 'rotate-180' : ''}`} />
            </button>
            
            <div
                id="filters-content"
                className={`
                    grid transition-[grid-template-rows] duration-300 ease-in-out
                    md:block
                    ${filtersExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}
                    md:grid-rows-none
                `}
            >
                <div className="overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 md:pt-0">
                        <Input
                            label={t('campaignsList.searchPlaceholder')}
                            id="search"
                            placeholder={t('campaignsList.searchPlaceholder')}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <Select
                            label={t('campaignsList.category')}
                            id="category"
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                            options={translatedCategoryNames}
                            optionValues={CATEGORY_KEYS}
                        />
                        <Input
                            label={t('campaignsList.location')}
                            id="location"
                            placeholder={t('campaignsList.locationPlaceholder')}
                            value={locationFilter}
                            onChange={e => setLocationFilter(e.target.value)}
                        />
                    </div>
                     <div className="mt-6 text-center">
                        <Button variant="secondary" onClick={handleResetFilters}>
                            {t('campaignsList.resetFilters')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        {/* Campaigns Grid */}
        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md border">
            <EmptyStateIcon />
            <h2 className="mt-4 text-2xl font-semibold text-gray-700">{t('campaignsList.noCampaigns')}</h2>
            <p className="mt-4 text-gray-500">{t('campaignsList.tryChangingFilters')}</p>
            <Button onClick={handleResetFilters} className="mt-6">
              {t('campaignsList.showAllCampaigns')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignsListPage;