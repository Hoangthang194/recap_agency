import Newsletter from '@/components/Newsletter'
import PostCard from '@/components/PostCard'
import { categories, posts, currentUser } from '@/data'
import Link from 'next/link'

export default function Home() {
  // Featured post is distinct - find the post with matching title
  const heroPostData = posts.find(p => p.title === "Pitching Your Idea: A Guide to Presenting with Impact") || posts[0];
  const heroPost = {
    id: heroPostData.id,
    title: heroPostData.title,
    excerpt: heroPostData.excerpt,
    image: heroPostData.image,
    author: heroPostData.author,
    date: heroPostData.date
  };

  const heroSidePosts = posts.slice(0, 4);
  const gridPosts = posts.slice(0, 9);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
          <Link href={`/post/${heroPost.id}`} className="lg:col-span-7 group relative h-[500px] lg:h-auto rounded-3xl overflow-hidden cursor-pointer block">
            <img 
              src={heroPost.image} 
              alt="Hero" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-icons-outlined text-white text-sm">sports_soccer</span>
                <span className="text-white text-sm font-bold uppercase tracking-wider">Sport</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {heroPost.title}
              </h1>
              <p className="text-gray-200 mb-8 line-clamp-2 max-w-xl text-lg">
                {heroPost.excerpt}
              </p>
              <div className="flex items-center gap-4">
                <img src={heroPost.author.avatar} alt="Author" className="w-12 h-12 rounded-full border-2 border-white/30" />
                <div>
                  <p className="text-white text-sm font-bold">{heroPost.author.name}</p>
                  <p className="text-gray-300 text-xs">{heroPost.date}</p>
                </div>
              </div>
            </div>
          </Link>
          
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 content-between">
            {heroSidePosts.slice(0, 2).map((post) => (
              <Link href={`/post/${post.id}`} key={post.id} className="flex gap-4 group cursor-pointer bg-white p-4 rounded-2xl hover:shadow-lg transition-all duration-300 items-center">
                <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-primary uppercase">{post.category}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  <span className="text-[10px] text-gray-400">{post.date}</span>
                </div>
              </Link>
            ))}
            {/* More prominent side cards */}
            {heroSidePosts.slice(2, 4).map((post) => (
              <Link href={`/post/${post.id}`} key={post.id} className="group relative h-48 rounded-2xl overflow-hidden block">
                <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors"></div>
                <div className="absolute bottom-0 left-0 p-5">
                  <span className="text-[10px] font-bold text-white uppercase bg-primary px-2 py-0.5 rounded mb-2 inline-block">{post.category}</span>
                  <h3 className="text-white font-bold leading-tight line-clamp-2">{post.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-24">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Read by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link href={`/${cat.id}`} key={cat.id} className="group block">
                <div className="aspect-square rounded-2xl overflow-hidden mb-3 relative">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className={`absolute inset-0 ${cat.colorClass} mix-blend-multiply transition-opacity group-hover:opacity-80`}></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <span className="material-icons-outlined text-white">arrow_forward</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <span className="material-icons-outlined text-sm text-gray-400 group-hover:text-primary transition-colors">{cat.icon}</span>
                  <span className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mb-20">
          {gridPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mb-12">
          <button className="w-10 h-10 rounded-xl bg-primary text-white font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center transition-transform hover:scale-105">1</button>
          <button className="w-10 h-10 rounded-xl bg-white text-gray-500 font-bold hover:bg-gray-100 flex items-center justify-center transition-colors border border-transparent hover:border-gray-200">2</button>
          <div className="w-10 h-10 flex items-end justify-center pb-2 text-gray-400 font-bold tracking-widest">...</div>
          <button className="w-10 h-10 rounded-xl bg-white text-gray-500 font-bold hover:bg-gray-100 flex items-center justify-center transition-colors border border-transparent hover:border-gray-200">4</button>
          <button className="w-10 h-10 rounded-xl bg-white text-gray-500 font-bold hover:bg-gray-100 flex items-center justify-center transition-colors border border-transparent hover:border-gray-200 group">
            <span className="material-icons-outlined text-sm group-hover:translate-x-0.5 transition-transform">arrow_forward_ios</span>
          </button>
        </div>
      </div>
      
      <Newsletter />
    </div>
  )
}

