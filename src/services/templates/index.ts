export const getAvailableTemplates = (): string[] => {
  return ['monospace', 'neubrutalism', 'swiss', 'terminal'];
};

export const formatTemplateName = (template: string): string => {
  return template.charAt(0).toUpperCase() + template.slice(1);
};

export const parseTemplateName = (displayName: string): string => {
  return displayName.toLowerCase();
};
