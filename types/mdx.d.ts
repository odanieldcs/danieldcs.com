
interface MDXFrontmatter {
  title: string;
  publishedAt?: string;
  description?: string;
  bannerUrl?: string;
  bannerCaption?: string;
  lang?: 'pt' | 'en' | 'es';
  languagesUrl?: Record<string, string>;
  meta?: {
    keywords?: string[];
  };
}

interface MDXModule {
  default: JSX.Element;
  frontmatter: MDXFrontmatter;
}

export { MDXFrontmatter, MDXModule };
