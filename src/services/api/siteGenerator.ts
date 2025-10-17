import type { SiteData, SiteFiles, SiteSchema, SiteSection } from '../../types';
import { API_BASE_URL, DEFAULT_TEMPLATE, DEFAULT_ICONS, DEFAULT_PLACEHOLDER_IMAGE, DEFAULT_CTA_TEXT } from '../../constants';
import systemPromptText from './system-prompt.txt?raw';

// Mono template imports
import monospaceBase from '../templates/monospace/base.html?raw';
import monospaceStyles from '../templates/monospace/styles.css?raw';
import monospaceScript from '../templates/monospace/script.js?raw';
import monospaceHero from '../templates/monospace/hero.html?raw';
import monospaceFeatures from '../templates/monospace/features.html?raw';
import monospaceFeaturesItem from '../templates/monospace/features-item.html?raw';
import monospaceTextBlock from '../templates/monospace/text-block.html?raw';
import monospaceCallToAction from '../templates/monospace/call-to-action.html?raw';
import monospaceTeamMembers from '../templates/monospace/team-members.html?raw';
import monospaceTeamMemberItem from '../templates/monospace/team-member-item.html?raw';

// Modern template imports
import neubrutalismBase from '../templates/neubrutalism/base.html?raw';
import neubrutalismStyles from '../templates/neubrutalism/styles.css?raw';
import neubrutalismScript from '../templates/neubrutalism/script.js?raw';
import neubrutalismHero from '../templates/neubrutalism/hero.html?raw';
import neubrutalismFeatures from '../templates/neubrutalism/features.html?raw';
import neubrutalismFeaturesItem from '../templates/neubrutalism/features-item.html?raw';
import neubrutalismTextBlock from '../templates/neubrutalism/text-block.html?raw';
import neubrutalismCallToAction from '../templates/neubrutalism/call-to-action.html?raw';
import neubrutalismTeamMembers from '../templates/neubrutalism/team-members.html?raw';
import neubrutalismTeamMemberItem from '../templates/neubrutalism/team-member-item.html?raw';

// Swiss template imports
import swissBase from '../templates/swiss/base.html?raw';
import swissStyles from '../templates/swiss/styles.css?raw';
import swissScript from '../templates/swiss/script.js?raw';
import swissHero from '../templates/swiss/hero.html?raw';
import swissFeatures from '../templates/swiss/features.html?raw';
import swissFeaturesItem from '../templates/swiss/features-item.html?raw';
import swissTextBlock from '../templates/swiss/text-block.html?raw';
import swissCallToAction from '../templates/swiss/call-to-action.html?raw';
import swissTeamMembers from '../templates/swiss/team-members.html?raw';
import swissTeamMemberItem from '../templates/swiss/team-member-item.html?raw';

// Terminal template imports
import terminalBase from '../templates/terminal/base.html?raw';
import terminalStyles from '../templates/terminal/styles.css?raw';
import terminalScript from '../templates/terminal/script.js?raw';
import terminalHero from '../templates/terminal/hero.html?raw';
import terminalFeatures from '../templates/terminal/features.html?raw';
import terminalFeaturesItem from '../templates/terminal/features-item.html?raw';
import terminalTextBlock from '../templates/terminal/text-block.html?raw';
import terminalCallToAction from '../templates/terminal/call-to-action.html?raw';
import terminalTeamMembers from '../templates/terminal/team-members.html?raw';
import terminalTeamMemberItem from '../templates/terminal/team-member-item.html?raw';

// Template registry
const templates: { [templateName: string]: { [fileName: string]: string } } = {
  monospace: {
    'base.html': monospaceBase,
    'styles.css': monospaceStyles,
    'script.js': monospaceScript,
    'hero.html': monospaceHero,
    'features.html': monospaceFeatures,
    'features-item.html': monospaceFeaturesItem,
    'text-block.html': monospaceTextBlock,
    'call-to-action.html': monospaceCallToAction,
    'team-members.html': monospaceTeamMembers,
    'team-member-item.html': monospaceTeamMemberItem,
  },
  neubrutalism: {
    'base.html': neubrutalismBase,
    'styles.css': neubrutalismStyles,
    'script.js': neubrutalismScript,
    'hero.html': neubrutalismHero,
    'features.html': neubrutalismFeatures,
    'features-item.html': neubrutalismFeaturesItem,
    'text-block.html': neubrutalismTextBlock,
    'call-to-action.html': neubrutalismCallToAction,
    'team-members.html': neubrutalismTeamMembers,
    'team-member-item.html': neubrutalismTeamMemberItem,
  },
  swiss: {
    'base.html': swissBase,
    'styles.css': swissStyles,
    'script.js': swissScript,
    'hero.html': swissHero,
    'features.html': swissFeatures,
    'features-item.html': swissFeaturesItem,
    'text-block.html': swissTextBlock,
    'call-to-action.html': swissCallToAction,
    'team-members.html': swissTeamMembers,
    'team-member-item.html': swissTeamMemberItem,
  },
  terminal: {
    'base.html': terminalBase,
    'styles.css': terminalStyles,
    'script.js': terminalScript,
    'hero.html': terminalHero,
    'features.html': terminalFeatures,
    'features-item.html': terminalFeaturesItem,
    'text-block.html': terminalTextBlock,
    'call-to-action.html': terminalCallToAction,
    'team-members.html': terminalTeamMembers,
    'team-member-item.html': terminalTeamMemberItem,
  },
};

function getTemplate(templateName: string, fileName: string): string {
  return templates[templateName]?.[fileName] || '';
}

async function ensureUniqueSlug(slug: string): Promise<string> {
  try {
    const tokens = localStorage.getItem('cognitoTokens');
    if (!tokens) return slug;
    
    const { accessToken } = JSON.parse(tokens);
    const response = await fetch(`${API_BASE_URL}/sites/check-slug`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ slug }),
    });
    
    if (!response.ok) return slug;
    
    const { exists } = await response.json();
    if (!exists) return slug;
    
    return `${slug}-${crypto.randomUUID().slice(0, 4)}`;
  } catch {
    return slug;
  }
}

export async function generateSite(prompt: string, template: string = DEFAULT_TEMPLATE): Promise<{ siteData: SiteData; siteFiles: SiteFiles; schema: SiteSchema }> {
  const response = await fetch(`${API_BASE_URL}/generate`, {
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
  
  siteData.siteMetadata.slug = await ensureUniqueSlug(siteData.siteMetadata.slug);
  
  const siteFiles = generateHTML(siteData, template);
  
  const schema = {
    userPrompt: prompt,
    generatedData: siteData,
    template,
  };
  
  return { siteData, siteFiles, schema };
}

export function generateHTML(siteData: SiteData, template: string = DEFAULT_TEMPLATE): SiteFiles {
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

const mapCtaData = (data: Record<string, unknown>) => {
  let ctaLink = data.ctaLink || '#';
  // Convert absolute paths to relative for iframe navigation
  if (typeof ctaLink === 'string' && ctaLink.startsWith('/')) {
    ctaLink = ctaLink.substring(1);
  }
  return {
    heading: data.heading,
    subheading: data.subheading || data.description,
    ctaText: data.ctaText || data.buttonText || DEFAULT_CTA_TEXT,
    ctaLink
  };
};

function generateSection(section: SiteSection, template: string = DEFAULT_TEMPLATE): string {
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
          image: member.image || DEFAULT_PLACEHOLDER_IMAGE,
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

