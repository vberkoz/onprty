# OnPrty Project Structure

## Root Directory Organization

```
onprty/
├── src/                    # React frontend application
├── cdk/                   # AWS CDK infrastructure code
├── public/                # Static assets
├── .amazonq/              # Amazon Q configuration
└── config files           # Build and development configuration
```

## Frontend Application (`src/`)

### Core Structure
```
src/
├── components/            # Reusable UI components
├── context/              # React context providers
├── pages/                # Route-based page components
├── services/             # API services and business logic
├── assets/               # Static resources
├── main.tsx              # Application entry point
└── index.css             # Global styles
```

### Component Architecture
- **AppLayout.tsx**: Main application shell with navigation
- **AppNavbar.tsx**: Top navigation bar component
- **Button.tsx**: Reusable button component with variants
- **Dropdown.tsx**: Custom dropdown selection component
- **ProtectedRoute.tsx**: Authentication guard for protected pages

### Page Components
- **LoginPage.tsx**: User authentication interface
- **AuthCallback.tsx**: OAuth callback handler
- **ProjectPage.tsx**: Main application workspace (site generation and management)

### Service Layer
```
services/
├── templates/            # Website template definitions
│   ├── mono/            # Minimalist template files
│   └── modern/          # Neo-brutalist template files
├── siteGenerator.ts     # AI-powered site generation logic
├── siteStorageS3.ts     # AWS S3 storage operations
└── system-prompt.txt    # AI generation prompts
```

## Backend Infrastructure (`cdk/`)

### CDK Structure
```
cdk/
├── lib/                  # Stack definitions
├── api/                  # Lambda function code
├── bin/                  # CDK application entry
├── test/                 # Infrastructure tests
└── cdk.out/             # Generated CloudFormation templates
```

### Infrastructure Components
- **onprty-cdk-stack.ts**: Main infrastructure stack definition
- **lambda.js**: API Gateway Lambda handler
- **sites.js**: Site management Lambda functions

## Template System Architecture

### Template Organization
Each template contains modular HTML components:
- **base.html**: Main page structure and layout
- **hero.html**: Landing section template
- **features.html**: Feature showcase container
- **features-item.html**: Individual feature component
- **text-block.html**: Content section template
- **team-members.html**: Team section container
- **team-member-item.html**: Individual team member component
- **call-to-action.html**: CTA section template
- **styles.css**: Template-specific styling
- **script.js**: Interactive functionality

### Template Processing Flow
1. AI generates structured content data
2. Template engine selects appropriate template
3. Content is injected into template placeholders
4. CSS and JavaScript are bundled with HTML
5. Complete site files are generated and stored

## Data Flow Architecture

### Authentication Flow
```
User → Cognito Hosted UI → Google OAuth → JWT Tokens → Frontend Storage → API Requests
```

### Site Generation Flow
```
User Prompt → AI Service (Bedrock) → Template Engine → File Generation → S3 Storage → Preview
```

### Site Management Flow
```
User Actions → API Gateway → Lambda Functions → S3 Operations → Database Updates → Frontend Updates
```

## Storage Architecture

### S3 Bucket Organization
```
sites/
└── {userId}/
    └── {siteId}/
        ├── metadata.json    # Site information and status
        └── files/
            ├── index.html   # Main page
            ├── styles.css   # Styling
            └── script.js    # Functionality
```

### Local Storage Strategy
- JWT tokens stored in browser localStorage
- User session persistence across browser sessions
- Temporary site data cached during generation

## Component Relationships

### Frontend Dependencies
- **AuthContext** provides authentication state to all components
- **ProjectPage** orchestrates site generation and management
- **Services** handle external API communication and data processing
- **Components** provide reusable UI elements across pages

### Backend Dependencies
- **API Gateway** routes requests to appropriate Lambda functions
- **Lambda Functions** process business logic and interact with AWS services
- **S3** provides persistent storage for generated sites
- **Cognito** manages user authentication and authorization

## Architectural Patterns

### Frontend Patterns
- **Context Provider Pattern**: Centralized authentication state management
- **Service Layer Pattern**: Separation of API logic from UI components
- **Component Composition**: Reusable UI building blocks
- **Protected Routes**: Authentication-based access control

### Backend Patterns
- **Serverless Architecture**: Event-driven Lambda functions
- **Infrastructure as Code**: CDK for reproducible deployments
- **RESTful API Design**: Standard HTTP methods and status codes
- **User Isolation**: Tenant-based data separation in S3