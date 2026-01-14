# OnPrty Monetization Strategy - Realistic Implementation

## Recommended: Simplified Freemium (3-Tier)

### Why This Works Best

**Current App Capabilities:**
- ✅ AI site generation (working)
- ✅ Multiple templates (4 themes)
- ✅ Site storage in S3 (working)
- ✅ Publishing to public URLs (working)
- ✅ User authentication (Cognito)
- ❌ No custom domains yet
- ❌ No analytics yet
- ❌ No team features yet

## Pricing Tiers

### Free Tier
- 3 sites maximum
- All 4 templates
- "Powered by OnPrty" footer badge
- Published on onprty.com subdomain
- Community support (Discord/email)

**Implementation:** ✅ Easy - just add site count check and footer badge

### Pro Tier ($19/month)
- Unlimited sites
- Remove OnPrty branding
- Priority AI generation (faster queue)
- Email support

**Implementation:** ✅ Easy - Stripe integration + remove badge logic

### Agency Tier ($79/month) *(Phase 2)*
- Everything in Pro
- API access (5,000 calls/month)
- White-label (custom branding)
- Priority support

**Implementation:** ⚠️ Medium - requires API development

---

## Why NOT the Complex Options

❌ **Custom domains** - Requires DNS management, SSL automation (complex)
❌ **Analytics** - Needs tracking infrastructure (time-consuming)
❌ **Template marketplace** - Requires creator tools, payment splits (premature)
❌ **Team collaboration** - Needs permission system, sharing (complex)
❌ **Usage-based pricing** - Harder to predict revenue, complex billing

---

## Phase 1 Implementation (Week 1-2)

### Must-Have Features:
1. **Site limit enforcement** - Check count in DynamoDB before generation
2. **Branding badge** - Add footer to free tier sites only
3. **Stripe integration** - Checkout for Pro tier
4. **Subscription status** - Store in DynamoDB user profile
5. **Upgrade flow** - Button in UI to upgrade

### Code Changes Needed:
- Add `subscriptionTier` field to user profile
- Add site count check in Lambda
- Add conditional footer badge in templates
- Add Stripe checkout component
- Add subscription management page

---

## Realistic Revenue Projection (Year 1)

### Conservative
- 500 free users
- 25 Pro subscribers ($19/month) = **$475/month** ($5,700/year)

### Moderate
- 2,000 free users  
- 100 Pro subscribers = **$1,900/month** ($22,800/year)
- 5 Agency subscribers ($79/month) = **$395/month** ($4,740/year)
- **Total: $2,295/month** ($27,540/year)

### Optimistic
- 10,000 free users
- 500 Pro subscribers = **$9,500/month** ($114,000/year)
- 25 Agency subscribers = **$1,975/month** ($23,700/year)
- **Total: $11,475/month** ($137,700/year)

---

## Why This Strategy Wins

✅ **Quick to implement** - 1-2 weeks for Phase 1
✅ **Low complexity** - No infrastructure changes needed
✅ **Clear value prop** - Remove branding = obvious benefit
✅ **Proven model** - Same as Wix, Squarespace free tiers
✅ **Scalable** - Can add features later (domains, analytics)
✅ **Predictable revenue** - Subscription-based MRR

**Start simple, validate demand, then add complexity.**

---

## Key Metrics to Track

### Conversion Metrics
- Free to Paid conversion rate (target: 5-10%)
- Churn rate (target: <5% monthly)
- Upgrade rate (Free to Pro, target: 5-8%)

### Usage Metrics
- Average sites per user
- AI generations per user
- Feature adoption rates

### Revenue Metrics
- Monthly Recurring Revenue (MRR)
- Average Revenue Per User (ARPU)
- Customer Lifetime Value (LTV)
- Customer Acquisition Cost (CAC)
- LTV:CAC ratio (target: 3:1 or higher)

---

## Competitive Positioning

### Competitors
- **Wix**: $16-45/month (website builder)
- **Squarespace**: $16-49/month (website builder)
- **Webflow**: $14-39/month (design tool)
- **10Web**: $10-60/month (AI website builder)

### OnPrty Positioning
- **Price Point**: Mid-market ($19-79/month)
- **Value Prop**: "Professional websites in minutes, not hours"
- **Advantage**: AI-first, faster generation, simpler interface
