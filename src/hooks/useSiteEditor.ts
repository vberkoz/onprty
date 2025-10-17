import { useState, useEffect, useCallback } from 'react';
import type { StoredSite, SiteData, SiteSection } from '../types';

export const useSiteEditor = (
  selectedSite: StoredSite | null,
  onSave: (updatedData: SiteData) => void,
  onPreview: (updatedData: SiteData) => void
) => {
  const [editedData, setEditedData] = useState<SiteData | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

  useEffect(() => {
    if (selectedSite?.schema?.generatedData) {
      setEditedData(selectedSite.schema.generatedData as SiteData);
    }
  }, [selectedSite?.id, selectedSite?.schema?.generatedData]);

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

  const updateMetadata = (field: string, value: string) => {
    if (!editedData) return;
    const updated = {
      ...editedData,
      siteMetadata: { ...editedData.siteMetadata, [field]: value }
    };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const updateSection = (pageIndex: number, sectionIndex: number, field: string, value: unknown) => {
    if (!editedData) return;
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
    if (!editedData) return;
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

  const updateTeamMember = (pageIndex: number, sectionIndex: number, memberIndex: number, field: string, value: string) => {
    if (!editedData) return;
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
    if (!editedData) return;
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

  const removeFeatureItem = (pageIndex: number, sectionIndex: number, itemIndex: number) => {
    if (!editedData) return;
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

  const moveFeatureItem = (pageIndex: number, sectionIndex: number, itemIndex: number, direction: 'up' | 'down') => {
    if (!editedData) return;
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

  const addTeamMember = (pageIndex: number, sectionIndex: number) => {
    if (!editedData) return;
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
    if (!editedData) return;
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
    if (!editedData) return;
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

  const addSection = (pageIndex: number, type: 'hero' | 'features' | 'text_block' | 'call_to_action' | 'team_members') => {
    if (!editedData) return;
    const updatedPages = [...editedData.pages];
    const newSection: SiteSection = {
      type,
      data: type === 'features' ? { items: [] } : type === 'team_members' ? { members: [] } : {}
    };
    updatedPages[pageIndex].sections.push(newSection);
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const removeSection = (pageIndex: number, sectionIndex: number) => {
    if (!editedData) return;
    const updatedPages = [...editedData.pages];
    updatedPages[pageIndex].sections.splice(sectionIndex, 1);
    const updated = { ...editedData, pages: updatedPages };
    setEditedData(updated);
    onPreview(updated);
    debouncedSave(updated);
  };

  const moveSection = (pageIndex: number, sectionIndex: number, direction: 'up' | 'down') => {
    if (!editedData) return;
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

  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const updatePageTitle = (pageIndex: number, title: string) => {
    if (!editedData) return;
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
    if (!editedData) return;
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

  const addPage = () => {
    if (!editedData) return;
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
    return editedData.pages.length;
  };

  return {
    editedData,
    updateMetadata,
    updateSection,
    updateFeatureItem,
    updateTeamMember,
    addFeatureItem,
    removeFeatureItem,
    moveFeatureItem,
    addTeamMember,
    removeTeamMember,
    moveTeamMember,
    addSection,
    removeSection,
    moveSection,
    updatePageTitle,
    updateNavLabel,
    addPage
  };
};
