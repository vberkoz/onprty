import React from 'react';
import type { SiteSection } from '../../types';

interface ProjectGridSectionProps {
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

const ProjectGridSection: React.FC<ProjectGridSectionProps> = ({
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
  const projects = (section.data.projects as Record<string, unknown>[]) || [];

  return (
    <div className="accordion-item">
      <div className="item-header">
        <button onClick={onToggle} className="item-toggle">
          {isExpanded ? '▼' : '▶'} 📁 Project Grid
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
          {projects.map((project, idx) => {
            const itemKey = `${sectionKey}-project-${idx}`;
            const itemExpanded = expandedItems[itemKey] ?? false;
            return (
              <div key={idx} className="nested-item">
                <div className="item-header">
                  <button onClick={() => onToggleItem(itemKey)} className="item-toggle">
                    {itemExpanded ? '▼' : '▶'} {project.title as string || `Project ${idx + 1}`}
                  </button>
                  <div className="item-controls">
                    {idx > 0 && <button onClick={() => onMoveItem(idx, 'up')}>↑</button>}
                    {idx < projects.length - 1 && <button onClick={() => onMoveItem(idx, 'down')}>↓</button>}
                    <button onClick={() => onRemoveItem(idx)} className="remove-btn">✕</button>
                  </div>
                </div>
                {itemExpanded && (
                  <div className="item-content">
                    <label>Title: <input type="text" value={project.title as string || ''} onChange={(e) => onUpdateItem(idx, 'title', e.target.value)} /></label>
                    <label>Category: <input type="text" value={project.category as string || ''} onChange={(e) => onUpdateItem(idx, 'category', e.target.value)} /></label>
                    <label>Description: <textarea value={project.description as string || ''} onChange={(e) => onUpdateItem(idx, 'description', e.target.value)} rows={2} /></label>
                    <label>Image URL: <input type="text" value={project.image as string || ''} onChange={(e) => onUpdateItem(idx, 'image', e.target.value)} /></label>
                    <label>Link: <input type="text" value={project.link as string || ''} onChange={(e) => onUpdateItem(idx, 'link', e.target.value)} /></label>
                  </div>
                )}
              </div>
            );
          })}
          <button onClick={onAddItem} className="add-item-btn">+ Add Project</button>
        </div>
      )}
    </div>
  );
};

export default ProjectGridSection;
