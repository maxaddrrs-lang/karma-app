import React, { useState } from 'react';
import AdminAiAssistantPage from './AdminAiAssistantPage';
import AdminAiAnalystPage from './AdminAiAnalystPage';
import AdminSystemPage from './AdminSystemPage';

type SettingsTab = 'ai_assistant' | 'ai_analyst' | 'system';

const SETTINGS_TABS = [
    { id: 'system', label: 'سیستم' },
    { id: 'ai_assistant', label: 'دستیار هوش مصنوعی' },
    { id: 'ai_analyst', label: 'تحلیلگر هوش مصنوعی' },
];


const AdminSettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('system');

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'ai_assistant':
                return <AdminAiAssistantPage />;
            case 'ai_analyst':
                return <AdminAiAnalystPage />;
            case 'system':
                return <AdminSystemPage />;
            default:
                return <AdminSystemPage />;
        }
    };

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 flex-shrink-0">تنظیمات</h1>

            <div className="flex-shrink-0 border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-6 space-x-reverse" aria-label="Tabs">
                    {SETTINGS_TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as SettingsTab)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id
                                    ? 'border-emerald-500 text-emerald-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex-grow overflow-y-auto">
                {renderActiveTab()}
            </div>
        </div>
    );
};

export default AdminSettingsPage;