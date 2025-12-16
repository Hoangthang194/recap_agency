'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories, posts } from '@/data';

const Header: React.FC = () => {
    const pathname = usePathname();
    
    // Get latest 4 posts for spotlight
    const spotlightPosts = posts.slice(0, 4);

    return (
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl relative overflow-hidden transition-transform group-hover:scale-105">
                                <span className="relative z-10 text-lg">+</span>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            </div>
                            <span className="font-bold text-xl tracking-tight text-gray-900 group-hover:text-primary transition-colors">Recap</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex space-x-2 items-center">
                        {['Demos', 'Features', 'Categories', 'Business'].map((item) => (
                             <div key={item} className="relative group px-4 py-2">
                                <button className="text-sm font-semibold text-gray-600 hover:text-primary flex items-center gap-1 transition-colors bg-transparent border-none cursor-pointer">
                                    {item}
                                    <span className="material-icons-outlined text-[16px] transition-transform group-hover:rotate-180">expand_more</span>
                                </button>
                                
                                {/* Mega Menu - Only for Categories for this demo */}
                                {item === 'Categories' && (
                                    <div className="absolute top-full -left-20 w-[800px] pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden grid grid-cols-12">
                                            {/* Categories List */}
                                            <div className="col-span-6 p-8 bg-white">
                                                <div className="space-y-6">
                                                    {categories.slice(0, 5).map(cat => (
                                                        <Link href={cat.id === 'tech' ? '/tech' : '/categories'} key={cat.id} className="flex gap-4 group/item hover:bg-gray-50 -mx-4 px-4 py-2 rounded-xl transition-colors">
                                                            <div className="mt-1">
                                                                <span className="material-icons-outlined text-gray-400 group-hover/item:text-primary transition-colors">{cat.icon}</span>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-bold text-gray-900 group-hover/item:text-primary transition-colors mb-1">{cat.name}</h4>
                                                                <p className="text-xs text-gray-500 leading-relaxed max-w-xs">{cat.description}</p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {/* Spotlight Section */}
                                            <div className="col-span-6 p-8 bg-gray-50/50">
                                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Spotlight</h3>
                                                <div className="space-y-5">
                                                    {spotlightPosts.map(post => (
                                                        <Link href={`/post/${post.id}`} key={post.id} className="flex gap-4 group/post">
                                                            <div className="flex-1">
                                                                <h4 className="text-sm font-bold text-gray-900 group-hover/post:text-primary transition-colors leading-tight mb-2">
                                                                    {post.title}
                                                                </h4>
                                                                <p className="text-xs text-gray-400">{post.date}</p>
                                                            </div>
                                                            <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden relative">
                                                                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover/post:scale-110 transition-transform duration-500" />
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                            <span className="material-icons-outlined text-xl">search</span>
                        </button>
                        <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                            <span className="material-icons-outlined text-xl">dark_mode</span>
                        </button>
                         <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>
                        <a href="#" className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-full shadow-sm text-white bg-primary hover:bg-primary-hover transition-all transform hover:-translate-y-0.5">
                            Buy Now
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;