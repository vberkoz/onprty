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
      <button className="accordion-header" onClick={onToggle}>
        <span>✨ Features Section</span>
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
              <div key={idx} className="accordion-item">
                <button className="accordion-header" onClick={() => onToggleItem(itemKey)}>
                  <span>Feature {idx + 1}</span>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); onMoveItem(idx, 'up'); }}
                      disabled={idx === 0}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace' }}
                    >
                      ▲
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onMoveItem(idx, 'down'); }}
                      disabled={idx === items.length - 1}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace' }}
                    >
                      ▼
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onRemoveItem(idx); }}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace' }}
                    >
                      Remove
                    </button>
                    <span className="accordion-arrow">{isItemExpanded ? '▼' : '▶'}</span>
                  </div>
                </button>
                {isItemExpanded && (
                  <div className="accordion-content">
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
          <button onClick={onAddItem} style={{ padding: '0.5rem', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace', marginTop: '0.5rem', width: '100%' }}>+ Add Feature</button>
        </div>
      )}
    </div>
  );
};

export default FeaturesSection;
