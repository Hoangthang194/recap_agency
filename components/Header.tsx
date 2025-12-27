'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCategories, usePosts, useAreas, useCountries } from '@/hooks';
import { getPostUrl } from '@/utils/post';

const Header: React.FC = () => {
    const pathname = usePathname();
    const { categories, loading: categoriesLoading, fetchCategories } = useCategories();
    const { posts, loading: postsLoading, fetchPosts } = usePosts();
    const { areas, loading: areasLoading, fetchAreas } = useAreas();
    const { countries, loading: countriesLoading, fetchCountries } = useCountries();
    const [isVisible, setIsVisible] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set());
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileExpandedItems, setMobileExpandedItems] = useState<Set<string>>(new Set());
    const [isDarkMode, setIsDarkMode] = useState(false);
    const lastScrollYRef = React.useRef(0);
    const tickingRef = React.useRef(false);
    const hasFetchedCategories = React.useRef(false);
    const hasFetchedPosts = React.useRef(false);
    const hasFetchedAreas = React.useRef(false);
    const hasFetchedCountries = React.useRef(false);
    
    // Fetch categories and posts on mount (only once)
    useEffect(() => {
        if (!hasFetchedCategories.current && !categoriesLoading) {
            hasFetchedCategories.current = true;
            fetchCategories();
        }
    }, []); // Empty dependency array - only run once on mount
    
    useEffect(() => {
        if (!hasFetchedPosts.current && !postsLoading) {
            hasFetchedPosts.current = true;
            fetchPosts({ limit: 4 }); // Fetch latest 4 posts for spotlight
        }
    }, []); // Empty dependency array - only run once on mount
    
    // Fetch areas on mount (only once)
    useEffect(() => {
        if (!hasFetchedAreas.current && !areasLoading) {
            hasFetchedAreas.current = true;
            fetchAreas();
        }
    }, []); // Empty dependency array - only run once on mount
    
    // Fetch countries on mount (only once)
    useEffect(() => {
        if (!hasFetchedCountries.current && !countriesLoading) {
            hasFetchedCountries.current = true;
            fetchCountries();
        }
    }, []); // Empty dependency array - only run once on mount
    
    // Load dark mode preference from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
        
        setIsDarkMode(shouldBeDark);
        if (shouldBeDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);
    
    // Toggle dark mode
    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };
    
    // Get latest 4 posts for spotlight
    const spotlightPosts = posts.slice(0, 4);
    
    // Filter categories (non-cities) for Categories menu
    const postCategories = categories.filter(cat => !cat.isCity);
    
    const toggleArea = (areaId: string) => {
        setExpandedAreas(prev => {
            const newSet = new Set(prev);
            if (newSet.has(areaId)) {
                // Nếu đang mở thì đóng lại
                newSet.delete(areaId);
            } else {
                // Nếu đang đóng thì đóng tất cả khu vực khác và mở khu vực này
                newSet.clear();
                newSet.add(areaId);
            }
            return newSet;
        });
    };

    const toggleMobileItem = (item: string) => {
        setMobileExpandedItems(prev => {
            const next = new Set(prev);
            if (next.has(item)) {
                next.delete(item);
            } else {
                next.add(item);
            }
            return next;
        });
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setMobileExpandedItems(new Set());
    };

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
                                        src="/assets/zerra.png" 
                                        alt="ZERRA" 
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
                        {['Home', 'Travel', 'Categories', 'About'].map((item) => {
                            const hasSubmenu = item === 'Travel' || item === 'Categories';
                            
                            return (
                             <div key={item} className="relative group px-4 py-2">
                                    {item === 'Home' ? (
                                        <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">
                                            {item}
                                        </Link>
                                    ) : item === 'About' ? (
                                        <Link href="/about" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">
                                            {item}
                                        </Link>
                                    ) : (
                                <button className="text-sm font-semibold text-gray-600 hover:text-primary flex items-center gap-1 transition-colors bg-transparent border-none cursor-pointer">
                                    {item}
                                            {hasSubmenu && (
                                    <span className="material-icons-outlined text-[16px] transition-transform group-hover:rotate-180">expand_more</span>
                                            )}
                                </button>
                                    )}
                                
                                    {/* Mega Menu for Travel - Using Areas */}
                                    {item === 'Travel' && (
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-[800px] pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden grid grid-cols-12">
                                                {/* Travel Areas List */}
                                            <div className="col-span-6 p-8 bg-white">
                                                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                                        {/* Group areas by region */}
                                                        {Array.from(new Set(areas.map(a => a.region))).map(region => {
                                                            const regionAreas = areas.filter(a => a.region === region);
                                                            return (
                                                                <div key={region}>
                                                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                                                        {region}
                                                                    </div>
                                                                    {regionAreas.map((area, areaIndex) => {
                                                                        // Filter countries by areaId
                                                                        const areaCountries = countries.filter(c => c.areaId === area.id);
                                                                        
                                                                        return (
                                                                            <div key={area.id} className="mb-4">
                                                                                <button
                                                                                    onClick={() => toggleArea(area.id)}
                                                                                    className="w-full flex items-center justify-between text-sm font-bold text-gray-900 mb-2 hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                                                                                >
                                                                                    <div className="flex items-center gap-2">
                                                                                        <span className="material-icons-outlined text-base text-gray-400">{area.icon}</span>
                                                                                        <span>{area.name}</span>
                                                                                    </div>
                                                                                    <span className={`material-icons-outlined text-[16px] transition-transform duration-300 ease-in-out ${expandedAreas.has(area.id) ? 'rotate-180' : ''}`}>
                                                                                        expand_more
                                                                                    </span>
                                                                                </button>
                                                                                <div 
                                                                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                                                                        expandedAreas.has(area.id) 
                                                                                            ? 'max-h-96 opacity-100' 
                                                                                            : 'max-h-0 opacity-0'
                                                                                    }`}
                                                                                >
                                                                                    <div className="space-y-3 pl-6 pt-2">
                                                                                        {areaCountries.map((country, countryIndex) => (
                                                                                            <Link 
                                                                                                key={country.id}
                                                                                                href={`/categories?country=${country.id}`} 
                                                                                                className={`flex gap-4 group/item hover:bg-gray-50 -mx-4 px-4 py-2 rounded-xl transition-all duration-300 ${
                                                                                                    expandedAreas.has(area.id) 
                                                                                                        ? 'opacity-100 translate-y-0' 
                                                                                                        : 'opacity-0 -translate-y-2 delay-0'
                                                                                                }`}
                                                                                                style={{ transitionDelay: expandedAreas.has(area.id) ? `${(countryIndex + 1) * 75}ms` : '0ms' }}
                                                                                            >
                                                            <div className="mt-1">
                                                                                                    <span className="material-icons-outlined text-gray-400 group-hover/item:text-primary transition-colors">{country.icon}</span>
                                                            </div>
                                                            <div>
                                                                                                    <h4 className="text-sm font-bold text-gray-900 group-hover/item:text-primary transition-colors mb-1">{country.name}</h4>
                                                                                                    <p className="text-xs text-gray-500 leading-relaxed max-w-xs">{country.description}</p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                            
                                            {/* Spotlight Section */}
                                            <div className="col-span-6 p-8 bg-gray-50/50">
                                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Spotlight</h3>
                                                    <div className="space-y-5 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                                    {spotlightPosts.map(post => (
                                                        <Link href={getPostUrl(post)} key={post.id} className="flex gap-4 group/post">
                                                            <div className="flex-1">
                                                                <h4 className="text-sm font-bold text-gray-900 group-hover/post:text-primary transition-colors leading-tight mb-2">
                                                                    {post.title}
                                                                </h4>
                                                                <p className="text-xs text-gray-400">{post.date}</p>
                                                            </div>
                                                            <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden relative">
                                                                <img src={post.thumbnail || post.image} alt={post.title} className="w-full h-full object-cover group-hover/post:scale-110 transition-transform duration-500" />
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                    
                                    {/* Simple Dropdown Menu for Categories - Centered on screen */}
                                    {item === 'Categories' && (
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 w-[320px] max-h-[500px] overflow-y-auto custom-scrollbar py-3">
                                                {categoriesLoading ? (
                                                    <div className="px-6 py-4 text-center text-sm text-gray-500">
                                                        Đang tải...
                                                    </div>
                                                ) : postCategories.length === 0 ? (
                                                    <div className="px-6 py-4 text-center text-sm text-gray-500">
                                                        Chưa có danh mục nào
                                                    </div>
                                                ) : (
                                                    postCategories.map(cat => (
                                                        <Link 
                                                            href={`/${cat.id}`} 
                                                            key={cat.id}
                                                            className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors group/item"
                                                        >
                                                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50 group-hover/item:bg-primary/10 transition-colors">
                                                                <span className="material-icons-outlined text-gray-500 group-hover/item:text-primary transition-colors text-[20px]">{cat.icon}</span>
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="text-sm font-bold text-gray-900 group-hover/item:text-primary transition-colors mb-0.5">{cat.name}</h4>
                                                                <p className="text-xs text-gray-500 leading-relaxed line-clamp-1">{cat.description}</p>
                                                            </div>
                                                        </Link>
                                                    ))
                                                )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Desktop actions */}
                        <button 
                            onClick={toggleDarkMode}
                            className="hidden md:block p-2 text-gray-400 hover:text-primary transition-colors"
                            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            <span className="material-icons-outlined text-xl">
                                {isDarkMode ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>
                         <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>
                        <Link href="/contact" className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-full shadow-sm text-white bg-primary hover:bg-primary-hover transition-all transform hover:-translate-y-0.5">
                            Contact Us
                        </Link>
                        {/* Mobile menu button */}
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
                            aria-label="Open menu"
                        >
                            <span className="material-icons-outlined text-2xl">menu</span>
                        </button>
                    </div>
                </div>
                </div>
            </div>
            {/* Mobile Menu Overlay (absolute inside header) */}
            {isMobileMenuOpen && (
                <div
                    className="absolute inset-0 z-[9998] bg-black/40 md:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Mobile Fullscreen Sidebar (absolute) */}
            <div
                className={`absolute inset-0 h-screen w-full z-[9999] bg-white transform transition-transform duration-300 ease-in-out md:hidden ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-4 py-4">
                        <div className="flex items-center">
                            <Image
                                src="/assets/zerra.png"
                                alt="ZERRA"
                                width={101}
                                height={29}
                                className="h-7 w-auto object-contain"
                                priority
                            />
                        </div>
                        <button
                            type="button"
                            className="p-2 text-gray-700 hover:text-primary transition-colors"
                            aria-label="Close menu"
                            onClick={closeMobileMenu}
                        >
                            <span className="material-icons-outlined text-2xl">close</span>
                        </button>
                    </div>

                    {/* Menu list (scrollable) - use same items as desktop */}
                    <div className="flex-1 overflow-y-auto">
                        {['Home', 'Travel', 'Categories', 'About'].map((item) => {
                            const hasSubmenu = item === 'Travel' || item === 'Categories';
                            const isExpanded = mobileExpandedItems.has(item);
                            const isActive =
                                (item === 'Home' && pathname === '/') ||
                                (item === 'About' && pathname === '/about');

                            return (
                                <div key={item} className="border-b border-gray-200">
                                    {/* Simple links (Home / About) */}
                                    {!hasSubmenu ? (
                                        <Link
                                            href={
                                                item === 'Home'
                                                    ? '/'
                                                    : '/about'
                                            }
                                            onClick={closeMobileMenu}
                                            className={`flex w-full items-center px-6 py-4 text-base font-semibold transition-colors ${
                                                isActive
                                                    ? 'text-primary'
                                                    : 'text-gray-800 hover:text-primary'
                                            }`}
                                        >
                                            {item}
                                        </Link>
                                    ) : (
                                        <>
                                            {/* Top-level button */}
                                            <button
                                                type="button"
                                                onClick={() => toggleMobileItem(item)}
                                                className="flex w-full items-center justify-between px-6 py-4 text-base font-semibold text-gray-800 hover:text-primary transition-colors"
                                            >
                                                <span>{item}</span>
                                                <span
                                                    className={`material-icons-outlined text-lg transition-transform duration-300 ${
                                                        isExpanded ? 'rotate-180' : ''
                                                    }`}
                                                >
                                                    expand_more
                                                </span>
                                            </button>

                                            {/* Travel simple submenu (areas -> countries -> Categories page with cities) */}
                                            {item === 'Travel' && isExpanded && (
                                                <div className="bg-gray-50 overflow-hidden">
                                                    <div className="px-6 py-3 space-y-4 animate-slide-in-left">
                                                        {/* Group areas by region */}
                                                        {Array.from(new Set(areas.map(a => a.region))).map(region => {
                                                            const regionAreas = areas.filter(a => a.region === region);
                                                            return (
                                                                <div key={region}>
                                                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">
                                                                        {region}
                                                                    </div>
                                                                    {regionAreas.map(area => {
                                                                        // Filter countries by areaId
                                                                        const areaCountries = countries.filter(c => c.areaId === area.id);
                                                                        
                                                                        return (
                                                                            <div key={area.id} className="mb-3">
                                                                                <div className="flex items-center gap-2 px-2 mb-1">
                                                                                    <span className="material-icons-outlined text-sm text-gray-400">{area.icon}</span>
                                                                                    <span className="text-xs font-semibold text-gray-600">{area.name}</span>
                                                                                </div>
                                                                                <div className="pl-6 space-y-1">
                                                                                    {areaCountries.map(country => (
                                                                                        <Link
                                                                                            key={country.id}
                                                                                            href={`/categories?country=${country.id}`}
                                                                                            onClick={closeMobileMenu}
                                                                                            className="flex items-center gap-3 text-sm text-gray-700 hover:text-primary transition-colors"
                                                                                        >
                                                                                            <span className="material-icons-outlined text-sm text-gray-400">
                                                                                                {country.icon}
                                                                                            </span>
                                                                                            <span>{country.name}</span>
                                                                                        </Link>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Categories submenu = list of categories */}
                                            {item === 'Categories' && isExpanded && (
                                                <div className="bg-gray-50 overflow-hidden">
                                                    <div className="px-6 py-3 space-y-1 animate-slide-in-left">
                                                        {categoriesLoading ? (
                                                            <div className="px-3 py-2.5 text-sm text-gray-500">
                                                                Đang tải...
                                                            </div>
                                                        ) : postCategories.length === 0 ? (
                                                            <div className="px-3 py-2.5 text-sm text-gray-500">
                                                                Chưa có danh mục nào
                                                            </div>
                                                        ) : (
                                                            postCategories.map((cat) => (
                                                                <Link
                                                                    key={cat.id}
                                                                    href={`/${cat.id}`}
                                                                    onClick={closeMobileMenu}
                                                                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white transition-colors"
                                                                >
                                                                    <span className="material-icons-outlined text-gray-500 text-lg">
                                                                        {cat.icon}
                                                                    </span>
                                                                    <div>
                                                                        <div className="text-sm font-semibold text-gray-900">
                                                                            {cat.name}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 line-clamp-1">
                                                                            {cat.description}
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer (fixed bottom) */}
                    <div className="flex flex-shrink-0 items-center justify-between border-t border-gray-200 px-4 py-4">
                        <Link
                            href="/contact"
                            onClick={closeMobileMenu}
                            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition-colors"
                        >
                            Contact Us
                        </Link>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                                aria-label="X"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-gray-700"
                                >
                                    <path
                                        d="M2.063 2.085a3544.6 3544.6 0 0 0 3.868 5.51c2.112 3.006 3.843 5.485 3.845 5.51.002.024-1.733 2.019-3.856 4.433a605.15 605.15 0 0 0-3.873 4.426c-.008.021.349.036.849.036h.863l3.41-3.879c3.19-3.629 3.415-3.875 3.472-3.807.034.041 1.265 1.786 2.736 3.88L16.052 22h2.958c2.351 0 2.955-.01 2.939-.05-.01-.028-1.814-2.605-4.008-5.728a1061.552 1061.552 0 0 1-4.007-5.723c-.01-.025 1.639-1.929 3.664-4.231a554.409 554.409 0 0 0 3.682-4.207c0-.011-.391-.02-.87-.018l-.87.002-3.195 3.638c-1.757 2-3.208 3.637-3.225 3.637-.016 0-1.179-1.638-2.585-3.639L7.98 2.041H5.008c-2.186-.001-2.965.011-2.945.044m11.283 9.947a2667.13 2667.13 0 0 1 6.214 8.711c0 .01-.606.013-1.346.008l-1.346-.011-6.214-8.692A2667.13 2667.13 0 0 1 4.44 3.337c0-.01.606-.013 1.346-.008l1.345.011 6.215 8.692"
                                        fill="currentColor"
                                        fillRule="evenodd"
                                    />
                                </svg>
                            </button>
                            <button
                                type="button"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                                aria-label="Facebook"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-gray-700"
                                >
                                    <path
                                        d="M11.12 2.039c-2.133.214-3.969.985-5.603 2.354-2.815 2.358-4.105 6.266-3.257 9.867a9.997 9.997 0 0 0 5.36 6.721c.831.404 1.841.736 2.67.877l.15.026V14.88H7.92V12h2.513l.018-1.49c.017-1.329.028-1.528.102-1.838.215-.904.655-1.617 1.266-2.053a3.842 3.842 0 0 1 1.214-.569c.361-.098.447-.105 1.287-.107.654-.002 1.067.018 1.51.073l.61.075V8.56l-.73.001c-.78 0-1.137.05-1.425.196-.336.172-.589.527-.68.955-.027.126-.045.634-.045 1.25V12h1.38c1.289 0 1.38.005 1.378.07-.002.038-.097.682-.212 1.43l-.209 1.36-1.168.011-1.169.01v7.003l.15-.026c.829-.141 1.839-.473 2.67-.877a9.957 9.957 0 0 0 3.936-3.441c3.019-4.518 1.868-10.609-2.596-13.734-1.268-.888-2.651-1.44-4.227-1.687-.584-.092-1.833-.134-2.373-.08"
                                        fill="currentColor"
                                        fillRule="evenodd"
                                    />
                                </svg>
                            </button>
                            <button
                                type="button"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                                aria-label="Instagram"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-gray-700"
                                >
                                    <path
                                        d="M8.6 2.043c-1.853.062-2.705.236-3.715.758-.464.239-.762.459-1.181.869-.954.937-1.449 2.079-1.626 3.75-.03.279-.054 1.635-.066 3.696-.031 5.171.047 6.244.548 7.494.272.678.578 1.143 1.111 1.686.953.972 2.089 1.456 3.829 1.631.725.074 7.932.075 8.8.002 1.004-.084 1.625-.216 2.31-.49.676-.27 1.142-.577 1.686-1.11.972-.953 1.456-2.089 1.631-3.829.074-.725.075-7.932.002-8.8-.084-1.004-.216-1.625-.49-2.31a5.108 5.108 0 0 0-2.893-2.868c-.758-.3-1.504-.423-2.923-.482-1.057-.044-5.682-.042-7.023.003m6.891 1.797c.522.021 1.143.067 1.38.102 1.498.22 2.513 1.008 2.96 2.298.286.822.326 1.412.356 5.12.033 4.226-.032 5.501-.323 6.349-.432 1.264-1.382 2.048-2.796 2.31-.686.127-1.255.148-4.515.169-4.361.028-5.28-.016-6.16-.292-1.334-.418-2.155-1.39-2.413-2.856-.131-.741-.157-1.611-.158-5.24-.002-3.659.018-4.248.161-4.936.231-1.113.791-1.935 1.662-2.439.433-.251 1.207-.462 1.934-.527.96-.087 6.235-.125 7.912-.058m1.626 1.643c-.76.118-1.207.989-.865 1.686.274.556.893.807 1.491.604.268-.091.619-.442.71-.71a1.283 1.283 0 0 0-.214-1.191c-.14-.171-.542-.378-.779-.401a1.604 1.604 0 0 0-.343.012m-5.993 1.461A5.077 5.077 0 0 0 8.379 8.38c-.989.986-1.499 2.217-1.499 3.622 0 1.397.511 2.632 1.499 3.619.599.6 1.202.974 1.994 1.239.553.185 1.021.26 1.627.26a4.983 4.983 0 0 0 3.621-1.499c.991-.99 1.499-2.219 1.499-3.623 0-1.386-.511-2.63-1.479-3.6A6.274 6.274 0 0 0 15 7.834a5.405 5.405 0 0 0-2.16-.892 6.528 6.528 0 0 0-1.716.002m1.548 1.799A3.325 3.325 0 0 1 15.32 12 3.305 3.305 0 0 1 12 15.32a3.312 3.312 0 0 1-3.262-2.678c-.088-.437-.062-1.133.06-1.555A3.38 3.38 0 0 1 11.3 8.746a4.026 4.026 0 0 1 1.372-.003"
                                        fill="currentColor"
                                        fillRule="evenodd"
                                    />
                                </svg>
                        </button>
                            <button
                                type="button"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                                aria-label="YouTube"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-gray-700"
                                >
                                    <path
                                        d="M9.54 5.08c-2.85.061-5.151.244-5.8.461-.703.234-1.311.812-1.565 1.487-.365.972-.588 4.222-.454 6.652.1 1.833.303 3.03.612 3.62.268.511.92 1.028 1.507 1.196 1.134.323 6.211.531 10.547.431 3.666-.084 5.31-.228 6.025-.527a2.562 2.562 0 0 0 1.272-1.168c.675-1.334.849-6.583.311-9.388-.176-.914-.369-1.308-.867-1.769-.517-.478-1.027-.659-2.168-.772-1.911-.188-6.24-.291-9.42-.223m3.175 5.44c1.454.803 2.644 1.469 2.644 1.48-.001.017-5.226 2.916-5.324 2.953C10.015 14.961 10 13.67 10 12c0-1.735.015-2.961.036-2.953.02.007 1.225.67 2.679 1.473"
                                        fill="currentColor"
                                        fillRule="evenodd"
                                    />
                                </svg>
                        </button>
                    </div>
                </div>
                </div>
            </div>
        </header>
    );
};

export default Header;