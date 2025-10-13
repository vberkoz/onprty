// Environment configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
export const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
export const COGNITO_REDIRECT_URI = import.meta.env.VITE_COGNITO_REDIRECT_URI;
export const COGNITO_LOGOUT_URI = import.meta.env.VITE_COGNITO_LOGOUT_URI;

// Storage keys
export const STORAGE_KEYS = {
  COGNITO_TOKENS: 'cognitoTokens',
} as const;

// Default values
export const DEFAULT_TEMPLATE = 'monospace';
export const DEFAULT_ICONS = ['⚡', '🎨', '📱', '🚀', '💡', '🔧', '📊', '🎯', '🌟', '💎'];
export const DEFAULT_PLACEHOLDER_IMAGE = 'https://via.placeholder.com/150';
export const DEFAULT_CTA_TEXT = 'Learn More';
