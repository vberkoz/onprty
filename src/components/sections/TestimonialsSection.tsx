import React from 'react';
import { type SiteSection } from '../../types';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

interface TestimonialsSectionProps {
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

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
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
  const data = section.data as { title: string; testimonials: Testimonial[] };
  
  const onChange = (newData: { title: string; testimonials: Testimonial[] }) => {
    onUpdate('', newData);
  };
  const updateTestimonial = (index: number, field: keyof Testimonial, value: string) => {
    const updated = [...data.testimonials];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, testimonials: updated });
  };

  const addTestimonial = () => {
    onChange({
      ...data,
      testimonials: [...data.testimonials, { quote: '', author: '', role: '' }]
    });
  };

  const removeTestimonial = (index: number) => {
    onChange({ ...data, testimonials: data.testimonials.filter((_, i) => i !== index) });
  };

  return (
    <div className="accordion-item">
      <div className="item-header">
        <button onClick={onToggle} className="item-toggle">
          {isExpanded ? '▼' : '▶'} 💬 Testimonials
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
      {data.testimonials.map((testimonial, index) => {
        const itemKey = `${sectionKey}-item-${index}`;
        const isItemExpanded = expandedItems[itemKey] ?? false;
        return (
          <div key={index} className="nested-item">
            <div className="item-header">
              <button onClick={() => onToggleItem(itemKey)} className="item-toggle">
                {isItemExpanded ? '▼' : '▶'} Testimonial {index + 1}
              </button>
              <div className="item-controls">
                <button onClick={() => removeTestimonial(index)} className="remove-btn">✕</button>
              </div>
            </div>
            {isItemExpanded && (
              <div className="item-content">
                <label>
                  Quote:
                  <textarea
                    value={testimonial.quote}
                    onChange={(e) => updateTestimonial(index, 'quote', e.target.value)}
                    rows={3}
                  />
                </label>
                <label>
                  Author:
                  <input
                    type="text"
                    value={testimonial.author}
                    onChange={(e) => updateTestimonial(index, 'author', e.target.value)}
                  />
                </label>
                <label>
                  Role & Company:
                  <input
                    type="text"
                    value={testimonial.role}
                    onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                  />
                </label>
              </div>
            )}
          </div>
        );
      })}
      <button onClick={addTestimonial} className="add-item-btn">+ Add Testimonial</button>
      </div>
      )}
    </div>
  );
};
