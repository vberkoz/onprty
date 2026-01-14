# OnPrty Monetization Implementation Plan

## Payment Provider: Paddle

**Why Paddle over Stripe:**
- **Merchant of Record**: Paddle handles all sales tax, VAT, and compliance
- **No tax complexity**: No need to register for tax IDs in different countries
- **Built-in fraud protection**: Reduces chargebacks and fraud
- **Payment recovery**: Automatic retry logic for failed payments
- **Simpler international**: Supports 200+ countries out of the box
- **Lower operational overhead**: Less code to maintain
- **Better for SaaS**: Optimized for subscription businesses

**Trade-offs:**
- Higher fees (5% + processing vs Stripe 2.9% + $0.30)
- Less checkout customization (Paddle-hosted overlay)
- Weekly payouts instead of daily

## Phase 1: Core Monetization (Week 1-2)

### 1. Database Schema Updates

#### DynamoDB User Profile
```typescript
{
  PK: "USER#${userId}",
  SK: "PROFILE",
  userId: string,
  email: string,
  subscriptionTier: "free" | "pro" | "agency",
  subscriptionStatus: "active" | "canceled" | "past_due" | "paused",
  paddleCustomerId?: string,
  paddleSubscriptionId?: string,
  subscriptionStartDate?: string,
  subscriptionEndDate?: string,
  siteLimit: number, // 3 for free, -1 for unlimited
  createdAt: string,
  updatedAt: string
}
```

**Implementation:**
- Update `cdk/api/sites.js` registerUser function
- Add default `subscriptionTier: "free"` and `siteLimit: 3`
- Migration: Update existing users with default values

---

### 2. Site Limit Enforcement

#### Backend (Lambda)
**File:** `cdk/api/sites.js`

**Implementation approach:**
- Query user profile from DynamoDB
- Check current site count vs subscription tier limit
- Return 403 with upgrade flag if limit reached
- Include subscription tier in response for frontend

