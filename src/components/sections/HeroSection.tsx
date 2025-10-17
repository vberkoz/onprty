import React from 'react';
import { type SiteSection } from '../../types';

interface HeroSectionProps {
  section: SiteSection;
  sectionIndex: number;
  totalSections: number;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (field: string, value: unknown) => void;
  onMove: (direction: 'up' | 'down') => void;
  onRemove: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  section,
  sectionIndex,
  totalSections,
  isExpanded,
  onToggle,
  onUpdate,
  onMove,
  onRemove
}) => {
  const isHero = section.type === 'hero';
  
  return (
    <div className="accordion-item">
      <div className="item-header">
        <button onClick={onToggle} className="item-toggle">
          {isExpanded ? '▼' : '▶'} {isHero ? '🦸 Hero Section' : '📣 Call to Action'}
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
            <input
              type="text"
              value={(section.data.subheading || section.data.description) as string || ''}
              onChange={(e) => onUpdate('subheading', e.target.value)}
            />
          </label>
          <label>
            Button Text:
            <input
              type="text"
              value={(section.data.ctaText || section.data.buttonText) as string || ''}
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
        </div>
      )}
    </div>
  );
};

export default HeroSection;
