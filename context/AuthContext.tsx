import React, { createContext, useState, ReactNode, useEffect } from 'react';
import type { Transaction, SocialPlatform } from '../types';
import type { User as AdminUser } from '../data/users';
import * as api from '../services/api';

export type RedeemedCode = {
  name: string;
  code: string;
  date: string;
};

interface AuthContextType {
  isAuthenticated: boolean;
  userIdentifier: string | null;
  isAdmin: boolean;
  karmaCoins: number;
  contributionValue: number;
  impactScore: number;
  transactions: Transaction[];
  socialIds: Partial<Record<SocialPlatform, string>>;
  redeemedCodes: RedeemedCode[];
  login: (identifier: string) => void;
  logout: () => void;
  recordTaskCompletion: (description: string, impactPoints: number, karmaCoins: number) => void;
  addContribution: (campaignTarget: number, taskImpactPoints: number) => void;
  addDirectContribution: (amount: number) => void;
  withdrawContribution: (amount: number) => boolean;
  spendKarmaCoins: (amount: number, description: string, rewardInfo?: { name: string; code?: string }) => boolean;
  updateSocialIds: (newIds: Partial<Record<SocialPlatform, string>>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_IDENTIFIER = 'admin@karma.com';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userIdentifier, setUserIdentifier] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [karmaCoins, setKarmaCoins] = useState<number>(0);
  const [contributionValue, setContributionValue] = useState<number>(0);
  const [impactScore, setImpactScore] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [socialIds, setSocialIds] = useState<Partial<Record<SocialPlatform, string>>>({});
  const [redeemedCodes, setRedeemedCodes] = useState<RedeemedCode[]>([]);

  useEffect(() => {
    // Check for persisted login state on initial load
    api.fetchCurrentUserIdentifier().then(storedIdentifier => {
      if (storedIdentifier) {
        login(storedIdentifier);
      }
    });
  }, []);

  const updateUserInMasterList = async (identifier: string, updates: Partial<AdminUser>) => {
    const allUsers = await api.fetchUsers();
    const userIndex = allUsers.findIndex(u => u.identifier === identifier);
    if (userIndex !== -1) {
      allUsers[userIndex] = { ...allUsers[userIndex], ...updates };
      await api.saveUsers(allUsers);
    }
  };

  const login = async (identifier: string) => {
    // --- Auto-register new user in admin panel ---
    const allUsers = await api.fetchUsers();
    const userExists = allUsers.some(u => u.identifier === identifier);
    if (!userExists) {
      const newUser: AdminUser = {
        id: `user-${Date.now()}`,
        identifier,
        karmaCoins: 0,
        impactScore: 0,
        status: 'active',
        role: 'user',
        socialIds: {},
      };
      await api.saveUsers([...allUsers, newUser]);
    }
    // --- End of auto-register logic ---

    await api.saveCurrentUserIdentifier(identifier);
    setIsAuthenticated(true);
    setUserIdentifier(identifier);
    setIsAdmin(identifier === ADMIN_IDENTIFIER);
    
    const userData = await api.fetchUserData(identifier);
    setKarmaCoins(userData.karmaCoins);
    setContributionValue(userData.contributionValue);
    setImpactScore(userData.impactScore);
    setTransactions(userData.transactions);
    setSocialIds(userData.socialIds);
    setRedeemedCodes(userData.redeemedCodes);
  };

  const logout = async () => {
    await api.clearCurrentUserIdentifier();
    setIsAuthenticated(false);
    setUserIdentifier(null);
    setIsAdmin(false);
    setKarmaCoins(0);
    setContributionValue(0);
    setImpactScore(0);
    setTransactions([]);
    setSocialIds({});
    setRedeemedCodes([]);
  };

  const recordTaskCompletion = (description: string, impactPoints: number, karmaCoins: number) => {
    if (userIdentifier) {
        const newTransaction: Transaction = {
          id: `${new Date().toISOString()}-${Math.random()}`,
          description,
          amount: karmaCoins,
          date: new Date().toISOString(),
          type: 'earn',
        };
        
        const newTotalCoins = karmaCoins + (transactions.reduce((sum, tx) => sum + (tx.type === 'earn' ? tx.amount : 0), 0) - transactions.reduce((sum, tx) => sum + (tx.type === 'spend' ? Math.abs(tx.amount) : 0), 0));
        const newTotalScore = impactScore + impactPoints;
        const newTransactions = [newTransaction, ...transactions];

        setTransactions(newTransactions);
        setKarmaCoins(newTotalCoins);
        setImpactScore(newTotalScore);
        
        api.saveUserData(userIdentifier, {
          transactions: newTransactions,
          karmaCoins: newTotalCoins,
          impactScore: newTotalScore,
        });

        updateUserInMasterList(userIdentifier, { karmaCoins: newTotalCoins, impactScore: newTotalScore });
    }
  };

  const addContribution = (campaignTarget: number, taskImpactPoints: number) => {
    if (userIdentifier) {
        const valueToAdd = (taskImpactPoints / 100) * campaignTarget;
        const newValue = contributionValue + valueToAdd;
        setContributionValue(newValue);
        api.saveUserData(userIdentifier, { contributionValue: newValue });
    }
  };
  
  const addDirectContribution = (amount: number) => {
      if (userIdentifier && amount > 0) {
          const newValue = contributionValue + amount;
          setContributionValue(newValue);
          api.saveUserData(userIdentifier, { contributionValue: newValue });
      }
  };

  const withdrawContribution = (amount: number): boolean => {
      if (userIdentifier && contributionValue >= amount) {
          const newValue = contributionValue - amount;
          setContributionValue(newValue);
          api.saveUserData(userIdentifier, { contributionValue: newValue });
          return true;
      }
      return false;
  };

  const spendKarmaCoins = (amount: number, description: string, rewardInfo?: { name: string; code?: string }): boolean => {
      if (userIdentifier && karmaCoins >= amount) {
          const newTransaction: Transaction = {
            id: `${new Date().toISOString()}-${Math.random()}`,
            description,
            amount: -amount,
            date: new Date().toISOString(),
            type: 'spend',
          };

          const newTransactions = [newTransaction, ...transactions];
          const newCoins = karmaCoins - amount;
          let newRedeemed = [...redeemedCodes];

          if (rewardInfo) {
            const newRedeemedCode: RedeemedCode = {
              name: rewardInfo.name,
              code: rewardInfo.code || 'دریافت شد',
              date: new Date().toISOString(),
            };
            newRedeemed = [newRedeemedCode, ...newRedeemed];
          }
          
          setTransactions(newTransactions);
          setKarmaCoins(newCoins);
          setRedeemedCodes(newRedeemed);

          api.saveUserData(userIdentifier, {
              transactions: newTransactions,
              karmaCoins: newCoins,
              redeemedCodes: newRedeemed,
          });
          updateUserInMasterList(userIdentifier, { karmaCoins: newCoins });
          return true;
      }
      return false;
  }

  const updateSocialIds = (newIds: Partial<Record<SocialPlatform, string>>) => {
    if (userIdentifier) {
        const updatedIds = { ...socialIds, ...newIds };
        setSocialIds(updatedIds);
        api.saveUserData(userIdentifier, { socialIds: updatedIds });
        updateUserInMasterList(userIdentifier, { socialIds: updatedIds });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userIdentifier, 
      isAdmin, 
      karmaCoins, 
      contributionValue,
      impactScore, 
      login, 
      logout, 
      recordTaskCompletion, 
      addContribution,
      addDirectContribution,
      withdrawContribution,
      spendKarmaCoins, 
      transactions, 
      socialIds,
      redeemedCodes,
      updateSocialIds 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
