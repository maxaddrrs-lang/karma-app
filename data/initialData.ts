import type { Campaign, Comment } from '../types';

const defaultSponsorMessage = `به نام خدا
اول از مجموعه کارما کمال تشکر رو دارم که یک بستری فراه اوردن تا ما و مجموعه بتوانیم یک قدم با ثبات تری در عرصه کمک رسانی به مردم نیازمند بر داریم
و تشکر می کنم از شما که در این مسیر خیرخواهانه ماموریت ما رو انتخاب کردید و سپاس گذاری میکنم با تکمیل چرخه های پایین به ما کمک کنید تا بتوانیم وظیفه خودمون انجام بدهیم`;

export const initialCampaigns: Campaign[] = [
  {
    id: 1,
    mission: 'تهیه 100 پرس غذای گرم برای کودکان کار',
    brandName: 'رستوران برادران',
    brandLogoUrl: 'https://logo.clearbit.com/boraderan.com',
    location: 'تهران',
    category: 'food',
    tasks: [
      { id: 1, description: 'استوری کردن پوستر کمپین در اینستاگرام', type: 'social_media', platform: 'instagram', impactPoints: 10, karmaCoins: 8, targetUrl: 'https://www.instagram.com/p/C273y2fI8a4/' },
      { id: 2, description: 'لایک کردن پست آخر پیج ما', type: 'social_media', platform: 'instagram', impactPoints: 5, karmaCoins: 3 },
      { id: 3, description: 'ارسال پست کمپین برای ۵ نفر از دوستان', type: 'generic', impactPoints: 5, karmaCoins: 4 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1599028422870-6582ff447868?q=80&w=600&auto=format=fit=crop',
    progress: 75,
    targetAmount: 10000000,
    daysLeft: 12,
    sponsorMessage: defaultSponsorMessage,
    status: 'active',
    creatorEmail: 'creator@boraderan.com',
  },
  {
    id: 2,
    mission: 'جمع‌آوری کتاب برای کتابخانه یک روستای محروم',
    brandName: 'انتشارات دانش',
    brandLogoUrl: 'https://logo.clearbit.com/daneshpub.com',
    location: 'سیستان و بلوچستان',
    category: 'education',
    tasks: [
        { id: 1, description: 'معرفی کمپین در یک توییت', type: 'social_media', platform: 'x', impactPoints: 8, karmaCoins: 6 },
        { id: 2, description: 'دنبال کردن صفحه ما در لینکدین', type: 'social_media', platform: 'linkedin', impactPoints: 5, karmaCoins: 3, targetUrl: 'https://www.linkedin.com' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1531988042231-f39a6cc12a9a?q=80&w=600&auto=format=fit=crop',
    progress: 40,
    targetAmount: 5000000,
    daysLeft: 30,
    sponsorMessage: defaultSponsorMessage,
    status: 'active',
    creatorEmail: 'creator@daneshpub.com',
  },
  {
    id: 3,
    mission: 'هزینه درمان یک کودک مبتلا به بیماری خاص',
    brandName: 'خیریه مردم نهاد امید',
    brandLogoUrl: 'https://logo.clearbit.com/omid-charity.org',
    location: 'سراسر ایران',
    category: 'health',
    tasks: [
        { id: 1, description: 'بازنشر ویدیوی کمپین در شبکه های اجتماعی', type: 'social_media', platform: 'instagram', impactPoints: 8, karmaCoins: 5 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1584982242339-383282f6f55a?q=80&w=600&auto=format=fit=crop',
    progress: 95,
    targetAmount: 25000000,
    daysLeft: 5,
    sponsorMessage: defaultSponsorMessage,
    status: 'pending',
    creatorEmail: 'admin@karma.com',
  },
];

export const initialComments: Comment[] = [
    { id: 1, campaignId: 1, userId: 'bahram@example.com', userName: "بهرام رادان", userAvatar: "https://i.pravatar.cc/150?u=bahram", text: "من خیلی خوشحالم من یک محتوای خیلی جذاب تو یوتیوب دیدم که خیلی بهم اعتماد به نفس داد و تونستم به کودکان سرطانی هم کمک کنم مرسی کارما", createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
    { id: 2, campaignId: 1, userId: 'mehdi@example.com', userName: "مهدی دارابی", userAvatar: "https://i.pravatar.cc/150?u=mehdi", text: "ممنون که با یک موسیقی جذاب حالم رو خوب کردید و ازتون ممنون که باعث شدید با گوش کردن به یک موزیک بتونم کمک کنم", createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
];
