import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../hooks/useAuth';
import type { KarmaReward } from '../types';
import Button from '../components/Button';
import ConfirmationModal from '../components/ConfirmationModal';
import Toast from '../components/Toast';
import { useLanguage } from '../hooks/useLanguage';
import VoucherCodeModal from '../components/VoucherCodeModal';

const RewardCard: React.FC<{ reward: KarmaReward; onRedeem: (reward: KarmaReward) => void; disabled: boolean; category: string; }> = ({ reward, onRedeem, disabled, category }) => {
    const { t } = useLanguage();

    // Heuristic: Predefined rewards have small IDs and no spaces in their name/desc keys.
    const isPredefined = reward.id < 1000 && !reward.name.includes(' ');

    const name = isPredefined ? t(`karma_club_rewards.${category}.${reward.name}`) : reward.name;
    const description = isPredefined ? t(`karma_club_rewards.${category}.${reward.description}`) : reward.description;

    return (
        <div className={`bg-white rounded-xl shadow-md p-6 flex flex-col transition-all ${disabled ? 'opacity-50' : 'hover:shadow-lg hover:-translate-y-1'}`}>
            <h3 className="text-xl font-bold text-gray-800">{name}</h3>
            <p className="text-sm text-gray-500 mt-2 flex-grow">{description}</p>
            <div className="flex justify-between items-center mt-6">
                <div className="text-lg font-bold text-yellow-600 flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    <span>{reward.cost} {t('karmaClub.coins')}</span>
                </div>
                <Button onClick={() => onRedeem(reward)} disabled={disabled || reward.quantity <= 0} className="py-2 px-4 text-sm">
                    {reward.quantity > 0 ? t('karmaClub.redeem') : t('karmaClub.unavailable')}
                </Button>
            </div>
             <p className="text-xs text-gray-400 mt-2 text-center">{t('karmaClub.quantityLeft', { count: reward.quantity })}</p>
        </div>
    );
};

const KarmaClubPage: React.FC = () => {
    const { karmaClubRewards, redeemKarmaReward } = useSettings();
    const { karmaCoins, spendKarmaCoins } = useAuth();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState(Object.keys(karmaClubRewards)[0]);
    const [rewardToConfirm, setRewardToConfirm] = useState<KarmaReward | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
    const [receivedCode, setReceivedCode] = useState<string | null>(null);
    
    const handleRedeemClick = (reward: KarmaReward) => {
        if (karmaCoins < reward.cost) {
            setToast({ message: t('karmaClub.notEnoughCoins'), type: 'error' });
            return;
        }
        setRewardToConfirm(reward);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmRedeem = () => {
        if (rewardToConfirm) {
            // Check if user has enough coins before attempting to redeem.
            if (karmaCoins < rewardToConfirm.cost) {
                setToast({ message: t('karmaClub.notEnoughCoins'), type: 'error' });
                setIsConfirmModalOpen(false);
                setRewardToConfirm(null);
                return;
            }
            
            // Attempt to redeem the reward from settings (checks stock, gets code).
            const redeemResult = redeemKarmaReward(rewardToConfirm.id);

            if (redeemResult.success) {
                const isPredefined = rewardToConfirm.id < 1000 && !rewardToConfirm.name.includes(' ');
                const categoryKey = Object.keys(karmaClubRewards).find(c => karmaClubRewards[c].some(r => r.id === rewardToConfirm.id)) || '';
                const rewardName = isPredefined 
                    ? t(`karma_club_rewards.${categoryKey}.${rewardToConfirm.name}`)
                    : rewardToConfirm.name;
                
                // If redemption was successful, spend the coins and pass reward info.
                const spentSuccessfully = spendKarmaCoins(
                    rewardToConfirm.cost, 
                    `خرید جایزه: ${rewardName}`,
                    { name: rewardName, code: redeemResult.code }
                );
                
                if (spentSuccessfully) {
                    if (redeemResult.code) {
                        setReceivedCode(redeemResult.code);
                        setIsVoucherModalOpen(true);
                    } else {
                        setToast({ message: t('karmaClub.redeemSuccess'), type: 'success' });
                    }
                } else {
                    // This case is unlikely if we check coins first, but it's a good safeguard.
                    setToast({ message: t('karmaClub.notEnoughCoins'), type: 'error' });
                    // Here you might want to "undo" the redemption if possible, though current logic doesn't require it.
                }

            } else {
                 setToast({ message: "متاسفانه این جایزه تمام شده است.", type: 'error' });
            }
        }
        setIsConfirmModalOpen(false);
        setRewardToConfirm(null);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="container mx-auto px-4 py-8">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-800">{t('karmaClub.title')}</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">{t('karmaClub.subtitle')}</p>
                    <div className="mt-6 inline-block bg-yellow-100 text-yellow-800 font-bold py-3 px-6 rounded-full text-xl shadow-md">
                        {t('karmaClub.yourBalance')}: {karmaCoins} {t('karmaClub.coins')}
                    </div>
                </header>
                
                <div className="sticky top-[69px] bg-gray-100 py-4 z-10">
                    <div className="flex justify-center border-b border-gray-300">
                        {Object.keys(karmaClubRewards).map(category => (
                             <button
                                key={category}
                                onClick={() => setActiveTab(category)}
                                className={`px-6 py-3 text-lg font-bold transition-colors duration-300 relative ${
                                    activeTab === category ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-500'
                                }`}
                            >
                                {t(`karma_club_rewards.${category}.title`)}
                                {activeTab === category && (
                                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-full"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <main className="mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {karmaClubRewards[activeTab]?.map(reward => (
                            <RewardCard 
                                key={reward.id} 
                                reward={reward} 
                                onRedeem={handleRedeemClick}
                                disabled={karmaCoins < reward.cost}
                                category={activeTab}
                            />
                        ))}
                    </div>
                </main>
            </div>
            {rewardToConfirm && (
                 <ConfirmationModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={handleConfirmRedeem}
                    title={t('karmaClub.confirmTitle')}
                    message={
                        <span>
                            {t('karmaClub.confirmMessage')}
                            <strong className="text-emerald-600"> {rewardToConfirm.name.includes(' ') ? rewardToConfirm.name : t(`karma_club_rewards.${Object.keys(karmaClubRewards).find(c => karmaClubRewards[c].some(r => r.id === rewardToConfirm.id))}.${rewardToConfirm.name}`)} </strong>
                            {t('karmaClub.for')}
                            <strong className="text-yellow-600"> {rewardToConfirm.cost} {t('karmaClub.coins')} </strong>
                            ؟
                        </span>
                    }
                    confirmText={t('karmaClub.confirmButton')}
                />
            )}
            {isVoucherModalOpen && receivedCode && (
                <VoucherCodeModal
                    isOpen={isVoucherModalOpen}
                    onClose={() => setIsVoucherModalOpen(false)}
                    code={receivedCode}
                />
            )}
        </div>
    );
};

export default KarmaClubPage;