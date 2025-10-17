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
import monospaceProjectGrid from '../templates/monospace/project-grid.html?raw';
import monospaceProjectItem from '../templates/monospace/project-item.html?raw';
import monospaceSkillsMatrix from '../templates/monospace/skills-matrix.html?raw';
import monospaceSkillCategory from '../templates/monospace/skill-category.html?raw';
import monospaceExperienceTimeline from '../templates/monospace/experience-timeline.html?raw';
import monospaceExperienceItem from '../templates/monospace/experience-item.html?raw';
import monospaceContactForm from '../templates/monospace/contact-form.html?raw';

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
import neubrutalismProjectGrid from '../templates/neubrutalism/project-grid.html?raw';
import neubrutalismProjectItem from '../templates/neubrutalism/project-item.html?raw';
import neubrutalismSkillsMatrix from '../templates/neubrutalism/skills-matrix.html?raw';
import neubrutalismSkillCategory from '../templates/neubrutalism/skill-category.html?raw';
import neubrutalismExperienceTimeline from '../templates/neubrutalism/experience-timeline.html?raw';
import neubrutalismExperienceItem from '../templates/neubrutalism/experience-item.html?raw';
import neubrutalismContactForm from '../templates/neubrutalism/contact-form.html?raw';

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
import swissProjectGrid from '../templates/swiss/project-grid.html?raw';
import swissProjectItem from '../templates/swiss/project-item.html?raw';
import swissSkillsMatrix from '../templates/swiss/skills-matrix.html?raw';
import swissSkillCategory from '../templates/swiss/skill-category.html?raw';
import swissExperienceTimeline from '../templates/swiss/experience-timeline.html?raw';
import swissExperienceItem from '../templates/swiss/experience-item.html?raw';
import swissContactForm from '../templates/swiss/contact-form.html?raw';

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
import terminalProjectGrid from '../templates/terminal/project-grid.html?raw';
import terminalProjectItem from '../templates/terminal/project-item.html?raw';
import terminalSkillsMatrix from '../templates/terminal/skills-matrix.html?raw';
import terminalSkillCategory from '../templates/terminal/skill-category.html?raw';
import terminalExperienceTimeline from '../templates/terminal/experience-timeline.html?raw';
import terminalExperienceItem from '../templates/terminal/experience-item.html?raw';
import terminalContactForm from '../templates/terminal/contact-form.html?raw';

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
    'project-grid.html': monospaceProjectGrid,
    'project-item.html': monospaceProjectItem,
    'skills-matrix.html': monospaceSkillsMatrix,
    'skill-category.html': monospaceSkillCategory,
    'experience-timeline.html': monospaceExperienceTimeline,
    'experience-item.html': monospaceExperienceItem,
    'contact-form.html': monospaceContactForm,
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
    'project-grid.html': neubrutalismProjectGrid,
    'project-item.html': neubrutalismProjectItem,
    'skills-matrix.html': neubrutalismSkillsMatrix,
    'skill-category.html': neubrutalismSkillCategory,
    'experience-timeline.html': neubrutalismExperienceTimeline,
    'experience-item.html': neubrutalismExperienceItem,
    'contact-form.html': neubrutalismContactForm,
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
    'project-grid.html': swissProjectGrid,
    'project-item.html': swissProjectItem,
    'skills-matrix.html': swissSkillsMatrix,
    'skill-category.html': swissSkillCategory,
    'experience-timeline.html': swissExperienceTimeline,
    'experience-item.html': swissExperienceItem,
    'contact-form.html': swissContactForm,
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
    'project-grid.html': terminalProjectGrid,
    'project-item.html': terminalProjectItem,
    'skills-matrix.html': terminalSkillsMatrix,
    'skill-category.html': terminalSkillCategory,
    'experience-timeline.html': terminalExperienceTimeline,
    'experience-item.html': terminalExperienceItem,
    'contact-form.html': terminalContactForm,
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
    
    case 'project_grid': {
      const projectGridTemplate = getTemplate(template, 'project-grid.html');
      const projectItemTemplate = getTemplate(template, 'project-item.html');
      const projects = data.projects as Record<string, unknown>[] || [];
      const projectsHtml = projects.map(project => 
        replaceTemplateVars(projectItemTemplate, {
          title: project.title,
          category: project.category,
          description: project.description,
          image: project.image || DEFAULT_PLACEHOLDER_IMAGE,
          link: project.link || '#'
        })
      ).join('');
      return replaceTemplateVars(projectGridTemplate, { ...data, projects: projectsHtml });
    }
    
    case 'skills_matrix': {
      const skillsMatrixTemplate = getTemplate(template, 'skills-matrix.html');
      const skillCategoryTemplate = getTemplate(template, 'skill-category.html');
      const categories = data.categories as Record<string, unknown>[] || [];
      const categoriesHtml = categories.map(category => {
        const skills = (category.skills as string[]) || [];
        const skillsHtml = skills.map(skill => `<li>${skill}</li>`).join('');
        return replaceTemplateVars(skillCategoryTemplate, {
          categoryName: category.categoryName,
          skills: skillsHtml
        });
      }).join('');
      return replaceTemplateVars(skillsMatrixTemplate, { ...data, categories: categoriesHtml });
    }
    
    case 'experience_timeline': {
      const experienceTimelineTemplate = getTemplate(template, 'experience-timeline.html');
      const experienceItemTemplate = getTemplate(template, 'experience-item.html');
      const experiences = data.experiences as Record<string, unknown>[] || [];
      const experiencesHtml = experiences.map(exp => 
        replaceTemplateVars(experienceItemTemplate, {
          role: exp.role,
          company: exp.company,
          startDate: exp.startDate,
          endDate: exp.endDate,
          description: exp.description
        })
      ).join('');
      return replaceTemplateVars(experienceTimelineTemplate, { ...data, experiences: experiencesHtml });
    }
    
    case 'contact_form': {
      const contactFormTemplate = getTemplate(template, 'contact-form.html');
      const socialLinks = data.socialLinks as Record<string, unknown>[] || [];
      const socialLinksHtml = socialLinks.map(link => 
        `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.platform}</a>`
      ).join('');
      return replaceTemplateVars(contactFormTemplate, { ...data, socialLinks: socialLinksHtml });
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

