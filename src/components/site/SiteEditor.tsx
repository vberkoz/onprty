import React, { useState, useEffect, useCallback } from 'react';
import type { StoredSite, SiteData, SiteSection } from '../../types';
import HeroSection from '../sections/HeroSection';
import FeaturesSection from '../sections/FeaturesSection';
import TextBlockSection from '../sections/TextBlockSection';
import TeamMembersSection from '../sections/TeamMembersSection';
import ProjectGridSection from '../sections/ProjectGridSection';
import SkillsMatrixSection from '../sections/SkillsMatrixSection';
import ExperienceTimelineSection from '../sections/ExperienceTimelineSection';
import ContactFormSection from '../sections/ContactFormSection';

interface SiteEditorProps {
  selectedSite: StoredSite | null;
  onSave: (updatedData: SiteData) => void;
  onPreview: (updatedData: SiteData) => void;
}

const SiteEditor: React.FC<SiteEditorProps> = ({ selectedSite, onSave, onPreview }) => {
  const [editedData, setEditedData] = useState<SiteData | null>(null);
  const [expandedPage, setExpandedPage] = useState<number | null>(null);
  const [expandedMetadata, setExpandedMetadata] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

  useEffect(() => {
    if (selectedSite?.schema?.generatedData) {
      setEditedData(selectedSite.schema.generatedData as SiteData);
    }
  }, [selectedSite?.id]);

  const debouncedSave = useCallback((data: SiteData) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    const timer = setTimeout(() => {
      onSave(data);
    }, 500) as unknown as number;
    setDebounceTimer(timer);
  }, [debounceTimer, onSave]);

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, []);

  if (!selectedSite || !editedData) {
    return <div className="site-editor"><p className="no-sites">Select a site to edit</p></div>;
  }

  const updateMetadata = (field: string, value: string) => {
    const updated = {
      ...editedData,
      siteMetadata: { ...editedData.siteMetadata, [field]: value }
    };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const updateSection = (pageIndex: number, sectionIndex: number, field: string, value: unknown) => {
    const updatedPages = [...editedData.pages];
    const section = updatedPages[pageIndex].sections[sectionIndex];
    updatedPages[pageIndex].sections[sectionIndex] = {
      ...section,
      data: { ...section.data, [field]: value }
    };
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const updateFeatureItem = (pageIndex: number, sectionIndex: number, itemIndex: number, field: string, value: string) => {
    const updatedPages = [...editedData.pages];
    const section = updatedPages[pageIndex].sections[sectionIndex];
    const items = (section.data.items || section.data.features) as Record<string, unknown>[];
    items[itemIndex] = { ...items[itemIndex], [field]: value };
    updatedPages[pageIndex].sections[sectionIndex] = {
      ...section,
      data: { ...section.data, items }
    };
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const updateProjectItem = (pageIndex: number, sectionIndex: number, itemIndex: number, field: string, value: string) => {
    const updatedPages = [...editedData.pages];
    const section = updatedPages[pageIndex].sections[sectionIndex];
    const projects = section.data.projects as Record<string, unknown>[];
    projects[itemIndex] = { ...projects[itemIndex], [field]: value };
    updatedPages[pageIndex].sections[sectionIndex] = {
      ...section,
      data: { ...section.data, projects }
    };
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const updateExperienceItem = (pageIndex: number, sectionIndex: number, itemIndex: number, field: string, value: string) => {
    const updatedPages = [...editedData.pages];
    const section = updatedPages[pageIndex].sections[sectionIndex];
    const experiences = section.data.experiences as Record<string, unknown>[];
    experiences[itemIndex] = { ...experiences[itemIndex], [field]: value };
    updatedPages[pageIndex].sections[sectionIndex] = {
      ...section,
      data: { ...section.data, experiences }
    };
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const updateTeamMember = (pageIndex: number, sectionIndex: number, memberIndex: number, field: string, value: string) => {
    const updatedPages = [...editedData.pages];
    const section = updatedPages[pageIndex].sections[sectionIndex];
    const members = section.data.members as Record<string, unknown>[];
    members[memberIndex] = { ...members[memberIndex], [field]: value };
    updatedPages[pageIndex].sections[sectionIndex] = {
      ...section,
      data: { ...section.data, members }
    };
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const addFeatureItem = (pageIndex: number, sectionIndex: number) => {
    const updatedPages = [...editedData.pages];
    const section = updatedPages[pageIndex].sections[sectionIndex];
    const items = (section.data.items || section.data.features || []) as Record<string, unknown>[];
    items.push({ icon: '⭐', heading: 'New Feature', description: 'Feature description' });
    updatedPages[pageIndex].sections[sectionIndex] = {
      ...section,
      data: { ...section.data, items }
    };
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const addProjectItem = (pageIndex: number, sectionIndex: number) => {
    const updatedPages = [...editedData.pages];
    const section = updatedPages[pageIndex].sections[sectionIndex];
    const projects = (section.data.projects || []) as Record<string, unknown>[];
    projects.push({ title: 'New Project', category: 'Category', description: 'Description', image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?w=400&h=300', link: '#' });
    updatedPages[pageIndex].sections[sectionIndex] = {
      ...section,
      data: { ...section.data, projects }
    };
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const addExperienceItem = (pageIndex: number, sectionIndex: number) => {
    const updatedPages = [...editedData.pages];
    const section = updatedPages[pageIndex].sections[sectionIndex];
    const experiences = (section.data.experiences || []) as Record<string, unknown>[];
    experiences.push({ role: 'Role', company: 'Company', startDate: '2020', endDate: 'Present', description: 'Description' });
    updatedPages[pageIndex].sections[sectionIndex] = {
      ...section,
      data: { ...section.data, experiences }
    };
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const removeFeatureItem = (pageIndex: number, sectionIndex: number, itemIndex: number) => {
    const updatedPages = [...editedData.pages];
    const section = updatedPages[pageIndex].sections[sectionIndex];
    const items = (section.data.items || section.data.features) as Record<string, unknown>[];
    items.splice(itemIndex, 1);
    updatedPages[pageIndex].sections[sectionIndex] = {
      ...section,
      data: { ...section.data, items }
    };
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const removeProjectItem = (pageIndex: number, sectionIndex: number, itemIndex: number) => {
    const updatedPages = [...editedData.pages];
    const section = updatedPages[pageIndex].sections[sectionIndex];
    const projects = section.data.projects as Record<string, unknown>[];
    projects.splice(itemIndex, 1);
    updatedPages[pageIndex].sections[sectionIndex] = {
      ...section,
      data: { ...section.data, projects }
    };
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const removeExperienceItem = (pageIndex: number, sectionIndex: number, itemIndex: number) => {
    const updatedPages = [...editedData.pages];
    const section = updatedPages[pageIndex].sections[sectionIndex];
    const experiences = section.data.experiences as Record<string, unknown>[];
    experiences.splice(itemIndex, 1);
    updatedPages[pageIndex].sections[sectionIndex] = {
      ...section,
      data: { ...section.data, experiences }
    };
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const moveFeatureItem = (pageIndex: number, sectionIndex: number, itemIndex: number, direction: 'up' | 'down') => {
    const updatedPages = [...editedData.pages];
    const section = updatedPages[pageIndex].sections[sectionIndex];
    const items = (section.data.items || section.data.features) as Record<string, unknown>[];
    const newIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    [items[itemIndex], items[newIndex]] = [items[newIndex], items[itemIndex]];
    updatedPages[pageIndex].sections[sectionIndex] = {
      ...section,
      data: { ...section.data, items }
    };
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const moveProjectItem = (pageIndex: number, sectionIndex: number, itemIndex: number, direction: 'up' | 'down') => {
    const updatedPages = [...editedData.pages];
    const section = updatedPages[pageIndex].sections[sectionIndex];
    const projects = section.data.projects as Record<string, unknown>[];
    const newIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    if (newIndex < 0 || newIndex >= projects.length) return;
    [projects[itemIndex], projects[newIndex]] = [projects[newIndex], projects[itemIndex]];
    updatedPages[pageIndex].sections[sectionIndex] = {
      ...section,
      data: { ...section.data, projects }
    };
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const moveExperienceItem = (pageIndex: number, sectionIndex: number, itemIndex: number, direction: 'up' | 'down') => {
    const updatedPages = [...editedData.pages];
    const section = updatedPages[pageIndex].sections[sectionIndex];
    const experiences = section.data.experiences as Record<string, unknown>[];
    const newIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    if (newIndex < 0 || newIndex >= experiences.length) return;
    [experiences[itemIndex], experiences[newIndex]] = [experiences[newIndex], experiences[itemIndex]];
    updatedPages[pageIndex].sections[sectionIndex] = {
      ...section,
      data: { ...section.data, experiences }
    };
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const addTeamMember = (pageIndex: number, sectionIndex: number) => {
    const updatedPages = [...editedData.pages];
    const section = updatedPages[pageIndex].sections[sectionIndex];
    const members = (section.data.members || []) as Record<string, unknown>[];
    members.push({ name: 'New Member', role: 'Role', bio: 'Bio', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150&h=150' });
    updatedPages[pageIndex].sections[sectionIndex] = {
      ...section,
      data: { ...section.data, members }
    };
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const removeTeamMember = (pageIndex: number, sectionIndex: number, memberIndex: number) => {
    const updatedPages = [...editedData.pages];
    const section = updatedPages[pageIndex].sections[sectionIndex];
    const members = section.data.members as Record<string, unknown>[];
    members.splice(memberIndex, 1);
    updatedPages[pageIndex].sections[sectionIndex] = {
      ...section,
      data: { ...section.data, members }
    };
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const moveTeamMember = (pageIndex: number, sectionIndex: number, memberIndex: number, direction: 'up' | 'down') => {
    const updatedPages = [...editedData.pages];
    const section = updatedPages[pageIndex].sections[sectionIndex];
    const members = section.data.members as Record<string, unknown>[];
    const newIndex = direction === 'up' ? memberIndex - 1 : memberIndex + 1;
    if (newIndex < 0 || newIndex >= members.length) return;
    [members[memberIndex], members[newIndex]] = [members[newIndex], members[memberIndex]];
    updatedPages[pageIndex].sections[sectionIndex] = {
      ...section,
      data: { ...section.data, members }
    };
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const addSection = (pageIndex: number, type: 'hero' | 'features' | 'text_block' | 'call_to_action' | 'team_members' | 'project_grid' | 'skills_matrix' | 'experience_timeline' | 'contact_form') => {
    const updatedPages = [...editedData.pages];
    const newSection: SiteSection = {
      type,
      data: type === 'features' ? { items: [] } : 
            type === 'team_members' ? { members: [] } : 
            type === 'project_grid' ? { projects: [] } : 
            type === 'skills_matrix' ? { categories: [] } : 
            type === 'experience_timeline' ? { experiences: [] } : 
            type === 'contact_form' ? { socialLinks: [] } : {}
    };
    updatedPages[pageIndex].sections.push(newSection);
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const removeSection = (pageIndex: number, sectionIndex: number) => {
    const updatedPages = [...editedData.pages];
    updatedPages[pageIndex].sections.splice(sectionIndex, 1);
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const moveSection = (pageIndex: number, sectionIndex: number, direction: 'up' | 'down') => {
    const updatedPages = [...editedData.pages];
    const sections = updatedPages[pageIndex].sections;
    const newIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    [sections[sectionIndex], sections[newIndex]] = [sections[newIndex], sections[sectionIndex]];
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const addPage = () => {
    const pageCount = editedData.pages.length + 1;
    const newPage = {
      path: `/page${pageCount}`,
      fileName: `page${pageCount}.html`,
      navLabel: `Page ${pageCount}`,
      pageTitle: `Page ${pageCount}`,
      sections: []
    };
    const updated = { ...editedData, pages: [...editedData.pages, newPage] };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
    setExpandedPage(editedData.pages.length);
  };

  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const updatePageTitle = (pageIndex: number, title: string) => {
    const updatedPages = [...editedData.pages];
    const slug = slugify(title) || 'page';
    updatedPages[pageIndex] = {
      ...updatedPages[pageIndex],
      pageTitle: title,
      fileName: pageIndex === 0 ? 'index.html' : `${slug}.html`,
      path: pageIndex === 0 ? '/' : `/${slug}`
    };
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const updateNavLabel = (pageIndex: number, label: string) => {
    const updatedPages = [...editedData.pages];
    updatedPages[pageIndex] = {
      ...updatedPages[pageIndex],
      navLabel: label
    };
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSectionEditor = (section: SiteSection, pageIndex: number, sectionIndex: number): React.ReactNode => {
    const sectionKey = `${pageIndex}-${sectionIndex}`;
    const isExpanded = expandedSections[sectionKey] ?? false;
    const totalSections = editedData.pages[pageIndex].sections.length;

    const commonProps = {
      section,
      sectionIndex,
      totalSections,
      isExpanded,
      onToggle: () => toggleSection(sectionKey),
      onUpdate: (field: string, value: unknown) => updateSection(pageIndex, sectionIndex, field, value),
      onMove: (direction: 'up' | 'down') => moveSection(pageIndex, sectionIndex, direction),
      onRemove: () => removeSection(pageIndex, sectionIndex)
    };

    switch (section.type) {
      case 'hero':
      case 'call_to_action':
        return <HeroSection key={sectionIndex} {...commonProps} />;

      case 'features':
        return (
          <FeaturesSection
            key={sectionIndex}
            {...commonProps}
            expandedItems={expandedSections}
            onToggleItem={toggleSection}
            onUpdateItem={(itemIndex, field, value) => updateFeatureItem(pageIndex, sectionIndex, itemIndex, field, value)}
            onMoveItem={(itemIndex, direction) => moveFeatureItem(pageIndex, sectionIndex, itemIndex, direction)}
            onRemoveItem={(itemIndex) => removeFeatureItem(pageIndex, sectionIndex, itemIndex)}
            onAddItem={() => addFeatureItem(pageIndex, sectionIndex)}
            sectionKey={sectionKey}
          />
        );

      case 'text_block':
        return <TextBlockSection key={sectionIndex} {...commonProps} />;

      case 'team_members':
        return (
          <TeamMembersSection
            key={sectionIndex}
            {...commonProps}
            expandedMembers={expandedSections}
            onToggleMember={toggleSection}
            onUpdateMember={(memberIndex, field, value) => updateTeamMember(pageIndex, sectionIndex, memberIndex, field, value)}
            onMoveMember={(memberIndex, direction) => moveTeamMember(pageIndex, sectionIndex, memberIndex, direction)}
            onRemoveMember={(memberIndex) => removeTeamMember(pageIndex, sectionIndex, memberIndex)}
            onAddMember={() => addTeamMember(pageIndex, sectionIndex)}
            sectionKey={sectionKey}
          />
        );

      case 'project_grid':
        return (
          <ProjectGridSection
            key={sectionIndex}
            {...commonProps}
            expandedItems={expandedSections}
            onToggleItem={toggleSection}
            onUpdateItem={(itemIndex, field, value) => updateProjectItem(pageIndex, sectionIndex, itemIndex, field, value)}
            onMoveItem={(itemIndex, direction) => moveProjectItem(pageIndex, sectionIndex, itemIndex, direction)}
            onRemoveItem={(itemIndex) => removeProjectItem(pageIndex, sectionIndex, itemIndex)}
            onAddItem={() => addProjectItem(pageIndex, sectionIndex)}
            sectionKey={sectionKey}
          />
        );

      case 'skills_matrix':
        return <SkillsMatrixSection key={sectionIndex} {...commonProps} />;

      case 'experience_timeline':
        return (
          <ExperienceTimelineSection
            key={sectionIndex}
            {...commonProps}
            expandedItems={expandedSections}
            onToggleItem={toggleSection}
            onUpdateItem={(itemIndex, field, value) => updateExperienceItem(pageIndex, sectionIndex, itemIndex, field, value)}
            onMoveItem={(itemIndex, direction) => moveExperienceItem(pageIndex, sectionIndex, itemIndex, direction)}
            onRemoveItem={(itemIndex) => removeExperienceItem(pageIndex, sectionIndex, itemIndex)}
            onAddItem={() => addExperienceItem(pageIndex, sectionIndex)}
            sectionKey={sectionKey}
          />
        );

      case 'contact_form':
        return <ContactFormSection key={sectionIndex} {...commonProps} />;

      default:
        return null;
    }
  };

  return (
    <div className="site-editor">
      <div className="accordion-item">
        <button
          className="accordion-header"
          onClick={() => setExpandedMetadata(!expandedMetadata)}
        >
          <span>⚙️ Site Metadata</span>
          <span className="accordion-arrow">{expandedMetadata ? '▼' : '▶'}</span>
        </button>
        {expandedMetadata && (
          <div className="accordion-content">
            <label>
              Site Title:
              <input
                type="text"
                value={editedData.siteMetadata.title}
                onChange={(e) => updateMetadata('title', e.target.value)}
              />
            </label>
            <label>
              Navigation Title:
              <input
                type="text"
                value={editedData.siteMetadata.navTitle}
                onChange={(e) => updateMetadata('navTitle', e.target.value)}
              />
            </label>
            <label>
              Description:
              <textarea
                value={editedData.siteMetadata.description}
                onChange={(e) => updateMetadata('description', e.target.value)}
                rows={2}
              />
            </label>
            <label>
              Author:
              <input
                type="text"
                value={editedData.siteMetadata.author}
                onChange={(e) => updateMetadata('author', e.target.value)}
              />
            </label>
          </div>
        )}
      </div>

      {editedData.pages.map((page, pageIndex) => (
        <div key={pageIndex} className="accordion-item">
          <button
            className="accordion-header"
            onClick={() => setExpandedPage(expandedPage === pageIndex ? null : pageIndex)}
          >
            <span>📄 {page.pageTitle}</span>
            <span className="accordion-arrow">{expandedPage === pageIndex ? '▼' : '▶'}</span>
          </button>
          {expandedPage === pageIndex && (
            <div className="accordion-content">
              <label>
                Page Title:
                <input
                  type="text"
                  value={page.pageTitle}
                  onChange={(e) => updatePageTitle(pageIndex, e.target.value)}
                />
              </label>
              <label>
                Nav Label:
                <input
                  type="text"
                  value={page.navLabel}
                  onChange={(e) => updateNavLabel(pageIndex, e.target.value)}
                  style={{ marginBottom: '1rem' }}
                />
              </label>
              {page.sections.map((section, sectionIndex) => 
                renderSectionEditor(section, pageIndex, sectionIndex)
              )}
              <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>Add Section:</h5>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button onClick={() => addSection(pageIndex, 'hero')} style={{ padding: '0.5rem', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace' }}>+ Hero</button>
                  <button onClick={() => addSection(pageIndex, 'features')} style={{ padding: '0.5rem', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace' }}>+ Features</button>
                  <button onClick={() => addSection(pageIndex, 'text_block')} style={{ padding: '0.5rem', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace' }}>+ Text Block</button>
                  <button onClick={() => addSection(pageIndex, 'call_to_action')} style={{ padding: '0.5rem', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace' }}>+ CTA</button>
                  <button onClick={() => addSection(pageIndex, 'team_members')} style={{ padding: '0.5rem', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace' }}>+ Team</button>
                  <button onClick={() => addSection(pageIndex, 'project_grid')} style={{ padding: '0.5rem', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace' }}>+ Projects</button>
                  <button onClick={() => addSection(pageIndex, 'skills_matrix')} style={{ padding: '0.5rem', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace' }}>+ Skills</button>
                  <button onClick={() => addSection(pageIndex, 'experience_timeline')} style={{ padding: '0.5rem', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace' }}>+ Experience</button>
                  <button onClick={() => addSection(pageIndex, 'contact_form')} style={{ padding: '0.5rem', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace' }}>+ Contact</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <button 
        onClick={addPage}
        style={{ 
          width: '100%', 
          padding: '.75rem', 
          fontSize: '0.9rem', 
          cursor: 'pointer', 
          backgroundColor: '#28a745', 
          color: 'white', 
          border: 'none', 
          fontFamily: 'IBM Plex Mono, monospace'
        }}
      >
        + Add New Page
      </button>
    </div>
  );
};

export default SiteEditor;
