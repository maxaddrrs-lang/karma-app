import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const AboutUsPage: React.FC = () => {
    return (
        <div className="bg-white min-h-screen">
            <div className="relative h-64 md:h-80 bg-emerald-600">
                <img 
                    src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop" 
                    alt="Community helping hands"
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold">درباره کارما</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl">
                        پلی میان نیت‌های خیر و نیازهای واقعی؛ جایی که هر اقدام کوچک، موجی بزرگ از تغییر می‌سازد.
                    </p>
                </div>
            </div>

            <main className="container mx-auto px-6 py-12 md:py-16">
                <div className="max-w-4xl mx-auto">
                    <article className="prose prose-lg max-w-none text-gray-700 leading-relaxed text-justify">
                        <section className="mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-emerald-400 pb-2">داستان ما</h2>
                            <p>
                                کارما از یک ایده ساده متولد شد: چگونه می‌توانیم قدرت جمعی انسان‌ها را برای حل مشکلات اجتماعی به کار گیریم؟ ما دیدیم که از یک سو، برندها و سازمان‌های مسئولیت‌پذیر به دنبال راهی برای ایفای نقش اجتماعی خود هستند و از سوی دیگر، میلیون‌ها انسان با قلبی بزرگ آماده‌اند تا برای دنیایی بهتر قدمی بردارند. کارما به عنوان یک پل ارتباطی، این دو گروه را به هم متصل می‌کند. ما بستری را فراهم کردیم که در آن، انجام کارهای خیر نه تنها ممکن، بلکه ساده، شفاف و تاثیرگذار است.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-emerald-400 pb-2">ماموریت ما</h2>
                            <p>
                                ماموریت ما در کارما، دموکراتیزه کردن کار خیر است. ما معتقدیم که هر فرد، صرف‌نظر از توانایی مالی، می‌تواند در ساختن جامعه‌ای بهتر سهیم باشد. ما با تبدیل اقدامات کوچک و روزمره به ماموریت‌های اجتماعی، این فرصت را برای همه فراهم می‌کنیم تا "زمان" و "توجه" خود را به یک سرمایه اجتماعی ارزشمند تبدیل کنند. هدف ما ایجاد یک اکوسیستم پایدار است که در آن برندها به اهداف اجتماعی خود می‌رسند، سازمان‌های مردم‌نهاد حمایت می‌شوند و مردم عادی به قهرمانان تغییر تبدیل می‌شوند.
                            </p>
                        </section>
                        
                        <div className="grid md:grid-cols-2 gap-8 my-12 items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">چگونه کار می‌کند؟</h3>
                                <ol className="list-decimal list-inside space-y-3">
                                    <li><strong>ایجاد کمپین:</strong> برندها ماموریت‌های اجتماعی خود را با اهداف مشخص تعریف می‌کنند.</li>
                                    <li><strong>انجام ماموریت:</strong> شما با انجام کارهای ساده مانند اشتراک‌گذاری محتوا، به کمپین‌ها کمک می‌کنید.</li>
                                    <li><strong>کسب پاداش:</strong> با هر ماموریت، "امتیاز تاثیرگذاری" و "سکه کارما" دریافت می‌کنید.</li>
                                    <li><strong>مشاهده نتیجه:</strong> پیشرفت کمپین‌ها را به صورت شفاف دنبال کرده و از تاثیر جمعی خود لذت ببرید.</li>
                                </ol>
                            </div>
                             <img src="https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?q=80&w=1200&auto=format&fit=crop" alt="Person using a phone to participate" className="rounded-xl shadow-lg w-full h-64 object-cover"/>
                        </div>

                        <section>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-emerald-400 pb-2">ارزش‌های ما</h2>
                            <ul className="list-disc list-inside space-y-2">
                                <li><strong>شفافیت:</strong> ما به شفافیت کامل در تمام مراحل، از تعریف کمپین تا گزارش نتایج، متعهد هستیم.</li>
                                <li><strong>همکاری:</strong> ما باور داریم که با همکاری و هم‌افزایی، می‌توانیم به نتایج بزرگی دست یابیم.</li>
                                <li><strong>نوآوری:</strong> ما همواره به دنبال راه‌های خلاقانه برای تسهیل و ترویج فرهنگ نیکوکاری هستیم.</li>
                                <li><strong>توانمندسازی:</strong> ما به هر فرد این قدرت را می‌دهیم که به سادگی یک عامل تغییر مثبت باشد.</li>
                            </ul>
                        </section>
                    </article>
                    
                    <div className="mt-16 text-center border-t pt-10">
                        <h3 className="text-2xl font-bold text-gray-800">شما هم بخشی از این حرکت باشید</h3>
                        <p className="mt-4 text-gray-600">
                            چه یک برند مسئولیت‌پذیر باشید و چه فردی که به دنبال ایجاد تغییری مثبت است، کارما برای شماست.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/campaigns" className="w-full sm:w-auto">
                                <Button className="w-full">مشارکت در کمپین‌ها</Button>
                            </Link>
                             <Link to="/create-options" className="w-full sm:w-auto">
                                <Button variant="secondary" className="w-full">ایجاد کمپین جدید</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AboutUsPage;