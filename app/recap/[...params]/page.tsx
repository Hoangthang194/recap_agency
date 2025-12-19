'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Newsletter from '@/components/Newsletter';
import { posts } from '@/data';
import { getPostUrl, findPostBySlugAndDate } from '@/utils/post';

interface PageProps {
  params: Promise<{
    params: string[]
  }>
}

export default function RecapPostPage({ params }: PageProps) {
  // Use React.use() to unwrap the Promise synchronously
  const { params: urlParams } = use(params);
  const router = useRouter();
  
  // Parse URL params: /recap/YYYY/MM/DD/slug
  // urlParams will be ['YYYY', 'MM', 'DD', 'slug'] or ['YYYY', 'MM', 'DD', 'slug', 'part2', ...]
  let foundPost: typeof posts[0] | undefined;
  
  if (urlParams && urlParams.length >= 4) {
    const [year, month, day, ...slugParts] = urlParams;
    // URL slug might be kebab-case (with hyphens), convert to snake_case (with underscores)
    const urlSlug = slugParts.join('-').replace(/-/g, '_');
    foundPost = findPostBySlugAndDate(posts, year, month, day, urlSlug);
  }
  
  // For preview mode, check if first param is 'preview'
  const isPreview = urlParams && urlParams[0] === 'preview';
  
  // Fallback to default post
  if (!foundPost && !isPreview) {
    foundPost = {
      ...posts[0],
      title: "Setting Up for a Great Year",
      category: "Business",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0ekLkhpQK-8g0j3hEdtyM1gSbMbaGAbEjSnhco4PxiSudZTUMA0jkxk8exUhWDinAn8O2O5O2Of-4NzBHTnaoL5rz5oXY_hKqV8Z0qoVE1OwQ-RMeNUdieQkvE0lD0KlyYE7izW_IOAMIVXNlov0Qckr57rj0c0A1oIvNCqah3eHU6e_0N_9afAC6w4LnDsD0QjmMyQMM5YgVhvGkW4ISrYyrfREjlQ8zE91K6venzpVPh0QYNgd1hq-x66NUgp3RYVOBQs6DTYrg",
      thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0ekLkhpQK-8g0j3hEdtyM1gSbMbaGAbEjSnhco4PxiSudZTUMA0jkxk8exUhWDinAn8O2O5O2Of-4NzBHTnaoL5rz5oXY_hKqV8Z0qoVE1OwQ-RMeNUdieQkvE0lD0KlyYE7izW_IOAMIVXNlov0Qckr57rj0c0A1oIvNCqah3eHU6e_0N_9afAC6w4LnDsD0QjmMyQMM5YgVhvGkW4ISrYyrfREjlQ8zE91K6venzpVPh0QYNgd1hq-x66NUgp3RYVOBQs6DTYrg",
      excerpt: "You don't need a plan — just a few thoughts that can support clarity or spark fresh motivation for the journey ahead.",
      slug: 'setting_up_for_a_great_year',
    };
  }
  
  const [post, setPost] = useState(foundPost || posts[0]);
  const [loadedPosts, setLoadedPosts] = useState<typeof posts[0][]>([]);
  const [activeSection, setActiveSection] = useState('introduction');
  const [readingProgress, setReadingProgress] = useState(0);
  const [estimatedReadingTime, setEstimatedReadingTime] = useState(5);
  const [loadedPostsProgress, setLoadedPostsProgress] = useState<{ [key: string]: number }>({});
  const [loadedPostsActiveSection, setLoadedPostsActiveSection] = useState<{ [key: string]: string }>({});
  const [loadedPostsReadingTime, setLoadedPostsReadingTime] = useState<{ [key: string]: number }>({});
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const loadedPostsSectionRefs = useRef<{ [postId: string]: { [key: string]: HTMLElement | null } }>({});
  const endOfPostRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  // Calculate reading time based on content length
  const calculateReadingTime = (element: HTMLElement | null): number => {
    if (!element) return 5;
    const text = element.innerText || element.textContent || '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const minutes = Math.ceil(words / 200);
    return Math.max(1, minutes);
  };

  // Update post when params change (support preview mode)
  useEffect(() => {
    let finalPost = foundPost || posts[0];

    // Nếu là chế độ preview từ admin, lấy dữ liệu tạm trong sessionStorage
    if (isPreview && typeof window !== 'undefined') {
      const stored = window.sessionStorage.getItem('postPreview')
      if (stored && stored.trim().startsWith('{')) {
        try {
          const draft = JSON.parse(stored) as Partial<typeof foundPost> & { contentHtml?: string }
          finalPost = {
            ...posts[0],
            ...draft,
          }
          setPreviewHtml(draft.contentHtml ?? null)
        } catch {
          window.sessionStorage.removeItem('postPreview')
          setPreviewHtml(null)
        }
      } else {
        window.sessionStorage.removeItem('postPreview')
        setPreviewHtml(null)
      }
    } else {
      setPreviewHtml(null)
    }

    setPost(finalPost);
    setLoadedPosts([]);
    
    setTimeout(() => {
      if (contentRef.current) {
        const time = calculateReadingTime(contentRef.current);
        setEstimatedReadingTime(time);
      }
    }, 100);
  }, [urlParams?.join('/')]);

  // Redirect to 404 if post not found
  useEffect(() => {
    if (!foundPost && !isPreview && urlParams && urlParams.length >= 4) {
      router.push('/404');
    }
  }, [foundPost, isPreview, urlParams, router]);

  // Scroll handler and other logic similar to app/post/[id]/page.tsx
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const windowHeight = window.innerHeight;
          const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
          
          const mainContent = contentRef.current;
          if (mainContent) {
            const contentRect = mainContent.getBoundingClientRect();
            const contentHeight = mainContent.offsetHeight;
            const contentOffsetTop = contentRect.top + scrollTop;
            const scrollableHeight = contentHeight - windowHeight;
            
            if (scrollableHeight > 0) {
              const relativeScroll = Math.max(0, Math.min(scrollTop - contentOffsetTop, scrollableHeight));
              const progressPercent = (relativeScroll / scrollableHeight) * 100;
              setReadingProgress(Math.min(100, Math.max(0, progressPercent)));
            } else {
              setReadingProgress(0);
            }
          } else {
            // Fallback to document-based calculation
            const documentHeight = document.documentElement.scrollHeight;
            const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
            setReadingProgress(Math.min(100, Math.max(0, progress)));
          }

          // Find active section from TOC items
          let currentSection = tocItems.length > 0 ? tocItems[0].id : '';
          
          tocItems.forEach((item) => {
            const element = sectionRefs.current[item.id];
            if (element) {
              const rect = element.getBoundingClientRect();
              if (rect.top <= 200) {
                currentSection = item.id;
              }
            }
          });

          setActiveSection(currentSection);

          // Calculate progress and active section for each loaded post
          loadedPosts.forEach((loadedPost, postIndex) => {
            const postSectionRefs = loadedPostsSectionRefs.current[loadedPost.id] || {};
            // Parse headings for this loaded post
            const loadedPostTocItems = loadedPost.content ? parseHeadingsFromContent(loadedPost.content) : [];
            
            let currentPostSection = loadedPostTocItems.length > 0 ? loadedPostTocItems[0].id : '';
            loadedPostTocItems.forEach((item) => {
              const element = postSectionRefs[item.id];
              if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= 200) {
                  currentPostSection = item.id;
                }
              }
            });
            
            setLoadedPostsActiveSection(prev => ({
              ...prev,
              [loadedPost.id]: currentPostSection
            }));

            // Calculate progress for this loaded post
            const postContentElement = document.querySelector(`[data-post-id="${loadedPost.id}"]`) as HTMLElement;
            if (postContentElement) {
              const contentRect = postContentElement.getBoundingClientRect();
              const contentHeight = postContentElement.offsetHeight;
              const contentOffsetTop = contentRect.top + scrollTop;
              const scrollableHeight = contentHeight - windowHeight;
              
              // Check if post is in viewport or has been scrolled past
              const isPostInViewport = contentRect.bottom > 0 && contentRect.top < windowHeight;
              const isPostScrolledPast = contentRect.bottom <= 0;
              const isPostBelowViewport = contentRect.top >= windowHeight;
              
              if (scrollableHeight > 0) {
                if (isPostInViewport || isPostScrolledPast) {
                  // Calculate relative scroll position
                  const relativeScroll = Math.max(0, Math.min(scrollTop - contentOffsetTop, scrollableHeight));
                  const progressPercent = (relativeScroll / scrollableHeight) * 100;
                  setLoadedPostsProgress(prev => ({
                    ...prev,
                    [loadedPost.id]: Math.min(100, Math.max(0, progressPercent))
                  }));
                } else if (isPostBelowViewport) {
                  // Post is below viewport (not scrolled to yet), reset progress to 0
                  setLoadedPostsProgress(prev => {
                    const current = prev[loadedPost.id];
                    if (current !== undefined && current > 0) {
                      return {
                        ...prev,
                        [loadedPost.id]: 0
                      };
                    }
                    return prev;
                  });
                }
              } else {
                // Content is shorter than viewport, no progress
                setLoadedPostsProgress(prev => ({
                  ...prev,
                  [loadedPost.id]: 0
                }));
              }
            }
          });

          // Check if reached end of any loaded post to load next post
          endOfPostRefs.current.forEach((ref, index) => {
            if (ref) {
              const rect = ref.getBoundingClientRect();
              // Load next post when user is 500px away from end
              if (rect.top <= windowHeight + 500) {
                const currentIndex = posts.findIndex(p => p.id === post.id);
                const loadedCount = loadedPosts.length;
                const nextPostIndex = currentIndex + loadedCount + 1;
                
                // Only load if not already loaded and post exists
                if (nextPostIndex < posts.length && loadedCount === index) {
                  const nextPost = posts[nextPostIndex];
                  setLoadedPosts(prev => [...prev, nextPost]);
                  // Initialize section refs for new post
                  loadedPostsSectionRefs.current[nextPost.id] = {};
                  
                  // Calculate reading time for loaded post after render
                  setTimeout(() => {
                    const postContentElement = document.querySelector(`[data-post-id="${nextPost.id}"]`);
                    if (postContentElement) {
                      const time = calculateReadingTime(postContentElement as HTMLElement);
                      setLoadedPostsReadingTime(prev => ({
                        ...prev,
                        [nextPost.id]: time
                      }));
                      
                      // Set up section refs for loaded post headings
                      if (nextPost.content) {
                        const loadedPostTocItems = parseHeadingsFromContent(nextPost.content);
                        loadedPostTocItems.forEach((item) => {
                          const element = document.getElementById(item.id) || document.querySelector(`[data-heading-id="${item.id}"]`);
                          if (element && !loadedPostsSectionRefs.current[nextPost.id]) {
                            loadedPostsSectionRefs.current[nextPost.id] = {};
                          }
                          if (element) {
                            loadedPostsSectionRefs.current[nextPost.id][item.id] = element as HTMLElement;
                          }
                        });
                      }
                    }
                  }, 200);
                }
              }
            }
          });

          // Update URL based on which post is currently in viewport
          const viewportCenter = windowHeight / 2;
          let activePostId = post.id;
          let maxVisibleArea = 0;

          // Check main post visibility
          if (mainContent) {
            const contentRect = mainContent.getBoundingClientRect();
            const visibleTop = Math.max(0, -contentRect.top);
            const visibleBottom = Math.min(contentRect.height, windowHeight - contentRect.top);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const visibleArea = visibleHeight * (contentRect.width || 0);
            
            if (visibleArea > maxVisibleArea && contentRect.top < viewportCenter && contentRect.bottom > viewportCenter) {
              maxVisibleArea = visibleArea;
              activePostId = post.id;
            }
          }

          // Check loaded posts visibility
          loadedPosts.forEach((loadedPost) => {
            const postContentElement = document.querySelector(`[data-post-id="${loadedPost.id}"]`) as HTMLElement;
            if (postContentElement) {
              const contentRect = postContentElement.getBoundingClientRect();
              const visibleTop = Math.max(0, -contentRect.top);
              const visibleBottom = Math.min(contentRect.height, windowHeight - contentRect.top);
              const visibleHeight = Math.max(0, visibleBottom - visibleTop);
              const visibleArea = visibleHeight * (contentRect.width || 0);
              
              if (visibleArea > maxVisibleArea && contentRect.top < viewportCenter && contentRect.bottom > viewportCenter) {
                maxVisibleArea = visibleArea;
                activePostId = loadedPost.id;
              }
            }
          });

          // Update URL if different from current (using replaceState to avoid re-render)
          if (activePostId !== post.id && activePostId !== 'preview' && typeof window !== 'undefined') {
            const activePost = posts.find(p => p.id === activePostId);
            if (activePost) {
              const newUrl = getPostUrl(activePost);
              if (window.location.pathname !== newUrl) {
                window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
              }
            }
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [post, loadedPosts]);

  // Parse headings from HTML content to generate TOC dynamically
  const parseHeadingsFromContent = (htmlContent: string): Array<{ id: string; label: string; level: number }> => {
    if (!htmlContent) return [];
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const headings = doc.querySelectorAll('h2, h3');
    const tocItems: Array<{ id: string; label: string; level: number }> = [];
    
    headings.forEach((heading, index) => {
      const text = heading.textContent || '';
      const level = heading.tagName === 'H2' ? 2 : 3;
      // Generate ID from heading text (convert to kebab-case)
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `heading-${index}`;
      
      tocItems.push({ id, label: text, level });
    });
    
    return tocItems;
  };

  // Generate TOC items from post content
  const [tocItems, setTocItems] = useState<Array<{ id: string; label: string; level: number }>>([]);
  
  useEffect(() => {
    if (post.content) {
      const items = parseHeadingsFromContent(post.content);
      setTocItems(items);
      
      // Set up section refs for scroll tracking
      items.forEach((item) => {
        if (!sectionRefs.current[item.id]) {
          sectionRefs.current[item.id] = null;
        }
      });
      
      // After content is rendered, find and set refs for headings
      setTimeout(() => {
        items.forEach((item) => {
          const element = document.getElementById(item.id) || document.querySelector(`[data-heading-id="${item.id}"]`);
          if (element) {
            sectionRefs.current[item.id] = element as HTMLElement;
          }
        });
      }, 100);
    } else {
      setTocItems([]);
    }
  }, [post.content]);

  // Update sections array for scroll tracking
  const sections = tocItems.map(item => item.id);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const currentIndex = posts.findIndex(p => p.id === post.id);

  if (!foundPost && !isPreview) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-500 mb-8">Post not found</p>
          <Link href="/" className="text-primary hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm font-medium text-gray-500">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2 text-gray-300">/</span>
          <Link href="/categories" className="hover:text-primary transition-colors">{post.category}</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-900 truncate max-w-[200px]">{post.title}</span>
        </nav>

        <header className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Column - Title, Excerpt, Author */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex gap-3 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-primary border border-blue-100">
                  <span className="material-icons-outlined text-sm mr-1">trending_up</span> {post.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
                {post.title}
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed mb-8">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between border-t border-b border-gray-100 py-6 mt-auto">
                <div className="flex items-center gap-4">
                  <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-gray-900">{post.author.name}</p>
                    <div className="flex items-center text-xs text-gray-500 font-medium gap-3">
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="material-icons-outlined text-sm">schedule</span>
                  <span>{estimatedReadingTime} min read</span>
                </div>
              </div>
            </div>

            {/* Right Column - Thumbnail */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                <img src={post.thumbnail || post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        <div className={`grid grid-cols-1 ${post.content ? 'lg:grid-cols-12' : 'lg:grid-cols-1'} gap-12`}>
          {/* Left Sidebar - Table of Contents */}
          {post.content && (
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-28 space-y-6">
                <div className="bg-white rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-icons-outlined text-sm text-gray-400">schedule</span>
                    <span className="text-xs font-bold text-gray-900">
                      {estimatedReadingTime} min read
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${readingProgress}%` }}
                    ></div>
                  </div>
                </div>

                {tocItems.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Contents</h4>
                    <nav className="space-y-4 border-l border-gray-100 pl-4">
                      {tocItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`block text-sm text-left w-full transition-colors ${
                            activeSection === item.id
                              ? 'font-bold text-primary border-l-2 border-primary -ml-[17px] pl-4'
                              : 'text-gray-500 hover:text-primary'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </nav>
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* Main Content */}
          <div ref={contentRef} className={`col-span-1 ${post.content ? 'lg:col-span-6' : 'lg:col-span-12'} prose prose-lg prose-blue max-w-none`}>
            {isPreview && previewHtml ? (
              <div
                className="prose prose-lg prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : post.content ? (
              <div
                className="prose prose-lg prose-blue max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: post.content.replace(
                    /<(h[2-3])([^>]*)>([^<]+)<\/h[2-3]>/gi,
                    (match, tag, attrs, text) => {
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-+|-+$/g, '');
                      return `<${tag}${attrs} id="${id}" data-heading-id="${id}">${text}</${tag}>`;
                    }
                  )
                }}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nội dung bài viết đang được cập nhật...</p>
              </div>
            )}
            
            {/* Post Footer - Metadata, Share, Navigation */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              {/* Metadata */}
              <div className="flex items-center gap-4 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-primary border border-blue-100">
                  <span className="material-icons-outlined text-sm mr-1">trending_up</span> {post.category}
                </span>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="material-icons-outlined text-sm">visibility</span>
                  <span>132</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="material-icons-outlined text-sm">comment</span>
                  <span>0</span>
                </div>
              </div>

              {/* Update Date */}
              <p className="text-sm text-gray-500 mb-8">Updated on {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</p>

              {/* Share Section */}
              <div className="mb-8">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">SHARE</h4>
                <div className="flex items-center gap-3">
                  <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </button>
                  <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-colors">
                    <span className="material-icons-outlined text-sm">link</span>
                  </button>
                </div>
              </div>

              {/* Prev/Next Navigation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {currentIndex > 0 && (
                  <Link href={getPostUrl(posts[currentIndex - 1])} className="relative rounded-xl overflow-hidden aspect-[3/2] group hover:opacity-90 transition-opacity">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img src={posts[currentIndex - 1].image} alt={posts[currentIndex - 1].title} className="w-full h-full object-cover" style={{ minHeight: '100%', minWidth: '100%', objectPosition: 'center center' }} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 flex items-end p-4">
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white/80 uppercase mb-1">Prev</p>
                          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-2">{posts[currentIndex - 1].title}</p>
                        </div>
                        <span className="material-icons-outlined text-white group-hover:text-primary transition-colors shrink-0">arrow_back</span>
                      </div>
                    </div>
                  </Link>
                )}
                {currentIndex < posts.length - 1 && (
                  <Link href={getPostUrl(posts[currentIndex + 1])} className="relative rounded-xl overflow-hidden aspect-[3/2] group hover:opacity-90 transition-opacity">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img src={posts[currentIndex + 1].image} alt={posts[currentIndex + 1].title} className="w-full h-full object-cover" style={{ minHeight: '100%', minWidth: '100%', objectPosition: 'center center' }} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 flex items-end p-4">
                      <div className="flex items-center gap-3 w-full">
                        <span className="material-icons-outlined text-white group-hover:text-primary transition-colors shrink-0">arrow_forward</span>
                        <div className="flex-1 min-w-0 text-right">
                          <p className="text-xs font-bold text-white/80 uppercase mb-1">Next</p>
                          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-2">{posts[currentIndex + 1].title}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
            
            {/* End of post marker for auto-load */}
            <div ref={(el) => { endOfPostRefs.current[0] = el; }} className="h-1" />
          </div>

          {/* Right Sidebar - Spotlight + Banner */}
          <aside className="col-span-1 lg:col-span-3">
            {/* Spotlight - Not Sticky */}
            <div className="mb-8 animate-slide-in-right animate-delay-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Spotlight</h4>
              <div className="space-y-6">
                {posts.slice(0, 4).map((spotlightPost) => (
                  <Link href={getPostUrl(spotlightPost)} key={spotlightPost.id} className="flex gap-4 group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <img src={spotlightPost.image} alt={spotlightPost.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-icons-outlined text-xs text-gray-400">{spotlightPost.category === 'Business' ? 'work' : spotlightPost.category === 'Sport' ? 'sports_soccer' : spotlightPost.category === 'Education' ? 'school' : 'computer'}</span>
                        <span className="text-[10px] font-bold text-primary uppercase">{spotlightPost.category}</span>
                      </div>
                      <h5 className="text-xs font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-1">{spotlightPost.title}</h5>
                      <span className="text-[10px] text-gray-400">{spotlightPost.date}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Sticky Banner */}
            {post.sidebarBanner && (
              <div className="sticky top-28 animate-slide-in-right animate-delay-200">
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer">
                  <div className="absolute inset-0 z-0" style={{ backgroundColor: post.sidebarBanner.backgroundColor || '#4c1d95' }}></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40 z-10"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-20">
                    <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-4">{post.sidebarBanner.badge}</span>
                    <h3 className="text-2xl font-black text-white mb-2 whitespace-pre-line">{post.sidebarBanner.title}</h3>
                    <p className="text-white/70 text-xs mb-8">{post.sidebarBanner.description}</p>
                    {post.sidebarBanner.buttonLink ? (
                      <Link href={post.sidebarBanner.buttonLink} className="bg-primary hover:bg-blue-600 text-white text-xs font-bold py-3 px-6 rounded-xl shadow-lg transition-colors w-full">
                        {post.sidebarBanner.buttonText}
                      </Link>
                    ) : (
                      <button className="bg-primary hover:bg-blue-600 text-white text-xs font-bold py-3 px-6 rounded-xl shadow-lg transition-colors w-full">{post.sidebarBanner.buttonText}</button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* READ NEXT Section - Full Width (Outside Grid) */}
        <div className="mt-20 pt-10 border-t border-gray-100">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">READ NEXT</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts
              .filter(p => p.id !== post.id)
              .slice(0, 3)
              .map((relatedPost) => (
                <Link href={getPostUrl(relatedPost)} key={relatedPost.id} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <div className="rounded-2xl overflow-hidden aspect-[3/2] mb-4">
                      <img src={relatedPost.image} alt={relatedPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-primary uppercase">{relatedPost.category}</span>
                        {relatedPost.category !== 'Tech' && (
                          <>
                            <span className="w-px h-3 bg-gray-200"></span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Tech</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-primary transition-colors">{relatedPost.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-4">{relatedPost.excerpt}</p>
                      <div className="flex items-center gap-2">
                        <img src={relatedPost.author.avatar} className="w-5 h-5 rounded-full" alt={relatedPost.author.name} />
                        <span className="text-[10px] font-bold text-gray-900">{relatedPost.author.name}</span>
                        <span className="text-[10px] text-gray-400 ml-auto">{relatedPost.date}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Auto Load Next Posts - Infinite Scroll */}
        {loadedPosts.map((loadedPost, index) => {
          return (
            <div 
              key={`loaded-post-${loadedPost.id}-${index}`}
              data-loaded-post={loadedPost.id}
              className="mt-20 pt-10 border-t border-gray-100 animate-slide-up"
            >
              <header className="mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                  {/* Left Column - Title, Excerpt, Author */}
                  <div className="lg:col-span-7 flex flex-col">
                    <div className="flex gap-3 mb-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-primary border border-blue-100">
                        <span className="material-icons-outlined text-sm mr-1">trending_up</span> {loadedPost.category}
                      </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
                      {loadedPost.title}
                    </h1>
                    <p className="text-xl text-gray-500 leading-relaxed mb-8">
                      {loadedPost.excerpt}
                    </p>

                    <div className="flex items-center justify-between border-t border-b border-gray-100 py-6 mt-auto">
                      <div className="flex items-center gap-4">
                        <img src={loadedPost.author.avatar} alt={loadedPost.author.name} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-gray-900">{loadedPost.author.name}</p>
                          <div className="flex items-center text-xs text-gray-500 font-medium gap-3">
                            <span>{loadedPost.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span className="material-icons-outlined text-sm">schedule</span>
                        <span>{loadedPostsReadingTime[loadedPost.id] || estimatedReadingTime} min read</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Thumbnail */}
                  <div className="lg:col-span-5 flex flex-col">
                    <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                      <img src={loadedPost.thumbnail || loadedPost.image} alt={loadedPost.title} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </header>

              <div className={`grid grid-cols-1 ${loadedPost.content ? 'lg:grid-cols-12' : 'lg:grid-cols-1'} gap-12`}>
                {/* Left Sidebar - Table of Contents */}
                {loadedPost.content && (
                  <aside className="hidden lg:block lg:col-span-3">
                    <div className="sticky top-28 space-y-6">
                      {/* Reading Progress */}
                      <div className="bg-white rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="material-icons-outlined text-sm text-gray-400">schedule</span>
                          <span className="text-xs font-bold text-gray-900">
                            {loadedPostsReadingTime[loadedPost.id] || estimatedReadingTime} min read
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${loadedPostsProgress[loadedPost.id] || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Table of Contents - Parse from loaded post content */}
                      {(() => {
                        const loadedPostTocItems = loadedPost.content ? parseHeadingsFromContent(loadedPost.content) : [];
                        return loadedPostTocItems.length > 0 ? (
                          <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Contents</h4>
                            <nav className="space-y-4 border-l border-gray-100 pl-4">
                              {loadedPostTocItems.map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => {
                                    const element = loadedPostsSectionRefs.current[loadedPost.id]?.[item.id];
                                    if (element) {
                                      const headerOffset = 100;
                                      const elementPosition = element.getBoundingClientRect().top;
                                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                      window.scrollTo({
                                        top: offsetPosition,
                                        behavior: 'smooth'
                                      });
                                    }
                                  }}
                                  className={`block text-sm text-left w-full transition-colors ${
                                    loadedPostsActiveSection[loadedPost.id] === item.id
                                      ? 'font-bold text-primary border-l-2 border-primary -ml-[17px] pl-4'
                                      : 'text-gray-500 hover:text-primary'
                                  }`}
                                >
                                  {item.label}
                                </button>
                              ))}
                            </nav>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </aside>
                )}

                {/* Main Content - Full Post */}
                <div data-post-id={loadedPost.id} className={`col-span-1 ${loadedPost.content ? 'lg:col-span-6' : 'lg:col-span-12'} prose prose-lg prose-blue max-w-none`}>
                  {loadedPost.content ? (
                    <div
                      className="prose prose-lg prose-blue max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: loadedPost.content.replace(
                          /<(h[2-3])([^>]*)>([^<]+)<\/h[2-3]>/gi,
                          (match, tag, attrs, text) => {
                            const id = text
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, '-')
                              .replace(/^-+|-+$/g, '');
                            return `<${tag}${attrs} id="${id}" data-heading-id="${id}">${text}</${tag}>`;
                          }
                        )
                      }}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">Nội dung bài viết đang được cập nhật...</p>
                    </div>
                  )}
                  
                  {/* Post Footer */}
                  <div className="mt-12 pt-8 border-t border-gray-100">
                    {/* Metadata */}
                    <div className="flex items-center gap-4 mb-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-primary border border-blue-100">
                        <span className="material-icons-outlined text-sm mr-1">trending_up</span> {loadedPost.category}
                      </span>
                    </div>

                    {/* Update Date */}
                    <p className="text-sm text-gray-500 mb-8">Updated on {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</p>

                    {/* Prev/Next Navigation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {(() => {
                        const loadedPostIndex = posts.findIndex(p => p.id === loadedPost.id);
                        const hasPrev = loadedPostIndex > 0;
                        const hasNext = loadedPostIndex < posts.length - 1;
                        return (
                          <>
                            {hasPrev && (
                              <Link href={getPostUrl(posts[loadedPostIndex - 1])} className="relative rounded-xl overflow-hidden aspect-[3/2] group hover:opacity-90 transition-opacity">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <img src={posts[loadedPostIndex - 1].image} alt={posts[loadedPostIndex - 1].title} className="w-full h-full object-cover" style={{ minHeight: '100%', minWidth: '100%', objectPosition: 'center center' }} />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                                <div className="absolute inset-0 flex items-end p-4">
                                  <div className="flex items-center gap-3 w-full">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold text-white/80 uppercase mb-1">Prev</p>
                                      <p className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-2">{posts[loadedPostIndex - 1].title}</p>
                                    </div>
                                    <span className="material-icons-outlined text-white group-hover:text-primary transition-colors shrink-0">arrow_back</span>
                                  </div>
                                </div>
                              </Link>
                            )}
                            {hasNext && (
                              <Link href={getPostUrl(posts[loadedPostIndex + 1])} className="relative rounded-xl overflow-hidden aspect-[3/2] group hover:opacity-90 transition-opacity">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <img src={posts[loadedPostIndex + 1].image} alt={posts[loadedPostIndex + 1].title} className="w-full h-full object-cover" style={{ minHeight: '100%', minWidth: '100%', objectPosition: 'center center' }} />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                                <div className="absolute inset-0 flex items-end p-4">
                                  <div className="flex items-center gap-3 w-full">
                                    <span className="material-icons-outlined text-white group-hover:text-primary transition-colors shrink-0">arrow_forward</span>
                                    <div className="flex-1 min-w-0 text-right">
                                      <p className="text-xs font-bold text-white/80 uppercase mb-1">Next</p>
                                      <p className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-2">{posts[loadedPostIndex + 1].title}</p>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  
                  {/* End marker for this loaded post */}
                  <div ref={(el) => { endOfPostRefs.current[index + 1] = el; }} className="h-1" />
                </div>

                {/* Right Sidebar */}
                <aside className="col-span-1 lg:col-span-3">
                  <div className="mb-8">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Spotlight</h4>
                    <div className="space-y-6">
                      {posts.slice(0, 4).map((spotlightPost) => (
                        <Link href={getPostUrl(spotlightPost)} key={spotlightPost.id} className="flex gap-4 group">
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                            <img src={spotlightPost.image} alt={spotlightPost.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="flex flex-col justify-center flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="material-icons-outlined text-xs text-gray-400">{spotlightPost.category === 'Business' ? 'work' : spotlightPost.category === 'Sport' ? 'sports_soccer' : spotlightPost.category === 'Education' ? 'school' : 'computer'}</span>
                              <span className="text-[10px] font-bold text-primary uppercase">{spotlightPost.category}</span>
                            </div>
                            <h5 className="text-xs font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-1">{spotlightPost.title}</h5>
                            <span className="text-[10px] text-gray-400">{spotlightPost.date}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  {/* Sticky Banner for loaded post */}
                  {loadedPost.sidebarBanner && (
                    <div className="sticky top-28 animate-slide-in-right animate-delay-200">
                      <div className="relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer">
                        <div className="absolute inset-0 z-0" style={{ backgroundColor: loadedPost.sidebarBanner.backgroundColor || '#4c1d95' }}></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40 z-10"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-20">
                          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-4">{loadedPost.sidebarBanner.badge}</span>
                          <h3 className="text-2xl font-black text-white mb-2 whitespace-pre-line">{loadedPost.sidebarBanner.title}</h3>
                          <p className="text-white/70 text-xs mb-8">{loadedPost.sidebarBanner.description}</p>
                          {loadedPost.sidebarBanner.buttonLink ? (
                            <Link href={loadedPost.sidebarBanner.buttonLink} className="bg-primary hover:bg-blue-600 text-white text-xs font-bold py-3 px-6 rounded-xl shadow-lg transition-colors w-full">
                              {loadedPost.sidebarBanner.buttonText}
                            </Link>
                          ) : (
                            <button className="bg-primary hover:bg-blue-600 text-white text-xs font-bold py-3 px-6 rounded-xl shadow-lg transition-colors w-full">{loadedPost.sidebarBanner.buttonText}</button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </aside>
              </div>
            </div>
          );
        })}
      </div>
      <Newsletter />
    </div>
  )
}

