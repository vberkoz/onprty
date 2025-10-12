import React from 'react';
import Dropdown from './Dropdown';
import Button from './Button';

interface SiteGeneratorProps {
  prompt: string;
  selectedTemplate: string;
  isGenerating: boolean;
  onPromptChange: (prompt: string) => void;
  onTemplateChange: (template: string) => void;
  onGenerate: (e: React.FormEvent) => void;
}

const SiteGenerator: React.FC<SiteGeneratorProps> = ({
  prompt,
  selectedTemplate,
  isGenerating,
  onPromptChange,
  onTemplateChange,
  onGenerate
}) => {
  return (
    <div className="generate-section">
      <h2>✨ Generate New Site</h2>
      <form className="generation-form" onSubmit={onGenerate}>
        <label>
          Describe your website:
          <textarea 
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="e.g., A modern landing page for a tech startup with hero section, features, and team"
            rows={3}
            disabled={isGenerating}
          />
        </label>
        <label>
          Template:
          <Dropdown
            value={selectedTemplate === 'monospace' ? 'Monospace' : 'Neubrutalism'}
            options={['Monospace', 'Neubrutalism']}
            onChange={(value) => onTemplateChange(value === 'Monospace' ? 'monospace' : 'neubrutalism')}
            disabled={isGenerating}
          />
        </label>
        <Button type="submit" disabled={!prompt.trim() || isGenerating} loading={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Site'}
        </Button>
      </form>
    </div>
  );
};

export default SiteGenerator;