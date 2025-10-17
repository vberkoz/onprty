import type { SiteData, SiteFiles, SiteSchema, SiteSection } from '../../types';
import { API_BASE_URL, DEFAULT_TEMPLATE, DEFAULT_ICONS, DEFAULT_PLACEHOLDER_IMAGE, DEFAULT_CTA_TEXT } from '../../constants';
import systemPromptText from './system-prompt.txt?raw';

// Shared HTML templates
import baseTemplate from '../templates/base.html?raw';
import scriptTemplate from '../templates/script.js?raw';
import heroTemplate from '../templates/hero.html?raw';
import featuresTemplate from '../templates/features.html?raw';
import featuresItemTemplate from '../templates/features-item.html?raw';
import textBlockTemplate from '../templates/text-block.html?raw';
import callToActionTemplate from '../templates/call-to-action.html?raw';
import teamMembersTemplate from '../templates/team-members.html?raw';
import teamMemberItemTemplate from '../templates/team-member-item.html?raw';
import projectGridTemplate from '../templates/project-grid.html?raw';
import projectItemTemplate from '../templates/project-item.html?raw';
import skillsMatrixTemplate from '../templates/skills-matrix.html?raw';
import skillCategoryTemplate from '../templates/skill-category.html?raw';
import experienceTimelineTemplate from '../templates/experience-timeline.html?raw';
import experienceItemTemplate from '../templates/experience-item.html?raw';
import contactFormTemplate from '../templates/contact-form.html?raw';
import testimonialsTemplate from '../templates/testimonials.html?raw';
import pricingTemplate from '../templates/pricing.html?raw';
import landingHeroTemplate from '../templates/landing-hero.html?raw';
import landingCtaTemplate from '../templates/landing-cta.html?raw';
import problemSolutionTemplate from '../templates/problem-solution.html?raw';
import statsTemplate from '../templates/stats.html?raw';
import faqTemplate from '../templates/faq.html?raw';
import footerTemplate from '../templates/footer.html?raw';

// Template-specific CSS
import monospaceStyles from '../templates/monospace.css?raw';
import neubrutalismStyles from '../templates/neubrutalism.css?raw';
import swissStyles from '../templates/swiss.css?raw';
import terminalStyles from '../templates/terminal.css?raw';

// Template registry - shared HTML/JS, template-specific CSS
const sharedTemplates: { [fileName: string]: string } = {
  'base.html': baseTemplate,
  'script.js': scriptTemplate,
  'hero.html': heroTemplate,
  'features.html': featuresTemplate,
  'features-item.html': featuresItemTemplate,
  'text-block.html': textBlockTemplate,
  'call-to-action.html': callToActionTemplate,
  'team-members.html': teamMembersTemplate,
  'team-member-item.html': teamMemberItemTemplate,
  'project-grid.html': projectGridTemplate,
  'project-item.html': projectItemTemplate,
  'skills-matrix.html': skillsMatrixTemplate,
  'skill-category.html': skillCategoryTemplate,
  'experience-timeline.html': experienceTimelineTemplate,
  'experience-item.html': experienceItemTemplate,
  'contact-form.html': contactFormTemplate,
  'testimonials.html': testimonialsTemplate,
  'pricing.html': pricingTemplate,
  'landing-hero.html': landingHeroTemplate,
  'landing-cta.html': landingCtaTemplate,
  'problem-solution.html': problemSolutionTemplate,
  'stats.html': statsTemplate,
  'faq.html': faqTemplate,
  'footer.html': footerTemplate,
};

const styleTemplates: { [templateName: string]: string } = {
  monospace: monospaceStyles,
  neubrutalism: neubrutalismStyles,
  swiss: swissStyles,
  terminal: terminalStyles,
};

function getTemplate(templateName: string, fileName: string): string {
  if (fileName === 'styles.css') {
    return styleTemplates[templateName] || '';
  }
  return sharedTemplates[fileName] || '';
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
    
    case 'landing_hero': {
      const landingHeroTemplate = getTemplate(template, 'landing-hero.html');
      return replaceTemplateVars(landingHeroTemplate, { ...mapCtaData(data), trustSignal: data.trustSignal || '' });
    }
    
    case 'problem_solution': {
      const problemSolutionTemplate = getTemplate(template, 'problem-solution.html');
      return replaceTemplateVars(problemSolutionTemplate, data);
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
    
    case 'landing_cta': {
      const landingCtaTemplate = getTemplate(template, 'landing-cta.html');
      return replaceTemplateVars(landingCtaTemplate, mapCtaData(data));
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
    
    case 'testimonials': {
      const testimonials = data.testimonials as Record<string, unknown>[] || [];
      const testimonialsHtml = testimonials.map(t => 
        `<blockquote><p>${t.quote}</p><footer>— ${t.author}, ${t.role}</footer></blockquote>`
      ).join('');
      return `<section class="testimonials"><h2>${data.title}</h2><div class="testimonial-grid">${testimonialsHtml}</div></section>`;
    }
    
    case 'stats': {
      const stats = data.stats as Record<string, unknown>[] || [];
      const statsHtml = stats.map(s => 
        `<div class="stat"><h3>${s.value}</h3><p>${s.label}</p></div>`
      ).join('');
      return `<section class="stats-section"><div class="stats">${statsHtml}</div></section>`;
    }
    
    case 'pricing': {
      const plans = data.plans as Record<string, unknown>[] || [];
      const plansHtml = plans.map(plan => {
        const features = (plan.features as string[]) || [];
        const featuresHtml = features.map(f => `<li>${f}</li>`).join('');
        const featured = plan.featured ? ' featured' : '';
        const badge = plan.featured ? '<div class="badge">Most Popular</div>' : '';
        const period = plan.period ? `<span>${plan.period}</span>` : '';
        const secondary = plan.featured ? '' : ' secondary';
        return `<div class="pricing-card${featured}">${badge}<h3>${plan.name}</h3><p class="price">${plan.price}${period}</p><ul>${featuresHtml}</ul><a href="${plan.ctaLink}" class="cta-button${secondary}">${plan.ctaText}</a></div>`;
      }).join('');
      return `<section class="pricing"><h2>${data.title}</h2><div class="pricing-grid">${plansHtml}</div></section>`;
    }
    
    case 'faq': {
      const items = data.items as Record<string, unknown>[] || [];
      const itemsHtml = items.map(item => 
        `<div class="faq-item"><h3>${item.question}</h3><p>${item.answer}</p></div>`
      ).join('');
      return `<section class="faq"><h2>${data.title}</h2>${itemsHtml}</section>`;
    }
    
    case 'footer': {
      const links = data.links as Record<string, unknown>[] || [];
      const linksHtml = links.map(link => `<a href="${link.url}">${link.label}</a>`).join('');
      const socialLinks = data.socialLinks as Record<string, unknown>[] || [];
      const socialLinksHtml = socialLinks.map(link => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.platform}</a>`).join('');
      return `<section class="footer-section"><div class="footer-content"><p>${data.contactText}</p><div class="footer-links">${linksHtml}</div><div class="social-links">${socialLinksHtml}</div></div></section>`;
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

