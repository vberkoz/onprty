import React from 'react';
import type { SiteSection } from '../../types';

interface ExperienceTimelineSectionProps {
  section: SiteSection;
  sectionIndex: number;
  totalSections: number;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (field: string, value: unknown) => void;
  onMove: (direction: 'up' | 'down') => void;
  onRemove: () => void;
  expandedItems: Record<string, boolean>;
  onToggleItem: (key: string) => void;
  onUpdateItem: (itemIndex: number, field: string, value: string) => void;
  onMoveItem: (itemIndex: number, direction: 'up' | 'down') => void;
  onRemoveItem: (itemIndex: number) => void;
  onAddItem: () => void;
  sectionKey: string;
}

const ExperienceTimelineSection: React.FC<ExperienceTimelineSectionProps> = ({
  section,
  sectionIndex,
  totalSections,
  isExpanded,
  onToggle,
  onUpdate,
  onMove,
  onRemove,
  expandedItems,
  onToggleItem,
  onUpdateItem,
  onMoveItem,
  onRemoveItem,
  onAddItem,
  sectionKey
}) => {
  const experiences = (section.data.experiences as Record<string, unknown>[]) || [];

  return (
    <div className="accordion-item">
      <div className="item-header">
        <button onClick={onToggle} className="item-toggle">
          {isExpanded ? '▼' : '▶'} 📅 Experience Timeline
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
          {experiences.map((exp, idx) => {
            const itemKey = `${sectionKey}-exp-${idx}`;
            const itemExpanded = expandedItems[itemKey] ?? false;
            return (
              <div key={idx} className="nested-item">
                <div className="item-header">
                  <button onClick={() => onToggleItem(itemKey)} className="item-toggle">
                    {itemExpanded ? '▼' : '▶'} {exp.role as string || `Experience ${idx + 1}`}
                  </button>
                  <div className="item-controls">
                    {idx > 0 && <button onClick={() => onMoveItem(idx, 'up')}>↑</button>}
                    {idx < experiences.length - 1 && <button onClick={() => onMoveItem(idx, 'down')}>↓</button>}
                    <button onClick={() => onRemoveItem(idx)} className="remove-btn">✕</button>
                  </div>
                </div>
                {itemExpanded && (
                  <div className="item-content">
                    <label>Role: <input type="text" value={exp.role as string || ''} onChange={(e) => onUpdateItem(idx, 'role', e.target.value)} /></label>
                    <label>Company: <input type="text" value={exp.company as string || ''} onChange={(e) => onUpdateItem(idx, 'company', e.target.value)} /></label>
                    <label>Start Date: <input type="text" value={exp.startDate as string || ''} onChange={(e) => onUpdateItem(idx, 'startDate', e.target.value)} /></label>
                    <label>End Date: <input type="text" value={exp.endDate as string || ''} onChange={(e) => onUpdateItem(idx, 'endDate', e.target.value)} /></label>
                    <label>Description: <textarea value={exp.description as string || ''} onChange={(e) => onUpdateItem(idx, 'description', e.target.value)} rows={3} /></label>
                  </div>
                )}
              </div>
            );
          })}
          <button onClick={onAddItem} className="add-item-btn">+ Add Experience</button>
        </div>
      )}
    </div>
  );
};

export default ExperienceTimelineSection;
