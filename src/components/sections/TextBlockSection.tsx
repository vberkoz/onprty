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
      <div className="item-header">
        <button onClick={onToggle} className="item-toggle">
          {isExpanded ? '▼' : '▶'} 📝 Text Block
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
