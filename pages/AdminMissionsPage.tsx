import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Select from '../components/Select';
import type { Task } from '../types';
import { taskTranslations, PREDEFINED_TASK_CATEGORIES } from '../constants';

type PredefinedTask = Omit<Task, 'id'>;

const AdminMissionsPage: React.FC = () => {
  const { predefinedTasks, setPredefinedTasks } = useSettings();

  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskImpactPoints, setNewTaskImpactPoints] = useState(5);
  const [newTaskKarmaCoins, setNewTaskKarmaCoins] = useState(3);
  const [newTaskTargetUrl, setNewTaskTargetUrl] = useState('');

  const darkInputStyles = "bg-gray-700 text-white placeholder-gray-400 focus:bg-gray-800 border-gray-600 focus:border-emerald-500 focus:ring-emerald-500";

  const handleAddTask = () => {
    if (newTaskDescription && newTaskCategory) {
        const newTask: PredefinedTask = {
            description: newTaskDescription,
            type: 'generic',
            impactPoints: Math.max(1, Math.min(10, newTaskImpactPoints)),
            karmaCoins: Math.max(1, Math.min(10, newTaskKarmaCoins)),
            targetUrl: newTaskTargetUrl.trim() || undefined,
        };
        setPredefinedTasks(prev => ({
            ...prev,
            [newTaskCategory]: [...(prev[newTaskCategory] || []), newTask],
        }));
        setNewTaskDescription('');
        setNewTaskCategory('');
        setNewTaskImpactPoints(5);
        setNewTaskKarmaCoins(3);
        setNewTaskTargetUrl('');
    }
  };
  
  const handlePredefinedTaskChange = (
    category: string, 
    taskDescription: string, 
    field: 'impactPoints' | 'karmaCoins' | 'targetUrl', 
    value: string | number
) => {
    setPredefinedTasks(prev => ({
        ...prev,
        [category]: prev[category].map(task => {
            if (task.description === taskDescription) {
                if (field === 'impactPoints' || field === 'karmaCoins') {
                    const clampedValue = Math.max(1, Math.min(10, Number(value) || 1));
                    return { ...task, [field]: clampedValue };
                }
                if (field === 'targetUrl') {
                    const urlValue = (value as string).trim();
                    return { ...task, [field]: urlValue || undefined };
                }
            }
            return task;
        }),
    }));
  };

  const handleDeleteTask = (category: string, taskDescriptionToDelete: string) => {
     if (window.confirm(`آیا از حذف ماموریت "${taskTranslations[taskDescriptionToDelete] || taskDescriptionToDelete}" اطمینان دارید؟`)) {
        setPredefinedTasks(prev => ({
            ...prev,
            [category]: prev[category].filter(t => t.description !== taskDescriptionToDelete),
        }));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">ماموریت‌ها</h1>

      <section className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">تعریف ماموریت ها</h2>
        <p className="text-sm text-gray-500 mb-4">این ماموریت‌ها به عنوان گزینه های آماده در مرحله دوم ایجاد کمپین نمایش داده می شوند.</p>
        <div className="space-y-4">
          {Object.entries(predefinedTasks).map(([category, tasks]) => (
            <div key={category} className="p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold text-gray-700 mb-3">{(PREDEFINED_TASK_CATEGORIES as Record<string, string>)[category] || category}</h3>
              <div className="space-y-3">
                
                {(tasks as PredefinedTask[]).map(task => (
                  <div key={task.description} className="p-3 bg-white rounded-lg border">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-800 flex-grow">{taskTranslations[task.description] || task.description}</span>
                        <button onClick={() => handleDeleteTask(category, task.description)} className="text-red-500 hover:text-red-700 font-semibold py-1 px-3 text-sm transition-colors flex-shrink-0">حذف</button>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">امتیاز تاثیر (۱-۱۰)</label>
                              <input 
                                  type="number" 
                                  value={task.impactPoints}
                                  onChange={(e) => handlePredefinedTaskChange(category, task.description, 'impactPoints', parseInt(e.target.value, 10))}
                                  min="1"
                                  max="10"
                                  className={`w-full px-4 py-2 border rounded-lg shadow-sm ${darkInputStyles}`}
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">میزان سکه (۱-۱۰)</label>
                              <input 
                                  type="number" 
                                  value={task.karmaCoins || 1}
                                  onChange={(e) => handlePredefinedTaskChange(category, task.description, 'karmaCoins', parseInt(e.target.value, 10))}
                                  min="1"
                                  max="10"
                                  className={`w-full px-4 py-2 border rounded-lg shadow-sm ${darkInputStyles}`}
                              />
                          </div>
                      </div>
                      <div className="mt-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">آدرس URL ماموریت (اختیاری)</label>
                          <input
                              type="url"
                              placeholder="https://example.com/task-page"
                              value={task.targetUrl || ''}
                              onChange={(e) => handlePredefinedTaskChange(category, task.description, 'targetUrl', e.target.value)}
                              className={`w-full px-4 py-2 border rounded-lg shadow-sm ${darkInputStyles}`}
                          />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
         <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold mb-2 text-lg">افزودن ماموریت پیشنهادی جدید</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="md:col-span-2">
                    <Input label="شرح ماموریت" id="new-task-desc" value={newTaskDescription} onChange={e => setNewTaskDescription(e.target.value)} className={darkInputStyles} />
                </div>
                <div className="md:col-span-2">
                    <Input label="آدرس URL ماموریت (اختیاری)" id="new-task-url" value={newTaskTargetUrl} onChange={e => setNewTaskTargetUrl(e.target.value)} placeholder="https://..." className={darkInputStyles} />
                </div>
                <Select label="دسته بندی" id="task-category-select" value={newTaskCategory} onChange={e => setNewTaskCategory(e.target.value)} options={Object.keys(predefinedTasks).map(key => (PREDEFINED_TASK_CATEGORIES as Record<string, string>)[key] || key)} optionValues={Object.keys(predefinedTasks)} className={darkInputStyles} />
                <div /> {/* Spacer */}
                <Input label="امتیاز تاثیر (۱-۱۰)" type="number" id="new-task-impact" value={newTaskImpactPoints} onChange={e => setNewTaskImpactPoints(Number(e.target.value))} min="1" max="10" className={darkInputStyles} />
                <Input label="میزان سکه (۱-۱۰)" type="number" id="new-task-coins" value={newTaskKarmaCoins} onChange={e => setNewTaskKarmaCoins(Number(e.target.value))} min="1" max="10" className={darkInputStyles} />
                <div className="md:col-span-2">
                    <Button onClick={handleAddTask}>افزودن ماموریت</Button>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default AdminMissionsPage;