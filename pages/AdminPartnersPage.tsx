import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import Input from '../components/Input';
import Button from '../components/Button';
import type { PartnerBrand, PartnerCharity } from '../types';

const AdminPartnersPage: React.FC = () => {
    const { brands, setBrands, charities, setCharities, saveAllSettings, isDirty } = useSettings();

    // State for new brand form
    const [newBrand, setNewBrand] = useState({ name: '', logoUrl: '' });
    // State for new charity form
    const [newCharity, setNewCharity] = useState({ name: '', logoUrl: '', website: '' });
    
    const darkInputStyles = "bg-gray-700 text-white placeholder-gray-400 focus:bg-gray-800 border-gray-600 focus:border-emerald-500 focus:ring-emerald-500";


    // --- Brands Logic ---
    const handleAddBrand = () => {
        if (newBrand.name && newBrand.logoUrl) {
            const newBrandEntry: PartnerBrand = {
                id: `brand-${Date.now()}`,
                ...newBrand
            };
            setBrands(prev => [...prev, newBrandEntry]);
            setNewBrand({ name: '', logoUrl: '' });
        } else {
            alert('لطفا نام و URL لوگوی برند را وارد کنید.');
        }
    };
    
    const handleDeleteBrand = (id: string) => {
        if (window.confirm('آیا از حذف این برند اطمینان دارید؟')) {
            setBrands(prev => prev.filter(b => b.id !== id));
        }
    };

    // --- Charities Logic ---
    const handleAddCharity = () => {
        if (newCharity.name && newCharity.logoUrl && newCharity.website) {
             const newCharityEntry: PartnerCharity = {
                id: `charity-${Date.now()}`,
                ...newCharity
            };
            setCharities(prev => [...prev, newCharityEntry]);
            setNewCharity({ name: '', logoUrl: '', website: '' });
        } else {
            alert('لطفا تمام اطلاعات خیریه را وارد کنید.');
        }
    };
    
    const handleDeleteCharity = (id: string) => {
        if (window.confirm('آیا از حذف این خیریه اطمینان دارید؟')) {
            setCharities(prev => prev.filter(c => c.id !== id));
        }
    };
    
    const handleSaveChanges = () => {
      saveAllSettings();
      alert('تغییرات با موفقیت ذخیره شد!');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">مدیریت همکاران</h1>
                <Button onClick={handleSaveChanges} disabled={!isDirty}>
                    {isDirty ? 'ذخیره تغییرات' : 'تغییرات ذخیره شده'}
                </Button>
            </div>

            {/* Brands Management Section */}
            <section className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">اعتماد برندها</h2>
                <div className="space-y-3 mb-6">
                    {brands.map(brand => (
                        <div key={brand.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                            <div className="flex items-center gap-4">
                                <img src={brand.logoUrl} alt={brand.name} className="h-10 w-10 object-contain rounded-full bg-white p-1"/>
                                <span className="font-semibold text-gray-800">{brand.name}</span>
                            </div>
                            <Button onClick={() => handleDeleteBrand(brand.id)} variant="secondary" className="py-1 px-3 text-xs text-red-600 bg-red-100 hover:bg-red-200">حذف</Button>
                        </div>
                    ))}
                </div>
                <div className="border-t pt-4">
                    <h3 className="font-semibold text-lg mb-2">افزودن برند جدید</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <Input label="نام برند" id="new-brand-name" value={newBrand.name} onChange={e => setNewBrand({...newBrand, name: e.target.value})} className={darkInputStyles} />
                        <Input label="URL لوگو" id="new-brand-logo" value={newBrand.logoUrl} onChange={e => setNewBrand({...newBrand, logoUrl: e.target.value})} className={darkInputStyles} />
                    </div>
                    <Button onClick={handleAddBrand} className="mt-4">افزودن برند</Button>
                </div>
            </section>
            
            {/* Charities Management Section */}
            <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">خیریه‌ها و NGOها</h2>
                 <div className="space-y-3 mb-6">
                    {charities.map(charity => (
                        <div key={charity.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                            <div className="flex items-center gap-4">
                                <img src={charity.logoUrl} alt={charity.name} className="h-10 w-10 object-contain rounded-full bg-white p-1"/>
                                <div>
                                    <p className="font-semibold text-gray-800">{charity.name}</p>
                                    <a href={charity.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">{charity.website}</a>
                                </div>
                            </div>
                            <Button onClick={() => handleDeleteCharity(charity.id)} variant="secondary" className="py-1 px-3 text-xs text-red-600 bg-red-100 hover:bg-red-200">حذف</Button>
                        </div>
                    ))}
                </div>
                <div className="border-t pt-4">
                    <h3 className="font-semibold text-lg mb-2">افزودن خیریه/NGO جدید</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <Input label="نام خیریه" id="new-charity-name" value={newCharity.name} onChange={e => setNewCharity({...newCharity, name: e.target.value})} className={darkInputStyles} />
                        <Input label="URL لوگو" id="new-charity-logo" value={newCharity.logoUrl} onChange={e => setNewCharity({...newCharity, logoUrl: e.target.value})} className={darkInputStyles} />
                        <Input label="وب‌سایت" id="new-charity-website" value={newCharity.website} onChange={e => setNewCharity({...newCharity, website: e.target.value})} className={darkInputStyles} />
                    </div>
                    <Button onClick={handleAddCharity} className="mt-4">افزودن خیریه</Button>
                </div>
            </section>
        </div>
    );
};

export default AdminPartnersPage;
