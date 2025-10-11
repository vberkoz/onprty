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
import baseTemplate from './templates/mono/base.html?raw';
import stylesTemplate from './templates/mono/styles.css?raw';
import scriptTemplate from './templates/mono/script.js?raw';
import heroTemplate from './templates/mono/hero.html?raw';
import featuresTemplate from './templates/mono/features.html?raw';
import featuresItemTemplate from './templates/mono/features-item.html?raw';
import textBlockTemplate from './templates/mono/text-block.html?raw';
import callToActionTemplate from './templates/mono/call-to-action.html?raw';
import teamMembersTemplate from './templates/mono/team-members.html?raw';
import teamMemberItemTemplate from './templates/mono/team-member-item.html?raw';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.onprty.com';

export async function generateSite(prompt: string): Promise<{ siteData: SiteData; siteFiles: SiteFiles }> {
  try {
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
    const siteFiles = generateHTML(siteData);
    
    return { siteData, siteFiles };
  } catch {
    // Fallback mock data
    const mockSiteData: SiteData = {
      siteMetadata: {
        title: "Generated Site",
        navTitle: "My Site",
        description: "A website generated from: " + prompt,
        author: "OnPrty Generator"
      },
      pages: [
        {
          path: "/index.html",
          fileName: "index.html",
          navLabel: "Home",
          pageTitle: "Home - Generated Site",
          sections: [
            {
              type: "hero",
              data: {
                heading: "Welcome to Your Generated Site",
                subheading: "This site was created from your prompt: " + prompt,
                ctaText: "Learn More",
                ctaLink: "#about"
              }
            }
          ]
        }
      ]
    };
    const siteFiles = generateHTML(mockSiteData);
    return { siteData: mockSiteData, siteFiles };
  }
}

function generateHTML(siteData: SiteData): SiteFiles {
  const siteFiles: SiteFiles = {};
  
  // Generate navigation
  const navItems = siteData.pages
    .filter(page => page.fileName !== 'index.html')
    .map(page => `<a href="${page.fileName}">${page.navLabel}</a>`)
    .join('');
  
  const nav = `<nav><a href="index.html">${siteData.siteMetadata.navTitle}</a>${navItems}</nav>`;
  
  // Generate pages
  for (const page of siteData.pages) {
    let pageContent = '';
    
    for (const section of page.sections) {
      pageContent += generateSection(section);
    }
    
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
  
  siteFiles['styles.css'] = stylesTemplate;
  siteFiles['script.js'] = scriptTemplate;
  
  return siteFiles;
}

function generateSection(section: SiteSection): string {
  let template = '';
  
  switch (section.type) {
    case 'hero': {
      // Map API fields to template fields
      const mappedData = {
        heading: section.data.heading,
        subheading: section.data.subheading,
        ctaText: section.data.ctaText || section.data.buttonText || 'Learn More',
        ctaLink: section.data.ctaLink || '#'
      };
      template = replaceTemplateVars(heroTemplate, mappedData);
      return template;
    }
    case 'features': {
      const items = (section.data.items || section.data.features) as Record<string, unknown>[] || [];
      const features = items.map((item) => {
        // Map API fields to template fields
        const mappedItem = {
          icon: item.icon || '⭐',
          heading: item.heading || item.title,
          description: item.description
        };
        return replaceTemplateVars(featuresItemTemplate, mappedItem);
      }).join('');
      template = featuresTemplate.replace('{{items}}', features);
      break;
    }
    case 'text_block': {
      // Map API fields to template fields
      const mappedData = {
        title: section.data.title || section.data.heading,
        content: section.data.content || section.data.text
      };
      template = replaceTemplateVars(textBlockTemplate, mappedData);
      return template;
    }
    case 'call_to_action': {
      // Map API fields to template fields
      const mappedData = {
        heading: section.data.heading,
        subheading: section.data.subheading || section.data.description,
        ctaText: section.data.ctaText || section.data.buttonText || 'Learn More',
        ctaLink: section.data.ctaLink || '#'
      };
      template = replaceTemplateVars(callToActionTemplate, mappedData);
      return template;
    }
    case 'team_members': {
      const members = section.data.members as Record<string, unknown>[] || [];
      const membersList = members.map((member) => {
        // Map API fields to template fields
        const mappedMember = {
          image: member.image || 'https://via.placeholder.com/150',
          name: member.name,
          role: member.role,
          bio: member.bio || member.description
        };
        return replaceTemplateVars(teamMemberItemTemplate, mappedMember);
      }).join('');
      template = teamMembersTemplate.replace('{{members}}', membersList);
      break;
    }
    default:
      return '';
  }
  
  return replaceTemplateVars(template, section.data);
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

