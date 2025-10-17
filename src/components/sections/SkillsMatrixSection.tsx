import React from 'react';
import type { SiteSection } from '../../types';

interface SkillsMatrixSectionProps {
  section: SiteSection;
  sectionIndex: number;
  totalSections: number;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (field: string, value: unknown) => void;
  onMove: (direction: 'up' | 'down') => void;
  onRemove: () => void;
}

const SkillsMatrixSection: React.FC<SkillsMatrixSectionProps> = ({
  section,
  sectionIndex,
  totalSections,
  isExpanded,
  onToggle,
  onUpdate,
  onMove,
  onRemove
}) => {
  const categories = (section.data.categories as Record<string, unknown>[]) || [];

  const updateCategory = (idx: number, field: string, value: unknown) => {
    const updated = [...categories];
    updated[idx] = { ...updated[idx], [field]: value };
    onUpdate('categories', updated);
  };

  const addCategory = () => {
    onUpdate('categories', [...categories, { categoryName: 'New Category', skills: [] }]);
  };

  const removeCategory = (idx: number) => {
    const updated = [...categories];
    updated.splice(idx, 1);
    onUpdate('categories', updated);
  };

  const addSkill = (categoryIdx: number) => {
    const updated = [...categories];
    const skills = (updated[categoryIdx].skills as string[]) || [];
    updated[categoryIdx] = { ...updated[categoryIdx], skills: [...skills, 'New Skill'] };
    onUpdate('categories', updated);
  };

  const updateSkill = (categoryIdx: number, skillIdx: number, value: string) => {
    const updated = [...categories];
    const skills = [...(updated[categoryIdx].skills as string[])];
    skills[skillIdx] = value;
    updated[categoryIdx] = { ...updated[categoryIdx], skills };
    onUpdate('categories', updated);
  };

  const removeSkill = (categoryIdx: number, skillIdx: number) => {
    const updated = [...categories];
    const skills = [...(updated[categoryIdx].skills as string[])];
    skills.splice(skillIdx, 1);
    updated[categoryIdx] = { ...updated[categoryIdx], skills };
    onUpdate('categories', updated);
  };

  return (
    <div className="accordion-item">
      <div className="item-header">
        <button onClick={onToggle} className="item-toggle">
          {isExpanded ? '▼' : '▶'} 🛠️ Skills Matrix
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
          {categories.map((cat, catIdx) => (
            <div key={catIdx} style={{ border: '1px solid #ddd', padding: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <input type="text" value={cat.categoryName as string || ''} onChange={(e) => updateCategory(catIdx, 'categoryName', e.target.value)} style={{ fontWeight: 'bold' }} />
                <button onClick={() => removeCategory(catIdx)} className="remove-btn">✕</button>
              </div>
              {((cat.skills as string[]) || []).map((skill, skillIdx) => (
                <div key={skillIdx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input type="text" value={skill} onChange={(e) => updateSkill(catIdx, skillIdx, e.target.value)} />
                  <button onClick={() => removeSkill(catIdx, skillIdx)} className="remove-btn">✕</button>
                </div>
              ))}
              <button onClick={() => addSkill(catIdx)} style={{ fontSize: '0.85rem' }}>+ Add Skill</button>
            </div>
          ))}
          <button onClick={addCategory} className="add-item-btn">+ Add Category</button>
        </div>
      )}
    </div>
  );
};

export default SkillsMatrixSection;
