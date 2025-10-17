import React from 'react';
import { type SiteSection } from '../../types';

interface ProblemSolutionSectionProps {
  section: SiteSection;
  sectionIndex: number;
  totalSections: number;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (field: string, value: unknown) => void;
  onMove: (direction: 'up' | 'down') => void;
  onRemove: () => void;
}

export const ProblemSolutionSection: React.FC<ProblemSolutionSectionProps> = ({
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
          {isExpanded ? '▼' : '▶'} 🎯 Problem/Solution
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
            Problem Heading:
            <input
              type="text"
              value={section.data.problemHeading as string || ''}
              onChange={(e) => onUpdate('problemHeading', e.target.value)}
            />
          </label>
          <label>
            Problem Description:
            <textarea
              value={section.data.problemText as string || ''}
              onChange={(e) => onUpdate('problemText', e.target.value)}
              rows={2}
            />
          </label>
          <label>
            Solution Heading:
            <input
              type="text"
              value={section.data.solutionHeading as string || ''}
              onChange={(e) => onUpdate('solutionHeading', e.target.value)}
            />
          </label>
          <label>
            Solution Description:
            <textarea
              value={section.data.solutionText as string || ''}
              onChange={(e) => onUpdate('solutionText', e.target.value)}
              rows={2}
            />
          </label>
        </div>
      )}
    </div>
  );
};
