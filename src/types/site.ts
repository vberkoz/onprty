export interface SiteMetadata {
  title: string;
  navTitle: string;
  description: string;
  author: string;
  slug: string;
}

export interface SiteSection {
  type: 'hero' | 'landing_hero' | 'problem_solution' | 'features' | 'text_block' | 'call_to_action' | 'landing_cta' | 'team_members' | 'project_grid' | 'skills_matrix' | 'experience_timeline' | 'contact_form' | 'testimonials' | 'stats' | 'pricing' | 'faq' | 'footer';
  data: Record<string, unknown>;
}

export interface SitePage {
  path: string;
  fileName: string;
  navLabel: string;
  pageTitle: string;
  sections: SiteSection[];
}

export interface SiteData {
  siteMetadata: SiteMetadata;
  pages: SitePage[];
}

export interface SiteFiles {
  [fileName: string]: string;
}

export interface SiteSchema {
  userPrompt: string;
  generatedData: SiteData;
  template: string;
}

export interface StoredSite {
  id: string;
  name: string;
  description: string;
  slug?: string;
  schema?: SiteSchema;
  files?: SiteFiles;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'error';
  publishedUrl?: string;
}
