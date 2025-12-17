export interface Author {
  name: string;
  avatar: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: Author;
  date: string;
  readTime?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  colorClass: string;
  description?: string;
}

export interface City {
  id: string;
  name: string;
  region: string;
  icon: string;
  image: string;
  colorClass: string;
  description: string;
  categories: Category[];
}