import React from 'react';
import { type SiteSection } from '../../types';

interface TextBlockSectionProps {
  section: SiteSection;
  sectionIndex: number;
  totalSections: number;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (field: string, value: unknown) => void;
  onMove: (direction: 'up' | 'down') => void;
  onRemove: () => void;
}

const TextBlockSection: React.FC<TextBlockSectionProps> = ({
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
      <button className="accordion-header" onClick={onToggle}>
        <span>📝 Text Block</span>
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
            Title:
            <input
              type="text"
              value={(section.data.title || section.data.heading) as string || ''}
              onChange={(e) => onUpdate('title', e.target.value)}
            />
          </label>
          <label>
            Content:
            <textarea
              value={(section.data.content || section.data.text) as string || ''}
              onChange={(e) => onUpdate('content', e.target.value)}
              rows={4}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default TextBlockSection;
