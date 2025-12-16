'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { categories, posts } from '@/data';

const Header: React.FC = () => {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const lastScrollYRef = React.useRef(0);
    const tickingRef = React.useRef(false);
    
    // Get latest 4 posts for spotlight
    const spotlightPosts = posts.slice(0, 4);

    useEffect(() => {
        const scrollPoint = 200; // Threshold như trong HTML mẫu
        
        const handleScroll = () => {
            if (!tickingRef.current) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    const scrollDifference = Math.abs(currentScrollY - lastScrollYRef.current);
                    
                    // Chỉ xử lý nếu scroll đủ nhiều (tránh nháy)
                    if (scrollDifference > 5) {
                        // Hiện header khi ở đầu trang
                        if (currentScrollY < 10) {
                            setIsVisible(true);
                            setScrolled(false);
                        } 
                        // Ẩn header khi scroll xuống và đã scroll qua threshold
                        else if (currentScrollY > lastScrollYRef.current && currentScrollY > scrollPoint + 200) {
                            setIsVisible(false);
                            setScrolled(true);
                        } 
                        // Hiện header khi scroll lên
                        else if (currentScrollY < lastScrollYRef.current) {
                            setIsVisible(true);
                            setScrolled(true);
                        }
                        
                        lastScrollYRef.current = currentScrollY;
                    }
                    
                    tickingRef.current = false;
                });
                
                tickingRef.current = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 w-full transition-transform duration-300 ${
            isVisible 
                ? 'translate-y-0 cs-header-smart-visible' 
                : '-translate-y-full'
        }`}>
            <div className={`w-full px-4 transition-all duration-300 ${
                scrolled ? 'pt-4' : ''
            }`}>
                <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
                    scrolled
                        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md rounded-2xl'
                        : 'bg-transparent'
                }`}>
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0 flex items-center">
                        <h1 className="m-0">
                            <Link href="/" className="flex items-center group">
                                <div className="relative h-8 flex items-center transition-transform group-hover:scale-105">
                                    <Image 
                                        src="/assets/logo.webp" 
                                        alt="Recap" 
                                        width={101} 
                                        height={29}
                                        className="object-contain h-8 w-auto"
                                        priority
                                    />
                                </div>
                            </Link>
                        </h1>
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
            </div>
        </header>
    );
};

export default Header;