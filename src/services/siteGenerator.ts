// Site generation service
export interface SiteMetadata {
  title: string;
  navTitle: string;
  description: string;
  author: string;
}

export interface SiteSection {
  type: 'hero' | 'features' | 'text_block' | 'call_to_action' | 'team_members';
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

import systemPromptText from './system-prompt.txt?raw';

// Mono template imports
import monoBase from './templates/mono/base.html?raw';
import monoStyles from './templates/mono/styles.css?raw';
import monoScript from './templates/mono/script.js?raw';
import monoHero from './templates/mono/hero.html?raw';
import monoFeatures from './templates/mono/features.html?raw';
import monoFeaturesItem from './templates/mono/features-item.html?raw';
import monoTextBlock from './templates/mono/text-block.html?raw';
import monoCallToAction from './templates/mono/call-to-action.html?raw';
import monoTeamMembers from './templates/mono/team-members.html?raw';
import monoTeamMemberItem from './templates/mono/team-member-item.html?raw';

// Modern template imports
import modernBase from './templates/modern/base.html?raw';
import modernStyles from './templates/modern/styles.css?raw';
import modernScript from './templates/modern/script.js?raw';
import modernHero from './templates/modern/hero.html?raw';
import modernFeatures from './templates/modern/features.html?raw';
import modernFeaturesItem from './templates/modern/features-item.html?raw';
import modernTextBlock from './templates/modern/text-block.html?raw';
import modernCallToAction from './templates/modern/call-to-action.html?raw';
import modernTeamMembers from './templates/modern/team-members.html?raw';
import modernTeamMemberItem from './templates/modern/team-member-item.html?raw';

// Template registry
const templates: { [templateName: string]: { [fileName: string]: string } } = {
  mono: {
    'base.html': monoBase,
    'styles.css': monoStyles,
    'script.js': monoScript,
    'hero.html': monoHero,
    'features.html': monoFeatures,
    'features-item.html': monoFeaturesItem,
    'text-block.html': monoTextBlock,
    'call-to-action.html': monoCallToAction,
    'team-members.html': monoTeamMembers,
    'team-member-item.html': monoTeamMemberItem,
  },
  modern: {
    'base.html': modernBase,
    'styles.css': modernStyles,
    'script.js': modernScript,
    'hero.html': modernHero,
    'features.html': modernFeatures,
    'features-item.html': modernFeaturesItem,
    'text-block.html': modernTextBlock,
    'call-to-action.html': modernCallToAction,
    'team-members.html': modernTeamMembers,
    'team-member-item.html': modernTeamMemberItem,
  },
};

function getTemplate(templateName: string, fileName: string): string {
  return templates[templateName]?.[fileName] || '';
}

const API_URL = import.meta.env.VITE_API_URL || 'https://ln31vyuhij.execute-api.us-east-1.amazonaws.com';

export async function generateSite(prompt: string, template: string = 'mono'): Promise<{ siteData: SiteData; siteFiles: SiteFiles }> {
  const response = await fetch(`${API_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user: prompt,
      system: systemPromptText,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  const siteData: SiteData = JSON.parse(data.output);
  const siteFiles = generateHTML(siteData, template);
  
  // Add the original JSON schema to files with user prompt
  const schemaWithPrompt = {
    userPrompt: prompt,
    generatedData: siteData
  };
  siteFiles['schema.json'] = JSON.stringify(schemaWithPrompt, null, 2);
  
  return { siteData, siteFiles };
}

function generateHTML(siteData: SiteData, template: string = 'mono'): SiteFiles {
  const siteFiles: SiteFiles = {};
  
  // Generate navigation
  const navItems = siteData.pages
    .filter(page => page.fileName !== 'index.html')
    .map(page => `<a href="${page.fileName}">${page.navLabel}</a>`)
    .join('');
  
  const nav = `<nav><a href="index.html">${siteData.siteMetadata.navTitle}</a><div class="nav-links">${navItems}</div></nav>`;
  
  // Generate pages
  for (const page of siteData.pages) {
    let pageContent = '';
    for (const section of page.sections) {
      pageContent += generateSection(section, template);
    }
    
    const baseTemplate = getTemplate(template, 'base.html');
    const stylesTemplate = getTemplate(template, 'styles.css');
    const scriptTemplate = getTemplate(template, 'script.js');
    
    const html = baseTemplate
      .replace(/{{pageTitle}}/g, page.pageTitle)
      .replace(/{{siteDescription}}/g, siteData.siteMetadata.description)
      .replace(/{{navigation}}/g, nav)
      .replace(/{{content}}/g, pageContent)
      .replace(/{{currentYear}}/g, new Date().getFullYear().toString())
      .replace(/{{siteAuthor}}/g, siteData.siteMetadata.author)
      .replace('<link rel="stylesheet" href="styles.css">', `<style>${stylesTemplate}</style>`)
      .replace('<script src="script.js"></script>', `<script>${scriptTemplate}</script>`);
    
    siteFiles[page.fileName] = html;
  }
  
  const stylesTemplate = getTemplate(template, 'styles.css');
  const scriptTemplate = getTemplate(template, 'script.js');
  
  siteFiles['styles.css'] = stylesTemplate;
  siteFiles['script.js'] = scriptTemplate;
  
  return siteFiles;
}

const DEFAULT_ICONS = ['⚡', '🎨', '📱', '🚀', '💡', '🔧', '📊', '🎯', '🌟', '💎'];

const mapCtaData = (data: Record<string, unknown>) => {
  let ctaLink = data.ctaLink || '#';
  // Convert absolute paths to relative for iframe navigation
  if (typeof ctaLink === 'string' && ctaLink.startsWith('/')) {
    ctaLink = ctaLink.substring(1);
  }
  return {
    heading: data.heading,
    subheading: data.subheading || data.description,
    ctaText: data.ctaText || data.buttonText || 'Learn More',
    ctaLink
  };
};

function generateSection(section: SiteSection, template: string = 'mono'): string {
  const { type, data } = section;
  
  switch (type) {
    case 'hero': {
      const heroTemplate = getTemplate(template, 'hero.html');
      return replaceTemplateVars(heroTemplate, mapCtaData(data));
    }
    
    case 'features': {
      const featuresTemplate = getTemplate(template, 'features.html');
      const featuresItemTemplate = getTemplate(template, 'features-item.html');
      const items = (data.items || data.features) as Record<string, unknown>[] || [];
      const featuresHtml = items.map((item, index) => 
        replaceTemplateVars(featuresItemTemplate, {
          icon: item.icon || DEFAULT_ICONS[index % DEFAULT_ICONS.length],
          heading: item.heading || item.title,
          description: item.description
        })
      ).join('');
      return replaceTemplateVars(featuresTemplate, { ...data, items: featuresHtml });
    }
    
    case 'text_block': {
      const textBlockTemplate = getTemplate(template, 'text-block.html');
      return replaceTemplateVars(textBlockTemplate, {
        title: data.title || data.heading,
        content: data.content || data.text
      });
    }
    
    case 'call_to_action': {
      const callToActionTemplate = getTemplate(template, 'call-to-action.html');
      return replaceTemplateVars(callToActionTemplate, mapCtaData(data));
    }
    
    case 'team_members': {
      const teamMembersTemplate = getTemplate(template, 'team-members.html');
      const teamMemberItemTemplate = getTemplate(template, 'team-member-item.html');
      const members = data.members as Record<string, unknown>[] || [];
      const membersHtml = members.map(member => 
        replaceTemplateVars(teamMemberItemTemplate, {
          image: member.image || 'https://via.placeholder.com/150',
          name: member.name,
          role: member.role,
          bio: member.bio || member.description
        })
      ).join('');
      return replaceTemplateVars(teamMembersTemplate, { ...data, members: membersHtml });
    }
    
    default:
      return '';
  }
}

function replaceTemplateVars(template: string, data: Record<string, unknown>): string {
  let result = template;
  for (const key in data) {
    const value = data[key];
    if (value !== null && value !== undefined) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }
  }
  // Replace any remaining unreplaced placeholders with empty string
  result = result.replace(/{{[^}]+}}/g, '');
  return result;
}

