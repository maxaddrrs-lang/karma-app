
export type SocialPlatform = 'instagram' | 'x' | 'youtube' | 'telegram' | 'linkedin' | 'facebook';

export interface Task {
  id: number;
  description: string;
  type: 'social_media' | 'generic' | 'code_redemption';
  platform?: SocialPlatform;
  impactPoints: number;
  karmaCoins: number;
  targetUrl?: string;
}

export type CampaignStatus = 'active' | 'pending' | 'rejected' | 'completed';

export interface Campaign {
  id: number;
  mission: string;
  brandName: string;
  brandLogoUrl?: string;
  location: string;
  category: string;
  tasks: Task[];
  imageUrl: string;
  progress: number;
  targetAmount: number;
  daysLeft: number;
  sponsorMessage: string;
  status: CampaignStatus;
  creatorEmail: string;
}

export interface TaskCompletion {
  id: string;
  userId: string;
  campaignId: number;
  taskId: number;
  taskDescription: string;
  submittedData?: string;
  completedAt: string; // ISO date string
  impactPoints: number;
  karmaCoins: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Comment {
  id: number;
  campaignId: number;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string; // ISO date string
}

export interface KarmaReward {
  id: number;
  name: string;
  description: string;
  cost: number;
  quantity: number;
  codes?: string[];
}

export interface CategorySetting {
  name: string;
  iconUrl: string | null;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO date string
  type: 'earn' | 'spend';
}

export interface PartnerBrand {
    id: string;
    name: string;
    logoUrl: string;
}

export interface PartnerCharity {
    id: string;
    name: string;
    logoUrl: string;
    website: string;
}

export interface SupportChatMessage {
  id: string;
  sender: 'user' | 'support';
  text: string;
  timestamp: string; // ISO date string
  readByAdmin: boolean;
}

export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  date: string; // ISO date string
}