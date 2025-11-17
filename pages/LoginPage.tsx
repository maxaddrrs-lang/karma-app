import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import { useLanguage } from '../hooks/useLanguage';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [registerStep, setRegisterStep] = useState(1);
  const [registerEmail, setRegisterEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const validateIdentifier = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,11}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  };

  const saveUser = async (email: string, password: string, confirmPassword: string = '') => {
    try {
      const res = await fetch('http://YOUR_SERVER_DOMAIN:5000/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword }),
      });
      if (!res.ok) throw new Error('خطا در ذخیره اطلاعات');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (registerStep === 2 && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [registerStep, timeLeft]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier.trim() === '') { setError('ایمیل یا شماره موبایل را وارد کنید!'); return; }
    if (!validateIdentifier(identifier)) { setError('ایمیل یا شماره موبایل نامعتبر است!'); return; }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find((u: any) => u.email === identifier && u.password === password);
    if (!found) { setError('ایمیل یا رمز عبور اشتباه است!'); return; }
    setError('');
    login(identifier);
    navigate(from, { replace: true });
  };

  const handleRegisterNext = () => {
    if (registerStep === 1) { if (!validateIdentifier(registerEmail)) { alert('ایمیل معتبر وارد کنید!'); return; } setRegisterStep(2); setTimeLeft(300); }
    else if (registerStep === 2) { if (verificationCode !== '777') { alert('کد اشتباه است!'); return; } setRegisterStep(3); }
    else if (registerStep === 3) { if (password.length < 6) { alert('رمز عبور باید حداقل 6 کاراکتر باشد!'); return; } if (password !== registerConfirmPassword) { alert('رمز عبور و تکرار آن مطابقت ندارد!'); return; } saveUser(registerEmail, password); alert('ثبت نام انجام شد!'); setIsRegister(false); setRegisterStep(1); setRegisterEmail(''); setVerificationCode(''); setPassword(''); setRegisterConfirmPassword(''); }
  };

  const handlePrevStep = () => { if (registerStep > 1) setRegisterStep(registerStep - 1); };
  const getPasswordStrengthColor = () => { if (password.length === 0) return 'bg-gray-200'; if (password.length < 6) return 'bg-red-500'; if (password.length < 10) return 'bg-orange-400'; return 'bg-green-500'; };

  return (
    <GoogleOAuthProvider clientId="848843763528-2qnn6b2c8pphh2ksi9ij0nktrraoi1lu.apps.googleusercontent.com">
      <div className="flex items-center justify-center min-h-[calc(100vh-70px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-200/80">

          {!isRegister ? (
            <>
              <div className="text-center">
                <h1 className="text-4xl font-bold text-emerald-500">{t('home.karma')}</h1>
                <h2 className="mt-6 text-2xl font-extrabold text-gray-900">{t('login.title')}</h2>
                <p className="mt-2 text-sm text-gray-600">{t('login.subtitle')}</p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                <div className="rounded-md shadow-sm -space-y-px">
                  <Input label="ایمیل یا شماره موبایل" id="identifier" name="identifier" type="text" required value={identifier} onChange={(e) => { setIdentifier(e.target.value); if (error) setError(''); }} placeholder="ایمیل یا شماره موبایل" hasError={!!error} />
                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>

                <div className="space-y-4 max-w-md w-full">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">رمز عبور</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="رمز عبور" />
                    <div className={`h-1 mt-1 rounded ${getPasswordStrengthColor()}`}></div>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">ورود</Button>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 mt-2" onClick={() => setIsRegister(true)}>ثبت نام</Button>
              </form>
            </>
          ) : (
            <div>
              <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-emerald-500">ثبت نام</h1>
                {registerStep === 1 && <p className="mt-2 text-sm text-gray-600">ایمیل خود را وارد کنید</p>}
                {registerStep === 2 && <p className="mt-2 text-sm text-gray-600">کد ارسال شده را وارد نمایید:</p>}
                {registerStep === 3 && <p className="mt-2 text-sm text-gray-600">رمز عبور خود را وارد کنید</p>}
              </div>

              <div className="space-y-4">
                {registerStep === 1 && <input type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} placeholder="ایمیل خود را وارد کنید" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />}

                {registerStep === 2 && (
                  <div className="flex items-center space-x-2">
                    <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="کد تایید" className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" disabled={timeLeft <= 0} />
                    <span className="text-sm text-gray-600">{Math.floor(timeLeft/60)}:{('0'+timeLeft%60).slice(-2)}</span>
                  </div>
                )}

                {registerStep === 3 && (
                  <div>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="رمز عبور" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 mt-2" />
                    <div className={`h-1 mt-1 rounded ${getPasswordStrengthColor()}`}></div>
                    <input type="password" value={registerConfirmPassword} onChange={(e) => setRegisterConfirmPassword(e.target.value)} placeholder="تکرار رمز عبور" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 mt-2" />
                    {registerConfirmPassword && registerConfirmPassword !== password && <p className="text-red-500 text-sm mt-1">رمز عبور مطابقت ندارد</p>}
                  </div>
                )}

                <Button className="w-full bg-amber-500 hover:bg-amber-600" onClick={handleRegisterNext}>{registerStep === 3 ? 'تایید' : 'بعدی'}</Button>
                {registerStep > 1 && <Button className="w-full bg-gray-300 hover:bg-gray-400" onClick={handlePrevStep}>مرحله قبلی</Button>}
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-center">
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md p-2 hover:shadow-lg transition-shadow duration-200">
              <GoogleLogin
                onSuccess={(cred) => {
                  const jwt = cred.credential;
                  if (!jwt) return;
                  const user = JSON.parse(atob(jwt.split('.')[1]));
                  login(user.email);
                  saveUser(user.email, '');
                  navigate(from, { replace: true });
                }}
                onError={() => console.log("Google login failed")}
                useOneTap
                render={(renderProps) => (
                  <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="flex items-center justify-center w-full px-4 py-2 bg-white rounded-md shadow-sm hover:shadow-md text-gray-700 font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google logo" className="w-5 h-5 mr-3" />
                    Sign in with Google
                  </button>
                )}
              />
            </div>
          </div>

        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
