import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const PartnersPage: React.FC = () => {
    const { brands, charities } = useSettings();

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="relative h-64 md:h-80 bg-blue-600">
                <img 
                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format=fit=crop" 
                    alt="People collaborating"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold">همکاران ما</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl">
                        با هم، برای فردایی بهتر. قدردان همکارانی هستیم که در این مسیر ما را یاری می‌کنند.
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12 md:py-16">
                <section className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">قدرت همکاری</h2>
                    <p className="text-gray-600 leading-relaxed">
                        در کارما، ما به قدرت همکاری برای ایجاد تغییرات بزرگ ایمان داریم. موفقیت ما مدیون اعتماد برندهای مسئولیت‌پذیر و همراهی سازمان‌های مردم‌نهادی است که در کنار ما برای ساختن جامعه‌ای بهتر تلاش می‌کنند. این صفحه به افتخار این همکاران ارزشمند تقدیم شده است.
                    </p>
                </section>

                {/* Trusted Brands */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center border-b-2 border-emerald-400 pb-4 max-w-md mx-auto">اعتماد برندها</h2>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                        {brands.map(brand => (
                            <div key={brand.id} className="p-4 bg-white rounded-full shadow-md" title={brand.name}>
                                <img 
                                    src={brand.logoUrl} 
                                    alt={brand.name} 
                                    className="h-16 w-16 md:h-20 md:w-20 object-contain grayscale transition-all duration-300 hover:grayscale-0"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = `<div class='h-16 w-16 md:h-20 md:w-20 flex items-center justify-center text-gray-500 font-semibold'>${brand.name}</div>` }}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Charities & NGOs */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center border-b-2 border-blue-400 pb-4 max-w-lg mx-auto">خیریه‌ها و سازمان‌های مردم‌نهاد</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {charities.map(charity => (
                            <div key={charity.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center flex flex-col items-center">
                                <img 
                                    src={charity.logoUrl} 
                                    alt={charity.name} 
                                    className="h-24 w-24 object-contain mb-4"
                                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                                />
                                <h3 className="text-xl font-bold text-gray-900 flex-grow">{charity.name}</h3>
                                <a 
                                    href={charity.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="mt-4 inline-block text-emerald-600 font-semibold hover:text-emerald-800 transition-colors"
                                >
                                    مشاهده وب‌سایت &rarr;
                                </a>
                            </div>
                        ))}
                    </div>
                </section>
                
                <div className="mt-16 text-center border-t pt-10">
                    <h3 className="text-2xl font-bold text-gray-800">به جمع همکاران ما بپیوندید</h3>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        اگر شما هم یک برند یا سازمان هستید که به مسئولیت اجتماعی خود اهمیت می‌دهید، مایلیم با شما صحبت کنیم.
                    </p>
                    <div className="mt-8">
                        <Link to="/support">
                           <Button>تماس با ما</Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PartnersPage;