import Link from 'next/link'
import Newsletter from '@/components/Newsletter'
import { posts } from '@/data'

export default function TechPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex mb-8 text-xs font-medium text-gray-500">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-900">Tech</span>
          </nav>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">Tech</h1>
              <p className="text-lg text-gray-500 leading-relaxed">
                Breaking down innovations, gadgets, and digital shifts in everyday life.
              </p>
            </div>
            <div className="hidden md:block">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnk9W28Nq9z1yOLl4yag5_ZVL-WYKMbIgEIQ27Xm6kBpMyeAAGECVoB5qXBpDqDamKiMKaro35-Y2PsCgnyHljldxUyevW2fE37MT9Acb18tG3OcqUA127c41HHis5UUM-OR6j_Zu57JdxyNZydqdRBGMSIBJ3sGU9i7oli8dOXRrDfkLyezaTYMgkmJJuTx34zl1ux1RUgceDlFOutRWzp8A92DVlj5x63oYGDaXvyOhar1jOIh-ExGL-sLKZE9iM7b_Pqv6omvqo" alt="Editor" className="w-20 h-20 rounded-2xl object-cover shadow-lg rotate-3 border-2 border-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        {/* Masonry Layout hack using columns */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {posts.map((post, idx) => (
            <div key={post.id} className="break-inside-avoid bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group">
              <Link href={`/post/${post.id}`}>
                <img src={post.image} alt={post.title} className="w-full object-cover" />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-icons-outlined text-sm text-blue-500">folder_open</span>
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-wide">{post.category}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-4 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3">
                    <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full" />
                    <div className="flex flex-1 justify-between items-center">
                      <span className="text-xs font-bold text-gray-900">{post.author.name}</span>
                      <span className="text-[10px] text-gray-400">{post.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      <Newsletter />
    </div>
  )
}

