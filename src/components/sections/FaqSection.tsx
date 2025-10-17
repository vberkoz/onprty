import React from 'react';
import { type SiteSection } from '../../types';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
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

export const FaqSection: React.FC<FaqSectionProps> = ({
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
  const data = section.data as { title: string; items: FaqItem[] };
  
  const onChange = (newData: { title: string; items: FaqItem[] }) => {
    onUpdate('', newData);
  };
  const updateItem = (index: number, field: keyof FaqItem, value: string) => {
    const updated = [...data.items];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, items: updated });
  };

  const addItem = () => {
    onChange({ ...data, items: [...data.items, { question: '', answer: '' }] });
  };

  const removeItem = (index: number) => {
    onChange({ ...data, items: data.items.filter((_, i) => i !== index) });
  };

  return (
    <div className="accordion-item">
      <div className="item-header">
        <button onClick={onToggle} className="item-toggle">
          {isExpanded ? '▼' : '▶'} ❓ FAQ
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
        Section Title:
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
      </label>
      {data.items.map((item, index) => {
        const itemKey = `${sectionKey}-item-${index}`;
        const isItemExpanded = expandedItems[itemKey] ?? false;
        return (
          <div key={index} className="nested-item">
            <div className="item-header">
              <button onClick={() => onToggleItem(itemKey)} className="item-toggle">
                {isItemExpanded ? '▼' : '▶'} Question {index + 1}
              </button>
              <div className="item-controls">
                <button onClick={() => removeItem(index)} className="remove-btn">✕</button>
              </div>
            </div>
            {isItemExpanded && (
            <div className="item-content">
          <label>
            Question:
            <input
              type="text"
              value={item.question}
              onChange={(e) => updateItem(index, 'question', e.target.value)}
            />
          </label>
          <label>
            Answer:
            <textarea
              value={item.answer}
              onChange={(e) => updateItem(index, 'answer', e.target.value)}
              rows={3}
            />
          </label>
            </div>
            )}
          </div>
        );
      })}
      <button onClick={addItem} className="add-item-btn">+ Add Question</button>
      </div>
      )}
    </div>
  );
};
