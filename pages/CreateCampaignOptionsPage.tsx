import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../hooks/useLanguage';

// Icons
const BuilderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const TemplateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>;


type MissionDetailValue = {
  labelKey: string;
  quantityLabelKey: string;
  minQuantity: number;
  costPerUnit: number;
  defaultCategory: string;
};


const CreateCampaignOptionsPage: React.FC = () => {
    const { missionDetails, isCampaignBuilderEnabled } = useSettings();
    const { t } = useLanguage();

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 py-12">
                <h1 className="text-center text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4">
                    انتخاب کمپین
                </h1>
                <p className="text-center text-lg text-gray-600 mb-12">
                    اینجا جایی است که دیده شدن شما، به کمک کردن معنا می‌بخشد. یک ماموریت را انتخاب کنید و بخشی از تغییر باشید.
                </p>

                <div className={`grid grid-cols-1 ${isCampaignBuilderEnabled ? 'lg:grid-cols-2' : 'max-w-xl mx-auto'} gap-8 items-stretch`}>
                    {/* Campaign Builder */}
                    {isCampaignBuilderEnabled && (
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200/80 flex flex-col items-center text-center">
                            <BuilderIcon />
                            <h2 className="text-2xl font-bold text-gray-800 mt-4">کمپین ساز</h2>
                            <p className="text-gray-600 mt-2 mb-6 flex-grow">
                                کمپین خود را با جزئیات کامل و به صورت سفارشی طراحی و اجرا کنید. تمام مراحل در اختیار شماست.
                            </p>
                            <Link to="/create" className="block w-full text-center bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors shadow-md hover:shadow-lg">
                                شروع ساخت
                            </Link>
                        </div>
                    )}

                    {/* Ready Templates */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200/80 flex flex-col">
                        <div className="flex flex-col items-center text-center">
                            <TemplateIcon />
                            <h2 className="text-2xl font-bold text-gray-800 mt-4">کمپین های کارما</h2>
                            <p className="text-gray-600 mt-2 mb-6">
                                از الگوهای از پیش تعریف شده ما برای راه اندازی سریع یک کمپین استفاده کنید. فقط نام برند و تعداد را مشخص کنید.
                            </p>
                        </div>
                        <div className="space-y-4">
                            {Object.entries(missionDetails).map(([key, details]) => {
                                const typedDetails = details as MissionDetailValue;
                                return (
                                <Link
                                    key={key}
                                    to={`/create?template=${key}`}
                                    className="block text-right bg-gray-100 p-4 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 border border-transparent transition-all"
                                >
                                    <h3 className="font-bold text-emerald-700">{t(typedDetails.labelKey) || key}</h3>
                                    <p className="text-sm text-gray-500">دسته بندی پیش‌فرض: {t(`categories_list.${typedDetails.defaultCategory}`) || typedDetails.defaultCategory}</p>
                                </Link>
                            );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCampaignOptionsPage;
