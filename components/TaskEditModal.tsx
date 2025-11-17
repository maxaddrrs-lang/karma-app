import React, { useState, useEffect } from 'react';
import type { Task } from '../types';
import Button from './Button';
import Input from './Input';

interface TaskEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  task: Task | null;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({ isOpen, onClose, onSave, task }) => {
  const [description, setDescription] = useState('');
  const [impactPoints, setImpactPoints] = useState(5);
  const [targetUrl, setTargetUrl] = useState('');

  useEffect(() => {
    if (task) {
      setDescription(task.description);
      setImpactPoints(task.impactPoints);
      setTargetUrl(task.targetUrl || '');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSave = () => {
    onSave({
      ...task,
      description,
      impactPoints: impactPoints > 0 ? impactPoints : 1, // Ensure points are at least 1
      targetUrl: targetUrl.trim() || undefined,
    });
  };
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" 
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-task-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
        <h2 id="edit-task-title" className="text-2xl font-bold text-gray-800 mb-6">ویرایش ماموریت</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="task-description-edit" className="block text-sm font-medium text-gray-700 mb-2">
              شرح ماموریت
            </label>
            <textarea
              id="task-description-edit"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>
          <Input
            label="امتیاز تاثیر"
            id="task-impact-points-edit"
            type="number"
            value={impactPoints}
            onChange={(e) => setImpactPoints(parseInt(e.target.value, 10) || 0)}
            min="1"
          />
          <Input
            label="آدرس صفحه (اختیاری)"
            id="task-target-url-edit"
            type="url"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://example.com/page"
          />
        </div>
        <div className="mt-8 flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>لغو</Button>
          <Button onClick={handleSave}>ذخیره تغییرات</Button>
        </div>
      </div>
    </div>
  );
};

export default TaskEditModal;