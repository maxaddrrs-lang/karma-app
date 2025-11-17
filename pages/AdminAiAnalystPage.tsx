import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import Button from '../components/Button';
import { useApiConfig } from '../hooks/useApiConfig';

// --- Components ---

const LoadingSpinner = () => (
    <div className="flex flex-col justify-center items-center text-center p-8 h-full">
        <svg className="animate-spin h-10 w-10 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-gray-600 font-semibold">هوش مصنوعی در حال تحلیل داده‌ها است...</p>
    </div>
);

// Simple Markdown to HTML converter
function renderMarkdown(text: string): string {
    let html = text
        // Headings
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Unordered list items
        .replace(/^\s*[-*] (.*)/gm, '<li>$1</li>');

    // Wrap consecutive list items in <ul>
    html = html.replace(/((<li>.*<\/li>\s*)+)/g, '<ul class="list-disc list-inside space-y-1 my-2">$1</ul>');

    // Newlines
    html = html.replace(/\n/g, '<br />');
    
    // Clean up extra breaks around lists and headings
    html = html.replace(/<br \/>\s*<(h[23]|ul)>/g, '<$1>');
    html = html.replace(/<\/(h[23]|ul)>\s*<br \/>/g, '</$1>');
    
    return html;
}

const AdminAiAnalystPage: React.FC = () => {
    const [customQuery, setCustomQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [analysisResult, setAnalysisResult] = useState('');
    const { apiKey } = useApiConfig();

    const getAppData = () => {
        const users = localStorage.getItem('karma_users') || '[]';
        const campaigns = localStorage.getItem('karma_campaigns') || '[]';
        const completions = localStorage.getItem('karma_task_completions') || '[]';
        return { users, campaigns, completions };
    };

    const handleAnalysis = async (presetPrompt?: string) => {
        const query = presetPrompt || customQuery;
        if (!query.trim()) {
            setError('لطفا یک سوال یا درخواست تحلیل وارد کنید.');
            return;
        }

        setIsLoading(true);
        setError('');
        setAnalysisResult('');
        
        if (!apiKey) {
            setError('کلید API هوش مصنوعی تنظیم نشده است. این قابلیت غیرفعال است.');
            setIsLoading(false);
            return;
        }

        try {
            const appData = getAppData();
            const systemInstruction = `You are a data analyst for a charity engagement platform called "Karma". Your task is to analyze the provided JSON data and answer the user's question in Persian. Be insightful, concise, and provide actionable suggestions where appropriate. Format your response with clear headings (##) and bullet points (*) using Markdown.`;
            
            const prompt = `
Here is the application data in JSON format:
- Users: ${appData.users}
- Campaigns: ${appData.campaigns}
- Task Completions: ${appData.completions}

Based on this data, please answer the following question:
"${query}"
`;
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { systemInstruction }
            });
            
            setAnalysisResult(response.text);

        } catch (err) {
            console.error(err);
            setError('خطا در ارتباط با سرویس هوش مصنوعی. لطفا دوباره تلاش کنید.');
        } finally {
            setIsLoading(false);
        }
    };

    const quickAnalysisOptions = [
        { label: 'خلاصه عملکرد کلی', prompt: 'Provide a high-level summary of the platform\'s performance. Include key metrics like total users, active campaigns, completed tasks, and total impact points generated.' },
        { label: 'تحلیل کمپین‌های موفق', prompt: 'Identify the top 3 most successful campaigns based on participation and completion rate. Analyze potential reasons for their success.' },
        { label: 'شناسایی کاربران برتر', prompt: 'List the top 5 most impactful users based on their total impact points and number of completed tasks. Suggest how to engage them further.' },
        { label: 'پیشنهاد برای کمپین جدید', prompt: 'Based on the most popular campaign categories and tasks, suggest an idea for a new, engaging campaign.' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">تحلیلگر هوش مصنوعی کارما</h1>
            <p className="text-gray-600 mb-8">از هوش مصنوعی برای دریافت گزارش‌های تحلیلی، خلاصه‌ها و پیشنهادات بر اساس داده‌های برنامه خود استفاده کنید.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="space-y-6">
                    {/* Quick Analysis */}
                    <section className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">تحلیل‌های سریع</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {quickAnalysisOptions.map(opt => (
                                <button
                                    key={opt.label}
                                    onClick={() => handleAnalysis(opt.prompt)}
                                    disabled={isLoading}
                                    className="text-right p-4 bg-gray-100 hover:bg-emerald-50 rounded-lg border hover:border-emerald-300 transition-colors disabled:opacity-50 disabled:cursor-wait"
                                >
                                    <span className="font-semibold text-emerald-700">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Custom Query */}
                    <section className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">سوال سفارشی</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleAnalysis(); }}>
                            <textarea
                                value={customQuery}
                                onChange={e => setCustomQuery(e.target.value)}
                                placeholder="سوال خود را به زبان فارسی یا انگلیسی اینجا بنویسید..."
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                rows={4}
                                disabled={isLoading}
                            />
                            <Button type="submit" disabled={isLoading} className="mt-3">
                                {isLoading ? 'در حال تحلیل...' : 'دریافت تحلیل'}
                            </Button>
                        </form>
                    </section>
                </div>

                {/* Result Display */}
                <div className="bg-white p-6 rounded-lg shadow flex flex-col">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex-shrink-0">نتیجه تحلیل</h2>
                    <div className="bg-gray-50 rounded-lg p-4 flex-grow border min-h-[300px] overflow-y-auto">
                        {isLoading && <LoadingSpinner />}
                        {error && <p className="text-red-500">{error}</p>}
                        {!isLoading && !error && analysisResult && (
                             <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(analysisResult) }} />
                        )}
                        {!isLoading && !error && !analysisResult && (
                            <p className="text-gray-500 text-center pt-10">
                                یک تحلیل سریع را انتخاب کنید یا سوال خود را بپرسید تا نتیجه در اینجا نمایش داده شود.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAiAnalystPage;