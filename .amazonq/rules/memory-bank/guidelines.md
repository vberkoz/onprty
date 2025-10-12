# OnPrty Development Guidelines

## Code Quality Standards

### TypeScript Usage (5/5 files)
- **Strict TypeScript**: All files use TypeScript with explicit interface definitions
- **Interface-First Design**: Define interfaces before implementation (StoredSite, SiteData, AuthTokens, User)
- **Type Safety**: Comprehensive type annotations for function parameters and return values
- **Generic Types**: Use generic constraints where appropriate (`Record<string, unknown>`)

### Import Organization (5/5 files)
- **React imports first**: `import React, { ... } from 'react'`
- **External libraries second**: Third-party dependencies grouped together
- **Internal imports last**: Local components, services, and utilities
- **Raw imports**: Use `?raw` suffix for template files (`import template from './file.html?raw'`)

### Error Handling Patterns (5/5 files)
- **Try-catch blocks**: Wrap async operations in comprehensive error handling
- **Error logging**: Use `console.error()` for debugging information
- **User feedback**: Provide meaningful error messages to users
- **Graceful degradation**: Return empty arrays/null instead of throwing when appropriate
- **Authentication errors**: Special handling for authorization failures with logout triggers

## Structural Conventions

### Component Architecture (3/3 React files)
- **Functional Components**: Use React.FC type annotation consistently
- **Props interfaces**: Define explicit interfaces for component props
- **Default exports**: Export components as default, hooks as named exports
- **Component composition**: Break complex components into smaller, focused pieces

### State Management (3/3 React files)
- **useState hooks**: Prefer useState for local component state
- **useCallback**: Memoize functions that depend on props/state
- **useEffect**: Handle side effects with proper dependency arrays
- **Context pattern**: Use React Context for global state (AuthContext)

### Service Layer Pattern (3/3 service files)
- **Single responsibility**: Each service handles one domain (auth, storage, generation)
- **Async/await**: Consistent use of modern async patterns
- **Environment variables**: Use `import.meta.env` for configuration
- **Token management**: Centralized access token handling with localStorage

## Naming Conventions

### File Naming (5/5 files)
- **PascalCase**: React components (`ProjectPage.tsx`, `AuthContext.tsx`)
- **camelCase**: Services and utilities (`siteGenerator.ts`, `siteStorageS3.ts`)
- **kebab-case**: Template files and assets
- **Descriptive names**: Clear, purpose-driven file names

### Variable Naming (5/5 files)
- **camelCase**: Variables and functions (`selectedSite`, `handleGenerate`)
- **PascalCase**: Interfaces and types (`StoredSite`, `SiteMetadata`)
- **UPPER_CASE**: Constants and environment variables (`API_BASE_URL`, `BUCKET_NAME`)
- **Descriptive prefixes**: Boolean variables with `is`, `has`, `should` prefixes

### Function Naming (5/5 files)
- **Verb-noun pattern**: `generateSite`, `saveSite`, `deleteSite`
- **Handler prefix**: Event handlers use `handle` prefix (`handleGenerate`, `handleDeleteSite`)
- **Get/set pattern**: Data access functions (`getSites`, `getAccessToken`)
- **Async indication**: Async functions clearly indicate their asynchronous nature

## API and External Integration Patterns

### HTTP Client Patterns (3/3 API files)
- **Fetch API**: Consistent use of native fetch for HTTP requests
- **Headers standardization**: Always include `Content-Type` and `Authorization`
- **Response validation**: Check `response.ok` before processing
- **Error propagation**: Throw meaningful errors for failed requests

### Authentication Integration (3/3 auth-related files)
- **Bearer tokens**: Use `Bearer ${token}` format for authorization headers
- **Token validation**: Check token expiration before API calls
- **Automatic logout**: Trigger logout on authentication failures
- **JWT decoding**: Manual JWT payload extraction for user information

### AWS Service Integration (2/2 AWS files)
- **SDK imports**: Use specific AWS SDK imports (`@aws-sdk/client-s3`)
- **Environment configuration**: Leverage environment variables for AWS configuration
- **Error handling**: Specific handling for AWS service errors (NoSuchKey, etc.)
- **Resource naming**: Consistent S3 key patterns (`sites/{userId}/{siteId}/`)

## Template and Content Management

### Template System (2/2 template files)
- **Placeholder syntax**: Use `{{variable}}` for template substitution
- **Template registry**: Centralized template storage with nested objects
- **Raw imports**: Import template files as raw strings
- **Content mapping**: Transform data structures before template injection

### File Processing (2/2 generation files)
- **MIME type detection**: Set appropriate Content-Type based on file extensions
- **Content transformation**: Process content before storage (script injection, etc.)
- **Blob handling**: Use Blob API for client-side file generation
- **URL management**: Proper cleanup of object URLs after use

## React-Specific Patterns

### Hook Usage (3/3 React files)
- **Dependency arrays**: Always specify dependencies for useEffect and useCallback
- **Custom hooks**: Extract reusable logic into custom hooks (`useAuth`)
- **State initialization**: Use functional updates for complex state changes
- **Cleanup functions**: Return cleanup functions from useEffect when needed

### Event Handling (3/3 React files)
- **Form submission**: Use `e.preventDefault()` for form handlers
- **Async handlers**: Wrap async operations in try-catch blocks
- **Loading states**: Manage loading states during async operations
- **User feedback**: Provide immediate feedback for user actions

### Component Lifecycle (3/3 React files)
- **Initialization**: Use useEffect for component initialization
- **Cleanup**: Proper cleanup of event listeners and resources
- **Conditional rendering**: Use early returns for authentication checks
- **State synchronization**: Keep related state variables in sync

## Security and Best Practices

### Data Validation (5/5 files)
- **Input sanitization**: Validate user inputs before processing
- **Type checking**: Runtime type validation for external data
- **Null checks**: Defensive programming with null/undefined checks
- **Token validation**: Verify token existence and expiration

### Storage Security (3/3 storage files)
- **User isolation**: Separate user data with userId prefixes
- **Token storage**: Use localStorage for client-side token persistence
- **Data encryption**: Rely on HTTPS for data transmission security
- **Access control**: Validate user permissions before data operations

### Error Recovery (5/5 files)
- **Graceful failures**: Continue operation when non-critical operations fail
- **User notification**: Inform users of errors without exposing technical details
- **Retry logic**: Implement retry mechanisms for transient failures
- **Fallback values**: Provide sensible defaults when data is unavailable

## Performance Optimization

### Code Splitting (3/3 React files)
- **Lazy loading**: Use dynamic imports for large components
- **Memoization**: Use useCallback and useMemo for expensive operations
- **State optimization**: Minimize unnecessary re-renders
- **Bundle optimization**: Import only needed parts of libraries

### Resource Management (5/5 files)
- **Memory cleanup**: Revoke object URLs and remove event listeners
- **Efficient updates**: Batch state updates when possible
- **Caching strategies**: Cache frequently accessed data
- **Network optimization**: Minimize API calls through intelligent caching