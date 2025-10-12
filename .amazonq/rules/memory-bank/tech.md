# OnPrty Technology Stack

## Frontend Technologies

### Core Framework
- **React 19.1.1**: Latest React with concurrent features and improved performance
- **TypeScript 5.8.3**: Static typing for enhanced development experience
- **Vite 7.1.7**: Fast build tool with hot module replacement
- **React Router 7.9.3**: Client-side routing and navigation

### Authentication
- **Amazon Cognito Identity JS 6.3.15**: AWS authentication SDK
- **JWT Tokens**: Secure session management
- **Google OAuth**: Third-party authentication integration

### Development Tools
- **ESLint 9.36.0**: Code linting and style enforcement
- **TypeScript ESLint 8.44.0**: TypeScript-specific linting rules
- **Vite React Plugin 5.0.3**: React integration for Vite

## Backend Technologies

### Infrastructure
- **AWS CDK 2.1029.3**: Infrastructure as Code framework
- **AWS CDK Lib 2.215.0**: Core CDK constructs and services
- **Node.js 22.x**: Lambda runtime environment

### AWS Services
- **Amazon Bedrock**: AI model hosting (Nova Micro)
- **AWS Lambda**: Serverless compute functions
- **Amazon S3**: Object storage for generated sites
- **Amazon Cognito**: User authentication and management
- **API Gateway v2**: HTTP API with rate limiting
- **CloudFront**: Content delivery network

### Development Dependencies
- **Jest 29.7.0**: Testing framework
- **TypeScript 5.6.3**: Backend type checking
- **ts-node 10.9.2**: TypeScript execution for Node.js
- **dotenv 17.2.3**: Environment variable management

## Build System

### Frontend Build
```bash
# Development server
npm run dev          # Starts Vite dev server with HMR

# Production build
npm run build        # TypeScript compilation + Vite build

# Code quality
npm run lint         # ESLint code analysis

# Preview
npm run preview      # Preview production build locally
```

### Infrastructure Deployment
```bash
# CDK commands
npm run build        # Compile TypeScript to JavaScript
npm run watch        # Watch mode for development
npm run test         # Run Jest tests
npm run cdk          # CDK CLI commands
```

## Configuration Files

### Frontend Configuration
- **vite.config.ts**: Vite build configuration
- **tsconfig.json**: TypeScript compiler options
- **tsconfig.app.json**: Application-specific TypeScript config
- **tsconfig.node.json**: Node.js TypeScript configuration
- **eslint.config.js**: ESLint rules and settings

### Backend Configuration
- **cdk.json**: CDK application configuration
- **jest.config.js**: Jest testing configuration
- **tsconfig.json**: Backend TypeScript configuration
- **.env**: Environment variables for deployment

## Environment Variables

### Frontend Environment
```env
VITE_API_URL=https://your-api-gateway-url
VITE_COGNITO_DOMAIN=https://auth.your-domain.com
VITE_COGNITO_CLIENT_ID=your-cognito-client-id
VITE_COGNITO_REDIRECT_URI=https://your-domain.com/auth-callback
VITE_COGNITO_LOGOUT_URI=https://your-domain.com
```

### Backend Environment
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Development Commands

### Local Development
```bash
# Install dependencies
npm install

# Start development server (port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Infrastructure Management
```bash
# Navigate to CDK directory
cd cdk

# Install CDK dependencies
npm install

# Deploy infrastructure
npm run deploy

# Destroy infrastructure
cdk destroy

# View differences
cdk diff
```

## File Extensions and Types

### Supported File Types
- **Frontend**: `.tsx`, `.ts`, `.css`, `.html`, `.json`
- **Backend**: `.ts`, `.js`, `.json`
- **Templates**: `.html`, `.css`, `.js`, `.txt`
- **Configuration**: `.json`, `.js`, `.ts`, `.env`

## Package Management

### Frontend Dependencies
- **Production**: React ecosystem, Cognito SDK
- **Development**: Build tools, linting, TypeScript support

### Backend Dependencies
- **Production**: AWS CDK constructs, utility libraries
- **Development**: Testing framework, TypeScript tooling

## Browser Compatibility

### Target Browsers
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: ES2020, CSS Grid, Flexbox, Fetch API, LocalStorage

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Dead code elimination
- **Asset Optimization**: Image and bundle optimization
- **Lazy Loading**: Component-level lazy loading

### Backend Optimization
- **Lambda Cold Starts**: Optimized bundle sizes
- **S3 Performance**: Efficient object storage patterns
- **CloudFront Caching**: Global content delivery
- **API Rate Limiting**: Request throttling and protection

## Security Features

### Frontend Security
- **HTTPS Only**: Secure communication protocols
- **JWT Validation**: Token-based authentication
- **CORS Configuration**: Cross-origin request protection
- **Input Sanitization**: XSS prevention measures

### Backend Security
- **IAM Roles**: Least privilege access patterns
- **VPC Configuration**: Network isolation
- **Encryption**: Data encryption at rest and in transit
- **API Authentication**: Bearer token validation