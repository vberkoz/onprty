import React from 'react';
import { type SiteSection } from '../../types';

interface LandingHeroSectionProps {
  section: SiteSection;
  sectionIndex: number;
  totalSections: number;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (field: string, value: unknown) => void;
  onMove: (direction: 'up' | 'down') => void;
  onRemove: () => void;
}

export const LandingHeroSection: React.FC<LandingHeroSectionProps> = ({
  section,
  sectionIndex,
  totalSections,
  isExpanded,
  onToggle,
  onUpdate,
  onMove,
  onRemove
}) => {
  return (
    <div className="accordion-item">
      <div className="item-header">
        <button onClick={onToggle} className="item-toggle">
          {isExpanded ? '▼' : '▶'} 🚀 Landing Hero
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
            Heading:
            <input
              type="text"
              value={section.data.heading as string || ''}
              onChange={(e) => onUpdate('heading', e.target.value)}
            />
          </label>
          <label>
            Subheading:
            <textarea
              value={section.data.subheading as string || ''}
              onChange={(e) => onUpdate('subheading', e.target.value)}
              rows={2}
            />
          </label>
          <label>
            Button Text:
            <input
              type="text"
              value={section.data.ctaText as string || ''}
              onChange={(e) => onUpdate('ctaText', e.target.value)}
            />
          </label>
          <label>
            Button Link:
            <input
              type="text"
              value={section.data.ctaLink as string || ''}
              onChange={(e) => onUpdate('ctaLink', e.target.value)}
            />
          </label>
          <label>
            Trust Signal:
            <input
              type="text"
              value={section.data.trustSignal as string || ''}
              onChange={(e) => onUpdate('trustSignal', e.target.value)}
              placeholder="⭐ Trusted by 10k+ users"
            />
          </label>
        </div>
      )}
    </div>
  );
};
