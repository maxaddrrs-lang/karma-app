
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Transaction } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import ConfirmationModal from '../components/ConfirmationModal';
import Input from '../components/Input';
import Button from '../components/Button';

// --- Icons ---
const WithdrawIcon = () => <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const TopUpIcon = () => <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;

const DonationBalancePage: React.FC = () => {
    const navigate = useNavigate();
    const { karmaCoins, transactions, contributionValue, addDirectContribution } = useAuth();
    const { t, formatNumber } = useLanguage();

    const [isTopUpOpen, setIsTopUpOpen] = useState(false);
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState<number | ''>('');
    const [error, setError] = useState('');
    
    const groupTransactionsByMonth = (transactions: Transaction[]): Record<string, Transaction[]> => {
        return transactions.reduce((acc: Record<string, Transaction[]>, tx) => {
            const date = new Date(tx.date);
            const persianDate = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long' }).format(date);
            if (!acc[persianDate]) {
                acc[persianDate] = [];
            }
            acc[persianDate].push(tx);
            return acc;
        }, {});
    };
    
    const groupedTransactions = groupTransactionsByMonth(transactions);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fa-IR', {
            day: 'numeric',
            month: 'long',
        });
    };

    const handleConfirmTopUp = () => {
        if (typeof topUpAmount !== 'number' || topUpAmount <= 0) {
            setError('لطفا مبلغ معتبری وارد کنید.');
            return;
        }
        addDirectContribution(topUpAmount);
        setError('');
        setTopUpAmount('');
        setIsTopUpOpen(false);
    };
    
    const handleConfirmWithdraw = () => {
        // This is a simulation, so we just close the modal.
        // In a real app, you might call withdrawContribution(amount).
        setIsWithdrawOpen(false);
        alert('درخواست برداشت شما (به صورت شبیه‌سازی شده) ثبت شد.');
    };

    const TopUpModal = () => (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
            onClick={() => setIsTopUpOpen(false)}
        >
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">افزایش موجودی (شبیه‌سازی)</h2>
                <p className="text-gray-600 mb-6">مبلغ مورد نظر برای افزایش ارزش ریالی مشارکت خود را وارد کنید.</p>
                 <Input 
                    label="مبلغ به تومان"
                    id="topUpAmount"
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => {
                        setTopUpAmount(Number(e.target.value));
                        if(error) setError('');
                    }}
                    placeholder="50,000"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                <div className="mt-8 flex justify-end gap-4">
                    <Button variant="secondary" onClick={() => setIsTopUpOpen(false)}>انصراف</Button>
                    <Button onClick={handleConfirmTopUp}>تایید و افزایش</Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white min-h-screen">
            <header className="sticky top-0 bg-white z-10 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center">
                    <button onClick={() => navigate(-1)} className="text-gray-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-xl font-bold text-gray-800 text-center flex-grow">{t('donationBalance.title')}</h1>
                    <div className="w-6"></div> {/* Spacer */}
                </div>
            </header>

            <main className="container mx-auto p-4">
                {/* Balance Display */}
                <section className="text-center py-6">
                    <p className="text-sm text-gray-500">{t('donationBalance.totalContribution')}</p>
                    <p className="text-6xl font-extrabold text-green-600 mt-1">{formatNumber(contributionValue)} <span className="text-3xl font-semibold">{t('donationBalance.toman')}</span></p>
                    <p className="text-md text-gray-600 mt-4">{t('donationBalance.karmaCoinsBalance')} <span className="font-bold text-yellow-600">{karmaCoins}</span></p>
                </section>

                {/* Action Buttons */}
                <section className="bg-white rounded-xl shadow-md border border-gray-200 p-2 flex justify-around items-center mb-8">
                    <button onClick={() => setIsWithdrawOpen(true)} className="flex-1 flex flex-col items-center justify-center p-3 space-y-1 text-gray-700 hover:bg-gray-100 rounded-lg">
                        <WithdrawIcon />
                        <span className="text-sm font-semibold">{t('donationBalance.withdraw')}</span>
                    </button>
                    <div className="w-px h-12 bg-gray-200"></div>
                    <button onClick={() => setIsTopUpOpen(true)} className="flex-1 flex flex-col items-center justify-center p-3 space-y-1 text-gray-700 hover:bg-gray-100 rounded-lg">
                        <TopUpIcon />
                        <span className="text-sm font-semibold">{t('donationBalance.topUp')}</span>
                    </button>
                </section>

                {/* History */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('donationBalance.transactionHistory')}</h2>
                    <div className="space-y-4">
                        {Object.entries(groupedTransactions).map(([month, txs]) => (
                            <div key={month}>
                                <div className="bg-gray-100 rounded-md px-3 py-1 text-sm font-semibold text-gray-600 mb-3">
                                    {month}
                                </div>
                                <ul className="space-y-2">
                                    {txs.map(tx => (
                                        <li key={tx.id} className="flex justify-between items-center py-3 border-b border-gray-100">
                                            <div>
                                                <p className="font-semibold text-gray-800">{tx.description}</p>
                                                <p className="text-sm text-gray-500">{formatDate(tx.date)}</p>
                                            </div>
                                            <div className="text-left">
                                                 <p className={`font-bold ${tx.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {tx.type === 'earn' ? `+${Math.abs(tx.amount)}` : `-${Math.abs(tx.amount)}`}
                                                </p>
                                                <p className="text-xs text-green-600">{t('donationBalance.success')}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                         {transactions.length === 0 && (
                            <p className="text-center text-gray-500 py-8">{t('donationBalance.noHistory')}</p>
                        )}
                    </div>
                </section>
            </main>
            
            {isTopUpOpen && <TopUpModal />}
            
            <ConfirmationModal
                isOpen={isWithdrawOpen}
                onClose={() => setIsWithdrawOpen(false)}
                onConfirm={handleConfirmWithdraw}
                title="درخواست برداشت وجه"
                message="این یک قابلیت نمایشی است. در نسخه واقعی، درخواست شما برای بررسی به تیم مالی ارسال خواهد شد. آیا مایل به ادامه شبیه‌سازی هستید؟"
                confirmText="بله، ادامه بده"
                cancelText="انصراف"
            />
        </div>
    );
};

export default DonationBalancePage;