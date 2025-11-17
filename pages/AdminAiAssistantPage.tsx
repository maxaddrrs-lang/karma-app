import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import Button from '../components/Button';
import { useApiConfig } from '../hooks/useApiConfig';

declare global {
    interface Window {
        hljs: any;
    }
}

// --- Icons ---
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const AiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


type ChatMessage = {
  role: 'user' | 'model';
  content: string;
};

// Help Modal Component
const HelpModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative transform transition-all scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">راهنمای استفاده از بخش اصلاح کد</h2>
                <div className="prose prose-sm max-w-none text-gray-700">
                    <p>این ابزار به شما کمک می‌کند تا کدهای خود را به سرعت بهینه و اشکال‌زدایی کنید. برای استفاده، مراحل زیر را دنبال کنید:</p>
                    <ol>
                        <li><strong>جای‌گذاری کد:</strong> کد فعلی خود را که دارای مشکل است یا می‌خواهید بهبود یابد، در کادر سمت راست با عنوان "کد شما" جای‌گذاری (Paste) کنید.</li>
                        <li><strong>نوشتن درخواست:</strong> در کادر "درخواست شما"، به طور واضح توضیح دهید که از هوش مصنوعی چه می‌خواهید. برای مثال: <em>"باگ موجود در این کد را برطرف کن"</em> یا <em>"این کامپوننت را بهینه‌تر کن و از هوک‌ها استفاده کن"</em>.</li>
                        <li><strong>ارسال برای اصلاح:</strong> روی دکمه "اصلاح کد" کلیک کنید و چند لحظه منتظر بمانید.</li>
                        <li><strong>دریافت نتیجه:</strong> هوش مصنوعی نسخه اصلاح شده و بهینه کد شما را در کادر سمت چپ با عنوان "کد اصلاح شده" نمایش می‌دهد.</li>
                        <li><strong>کپی و استفاده:</strong> با استفاده از دکمه "کپی" که در بالای کادر کد اصلاح شده قرار دارد، کد جدید را به راحتی کپی کرده و در فایل پروژه خود جایگزین کد قبلی کنید.</li>
                    </ol>
                </div>
                 <div className="mt-8 text-left">
                    <Button variant="secondary" onClick={onClose}>متوجه شدم</Button>
                </div>
            </div>
        </div>
    );
};


const SYSTEM_INSTRUCTION = `You are a world-class senior frontend developer assigned to assist the admin of the 'Karma' application. Your expertise is in React, TypeScript, and Tailwind CSS.

The 'Karma' application has the following architecture:
- **Framework:** React with TypeScript.
- **Styling:** Tailwind CSS, including the '@tailwindcss/typography' plugin.
- **Routing:** \`react-router-dom\` (using HashRouter).
- **State Management:** React Context API. Key contexts are \`AuthContext\` for user data and \`CampaignContext\` for campaign data.
- **Data Persistence:** All data is stored in the browser's \`localStorage\`. There is no backend database.
- **Structure:** Code is organized into \`pages/\`, \`components/\`, \`context/\`, and \`hooks/\`. Main type definitions are in \`types.ts\`.
- **UI Components:** There are reusable components like \`Button.tsx\`, \`Input.tsx\`, \`Select.tsx\` in the \`components/\` directory.
- **Language:** The user interface is primarily in Persian (Farsi), so code examples involving UI text should use Persian.

Your primary role is to help the admin solve programming issues, suggest new features, and provide clean, efficient, and correct code snippets. When providing code, ALWAYS wrap it in Markdown code blocks with the language specified (e.g., \`\`\`tsx). Be concise, helpful, and respond in Persian.`;

