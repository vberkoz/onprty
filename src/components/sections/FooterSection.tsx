import React from 'react';
import { type SiteSection } from '../../types';

interface Link {
  label: string;
  url: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface FooterSectionProps {
  section: SiteSection;
  sectionIndex: number;
  totalSections: number;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (field: string, value: unknown) => void;
  onMove: (direction: 'up' | 'down') => void;
  onRemove: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  section,
  sectionIndex,
  totalSections,
  isExpanded,
  onToggle,
  onUpdate,
  onMove,
  onRemove
}) => {
  const data = section.data as { contactText: string; links: Link[]; socialLinks: SocialLink[] };
  
  const onChange = (newData: { contactText: string; links: Link[]; socialLinks: SocialLink[] }) => {
    onUpdate('', newData);
  };
  const updateLink = (index: number, field: keyof Link, value: string) => {
    const updated = [...data.links];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, links: updated });
  };

  const addLink = () => {
    onChange({ ...data, links: [...data.links, { label: '', url: '#' }] });
  };

  const removeLink = (index: number) => {
    onChange({ ...data, links: data.links.filter((_, i) => i !== index) });
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...data.socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, socialLinks: updated });
  };

  const addSocialLink = () => {
    onChange({ ...data, socialLinks: [...data.socialLinks, { platform: '', url: '' }] });
  };

  const removeSocialLink = (index: number) => {
    onChange({ ...data, socialLinks: data.socialLinks.filter((_, i) => i !== index) });
  };

  return (
    <div className="accordion-item">
      <div className="item-header">
        <button onClick={onToggle} className="item-toggle">
          {isExpanded ? '▼' : '▶'} 👣 Footer
        </button>
        <div className="item-controls">
          {sectionIndex > 0 && <button onClick={(e) => { e.stopPropagation(); onMove('up'); }}>↑</button>}
          {sectionIndex < totalSections - 1 && <button onClick={(e) => { e.stopPropagation(); onMove('down'); }}>↓</button>}
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="remove-btn">✕</button>
        </div>
      </div>
      {isExpanded && (
      <div className="accordion-content">
      <label>
        Contact Text:
        <input
          type="text"
          value={data.contactText}
          onChange={(e) => onChange({ ...data, contactText: e.target.value })}
        />
      </label>
      
      <div style={{ marginTop: '1rem' }}>
        <strong>Links:</strong>
        {data.links.map((link, index) => (
          <div key={index} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="text"
              value={link.label}
              onChange={(e) => updateLink(index, 'label', e.target.value)}
              placeholder="Label"
              style={{ flex: 1, minWidth: 0 }}
            />
            <input
              type="text"
              value={link.url}
              onChange={(e) => updateLink(index, 'url', e.target.value)}
              placeholder="URL"
              style={{ flex: 1, minWidth: 0 }}
            />
            <button onClick={() => removeLink(index)} style={{ padding: '0.25rem 0.5rem', border: '1px solid #ddd', backgroundColor: 'white', borderRadius: '3px', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'IBM Plex Mono, monospace', color: '#dc3545', borderColor: '#dc3545', flexShrink: 0 }}>✕</button>
          </div>
        ))}
        <button onClick={addLink} className="add-item-btn" style={{ marginTop: '0.5rem' }}>+ Add Link</button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <strong>Social Links:</strong>
        {data.socialLinks.map((link, index) => (
          <div key={index} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="text"
              value={link.platform}
              onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
              placeholder="Platform"
              style={{ flex: 1, minWidth: 0 }}
            />
            <input
              type="text"
              value={link.url}
              onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
              placeholder="URL"
              style={{ flex: 1, minWidth: 0 }}
            />
            <button onClick={() => removeSocialLink(index)} style={{ padding: '0.25rem 0.5rem', border: '1px solid #ddd', backgroundColor: 'white', borderRadius: '3px', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'IBM Plex Mono, monospace', color: '#dc3545', borderColor: '#dc3545', flexShrink: 0 }}>✕</button>
          </div>
        ))}
        <button onClick={addSocialLink} className="add-item-btn" style={{ marginTop: '0.5rem' }}>+ Add Social Link</button>
      </div>
      </div>
      )}
    </div>
  );
};
