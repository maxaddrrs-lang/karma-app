
import type { NewsArticle } from '../types';

export const NEWS_DATA: NewsArticle[] = [
    {
        id: 1,
        title: "کمپین جدید 'غذای گرم برای کودکان کار' آغاز شد",
        content: "با همکاری رستوران برادران، کمپین جدیدی برای تهیه ۱۰۰۰ پرس غذای گرم برای کودکان کار در مناطق محروم تهران آغاز شده است. شما می‌توانید با انجام ماموریت‌های ساده در این کمپین مشارکت کنید.",
        imageUrl: "https://images.unsplash.com/photo-1599028422870-6582ff447868?q=80&w=600&auto=format&fit=crop",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 2,
        title: "با موفقیت کمپین 'جمع‌آوری کتاب'، کتابخانه روستا تجهیز شد",
        content: "از تمام کسانی که در کمپین جمع‌آوری کتاب برای کتابخانه روستای محروم شرکت کردند سپاسگزاریم. به لطف شما، بیش از ۵۰۰ جلد کتاب جمع‌آوری و کتابخانه روستا افتتاح شد. گزارش کامل به زودی منتشر می‌شود.",
        imageUrl: "https://images.unsplash.com/photo-1531988042231-f39a6cc12a9a?q=80&w=600&auto=format&fit=crop",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
     {
        id: 3,
        title: "به باشگاه کارما بپیوندید و از جوایز ویژه بهره‌مند شوید",
        content: "با انجام ماموریت‌ها، سکه کارما کسب کنید و در باشگاه کارما از جوایز و تخفیف‌های ویژه همکاران ما بهره‌مند شوید. جوایز جدید این ماه اضافه شدند!",
        imageUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=600&auto=format&fit=crop",
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    }
];
