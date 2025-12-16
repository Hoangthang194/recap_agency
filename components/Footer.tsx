'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
                    <div className="lg:col-span-2 pr-8">
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <div className="relative h-8 flex items-center transition-transform group-hover:scale-105">
                                <Image 
                                    src="/assets/logo.webp" 
                                    alt="Recap Logo" 
                                    width={101} 
                                    height={29}
                                    className="object-contain h-8 w-auto"
                                />
                            </div>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
                            Your mental filter in a world of constant input — cutting through the noise to focus on what truly matters.
                        </p>
                        <p className="text-xs text-gray-400">
                            © 2025 Recap. All Rights Reserved.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-6">Demos</h3>
                        <ul className="space-y-4">
                            {['Classic Grid', 'Classic List', 'Featured Posts', 'Hero Slider', 'Full Posts'].map((link) => (
                                <li key={link}><a href="#" className="text-sm text-gray-600 hover:text-primary font-medium transition-colors">{link}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Categories</h3>
                        <ul className="space-y-4">
                             {['Education', 'Business', 'Startup', 'Tech'].map((link) => (
                                <li key={link}><a href="#" className="text-sm text-gray-600 hover:text-primary font-medium transition-colors">{link}</a></li>
                            ))}
                        </ul>
                    </div>

                     <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Pages</h3>
                        <ul className="space-y-4">
                             {['Categories', 'About', '404 Page'].map((link) => (
                                <li key={link}><a href="#" className="text-sm text-gray-600 hover:text-primary font-medium transition-colors">{link}</a></li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="flex flex-col gap-4 items-start lg:items-end">
                         <div className="flex gap-2">
                             {[
                                 {icon: 'close', label: 'X'},
                                 {icon: 'public', label: 'Web'},
                                 {icon: 'rss_feed', label: 'RSS'}
                             ].map((social, idx) => (
                                 <button key={idx} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                                     <span className="material-icons-outlined text-lg">{social.icon}</span>
                                 </button>
                             ))}
                         </div>
                    </div>
                </div>

                <div className="border-t border-gray-50 pt-12 overflow-hidden relative">
                     <div className="ticker-wrap w-full opacity-10 hover:opacity-20 transition-opacity duration-500 cursor-default">
                        <div className="ticker-content">
                            <div className="flex items-center gap-8 whitespace-nowrap">
                                {[...Array(4)].map((_, i) => (
                                    <React.Fragment key={i}>
                                        <span className="text-6xl font-black text-gray-800 tracking-tighter">Ongoing Notes</span>
                                        <span className="material-icons-outlined text-5xl text-blue-400">edit</span>
                                        <span className="text-6xl font-black text-gray-400 tracking-tighter">Curated Thoughts</span>
                                        <span className="material-icons-outlined text-5xl text-blue-400">edit</span>
                                        <span className="text-6xl font-black text-gray-800 tracking-tighter">Collected Ideas</span>
                                        <span className="material-icons-outlined text-5xl text-blue-400">edit</span>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             <button className="fixed bottom-8 right-8 w-12 h-12 bg-white border border-gray-100 shadow-xl rounded-full flex items-center justify-center text-gray-400 hover:text-primary transition-all hover:-translate-y-1 z-40">
                <span className="material-icons-outlined">expand_less</span>
            </button>
        </footer>
    );
};

export default Footer;