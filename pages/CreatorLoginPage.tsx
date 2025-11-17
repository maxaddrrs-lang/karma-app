import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaigns } from '../hooks/useCampaigns';
import Input from '../components/Input';
import Button from '../components/Button';
import { useLanguage } from '../hooks/useLanguage';

const CreatorLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [brandName, setBrandName] = useState('');
  const [error, setError] = useState('');
  const { campaigns } = useCampaigns();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in as a creator, redirect to dashboard
    if (localStorage.getItem('creatorEmail')) {
      navigate('/creator/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !brandName.trim()) {
      setError('لطفا ایمیل و نام برند را وارد کنید.');
      return;
    }

    // Simulate login: check if there's any campaign with this creator email and brand name
    const creatorExists = campaigns.some(
      c => c.creatorEmail.toLowerCase() === email.toLowerCase() && c.brandName === brandName
    );

    if (creatorExists) {
      setError('');
      // Store creator identity in localStorage
      localStorage.setItem('creatorEmail', email);
      localStorage.setItem('creatorBrandName', brandName);
      navigate('/creator/dashboard');
    } else {
      setError('هیچ کمپینی با این مشخصات یافت نشد. لطفا اطلاعات صحیح را وارد کنید.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-70px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-200/80">
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
            ورود به پنل برگزارکننده
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            آمار و فعالیت‌های کمپین‌های خود را مشاهده کنید.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 rounded-md shadow-sm">
            <Input
              label="ایمیل برگزارکننده"
              id="creator-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@company.com"
              hasError={!!error}
            />
            <Input
              label="نام برند"
              id="brandName"
              name="brandName"
              type="text"
              required
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="نام برند شما"
              hasError={!!error}
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

          <div>
            <Button type="submit" className="w-full">
              ورود
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatorLoginPage;
