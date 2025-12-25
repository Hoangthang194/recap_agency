'use client';

import React from 'react';
import Link from 'next/link';
import { Post } from '@/types';
import { getPostUrl } from '@/utils/post';

interface PostCardProps {
  post: Post;
  className?: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, className = '' }) => {
  return (
    <div className={`group flex flex-col h-full ${className}`}>
      <Link href={getPostUrl(post)} className="block overflow-hidden rounded-2xl mb-5 relative aspect-[4/3]">
        <img 
          src={post.thumbnail || post.image} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>
      
      <div className="flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
            <span className="material-icons-outlined text-sm text-primary">folder_open</span>
             <span className="text-xs font-bold text-primary uppercase tracking-wide">{post.category}</span>
        </div>

        <Link href={getPostUrl(post)} className="block mb-3">
          <h3 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="mt-auto flex items-center gap-3 pt-4 border-t border-gray-100">
          <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full object-cover" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-900">{post.author.name}</span>
            <span className="text-[10px] text-gray-400 font-medium">{post.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;