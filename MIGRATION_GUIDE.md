# DynamoDB Migration Guide

## Overview
This migration moves site storage from S3 to DynamoDB, storing sites as JSON schemas instead of files. Files are generated on-demand for preview and download, and only published sites are stored in the public S3 bucket.

## Architecture Changes

### Before
- Sites stored as files in private S3 bucket (`sites/{userId}/{siteId}/files/`)
- Metadata stored separately in S3
- All sites had files generated and stored

### After
- Sites stored as JSON schemas in DynamoDB table
- Files generated on-demand for preview/download
- Only published sites have files in public S3 bucket
- Reduced storage costs and improved flexibility

## Database Schema

### DynamoDB Table: `onprty-sites`
- **Partition Key**: `userId` (String)
- **Sort Key**: `siteId` (String)
- **Attributes**:
  - `name` - Site name
  - `description` - Site description
  - `schema` - JSON schema containing:
    - `userPrompt` - Original user prompt
    - `generatedData` - Site structure and content
    - `template` - Template name (monospace/neubrutalism)
  - `status` - 'draft' | 'published'
  - `publishedUrl` - URL when published (optional)
  - `createdAt` - ISO timestamp
  - `updatedAt` - ISO timestamp

## API Changes

### New Endpoints
- `GET /sites/{id}/preview` - Generate files for preview
- `GET /sites/{id}/download` - Generate files for download

### Modified Endpoints
- `POST /sites` - Now accepts `schema` instead of `files`
- `GET /sites` - Returns sites without files (lighter payload)
- `GET /sites/{id}` - Returns site with schema, calls preview for files
- `POST /sites/{id}/publish` - Generates and uploads files to public S3

## Deployment Steps

1. **Install Lambda dependencies**:
   ```bash
   cd cdk/api
   npm install
   ```

2. **Deploy CDK stack**:
   ```bash
   cd cdk
   npm run build
   cdk deploy
   ```

3. **Verify deployment**:
   - Check DynamoDB table created: `onprty-sites`
   - Verify Lambda has DynamoDB permissions
   - Test preview endpoint

## Frontend Changes

### StoredSite Interface
- Added `schema?: SiteSchema` field
- Made `files` optional (generated on-demand)

### Site Generation Flow
1. User enters prompt
2. AI generates site structure
3. Frontend generates preview files
4. Schema saved to DynamoDB
5. Files generated on-demand for preview

### Preview Flow
1. User selects site
2. Frontend calls `/sites/{id}/preview`
3. Backend generates files from schema
4. Files returned for preview

### Publish Flow
1. User clicks publish
2. Backend generates files from schema
3. Files uploaded to public S3
4. CloudFront serves published site

## Benefits

1. **Reduced Storage**: Only published sites stored as files
2. **Flexibility**: Can regenerate sites with different templates
3. **Cost Savings**: DynamoDB cheaper for metadata storage
4. **Versioning**: Easy to track schema changes
5. **Performance**: Lighter API responses (no files in list view)

## Rollback Plan

If issues occur:
1. Keep old S3 bucket temporarily
2. Export DynamoDB data
3. Revert CDK stack to previous version
4. Restore from S3 backup

## Testing Checklist

- [ ] Generate new site
- [ ] Preview generated site
- [ ] Save site to DynamoDB
- [ ] List all sites
- [ ] View individual site
- [ ] Publish site to public S3
- [ ] Verify published URL works
- [ ] Unpublish site
- [ ] Download site as ZIP
- [ ] Delete site

## Notes

- Old S3 bucket can be removed after migration
- DynamoDB table uses on-demand billing
- Template engine runs in Lambda (no frontend dependency)
- Public S3 bucket unchanged (still serves published sites)
