# OnPrty Development Guidelines

## Code Quality Standards

### TypeScript Usage
- **Strict typing**: All files use TypeScript with explicit interface definitions
- **Interface-first design**: Define interfaces before implementation (e.g., `AuthTokens`, `StoredSite`, `SiteData`)
- **Type safety**: Use proper typing for function parameters and return values
- **Optional chaining**: Leverage TypeScript's optional properties (`email?: string`)

### Import/Export Patterns
- **ES6 modules**: Use `import`/`export` syntax consistently
- **Named exports**: Prefer named exports over default exports for utilities
- **Template imports**: Use Vite's `?raw` suffix for importing text files as strings
- **Environment variables**: Access via `import.meta.env.VITE_*` pattern

### Error Handling
- **Promise-based**: Use async/await with proper error handling
- **Graceful degradation**: Handle missing templates and API failures
- **User feedback**: Provide meaningful error messages to users
- **Validation**: Check for required data before processing

## Architectural Patterns

### React Component Structure
- **Functional components**: Use React functional components with hooks
- **Context pattern**: Centralize state management with React Context
- **Custom hooks**: Extract reusable logic into custom hooks (`useAuth`)
- **Component composition**: Build complex UIs from smaller, focused components

### State Management
- **Local state**: Use `useState` for component-specific state
- **Global state**: Use Context API for shared authentication state
- **Persistence**: Store user data in localStorage for session management
- **Immutable updates**: Follow React's immutable state update patterns

### Service Layer Architecture
- **Separation of concerns**: Keep business logic in dedicated service files
- **API abstraction**: Abstract external API calls in service modules
- **Template system**: Modular template-based content generation
- **Storage abstraction**: Use IndexedDB through service layer functions

## Naming Conventions

### File Naming
- **PascalCase**: React components (`AuthContext.tsx`, `ProjectPage.tsx`)
- **camelCase**: Service files (`siteGenerator.ts`, `siteStorage.ts`)
- **kebab-case**: Configuration files (`eslint.config.js`)
- **Descriptive names**: Clear, purpose-driven file names

### Variable Naming
- **camelCase**: Variables and functions (`isAuthenticated`, `processAuthRedirect`)
- **UPPER_CASE**: Constants and environment variables (`DB_NAME`, `VITE_API_URL`)
- **Descriptive**: Self-documenting variable names (`expiresAt`, `navItemsHtml`)

### Interface Naming
- **PascalCase**: Interface names (`AuthContextType`, `SiteMetadata`)
- **Descriptive**: Clear purpose indication (`StoredSite`, `AuthTokens`)
- **Type suffix**: Use `Type` suffix for context interfaces

## Development Practices

### Code Organization
- **Feature-based**: Group related files by feature/domain
- **Consistent structure**: Follow established directory patterns
- **Single responsibility**: Each file/function has one clear purpose
- **Modular design**: Build reusable, composable components

### Performance Considerations
- **Lazy loading**: Use React.lazy for code splitting where appropriate
- **Memoization**: Use `useCallback` for stable function references
- **Efficient rendering**: Minimize unnecessary re-renders
- **Asset optimization**: Use Vite's built-in optimizations

### Security Practices
- **Environment variables**: Store sensitive data in environment variables
- **Token management**: Secure handling of authentication tokens
- **Input validation**: Validate user inputs and API responses
- **HTTPS**: Use secure protocols for API communication

## Template System Guidelines

### Template Structure
- **Modular sections**: Break templates into reusable section components
- **Placeholder syntax**: Use `{{variable}}` syntax for template variables
- **Nested templates**: Support item-level templates within sections
- **CSS variables**: Use CSS custom properties for theming

### Content Generation
- **Data-driven**: Generate content from structured data objects
- **Type safety**: Define interfaces for template data structures
- **Fallback handling**: Provide defaults for missing template data
- **Responsive design**: Ensure generated content works across devices

## API Integration Patterns

### HTTP Client Usage
- **Fetch API**: Use native fetch for HTTP requests
- **Error handling**: Check response status and handle failures
- **Content-Type**: Set appropriate headers for JSON requests
- **Environment configuration**: Use environment variables for API URLs

### Authentication Flow
- **OAuth2**: Implement standard OAuth2 flows with Cognito
- **Token storage**: Secure token storage in localStorage
- **Automatic refresh**: Handle token expiration gracefully
- **Redirect handling**: Process OAuth callbacks properly