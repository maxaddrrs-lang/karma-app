
import React, { createContext, useState, ReactNode, useCallback } from 'react';

// Embedded translations to avoid adding new files. In a real app, these would be in separate JSON files.
const faTranslations = {
    "header": { "home": "خانه", "campaigns": "ماموریت‌ها", "karmaClub": "باشگاه کارما", "adminPanel": "پنل ادمین", "createCampaign": "ایجاد کمپین", "userProfile": "پروفایل کاربری", "logout": "خروج", "login": "ورود / ثبت نام" },
    "bottomNav": { "home": "خانه", "missions": "ماموریت‌ها", "news": "اخبار", "karmaClub": "باشگاه", "profile": "پروفایل" },
    "general": { "select": "انتخاب کنید..." },
    "notifications": { "news": "اخبار و اطلاعیه‌ها", "karmaClub": "باشگاه کارما" },
    "categories_list": { "food": "غذا", "health": "سلامت و درمان", "education": "آموزش", "environment": "محیط زیست", "animals": "حمایت از حیوانات", "children": "کودکان", "entrepreneurship": "کارآفرینی", "other": "متفرقه" },
    "home": { "welcome": "به پلتفرم ", "karma": "کارما", "subtitle": "جایی که اقدامات کوچک شما، تغییرات بزرگی را رقم می‌زند. به ماموریت‌های اجتماعی بپیوندید و تاثیرگذار باشید.", "createCampaign": "کمپین خود را بسازید", "joinCampaign": "به یک ماموریت بپیوندید" },
    "login": { "title": "به حساب کاربری خود وارد شوید", "subtitle": "یا یک حساب جدید بسازید", "emailOrPhone": "ایمیل یا شماره موبایل", "placeholder": "example@mail.com", "login": "ورود", "error": { "empty": "لطفا ایمیل یا شماره موبایل خود را وارد کنید.", "invalid": "لطفا یک ایمیل یا شماره موبایل معتبر وارد کنید." } },
    "campaignsList": { "title": "ماموریت‌های فعال", "subtitle": "یک ماموریت را انتخاب کنید و به قهرمانان تغییر بپیوندید.", "filters": "فیلترها", "searchPlaceholder": "جستجو در ماموریت‌ها...", "category": "دسته‌بندی", "location": "مکان", "locationPlaceholder": "مثلا: تهران", "resetFilters": "حذف فیلترها", "noCampaigns": "هیچ کمپینی یافت نشد!", "tryChangingFilters": "برای دیدن نتایج بیشتر، فیلترهای خود را تغییر دهید یا حذف کنید.", "showAllCampaigns": "نمایش همه کمپین‌ها" },
    "campaignCard": { "by": "توسط", "viewAndJoin": "مشاهده و مشارکت", "completed": "{{percent}}% تکمیل شده", "totalAmount": "مبلغ کل:", "million": "میلیون", "toman": "تومان", "missionReport": "گزارش ماموریت" },
    "campaignDetail": { "campaigner": "برگزارکننده کمپین", "verifiedAccount": "حساب تایید شده" },
    "campaignProgressBar": { "progress": "پیشرفت", "target": "مبلغ هدف", "toman": "تومان", "daysLeft": "روز باقی‌مانده" },
    "karmaClub": { "title": "باشگاه کارما", "subtitle": "از سکه‌های کارمای خود برای دریافت جوایز شگفت‌انگیز از همکاران ما استفاده کنید.", "yourBalance": "موجودی شما", "coins": "سکه", "redeem": "دریافت", "unavailable": "ناموجود", "quantityLeft": "{{count}} عدد باقی مانده", "notEnoughCoins": "سکه کارمای شما برای دریافت این جایزه کافی نیست.", "confirmTitle": "تایید دریافت جایزه", "confirmMessage": "آیا می‌خواهید جایزه", "for": " را به قیمت ", "confirmButton": "بله، دریافت می‌کنم", "redeemSuccess": "جایزه با موفقیت دریافت شد!" },
    "profile": { "verified": "تایید شده", "socialIds": "شناسه‌های اجتماعی", "socialIdsHint": "با ذخیره کردن شناسه‌ها، انجام ماموریت‌های اجتماعی سریع‌تر خواهد بود.", "saveIds": "ذخیره شناسه‌ها", "alert": { "saved": "شناسه‌های اجتماعی شما با موفقیت ذخیره شد." }, "yourCoins": "سکه‌های شما", "randomMission": "ماموریت شانسی", "randomMissionHint": "یک ماموریت فعال به صورت تصادفی", "new": "جدید", "missionReminders": "یادآور ماموریت‌ها", "settings": "تنظیمات", "chatWithAdmin": "چت با پشتیبانی", "aboutUs": "درباره ما", "leaderboard": "تابلوی امتیازات", "partners": "همکاران ما", "logout": "خروج" },
    "dashboard": { "contributionValue": "ارزش ریالی مشارکت شما", "toman": "تومان", "viewTransactions": "مشاهده تراکنش‌ها", "history": "تاریخچه", "searchPlaceholder": "در میان ماموریت‌ها جستجو کنید...", "searchLabel": "جستجو", "weeklyLeague": "لیگ هفتگی", "viewLeagues": "مشاهده لیگ‌ها", "currentLeague": "لیگ فعلی", "weeklyCoins": "{{count}} سکه این هفته", "progressToNext": "پیشرفت تا لیگ بعدی", "featuredMission": "ماموریت ویژه", "categories": "دسته‌بندی‌ها", "suggestedMissions": "ماموریت‌های پیشنهادی", "viewAll": "مشاهده همه" },
    "donationBalance": { "title": "موجودی و تاریخچه", "totalContribution": "ارزش کل مشارکت شما (تومان)", "toman": "تومان", "karmaCoinsBalance": "موجودی سکه کارما:", "withdraw": "برداشت وجه", "topUp": "افزایش موجودی", "transactionHistory": "تاریخچه تراکنش‌ها", "success": "موفق", "noHistory": "هنوز هیچ تراکنشی ثبت نشده است." },
    "createCampaign": { "toast": { "missionTitleFirst": "لطفا ابتدا عنوان ماموریت و نام برند را وارد کنید.", "apiKeyMissing": "کلید API هوش مصنوعی تنظیم نشده است.", "aiError": "خطا در ارتباط با سرویس هوش مصنوعی." }, "payment": { "title": "تایید و پرداخت", "finalCost": "هزینه نهایی برای تضمین کمپین", "toman": "تومان", "guarantee": "این مبلغ تا پایان موفقیت‌آمیز کمپین نزد ما به امانت می‌ماند.", "confirmAndPay": "تایید و پرداخت" }},
    "mission_details": { "food": { "label": "تهیه غذا برای نیازمندان", "quantityLabel": "تعداد وعده غذا" }, "school_supplies": { "label": "تهیه کیف با لوازم تحریر", "quantityLabel": "تعداد کیف" }, "medical": { "label": "هزینه درمان کودکان سرطانی", "quantityLabel": "تعداد کودکان تحت پوشش" }, "production": { "label": "راه اندازی تولیدی", "quantityLabel": "تعداد واحد تولیدی" }},
    "admin": { "notifications": { "enterText": "لطفا متن پیام را وارد کنید.", "bulkSuccessAlert": "پیام انبوه با موفقیت برای تمام کاربران ارسال شد.", "delete": "حذف", "noItems": "هیچ موردی برای نمایش وجود ندارد.", "title": "مدیریت اعلان‌ها", "createTitle": "ایجاد اعلان عمومی", "messageLabel": "متن پیام", "placeholder": "پیام خود را اینجا بنویسید...", "typeLabel": "نوع اعلان", "videoLabel": "پیوست ویدیو (اختیاری)", "sendButton": "ارسال اعلان", "newsListTitle": "لیست اعلان‌های عمومی (اخبار)", "karmaListTitle": "لیست اعلان‌های باشگاه کارما", "bulkTitle": "ارسال پیام شخصی انبوه", "bulkDescription": "این پیام به صورت یک اعلان شخصی برای تمام کاربران ثبت‌شده در سیستم ارسال می‌شود.", "bulkMessageLabel": "متن پیام انبوه", "bulkSendButton": "ارسال برای همه کاربران" }, "deleteRewardConfirmation": "آیا از حذف این جایزه اطمینان دارید؟", "fillRewardFields": "لطفا نام، هزینه و دسته‌بندی جایزه را مشخص کنید.", "predefinedRewardEditHint": "در حال ویرایش یک جایزه پیش‌فرض هستید. نام و توضیحات قابل تغییر نیست." },
    "karma_club_rewards": { "investment": { "title": "سرمایه گذاری", "clothing": "پوشاک", "clothing_desc": "سرمایه گذاری در تولید پوشاک برای نیازمندان.", "shoes": "کفش", "shoes_desc": "حمایت از تولیدی کفش برای مناطق محروم.", "home_goods": "لوازم خانگی", "home_goods_desc": "تامین لوازم اولیه زندگی برای خانواده‌های کم‌برخوردار.", "karma_coin": "سکه کارما", "karma_coin_desc": "خرید بسته سکه کارما برای حمایت بیشتر." }, "discounts": { "title": "کدهای تخفیف", "store": "فروشگاه دیجی‌کالا", "store_desc": "کد تخفیف ۲۰٪ برای خرید از دیجی‌کالا.", "store_verified": "فروشگاه سبز", "store_verified_desc": "تخفیف ویژه محصولات حامی محیط زیست.", "restaurant": "رستوران", "restaurant_desc": "کد تخفیف ۵۰ هزار تومانی اسنپ‌فود.", "appliances": "لوازم خانگی", "appliances_desc": "کد تخفیف ۳۰۰ هزار تومانی خرید لوازم خانگی." }, "courses": { "title": "دوره‌های آموزشی", "photoshop": "دوره فتوشاپ", "photoshop_desc": "دسترسی به دوره مقدماتی فتوشاپ.", "online": "دوره آنلاین", "online_desc": "کد تخفیف برای دوره‌های آموزشی آنلاین فرادرس.", "filimo": "اشتراک فیلیمو", "filimo_desc": "اشتراک یک ماهه فیلیمو.", "photoshop_premium": "دوره پیشرفته فتوشاپ", "photoshop_premium_desc": "دسترسی کامل به دوره جامع و پیشرفته فتوشاپ." }, "vouchers": { "title": "کوپن‌ها", "snapp_voucher": "کوپن سفر اسنپ", "snapp_voucher_desc": "کوپن سفر ۲۰ هزار تومانی اسنپ." }}
};
const translations: Record<string, any> = { fa: faTranslations, en: faTranslations }; // Fallback to fa if en is not complete

