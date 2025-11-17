export interface LeaderboardUser {
  id: string;
  name: string;
  avatarUrl: string;
  score: number;
}

export const LEADERBOARD_DATA: LeaderboardUser[] = [
  { id: 'user-1', name: 'علی رضایی', avatarUrl: 'https://i.pravatar.cc/150?u=user-1', score: 1250 },
  { id: 'user-2', name: 'سارا محمدی', avatarUrl: 'https://i.pravatar.cc/150?u=user-2', score: 1100 },
  { id: 'user-3', name: 'محمد حسینی', avatarUrl: 'https://i.pravatar.cc/150?u=user-3', score: 980 },
  { id: 'user-4', name: 'فاطمه احمدی', avatarUrl: 'https://i.pravatar.cc/150?u=user-4', score: 850 },
  { id: 'user-5', name: 'رضا قاسمی', avatarUrl: 'https://i.pravatar.cc/150?u=user-5', score: 720 },
  { id: 'user-6', name: 'مریم نوری', avatarUrl: 'https://i.pravatar.cc/150?u=user-6', score: 610 },
  { id: 'user-8', name: 'حسن کریمی', avatarUrl: 'https://i.pravatar.cc/150?u=user-8', score: 450 },
  { id: 'user-9', name: 'نگار جعفری', avatarUrl: 'https://i.pravatar.cc/150?u=user-9', score: 300 },
  { id: 'user-10', name: 'امیر مرادی', avatarUrl: 'https://i.pravatar.cc/150?u=user-10', score: 150 },
];
