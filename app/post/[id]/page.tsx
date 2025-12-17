'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import Newsletter from '@/components/Newsletter';
import { posts } from '@/data';

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function SinglePostPage({ params }: PageProps) {
  // Use React.use() to unwrap the Promise synchronously
  const { id } = use(params);
  
  // Find post immediately
  const foundPost = posts.find(p => p.id === id) || {
    ...posts[0],
    title: "Setting Up for a Great Year",
    category: "Business",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0ekLkhpQK-8g0j3hEdtyM1gSbMbaGAbEjSnhco4PxiSudZTUMA0jkxk8exUhWDinAn8O2O5O2Of-4NzBHTnaoL5rz5oXY_hKqV8Z0qoVE1OwQ-RMeNUdieQkvE0lD0KlyYE7izW_IOAMIVXNlov0Qckr57rj0c0A1oIvNCqah3eHU6e_0N_9afAC6w4LnDsD0QjmMyQMM5YgVhvGkW4ISrYyrfREjlQ8zE91K6venzpVPh0QYNgd1hq-x66NUgp3RYVOBQs6DTYrg",
    excerpt: "You don't need a plan — just a few thoughts that can support clarity or spark fresh motivation for the journey ahead.",
  };
  
  const [post, setPost] = useState(foundPost);
  const [loadedPosts, setLoadedPosts] = useState<typeof posts[0][]>([]);
  const [activeSection, setActiveSection] = useState('introduction');
  const [readingProgress, setReadingProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(5);
  const [estimatedReadingTime, setEstimatedReadingTime] = useState(5);
  const [loadedPostsProgress, setLoadedPostsProgress] = useState<{ [key: string]: number }>({});
  const [loadedPostsActiveSection, setLoadedPostsActiveSection] = useState<{ [key: string]: string }>({});
  const [loadedPostsReadingTime, setLoadedPostsReadingTime] = useState<{ [key: string]: number }>({});
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const loadedPostsSectionRefs = useRef<{ [postId: string]: { [key: string]: HTMLElement | null } }>({});
  const endOfPostRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Calculate reading time based on content length
  const calculateReadingTime = (element: HTMLElement | null): number => {
    if (!element) return 5;
    const text = element.innerText || element.textContent || '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    // Average reading speed: 200-250 words per minute, using 200 as average for more accurate estimate
    const minutes = Math.ceil(words / 200);
    return Math.max(1, minutes);
  };

  // Update post when id changes
  useEffect(() => {
    setPost(foundPost);
    setLoadedPosts([]); // Reset loaded posts when post changes
    
    // Calculate reading time after content is rendered
    setTimeout(() => {
      if (contentRef.current) {
        const time = calculateReadingTime(contentRef.current);
        setEstimatedReadingTime(time);
        setReadingTime(time);
      }
    }, 100);
  }, [id, foundPost]);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Calculate reading progress for main post (based on JS sample)
          const windowHeight = window.innerHeight;
          const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
          
          // Get the main content element
          const mainContent = contentRef.current;
          if (mainContent) {
            const contentRect = mainContent.getBoundingClientRect();
            const contentHeight = mainContent.offsetHeight;
            const contentOffsetTop = contentRect.top + scrollTop;
            const scrollableHeight = contentHeight - windowHeight;
            
            if (scrollableHeight > 0) {
              // Calculate relative scroll position
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

          // Find active section
          const sections = [
            'introduction',
            'getting-lost',
            'popular-frameworks',
            'support-progress',
            'how-to-apply',
            'conclusion'
          ];

          let currentSection = 'introduction';
          
          sections.forEach((sectionId) => {
            const element = sectionRefs.current[sectionId];
            if (element) {
              const rect = element.getBoundingClientRect();
              if (rect.top <= 200) {
                currentSection = sectionId;
              }
            }
          });

          setActiveSection(currentSection);

          // Calculate progress and active section for each loaded post
          loadedPosts.forEach((loadedPost, postIndex) => {
            const postSectionRefs = loadedPostsSectionRefs.current[loadedPost.id] || {};
            const postSections = ['introduction', 'getting-lost', 'popular-frameworks', 'support-progress', 'how-to-apply', 'conclusion'];
            
            let currentPostSection = 'introduction';
            postSections.forEach((sectionId) => {
              const element = postSectionRefs[sectionId];
              if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= 200) {
                  currentPostSection = sectionId;
                }
              }
            });
            
            setLoadedPostsActiveSection(prev => ({
              ...prev,
              [loadedPost.id]: currentPostSection
            }));

            // Calculate progress for this loaded post (based on JS sample)
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
                    }
                  }, 200);
                }
              }
            }
          });
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [post, loadedPosts]);

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

  const tocItems = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'getting-lost', label: 'Getting Lost in "Busy Work"' },
    { id: 'popular-frameworks', label: 'Popular Frameworks' },
    { id: 'support-progress', label: 'Support Real Progress' },
    { id: 'how-to-apply', label: 'How to Apply' },
    { id: 'conclusion', label: 'Conclusion' }
  ];

  const currentIndex = posts.findIndex(p => p.id === post.id);

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
          <div className="flex gap-3 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-primary border border-blue-100">
              <span className="material-icons-outlined text-sm mr-1">trending_up</span> {post.category}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-600 border border-purple-100">
              <span className="material-icons-outlined text-sm mr-1">rocket_launch</span> Startup
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight max-w-4xl">
            {post.title}
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-3xl mb-8">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between border-t border-b border-gray-100 py-6">
            <div className="flex items-center gap-4">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuARjQyt5m6EibE66fPtCPvGR-oppu85NOdqF0fiSOQIHske26b6b7_i8p9iU98ZOILoXHDDHDXLLrz6V4X_lzgQIdVu7ObfecdfdU2j1O7BqgZjK7TEQKPu3jwQttl5YJpKPJHT_7lj3-rNJte4QZpMpH2iKtBay6Wwd-cwDakGDqAv6EhVJD0RsBTuPN6AT8XH0L_Et-v8lVJeo1_rco3QrZQfOvDhZ1mOy9YdC1C9pWUUhSe9GBtXiDTwbm9IfXgd1q97McN9G29s" alt="Robert Bates" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-bold text-gray-900">Robert Bates</p>
                <div className="flex items-center text-xs text-gray-500 font-medium gap-3">
                  <span>May 6, 2020</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="flex items-center gap-1"><span className="material-icons-outlined text-xs">schedule</span> 6 min read</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors">
                <span className="material-icons-outlined text-sm">share</span>
              </button>
              <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors">
                <span className="material-icons-outlined text-sm">bookmark_border</span>
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Sidebar - Table of Contents */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 space-y-6 animate-slide-in-left">
              {/* Reading Progress */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 animate-fade-in">
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

              {/* Table of Contents */}
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
            </div>
          </aside>

          {/* Main Content */}
          <div ref={contentRef} className="col-span-1 lg:col-span-6 prose prose-lg prose-blue max-w-none">
            <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-orange-100 animate-fade-in">
              <img src={post.image} alt="Illustration" className="w-full h-auto object-cover" />
            </div>

            <p 
              ref={(el) => { sectionRefs.current['introduction'] = el; }}
              className="lead text-xl text-gray-600 mb-8"
            >
              Whether you're managing a product roadmap, organizing a work project, planning a travel itinerary, or preparing for an upcoming season, one of the biggest challenges is figuring out what to do first.
            </p>
            
            <p>
              In today's world, distractions are everywhere, resources are limited, and to-do lists seem to grow by the hour. Without a system to guide your choices, it's easy to get stuck in reactive mode—working hard but not necessarily working smart. That's where prioritization frameworks come in.
            </p>

            <h2 
              ref={(el) => { sectionRefs.current['getting-lost'] = el; }}
              className="text-3xl font-bold text-gray-900 mt-12 mb-6"
            >
              Getting Lost in "Busy Work"
            </h2>
            <p>
              In every field—whether you're a student, entrepreneur, team leader, or solo professional—it's easy to confuse activity with progress. You might spend hours responding to emails, putting out fires, or finishing small tasks, all while delaying the things that could actually drive meaningful outcomes.
            </p>
            <p>
              The solution isn't just about doing less; it's about doing what matters more. By identifying which actions have the greatest impact, you create space to focus deeply.
            </p>

            <h3 
              ref={(el) => { sectionRefs.current['popular-frameworks'] = el; }}
              className="text-xl font-bold text-gray-900 mt-8 mb-4"
            >
              Popular Frameworks to Get Started:
            </h3>
            <ul className="space-y-3 list-none pl-0">
              {[
                { title: "The Eisenhower Matrix", desc: "helps you evaluate every task by its urgency and importance so you can act on what truly matters now." },
                { title: "The MoSCoW Method", desc: "sorts your projects into must-haves, should-haves, could-haves, and won't-haves." },
                { title: "The RICE Model", desc: "evaluates reach, impact, confidence, and effort to prioritize based on value versus cost." },
                { title: "The 80/20 Rule", desc: "reminds you to identify and invest in the small percentage of tasks that produce results." }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0"></span>
                  <span><strong className="text-gray-900">{item.title}</strong> {item.desc}</span>
                </li>
              ))}
            </ul>

            <h2 
              ref={(el) => { sectionRefs.current['support-progress'] = el; }}
              className="text-3xl font-bold text-gray-900 mt-12 mb-6"
            >
              Support Real Progress
            </h2>
            <p>
              Prioritization frameworks give you a shared language for decision-making, especially in collaborative environments. Whether you're working with a product team, a class group, or across departments.
            </p>

            <figure className="my-10">
              <img className="w-full rounded-2xl shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrgXpbgThq5fyGwb-w3JcOU9eHo0qrGLJWSE91EX4Ze9cWErY3oN8ARc3onv7rrJnLT-5nY76SSJav6rvx43Y1xYCMZU1zHW2u0fzUUu5dv_NnAqRJiTzUYRTfCgKjqUTrD47pw8hWp48VoSC83UZzqLuvSIypJazn3hvLCTJmi0ixgt8v9QR4Nrhl7u-fj95RM02xSe6HoJ4uX46q-4cKq3HaCNpvhulUtTbWtuzPEigGh340g36U2k_PYX2ClGw7Bupvf5Ty8r0W" alt="Monkey thinking" />
              <figcaption className="text-center text-sm text-gray-400 mt-3 italic">Plans give yet mindfulness thick stars consider they.</figcaption>
            </figure>

            <h3 
              ref={(el) => { sectionRefs.current['how-to-apply'] = el; }}
              className="text-xl font-bold text-gray-900 mt-8 mb-4"
            >
              How to Apply Frameworks in Your Day-to-Day Workflow
            </h3>
            <p>The process is simple—and it works no matter your role, goals, or the type of work you're doing:</p>
            <ol className="list-decimal pl-5 space-y-4 marker:text-primary marker:font-bold">
              <li><strong>Start with a full list of tasks or ideas:</strong> Don't worry about order—just write down everything that's on your plate so you can see it clearly.</li>
              <li><strong>Pick a framework that fits your context:</strong> Choose based on what you're prioritizing—Eisenhower for urgent items, MoSCoW for shared plans, or RICE for resource-heavy projects.</li>
              <li><strong>Evaluate and categorize everything honestly:</strong> Use objective criteria and sort your tasks accordingly—this is where clarity and action begin to take shape.</li>
            </ol>

            <div className="my-12 p-8 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-between flex-wrap gap-4">
              <p className="font-bold text-gray-900 text-lg m-0 max-w-sm">Are you effectively managing tasks across different teams, languages, or global time zones?</p>
              <button className="bg-white text-gray-900 px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">Learn More</button>
            </div>

            <h2 
              ref={(el) => { sectionRefs.current['conclusion'] = el; }}
              className="text-3xl font-bold text-gray-900 mt-12 mb-6"
            >
              Conclusion
            </h2>
            <p>
              At its core, prioritization is about gaining control of your time, your work, and your attention. It empowers you to act with intention, not just urgency.
            </p>
            
            {/* Post Footer - Metadata, Share, Navigation, Comments */}
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
                   <Link href={`/post/${posts[currentIndex - 1].id}`} className="relative rounded-xl overflow-hidden aspect-[3/2] group hover:opacity-90 transition-opacity">
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
                   <Link href={`/post/${posts[currentIndex + 1].id}`} className="relative rounded-xl overflow-hidden aspect-[3/2] group hover:opacity-90 transition-opacity">
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
                   <Link href={`/post/${spotlightPost.id}`} key={spotlightPost.id} className="flex gap-4 group">
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
             <div className="sticky top-28 animate-slide-in-right animate-delay-200">
               <div className="relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer">
                 <div className="absolute inset-0 bg-[#4c1d95] z-0"></div>
                 <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40 z-10"></div>
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-20">
                   <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-4">Ultimate Guide</span>
                   <h3 className="text-2xl font-black text-white mb-2">Follow the<br />Thought Trail</h3>
                   <p className="text-white/70 text-xs mb-8">Explore all topics and find the ones that matter to you.</p>
                   <button className="bg-primary hover:bg-blue-600 text-white text-xs font-bold py-3 px-6 rounded-xl shadow-lg transition-colors w-full">Explore Categories</button>
                 </div>
               </div>
             </div>
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
                 <Link href={`/post/${relatedPost.id}`} key={relatedPost.id} className="group">
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
                <div className="flex gap-3 mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-primary border border-blue-100">
                    <span className="material-icons-outlined text-sm mr-1">trending_up</span> {loadedPost.category}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-600 border border-purple-100">
                    <span className="material-icons-outlined text-sm mr-1">rocket_launch</span> Startup
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight max-w-4xl">
                  {loadedPost.title}
                </h1>
                <p className="text-xl text-gray-500 leading-relaxed max-w-3xl mb-8">
                  {loadedPost.excerpt}
                </p>

                <div className="flex items-center justify-between border-t border-b border-gray-100 py-6">
                  <div className="flex items-center gap-4">
                    <img src={loadedPost.author.avatar} alt={loadedPost.author.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-gray-900">{loadedPost.author.name}</p>
                      <div className="flex items-center text-xs text-gray-500 font-medium gap-3">
                        <span>{loadedPost.date}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="flex items-center gap-1">
                          <span className="material-icons-outlined text-xs">schedule</span> {loadedPostsReadingTime[loadedPost.id] || estimatedReadingTime} min read
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors">
                      <span className="material-icons-outlined text-sm">share</span>
                    </button>
                    <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors">
                      <span className="material-icons-outlined text-sm">bookmark_border</span>
                    </button>
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Sidebar - Table of Contents */}
                <aside className="hidden lg:block lg:col-span-3">
                  <div className="sticky top-28 space-y-6 animate-slide-in-left">
                    {/* Reading Progress */}
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 animate-fade-in">
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

                    {/* Table of Contents */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Contents</h4>
                      <nav className="space-y-4 border-l border-gray-100 pl-4">
                        {tocItems.map((item) => (
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
                  </div>
                </aside>

                {/* Main Content - Full Post */}
                <div data-post-id={loadedPost.id} className="col-span-1 lg:col-span-6 prose prose-lg prose-blue max-w-none">
                  <div key={`image-${loadedPost.id}-${index}`} className="rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-orange-100 animate-fade-in">
                    <img src={loadedPost.image} alt={loadedPost.title} className="w-full h-auto object-cover" />
                  </div>

                  <p 
                    ref={(el) => { 
                      if (!loadedPostsSectionRefs.current[loadedPost.id]) {
                        loadedPostsSectionRefs.current[loadedPost.id] = {};
                      }
                      loadedPostsSectionRefs.current[loadedPost.id]['introduction'] = el; 
                    }}
                    className="lead text-xl text-gray-600 mb-8"
                  >
                    Whether you're managing a product roadmap, organizing a work project, planning a travel itinerary, or preparing for an upcoming season, one of the biggest challenges is figuring out what to do first.
                  </p>
                  
                  <p>
                    In today's world, distractions are everywhere, resources are limited, and to-do lists seem to grow by the hour. Without a system to guide your choices, it's easy to get stuck in reactive mode—working hard but not necessarily working smart. That's where prioritization frameworks come in.
                  </p>

                  <h2 
                    ref={(el) => { 
                      if (!loadedPostsSectionRefs.current[loadedPost.id]) {
                        loadedPostsSectionRefs.current[loadedPost.id] = {};
                      }
                      loadedPostsSectionRefs.current[loadedPost.id]['getting-lost'] = el; 
                    }}
                    className="text-3xl font-bold text-gray-900 mt-12 mb-6"
                  >
                    Getting Lost in "Busy Work"
                  </h2>
                  <p>
                    In every field—whether you're a student, entrepreneur, team leader, or solo professional—it's easy to confuse activity with progress. You might spend hours responding to emails, putting out fires, or finishing small tasks, all while delaying the things that could actually drive meaningful outcomes.
                  </p>
                  <p>
                    The solution isn't just about doing less; it's about doing what matters more. By identifying which actions have the greatest impact, you create space to focus deeply.
                  </p>

                  <h3 
                    ref={(el) => { 
                      if (!loadedPostsSectionRefs.current[loadedPost.id]) {
                        loadedPostsSectionRefs.current[loadedPost.id] = {};
                      }
                      loadedPostsSectionRefs.current[loadedPost.id]['popular-frameworks'] = el; 
                    }}
                    className="text-xl font-bold text-gray-900 mt-8 mb-4"
                  >
                    Popular Frameworks to Get Started:
                  </h3>
                  <ul className="space-y-3 list-none pl-0">
                    {[
                      { title: "The Eisenhower Matrix", desc: "helps you evaluate every task by its urgency and importance so you can act on what truly matters now." },
                      { title: "The MoSCoW Method", desc: "sorts your projects into must-haves, should-haves, could-haves, and won't-haves." },
                      { title: "The RICE Model", desc: "evaluates reach, impact, confidence, and effort to prioritize based on value versus cost." },
                      { title: "The 80/20 Rule", desc: "reminds you to identify and invest in the small percentage of tasks that produce results." }
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0"></span>
                        <span><strong className="text-gray-900">{item.title}</strong> {item.desc}</span>
                      </li>
                    ))}
                  </ul>

                  <h2 
                    ref={(el) => { 
                      if (!loadedPostsSectionRefs.current[loadedPost.id]) {
                        loadedPostsSectionRefs.current[loadedPost.id] = {};
                      }
                      loadedPostsSectionRefs.current[loadedPost.id]['support-progress'] = el; 
                    }}
                    className="text-3xl font-bold text-gray-900 mt-12 mb-6"
                  >
                    Support Real Progress
                  </h2>
                  <p>
                    Prioritization frameworks give you a shared language for decision-making, especially in collaborative environments. Whether you're working with a product team, a class group, or across departments.
                  </p>

                  <h2 
                    ref={(el) => { 
                      if (!loadedPostsSectionRefs.current[loadedPost.id]) {
                        loadedPostsSectionRefs.current[loadedPost.id] = {};
                      }
                      loadedPostsSectionRefs.current[loadedPost.id]['conclusion'] = el; 
                    }}
                    className="text-3xl font-bold text-gray-900 mt-12 mb-6"
                  >
                    Conclusion
                  </h2>
                  <p>
                    At its core, prioritization is about gaining control of your time, your work, and your attention. It empowers you to act with intention, not just urgency.
                  </p>
                  
                  {/* Post Footer - Metadata, Share, Navigation, Comments */}
                  <div className="mt-12 pt-8 border-t border-gray-100">
                    {/* Metadata */}
                    <div className="flex items-center gap-4 mb-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-primary border border-blue-100">
                        <span className="material-icons-outlined text-sm mr-1">trending_up</span> {loadedPost.category}
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
                       {(() => {
                         const loadedPostIndex = posts.findIndex(p => p.id === loadedPost.id);
                         const hasPrev = loadedPostIndex > 0;
                         const hasNext = loadedPostIndex < posts.length - 1;
                         return (
                           <>
                             {hasPrev && (
                               <Link href={`/post/${posts[loadedPostIndex - 1].id}`} className="relative rounded-xl overflow-hidden aspect-[3/2] group hover:opacity-90 transition-opacity">
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
                               <Link href={`/post/${posts[loadedPostIndex + 1].id}`} className="relative rounded-xl overflow-hidden aspect-[3/2] group hover:opacity-90 transition-opacity">
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

                 {/* Right Sidebar - Spotlight + Banner */}
                 <aside className="col-span-1 lg:col-span-3">
                   {/* Spotlight - Not Sticky */}
                   <div key={`spotlight-${loadedPost.id}-${index}`} className="mb-8 animate-slide-in-right animate-delay-100">
                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Spotlight</h4>
                     <div className="space-y-6">
                       {posts.slice(0, 4).map((spotlightPost) => (
                         <Link href={`/post/${spotlightPost.id}`} key={spotlightPost.id} className="flex gap-4 group">
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
                   <div key={`banner-${loadedPost.id}-${index}`} className="sticky top-28 animate-slide-in-right animate-delay-200">
                     <div className="relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer">
                       <div className="absolute inset-0 bg-[#4c1d95] z-0"></div>
                       <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40 z-10"></div>
                       <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-20">
                         <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-4">Ultimate Guide</span>
                         <h3 className="text-2xl font-black text-white mb-2">Follow the<br />Thought Trail</h3>
                         <p className="text-white/70 text-xs mb-8">Explore all topics and find the ones that matter to you.</p>
                         <button className="bg-primary hover:bg-blue-600 text-white text-xs font-bold py-3 px-6 rounded-xl shadow-lg transition-colors w-full">Explore Categories</button>
                       </div>
                     </div>
                   </div>
                  </aside>
               </div>
               
               {/* READ NEXT Section - Full Width (Outside Grid) */}
               <div className="mt-20 pt-10 border-t border-gray-100">
                 <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">READ NEXT</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {posts
                     .filter(p => p.id !== loadedPost.id)
                     .slice(0, 3)
                     .map((relatedPost) => (
                       <Link href={`/post/${relatedPost.id}`} key={relatedPost.id} className="group">
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
             </div>
           );
         })}

        <div className="mt-20 pt-10 border-t border-gray-100">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Read Next</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.slice(3, 6).map((post) => (
              <div key={post.id} className="group cursor-pointer">
                <div className="rounded-2xl overflow-hidden aspect-[3/2] mb-4">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-primary uppercase">{post.category}</span>
                  <span className="w-px h-3 bg-gray-200"></span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Tech</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-2">
                  <img src={post.author.avatar} className="w-5 h-5 rounded-full" />
                  <span className="text-[10px] font-bold text-gray-900">{post.author.name}</span>
                  <span className="text-[10px] text-gray-400 ml-auto">{post.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Newsletter />
    </div>
  )
}
