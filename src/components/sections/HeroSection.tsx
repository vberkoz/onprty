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
      <button className="accordion-header" onClick={onToggle}>
        <span>{isHero ? '🦸 Hero Section' : '📣 Call to Action'}</span>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={(e) => { e.stopPropagation(); onMove('up'); }}
            disabled={sectionIndex === 0}
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace' }}
          >
            ▲
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMove('down'); }}
            disabled={sectionIndex === totalSections - 1}
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace' }}
          >
            ▼
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace' }}
          >
            Remove
          </button>
          <span className="accordion-arrow">{isExpanded ? '▼' : '▶'}</span>
        </div>
      </button>
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
