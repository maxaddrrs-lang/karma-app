

import React, { useState, useMemo } from 'react';
import { useSettings } from '../context/SettingsContext';
import Button from '../components/Button';
import Input from '../components/Input';
import type { KarmaReward } from '../types';
import KarmaRewardEditModal from '../components/KarmaRewardEditModal';
import { useLanguage } from '../hooks/useLanguage';

type NewRewardState = Omit<KarmaReward, 'id' | 'codes'>;

const AdminKarmaClubPage: React.FC = () => {
    const { karmaClubRewards, setKarmaClubRewards } = useSettings();
    const { t } = useLanguage();
    const [editingReward, setEditingReward] = useState<KarmaReward | null>(null);
    
    const initialNewRewardState: NewRewardState = {
        name: '', cost: 0, description: '', quantity: 0
    };
    const [newReward, setNewReward] = useState<NewRewardState>(initialNewRewardState);
    const [newRewardCodes, setNewRewardCodes] = useState('');
    const [newRewardCategory, setNewRewardCategory] = useState(Object.keys(karmaClubRewards)[0] || 'discounts');

    const darkInputStyles = "bg-gray-700 text-white placeholder-gray-400 focus:bg-gray-800 border-gray-600 focus:border-emerald-500 focus:ring-emerald-500";
    
    const newCodesCount = useMemo(() => {
      return newRewardCodes.split('\n').map(c => c.trim()).filter(Boolean).length;
    }, [newRewardCodes]);
    
    const handleUpdateReward = (updatedReward: KarmaReward) => {
        setKarmaClubRewards(prev => {
            const newState = { ...prev };
            for (const category in newState) {
                const index = newState[category].findIndex(r => r.id === updatedReward.id);
                if (index > -1) {
                    newState[category][index] = updatedReward;
                    break;
                }
            }
            return newState;
        });
        setEditingReward(null);
    };
    
    const handleDeleteReward = (id: number) => {
        if (window.confirm(t('admin.deleteRewardConfirmation'))) {
            setKarmaClubRewards(prev => {
                const newState = { ...prev };
                for (const category in newState) {
                    newState[category] = newState[category].filter(r => r.id !== id);
                }
                return newState;
            });
        }
    };
    
    const handleNewRewardChange = (field: keyof NewRewardState, value: string | number) => {
        setNewReward(prev => ({ ...prev, [field]: value }));
    };
    
    const handleAddNewReward = () => {
        if (!newReward.name || newReward.cost <= 0 || !newRewardCategory) {
            alert(t('admin.fillRewardFields'));
            return;
        }

        const codesArray = newRewardCodes.split('\n').map(c => c.trim()).filter(Boolean);
            
        const isCodeBased = codesArray.length > 0;

        const newRewardWithId: KarmaReward = {
            id: Date.now(),
            ...newReward,
            quantity: isCodeBased ? codesArray.length : newReward.quantity,
            codes: isCodeBased ? codesArray : undefined,
        };

        setKarmaClubRewards(prev => ({
            ...prev,
            [newRewardCategory]: [...(prev[newRewardCategory] || []), newRewardWithId]
        }));
        setNewReward(initialNewRewardState);
        setNewRewardCodes('');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">مدیریت باشگاه کارما</h1>

            <section className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">جوایز موجود</h2>
                <div className="space-y-4">
                    {Object.entries(karmaClubRewards).map(([category, rewards]) => (
                        <div key={category}>
                            <h3 className="font-semibold text-lg text-gray-700 mb-2">{t(`karma_club_rewards.${category}.title`)}</h3>
                            <div className="space-y-2">
                                {(rewards as KarmaReward[]).map(reward => {
                                    const isPredefined = reward.id < 1000 && !reward.name.includes(' ');
                                    const displayName = isPredefined ? t(`karma_club_rewards.${category}.${reward.name}`) : reward.name;
                                    return (
                                        <div key={reward.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-50 rounded-lg border">
                                            <div>
                                                <p className="font-semibold text-gray-800">{displayName}</p>
                                                <p className="text-xs text-gray-500">{reward.cost} سکه • {reward.quantity} عدد باقی مانده</p>
                                            </div>
                                            <div className="flex space-x-2 space-x-reverse mt-2 sm:mt-0 flex-shrink-0">
                                                <Button onClick={() => setEditingReward(reward)} variant="secondary" className="py-1 px-3 text-xs">ویرایش</Button>
                                                <Button onClick={() => handleDeleteReward(reward.id)} variant="secondary" className="py-1 px-3 text-xs text-red-600 bg-red-100 hover:bg-red-200">حذف</Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

             <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-800 mb-4">افزودن جایزه جدید</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Input label="نام جایزه" id="new-reward-name" value={newReward.name} onChange={e => handleNewRewardChange('name', e.target.value)} className={darkInputStyles} />
                     <Input label="توضیحات" id="new-reward-desc" value={newReward.description} onChange={e => handleNewRewardChange('description', e.target.value)} className={darkInputStyles} />
                     <Input label="هزینه (سکه)" type="number" id="new-reward-cost" value={newReward.cost || ''} onChange={e => handleNewRewardChange('cost', Number(e.target.value))} className={darkInputStyles} />
                     
                     <Input 
                        label="تعداد موجود" 
                        type="number" 
                        id="new-reward-qty" 
                        value={newCodesCount > 0 ? newCodesCount : (newReward.quantity || '')} 
                        onChange={e => handleNewRewardChange('quantity', Number(e.target.value))} 
                        className={`${darkInputStyles} ${newCodesCount > 0 ? 'bg-gray-600 cursor-not-allowed' : ''}`}
                        disabled={newCodesCount > 0} 
                    />

                    <div className="md:col-span-2">
                        <label htmlFor="new-reward-codes" className="block text-sm font-medium text-gray-700 mb-2">لیست کدها (اختیاری - هر کد در یک خط)</label>
                        <textarea
                            id="new-reward-codes"
                            value={newRewardCodes}
                            onChange={e => setNewRewardCodes(e.target.value)}
                            rows={5}
                            placeholder="CODE-123&#10;CODE-456&#10;CODE-789"
                            className={`w-full p-2 border rounded-lg shadow-sm ${darkInputStyles}`}
                        />
                        <p className="text-xs text-gray-400 mt-1">اگر کدی وارد کنید، موجودی به صورت خودکار محاسبه می‌شود.</p>
                    </div>

                    <div>
                         <label htmlFor="new-reward-category" className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
                        <select
                            id="new-reward-category"
                            value={newRewardCategory}
                            onChange={e => setNewRewardCategory(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg shadow-sm transition-colors bg-white ${darkInputStyles}`}
                        >
                            {Object.keys(karmaClubRewards).map(catKey => (
                                <option key={catKey} value={catKey}>{t(`karma_club_rewards.${catKey}.title`)}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <Button onClick={handleAddNewReward} className="mt-4">افزودن جایزه</Button>
             </section>

            <KarmaRewardEditModal 
                isOpen={!!editingReward}
                onClose={() => setEditingReward(null)}
                onSave={handleUpdateReward}
                reward={editingReward}
            />
        </div>
    );
};

export default AdminKarmaClubPage;