import React from 'react';
import Dropdown from '../ui/Dropdown';
import Button from '../ui/Button';

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
  const examples = [
    'A website for a startup that delivers custom weekly meal kits based on rare, forgotten recipes from ancient cultures.',
    'A landing page for a new AI-powered legal document drafting service for small businesses.',
    'A site showcasing a co-working space dedicated entirely to remote deep-sea researchers and marine biologists.'
  ];

  return (
    <div className="generate-section">
      <form className="generation-form" onSubmit={onGenerate}>
        <div className="example-prompts">
          {examples.map((example, index) => (
            <button
              key={index}
              type="button"
              className="example-prompt-btn"
              onClick={() => onPromptChange(example)}
              disabled={isGenerating}
            >
              {example}
            </button>
          ))}
        </div>
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