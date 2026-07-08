# WhatsApp Business API — Phase 2 Options

> **Current state:** The Gege Mould website uses an on-site chat widget that provides auto-responses and hands off to the free `wa.me` link. True **in-app** auto-replies inside WhatsApp itself require WhatsApp Business API access.

---

## What the Business API Enables (vs. Current Free Setup)

| Feature | Current (Free wa.me) | Business API |
|---|---|---|
| Auto-reply inside WhatsApp | No | Yes |
| Pre-built message templates | No | Yes (Meta-approved) |
| Multi-agent handoff | No | Yes |
| Analytics dashboard | No | Yes |
| CRM integration | No | Yes |
| Verified business badge | No | Yes |

---

## Provider Comparison

### 1. Meta Direct (WhatsApp Cloud API)

| Item | Detail |
|---|---|
| **Pricing** | First 1,000 conversations/month free. Then ~$0.005–$0.08/conversation depending on category (marketing, utility, service) and region |
| **Setup** | Meta Business Account → Business Verification → WhatsApp Business App → API access |
| **Hosting** | Cloud-hosted by Meta. No server needed |
| **Approval Time** | 1–5 business days for business verification |
| **Message Templates** | Must be pre-approved by Meta (24h turnaround typical) |
| **Best For** | Low-to-mid volume. Quickest to set up |

### 2. Twilio (WhatsApp Business API via Twilio)

| Item | Detail |
|---|---|
| **Pricing** | ~$0.005/conversation (inbound). ~$0.013–$0.05/conversation (outbound). No monthly fee for first number |
| **Setup** | Twilio account → Submit business for WhatsApp approval → Configure webhook to your backend |
| **Hosting** | You write the webhook handler (Express/Node.js). Twilio handles WhatsApp delivery |
| **Approval Time** | 3–10 business days |
| **Message Templates** | Submitted via Twilio Console → forwarded to Meta |
| **Best For** | Mid-volume. Better developer experience, good Node.js SDK |

### 3. 360dialog

| Item | Detail |
|---|---|
| **Pricing** | ~€39/month (starter). Includes 1,000 conversations. Additional ~€0.01/conversation |
| **Setup** | Sign up → verify business → connect WhatsApp number |
| **Hosting** | 360dialog hosts the API. You integrate via their REST API |
| **Approval Time** | 2–7 business days |
| **Message Templates** | Managed via 360dialog dashboard |
| **Best For** | Quick setup. Good if you don't want to manage webhooks directly |

---

## Recommendation

For Gege Mould, **Meta Cloud API (direct)** is the best starting point:
- It's free for up to 1,000 conversations/month
- No BSP (Business Solution Provider) markup
- Direct Meta relationship for template approval
- Cloud-hosted — minimal backend changes needed

### What You'll Need to Start

1. **Meta Business Account** (free — business.facebook.com)
2. **Business Verification** — requires legal business documents (营业执照)
3. **A dedicated phone number** — cannot be already registered with WhatsApp Messenger or WhatsApp Business app
4. **A webhook endpoint** on your backend to receive messages (Express route already ready to extend)

### Estimated Timeline
- Business verification: 2–5 business days
- Template approval: 1–2 business days per template
- Integration development: 2–3 days

---

## Integration Plan (When You're Ready)

1. Set up Meta Business Account and verify
2. Create a WhatsApp Business App in Meta Developer Console
3. Configure webhook URL: `https://gegemould.com/api/whatsapp-webhook`
4. Add webhook verification and message handling to `backend/routes/whatsapp.js`
5. Create message templates in Meta (matching the quick-reply flows already built in the on-site widget)
6. Deploy and test in sandbox

**Current on-site widget continues to function independently during and after API setup.**
