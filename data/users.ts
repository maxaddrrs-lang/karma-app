import type { SocialPlatform } from '../types';

export interface User {
  id: string;
  identifier: string; // email or phone
  karmaCoins: number;
  impactScore: number;
  status: 'active' | 'inactive';
  role: 'admin' | 'user';
  socialIds?: Partial<Record<SocialPlatform, string>>;
}

export const USERS_DATA: User[] = [
  { 
    id: 'user-1', 
    identifier: 'ali.rezaei@example.com', 
    karmaCoins: 150, 
    impactScore: 1250, 
    status: 'active',
    role: 'user',
    socialIds: {
      instagram: 'ali_rezaei',
      telegram: 'alireza_t',
    }
  },
  { 
    id: 'user-2', 
    identifier: 'sara.mohammadi@example.com', 
    karmaCoins: 20, 
    impactScore: 1100, 
    status: 'active',
    role: 'user',
    socialIds: {
      x: 'sara_tweets'
    }
  },
  { id: 'user-3', identifier: '09123456789', karmaCoins: 300, impactScore: 980, status: 'inactive', role: 'user' },
  { 
    id: 'user-4', 
    identifier: 'fatemeh.ahmadi@example.com', 
    karmaCoins: 80, 
    impactScore: 850, 
    status: 'active',
    role: 'user',
    socialIds: {
      youtube: 'FatemehAhmadiChannel'
    }
  },
  { id: 'user-5', identifier: 'reza.ghasemi@example.com', karmaCoins: 5, impactScore: 720, status: 'active', role: 'user' },
  { id: 'user-6', identifier: '09351112233', karmaCoins: 500, impactScore: 610, status: 'active', role: 'user' },
  { 
    id: 'user-7', 
    identifier: 'admin@karma.com', 
    karmaCoins: 999, 
    impactScore: 5000, 
    status: 'active',
    role: 'admin',
    socialIds: {
      instagram: 'karma_admin',
      x: 'karma_admin_x'
    }
  },
  { id: 'user-8', identifier: 'hassan.karimi@example.com', karmaCoins: 120, impactScore: 450, status: 'inactive', role: 'user' },
];