import React from 'react';
import { type SiteSection } from '../../types';

interface TeamMembersSectionProps {
  section: SiteSection;
  sectionIndex: number;
  totalSections: number;
  isExpanded: boolean;
  expandedMembers: Record<string, boolean>;
  onToggle: () => void;
  onToggleMember: (key: string) => void;
  onUpdate: (field: string, value: unknown) => void;
  onUpdateMember: (memberIndex: number, field: string, value: string) => void;
  onMove: (direction: 'up' | 'down') => void;
  onMoveMember: (memberIndex: number, direction: 'up' | 'down') => void;
  onRemove: () => void;
  onRemoveMember: (memberIndex: number) => void;
  onAddMember: () => void;
  sectionKey: string;
}

const TeamMembersSection: React.FC<TeamMembersSectionProps> = ({
  section,
  sectionIndex,
  totalSections,
  isExpanded,
  expandedMembers,
  onToggle,
  onToggleMember,
  onUpdate,
  onUpdateMember,
  onMove,
  onMoveMember,
  onRemove,
  onRemoveMember,
  onAddMember,
  sectionKey
}) => {
  const members = section.data.members as Record<string, unknown>[] || [];

  return (
    <div className="accordion-item">
      <div className="item-header">
        <button onClick={onToggle} className="item-toggle">
          {isExpanded ? '▼' : '▶'} 👥 Team Members
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
          {members.map((member, idx) => {
            const memberKey = `${sectionKey}-member-${idx}`;
            const isMemberExpanded = expandedMembers[memberKey] ?? false;
            return (
              <div key={idx} className="nested-item">
                <div className="item-header">
                  <button onClick={() => onToggleMember(memberKey)} className="item-toggle">
                    {isMemberExpanded ? '▼' : '▶'} Team Member {idx + 1}
                  </button>
                  <div className="item-controls">
                    {idx > 0 && <button onClick={() => onMoveMember(idx, 'up')}>↑</button>}
                    {idx < members.length - 1 && <button onClick={() => onMoveMember(idx, 'down')}>↓</button>}
                    <button onClick={() => onRemoveMember(idx)} className="remove-btn">✕</button>
                  </div>
                </div>
                {isMemberExpanded && (
                  <div className="item-content">
                    <label>
                      Name:
                      <input
                        type="text"
                        value={member.name as string || ''}
                        onChange={(e) => onUpdateMember(idx, 'name', e.target.value)}
                      />
                    </label>
                    <label>
                      Role:
                      <input
                        type="text"
                        value={member.role as string || ''}
                        onChange={(e) => onUpdateMember(idx, 'role', e.target.value)}
                      />
                    </label>
                    <label>
                      Bio:
                      <textarea
                        value={(member.bio || member.description) as string || ''}
                        onChange={(e) => onUpdateMember(idx, 'bio', e.target.value)}
                        rows={2}
                      />
                    </label>
                    <label>
                      Image URL:
                      <input
                        type="text"
                        value={member.image as string || ''}
                        onChange={(e) => onUpdateMember(idx, 'image', e.target.value)}
                      />
                    </label>
                    <label>
                      Upload Image:
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              const img = new Image();
                              img.onload = () => {
                                const canvas = document.createElement('canvas');
                                const size = Math.min(img.width, img.height);
                                const x = (img.width - size) / 2;
                                const y = (img.height - size) / 2;
                                canvas.width = 128;
                                canvas.height = 128;
                                const ctx = canvas.getContext('2d');
                                ctx?.drawImage(img, x, y, size, size, 0, 0, 128, 128);
                                onUpdateMember(idx, 'image', canvas.toDataURL('image/jpeg', 0.8));
                              };
                              img.src = reader.result as string;
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>
            );
          })}
          <button onClick={onAddMember} className="add-item-btn">+ Add Team Member</button>
        </div>
      )}
    </div>
  );
};

export default TeamMembersSection;
