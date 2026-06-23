export type Author = {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  followers?: number;
  links?: { twitter?: string; website?: string; linkedin?: string };
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover?: string;
  authorId: string;
  readingTime?: number;
  category?: string;
  createdAt: string;
  views?: number;
  tags?: string[];
  imagePrompt?: string;
  seoTitle?: string;
  metaDescription?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
};
