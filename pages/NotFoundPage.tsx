import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFoundIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-24 w-24 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
         <path strokeLinecap="round" strokeLinejoin="round" d="M15 13l-3-3-3 3" />
    </svg>
);


const NotFoundPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-70px)] bg-gray-100 text-center px-4">
            <div className="max-w-md w-full">
                <NotFoundIcon />
                <h1 className="mt-6 text-6xl font-extrabold text-gray-800">۴۰۴</h1>
                <h2 className="mt-4 text-2xl font-bold text-gray-700">صفحه مورد نظر یافت نشد</h2>
                <p className="mt-4 text-gray-500">
                    متاسفانه صفحه‌ای که به دنبال آن بودید وجود ندارد یا به آدرس دیگری منتقل شده است.
                </p>
                <div className="mt-8">
                    <Link to="/">
                        <Button>بازگشت به صفحه اصلی</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
