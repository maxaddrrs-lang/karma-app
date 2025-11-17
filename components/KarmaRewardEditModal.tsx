

import React, { useState, useEffect, useMemo } from 'react';
import type { KarmaReward } from '../types';
import Button from './Button';
import Input from './Input';
import { useLanguage } from '../hooks/useLanguage';

interface KarmaRewardEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reward: KarmaReward) => void;
  reward: KarmaReward | null;
}

const KarmaRewardEditModal: React.FC<KarmaRewardEditModalProps> = ({ isOpen, onClose, onSave, reward }) => {
  const { t } = useLanguage();
  const [editedReward, setEditedReward] = useState<KarmaReward | null>(null);
  const [codesText, setCodesText] = useState('');

  useEffect(() => {
    if (reward) {
      setEditedReward({ ...reward });
      setCodesText(reward.codes?.join('\n') || '');
    }
  }, [reward]);

  const codeCount = useMemo(() => {
      return codesText.split('\n').map(c => c.trim()).filter(Boolean).length;
  }, [codesText]);

  if (!isOpen || !editedReward) return null;

  const handleChange = (field: keyof KarmaReward, value: string | number) => {
    setEditedReward(prev => prev ? { ...prev, [field]: value } : null);
  };
  
  const handleSave = () => {
      if (editedReward) {
          const codesArray = codesText.split('\n').map(c => c.trim()).filter(Boolean);
          const isCodeBased = codesArray.length > 0;
          
          onSave({
            ...editedReward,
            codes: isCodeBased ? codesArray : undefined,
            quantity: isCodeBased ? codesArray.length : editedReward.quantity,
          });
      }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const isPredefined = editedReward.id < 1000 && !editedReward.name.includes(' ');

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">ویرایش جایزه</h2>
        {isPredefined && (
            <div className="text-sm text-amber-800 bg-amber-50 p-3 rounded-md mb-4 border border-amber-200">
                {t('admin.predefinedRewardEditHint')}
            </div>
        )}
        <div className="space-y-4">
          <Input
            label="نام جایزه"
            id="reward-name"
            value={editedReward.name}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled={isPredefined}
          />
           <div>
              <label htmlFor="reward-desc" className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات
              </label>
              <textarea
                id="reward-desc"
                value={editedReward.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                disabled={isPredefined}
              />
          </div>
            <div>
            <label htmlFor="reward-codes-edit" className="block text-sm font-medium text-gray-700 mb-2">
                لیست کدها (اختیاری - هر کد در یک خط)
            </label>
            <textarea
                id="reward-codes-edit"
                value={codesText}
                onChange={(e) => setCodesText(e.target.value)}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
            />
            </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="هزینه (سکه کارما)"
              id="reward-cost"
              type="number"
              value={editedReward.cost}
              onChange={(e) => handleChange('cost', Number(e.target.value))}
            />
            <Input
              label="تعداد موجود"
              id="reward-quantity"
              type="number"
              value={codeCount > 0 ? codeCount : editedReward.quantity}
              onChange={(e) => handleChange('quantity', Number(e.target.value))}
              disabled={codeCount > 0}
              className={codeCount > 0 ? 'bg-gray-200 cursor-not-allowed' : ''}
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>لغو</Button>
          <Button onClick={handleSave}>ذخیره تغییرات</Button>
        </div>
      </div>
    </div>
  );
};

export default KarmaRewardEditModal;