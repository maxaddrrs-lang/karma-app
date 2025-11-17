import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../hooks/useLanguage';
import Input from '../components/Input';
import Button from '../components/Button';
import Select from '../components/Select';
import FileInput from '../components/FileInput';

type MissionDetailValue = {
  labelKey?: string;
  label?: string; // For custom templates
  quantityLabelKey?: string;
  quantityLabel?: string; // For custom templates
  minQuantity: number;
  costPerUnit: number;
  defaultCategory: string;
  imageUrl?: string;
};

const missionDetailTranslations: { [key: string]: string } = {
    'mission_details.food.label': "تهیه غذا برای نیازمندان",
    'mission_details.food.quantityLabel': "تعداد وعده غذا",
    'mission_details.school_supplies.label': "تهیه کیف با لوازم تحریر",
    'mission_details.school_supplies.quantityLabel': "تعداد کیف",
    'mission_details.medical.label': "هزینه درمان کودکان سرطانی",
    'mission_details.medical.quantityLabel': "تعداد کودکان تحت پوشش",
    'mission_details.production.label': "راه اندازی تولیدی",
    'mission_details.production.quantityLabel': "تعداد واحد تولیدی"
};

const AdminTemplatesPage: React.FC = () => {
  const {
    categories,
    missionDetails,
    setMissionDetails,
  } = useSettings();
  const { t } = useLanguage();
  
  const [newTemplate, setNewTemplate] = useState<Omit<MissionDetailValue, 'labelKey' | 'quantityLabelKey'>>({
      label: '',
      quantityLabel: '',
      minQuantity: 10,
      costPerUnit: 10000,
      defaultCategory: categories[0]?.name || '',
      imageUrl: '',
  });
  
  const darkInputStyles = "bg-gray-700 text-white placeholder-gray-400 focus:bg-gray-800 border-gray-600 focus:border-emerald-500 focus:ring-emerald-500";

  const handleMissionDetailChange = (key: string, field: string, value: string | number | null) => {
    setMissionDetails(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: field === 'costPerUnit' || field === 'minQuantity' ? Number(value) : value,
      }
    }));
  };
  
  const handleDeleteMissionDetail = (keyToDelete: string) => {
    const detailToDelete = missionDetails[keyToDelete] as MissionDetailValue;
    const detailName = detailToDelete.label || missionDetailTranslations[detailToDelete.labelKey || ''] || keyToDelete;
    if (window.confirm(`آیا از حذف الگوی ماموریت اصلی "${detailName}" اطمینان دارید؟ این عمل قابل بازگشت نیست.`)) {
        setMissionDetails(prev => {
            const newState = { ...prev };
            delete newState[keyToDelete];
            return newState;
        });
    }
  };
  
  const handleNewTemplateChange = (field: string, value: string | number | null) => {
    setNewTemplate(prev => ({...prev, [field]: value}));
  };

  const handleAddNewMissionDetail = () => {
      const { label, quantityLabel, costPerUnit, minQuantity, defaultCategory } = newTemplate;
      if (!label || !quantityLabel || !costPerUnit || !minQuantity || !defaultCategory) {
          alert('لطفا تمام فیلدهای الگوی جدید را پر کنید.');
          return;
      }
      const newKey = `custom_${Date.now()}`;
      setMissionDetails(prev => ({
          ...prev,
          [newKey]: newTemplate
      }));
      // Reset form
      setNewTemplate({
          label: '',
          quantityLabel: '',
          minQuantity: 10,
          costPerUnit: 10000,
          defaultCategory: categories[0]?.name || '',
          imageUrl: '',
      });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">مدیریت الگوهای کمپین</h1>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-2">الگوهای ماموریت اصلی (کمپین آماده)</h2>
        <p className="text-sm text-gray-500 mb-4">این الگوها برای محاسبه خودکار هزینه و تنظیم تصویر پیش‌فرض در مرحله اول ایجاد کمپین استفاده می شوند.</p>
         <div className="space-y-4">
          {Object.entries(missionDetails).map(([key, details]) => {
            const typedDetails = details as MissionDetailValue;
            return (
            <div key={key} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                 <h3 className="font-semibold text-gray-700">{typedDetails.label || missionDetailTranslations[typedDetails.labelKey || ''] || key}</h3>
                 <button onClick={() => handleDeleteMissionDetail(key)} className="text-red-500 hover:text-red-700 font-semibold py-1 px-3 text-sm transition-colors flex-shrink-0">حذف الگو</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="هزینه واحد (تومان)" type="number" id={`cost-${key}`} value={typedDetails.costPerUnit} onChange={e => handleMissionDetailChange(key, 'costPerUnit', e.target.value)} className={darkInputStyles} />
                <Input label="حداقل تعداد" type="number" id={`min-${key}`} value={typedDetails.minQuantity} onChange={e => handleMissionDetailChange(key, 'minQuantity', e.target.value)} className={darkInputStyles} />
                <Select label="دسته بندی پیش فرض" id={`cat-${key}`} value={typedDetails.defaultCategory} onChange={e => handleMissionDetailChange(key, 'defaultCategory', e.target.value)} options={categories.map(c => c.name)} className={darkInputStyles} />
                <div className="md:col-span-2">
                    <FileInput 
                        label="تصویر الگو"
                        value={typedDetails.imageUrl || null}
                        onFileSelect={(dataUrl) => handleMissionDetailChange(key, 'imageUrl', dataUrl)}
                    />
                </div>
              </div>
            </div>
          )})}
        </div>
        <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">ایجاد الگوی ماموریت جدید</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="عنوان ماموریت الگو" id="new-template-label" value={newTemplate.label || ''} onChange={e => handleNewTemplateChange('label', e.target.value)} placeholder="مثلا: کاشت نهال برای مقابله با بیابان‌زایی" className={darkInputStyles} />
                <Input label="واحد شمارش" id="new-template-qty-label" value={newTemplate.quantityLabel || ''} onChange={e => handleNewTemplateChange('quantityLabel', e.target.value)} placeholder="مثلا: تعداد نهال" className={darkInputStyles} />
                <Input label="هزینه هر واحد (تومان)" id="new-template-cost" type="number" value={newTemplate.costPerUnit} onChange={e => handleNewTemplateChange('costPerUnit', Number(e.target.value))} className={darkInputStyles} />
                <Input label="حداقل تعداد" id="new-template-min-qty" type="number" value={newTemplate.minQuantity} onChange={e => handleNewTemplateChange('minQuantity', Number(e.target.value))} className={darkInputStyles} />
                <Select label="دسته بندی پیش فرض" id="new-template-category" value={newTemplate.defaultCategory} onChange={e => handleNewTemplateChange('defaultCategory', e.target.value)} options={categories.map(c => c.name)} className={darkInputStyles} />
                 <div className="md:col-span-2">
                     <FileInput 
                        label="تصویر الگو"
                        value={newTemplate.imageUrl || null}
                        onFileSelect={(dataUrl) => handleNewTemplateChange('imageUrl', dataUrl)}
                    />
                 </div>
                <div className="md:col-span-2">
                    <Button onClick={handleAddNewMissionDetail}>افزودن الگوی جدید</Button>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default AdminTemplatesPage;