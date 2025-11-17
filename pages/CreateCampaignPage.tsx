import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useCampaigns } from '../hooks/useCampaigns';
import { useSettings } from '../context/SettingsContext';
import { useApiConfig } from '../hooks/useApiConfig';
import type { Campaign, Task, SocialPlatform } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

import StepIndicator from '../components/StepIndicator';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import ConfirmationModal from '../components/ConfirmationModal';
import TaskEditModal from '../components/TaskEditModal';
import Toast from '../components/Toast';
import FileInput from '../components/FileInput';
import { PREDEFINED_TASK_CATEGORIES, taskTranslations } from '../constants';
import { getCategoryIcon } from '../components/CategoryIcons';
import CampaignCard from '../components/CampaignCard';
import { useLanguage } from '../hooks/useLanguage';


type CampaignData = {
  mission: string;
  brandName: string;
  brandLogoUrl: string | null;
  location: string;
  category: string;
  tasks: Task[];
  daysLeft: number;
  targetAmount: number;
  sponsorMessage: string;
  customImageUrl: string | null;
};

const STEPS = ["اطلاعات پایه", "تعریف ماموریت‌ها", "پرداخت", "پایان"];

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('fa-IR').format(num);
};

// --- Icons for Step 2 and Preview ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = '' }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;
const VerifiedIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={`w-5 h-5 text-blue-500 mr-2 ${className || ''}`} viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm-1.4,13.7L6.45,11.55l1.41-1.41L10.6,13.47l5.25-5.25,1.41,1.41Z" /></svg>
const platformIcons: Record<SocialPlatform | 'shop' | 'generic' | 'code', React.ReactNode> = {
    instagram: (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
        </div>
    ),
    x: (
        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        </div>
    ),
    youtube: (
        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.25,4,12,4,12,4S5.75,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.75,2,12,2,12s0,4.25,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.75,20,12,20,12,20s6.25,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.25,22,12,22,12S22,7.75,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" />
            </svg>
        </div>
    ),
    telegram: (
         <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15.91L18.23 16.2c-.24.62-.67.78-1.21.49l-4.46-3.3-4.52 4.13c-.39.37-.87.57-1.4.57-.78 0-1.02-.37-1.12-.75L9.78 18.65z" />
            </svg>
        </div>
    ),
    linkedin: (
        <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
        </div>
    ),
    facebook: (
        <div className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
        </div>
    ),
    shop: (
        <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        </div>
    ),
    code: (
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        </div>
    ),
    generic: <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center"><svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>,
};
const getTaskIcon = (task: Task) => {
    if (task.type === 'code_redemption') {
        return platformIcons['code'];
    }
    const translatedDesc = taskTranslations[task.description] || task.description;
    if (task.type === 'social_media' && task.platform) {
        return platformIcons[task.platform];
    }
    if (translatedDesc.includes('فروشگاه')) {
        return platformIcons['shop'];
    }
    return platformIcons.generic;
};

const emptyCampaignData: CampaignData = {
    mission: '',
    brandName: '',
    brandLogoUrl: null,
    location: '',
    category: '',
    tasks: [],
    daysLeft: 30,
    targetAmount: 0,
    sponsorMessage: `به نام خدا
اول از مجموعه کارما کمال تشکر رو دارم که یک بستری فراهم اوردن تا ما و مجموعه بتوانیم یک قدم با ثبات تری در عرصه کمک رسانی به مردم نیازمند بر داریم
و تشکر می کنم از شما که در این مسیر خیرخواهانه ماموریت ما رو انتخاب کردید و سپاس گذاری میکنم با تکمیل چرخه های پایین به ما کمک کنید تا بتوانیم وظیفه خودمون انجام بدهیم`,
    customImageUrl: null,
};


const CreateCampaignPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateKey = searchParams.get('template');
  const isEditMode = !!id;
  const isTemplateMode = !!templateKey && !isEditMode;
  const { t } = useLanguage();

  const [currentStep, setCurrentStep] = useState(1);
  const { 
      categories, 
      predefinedTasks: PREDEFINED_TASKS, 
      missionDetails: MISSION_DETAILS,
      isCampaignBuilderEnabled
  } = useSettings();
  const { apiKey } = useApiConfig();
  
  const categoryNames = categories.map(c => t(`categories_list.${c.name}`));

  const [campaignData, setCampaignData] = useState<CampaignData>(emptyCampaignData);
  // State for template mode
  const [quantity, setQuantity] = useState(0);
  const [templateQuantityLabel, setTemplateQuantityLabel] = useState('تعداد');
  // State for builder mode
  const [builderData, setBuilderData] = useState({ quantityLabel: '', quantity: 0, costPerUnit: 0 });

  const [customTaskData, setCustomTaskData] = useState({ description: '', impactPoints: 5, platform: '' as SocialPlatform | '', targetUrl: '' });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isConfirmingSubmit, setIsConfirmingSubmit] = useState(false);
  const { addCampaign, campaigns, updateCampaign } = useCampaigns();
  const nextTaskId = useRef(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingMessage, setSubmittingMessage] = useState('در حال ثبت کمپین شما...');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CampaignData | 'quantity' | 'quantityLabel' | 'costPerUnit', boolean>>>({});
  // State for step 2 UX
  const [openAccordion, setOpenAccordion] = useState<string | null>(Object.keys(PREDEFINED_TASKS)[0]);
  const [isAddingCustomTask, setIsAddingCustomTask] = useState(false);
  const [submittedCampaign, setSubmittedCampaign] = useState<Campaign | null>(null);


  // Effect for initialization based on mode (Edit, Template, Builder).
  // This runs only when the mode changes, not on every language change.
  useEffect(() => {
    // Security Guard: Redirect if builder is disabled
    if (!isEditMode && !isTemplateMode && !isCampaignBuilderEnabled) {
      navigate('/create-options', { replace: true });
      return;
    }

    // Edit Mode takes precedence
    if (isEditMode) {
      const campaignToEdit = campaigns.find(c => c.id === Number(id));
      if (campaignToEdit) {
        setCampaignData({
          mission: campaignToEdit.mission,
          brandName: campaignToEdit.brandName,
          brandLogoUrl: campaignToEdit.brandLogoUrl || null,
          location: campaignToEdit.location,
          category: campaignToEdit.category,
          tasks: campaignToEdit.tasks,
          daysLeft: campaignToEdit.daysLeft,
          targetAmount: campaignToEdit.targetAmount,
          sponsorMessage: campaignToEdit.sponsorMessage,
          customImageUrl: campaignToEdit.imageUrl,
        });
        if (campaignToEdit.tasks.length > 0) {
            nextTaskId.current = Math.max(...campaignToEdit.tasks.map(t => t.id)) + 1;
        }
      }
      return;
    }

    // Template Mode
    if (isTemplateMode && templateKey && MISSION_DETAILS[templateKey]) {
        const details = MISSION_DETAILS[templateKey as keyof typeof MISSION_DETAILS];
        const initialQuantity = details.minQuantity;
        setQuantity(initialQuantity);
        
        setCampaignData({
            ...emptyCampaignData,
            category: details.defaultCategory,
            location: 'سراسر ایران',
            daysLeft: 30,
            targetAmount: details.costPerUnit * initialQuantity,
            customImageUrl: details.imageUrl || null,
        });
    } else {
        // Default mode (Campaign Builder)
        setCampaignData(emptyCampaignData);
        setBuilderData({ quantityLabel: '', quantity: 0, costPerUnit: 0 });
    }
  }, [id, isEditMode, isTemplateMode, templateKey, campaigns, isCampaignBuilderEnabled, navigate, MISSION_DETAILS]);

  // This separate effect handles language-dependent text updates ONLY for template mode,
  // preventing user input from being wiped on language change.
  useEffect(() => {
      if (isTemplateMode && templateKey && MISSION_DETAILS[templateKey]) {
          const details = MISSION_DETAILS[templateKey as keyof typeof MISSION_DETAILS];
          setCampaignData(prev => ({ ...prev, mission: t(details.labelKey) }));
          setTemplateQuantityLabel(t(details.quantityLabelKey));
      }
  }, [isTemplateMode, templateKey, MISSION_DETAILS, t]);


    // Auto-calculate target amount for TEMPLATE mode
    useEffect(() => {
        if (isTemplateMode && templateKey && MISSION_DETAILS[templateKey] && quantity > 0) {
            const details = MISSION_DETAILS[templateKey as keyof typeof MISSION_DETAILS];
            const newTargetAmount = details.costPerUnit * Math.max(quantity, details.minQuantity);
            setCampaignData(prev => ({ ...prev, targetAmount: newTargetAmount }));
        }
    }, [quantity, isTemplateMode, templateKey, MISSION_DETAILS]);

    // Auto-calculate target amount for BUILDER mode
    useEffect(() => {
        if (!isTemplateMode) {
            const newTargetAmount = builderData.quantity * builderData.costPerUnit;
            setCampaignData(prev => ({ ...prev, targetAmount: newTargetAmount }));
        }
    }, [builderData.quantity, builderData.costPerUnit, isTemplateMode]);


  const previewCampaignData = useMemo<Campaign>(() => {
    const progress = isEditMode ? campaigns.find(c => c.id === Number(id))?.progress || 0 : 0;
    return {
        id: isEditMode ? Number(id) : -1,
        mission: campaignData.mission || 'عنوان ماموریت شما...',
        brandName: campaignData.brandName || 'نام برند شما...',
        brandLogoUrl: campaignData.brandLogoUrl || undefined,
        location: campaignData.location || 'مکان',
        category: campaignData.category || 'other', // Pass key for translation in CampaignCard
        tasks: campaignData.tasks,
        imageUrl: campaignData.customImageUrl || `https://source.unsplash.com/800x600/?charity,${campaignData.category || 'hope'}`,
        progress,
        targetAmount: campaignData.targetAmount,
        daysLeft: campaignData.daysLeft,
        sponsorMessage: campaignData.sponsorMessage,
        status: isEditMode ? campaigns.find(c => c.id === Number(id))?.status || 'pending' : 'pending',
    };
}, [campaignData, isEditMode, id, campaigns]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumericField = name === 'targetAmount' || name === 'daysLeft';
    setCampaignData(prev => ({ ...prev, [name]: isNumericField ? Number(value) : value }));
     if (errors[name as keyof typeof errors]) {
        setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

    const handleBuilderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBuilderData(prev => ({ ...prev, [name]: name === 'quantityLabel' ? value : Number(value) }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    };

  const isTaskSelected = (taskDescription: string) => {
    return campaignData.tasks.some(t => t.description === taskDescription);
  };

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: nextTaskId.current++,
    };
    setCampaignData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };
  
  const handleToggleTask = (task: Omit<Task, 'id'>) => {
    if (isTaskSelected(task.description)) {
      handleRemoveTask(task.description);
    } else {
      handleAddTask(task);
    }
  };

  const handleRemoveTask = (taskDescription: string) => {
    setCampaignData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.description !== taskDescription),
    }));
  };
  
  const handleRemoveTaskById = (taskId: number) => {
    setCampaignData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId),
    }));
  }

  const handleCustomTaskAdd = () => {
    if (customTaskData.description.trim()) {
      const isSocial = customTaskData.platform !== '';
      const newTask: Task = {
        id: nextTaskId.current++,
        description: customTaskData.description,
        type: isSocial ? 'social_media' : 'generic',
        platform: isSocial ? (customTaskData.platform as SocialPlatform) : undefined,
        impactPoints: customTaskData.impactPoints,
        karmaCoins: Math.max(1, Math.round(customTaskData.impactPoints * 0.8)),
        targetUrl: customTaskData.targetUrl || undefined,
      };
      setCampaignData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
      setCustomTaskData({ description: '', impactPoints: 5, platform: '', targetUrl: '' });
      setIsAddingCustomTask(false);
    }
  };
  
  const handleUpdateTask = (updatedTask: Task) => {
    setCampaignData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)),
    }));
    setEditingTask(null);
  };

  const handleGenerateContent = async () => {
    if (!campaignData.mission || !campaignData.brandName) {
        setToast({ message: t('createCampaign.toast.missionTitleFirst'), type: 'error' });
        return;
    }
    if (!apiKey) {
        setToast({ message: t('createCampaign.toast.apiKeyMissing'), type: 'error' });
        return;
    }
    setIsGenerating(true);
    try {
        const ai = new GoogleGenAI({ apiKey });
        
        const textPrompt = `For a charity campaign in Iran titled "${campaignData.mission}" by the brand "${campaignData.brandName}", generate a short, heartfelt, and inspiring sponsor message in Persian. The message must include the brand name, "${campaignData.brandName}". Format the output as a JSON object with a single key: "sponsorMessage".`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: textPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        sponsorMessage: { type: Type.STRING }
                    },
                    required: ["sponsorMessage"]
                }
            }
        });
        
        
        const jsonResponse = JSON.parse(response.text.trim()) as { sponsorMessage?: string };
        const { sponsorMessage } = jsonResponse;
        
        if (sponsorMessage) {
            setCampaignData(prev => ({ ...prev, sponsorMessage }));
        }

    } catch (error) {
        console.error("Error generating content:", error);
        setToast({ message: t('createCampaign.toast.aiError'), type: 'error' });
    } finally {
        setIsGenerating(false);
    }
  };

  const validateStep1 = () => {
    const newErrors: Partial<Record<keyof CampaignData | 'quantity' | 'quantityLabel' | 'costPerUnit', boolean>> = {};
    if (!campaignData.mission.trim()) newErrors.mission = true;
    if (!campaignData.brandName.trim()) newErrors.brandName = true;
    if (!campaignData.location.trim()) newErrors.location = true;
    if (!campaignData.category) newErrors.category = true;
    if (!campaignData.sponsorMessage.trim()) newErrors.sponsorMessage = true;
    
    if (isTemplateMode) {
      if (quantity <= 0) newErrors.quantity = true;
    } else {
      if (!builderData.quantityLabel.trim()) newErrors.quantityLabel = true;
      if (builderData.quantity <= 0) newErrors.quantity = true;
      if (builderData.costPerUnit <= 0) newErrors.costPerUnit = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    const taskCount = campaignData.tasks.length;
    if (taskCount < 3 || taskCount > 7) {
        setErrors({ tasks: true });
        return false;
    }
    setErrors({});
    return true;
  };


  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
        setToast({ message: 'لطفا تمام اطلاعات پایه را به درستی تکمیل کنید.', type: 'error' });
        return;
    }
     if (currentStep === 2 && !validateStep2()) {
        setToast({ message: 'شما باید بین ۳ تا ۷ ماموریت انتخاب کنید.', type: 'error' });
        return;
    }
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (currentStep === 1) {
        navigate('/create-options');
    }
  };
  
  const handleSubmitCampaign = async () => {
    setIsConfirmingSubmit(false);
    setIsSubmitting(true);
    setSubmittingMessage('در حال ثبت کمپین شما...');

    try {
        let finalImageUrl = campaignData.customImageUrl;

        // Generate image if none was provided or generated before
        if (!finalImageUrl) {
            setSubmittingMessage('در حال ساخت یک تصویر خلاقانه برای ماموریت شما...');
            if (!apiKey) {
                console.warn("API Key not found, using fallback image.");
                finalImageUrl = `https://source.unsplash.com/800x600/?charity,${campaignData.category}`;
            } else {
                const ai = new GoogleGenAI({ apiKey });
                const imagePrompt = `Create a descriptive, artistic, and photorealistic image prompt that visually represents this charity mission: "${campaignData.mission}". The image should be positive, hopeful, and inspiring, featuring elements of Iranian culture.`;
                
                const imageResponse = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: imagePrompt,
                    config: { numberOfImages: 1 }
                });

                if (imageResponse.generatedImages.length > 0) {
                    finalImageUrl = `data:image/png;base64,${imageResponse.generatedImages[0].image.imageBytes}`;
                } else {
                     finalImageUrl = `https://source.unsplash.com/800x600/?charity,${campaignData.category}`;
                }
            }
        }
        
        setSubmittingMessage('درحال ذخیره سازی نهایی...');

        const finalCampaignDataSubmit: Omit<Campaign, 'id' | 'progress' | 'status'> = {
            ...campaignData,
            category: campaignData.category, // Save the key, not the translated value
            imageUrl: finalImageUrl!,
            brandLogoUrl: campaignData.brandLogoUrl || undefined,
        };
        
        if (isEditMode && id) {
            const campaignToUpdate = campaigns.find(c => c.id === Number(id));
            if (campaignToUpdate) {
                const updatedData = { ...campaignToUpdate, ...finalCampaignDataSubmit };
                updateCampaign(updatedData);
                setSubmittedCampaign(updatedData);
            }
        } else {
            const newId = campaigns.length > 0 ? Math.max(...campaigns.map(c => c.id)) + 1 : 1;
            const newCampaign = {
                ...finalCampaignDataSubmit,
                id: newId,
                progress: 0,
                status: 'pending' as const
            };
            addCampaign(finalCampaignDataSubmit);
            setSubmittedCampaign(newCampaign);
        }

        localStorage.removeItem(isEditMode ? `autosave_campaign_edit_${id}` : 'autosave_campaign_create');

        setTimeout(() => {
            setIsSubmitting(false);
            setCurrentStep(4);
        }, 1000);

    } catch (error) {
        console.error("Error submitting campaign:", error);
        setToast({ message: 'خطا در ثبت کمپین. لطفا دوباره تلاش کنید.', type: 'error' });
        setIsSubmitting(false);
    }
  };
  
  const CampaignPreview: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
    return (
        <div className="bg-gray-100 rounded-lg p-4 border max-w-2xl mx-auto my-8">
             <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">پیش نمایش کمپین</h3>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200/80">
                <img src={campaign.imageUrl} alt={campaign.mission} className="w-full h-48 object-cover rounded-xl shadow-lg mb-4" />
                <h2 className="font-bold text-2xl text-gray-800 mb-2">{campaign.mission}</h2>
                <div className="flex justify-between text-base text-gray-700 font-semibold mt-3 mb-4">
                    <span className="font-bold">{formatNumber(campaign.targetAmount)} <span className="text-sm font-normal">تومان</span></span>
                    <span className="font-bold">{campaign.daysLeft} <span className="text-sm font-normal">روز مانده</span></span>
                </div>
                <div className="flex items-center space-x-4 space-x-reverse mb-4">
                    <img src={campaign.brandLogoUrl || `https://ui-avatars.com/api/?name=${campaign.brandName.charAt(0)}&background=a7f3d0&color=047857&size=48`} alt={`${campaign.brandName} logo`} className="w-12 h-12 rounded-full bg-emerald-100 p-1 object-contain" />
                    <div>
                        <div className="flex items-center">
                            <span className="font-bold text-lg text-gray-800">{campaign.brandName}</span>
                            <VerifiedIcon />
                        </div>
                    </div>
                </div>
                 <section className="bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200/80">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">ماموریت ها</h3>
                    <div className="space-y-3">
                        {campaign.tasks.map(task => (
                            <div key={task.id} className="flex items-center p-3 rounded-xl bg-white border border-gray-200">
                                <div className="flex-shrink-0 w-8 h-8 mr-4">{getTaskIcon(task)}</div>
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800 text-sm">{task.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">{task.impactPoints}% تکمیل چرخه • <span className="text-yellow-600">{task.karmaCoins} سکه</span></p>
                                </div>
                            </div>
                         ))}
                    </div>
                </section>
            </div>
        </div>
    );
  };

  const renderStepContent = () => {
    const inputStyles = "bg-gray-700 text-white placeholder-gray-400 focus:bg-gray-800 border-gray-600 focus:border-emerald-500 focus:ring-emerald-500";
    const readOnlyInputStyles = "bg-gray-600 text-white cursor-not-allowed border-gray-500";

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">اطلاعات پایه کمپین</h2>
            <p className="text-sm text-gray-500">
                {isTemplateMode 
                    ? 'شما در حال استفاده از یک الگوی آماده هستید. فقط موارد ضروری را تکمیل کنید.' 
                    : 'برای شروع، اطلاعات کمپین سفارشی خود را وارد کنید. تمام موارد اجباری است.'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="md:col-span-2">
                    <Input
                        label="عنوان ماموریت"
                        id="mission"
                        name="mission"
                        value={campaignData.mission}
                        onChange={handleChange}
                        placeholder="مثلا: تهیه ۱۰۰ پرس غذای گرم برای کودکان کار"
                        hasError={errors.mission}
                        readOnly={isTemplateMode}
                        className={isTemplateMode ? readOnlyInputStyles : inputStyles}
                    />
                 </div>

                <Input label="نام برند یا مجموعه شما" id="brandName" name="brandName" value={campaignData.brandName} onChange={handleChange} placeholder="رستوران برادران" hasError={errors.brandName} className={inputStyles}/>
                
                {isTemplateMode && templateKey && MISSION_DETAILS[templateKey as keyof typeof MISSION_DETAILS] ? (
                    <>
                        <Input 
                            label={templateQuantityLabel}
                            id="quantity"
                            name="quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            min={MISSION_DETAILS[templateKey as keyof typeof MISSION_DETAILS].minQuantity}
                            hasError={errors.quantity}
                            className={inputStyles}
                        />
                        <div className="bg-gray-100 p-3 rounded-lg text-center">
                            <label className="block text-sm font-medium text-gray-700 mb-1">مبلغ هدف</label>
                            <p className="text-2xl font-bold text-emerald-600">{formatNumber(campaignData.targetAmount)} <span className="text-lg font-normal">تومان</span></p>
                        </div>
                    </>
                ) : (
                    <>
                        <Input 
                            label="واحد شمارش ماموریت"
                            id="quantityLabel"
                            name="quantityLabel"
                            value={builderData.quantityLabel}
                            onChange={handleBuilderChange}
                            placeholder="مثلا: وعده غذا، نهال"
                            hasError={errors.quantityLabel}
                            className={inputStyles}
                        />
                        <Input 
                            label="تعداد"
                            id="quantity"
                            name="quantity"
                            type="number"
                            value={builderData.quantity || ''}
                            onChange={handleBuilderChange}
                            min="1"
                            hasError={errors.quantity}
                            className={inputStyles}
                        />
                        <Input 
                            label="هزینه هر واحد (تومان)"
                            id="costPerUnit"
                            name="costPerUnit"
                            type="number"
                            value={builderData.costPerUnit || ''}
                            onChange={handleBuilderChange}
                            min="1"
                            hasError={errors.costPerUnit}
                            className={inputStyles}
                        />
                         <div className="md:col-span-2 bg-gray-100 p-3 rounded-lg text-center">
                            <p className="text-sm text-gray-600">مبلغ کل محاسبه شده:</p>
                            <p className="text-2xl font-bold text-emerald-600">{formatNumber(campaignData.targetAmount)} <span className="text-lg font-normal">تومان</span></p>
                        </div>
                    </>
                )}


                <Input label="مکان" id="location" name="location" value={campaignData.location} onChange={handleChange} placeholder="تهران" hasError={errors.location} readOnly={isTemplateMode} className={isTemplateMode ? readOnlyInputStyles : inputStyles}/>
                <Select label="دسته بندی" id="category" name="category" value={campaignData.category} onChange={handleChange} options={categoryNames} optionValues={categories.map(c => c.name)} hasError={errors.category} disabled={isTemplateMode} className={isTemplateMode ? readOnlyInputStyles : inputStyles} />
                <Input label="مدت زمان کمپین (روز)" id="daysLeft" name="daysLeft" type="number" value={campaignData.daysLeft} onChange={handleChange} min="1" hasError={errors.daysLeft} readOnly={isTemplateMode} className={isTemplateMode ? readOnlyInputStyles : inputStyles}/>
                
                 <div className="md:col-span-2">
                    <label htmlFor="sponsorMessage" className="block text-sm font-medium text-gray-700 mb-2">پیام حامی</label>
                    <textarea id="sponsorMessage" name="sponsorMessage" value={campaignData.sponsorMessage} onChange={handleChange} rows={5} className={`w-full px-4 py-2 border rounded-lg shadow-sm transition-colors ${inputStyles} ${errors.sponsorMessage ? 'border-red-500' : 'border-gray-600'}`} />
                </div>
                 <div className="md:col-span-2">
                    <FileInput label="لوگوی برند (اختیاری)" value={campaignData.brandLogoUrl} onFileSelect={(dataUrl) => setCampaignData(prev => ({...prev, brandLogoUrl: dataUrl}))} />
                </div>
                 <div className="md:col-span-2">
                    <Button type="button" onClick={handleGenerateContent} disabled={isGenerating || !apiKey} className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white w-full md:w-auto disabled:opacity-50">
                        {isGenerating ? 'در حال ساخت...' : 'ساخت پیام با هوش مصنوعی'}
                    </Button>
                </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">تعریف ماموریت‌ها</h2>
            <p className="text-sm text-gray-500 mb-6">ماموریت‌هایی را که کاربران برای حمایت از کمپین شما باید انجام دهند، مشخص کنید.</p>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-4">ماموریت‌های پیشنهادی</h3>
                <div className="space-y-3">
                  {Object.entries(PREDEFINED_TASKS).map(([category, tasks]) => {
                    const isOpen = openAccordion === category;
                    return (
                      <div key={category} className="border rounded-xl bg-white shadow-sm overflow-hidden">
                        <button
                          onClick={() => setOpenAccordion(isOpen ? null : category)}
                          className="w-full flex justify-between items-center p-4 text-right font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          <span>{PREDEFINED_TASK_CATEGORIES[category as keyof typeof PREDEFINED_TASK_CATEGORIES] || category}</span>
                          <ChevronDownIcon className={isOpen ? 'rotate-180' : ''} />
                        </button>
                        {isOpen && (
                          <div className="animate-slideDown p-4 border-t bg-gray-50/50">
                            <div className="space-y-2">
                              
                              {(tasks as Omit<Task, 'id'>[]).map((task, index) => {
                                const isSelected = isTaskSelected(task.description);
                                return (
                                  <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <p className="text-sm text-gray-800">{task.description}</p>
                                    <button
                                      onClick={() => handleToggleTask(task)}
                                      className={`w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full transition-colors ${isSelected ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                                      aria-label={isSelected ? 'حذف ماموریت' : 'افزودن ماموریت'}
                                    >
                                      {isSelected ? <CheckIcon /> : <PlusIcon />}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                 <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl sticky top-28">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">ماموریت‌های انتخاب شده</h3>
                        <span className="font-bold text-lg text-emerald-600 bg-emerald-200 rounded-full w-8 h-8 flex items-center justify-center">{campaignData.tasks.length}</span>
                    </div>

                    <p className="text-xs text-gray-600 mb-4">
                        حداقل ۳ و حداكثر ۷ ماموریت انتخاب کنید.
                    </p>
                    {errors.tasks && <p className="text-red-500 text-sm font-semibold mb-3">تعداد ماموریت‌های انتخابی باید بین ۳ تا ۷ باشد.</p>}

                    <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-2">
                        {campaignData.tasks.map(task => (
                            <div key={task.id} className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center animate-fadeInUp">
                                <p className="text-sm text-gray-800 flex-grow">{task.description}</p>
                                <div className="flex items-center space-x-1 space-x-reverse flex-shrink-0">
                                    <button onClick={() => setEditingTask(task)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors" aria-label="ویرایش"><EditIcon /></button>
                                    <button onClick={() => handleRemoveTaskById(task.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors" aria-label="حذف"><DeleteIcon /></button>
                                </div>
                            </div>
                        ))}
                         {campaignData.tasks.length === 0 && (
                            <p className="text-center text-gray-500 py-4">هنوز ماموریتی انتخاب نشده است.</p>
                        )}
                    </div>
                 </div>

                 <div>
                    <Button variant="secondary" onClick={() => setIsAddingCustomTask(!isAddingCustomTask)} className="w-full">
                        {isAddingCustomTask ? 'لغو افزودن' : '+ افزودن ماموریت سفارشی'}
                    </Button>
                    {isAddingCustomTask && (
                        <div className="mt-4 p-4 border rounded-xl bg-white animate-slideDown">
                            <h4 className="font-semibold mb-3">ماموریت سفارشی جدید</h4>
                            <div className="space-y-3">
                                <Input label="شرح ماموریت" id="custom-desc" value={customTaskData.description} onChange={e => setCustomTaskData(prev => ({...prev, description: e.target.value}))} />
                                <Select
                                    label="پلتفرم شبکه اجتماعی (اختیاری)"
                                    id="custom-platform"
                                    value={customTaskData.platform}
                                    onChange={e => setCustomTaskData(prev => ({ ...prev, platform: e.target.value as SocialPlatform | '' }))}
                                    options={['اینستاگرام', 'تلگرام', 'یوتیوب', 'ایکس (توییتر سابق)', 'لینکدین', 'فیسبوک']}
                                    optionValues={['instagram', 'telegram', 'youtube', 'x', 'linkedin', 'facebook']}
                                />
                                <Input label="آدرس صفحه (اختیاری)" id="custom-url" value={customTaskData.targetUrl} onChange={e => setCustomTaskData(prev => ({...prev, targetUrl: e.target.value}))} placeholder="https://..." />
                                <Input label="امتیاز تاثیر (۱ تا ۱۰)" id="custom-impact" type="number" min="1" max="10" value={customTaskData.impactPoints} onChange={e => setCustomTaskData(prev => ({...prev, impactPoints: parseInt(e.target.value, 10)}))} />
                                <Button onClick={handleCustomTaskAdd}>افزودن</Button>
                            </div>
                        </div>
                    )}
                 </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('createCampaign.payment.title')}</h2>
            <div className="bg-white p-8 rounded-lg shadow-lg border inline-block">
                <p className="text-gray-600 mb-2">{t('createCampaign.payment.finalCost')}</p>
                <p className="text-4xl font-extrabold text-emerald-600 mb-6">{formatNumber(campaignData.targetAmount)} <span className="text-lg">{t('createCampaign.payment.toman')}</span></p>
                <p className="text-sm text-gray-500 mb-6">{t('createCampaign.payment.guarantee')}</p>
                <Button onClick={() => setIsConfirmingSubmit(true)} className="w-full">
                    {t('createCampaign.payment.confirmAndPay')}
                </Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="text-center max-w-lg mx-auto py-10">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">کمپین شما با موفقیت ثبت شد!</h2>
            <p className="text-gray-600 mb-8">کمپین شما پس از بررسی توسط کارشناسان ما، فعال خواهد شد. از طریق پنل کاربری خود می‌توانید وضعیت آن را پیگیری کنید.</p>
            {submittedCampaign && <CampaignPreview campaign={submittedCampaign} />}
            <div className="flex justify-center gap-4 mt-8">
                <Button onClick={() => navigate('/campaigns')} variant="secondary">مشاهده کمپین‌ها</Button>
                <Button onClick={() => navigate('/')}>بازگشت به خانه</Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isSubmitting) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-full py-20">
            <svg className="animate-spin h-16 w-16 text-emerald-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="text-2xl font-bold text-gray-800">{submittingMessage}</h2>
            <p className="text-gray-500 mt-2">لطفا چند لحظه صبر کنید...</p>
        </div>
      );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-center text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4">
            {isEditMode ? 'ویرایش کمپین' : (isTemplateMode ? 'ایجاد کمپین از الگو' : 'ایجاد کمپین جدید')}
        </h1>
        <p className="text-center text-lg text-gray-600 mb-12">با کارما، تاثیرگذاری ساده‌تر از همیشه است.</p>
        
        {currentStep < 4 && <StepIndicator steps={STEPS} currentStep={currentStep} />}
        
        {currentStep === 4 ? (
             <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl max-w-4xl mx-auto border border-gray-200/80 mt-12">
                {renderStepContent()}
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mt-12">
                {/* Form Section */}
                <div className="lg:col-span-3 order-2 lg:order-1">
                    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-200/80">
                        {renderStepContent()}
                        <div className="mt-12 pt-6 border-t flex justify-between items-center">
                            <Button onClick={handlePrevStep} variant="secondary">
                                مرحله قبل
                            </Button>
                            <Button onClick={handleNextStep}>
                                {currentStep === 3 ? 'ثبت نهایی' : 'مرحله بعد'}
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Preview Section */}
                <div className="lg:col-span-2 order-1 lg:order-2">
                    <div className="sticky top-28">
                         <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">پیش‌نمایش زنده</h2>
                         <CampaignCard campaign={previewCampaignData} />
                    </div>
                </div>
            </div>
        )}

      </div>
      
       <ConfirmationModal
        isOpen={isConfirmingSubmit}
        onClose={() => setIsConfirmingSubmit(false)}
        onConfirm={handleSubmitCampaign}
        title="تایید نهایی"
        message="آیا از ثبت نهایی کمپین خود با اطلاعات وارد شده اطمینان دارید؟"
        confirmText="بله، ثبت کن"
      />

       <TaskEditModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleUpdateTask}
        task={editingTask}
      />
    </div>
  );
};

export default CreateCampaignPage;