import React, { useState, useEffect, useRef } from 'react';
import { useSupportChat } from '../context/SupportChatContext';
import { useAuth } from '../hooks/useAuth';
import type { SupportChatMessage } from '../types';

const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;

const AdminSupportChatPage: React.FC = () => {
    const { chats, sendMessage, markAsRead, getUnreadCount } = useSupportChat();
    const { userIdentifier } = useAuth();
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const chatThreads = Object.keys(chats).sort((a, b) => {
        const lastMessageA = chats[a][chats[a].length - 1]?.timestamp || '';
        const lastMessageB = chats[b][chats[b].length - 1]?.timestamp || '';
        return new Date(lastMessageB).getTime() - new Date(lastMessageA).getTime();
    });

    useEffect(() => {
        if (selectedUser) {
            markAsRead(selectedUser);
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedUser, chats]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim() || !selectedUser) return;
        
        // 1. Update chat history
        sendMessage(selectedUser, replyText, 'support');
        
        setReplyText('');
    };

    return (
        <div className="h-full flex flex-row bg-white rounded-lg shadow-lg overflow-hidden">
            {/* User List Sidebar */}
            <aside className="w-1/3 border-r flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">گفتگوهای پشتیبانی</h2>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {chatThreads.map(userId => {
                        const unreadCount = getUnreadCount(userId);
                        return (
                        <div
                            key={userId}
                            onClick={() => setSelectedUser(userId)}
                            className={`p-4 cursor-pointer hover:bg-emerald-50 border-b ${selectedUser === userId ? 'bg-emerald-100' : ''}`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-700">{userId}</span>
                                {unreadCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    )})}
                </div>
            </aside>

            {/* Chat Window */}
            <main className="w-2/3 flex flex-col">
                {selectedUser ? (
                    <>
                        <header className="p-4 border-b bg-gray-50">
                            <h3 className="font-bold text-gray-800">گفتگو با {selectedUser}</h3>
                        </header>
                        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-100">
                             {chats[selectedUser].map(msg => (
                                <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'support' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.sender === 'user' && <img src={`https://i.pravatar.cc/150?u=${selectedUser}`} alt="User" className="w-8 h-8 rounded-full" />}
                                    <div className={`max-w-md rounded-2xl px-4 py-3 ${msg.sender === 'support' ? 'bg-emerald-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                        <p className="text-xs opacity-70 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <footer className="p-4 border-t bg-white">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                    placeholder="پاسخ خود را بنویسید..."
                                    className="w-full bg-gray-100 rounded-full py-3 px-5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                />
                                <button type="submit" className="p-3 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-gray-300" disabled={!replyText.trim()}>
                                    <SendIcon />
                                </button>
                            </form>
                        </footer>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>یک گفتگو را برای مشاهده انتخاب کنید.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminSupportChatPage;