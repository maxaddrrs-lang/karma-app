import { initialCampaigns, initialComments } from '../data/initialData';
import { USERS_DATA } from '../data/users';
import { INITIAL_CATEGORIES, PREDEFINED_TASKS, MISSION_DETAILS, INITIAL_KARMA_CLUB_REWARDS, INITIAL_LEAGUES } from '../constants';
import { NEWS_DATA } from '../data/notifications';
import type { Campaign, TaskCompletion, Comment, KarmaReward, CategorySetting, PartnerBrand, PartnerCharity, SupportChatMessage } from '../types';
import type { User as AdminUser } from '../data/users';
import type { League } from '../constants';
import type { Notification } from '../context/NotificationsContext';


const API_LATENCY = 100; // ms

// --- Generic Helpers ---
const simulateApiCall = <T>(data: T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), API_LATENCY);
  });
};

const getData = <T>(key: string, defaultValue: T): T => {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            return JSON.parse(storedValue) as T;
        }
    } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
    }
    // If not found or error, set the default value for next time
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
};

const setData = <T>(key: string, value: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
    }
};

// --- API Functions ---

// Campaigns
export const fetchCampaigns = (): Promise<Campaign[]> => simulateApiCall(getData('karma_campaigns', initialCampaigns));
export const saveCampaigns = (campaigns: Campaign[]): Promise<void> => simulateApiCall(setData('karma_campaigns', campaigns));

// Task Completions
export const fetchTaskCompletions = (): Promise<TaskCompletion[]> => simulateApiCall(getData('karma_task_completions', []));
export const saveTaskCompletions = (completions: TaskCompletion[]): Promise<void> => simulateApiCall(setData('karma_task_completions', completions));

// Comments
export const fetchComments = (): Promise<Comment[]> => simulateApiCall(getData('karma_comments', initialComments));
export const saveComments = (comments: Comment[]): Promise<void> => simulateApiCall(setData('karma_comments', comments));

// Auth & Users
export const fetchUsers = (): Promise<AdminUser[]> => simulateApiCall(getData('karma_users', USERS_DATA));
export const saveUsers = (users: AdminUser[]): Promise<void> => simulateApiCall(setData('karma_users', users));

export const fetchUserData = (identifier: string) => {
    const data = {
        karmaCoins: getData(`karma_coins_${identifier}`, 0),
        contributionValue: getData(`contribution_value_${identifier}`, 0),
        impactScore: getData(`impact_score_${identifier}`, 0),
        transactions: getData(`transactions_${identifier}`, []),
        socialIds: getData(`social_ids_${identifier}`, {}),
        redeemedCodes: getData(`redeemed_codes_${identifier}`, []),
    };
    return simulateApiCall(data);
};

export const saveUserData = (identifier: string, data: any) => {
    if (data.karmaCoins !== undefined) setData(`karma_coins_${identifier}`, data.karmaCoins);
    if (data.contributionValue !== undefined) setData(`contribution_value_${identifier}`, data.contributionValue);
    if (data.impactScore !== undefined) setData(`impact_score_${identifier}`, data.impactScore);
    if (data.transactions !== undefined) setData(`transactions_${identifier}`, data.transactions);
    if (data.socialIds !== undefined) setData(`social_ids_${identifier}`, data.socialIds);
    if (data.redeemedCodes !== undefined) setData(`redeemed_codes_${identifier}`, data.redeemedCodes);
    return simulateApiCall(undefined);
};

export const fetchCurrentUserIdentifier = (): Promise<string | null> => simulateApiCall(localStorage.getItem('userIdentifier'));
export const saveCurrentUserIdentifier = (identifier: string): Promise<void> => simulateApiCall(localStorage.setItem('userIdentifier', identifier));
export const clearCurrentUserIdentifier = (): Promise<void> => simulateApiCall(localStorage.removeItem('userIdentifier'));

// Settings
export const fetchSettings = () => {
    const settings = {
        categories: getData('karma_categories', INITIAL_CATEGORIES),
        predefinedTasks: getData('karma_predefined_tasks', PREDEFINED_TASKS),
        missionDetails: getData('karma_mission_details', MISSION_DETAILS),
        karmaClubRewards: getData('karma_club_rewards', INITIAL_KARMA_CLUB_REWARDS),
        leagues: getData('karma_leagues', INITIAL_LEAGUES),
        brands: getData('karma_brands', []),
        charities: getData('karma_charities', []),
        isCampaignBuilderEnabled: getData('karma_is_builder_enabled', false),
        isLeaguesEnabled: getData('karma_is_leagues_enabled', false),
    };
    return simulateApiCall(settings);
};

export const saveSettings = (settings: any) => {
    setData('karma_categories', settings.categories);
    setData('karma_predefined_tasks', settings.predefinedTasks);
    setData('karma_mission_details', settings.missionDetails);
    setData('karma_club_rewards', settings.karmaClubRewards);
    setData('karma_leagues', settings.leagues);
    setData('karma_brands', settings.brands);
    setData('karma_charities', settings.charities);
    setData('karma_is_builder_enabled', settings.isCampaignBuilderEnabled);
    setData('karma_is_leagues_enabled', settings.isLeaguesEnabled);
    return simulateApiCall(undefined);
};

// Chats
export const fetchChats = (): Promise<Record<string, SupportChatMessage[]>> => simulateApiCall(getData('karma_support_chats', {}));
export const saveChats = (chats: Record<string, SupportChatMessage[]>): Promise<void> => simulateApiCall(setData('karma_support_chats', chats));

// Notifications
export const fetchNotifications = (): Promise<Notification[]> => simulateApiCall(getData('karma_notifications', []));
export const saveNotifications = (notifications: Notification[]): Promise<void> => simulateApiCall(setData('karma_notifications', notifications));


// --- Backup / Restore API ---
const ALL_APP_KEYS_REGEX = /^karma_|^userIdentifier/;
const USER_DATA_KEYS_REGEX = /^(karma_users|karma_coins_|contribution_value_|impact_score_|transactions_|social_ids_|redeemed_codes_|userIdentifier)/;


export const backupData = (filterRegex: RegExp): Promise<string> => {
    const backupData: { [key: string]: string } = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && filterRegex.test(key)) {
            backupData[key] = localStorage.getItem(key)!;
        }
    }
    return simulateApiCall(JSON.stringify(backupData, null, 2));
}

export const restoreData = (json: string, clearFirst: boolean, filterRegex?: RegExp): Promise<void> => {
    const dataToRestore = JSON.parse(json);
    if (clearFirst) {
        localStorage.clear();
    } else if (filterRegex) {
        // Remove only the keys that will be restored
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && filterRegex.test(key)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }
    
    Object.keys(dataToRestore).forEach(key => {
        localStorage.setItem(key, dataToRestore[key]);
    });
    return simulateApiCall(undefined);
}

export const backupAllData = () => backupData(ALL_APP_KEYS_REGEX);
export const restoreAllData = (json: string) => restoreData(json, true);
export const backupUserData = () => backupData(USER_DATA_KEYS_REGEX);
export const restoreUserData = (json: string) => restoreData(json, false, USER_DATA_KEYS_REGEX);
