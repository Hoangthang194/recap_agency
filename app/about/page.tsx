import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
            About Us
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
            We're passionate about sharing insights, stories, and knowledge that matter.
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg prose-blue max-w-none">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              At Recap, we believe in the power of storytelling and knowledge sharing. Our mission is to create a platform where ideas flourish, perspectives broaden, and communities connect through meaningful content.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We curate and create articles that inspire, inform, and engage readers across various topics—from business and technology to travel and lifestyle.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <span className="material-icons-outlined text-primary text-2xl">edit</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Content</h3>
                <p className="text-gray-600">
                  We publish well-researched, thoughtfully written articles that provide real value to our readers.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <span className="material-icons-outlined text-primary text-2xl">people</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Community Building</h3>
                <p className="text-gray-600">
                  We foster a community where readers can engage, share ideas, and learn from each other.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <span className="material-icons-outlined text-primary text-2xl">trending_up</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Trending Topics</h3>
                <p className="text-gray-600">
                  We cover the latest trends and developments across business, technology, and lifestyle.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <span className="material-icons-outlined text-primary text-2xl">lightbulb</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We explore innovative ideas and share insights that help readers stay ahead of the curve.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0"></span>
                <div>
                  <strong className="text-gray-900">Integrity:</strong>
                  <span className="text-gray-600"> We believe in honest, transparent communication and ethical content creation.</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0"></span>
                <div>
                  <strong className="text-gray-900">Excellence:</strong>
                  <span className="text-gray-600"> We strive for excellence in every piece of content we publish.</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0"></span>
                <div>
                  <strong className="text-gray-900">Diversity:</strong>
                  <span className="text-gray-600"> We celebrate diverse perspectives and voices in our content.</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0"></span>
                <div>
                  <strong className="text-gray-900">Growth:</strong>
                  <span className="text-gray-600"> We're committed to continuous learning and improvement.</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-6">
              Have questions, suggestions, or want to collaborate? We'd love to hear from you!
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Contact Us
              <span className="material-icons-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

