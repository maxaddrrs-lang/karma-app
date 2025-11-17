import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { INITIAL_CATEGORIES, PREDEFINED_TASKS, MISSION_DETAILS, INITIAL_KARMA_CLUB_REWARDS, INITIAL_LEAGUES } from '../constants';
import type { KarmaReward, CategorySetting, PartnerBrand, PartnerCharity } from '../types';
import type { League } from '../constants';
import * as api from '../services/api';


// Type definitions matching the constants
type PredefinedTasks = typeof PREDEFINED_TASKS;
type MissionDetails = typeof MISSION_DETAILS;
type KarmaClubRewards = Record<string, KarmaReward[]>;


interface SettingsContextType {
  categories: CategorySetting[];
  setCategories: React.Dispatch<React.SetStateAction<CategorySetting[]>>;
  predefinedTasks: PredefinedTasks;
  setPredefinedTasks: React.Dispatch<React.SetStateAction<PredefinedTasks>>;
  missionDetails: MissionDetails;
  setMissionDetails: React.Dispatch<React.SetStateAction<MissionDetails>>;
  karmaClubRewards: KarmaClubRewards;
  setKarmaClubRewards: React.Dispatch<React.SetStateAction<KarmaClubRewards>>;
  leagues: League[];
  setLeagues: React.Dispatch<React.SetStateAction<League[]>>;
  brands: PartnerBrand[];
  setBrands: React.Dispatch<React.SetStateAction<PartnerBrand[]>>;
  charities: PartnerCharity[];
  setCharities: React.Dispatch<React.SetStateAction<PartnerCharity[]>>;
  isCampaignBuilderEnabled: boolean;
  setIsCampaignBuilderEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isLeaguesEnabled: boolean;
  setIsLeaguesEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  redeemKarmaReward: (rewardId: number) => { success: boolean; code?: string; };
  saveAllSettings: () => void;
  isDirty: boolean;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategoriesState] = useState<CategorySetting[]>([]);
  const [predefinedTasks, setPredefinedTasksState] = useState<PredefinedTasks>({} as PredefinedTasks);
  const [missionDetails, setMissionDetailsState] = useState<MissionDetails>({} as MissionDetails);
  const [karmaClubRewards, setKarmaClubRewardsState] = useState<KarmaClubRewards>({});
  const [leagues, setLeaguesState] = useState<League[]>([]);
  const [brands, setBrandsState] = useState<PartnerBrand[]>([]);
  const [charities, setCharitiesState] = useState<PartnerCharity[]>([]);
  const [isCampaignBuilderEnabled, setIsCampaignBuilderEnabledState] = useState<boolean>(false);
  const [isLeaguesEnabled, setIsLeaguesEnabledState] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- Wrapper setters to handle dirty state ---
  const setCategories: typeof setCategoriesState = (value) => {
    setCategoriesState(value);
    setIsDirty(true);
  };
  const setPredefinedTasks: typeof setPredefinedTasksState = (value) => {
    setPredefinedTasksState(value);
    setIsDirty(true);
  };
  const setMissionDetails: typeof setMissionDetailsState = (value) => {
    setMissionDetailsState(value);
    setIsDirty(true);
  };
  const setKarmaClubRewards: typeof setKarmaClubRewardsState = (value) => {
    setKarmaClubRewardsState(value);
    setIsDirty(true);
  };
   const setLeagues: typeof setLeaguesState = (value) => {
    setLeaguesState(value);
    setIsDirty(true);
  };
  const setBrands: typeof setBrandsState = (value) => {
    setBrandsState(value);
    setIsDirty(true);
  };
  const setCharities: typeof setCharitiesState = (value) => {
    setCharitiesState(value);
    setIsDirty(true);
  };
   const setIsCampaignBuilderEnabled: typeof setIsCampaignBuilderEnabledState = (value) => {
    setIsCampaignBuilderEnabledState(value);
    setIsDirty(true);
  };
   const setIsLeaguesEnabled: typeof setIsLeaguesEnabledState = (value) => {
    setIsLeaguesEnabledState(value);
    setIsDirty(true);
  };
  // --- End of wrappers ---

  useEffect(() => {
    api.fetchSettings().then(settings => {
      setCategoriesState(settings.categories);
      setPredefinedTasksState(settings.predefinedTasks);
      setMissionDetailsState(settings.missionDetails);
      setKarmaClubRewardsState(settings.karmaClubRewards);
      setLeaguesState(settings.leagues);
      setBrandsState(settings.brands);
      setCharitiesState(settings.charities);
      setIsCampaignBuilderEnabledState(settings.isCampaignBuilderEnabled);
      setIsLeaguesEnabledState(settings.isLeaguesEnabled);
      setIsLoading(false);
    }).catch(error => {
      console.error("Failed to load settings from API:", error);
      setIsLoading(false);
    });
  }, []);
  
  const saveAllSettings = async () => {
    try {
      await api.saveSettings({
          categories,
          predefinedTasks,
          missionDetails,
          karmaClubRewards,
          leagues,
          brands,
          charities,
          isCampaignBuilderEnabled,
          isLeaguesEnabled
      });
      setIsDirty(false); // Reset dirty state after saving
    } catch (error) {
      console.error("Failed to save all settings via API:", error);
    }
  };

    const redeemKarmaReward = (rewardId: number): { success: boolean, code?: string } => {
        let foundReward: KarmaReward | null = null;
        let categoryKey: string | null = null;
        const currentRewards = { ...karmaClubRewards };

        for (const category in currentRewards) {
            const reward = currentRewards[category].find(r => r.id === rewardId);
            if (reward) {
                foundReward = reward;
                categoryKey = category;
                break;
            }
        }
        
        if (!foundReward || !categoryKey) {
            return { success: false };
        }

        // Handle code-based rewards
        if (foundReward.codes && foundReward.codes.length > 0) {
            const rewardToUpdate = currentRewards[categoryKey].find((r: KarmaReward) => r.id === rewardId)!;
            const code = rewardToUpdate.codes!.shift();
            rewardToUpdate.quantity = rewardToUpdate.codes!.length;
            
            setKarmaClubRewards(currentRewards); // This sets the dirty flag
            return { success: true, code: code };
        } 
        // Handle generic, quantity-based rewards
        else if (foundReward.quantity > 0) {
            const rewardToUpdate = currentRewards[categoryKey].find((r: KarmaReward) => r.id === rewardId)!;
            rewardToUpdate.quantity -= 1;
            
            setKarmaClubRewards(currentRewards); // This sets the dirty flag
            return { success: true };
        }
        
        // If no codes and no quantity, it's out of stock
        return { success: false };
    };

  return (
    <SettingsContext.Provider value={{
      categories,
      setCategories,
      predefinedTasks,
      setPredefinedTasks,
      missionDetails,
      setMissionDetails,
      karmaClubRewards,
      setKarmaClubRewards,
      leagues,
      setLeagues,
      brands,
      setBrands,
      charities,
      setCharities,
      isCampaignBuilderEnabled,
      setIsCampaignBuilderEnabled,
      isLeaguesEnabled,
      setIsLeaguesEnabled,
      redeemKarmaReward,
      saveAllSettings,
      isDirty,
    }}>
      {!isLoading ? children : null}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
      throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
