# Site Schema Reference

## Schema Structure

```typescript
{
  userPrompt: string;
  template: 'monospace' | 'neubrutalism';
  generatedData: {
    siteMetadata: {
      title: string;
      navTitle: string;
      description: string;
      author: string;
    };
    pages: [
      {
        path: string;
        fileName: string;
        navLabel: string;
        pageTitle: string;
        sections: [
          {
            type: 'hero' | 'features' | 'text_block' | 'call_to_action' | 'team_members';
            data: Record<string, unknown>;
          }
        ];
      }
    ];
  };
}
```

## Section Types

### Hero Section
```json
{
  "type": "hero",
  "data": {
    "heading": "Welcome to Our Site",
    "subheading": "Building amazing things",
    "ctaText": "Get Started",
    "ctaLink": "about.html"
  }
}
```

### Features Section
```json
{
  "type": "features",
  "data": {
    "heading": "Our Features",
    "items": [
      {
        "heading": "Fast",
        "description": "Lightning fast performance"
      },
      {
        "heading": "Secure",
        "description": "Bank-level security"
      }
    ]
  }
}
```

### Text Block Section
```json
{
  "type": "text_block",
  "data": {
    "title": "About Us",
    "content": "<p>We are a company...</p>"
  }
}
```

### Call to Action Section
```json
{
  "type": "call_to_action",
  "data": {
    "heading": "Ready to Start?",
    "subheading": "Join thousands of users",
    "ctaText": "Sign Up Now",
    "ctaLink": "signup.html"
  }
}
```

### Team Members Section
```json
{
  "type": "team_members",
  "data": {
    "heading": "Meet Our Team",
    "members": [
      {
        "name": "John Doe",
        "role": "CEO",
        "bio": "Passionate about technology"
      }
    ]
  }
}
```

## Example Complete Schema

```json
{
  "userPrompt": "Create a landing page for a SaaS product",
  "template": "monospace",
  "generatedData": {
    "siteMetadata": {
      "title": "CloudSync",
      "navTitle": "CloudSync",
      "description": "Sync your files across all devices",
      "author": "CloudSync Inc"
    },
    "pages": [
      {
        "path": "/",
        "fileName": "index.html",
        "navLabel": "Home",
        "pageTitle": "CloudSync - Sync Your Files",
        "sections": [
          {
            "type": "hero",
            "data": {
              "heading": "Sync Files Effortlessly",
              "subheading": "Access your files anywhere, anytime",
              "ctaText": "Start Free Trial",
              "ctaLink": "signup.html"
            }
          },
          {
            "type": "features",
            "data": {
              "heading": "Why Choose CloudSync",
              "items": [
                {
                  "heading": "Fast Sync",
                  "description": "Files sync in seconds"
                },
                {
                  "heading": "Secure",
                  "description": "End-to-end encryption"
                },
                {
                  "heading": "Cross-Platform",
                  "description": "Works on all devices"
                }
              ]
            }
          },
          {
            "type": "call_to_action",
            "data": {
              "heading": "Ready to Get Started?",
              "subheading": "Join 10,000+ users today",
              "ctaText": "Sign Up Free",
              "ctaLink": "signup.html"
            }
          }
        ]
      }
    ]
  }
}
```

## File Generation

When a site is previewed or published, the schema is processed to generate HTML files:

1. **Navigation** is generated from all pages
2. **Sections** are rendered based on type
3. **Template styles** are injected inline
4. **Scripts** are injected inline
5. Each page becomes a separate HTML file

## Storage

- **DynamoDB**: Stores the schema
- **Public S3**: Stores generated files (only when published)
- **Frontend**: Generates files on-demand for preview
