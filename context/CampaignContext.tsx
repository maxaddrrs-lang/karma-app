import React, { createContext, useState, ReactNode, useEffect } from 'react';
import type { Campaign, Task, SocialPlatform, TaskCompletion, Comment } from '../types';
import { useAuth } from '../hooks/useAuth';
import { taskTranslations } from '../constants';
import { useLanguage } from '../hooks/useLanguage';
import * as api from '../services/api';

export type TaskStatus = 'pending' | 'completed';

export interface TaskState {
    status: TaskStatus;
    data?: any;
}


interface CampaignContextType {
  campaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, 'id' | 'progress' | 'status' | 'creatorEmail'>) => void;
  updateCampaign: (updatedCampaign: Campaign) => void;
  deleteCampaign: (id: number) => void;
  setCampaignStatus: (id: number, status: 'active' | 'rejected') => void;
  submitSocialMediaTask: (campaignId: number, taskId: number, socialId: string, task: Task, userId: string) => void;
  completeGenericTask: (campaignId: number, taskId: number, task: Task, userId: string, submittedData?: string) => void;
  approveTaskCompletion: (completionId: string) => void;
  rejectTaskCompletion: (completionId: string) => void;
  taskCompletions: TaskCompletion[];
  comments: Comment[];
  addComment: (campaignId: number, userId: string, text: string) => void;
  deleteComment: (commentId: number) => void;
}