```javascript
export async function saveSite(event) {
  const userId = await getUserFromToken(event.headers.authorization);
  
  // Get user profile
  const userProfile = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { PK: `USER#${userId}`, SK: 'PROFILE' }
  }));
  
  // Check site limit
  const sitesResult = await docClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `USER#${userId}`,
      ':sk': 'SITE#'
    },
    Select: 'COUNT'
  }));
  
  const siteCount = sitesResult.Count || 0;
  const siteLimit = userProfile.Item?.siteLimit || 3;
  
  if (siteLimit !== -1 && siteCount >= siteLimit) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: 'Site limit reached',
        limit: siteLimit,
        current: siteCount,
        upgradeRequired: true
      })
    };
  }
  
  // Continue with site creation...
}
```

#### Frontend
**File:** `src/pages/ProjectPage.tsx`

**Implementation approach:**
- Catch site limit errors from API
- Show upgrade modal when limit reached
- Display current tier and limits in UI

```typescript
const handleGenerate = async () => {
  try {
    const result = await generateSite(prompt, selectedTemplate);
    // ... existing code
  } catch (error) {
    if (error.upgradeRequired) {
      setShowUpgradeModal(true);
    } else {
      setError(error.message);
    }
  }
};
```

---

### 3. Branding Badge

#### Template Footer
**File:** `src/services/templates/footer.html`

**Implementation approach:**
- Add conditional branding section to footer template
- Pass `showBranding` flag based on subscription tier
- Style badge to be subtle but visible

```html
<footer class="footer-section">
  <div class="footer-content">
    <p>{{contactText}}</p>
    <div class="footer-links">
      {{#each links}}
      <a href="{{url}}">{{label}}</a>
      {{/each}}
    </div>
    <div class="social-links">
      {{#each socialLinks}}
      <a href="{{url}}">{{platform}}</a>
      {{/each}}
    </div>
  </div>
  {{#if showBranding}}
  <div class="onprty-branding">
    <a href="https://onprty.com" target="_blank">Powered by OnPrty</a>
  </div>
  {{/if}}
</footer>
```

#### CSS for All Templates

**Implementation approach:**
- Add consistent branding styles across all 4 templates
- Ensure badge doesn't interfere with footer content
- Make it responsive for mobile

```css
.onprty-branding {
  text-align: center;
  padding: 1rem 0;
  margin-top: 2rem;
  border-top: 1px solid #e0e0e0;
  font-size: 0.85rem;
  opacity: 0.7;
}

.onprty-branding a {
  color: inherit;
  text-decoration: none;
}
```

#### Site Generator Logic
**File:** `src/services/api/siteGenerator.ts`

**Implementation approach:**
- Fetch user subscription tier from DynamoDB
- Pass tier to template generation
- Conditionally include branding in footer

```typescript
export async function generateSiteFiles(
  schema: SiteData,
  template: string,
  userTier: 'free' | 'pro' | 'agency'
): Promise<Record<string, string>> {
  const showBranding = userTier === 'free';
  
  // Pass showBranding to footer generation
  // ... existing code
}
```

---

### 4. Paddle Integration

#### Backend Setup
**File:** `cdk/api/paddle.js` (new file)

**Implementation approach:**
- Use Paddle Node.js SDK (@paddle/paddle-node-sdk)
- Create checkout session with product/price IDs
- Handle webhook events for subscription lifecycle
- Verify webhook signatures for security
- Update DynamoDB on subscription changes

**Key Functions:**
1. `createCheckoutSession()` - Generate Paddle checkout URL
2. `handleWebhook()` - Process Paddle webhook events
3. `handleSubscriptionCreated()` - Activate subscription in DB
4. `handleSubscriptionUpdated()` - Update subscription status
5. `handleSubscriptionCanceled()` - Downgrade to free tier
6. `createCustomerPortalSession()` - Generate portal URL for management

**Webhook Events to Handle:**
- `subscription.created` - New subscription activated
- `subscription.updated` - Plan change or payment update
- `subscription.canceled` - Subscription ended
- `subscription.paused` - Subscription paused (optional)
- `transaction.completed` - Payment successful
- `transaction.payment_failed` - Payment failed

#### CDK Stack Updates
**File:** `cdk/lib/onprty-stack.ts`

**Implementation approach:**
- Add Paddle environment variables (vendor ID, API key, webhook secret)
- Create webhook endpoint at `/paddle/webhook`
- Configure CORS for Paddle checkout
- Add Lambda permissions for DynamoDB updates

#### Frontend Components
**File:** `src/components/billing/UpgradeModal.tsx` (new file)

**Implementation approach:**
- Use Paddle.js SDK for checkout
- Initialize Paddle with client-side token
- Open Paddle overlay checkout on upgrade click
- Pass user email and metadata (userId, tier)
- Handle success/error callbacks
- Redirect to success page after payment

**Key Features:**
- Display pricing cards for Pro and Agency tiers
- Show feature comparison
- Handle Paddle checkout overlay
- Pass custom data for webhook processing
- Show loading state during checkout

**File:** `src/pages/BillingPage.tsx` (new file)

**Implementation approach:**
- Fetch user subscription from API
- Display current plan and status
- Show usage stats (sites created, limit)
- Provide "Manage Subscription" button
- Open Paddle customer portal for management
- Show upgrade options if on free tier
- Display billing history (optional)

**Paddle Customer Portal:**
- Allows users to update payment method
- Cancel or pause subscription
- View invoices and receipts
- Update billing information
- No custom UI needed - Paddle handles it

---

### 5. Environment Variables

#### `.env.production`
```env
# Existing
VITE_API_URL=https://your-api-gateway-url
VITE_COGNITO_DOMAIN=https://auth.your-domain.com
VITE_COGNITO_CLIENT_ID=your-cognito-client-id
VITE_COGNITO_REDIRECT_URI=https://your-domain.com/auth-callback
VITE_COGNITO_LOGOUT_URI=https://your-domain.com

# New - Paddle
VITE_PADDLE_CLIENT_TOKEN=live_...
VITE_PADDLE_PRO_PRICE_ID=pri_...
VITE_PADDLE_AGENCY_PRICE_ID=pri_...
VITE_PADDLE_ENVIRONMENT=production # or sandbox for testing
```

#### CDK Environment
```bash
export PADDLE_API_KEY="your-paddle-api-key"
export PADDLE_WEBHOOK_SECRET="pdl_ntfset_..."
export PADDLE_VENDOR_ID="12345"
```

---

## Implementation Checklist

### Week 1: Backend & Database
- [ ] Update DynamoDB schema with subscription fields
- [ ] Add site limit check in saveSite Lambda
- [ ] Install Paddle Node.js SDK
- [ ] Create Paddle integration Lambda functions
- [ ] Add Paddle webhook endpoint
- [ ] Set up Paddle products and prices in dashboard
- [ ] Configure webhook in Paddle dashboard
- [ ] Test subscription flow in Paddle sandbox mode
- [ ] Implement webhook signature verification

### Week 2: Frontend & Testing
- [ ] Install Paddle.js SDK in frontend
- [ ] Create UpgradeModal component with Paddle checkout
- [ ] Create BillingPage component
- [ ] Add upgrade prompts when limit reached
- [ ] Add branding badge to templates
- [ ] Update site generator to pass subscription tier
- [ ] Add billing link to navigation
- [ ] Test complete upgrade flow in sandbox
- [ ] Test webhook handling and retries
- [ ] Test customer portal access
- [ ] Deploy to production

---

## Testing Plan

### Unit Tests
- Site limit enforcement logic
- Branding badge conditional rendering
- Paddle webhook signature verification
- Subscription tier mapping

### Integration Tests
- Complete checkout flow (sandbox mode)
- Webhook processing and retries
- Subscription status updates in DynamoDB
- Site limit after upgrade
- Customer portal session creation

### Manual Testing
1. Create free account → generate 3 sites → hit limit
2. Click upgrade → complete Paddle checkout → verify unlimited
3. Generate site → verify no branding badge
4. Open customer portal → cancel subscription → verify downgrade to free
5. Test webhook delivery and processing
6. Test payment failure handling
7. Test subscription pause/resume (if enabled)
8. Verify tax calculation for different countries

---

## Deployment Steps

1. **Paddle Setup**
   - Create Paddle account and verify business details
   - Set up products: Pro ($19/month), Agency ($79/month)
   - Configure pricing in multiple currencies (optional)
   - Get price IDs from Paddle dashboard
   - Set up webhook endpoint URL
   - Configure webhook events to receive
   - Test in Paddle sandbox mode

2. **Backend Deployment**
   - Install Paddle SDK: `npm install @paddle/paddle-node-sdk`
   - Deploy CDK stack with Paddle env vars
   - Verify webhook endpoint is publicly accessible
   - Test webhook with Paddle webhook simulator
   - Verify signature validation works

3. **Frontend Deployment**
   - Install Paddle.js: `npm install @paddle/paddle-js`
   - Add Paddle env vars to build
   - Deploy to CloudFront
   - Test checkout overlay opens correctly
   - Test checkout flow end-to-end in sandbox

4. **Go Live**
   - Switch Paddle to live mode
   - Update env vars with live credentials
   - Update webhook URL to production
   - Monitor webhook logs in Paddle dashboard
   - Track first conversions
   - Monitor for failed payments

---

## Monitoring & Metrics

### CloudWatch Alarms
- Webhook failures (Paddle retries 3 times)
- Subscription creation errors
- Site limit check failures
- DynamoDB update failures

### Paddle Dashboard Metrics
- Subscription MRR
- Churn rate
- Failed payments
- Refund requests
- Checkout conversion rate

### Analytics to Track
- Free to Pro conversion rate
- Checkout abandonment rate (Paddle provides this)
- Time to first upgrade
- Average sites before upgrade
- Monthly churn rate
- Revenue by tier

### Success Criteria
- 5% free to paid conversion in first month
- <1% webhook failure rate
- <5% checkout abandonment (Paddle average: 2-3%)
- Zero billing errors
- <5% monthly churn rate

---

## Rollback Plan

If issues arise:
1. Disable upgrade buttons in UI (feature flag)
2. Set all users to unlimited sites temporarily
3. Fix issues in staging environment
4. Test thoroughly in Paddle sandbox
5. Re-deploy with fixes
6. Re-enable upgrade flow

**Critical:** Never block existing paid users from accessing their sites.

## Paddle-Specific Considerations

### Advantages
- **Merchant of Record**: Paddle handles all tax compliance (VAT, sales tax)
- **Global payments**: Supports 200+ countries and 20+ currencies
- **Fraud protection**: Built-in fraud detection and prevention
- **Payment recovery**: Automatic retry logic for failed payments
- **Invoicing**: Automatic invoice generation and delivery
- **Compliance**: GDPR, PCI DSS compliant out of the box

### Limitations
- **Higher fees**: 5% + payment processing (vs Stripe 2.9% + $0.30)
- **Less customization**: Checkout UI is Paddle-hosted
- **Payout schedule**: Weekly payouts (vs Stripe daily)
- **API limitations**: Fewer API endpoints than Stripe

### When to Use Paddle
✅ Selling to international customers (EU, UK, etc.)
✅ Want to avoid tax compliance complexity
✅ Prefer higher fees for less operational work
✅ SaaS subscription business model
✅ Don't need highly customized checkout

### When to Consider Stripe Instead
❌ Need lowest possible fees
❌ Require custom checkout experience
❌ Need advanced API features
❌ Want daily payouts
❌ Primarily US-based customers
