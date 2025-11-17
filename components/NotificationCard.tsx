import React from 'react';
import type { NewsArticle } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface NewsCardProps {
    article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
    const { formatRelativeTime } = useLanguage();

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200/80 overflow-hidden animate-fadeInUp">
            <img className="w-full h-56 object-cover" src={article.imageUrl} alt={article.title} />
            <div className="p-6">
                <h3 className="font-bold text-xl leading-tight text-gray-800">{article.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{formatRelativeTime(article.date)}</p>
                <p className="mt-4 text-gray-700 text-base whitespace-pre-wrap leading-relaxed">
                    {article.content}
                </p>
            </div>
        </div>
    );
};

export default NewsCard;
