# OnPrty Project Structure

## Root Directory Organization
```
onprty/
├── src/                    # Main React application
├── cdk/                    # AWS CDK infrastructure code
├── texttosite/             # Legacy/alternative implementation
├── public/                 # Static assets
└── config files            # Build and development configuration
```

## Core Application Structure (`src/`)
```
src/
├── components/             # Reusable React components
│   ├── AppLayout.tsx      # Main application layout wrapper
│   ├── AppNavbar.tsx      # Navigation component
│   └── ProtectedRoute.tsx # Authentication route guard
├── context/               # React context providers
│   └── AuthContext.tsx    # Authentication state management
├── pages/                 # Route-based page components
│   ├── AuthCallback.tsx   # OAuth callback handler
│   ├── LoginPage.tsx      # User authentication interface
│   └── ProjectPage.tsx    # Main project workspace
├── services/              # Business logic and API services
│   ├── templates/         # Website generation templates
│   ├── siteGenerator.ts   # Core site generation logic
│   ├── siteStorage.ts     # Site data persistence
│   └── system-prompt.txt  # AI prompt configuration
└── main.tsx              # Application entry point
```

## Infrastructure Layer (`cdk/`)
```
cdk/
├── bin/                   # CDK application entry points
├── lib/                   # Stack definitions and constructs
├── api/                   # Lambda function implementations
└── test/                  # Infrastructure testing
```

## Template System (`src/services/templates/`)
- **mono/**: Monotype template with base HTML, CSS, and JavaScript
- Modular section-based architecture for flexible website composition
- Supports hero, features, text blocks, CTA, and team member sections

## Architectural Patterns
- **Component-Based Architecture**: React components with clear separation of concerns
- **Context Pattern**: Centralized state management for authentication
- **Service Layer**: Abstracted business logic in dedicated service modules
- **Template Engine**: Configurable website generation with replaceable templates
- **Infrastructure as Code**: AWS CDK for reproducible cloud deployments

## Key Relationships
- **Frontend ↔ Backend**: React app communicates with AWS Lambda via REST API
- **Authentication Flow**: Cognito integration through AuthContext and ProtectedRoute
- **Generation Pipeline**: User input → AI processing → Template rendering → File output
- **Template System**: Base templates + dynamic sections = complete websites