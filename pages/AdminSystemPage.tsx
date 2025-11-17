import React, { useState } from 'react';
import Button from '../components/Button';
import { useSettings } from '../context/SettingsContext';
import ToggleSwitch from '../components/ToggleSwitch';
import * as api from '../services/api';

const WarningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const AdminSystemPage: React.FC = () => {
    const { isLeaguesEnabled, setIsLeaguesEnabled, isCampaignBuilderEnabled, setIsCampaignBuilderEnabled } = useSettings();
    // State for full restore
    const [fullRestoreFileContent, setFullRestoreFileContent] = useState<string | null>(null);
    const [fullFileName, setFullFileName] = useState<string>('');
    const [isFullRestoring, setIsFullRestoring] = useState(false);
    
    // State for user-only restore
    const [userRestoreFileContent, setUserRestoreFileContent] = useState<string | null>(null);
    const [userFileName, setUserFileName] = useState<string>('');
    const [isUserRestoring, setIsUserRestoring] = useState(false);

    const downloadFile = (content: string, fileName: string) => {
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // --- FULL BACKUP/RESTORE LOGIC ---
    const handleFullBackup = async () => {
        try {
            const backupJson = await api.backupAllData();
            const date = new Date().toISOString().slice(0, 10);
            downloadFile(backupJson, `karma-full-backup-${date}.json`);
            alert('فایل پشتیبان کامل با موفقیت ایجاد شد.');
        } catch (error) {
            console.error("Error creating full backup:", error);
            alert('خطا در ایجاد فایل پشتیبان کامل.');
        }
    };

    const handleFullFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFullRestoreFileContent(event.target?.result as string);
                setFullFileName(file.name);
            };
            reader.readAsText(file);
        } else {
            setFullRestoreFileContent(null);
            setFullFileName('');
        }
    };

    const handleFullRestore = async () => {
        if (!fullRestoreFileContent) {
            alert('لطفا ابتدا یک فایل پشتیبان کامل را انتخاب کنید.');
            return;
        }

        const isConfirmed = window.confirm(
            "هشدار جدی!\n\nآیا مطمئن هستید که می‌خواهید اطلاعات را بازیابی کنید؟\n\nاین عمل تمام داده‌های فعلی برنامه را حذف کرده و با اطلاعات موجود در فایل پشتیبان جایگزین می‌کند. این کار غیرقابل بازگشت است."
        );

        if (isConfirmed) {
            setIsFullRestoring(true);
            try {
                await api.restoreAllData(fullRestoreFileContent);
                alert('اطلاعات با موفقیت بازیابی شد. برنامه مجدداً بارگذاری می‌شود.');
                window.location.reload();
            } catch (error) {
                console.error("Error restoring full data:", error);
                alert('خطا در بازیابی اطلاعات. فایل پشتیبان ممکن است نامعتبر باشد.');
                setIsFullRestoring(false);
            }
        }
    };

    // --- USER-ONLY BACKUP/RESTORE LOGIC ---
    const handleUserBackup = async () => {
        try {
            const backupJson = await api.backupUserData();
            const date = new Date().toISOString().slice(0, 10);
            downloadFile(backupJson, `karma-users-backup-${date}.json`);
            alert('فایل پشتیبان کاربران با موفقیت ایجاد شد.');
        } catch (error) {
            console.error("Error creating user backup:", error);
            alert('خطا در ایجاد فایل پشتیبان کاربران.');
        }
    };
    
    const handleUserFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUserRestoreFileContent(event.target?.result as string);
                setUserFileName(file.name);
            };
            reader.readAsText(file);
        } else {
            setUserRestoreFileContent(null);
            setUserFileName('');
        }
    };

    const handleUserRestore = async () => {
        if (!userRestoreFileContent) {
            alert('لطفا ابتدا یک فایل پشتیبان کاربران را انتخاب کنید.');
            return;
        }

        const isConfirmed = window.confirm(
            "هشدار!\n\nآیا مطمئن هستید که می‌خواهید اطلاعات کاربران را بازیابی کنید؟\n\nاین عمل داده‌های تمام کاربران فعلی را با اطلاعات فایل پشتیبان جایگزین می‌کند. این کار تاثیری بر کمپین‌ها یا تنظیمات عمومی نخواهد داشت، اما ممکن است اطلاعات کاربران را تغییر دهد."
        );

        if (isConfirmed) {
            setIsUserRestoring(true);
            try {
                await api.restoreUserData(userRestoreFileContent);
                alert('اطلاعات کاربران با موفقیت بازیابی شد. برنامه مجدداً بارگذاری می‌شود.');
                window.location.reload();
            } catch (error) {
                console.error("Error restoring user data:", error);
                alert('خطا در بازیابی اطلاعات کاربران. فایل پشتیبان ممکن است نامعتبر باشد.');
                setIsUserRestoring(false);
            }
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">تنظیمات سیستم</h1>

            {/* Feature Toggles Section */}
            <section className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-2">مدیریت قابلیت‌ها</h2>
                <p className="text-sm text-gray-500 mb-4">
                    قابلیت‌های اصلی برنامه را از این بخش فعال یا غیرفعال کنید.
                </p>
                <div className="space-y-4">
                    <ToggleSwitch
                        label="فعال‌سازی سیستم لیگ‌ها و جوایز"
                        checked={isLeaguesEnabled}
                        onChange={setIsLeaguesEnabled}
                    />
                     <ToggleSwitch
                        label="فعال‌سازی کمپین ساز برای کاربران"
                        checked={isCampaignBuilderEnabled}
                        onChange={setIsCampaignBuilderEnabled}
                    />
                </div>
            </section>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">پشتیبان‌گیری و بازیابی</h2>
            
            {/* User Data Backup/Restore Section */}
            <section className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-2">پشتیبان‌گیری و بازیابی اطلاعات کاربران</h2>
                <p className="text-sm text-gray-500 mb-4">
                    این بخش فقط اطلاعات مربوط به کاربران (پروفایل، امتیازات، تراکنش‌ها و...) را پشتیبان‌گیری یا بازیابی می‌کند. برای مواقعی که می‌خواهید اطلاعات کاربران را بدون تغییر در کمپین‌ها یا تنظیمات کلی، بازیابی کنید، مناسب است.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Backup */}
                    <div className="md:border-l md:pl-8">
                        <h3 className="font-semibold mb-3">ایجاد پشتیبان کاربران</h3>
                        <Button onClick={handleUserBackup}>
                            دانلود پشتیبان کاربران
                        </Button>
                    </div>
                    {/* Restore */}
                    <div>
                         <h3 className="font-semibold mb-3">بازیابی کاربران از پشتیبان</h3>
                         <div className="flex items-center space-x-4 space-x-reverse mb-4">
                            <label htmlFor="user-restore-file-input" className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors">
                                انتخاب فایل...
                            </label>
                            <input
                                id="user-restore-file-input"
                                type="file"
                                accept=".json"
                                onChange={handleUserFileChange}
                                className="hidden"
                            />
                            {userFileName && <span className="text-gray-600 font-mono">{userFileName}</span>}
                        </div>
                        <Button
                            onClick={handleUserRestore}
                            disabled={!userRestoreFileContent || isUserRestoring}
                            className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300"
                        >
                            {isUserRestoring ? 'در حال بازیابی...' : 'بازیابی اطلاعات کاربران'}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Full App Backup/Restore Section */}
            <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-800 mb-2">پشتیبان‌گیری و بازیابی کامل برنامه</h2>
                <p className="text-sm text-gray-500 mb-4">
                    از تمام داده‌های برنامه (شامل کمپین‌ها، کاربران، تنظیمات، اعلان‌ها و ...) یک فایل JSON تهیه کرده یا آن را بازیابی کنید.
                </p>

                <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg mb-6 flex items-start space-x-3 space-x-reverse">
                    <WarningIcon />
                    <div>
                        <h4 className="font-bold text-red-800">هشدار جدی</h4>
                        <p className="text-sm text-red-700">
                            بازیابی کامل، تمام داده‌های فعلی شما را حذف و با اطلاعات فایل پشتیبان جایگزین می‌کند. این عمل غیرقابل بازگشت است.
                        </p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Backup */}
                    <div className="md:border-l md:pl-8">
                        <h3 className="font-semibold mb-3">ایجاد پشتیبان کامل</h3>
                        <Button onClick={handleFullBackup}>
                            دانلود پشتیبان کامل
                        </Button>
                    </div>
                     {/* Restore */}
                    <div>
                        <h3 className="font-semibold mb-3">بازیابی کامل از پشتیبان</h3>
                        <div className="flex items-center space-x-4 space-x-reverse mb-4">
                            <label htmlFor="full-restore-file-input" className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors">
                                انتخاب فایل...
                            </label>
                            <input
                                id="full-restore-file-input"
                                type="file"
                                accept=".json"
                                onChange={handleFullFileChange}
                                className="hidden"
                            />
                            {fullFileName && <span className="text-gray-600 font-mono">{fullFileName}</span>}
                        </div>
                        <Button
                            onClick={handleFullRestore}
                            disabled={!fullRestoreFileContent || isFullRestoring}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-red-300"
                        >
                            {isFullRestoring ? 'در حال بازیابی...' : 'بازیابی کامل اطلاعات'}
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminSystemPage;
