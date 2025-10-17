import React from 'react';
import type { SiteSection } from '../../types';

interface ContactFormSectionProps {
  section: SiteSection;
  sectionIndex: number;
  totalSections: number;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (field: string, value: unknown) => void;
  onMove: (direction: 'up' | 'down') => void;
  onRemove: () => void;
}

const ContactFormSection: React.FC<ContactFormSectionProps> = ({
  section,
  sectionIndex,
  totalSections,
  isExpanded,
  onToggle,
  onUpdate,
  onMove,
  onRemove
}) => {
  const socialLinks = (section.data.socialLinks as Record<string, unknown>[]) || [];

  const updateSocialLink = (idx: number, field: string, value: string) => {
    const updated = [...socialLinks];
    updated[idx] = { ...updated[idx], [field]: value };
    onUpdate('socialLinks', updated);
  };

  const addSocialLink = () => {
    onUpdate('socialLinks', [...socialLinks, { platform: 'Platform', url: 'https://' }]);
  };

  const removeSocialLink = (idx: number) => {
    const updated = [...socialLinks];
    updated.splice(idx, 1);
    onUpdate('socialLinks', updated);
  };

  return (
    <div className="accordion-item">
      <div className="item-header">
        <button onClick={onToggle} className="item-toggle">
          {isExpanded ? '▼' : '▶'} ✉️ Contact Form
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
            Title:
            <input type="text" value={section.data.title as string || ''} onChange={(e) => onUpdate('title', e.target.value)} />
          </label>
          <label>
            Description:
            <textarea value={section.data.description as string || ''} onChange={(e) => onUpdate('description', e.target.value)} rows={2} />
          </label>
          <label>
            Submit Button Text:
            <input type="text" value={section.data.submitText as string || ''} onChange={(e) => onUpdate('submitText', e.target.value)} />
          </label>
          <label>
            Email:
            <input type="email" value={section.data.email as string || ''} onChange={(e) => onUpdate('email', e.target.value)} />
          </label>
          <h4 style={{ marginTop: '1rem' }}>Social Links:</h4>
          {socialLinks.map((link, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input type="text" placeholder="Platform" value={link.platform as string || ''} onChange={(e) => updateSocialLink(idx, 'platform', e.target.value)} />
              <input type="text" placeholder="URL" value={link.url as string || ''} onChange={(e) => updateSocialLink(idx, 'url', e.target.value)} />
              <button onClick={() => removeSocialLink(idx)} className="remove-btn">✕</button>
            </div>
          ))}
          <button onClick={addSocialLink} style={{ fontSize: '0.85rem' }}>+ Add Social Link</button>
        </div>
      )}
    </div>
  );
};

export default ContactFormSection;
