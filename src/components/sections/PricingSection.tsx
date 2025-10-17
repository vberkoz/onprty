import React from 'react';
import { type SiteSection } from '../../types';

interface Plan {
  name: string;
  price: string;
  period: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  featured?: boolean;
}

interface PricingSectionProps {
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

export const PricingSection: React.FC<PricingSectionProps> = ({
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
  const data = section.data as { title: string; plans: Plan[] };
  
  const onChange = (newData: { title: string; plans: Plan[] }) => {
    onUpdate('', newData);
  };
  const updatePlan = (index: number, field: keyof Plan, value: string | boolean | string[]) => {
    const updated = [...data.plans];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, plans: updated });
  };

  const addPlan = () => {
    onChange({
      ...data,
      plans: [...data.plans, { name: '', price: '', period: '', features: [], ctaText: '', ctaLink: '#' }]
    });
  };

  const removePlan = (index: number) => {
    onChange({ ...data, plans: data.plans.filter((_, i) => i !== index) });
  };

  const addFeature = (planIndex: number) => {
    const updated = [...data.plans];
    updated[planIndex].features = [...updated[planIndex].features, ''];
    onChange({ ...data, plans: updated });
  };

  const updateFeature = (planIndex: number, featureIndex: number, value: string) => {
    const updated = [...data.plans];
    updated[planIndex].features[featureIndex] = value;
    onChange({ ...data, plans: updated });
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    const updated = [...data.plans];
    updated[planIndex].features = updated[planIndex].features.filter((_, i) => i !== featureIndex);
    onChange({ ...data, plans: updated });
  };

  return (
    <div className="accordion-item">
      <div className="item-header">
        <button onClick={onToggle} className="item-toggle">
          {isExpanded ? '▼' : '▶'} 💰 Pricing
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
      {data.plans.map((plan, index) => {
        const itemKey = `${sectionKey}-item-${index}`;
        const isItemExpanded = expandedItems[itemKey] ?? false;
        return (
          <div key={index} className="nested-item">
            <div className="item-header">
              <button onClick={() => onToggleItem(itemKey)} className="item-toggle">
                {isItemExpanded ? '▼' : '▶'} Plan {index + 1}
              </button>
              <div className="item-controls">
                <button onClick={() => removePlan(index)} className="remove-btn">✕</button>
              </div>
            </div>
            {isItemExpanded && (
            <div className="item-content">
          <label>
            Plan Name:
            <input
              type="text"
              value={plan.name}
              onChange={(e) => updatePlan(index, 'name', e.target.value)}
            />
          </label>
          <label>
            Price:
            <input
              type="text"
              value={plan.price}
              onChange={(e) => updatePlan(index, 'price', e.target.value)}
            />
          </label>
          <label>
            Period:
            <input
              type="text"
              value={plan.period}
              onChange={(e) => updatePlan(index, 'period', e.target.value)}
              placeholder="/month"
            />
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={plan.featured || false}
              onChange={(e) => updatePlan(index, 'featured', e.target.checked)}
            />
            <span>Featured Plan</span>
          </label>
          <div style={{ marginTop: '0.5rem' }}>
            <strong>Features:</strong>
            {plan.features.map((feature, fIndex) => (
              <div key={fIndex} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, fIndex, e.target.value)}
                  placeholder="Feature"
                  style={{ flex: 1 }}
                />
                <button onClick={() => removeFeature(index, fIndex)} style={{ padding: '0.25rem 0.5rem', border: '1px solid #ddd', backgroundColor: 'white', borderRadius: '3px', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'IBM Plex Mono, monospace', color: '#dc3545', borderColor: '#dc3545' }}>✕</button>
              </div>
            ))}
            <button onClick={() => addFeature(index)} className="add-item-btn" style={{ marginTop: '0.5rem' }}>+ Add Feature</button>
          </div>
          <label>
            Button Text:
            <input
              type="text"
              value={plan.ctaText}
              onChange={(e) => updatePlan(index, 'ctaText', e.target.value)}
            />
          </label>
          <label>
            Button Link:
            <input
              type="text"
              value={plan.ctaLink}
              onChange={(e) => updatePlan(index, 'ctaLink', e.target.value)}
            />
          </label>
            </div>
            )}
          </div>
        );
      })}
      <button onClick={addPlan} className="add-item-btn">+ Add Plan</button>
      </div>
      )}
    </div>
  );
};
