import React from 'react';
import { useSettings } from '../context/SettingsContext';
import Input from '../components/Input';
import Button from '../components/Button';
import type { League } from '../constants';

const AdminLeaguesPage: React.FC = () => {
  const { leagues, setLeagues, saveAllSettings, isDirty } = useSettings();
  const darkInputStyles = "bg-gray-800 text-white placeholder-gray-400 focus:bg-gray-900 border-gray-600 focus:border-emerald-500 focus:ring-emerald-500";

  const handleLeagueChange = (index: number, field: keyof League, value: string | number) => {
    const newLeagues: League[] = JSON.parse(JSON.stringify(leagues));
    
    // Update name or prize description directly
    if (field === 'name' || field === 'prizeDescription') {
        // @ts-ignore
        newLeagues[index][field] = value;
        setLeagues(newLeagues);
        return;
    }

    // Handle numeric changes for coin values
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 0) return; // Ignore invalid input

    if (field === 'minCoins') {
        // Can only edit minCoins for leagues after the first one
        if (index > 0) {
            // The new min value must be > previous league's min and <= current league's max
            if (numValue <= newLeagues[index - 1].minCoins || numValue > newLeagues[index].maxCoins) {
                return; 
            }
            newLeagues[index].minCoins = numValue;
            newLeagues[index - 1].maxCoins = numValue - 1;
        }
    } else if (field === 'maxCoins') {
        // Can only edit maxCoins for leagues before the last one
        if (index < newLeagues.length - 1) {
            // The new max value must be >= current league's min and < next league's max
            if (numValue < newLeagues[index].minCoins || numValue >= newLeagues[index + 1].maxCoins) {
                return;
            }
            newLeagues[index].maxCoins = numValue;
            newLeagues[index + 1].minCoins = numValue + 1;
        }
    }
    
    setLeagues(newLeagues);
  };
  
  const handleSaveChanges = () => {
      saveAllSettings();
      alert('تغییرات با موفقیت ذخیره شد!');
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">مدیریت لیگ‌ها و جوایز</h1>
            <p className="text-gray-500 mt-2">جوایز، نام و حداقل و حداکثر سکه مورد نیاز برای هر لیگ را در اینجا مدیریت کنید.</p>
        </div>
        <Button onClick={handleSaveChanges} disabled={!isDirty}>
            {isDirty ? 'ذخیره تغییرات' : 'تغییرات ذخیره شده'}
        </Button>
      </div>

      <section className="space-y-6">
        {leagues.map((league, index) => (
          <div key={league.name} className={`p-6 bg-white rounded-lg shadow-md border-l-4 ${league.color.replace('bg-', 'border-')}`}>
            <div className="flex items-center gap-4 mb-4">
                <span className={`text-4xl ${league.iconColor}`}>{league.icon}</span>
                <div className="flex-grow">
                     <Input
                        label="نام لیگ"
                        id={`name-${index}`}
                        value={league.name}
                        onChange={(e) => handleLeagueChange(index, 'name', e.target.value)}
                        className={darkInputStyles}
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input
                    label="حداقل سکه برای ورود"
                    id={`minCoins-${index}`}
                    type="number"
                    value={league.minCoins}
                    onChange={(e) => handleLeagueChange(index, 'minCoins', e.target.value)}
                    disabled={index === 0} // Bronze league should always start at 0
                    className={`${darkInputStyles} ${index === 0 ? 'bg-gray-600 cursor-not-allowed' : ''}`}
                />
                 <Input
                    label="حداکثر سکه"
                    id={`maxCoins-${index}`}
                    type="number"
                    value={league.maxCoins === Infinity ? '' : league.maxCoins}
                    onChange={(e) => handleLeagueChange(index, 'maxCoins', e.target.value)}
                    disabled={index === leagues.length - 1}
                    placeholder={league.maxCoins === Infinity ? '∞' : ''}
                    className={`${darkInputStyles} ${index === leagues.length - 1 ? 'bg-gray-600 cursor-not-allowed' : ''}`}
                />
                <div className="md:col-span-2">
                    <label htmlFor={`prize-${index}`} className="block text-sm font-medium text-gray-700 mb-2">توضیحات جایزه</label>
                    <textarea
                        id={`prize-${index}`}
                        value={league.prizeDescription}
                        onChange={(e) => handleLeagueChange(index, 'prizeDescription', e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-2 border rounded-lg shadow-sm transition-colors ${darkInputStyles}`}
                    />
                </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AdminLeaguesPage;