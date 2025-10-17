import React from 'react';
import { type SiteSection } from '../../types';

interface FeaturesSectionProps {
  section: SiteSection;
  sectionIndex: number;
  totalSections: number;
  isExpanded: boolean;
  expandedItems: Record<string, boolean>;
  onToggle: () => void;
  onToggleItem: (key: string) => void;
  onUpdate: (field: string, value: unknown) => void;
  onUpdateItem: (itemIndex: number, field: string, value: string) => void;
  onMove: (direction: 'up' | 'down') => void;
  onMoveItem: (itemIndex: number, direction: 'up' | 'down') => void;
  onRemove: () => void;
  onRemoveItem: (itemIndex: number) => void;
  onAddItem: () => void;
  sectionKey: string;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  section,
  sectionIndex,
  totalSections,
  isExpanded,
  expandedItems,
  onToggle,
  onToggleItem,
  onUpdate,
  onUpdateItem,
  onMove,
  onMoveItem,
  onRemove,
  onRemoveItem,
  onAddItem,
  sectionKey
}) => {
  const items = (section.data.items || section.data.features) as Record<string, unknown>[] || [];

  return (
    <div className="accordion-item">
      <div className="item-header">
        <button onClick={onToggle} className="item-toggle">
          {isExpanded ? '▼' : '▶'} ✨ Features Section
        </button>
        <div className="item-controls">
          {sectionIndex > 0 && <button onClick={(e) => { e.stopPropagation(); onMove('up'); }}>↑</button>}
          {sectionIndex < totalSections - 1 && <button onClick={(e) => { e.stopPropagation(); onMove('down'); }}>↓</button>}
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="remove-btn">✕</button>
        </div>
      </div>
      {isExpanded && (
        <div className="accordion-content">
          {Boolean(section.data.heading) && (
            <label>
              Section Heading:
              <input
                type="text"
                value={section.data.heading as string || ''}
                onChange={(e) => onUpdate('heading', e.target.value)}
              />
            </label>
          )}
          {items.map((item, idx) => {
            const itemKey = `${sectionKey}-item-${idx}`;
            const isItemExpanded = expandedItems[itemKey] ?? false;
            return (
              <div key={idx} className="nested-item">
                <div className="item-header">
                  <button onClick={() => onToggleItem(itemKey)} className="item-toggle">
                    {isItemExpanded ? '▼' : '▶'} Feature {idx + 1}
                  </button>
                  <div className="item-controls">
                    {idx > 0 && <button onClick={() => onMoveItem(idx, 'up')}>↑</button>}
                    {idx < items.length - 1 && <button onClick={() => onMoveItem(idx, 'down')}>↓</button>}
                    <button onClick={() => onRemoveItem(idx)} className="remove-btn">✕</button>
                  </div>
                </div>
                {isItemExpanded && (
                  <div className="item-content">
                    <label>
                      Icon:
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          value={item.icon as string || ''}
                          onChange={(e) => onUpdateItem(idx, 'icon', e.target.value)}
                          style={{ flex: 1 }}
                        />
                        <select
                          onChange={(e) => onUpdateItem(idx, 'icon', e.target.value)}
                          value=""
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.85rem', backgroundColor: 'white', cursor: 'pointer' }}
                        >
                          <option value="">Pick emoji</option>
                          <option value="⚡">⚡ Lightning</option>
                          <option value="🎨">🎨 Art</option>
                          <option value="📱">📱 Mobile</option>
                          <option value="🚀">🚀 Rocket</option>
                          <option value="💡">💡 Idea</option>
                          <option value="🔧">🔧 Tool</option>
                          <option value="📊">📊 Chart</option>
                          <option value="🎯">🎯 Target</option>
                          <option value="🌟">🌟 Star</option>
                          <option value="💎">💎 Diamond</option>
                          <option value="🔒">🔒 Lock</option>
                          <option value="⚙️">⚙️ Gear</option>
                          <option value="🌐">🌐 Globe</option>
                          <option value="💻">💻 Laptop</option>
                          <option value="📈">📈 Growth</option>
                        </select>
                      </div>
                    </label>
                    <label>
                      Title:
                      <input
                        type="text"
                        value={(item.heading || item.title) as string || ''}
                        onChange={(e) => onUpdateItem(idx, 'heading', e.target.value)}
                      />
                    </label>
                    <label>
                      Description:
                      <textarea
                        value={item.description as string || ''}
                        onChange={(e) => onUpdateItem(idx, 'description', e.target.value)}
                        rows={2}
                      />
                    </label>
                  </div>
                )}
              </div>
            );
          })}
          <button onClick={onAddItem} className="add-item-btn">+ Add Feature</button>
        </div>
      )}
    </div>
  );
};

export default FeaturesSection;
