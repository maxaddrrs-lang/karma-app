import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSupportChat } from '../hooks/useSupportChat';

const BackIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;

const SupportChatPage: React.FC = () => {
    const navigate = useNavigate();
    const { userIdentifier } = useAuth();
    const { chats, sendMessage, initializeChat } = useSupportChat();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const userChatHistory = userIdentifier ? chats[userIdentifier] || [] : [];

    useEffect(() => {
        if (userIdentifier) {
            initializeChat(userIdentifier);
        }
    }, [userIdentifier, initializeChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [userChatHistory]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !userIdentifier) return;

        const isFirstUserMessage = userChatHistory.filter(m => m.sender === 'user').length === 0;

        sendMessage(userIdentifier, input, 'user');
        setInput('');

        if (isFirstUserMessage) {
            setTimeout(() => {
                sendMessage(userIdentifier, "سلام! پیام شما دریافت شد. همکاران ما به زودی پاسخ شما را خواهند داد. از صبر شما سپاسگزاریم.", 'support');
            }, 1500);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <header className="sticky top-0 bg-white z-10 shadow-sm flex-shrink-0">
                <div className="container mx-auto px-4 py-4 flex items-center">
                    <button onClick={() => navigate(-1)} className="text-gray-600 p-2 -ml-2">
                        <BackIcon />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800 text-center flex-grow">چت با پشتیبانی</h1>
                    <div className="w-6"></div> {/* Spacer */}
                </div>
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-4">
                {userChatHistory.map(msg => (
                    <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                         {msg.sender === 'support' && <img src="https://i.pravatar.cc/150?u=support" alt="Support" className="w-8 h-8 rounded-full" />}
                        <div className={`max-w-xs md:max-w-md rounded-2xl px-4 py-3 ${msg.sender === 'user' ? 'bg-emerald-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className="text-xs opacity-70 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </main>

            <footer className="sticky bottom-20 sm:bottom-0 bg-white p-4 border-t flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="پیام خود را بنویسید..."
                        className="w-full bg-gray-100 rounded-full py-3 px-5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                    <button type="submit" className="p-3 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-gray-300" disabled={!input.trim()}>
                        <SendIcon />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default SupportChatPage;