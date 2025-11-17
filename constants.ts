import type { CategorySetting, Task, KarmaReward } from './types';

export const taskTranslations: Record<string, string> = {
    story_campaign_poster: 'استوری کردن پوستر کمپین',
    like_last_post: 'لایک کردن آخرین پست',
    share_post_5_friends: 'ارسال پست برای ۵ نفر از دوستان',
    tweet_about_campaign: 'توییت در مورد کمپین',
    follow_linkedin: 'دنبال کردن صفحه لینکدین',
    reshare_video: 'بازنشر ویدیو کمپین',
    subscribe_youtube: 'عضویت در کانال یوتیوب',
    join_telegram: 'عضویت در کانال تلگرام',
    redeem_product_code: 'وارد کردن کد محصول',
    purchase_from_karma_store: 'خرید از سایت کارما',
    follow_instagram_page: 'دنبال کردن صفحه اینستاگرام',
    comment_on_post: 'کامنت گذاشتن زیر پست کمپین',
    follow_facebook_page: 'دنبال کردن صفحه فیسبوک',
    enter_partner_app_code: 'وارد کردن کد از اپ همکار',
    purchase_from_brand_site: 'خرید از سایت برند',
};

export const categoryTranslations: Record<string, string> = {
    food: 'غذا',
    health: 'سلامت و درمان',
    education: 'آموزش',
    environment: 'محیط زیست',
    animals: 'حمایت از حیوانات',
    children: 'کودکان',
    entrepreneurship: 'کارآفرینی',
    other: 'متفرقه',
};


// --- LEAGUES ---
export interface League {
  name: string;
  minCoins: number;
  maxCoins: number;
  icon: string;
  iconColor: string;
  textColor: string;
  color: string;
  prizeDescription: string;
}

export const INITIAL_LEAGUES: League[] = [
  { name: 'برنز', minCoins: 0, maxCoins: 99, icon: '🥉', iconColor: 'text-orange-400', textColor: 'text-orange-600', color: 'bg-orange-100', prizeDescription: '۱۰٪ تخفیف در فروشگاه کارما' },
  { name: 'نقره', minCoins: 100, maxCoins: 299, icon: '🥈', iconColor: 'text-gray-400', textColor: 'text-gray-600', color: 'bg-gray-100', prizeDescription: '۲۰٪ تخفیف + دسترسی به ماموریت‌های ویژه' },
  { name: 'طلا', minCoins: 300, maxCoins: 699, icon: '🥇', iconColor: 'text-yellow-400', textColor: 'text-yellow-600', color: 'bg-yellow-100', prizeDescription: '۳۰٪ تخفیف + ۲ برابر سکه در هفته آینده' },
  { name: 'الماس', minCoins: 700, maxCoins: Infinity, icon: '💎', iconColor: 'text-blue-400', textColor: 'text-blue-600', color: 'bg-blue-100', prizeDescription: '۵۰٪ تخفیف + نشان ویژه پروفایل' },
];

// --- CATEGORIES ---
export const INITIAL_CATEGORIES: CategorySetting[] = [
    { name: 'food', iconUrl: null },
    { name: 'health', iconUrl: null },
    { name: 'education', iconUrl: null },
    { name: 'environment', iconUrl: null },
    { name: 'animals', iconUrl: null },
    { name: 'children', iconUrl: null },
    { name: 'entrepreneurship', iconUrl: null },
    { name: 'other', iconUrl: null },
];

export const CATEGORY_KEYS = INITIAL_CATEGORIES.map(c => c.name);


// --- PREDEFINED TASKS for Campaign Creation ---
type PredefinedTask = Omit<Task, 'id'>;

export const PREDEFINED_TASKS: Record<string, PredefinedTask[]> = {
    socialMedia: [
        { description: 'استوری کردن پوستر کمپین', type: 'social_media', platform: 'instagram', impactPoints: 10, karmaCoins: 8 },
        { description: 'دنبال کردن صفحه اینستاگرام', type: 'social_media', platform: 'instagram', impactPoints: 5, karmaCoins: 3 },
        { description: 'لایک کردن آخرین پست', type: 'social_media', platform: 'instagram', impactPoints: 5, karmaCoins: 3 },
        { description: 'کامنت گذاشتن زیر پست کمپین', type: 'social_media', platform: 'instagram', impactPoints: 4, karmaCoins: 2 },
        { description: 'ارسال پست برای ۵ نفر از دوستان', type: 'generic', impactPoints: 5, karmaCoins: 4 },
        { description: 'توییت در مورد کمپین', type: 'social_media', platform: 'x', impactPoints: 8, karmaCoins: 6 },
        { description: 'دنبال کردن صفحه لینکدین', type: 'social_media', platform: 'linkedin', impactPoints: 5, karmaCoins: 3 },
        { description: 'بازنشر ویدیو کمپین', type: 'social_media', platform: 'instagram', impactPoints: 8, karmaCoins: 5 },
        { description: 'عضویت در کانال یوتیوب', type: 'social_media', platform: 'youtube', impactPoints: 7, karmaCoins: 5 },
        { description: 'عضویت در کانال تلگرام', type: 'social_media', platform: 'telegram', impactPoints: 6, karmaCoins: 4 },
        { description: 'دنبال کردن صفحه فیسبوک', type: 'social_media', platform: 'facebook', impactPoints: 5, karmaCoins: 3 },
    ],
    partnerActions: [
        { description: 'وارد کردن کد محصول', type: 'code_redemption', impactPoints: 15, karmaCoins: 12 },
        { description: 'وارد کردن کد از اپ همکار', type: 'code_redemption', impactPoints: 15, karmaCoins: 12 },
        { description: 'خرید از سایت برند', type: 'generic', impactPoints: 20, karmaCoins: 15 },
        { description: 'خرید از سایت کارما', type: 'generic', impactPoints: 20, karmaCoins: 15 },
    ],
};