export const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useLanguage();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [taskCompletions, setTaskCompletions] = useState<TaskCompletion[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const { recordTaskCompletion, userIdentifier, addContribution } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        try {
            const [
                fetchedCampaigns,
                fetchedCompletions,
                fetchedComments
            ] = await Promise.all([
                api.fetchCampaigns(),
                api.fetchTaskCompletions(),
                api.fetchComments()
            ]);
            setCampaigns(fetchedCampaigns);
            setTaskCompletions(fetchedCompletions);
            setComments(fetchedComments);
        } catch (error) {
            console.error("Failed to load campaign data:", error);
            // Handle error, maybe show a toast
        } finally {
            setIsLoading(false);
        }
    };
    loadData();
  }, []);
  
  const logTaskCompletion = (
    userId: string,
    campaignId: number,
    task: Task,
    status: TaskCompletion['status'],
    submittedData?: string
  ) => {
    const newCompletion: TaskCompletion = {
      id: `${userId}-${campaignId}-${task.id}-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      userId,
      campaignId,
      taskId: task.id,
      taskDescription: task.description,
      submittedData,
      completedAt: new Date().toISOString(),
      impactPoints: task.impactPoints,
      karmaCoins: task.karmaCoins || 0,
      status,
    };
    setTaskCompletions(prevCompletions => {
      const updatedCompletions = [newCompletion, ...prevCompletions];
      api.saveTaskCompletions(updatedCompletions);
      return updatedCompletions;
    });
  };

  const addCampaign = (campaignData: Omit<Campaign, 'id' | 'progress' | 'status' | 'creatorEmail'>) => {
    setCampaigns(prevCampaigns => {
      const newCampaign: Campaign = {
        ...campaignData,
        id: prevCampaigns.length > 0 ? Math.max(...prevCampaigns.map(c => c.id)) + 1 : 1,
        progress: 0,
        status: 'pending',
        creatorEmail: userIdentifier || 'anonymous@example.com',
      };
      const updatedCampaigns = [newCampaign, ...prevCampaigns];
      api.saveCampaigns(updatedCampaigns);
      return updatedCampaigns;
    });
  };

  const updateCampaign = (updatedCampaign: Campaign) => {
    setCampaigns(prevCampaigns => {
        const updatedCampaigns = prevCampaigns.map(campaign =>
            campaign.id === updatedCampaign.id ? updatedCampaign : campaign
        );
        api.saveCampaigns(updatedCampaigns);
        return updatedCampaigns;
    });
  };

  const deleteCampaign = (id: number) => {
    setCampaigns(prevCampaigns => {
        const updatedCampaigns = prevCampaigns.filter(c => c.id !== id);
        api.saveCampaigns(updatedCampaigns);
        return updatedCampaigns;
    });
  };

  const setCampaignStatus = (id: number, status: 'active' | 'rejected') => {
    setCampaigns(prevCampaigns => {
        const updatedCampaigns = prevCampaigns.map(campaign =>
            campaign.id === id ? { ...campaign, status } : campaign
        );
        api.saveCampaigns(updatedCampaigns);
        return updatedCampaigns;
    });
  };

  const updateCampaignProgress = (campaignId: number, pointsToAdd: number) => {
    setCampaigns(prevCampaigns => {
      let completedCampaign: Campaign | null = null;

      const updatedCampaigns = prevCampaigns.map(c => {
        if (c.id === campaignId) {
          const newProgress = Math.min(100, c.progress + pointsToAdd);
          if (newProgress >= 100 && c.status === 'active') {
             const updatedCampaign = { ...c, progress: 100, status: 'completed' as const };
             completedCampaign = updatedCampaign;
             return updatedCampaign;
          }
          return { ...c, progress: newProgress };
        }
        return c;
      });

      api.saveCampaigns(updatedCampaigns);
      return updatedCampaigns;
    });
  };

  const submitSocialMediaTask = (campaignId: number, taskId: number, socialId: string, task: Task, userId: string) => {
    logTaskCompletion(userId, campaignId, task, 'pending', socialId);
  }

  const completeGenericTask = (campaignId: number, taskId: number, task: Task, userId: string, submittedData?: string) => {
      logTaskCompletion(userId, campaignId, task, 'approved', submittedData);
      recordTaskCompletion(task.description, task.impactPoints, task.karmaCoins || 0);
      updateCampaignProgress(campaignId, task.impactPoints);
      const campaign = campaigns.find(c => c.id === campaignId);
      if (campaign) {
        addContribution(campaign.targetAmount, task.impactPoints);
      }
  }
  
  const approveTaskCompletion = (completionId: string) => {
    const completion = taskCompletions.find(tc => tc.id === completionId);
    if (!completion || completion.status !== 'pending') return;

    // Award points and update progress
    recordTaskCompletion(completion.taskDescription, completion.impactPoints, completion.karmaCoins);
    updateCampaignProgress(completion.campaignId, completion.impactPoints);
    const campaign = campaigns.find(c => c.id === completion.campaignId);
    if (campaign) {
      addContribution(campaign.targetAmount, completion.impactPoints);
    }

    // Update completion status
    setTaskCompletions(prevCompletions => {
      const updatedCompletions = prevCompletions.map(tc => 
        tc.id === completionId ? { ...tc, status: 'approved' as const } : tc
      );
      api.saveTaskCompletions(updatedCompletions);
      return updatedCompletions;
    });
  };

  const rejectTaskCompletion = (completionId: string) => {
    const completion = taskCompletions.find(tc => tc.id === completionId);
    if (!completion || completion.status !== 'pending') return;
    
    // Update completion status
    setTaskCompletions(prevCompletions => {
        const updatedCompletions = prevCompletions.map(tc => 
          tc.id === completionId ? { ...tc, status: 'rejected' as const } : tc
        );
        api.saveTaskCompletions(updatedCompletions);
        return updatedCompletions;
    });
  };

  const addComment = (campaignId: number, userId: string, text: string) => {
    setComments(prevComments => {
      const newComment: Comment = {
        id: (prevComments.length > 0 ? Math.max(...prevComments.map(c => c.id)) + 1 : 1),
        campaignId,
        userId,
        userName: userIdentifier ? userIdentifier.split('@')[0] : "کاربر",
        userAvatar: `https://i.pravatar.cc/150?u=${userId}`,
        text,
        createdAt: new Date().toISOString(),
      };
      const updatedComments = [newComment, ...prevComments];
      api.saveComments(updatedComments);
      return updatedComments;
    });
  };

  const deleteComment = (commentId: number) => {
    setComments(prevComments => {
        const updatedComments = prevComments.filter(comment => comment.id !== commentId);
        api.saveComments(updatedComments);
        return updatedComments;
    });
  };

  return (
    <CampaignContext.Provider value={{ 
      campaigns, 
      addCampaign,
      updateCampaign,
      deleteCampaign,
      setCampaignStatus,
      submitSocialMediaTask,
      completeGenericTask,
      approveTaskCompletion,
      rejectTaskCompletion,
      taskCompletions,
      comments,
      addComment,
      deleteComment,
    }}>
      {!isLoading ? children : null /* Or a loading spinner */}
    </CampaignContext.Provider>
  );
};
