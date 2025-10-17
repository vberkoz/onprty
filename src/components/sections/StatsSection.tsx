import React from 'react';
import { type SiteSection } from '../../types';

interface Stat {
  value: string;
  label: string;
}

interface StatsSectionProps {
  section: SiteSection;
  sectionIndex: number;
  totalSections: number;
  isExpanded: boolean;
  expandedItems: Record<string, boolean>;
  onToggle: () => void;
  onToggleItem: (key: string) => void;
  onUpdate: (field: string, value: unknown) => void;
  onMove: (direction: 'up' | 'down') => void;
  onRemove: () => void;
  sectionKey: string;
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  section,
  sectionIndex,
  totalSections,
  isExpanded,
  expandedItems,
  onToggle,
  onToggleItem,
  onUpdate,
  onMove,
  onRemove,
  sectionKey
}) => {
  const data = section.data as { stats: Stat[] };
  
  const onChange = (newData: { stats: Stat[] }) => {
    onUpdate('', newData);
  };
  const updateStat = (index: number, field: keyof Stat, value: string) => {
    const updated = [...data.stats];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ stats: updated });
  };

  const addStat = () => {
    onChange({ stats: [...data.stats, { value: '', label: '' }] });
  };

  const removeStat = (index: number) => {
    onChange({ stats: data.stats.filter((_, i) => i !== index) });
  };

  return (
    <div className="accordion-item">
      <div className="item-header">
        <button onClick={onToggle} className="item-toggle">
          {isExpanded ? '▼' : '▶'} 📊 Stats
        </button>
        <div className="item-controls">
          {sectionIndex > 0 && <button onClick={(e) => { e.stopPropagation(); onMove('up'); }}>↑</button>}
          {sectionIndex < totalSections - 1 && <button onClick={(e) => { e.stopPropagation(); onMove('down'); }}>↓</button>}
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="remove-btn">✕</button>
        </div>
      </div>
      {isExpanded && (
      <div className="accordion-content">
      {data.stats.map((stat, index) => {
        const itemKey = `${sectionKey}-item-${index}`;
        const isItemExpanded = expandedItems[itemKey] ?? false;
        return (
          <div key={index} className="nested-item">
            <div className="item-header">
              <button onClick={() => onToggleItem(itemKey)} className="item-toggle">
                {isItemExpanded ? '▼' : '▶'} Stat {index + 1}
              </button>
              <div className="item-controls">
                <button onClick={() => removeStat(index)} className="remove-btn">✕</button>
              </div>
            </div>
            {isItemExpanded && (
            <div className="item-content">
          <label>
            Value:
            <input
              type="text"
              value={stat.value}
              onChange={(e) => updateStat(index, 'value', e.target.value)}
              placeholder="15,000+"
            />
          </label>
          <label>
            Label:
            <input
              type="text"
              value={stat.label}
              onChange={(e) => updateStat(index, 'label', e.target.value)}
              placeholder="Active Teams"
            />
          </label>
            </div>
            )}
          </div>
        );
      })}
      <button onClick={addStat} className="add-item-btn">+ Add Stat</button>
      </div>
      )}
    </div>
  );
};