export const PREDEFINED_TASK_CATEGORIES = {
  socialMedia: 'ماموریت های شبکات اجتماعی',
  partnerActions: 'ماموریت های همکاری و اقدام',
};

// --- CAMPAIGN TEMPLATES (Mission Details) ---
export const MISSION_DETAILS = {
    food: {
        labelKey: 'mission_details.food.label',
        quantityLabelKey: 'mission_details.food.quantityLabel',
        minQuantity: 50,
        costPerUnit: 150000,
        defaultCategory: 'food',
        imageUrl: 'https://images.unsplash.com/photo-1599028422289-53f75d18b265?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    school_supplies: {
        labelKey: 'mission_details.school_supplies.label',
        quantityLabelKey: 'mission_details.school_supplies.quantityLabel',
        minQuantity: 30,
        costPerUnit: 500000,
        defaultCategory: 'education',
        imageUrl: 'https://images.unsplash.com/photo-1484653692881-7c285871440e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    medical: {
        labelKey: 'mission_details.medical.label',
        quantityLabelKey: 'mission_details.medical.quantityLabel',
        minQuantity: 1,
        costPerUnit: 5000000,
        defaultCategory: 'health',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    production: {
        labelKey: 'mission_details.production.label',
        quantityLabelKey: 'mission_details.production.quantityLabel',
        minQuantity: 1,
        costPerUnit: 10000000,
        defaultCategory: 'entrepreneurship',
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
};

// --- KARMA CLUB REWARDS ---
export const INITIAL_KARMA_CLUB_REWARDS: Record<string, KarmaReward[]> = {
    investment: [
        { id: 101, name: 'clothing', description: 'clothing_desc', cost: 100, quantity: 2, codes: ['INVEST-CLOTH-A1', 'INVEST-CLOTH-B2'] },
        { id: 102, name: 'shoes', description: 'shoes_desc', cost: 120, quantity: 2, codes: ['INVEST-SHOE-A1', 'INVEST-SHOE-B2'] },
        { id: 103, name: 'home_goods', description: 'home_goods_desc', cost: 150, quantity: 2, codes: ['INVEST-HOME-A1', 'INVEST-HOME-B2'] },
        { id: 104, name: 'karma_coin', description: 'karma_coin_desc', cost: 200, quantity: 2, codes: ['INVEST-COIN-A1', 'INVEST-COIN-B2'] },
    ],
    discounts: [
        { id: 201, name: 'store', description: 'store_desc', cost: 50, quantity: 3, codes: ['DISC-STORE-A1','DISC-STORE-B2','DISC-STORE-C3'] },
        { id: 202, name: 'store_verified', description: 'store_verified_desc', cost: 70, quantity: 3, codes: ['DISC-GREEN-A1','DISC-GREEN-B2','DISC-GREEN-C3'] },
        { id: 203, name: 'restaurant', description: 'restaurant_desc', cost: 80, quantity: 3, codes: ['DISC-FOOD-A1','DISC-FOOD-B2','DISC-FOOD-C3'] },
        { id: 204, name: 'appliances', description: 'appliances_desc', cost: 250, quantity: 3, codes: ['DISC-APPL-A1','DISC-APPL-B2','DISC-APPL-C3'] },
    ],
    courses: [
        { id: 301, name: 'photoshop', description: 'photoshop_desc', cost: 90, quantity: 4, codes: ['COURSE-PS-A1','COURSE-PS-B2','COURSE-PS-C3', 'COURSE-PS-D4'] },
        { id: 302, name: 'online', description: 'online_desc', cost: 40, quantity: 4, codes: ['COURSE-GEN-A1','COURSE-GEN-B2','COURSE-GEN-C3', 'COURSE-GEN-D4'] },
        { id: 303, name: 'filimo', description: 'filimo_desc', cost: 60, quantity: 4, codes: ['COURSE-FILIMO-A1','COURSE-FILIMO-B2','COURSE-FILIMO-C3', 'COURSE-FILIMO-D4'] },
        { id: 304, name: 'photoshop_premium', description: 'photoshop_premium_desc', cost: 300, quantity: 4, codes: ['COURSE-PSPRO-A1','COURSE-PSPRO-B2','COURSE-PSPRO-C3', 'COURSE-PSPRO-D4'] },
    ],
    vouchers: [
        { id: 401, name: 'snapp_voucher', description: 'snapp_voucher_desc', cost: 20, quantity: 10, codes: ['SNAP-A1', 'SNAP-A2', 'SNAP-A3', 'SNAP-A4', 'SNAP-A5', 'SNAP-A6', 'SNAP-A7', 'SNAP-A8', 'SNAP-A9', 'SNAP-A10' ] },
    ],
};
