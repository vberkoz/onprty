# Testing Guide for Folder Structure Changes

## Prerequisites
- Node.js installed
- AWS CDK deployed (backend running)
- Environment variables configured in `.env.development`

## 1. Build Test
```bash
npm run build
```
**Expected:** Build completes without TypeScript errors

## 2. Development Server Test
```bash
npm run dev
```
**Expected:** Server starts on http://localhost:5173

## 3. Import Resolution Tests

### Test Types Import
Open browser console and check for:
- No module resolution errors
- No "Cannot find module" errors

### Test Constants Import
Verify in browser DevTools > Network:
- API calls use correct `VITE_API_URL`
- Auth redirects use correct Cognito domain

## 4. Component Rendering Tests

### UI Components
- [ ] Navigate to app - buttons render correctly
- [ ] Open dropdowns - dropdown menus work
- [ ] Trigger loading states - spinners display
- [ ] Open delete dialog - confirmation dialog appears

### Layout Components
- [ ] Header displays with profile dropdown
- [ ] Sidebar toggle works
- [ ] Navigation functions properly

### Site Components
- [ ] Site generator form renders
- [ ] Site manager displays sites list
- [ ] Site preview shows iframe
- [ ] Site editor opens and displays sections

## 5. Functionality Tests

### Authentication Flow
- [ ] Login redirects to Cognito
- [ ] Callback processes tokens correctly
- [ ] User info displays in header
- [ ] Logout clears session

### Site Generation
- [ ] Generate new site with prompt
- [ ] Site appears in sites list
- [ ] Preview displays generated HTML
- [ ] Template selection works (monospace/neubrutalism)

### Site Management
- [ ] Select different sites from dropdown
- [ ] Switch between files in preview
- [ ] Publish site successfully
- [ ] Download site as ZIP
- [ ] Delete site with confirmation

### Site Editing
- [ ] Edit site metadata
- [ ] Edit section content
- [ ] Add/remove sections
- [ ] Changes reflect in preview
- [ ] Auto-save works (500ms debounce)

## 6. Constants Verification

### Check Environment Variables
```bash
# In browser console
console.log(import.meta.env.VITE_API_URL)
console.log(import.meta.env.VITE_COGNITO_DOMAIN)
```
**Expected:** Values match `.env.development`

### Check Storage Keys
```bash
# In browser console
localStorage.getItem('cognitoTokens')
```
**Expected:** Returns token object or null

### Check Default Values
- [ ] New sites use 'monospace' template by default
- [ ] Features use default icons (⚡, 🎨, 📱, etc.)
- [ ] Team members use placeholder image
- [ ] CTA buttons show "Learn More" by default

## 7. Error Handling Tests

### Network Errors
- [ ] Disconnect network - shows appropriate error
- [ ] Invalid API response - handles gracefully

### Auth Errors
- [ ] Expired token - redirects to login
- [ ] Invalid token - clears and redirects

### Validation Errors
- [ ] Empty prompt - button disabled
- [ ] Missing required fields - shows validation

## 8. Browser Console Check
Open DevTools Console and verify:
- [ ] No TypeScript errors
- [ ] No import/module errors
- [ ] No undefined variable errors
- [ ] No missing constant errors

## 9. Production Build Test
```bash
npm run build
npm run preview
```
**Expected:** Production build works identically to dev

## Quick Smoke Test (5 minutes)
1. `npm run dev`
2. Login with Google
3. Generate a site with any prompt
4. Preview the generated site
5. Edit a section
6. Publish the site
7. Download as ZIP
8. Delete the site
9. Logout

**All steps should complete without errors.**

## Rollback Plan
If issues found:
```bash
git stash
# Or revert specific commits
git revert <commit-hash>
```

## Success Criteria
✅ Build completes without errors
✅ All imports resolve correctly
✅ All components render properly
✅ All functionality works as before
✅ No console errors
✅ Constants are used consistently
