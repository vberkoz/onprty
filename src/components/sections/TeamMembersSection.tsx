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
      <button className="accordion-header" onClick={onToggle}>
        <span>👥 Team Members</span>
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
          {members.map((member, idx) => {
            const memberKey = `${sectionKey}-member-${idx}`;
            const isMemberExpanded = expandedMembers[memberKey] ?? false;
            return (
              <div key={idx} className="accordion-item">
                <button className="accordion-header" onClick={() => onToggleMember(memberKey)}>
                  <span>Team Member {idx + 1}</span>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); onMoveMember(idx, 'up'); }}
                      disabled={idx === 0}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace' }}
                    >
                      ▲
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onMoveMember(idx, 'down'); }}
                      disabled={idx === members.length - 1}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace' }}
                    >
                      ▼
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onRemoveMember(idx); }}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace' }}
                    >
                      Remove
                    </button>
                    <span className="accordion-arrow">{isMemberExpanded ? '▼' : '▶'}</span>
                  </div>
                </button>
                {isMemberExpanded && (
                  <div className="accordion-content">
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
                  </div>
                )}
              </div>
            );
          })}
          <button onClick={onAddMember} style={{ padding: '0.5rem', fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace', marginTop: '0.5rem', width: '100%' }}>+ Add Team Member</button>
        </div>
      )}
    </div>
  );
};

export default TeamMembersSection;
