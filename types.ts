export interface Author {
  id: string;
  name: string;
  avatar: string;
}

export interface SidebarBanner {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink?: string;
  backgroundColor?: string;
  image?: string; // Banner image URL
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  image: string; // Banner image
  thumbnail: string; // Thumbnail image
  category: string;
  author: Author;
  date: string;
  readTime?: string;
  slug: string; // Required slug field
  content?: string; // HTML content
  sidebarBanner?: SidebarBanner; // Sidebar banner data
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  colorClass: string;
  description?: string;
  isCity?: boolean; // Phân biệt city với category
  areaId?: string; // Area reference cho city
  countryId?: string; // Country reference cho city
}

export interface Area {
  id: string;
  name: string;
  region: string;
  icon: string;
  image: string;
  colorClass: string;
  description: string;
}

export interface Country {
  id: string;
  name: string;
  region: string;
  icon: string;
  image: string;
  colorClass: string;
  description: string;
  categories: Category[];
  areaId?: string; // Optional area reference
}

export interface City {
  id: string;
  name: string;
  icon: string;
  image: string;
  colorClass: string;
  description: string;
  areaId: string; // Area reference
  countryId: string; // Country reference
}