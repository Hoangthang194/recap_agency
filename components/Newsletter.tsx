'use client';

import React from 'react';

const Newsletter: React.FC = () => {
    // Use fixed images for the newsletter collage
    const images = [
        'https://recap.codesupply.co/recap/wp-content/uploads/sites/2/2025/08/demo-subscribe-0001.webp',
        'https://recap.codesupply.co/recap/wp-content/uploads/sites/2/2025/08/demo-subscribe-0002.webp',
        'https://recap.codesupply.co/recap/wp-content/uploads/sites/2/2025/08/demo-subscribe-0003.webp'
    ];

    return (
        <section className="relative py-24 px-4 overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-200">
            <div className="relative max-w-4xl mx-auto text-center z-10">
                {/* Image Fan Collage */}
                {images.length >= 3 && (
                    <div className="relative h-48 w-full max-w-lg mx-auto mb-10 flex justify-center items-center">
                        <div className="absolute w-40 h-40 rounded-3xl shadow-xl overflow-hidden -rotate-12 -translate-x-20 border-[6px] border-white dark:border-gray-800 z-0 hover:-translate-y-2 hover:-rotate-6 transition-all duration-500">
                            <img src={images[0]} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/10"></div>
                        </div>
                        <div className="absolute w-40 h-40 rounded-3xl shadow-xl overflow-hidden rotate-12 translate-x-20 border-[6px] border-white dark:border-gray-800 z-0 hover:-translate-y-2 hover:rotate-6 transition-all duration-500">
                            <img src={images[1]} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/10"></div>
                        </div>
                        <div className="absolute w-48 h-48 rounded-3xl shadow-2xl overflow-hidden z-10 border-[6px] border-white dark:border-gray-800 hover:-translate-y-2 transition-all duration-500">
                            <img src={images[2]} alt="" className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}

                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-blue-100 dark:border-blue-900/50 bg-white dark:bg-gray-800 shadow-sm text-xs font-bold text-blue-600 dark:text-blue-400 mb-8 hover:shadow-md transition-shadow">
                    <span className="material-icons-outlined text-sm">auto_awesome</span>
                    Stay in the Loop
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 mb-6 tracking-tight">
                    Reviews That Matter, Without the <span className="inline-block relative">
                        <span className="relative z-10 px-2 py-1 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-gray-900 dark:text-gray-100">Noise</span>
                    </span>
                </h2>
                
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-xl mx-auto">
                    Independent insights, honest reviews, and real-world observations across multiple topics — carefully curated, never spammy.
                </p>

                <form className="max-w-md mx-auto flex gap-3" onSubmit={(e) => e.preventDefault()}>
                    <input 
                        type="email" 
                        placeholder="Your Email" 
                        className="flex-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-5 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-blue-500/20 text-sm active:transform active:scale-95">
                        Subscribe
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Newsletter;