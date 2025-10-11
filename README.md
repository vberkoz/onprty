# OnPrty - AI-Powered Website Generator

OnPrty is an AI-powered website generation platform that transforms text prompts into complete, functional websites using AWS cloud infrastructure.

## Features

- **AI Website Generation**: Convert natural language descriptions into structured websites
- **Multi-Template Support**: Customizable website templates with various sections
- **User Authentication**: Secure login with Amazon Cognito and Google OAuth
- **Cloud Storage**: Sites stored in AWS S3 with user isolation
- **Real-time Preview**: Instant website preview with navigation
- **Multi-Section Websites**: Hero, features, text blocks, CTA, and team sections

## Tech Stack

### Frontend
- **React 19.1.1** with TypeScript
- **Vite 7.1.7** for build tooling
- **React Router 7.9.3** for navigation
- **Amazon Cognito Identity JS** for authentication

### Backend & Infrastructure
- **AWS CDK** for Infrastructure as Code
- **AWS Lambda** (Node.js 22.x) for serverless API
- **Amazon S3** for site storage
- **Amazon Cognito** for user management
- **Amazon Bedrock** (Nova Micro) for AI generation
- **API Gateway v2** with rate limiting
- **CloudFront** for content delivery

## Project Structure

```
onprty/
├── src/                    # React frontend application
│   ├── components/         # Reusable React components
│   ├── context/           # Authentication context
│   ├── pages/             # Route components
│   └── services/          # API services and templates
├── cdk/                   # AWS CDK infrastructure
│   ├── lib/               # Stack definitions
│   └── api/               # Lambda function code
└── public/                # Static assets
```

## Development Setup

### Prerequisites
- Node.js 18+
- AWS CLI configured
- Google OAuth credentials

### Environment Variables

Create `.env.development` and `.env.production`:

```env
VITE_API_URL=https://your-api-gateway-url
VITE_COGNITO_DOMAIN=https://auth.your-domain.com
VITE_COGNITO_CLIENT_ID=your-cognito-client-id
VITE_COGNITO_REDIRECT_URI=https://your-domain.com/auth-callback
VITE_COGNITO_LOGOUT_URI=https://your-domain.com
```

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Infrastructure Deployment

```bash
# Set environment variables
export GOOGLE_CLIENT_ID="your-google-client-id"
export GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Deploy CDK stack
cd cdk
npm install
npm run deploy
```

## Site Storage Architecture

Sites are stored in S3 with user isolation:

```
sites/
├── {userId}/
│   ├── {siteId}/
│   │   ├── metadata.json    # Site info and status
│   │   └── files/
│   │       ├── index.html
│   │       ├── styles.css
│   │       └── script.js
```

## API Endpoints

- `POST /generate` - Generate new website from prompt
- `GET /sites` - Get user's sites
- `POST /sites` - Save new site
- `GET /sites/{id}` - Get specific site
- `PUT /sites/{id}` - Update site
- `DELETE /sites/{id}` - Delete site

## Template System

Websites use a modular template system:

- **Base Template**: HTML structure with CSS and JavaScript
- **Sections**: Hero, features, text blocks, CTA, team members
- **Placeholders**: `{{variable}}` syntax for dynamic content
- **Responsive Design**: Mobile-first CSS with flexbox/grid

## Authentication Flow

1. User clicks login → Redirected to Cognito Hosted UI
2. Google OAuth authentication
3. Cognito returns JWT tokens via URL fragment
4. Frontend stores tokens and decodes user info
5. API calls include Bearer token for authorization

## Contributing

1. Follow TypeScript strict mode
2. Use interface-first design
3. Implement proper error handling
4. Add meaningful commit messages
5. Test authentication flows

## License

MIT License
