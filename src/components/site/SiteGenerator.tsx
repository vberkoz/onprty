import React from 'react';
import Dropdown from '../ui/Dropdown';
import Button from '../ui/Button';
import { getAvailableTemplates, formatTemplateName, parseTemplateName } from '../../services/templates';

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
  const templates = getAvailableTemplates();
  const templateOptions = templates.map(formatTemplateName);
  
  const examples = [
    'SaaS landing page for "TaskFlow" project management tool. Include pricing ($15 Pro, $8 Starter per user/month), testimonials, 50K+ users stat, and FAQ.',
    'Portfolio for Alex Chen, UX/UI designer. Show 5 projects, skills (Figma, Adobe XD), 3 years experience, and contact form.',
    'Landing page for "FitTrack" fitness app. Problem/solution for workout tracking, AI coaching features, pricing tiers, and testimonials.'
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
            value={formatTemplateName(selectedTemplate)}
            options={templateOptions}
            onChange={(value) => onTemplateChange(parseTemplateName(value))}
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