type Language = 'fa' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: Record<string, string | number>) => string;
  formatNumber: (num: number) => string;
  formatRelativeTime: (dateString: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const resolve = (path: string, obj: any): string | undefined => {
    return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language] = useState<Language>('fa');

  const setLanguage = (lang: Language) => {
    // In a real app, you might save this to localStorage and update the state
    console.log(`Language change to ${lang} is not fully implemented in this demo.`);
  };

  const t = useCallback((key: string, options?: Record<string, string | number>): string => {
    let translation = resolve(key, translations[language]);
    if (!translation) {
      return key; 
    }

    if (options) {
      Object.keys(options).forEach(optKey => {
        translation = translation!.replace(`{{${optKey}}}`, String(options[optKey]));
      });
    }

    return translation;
  }, [language]);
  
  const formatNumber = useCallback((num: number): string => {
      return new Intl.NumberFormat('fa-IR').format(num);
  }, []);
  
  const formatRelativeTime = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    const rtf = new Intl.RelativeTimeFormat('fa', { numeric: 'auto' });

    if (seconds < 45) return 'چند لحظه پیش';
    if (minutes < 60) return rtf.format(-minutes, 'minute');
    if (hours < 24) return rtf.format(-hours, 'hour');
    return rtf.format(-days, 'day');
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatNumber, formatRelativeTime }}>
      {children}
    </LanguageContext.Provider>
  );
};
