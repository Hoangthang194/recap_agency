'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Newsletter from '@/components/Newsletter';
import { usePosts } from '@/hooks';
import { getPostUrl, parseDate } from '@/utils/post';

interface PageProps {
  params: Promise<{
    params: string[]
  }>
}

export default function RecapPostPage({ params }: PageProps) {
  // Use React.use() to unwrap the Promise synchronously
  const { params: urlParams } = use(params);
  const router = useRouter();
  const { posts, post: singlePost, loading: postsLoading, fetchPosts, getPostBySlug } = usePosts();
  
  // Track if posts have been fetched (for spotlight and navigation)
  const hasFetchedPosts = useRef(false);
  
  // Fetch posts on mount (only once) - for spotlight and navigation
  useEffect(() => {
    if (!hasFetchedPosts.current && !postsLoading) {
      hasFetchedPosts.current = true;
      fetchPosts();
    }
  }, [postsLoading, fetchPosts]);
  
  // For preview mode, check if first param is 'preview'
  const isPreview = urlParams && urlParams[0] === 'preview';
  
  // Parse URL params and fetch post by slug
  const [foundPost, setFoundPost] = useState<typeof singlePost>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchingPost, setSearchingPost] = useState(false);
  
  // Fetch post by slug when URL params change
  useEffect(() => {
    if (!urlParams || urlParams.length < 4) {
      setFoundPost(null);
      setHasSearched(true);
      return;
    }
    
    const [year, month, day, ...slugParts] = urlParams;
    // URL slug is kebab-case (e.g., "ha-long-bay-travel-guide")
    // Post slug in database is also kebab-case (e.g., "ha-long-bay-travel-guide")
    // Keep slug as kebab-case for API call
    const urlSlug = slugParts.join('-');
    
    console.log('🔍 Fetching post by slug:', { 
      year, 
      month, 
      day, 
      urlSlug, 
      originalUrlSlug: slugParts.join('-'),
      urlParams: urlParams.join('/')
    });
    
    setSearchingPost(true);
    setHasSearched(false);
    
    getPostBySlug(urlSlug)
      .then((post) => {
        if (post) {
          // Verify date matches URL (parse date string like "Aug 8, 2025")
          const postDate = parseDate(post.date);
          const urlDate = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day)
          );
          
          const dateMatch = 
            postDate.getFullYear() === urlDate.getFullYear() &&
            postDate.getMonth() === urlDate.getMonth() &&
            postDate.getDate() === urlDate.getDate();
          
          if (dateMatch) {
            setFoundPost(post);
          } else {

            setFoundPost(null);
          }
        } else {
          setFoundPost(null);
        }
        setHasSearched(true);
        setSearchingPost(false);
      })
      .catch((error) => {
        setFoundPost(null);
        setHasSearched(true);
        setSearchingPost(false);
      });
  }, [urlParams, getPostBySlug]);
  
  const [post, setPost] = useState<(typeof posts)[0] | null>(null);
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
  const loadingPostsRef = useRef<Set<string>>(new Set()); // Track posts being loaded to prevent duplicates

  // Calculate reading time based on content length
  const calculateReadingTime = (element: HTMLElement | null): number => {
    if (!element) return 5;
    const text = element.innerText || element.textContent || '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const minutes = Math.ceil(words / 200);
    return Math.max(1, minutes);
  };

  // Update post when foundPost changes (support preview mode)
  useEffect(() => {
    let finalPost = foundPost;

    // Nếu là chế độ preview từ admin, lấy dữ liệu tạm trong sessionStorage
    if (isPreview && typeof window !== 'undefined') {
      const stored = window.sessionStorage.getItem('postPreview')
      if (stored && stored.trim().startsWith('{')) {
        try {
          const draft = JSON.parse(stored) as Partial<typeof foundPost> & { contentHtml?: string }
          if (foundPost) {
            finalPost = {
              ...foundPost,
              ...draft,
            } as typeof foundPost
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

    if (finalPost) {
      setPost(finalPost);
      setLoadedPosts([]);
      loadingPostsRef.current.clear(); // Clear loading tracking when post changes
      
      setTimeout(() => {
        if (contentRef.current) {
          const time = calculateReadingTime(contentRef.current);
          setEstimatedReadingTime(time);
        }
      }, 100);
    } else {
      setPost(null);
    }
  }, [foundPost, isPreview]);


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

          // Find active section from actual headings in content
          let currentSection = '';
          let maxTop = -Infinity;
          
          // Get all headings from TOC items or find them dynamically
          let headings = Object.keys(sectionRefs.current);
          
          // Always refresh headings from DOM to ensure we have the latest
          if (mainContent) {
            const headingElements = mainContent.querySelectorAll('h2, h3, h4');
            headingElements.forEach((heading) => {
              const element = heading as HTMLElement;
              let id = element.id;
              if (!id) {
                const text = element.textContent || '';
                id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                element.id = id;
              }
              sectionRefs.current[id] = element;
              if (!headings.includes(id)) {
                headings.push(id);
              }
            });
          }
          
          // If still no headings, use TOC items
          if (headings.length === 0 && tocItems.length > 0) {
            headings = tocItems.map(item => item.id);
          }
          
          headings.forEach((sectionId) => {
            let element = sectionRefs.current[sectionId];
            
            // If ref not found, try querySelector as fallback
            if (!element && mainContent) {
              element = mainContent.querySelector(`#${sectionId}`) as HTMLElement;
              if (element) {
                sectionRefs.current[sectionId] = element;
              }
            }
            
            // Last resort: try document.getElementById
            if (!element) {
              element = document.getElementById(sectionId) as HTMLElement;
              if (element) {
                sectionRefs.current[sectionId] = element;
              }
            }
            
            if (element) {
              const rect = element.getBoundingClientRect();
              // Section is active if it's above 200px from top of viewport
              // We want the section that's closest to but above 200px
              if (rect.top <= 200 && rect.top > maxTop) {
                maxTop = rect.top;
                currentSection = sectionId;
              }
            }
          });
          
          // If no section found above threshold, use the first visible one
          if (!currentSection && headings.length > 0) {
            headings.forEach((sectionId) => {
              const element = sectionRefs.current[sectionId] || 
                             (mainContent?.querySelector(`#${sectionId}`) as HTMLElement) ||
                             (document.getElementById(sectionId) as HTMLElement);
              if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top >= 0 && rect.top <= windowHeight && !currentSection) {
                  currentSection = sectionId;
                }
              }
            });
          }
          
          // Fallback to first heading if still no section
          if (!currentSection && headings.length > 0) {
            currentSection = headings[0];
          }

          if (currentSection) {
            setActiveSection(currentSection);
          }

          // Calculate progress and active section for each loaded post
          loadedPosts.forEach((loadedPost, postIndex) => {
            const postContentElement = document.querySelector(`[data-post-slug="${loadedPost.slug}"]`) as HTMLElement;
            const postSectionRefs = loadedPostsSectionRefs.current[loadedPost.slug] || {};
            // Parse headings for this loaded post
            const loadedPostTocItems = loadedPost.content ? parseHeadingsFromContent(loadedPost.content) : [];
            
            let currentPostSection = '';
            let maxPostTop = -Infinity;
            
            // Get all headings from this post's refs
            const postHeadings = Object.keys(postSectionRefs);
            
            // If no refs yet, find headings directly
            if (postHeadings.length === 0 && postContentElement) {
              const headingElements = postContentElement.querySelectorAll('h2, h3, h4');
              headingElements.forEach((heading) => {
                const element = heading as HTMLElement;
                let id = element.id;
                if (!id) {
                  const text = element.textContent || '';
                  id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                  element.id = id;
                }
                if (!loadedPostsSectionRefs.current[loadedPost.slug]) {
                  loadedPostsSectionRefs.current[loadedPost.slug] = {};
                }
                loadedPostsSectionRefs.current[loadedPost.slug][id] = element;
                postHeadings.push(id);
              });
            }
            
            postHeadings.forEach((sectionId) => {
              // Try ref first
              let element = postSectionRefs[sectionId];
              
              // If ref not found, try querySelector as fallback
              if (!element && postContentElement) {
                element = postContentElement.querySelector(`#${sectionId}`) as HTMLElement;
                if (element) {
                  if (!loadedPostsSectionRefs.current[loadedPost.slug]) {
                    loadedPostsSectionRefs.current[loadedPost.slug] = {};
                  }
                  loadedPostsSectionRefs.current[loadedPost.slug][sectionId] = element;
                }
              }
              
              if (element) {
                const rect = element.getBoundingClientRect();
                // Section is active if it's above 200px from top of viewport
                if (rect.top <= 200 && rect.top > maxPostTop) {
                  maxPostTop = rect.top;
                  currentPostSection = sectionId;
                }
              }
            });
            
            // Fallback to first heading if no section found
            if (!currentPostSection && postHeadings.length > 0) {
              currentPostSection = postHeadings[0];
            }
            
            setLoadedPostsActiveSection(prev => ({
              ...prev,
              [loadedPost.slug]: currentPostSection
            }));

            // Calculate progress for this loaded post
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
                    [loadedPost.slug]: Math.min(100, Math.max(0, progressPercent))
                  }));
                } else if (isPostBelowViewport) {
                  // Post is below viewport (not scrolled to yet), reset progress to 0
                  setLoadedPostsProgress(prev => {
                    const current = prev[loadedPost.slug];
                    if (current !== undefined && current > 0) {
                      return {
                        ...prev,
                        [loadedPost.slug]: 0
                      };
                    }
                    return prev;
                  });
                }
              } else {
                // Content is shorter than viewport, no progress
                setLoadedPostsProgress(prev => ({
                  ...prev,
                  [loadedPost.slug]: 0
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
                const currentIndex = posts.findIndex(p => p.slug === post.slug);
                const loadedCount = loadedPosts.length;
                const nextPostIndex = currentIndex + loadedCount + 1;
                
                // Only load if not already loaded and post exists
                if (nextPostIndex < posts.length && loadedCount === index) {
                  const nextPost = posts[nextPostIndex];
                  
                  // Check if this post is already loaded, is the current post, or is being loaded
                  const isAlreadyLoaded = loadedPosts.some(p => p.slug === nextPost.slug);
                  const isCurrentPost = nextPost.slug === post.slug;
                  const isBeingLoaded = loadingPostsRef.current.has(nextPost.slug);
                  
                  if (!isAlreadyLoaded && !isCurrentPost && !isBeingLoaded) {
                    // Mark as being loaded to prevent race conditions
                    loadingPostsRef.current.add(nextPost.slug);
                    
                    setLoadedPosts(prev => {
                      // Double check to prevent duplicates
                      if (prev.some(p => p.slug === nextPost.slug)) {
                        loadingPostsRef.current.delete(nextPost.slug);
                        return prev;
                      }
                      return [...prev, nextPost];
                    });
                    // Initialize section refs for new post
                    loadedPostsSectionRefs.current[nextPost.slug] = {};
                    
                    // Calculate reading time for loaded post after render
                    setTimeout(() => {
                      const postContentElement = document.querySelector(`[data-post-slug="${nextPost.slug}"]`);
                      if (postContentElement) {
                        const time = calculateReadingTime(postContentElement as HTMLElement);
                        setLoadedPostsReadingTime(prev => ({
                          ...prev,
                          [nextPost.slug]: time
                        }));
                        
                        // Set up section refs for loaded post headings
                        if (nextPost.content) {
                          const loadedPostTocItems = parseHeadingsFromContent(nextPost.content);
                          loadedPostTocItems.forEach((item) => {
                            const element = document.getElementById(item.id) || document.querySelector(`[data-heading-id="${item.id}"]`);
                            if (element && !loadedPostsSectionRefs.current[nextPost.slug]) {
                              loadedPostsSectionRefs.current[nextPost.slug] = {};
                            }
                            if (element) {
                              loadedPostsSectionRefs.current[nextPost.slug][item.id] = element as HTMLElement;
                            }
                          });
                        }
                      }
                      // Remove from loading set after a delay to allow for render
                      setTimeout(() => {
                        loadingPostsRef.current.delete(nextPost.slug);
                      }, 1000);
                    }, 200);
                  }
                }
              }
            }
          });

          // Update URL based on which post is currently in viewport
          if (!post) return; // Skip if post is not loaded yet
          
          const viewportCenter = windowHeight / 2;
          let activePostSlug = post.slug;
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
              activePostSlug = post.slug;
            }
          }

          // Check loaded posts visibility
          loadedPosts.forEach((loadedPost) => {
            const postContentElement = document.querySelector(`[data-post-slug="${loadedPost.slug}"]`) as HTMLElement;
            if (postContentElement) {
              const contentRect = postContentElement.getBoundingClientRect();
              const visibleTop = Math.max(0, -contentRect.top);
              const visibleBottom = Math.min(contentRect.height, windowHeight - contentRect.top);
              const visibleHeight = Math.max(0, visibleBottom - visibleTop);
              const visibleArea = visibleHeight * (contentRect.width || 0);
              
              if (visibleArea > maxVisibleArea && contentRect.top < viewportCenter && contentRect.bottom > viewportCenter) {
                maxVisibleArea = visibleArea;
                activePostSlug = loadedPost.slug;
              }
            }
          });

          // Update URL if different from current (using replaceState to avoid re-render)
          if (activePostSlug !== post.slug && activePostSlug !== 'preview' && typeof window !== 'undefined') {
            const activePost = posts.find(p => p.slug === activePostSlug);
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
    if (!contentRef.current) return;

    // Use setTimeout to ensure content is fully rendered
    const timeoutId = setTimeout(() => {
      const contentElement = contentRef.current;
      if (!contentElement) return;

      const headings: Array<{ id: string; label: string; level: number; element: HTMLElement }> = [];
      
      // Find all headings (h2, h3, h4) in the content
      const headingElements = contentElement.querySelectorAll('h2, h3, h4');
      
      headingElements.forEach((heading) => {
        const element = heading as HTMLElement;
        let id = element.id;
        
        // If no ID, generate one from the text content
        if (!id) {
          const text = element.textContent || '';
          id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
          element.id = id;
        }
        
        // Get heading level (2 for h2, 3 for h3, etc.)
        const level = parseInt(element.tagName.charAt(1));
        const label = element.textContent || '';
        
        headings.push({ id, label, level, element });
        sectionRefs.current[id] = element;
      });
      
      // Update TOC items
      setTocItems(headings.map(h => ({ id: h.id, label: h.label, level: h.level })));
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [post, previewHtml]);

  // Update sections array for scroll tracking
  const sections = tocItems.map(item => item.id);

  const scrollToSection = (sectionId: string) => {
    // Try multiple methods to find the element
    let element: HTMLElement | null = null;
    
    // Method 1: Try ref first
    element = sectionRefs.current[sectionId] || null;
    
    // Method 2: Try querySelector in contentRef
    if (!element && contentRef.current) {
      element = contentRef.current.querySelector(`#${sectionId}`) as HTMLElement;
      if (!element) {
        element = contentRef.current.querySelector(`[data-heading-id="${sectionId}"]`) as HTMLElement;
      }
      if (element) {
        sectionRefs.current[sectionId] = element;
      }
    }
    
    // Method 3: Try document.getElementById
    if (!element) {
      element = document.getElementById(sectionId);
      if (element) {
        sectionRefs.current[sectionId] = element;
      }
    }
    
    // Method 4: Try data-heading-id attribute
    if (!element) {
      element = document.querySelector(`[data-heading-id="${sectionId}"]`) as HTMLElement;
      if (element) {
        sectionRefs.current[sectionId] = element;
      }
    }
    
    if (element) {
      const headerOffset = 120; // Offset for header
      const elementPosition = element.getBoundingClientRect().top;
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      const offsetPosition = elementPosition + currentScroll - headerOffset;

      // Scroll to position with smooth behavior
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      console.warn(`Could not find element with ID: ${sectionId}`);
    }
  };

  const currentIndex = post ? posts.findIndex(p => p.slug === post.slug) : -1;

  // Share functions
  const handleShare = async (platform: 'facebook' | 'twitter' | 'copy') => {
    if (!post) return;
    
    const postUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `${post.title} - ${post.excerpt}`;
    
    if (platform === 'facebook') {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
      window.open(facebookUrl, '_blank', 'width=600,height=400');
    } else if (platform === 'twitter') {
      const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(shareText)}`;
      window.open(twitterUrl, '_blank', 'width=600,height=400');
    } else if (platform === 'copy') {
      try {
        // Try Web Share API first (mobile)
        if (navigator.share) {
          await navigator.share({
            title: post.title,
            text: post.excerpt,
            url: postUrl,
          });
        } else {
          // Fallback to clipboard API
          await navigator.clipboard.writeText(postUrl);
          // Show simple notification
          const notification = document.createElement('div');
          notification.textContent = 'Đã sao chép link vào clipboard!';
          notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #3b82f6;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 9999;
            font-size: 14px;
            animation: slideIn 0.3s ease-out;
          `;
          document.body.appendChild(notification);
          setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
          }, 2000);
        }
      } catch (err) {
        console.error('Error sharing:', err);
        // Fallback: show alert
        alert('Đã sao chép link vào clipboard!');
      }
    }
  };

  // Loading state - show loading while searching for post
  if (searchingPost || !hasSearched) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <div className="text-sm text-gray-500">Đang tải bài viết...</div>
        </div>
      </div>
    );
  }

  // 404 - only show after search is complete and no post found
  if (!foundPost && !isPreview && hasSearched) {
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

  // Still loading post data
  if (!post && !isPreview) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <div className="text-sm text-gray-500">Đang tải nội dung bài viết...</div>
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
                  __html: (() => {
                    // Process content to add IDs to all headings
                    let processedContent = post.content;
                    const headingRegex = /<(h[2-4])([^>]*)>(.*?)<\/h[2-4]>/gi;
                    const processedIds = new Set<string>();
                    let idCounter = 0;
                    
                    processedContent = processedContent.replace(headingRegex, (match, tag, attrs, text) => {
                      // Extract text content (remove HTML tags using regex)
                      const textContent = text.replace(/<[^>]*>/g, '').trim();
                      
                      // Generate ID from text
                      let id = textContent
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-+|-+$/g, '');
                      
                      // If ID is empty or already exists, add counter
                      if (!id) {
                        id = `heading-${idCounter++}`;
                      } else if (processedIds.has(id)) {
                        id = `${id}-${idCounter++}`;
                      }
                      
                      processedIds.add(id);
                      
                      // Check if attrs already has id
                      const hasId = /id\s*=\s*["']([^"']+)["']/i.test(attrs);
                      if (!hasId) {
                        return `<${tag}${attrs} id="${id}" data-heading-id="${id}">${text}</${tag}>`;
                      } else {
                        // Extract existing ID and use it
                        const existingIdMatch = attrs.match(/id\s*=\s*["']([^"']+)["']/i);
                        const existingId = existingIdMatch ? existingIdMatch[1] : id;
                        return `<${tag}${attrs} data-heading-id="${existingId}">${text}</${tag}>`;
                      }
                    });
                    
                    return processedContent;
                  })()
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
                  <button 
                    onClick={() => handleShare('facebook')}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-colors"
                    title="Share on Facebook"
                    aria-label="Share on Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleShare('twitter')}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-colors"
                    title="Share on Twitter/X"
                    aria-label="Share on Twitter/X"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleShare('copy')}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-colors"
                    title="Copy link"
                    aria-label="Copy link to clipboard"
                  >
                    <span className="material-icons-outlined text-sm">link</span>
                  </button>
                </div>
              </div>

              {/* Prev/Next Navigation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {currentIndex > 0 && (
                  <Link href={getPostUrl(posts[currentIndex - 1])} className="relative rounded-xl overflow-hidden aspect-[3/2] group hover:opacity-90 transition-opacity">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img src={posts[currentIndex - 1].thumbnail || posts[currentIndex - 1].image} alt={posts[currentIndex - 1].title} className="w-full h-full object-cover" style={{ minHeight: '100%', minWidth: '100%', objectPosition: 'center center' }} />
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
                      <img src={posts[currentIndex + 1].thumbnail || posts[currentIndex + 1].image} alt={posts[currentIndex + 1].title} className="w-full h-full object-cover" style={{ minHeight: '100%', minWidth: '100%', objectPosition: 'center center' }} />
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
                  <Link href={getPostUrl(spotlightPost)} key={spotlightPost.slug} className="flex gap-4 group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <img src={spotlightPost.thumbnail || spotlightPost.image} alt={spotlightPost.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
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
                  {post.sidebarBanner.image ? (
                    <>
                      <img 
                        src={post.sidebarBanner.image} 
                        alt={post.sidebarBanner.title || 'Banner'} 
                        className="absolute inset-0 w-full h-full object-cover z-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/60 z-10"></div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 z-0" style={{ backgroundColor: post.sidebarBanner.backgroundColor || '#4c1d95' }}></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40 z-10"></div>
                    </>
                  )}
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
              .filter(p => p.slug !== post.slug)
              .slice(0, 3)
              .map((relatedPost) => (
                <Link href={getPostUrl(relatedPost)} key={relatedPost.slug} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <div className="rounded-2xl overflow-hidden aspect-[3/2] mb-4">
                      <img src={relatedPost.thumbnail || relatedPost.image} alt={relatedPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
              key={`loaded-post-${loadedPost.slug}-${index}`}
              data-loaded-post={loadedPost.slug}
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
                        <span>{loadedPostsReadingTime[loadedPost.slug] || estimatedReadingTime} min read</span>
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
                            {loadedPostsReadingTime[loadedPost.slug] || estimatedReadingTime} min read
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${loadedPostsProgress[loadedPost.slug] || 0}%` }}
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
                                    const element = loadedPostsSectionRefs.current[loadedPost.slug]?.[item.id];
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
                                    loadedPostsActiveSection[loadedPost.slug] === item.id
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
                <div data-post-slug={loadedPost.slug} className={`col-span-1 ${loadedPost.content ? 'lg:col-span-6' : 'lg:col-span-12'} prose prose-lg prose-blue max-w-none`}>
                  {loadedPost.content ? (
                    <div
                      className="prose prose-lg prose-blue max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: (() => {
                          // Process content to add IDs to all headings
                          let processedContent = loadedPost.content;
                          const headingRegex = /<(h[2-4])([^>]*)>(.*?)<\/h[2-4]>/gi;
                          const processedIds = new Set<string>();
                          let idCounter = 0;
                          
                          processedContent = processedContent.replace(headingRegex, (match, tag, attrs, text) => {
                            // Extract text content (remove HTML tags using regex)
                            const textContent = text.replace(/<[^>]*>/g, '').trim();
                            
                            // Generate ID from text
                            let id = textContent
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, '-')
                              .replace(/^-+|-+$/g, '');
                            
                            // If ID is empty or already exists, add counter
                            if (!id) {
                              id = `heading-${idCounter++}`;
                            } else if (processedIds.has(id)) {
                              id = `${id}-${idCounter++}`;
                            }
                            
                            processedIds.add(id);
                            
                            // Check if attrs already has id
                            const hasId = /id\s*=\s*["']([^"']+)["']/i.test(attrs);
                            if (!hasId) {
                              return `<${tag}${attrs} id="${id}" data-heading-id="${id}">${text}</${tag}>`;
                            } else {
                              // Extract existing ID and use it
                              const existingIdMatch = attrs.match(/id\s*=\s*["']([^"']+)["']/i);
                              const existingId = existingIdMatch ? existingIdMatch[1] : id;
                              return `<${tag}${attrs} data-heading-id="${existingId}">${text}</${tag}>`;
                            }
                          });
                          
                          return processedContent;
                        })()
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
                        const loadedPostIndex = posts.findIndex(p => p.slug === loadedPost.slug);
                        const hasPrev = loadedPostIndex > 0;
                        const hasNext = loadedPostIndex < posts.length - 1;
                        return (
                          <>
                            {hasPrev && (
                              <Link href={getPostUrl(posts[loadedPostIndex - 1])} className="relative rounded-xl overflow-hidden aspect-[3/2] group hover:opacity-90 transition-opacity">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <img src={posts[loadedPostIndex - 1].thumbnail || posts[loadedPostIndex - 1].image} alt={posts[loadedPostIndex - 1].title} className="w-full h-full object-cover" style={{ minHeight: '100%', minWidth: '100%', objectPosition: 'center center' }} />
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
                                  <img src={posts[loadedPostIndex + 1].thumbnail || posts[loadedPostIndex + 1].image} alt={posts[loadedPostIndex + 1].title} className="w-full h-full object-cover" style={{ minHeight: '100%', minWidth: '100%', objectPosition: 'center center' }} />
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
                        <Link href={getPostUrl(spotlightPost)} key={spotlightPost.slug} className="flex gap-4 group">
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                            <img src={spotlightPost.thumbnail || spotlightPost.image} alt={spotlightPost.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
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
                        {loadedPost.sidebarBanner.image ? (
                          <>
                            <img 
                              src={loadedPost.sidebarBanner.image} 
                              alt={loadedPost.sidebarBanner.title || 'Banner'} 
                              className="absolute inset-0 w-full h-full object-cover z-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/60 z-10"></div>
                          </>
                        ) : (
                          <>
                            <div className="absolute inset-0 z-0" style={{ backgroundColor: loadedPost.sidebarBanner.backgroundColor || '#4c1d95' }}></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40 z-10"></div>
                          </>
                        )}
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


