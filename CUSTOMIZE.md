# Customization Guide — ChatKit

Everything you need to make ChatKit your own.

## 📋 Table of Contents

- [Branding](#branding)
- [AI Models](#ai-models)
- [Pricing Plans](#pricing-plans)
- [Rate Limits](#rate-limits)
- [Auth Settings](#auth-settings)
- [UI Theme](#ui-theme)

---

## Branding

### App Name & Logo

1. **Name**: Search and replace `ChatKit` with your brand name across:
   - `components/landing/landing-navbar.tsx` — navbar logo text
   - `app/layout.tsx` — HTML title
   - `README.md`, `SETUP.md` — documentation

2. **Logo**: Replace the Sparkles icon in `landing-navbar.tsx` and `chat-sidebar.tsx` with your own SVG/image.

3. **Favicon**: Replace `app/favicon.ico` with your own.

### Colors & Theme

Edit `app/globals.css` — the `@theme` section:

```css
@theme {
  --color-primary: #7c3aed;      /* Main brand color (purple) */
  --color-accent: #06b6d4;       /* Secondary color (cyan) */
  --color-background: #0a0a0a;   /* Page background */
  --color-foreground: #fafafa;   /* Text color */
  --color-card: #1a1a1a;         /* Card background */
  --color-border: #2a2a2a;       /* Border color */
  --color-muted-foreground: #a1a1aa; /* Secondary text */
}
```

Also update the gradient in the `gradient-text` class:
```css
.gradient-text {
  background: linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #06b6d4 100%);
}
```

### Landing Page Copy

- **Hero text**: `components/landing/hero-section.tsx` — headline, description, typewriter texts
- **Features**: `app/(landing)/page.tsx` — feature cards (title, description, icon)
- **Tech stack logos**: `components/landing/logo-marquee.tsx` — company logos
- **CTA text**: Hero buttons, bottom CTA section

---

## AI Models

### Change Available Models

Edit `types/index.ts` — the `MODELS` array:

```typescript
export const MODELS: ModelConfig[] = [
  {
    id: "glm-4.5-air",
    name: "GLM-4.5 Air",
    description: "Fastest responses",
    minPlan: "free",          // Minimum plan required
  },
  {
    id: "glm-4.7",
    name: "GLM-4.7",
    description: "Balanced & stable",
    minPlan: "free",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "OpenAI's fast model",
    minPlan: "pro",           // Only pro users can use
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "Most capable",
    minPlan: "enterprise",    // Enterprise only
  },
];
```

### Change AI Provider

Edit `lib/ai.ts` to use a different provider:

```typescript
// Example: Switch to OpenAI
import { openai } from "@ai-sdk/openai";

export function getModel(modelId: string) {
  return openai(modelId);
}
```

You may need to install the provider package:
```bash
npm install @ai-sdk/openai
```

Supported providers: OpenAI, Anthropic, Google, Groq, Mistral, Cohere, and more.
See [Vercel AI SDK Providers](https://sdk.vercel.ai/providers).

---

## Pricing Plans

### Plan Limits

Edit `types/index.ts`:

```typescript
export const PLAN_LIMITS: Record<Plan, { messagesPerDay: number }> = {
  free: { messagesPerDay: 20 },
  pro: { messagesPerDay: Infinity },
  enterprise: { messagesPerDay: Infinity },
};
```

### Pricing Page

Edit `app/(landing)/pricing/page.tsx`:

```typescript
const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["20 messages/day", "Basic AI models", "Chat history"],
    cta: "Get Started",
    href: "/register",
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    features: ["Unlimited messages", "All AI models", "Priority support"],
    cta: "Subscribe",
    popular: true,
    href: "/api/stripe/checkout?plan=pro",
  },
  // ...
];
```

---

## Rate Limits

Edit `lib/rate-limit.ts`:

```typescript
// Chat messages: 20 requests per minute per user
export const chatLimiter = new RateLimiter({ limit: 20, windowMs: 60_000 });

// Auth endpoints: 5 requests per minute per IP
export const authLimiter = new RateLimiter({ limit: 5, windowMs: 60_000 });

// General API: 60 requests per minute
export const generalLimiter = new RateLimiter({ limit: 60, windowMs: 60_000 });
```

---

## Auth Settings

### Email Verification

Enable/disable in **Supabase Dashboard → Authentication → Email**:
- Toggle **Confirm email** on/off

Related files:
- `app/(auth)/verify-email/page.tsx` — verification page
- `components/auth/verify-email-form.tsx` — resend verification form
- `app/auth/callback/route.ts` — handles confirmation callback

### OAuth Providers

Add OAuth in Supabase Dashboard → Authentication → Providers, then update `components/auth/login-form.tsx` and `register-form.tsx` with OAuth buttons.

---

## UI Theme

### Gradient Glow Effects

Edit `app/globals.css`:

```css
.glow {
  box-shadow: 0 0 20px #7c3aed26, 0 0 40px #06b6d41a;
}
```

### Chat Bubble Styles

Edit `components/chat/chat-area.tsx` — message bubble styles, thinking indicator, typing cursor.

### Sidebar

Edit `components/sidebar/chat-sidebar.tsx` — sidebar width, layout, behavior.

### Animations

Edit `components/landing/animations.tsx` — typewriter speed, chat bubble typing, counter animation.

---

## 🔒 Security & Encryption

### Message Encryption

ChatKit encrypts all user messages at rest using **AES-256-GCM** before storing them in the database.

**How it works:**
1. When a user sends a message, the content is encrypted with AES-256-GCM + a random IV
2. The encrypted ciphertext (base64) is stored in Supabase
3. When the user opens a conversation, messages are decrypted on the server and served normally
4. The encryption key never touches the database

**Key files:**
- `lib/crypto.ts` — encrypt/decrypt helpers
- `lib/sanitize.ts` — XSS input sanitization (runs before encryption)
- `app/api/chat/route.ts` — encrypts on insert
- `lib/actions/conversations.ts` — decrypts on read

**Managing the encryption key:**

```bash
# Generate a new key
openssl rand -base64 32

# Add to .env.local
ENCRYPTION_KEY=your-generated-key

# Add to Vercel (production)
echo "your-key" | vercel env add ENCRYPTION_KEY production
```

⚠️ **Critical rules:**
- **Never change** the key after messages are encrypted — they become unreadable
- **Never commit** the key to git
- **Back it up** in a secure location (password manager, secrets manager)
- If deploying to multiple environments, use **different keys** per environment

**Backward compatibility:** If the key is missing or decryption fails, ChatKit falls back to returning the raw content. This allows a smooth migration from plaintext to encrypted.

### Admin Zero-Knowledge Design

The admin panel is designed to **never access message content**:

- `getAdminStats()` — counts only (users, conversations, messages, tokens)
- `getAdminUsers()` — profile metadata (name, plan, role, dates)
- `getAdminUserDetail()` — conversation titles, model used, token counts
- A security comment in `lib/actions/admin.ts` enforces this: _"Admin queries must NEVER select content from the messages table"_

### Admin Access Control

Three layers of protection ensure only admins can access `/admin/*` routes:

1. **Middleware** (`lib/supabase/middleware.ts`) — checks auth + role, redirects non-admins
2. **Layout** (`app/(admin)/layout.tsx`) — server-side role check with service role client
3. **Server Actions** (`lib/actions/admin.ts`) — `requireAdmin()` called before every admin operation

---

## Quick Reference

| What to change | File |
|---------------|------|
| Brand name | Search "ChatKit" across project |
| Colors/theme | `app/globals.css` → `@theme` |
| AI models | `types/index.ts` → `MODELS` |
| AI provider | `lib/ai.ts` |
| Pricing amounts | `app/(landing)/pricing/page.tsx` |
| Plan limits | `types/index.ts` → `PLAN_LIMITS` |
| Rate limits | `lib/rate-limit.ts` |
| Landing copy | `components/landing/hero-section.tsx` |
| Features list | `app/(landing)/page.tsx` |
| Chat streaming | `app/api/chat/route.ts` |
| Admin dashboard | `app/(admin)/admin/` |
| Encryption key | `ENCRYPTION_KEY` env var |
| Encryption logic | `lib/crypto.ts` |
| Input sanitization | `lib/sanitize.ts` |
| Privacy Policy | `app/(landing)/privacy/page.tsx` |
| Terms of Service | `app/(landing)/terms/page.tsx` |
| Admin role check | `lib/actions/admin.ts`, `lib/supabase/middleware.ts` |