const renderMessageContent = (content: string) => {
    const parts = [];
    let lastIndex = 0;
    const codeBlockRegex = /```(\w*)\n([\s\S]+?)```/g;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            parts.push(<div key={`text-${lastIndex}`} className="prose prose-sm max-w-none">{content.substring(lastIndex, match.index)}</div>);
        }
        
        const language = match[1] || 'plaintext';
        const code = match[2];
        
        parts.push(
            <div key={`code-${match.index}`} className="my-2 bg-gray-800 rounded-lg overflow-hidden relative text-sm">
                <div className="flex justify-between items-center px-4 py-1 bg-gray-900 text-xs text-gray-400">
                    <span>{language}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(code)} 
                      className="hover:text-white p-1 -m-1"
                      aria-label="Copy code"
                    >
                      کپی
                    </button>
                </div>
                <pre><code className={`language-${language}`}>{code.trim()}</code></pre>
            </div>
        );
        
        lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < content.length) {
        parts.push(<div key={`text-${lastIndex}`} className="prose prose-sm max-w-none">{content.substring(lastIndex)}</div>);
    }

    return parts;
};

const AdminAiAssistantPage: React.FC = () => {
    // Shared state
    const [activeTab, setActiveTab] = useState<'chat' | 'corrector'>('chat');
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const { apiKey } = useApiConfig();
    
    // Chat state
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Corrector state
    const [codeToCorrect, setCodeToCorrect] = useState('');
    const [correctionRequest, setCorrectionRequest] = useState('');
    const [correctedCode, setCorrectedCode] = useState('');
    const [isCorrecting, setIsCorrecting] = useState(false);
    const [correctionError, setCorrectionError] = useState('');


    useEffect(() => {
        if (window.hljs) {
            window.hljs.highlightAll();
        }
    }, [messages, correctedCode]);
    
    useEffect(() => {
        if (activeTab === 'chat' && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, activeTab]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        
        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError('');

        if (!apiKey) {
            setError('کلید API هوش مصنوعی تنظیم نشده است.');
            setIsLoading(false);
            return;
        }

        try {
            const historyForAPI = messages.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.content }],
            }));
            const newContent = [...historyForAPI, { role: 'user', parts: [{ text: input }] }];

            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: newContent,
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION
                }
            });

            const modelMessage: ChatMessage = { role: 'model', content: response.text };
            setMessages(prev => [...prev, modelMessage]);

        } catch (err) {
            console.error(err);
            setError('خطا در ارتباط با سرویس هوش مصنوعی. لطفا دوباره تلاش کنید.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCorrectCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!codeToCorrect.trim() || !correctionRequest.trim() || isCorrecting) return;

        setIsCorrecting(true);
        setCorrectionError('');
        setCorrectedCode('');

        if (!apiKey) {
            setCorrectionError('کلید API هوش مصنوعی تنظیم نشده است.');
            setIsCorrecting(false);
            return;
        }

        const prompt = `You are a senior frontend developer specializing in React and TypeScript. Your task is to correct or improve the following code based on the user's request. Provide ONLY the final, corrected code block in a single Markdown snippet. Do not add any explanations, greetings, or other text outside of the code block.

User's Request:
${correctionRequest}

Original Code:
\`\`\`tsx
${codeToCorrect}
\`\`\``;
        
        try {
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });

            // Extract code from markdown block
            const match = response.text.match(/```(?:\w*\n)?([\s\S]+?)```/);
            const extractedCode = match ? match[1].trim() : "متاسفانه پاسخی در فرمت کد دریافت نشد.";
            setCorrectedCode(extractedCode);
        } catch (err) {
            console.error(err);
            setCorrectionError('خطا در ارتباط با سرویس هوش مصنوعی. لطفا دوباره تلاش کنید.');
        } finally {
            setIsCorrecting(false);
        }
    };


    const renderChatAssistant = () => (
        <div className="bg-white p-4 rounded-lg shadow flex flex-col flex-grow overflow-hidden h-full">
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto space-y-6 p-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && (
                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                <AiIcon />
                            </div>
                        )}
                        <div className={`max-w-2xl rounded-xl px-4 py-3 ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                            {msg.role === 'user' ? msg.content : renderMessageContent(msg.content)}
                        </div>
                        {msg.role === 'user' && (
                            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                                <UserIcon />
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                            <AiIcon />
                        </div>
                        <div className="max-w-2xl rounded-xl px-4 py-3 bg-gray-100 text-gray-800">
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                            </div>
                        </div>
                    </div>
                )}
                {error && <p className="text-red-500 text-center">{error}</p>}
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 flex-shrink-0 border-t pt-4">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        placeholder="سوال خود را درباره کدنویسی این برنامه بپرسید..."
                        className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                        rows={2}
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-gray-300">
                        <SendIcon />
                    </button>
                </div>
            </form>
        </div>
    );
    
    const renderCodeCorrector = () => (
        <div className="bg-white p-6 rounded-lg shadow flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden h-full">
            {/* Right side: Input */}
            <form onSubmit={handleCorrectCode} className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-gray-800">اصلاح کد</h3>
                <div>
                    <label htmlFor="correctionRequest" className="block text-sm font-medium text-gray-700 mb-2">درخواست شما</label>
                    <textarea
                        id="correctionRequest"
                        value={correctionRequest}
                        onChange={e => setCorrectionRequest(e.target.value)}
                        placeholder="مثلا: این کامپوننت را بهینه کن یا باگ موجود در این کد را برطرف کن"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        rows={3}
                        required
                    />
                </div>
                <div className="flex-grow flex flex-col">
                    <label htmlFor="codeToCorrect" className="block text-sm font-medium text-gray-700 mb-2">کد شما</label>
                    <textarea
                        id="codeToCorrect"
                        value={codeToCorrect}
                        onChange={e => setCodeToCorrect(e.target.value)}
                        placeholder="کد خود را اینجا جای‌گذاری کنید..."
                        className="w-full h-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm flex-grow"
                        required
                    />
                </div>
                <Button type="submit" disabled={isCorrecting}>
                    {isCorrecting ? 'در حال بررسی...' : 'اصلاح کد'}
                </Button>
            </form>

            {/* Left side: Output */}
            <div className="bg-gray-50 rounded-lg p-4 flex flex-col overflow-hidden border">
                <h3 className="text-xl font-bold text-gray-800 mb-2 flex-shrink-0">کد اصلاح شده</h3>
                <div className="flex-grow overflow-y-auto bg-gray-800 rounded-lg relative">
                    {isCorrecting && (
                         <div className="flex items-center justify-center h-full">
                           <div className="text-center">
                                <svg className="animate-spin h-10 w-10 text-emerald-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-2 text-sm font-semibold text-gray-400">هوش مصنوعی در حال کار است...</p>
                           </div>
                        </div>
                    )}
                    {correctionError && <p className="text-red-400 text-center p-4">{correctionError}</p>}
                    {correctedCode && (
                         <>
                            <button 
                              onClick={() => navigator.clipboard.writeText(correctedCode)} 
                              className="absolute top-2 left-2 bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 px-3 rounded z-10"
                              aria-label="Copy corrected code"
                            >
                              کپی
                            </button>
                            <pre className="h-full"><code className="language-tsx h-full">{correctedCode}</code></pre>
                         </>
                    )}
                     {!isCorrecting && !correctionError && !correctedCode && (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <p>نتیجه در اینجا نمایش داده می‌شود.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );


    return (
        <div className="flex flex-col h-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 flex-shrink-0">دستیار هوش مصنوعی</h1>

             <div className="flex-shrink-0 border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-6 space-x-reverse" aria-label="Tabs">
                     <button
                        onClick={() => setActiveTab('chat')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'chat'
                                ? 'border-emerald-500 text-emerald-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        دستیار گفتگو
                    </button>
                     <button
                        onClick={() => setActiveTab('corrector')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'corrector'
                                ? 'border-emerald-500 text-emerald-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                         <span className="flex items-center gap-2">
                            اصلاح کد
                            <span
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent tab switching when clicking icon
                                setIsHelpModalOpen(true);
                              }}
                              className="p-1 -m-1 rounded-full hover:bg-gray-200 cursor-pointer"
                              aria-label="راهنمای اصلاح کد"
                            >
                              <InfoIcon />
                            </span>
                        </span>
                    </button>
                </nav>
            </div>
            
            <div className="flex-grow overflow-hidden">
                {activeTab === 'chat' ? renderChatAssistant() : renderCodeCorrector()}
            </div>
            
            <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
        </div>
    );
};

export default AdminAiAssistantPage;