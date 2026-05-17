# ChatKit ⚡

A production-ready **AI Chat SaaS Starter Kit** built with Next.js 16, Supabase, and the Vercel AI SDK.

Ship your AI product in hours, not months.

## ✨ Features

- 🤖 **Multi-model AI Chat** — Stream responses from multiple AI models (GLM, OpenAI, or any OpenAI-compatible API)
- 💬 **Real-time Streaming** — Token-by-token streaming with typing indicators and thinking animations
- 🔐 **Auth System** — Supabase Auth with email verification, protected routes, and session management
- 🔒 **Message Encryption** — AES-256-GCM encryption at rest, zero-knowledge admin, XSS prevention
- 🛡️ **Security Hardened** — 3-layer admin protection, rate limiting, input sanitization, RLS policies
- 💳 **Billing Ready** — Stripe integration with subscription management (upgrade to Lemon Squeezy easily)
- 📊 **Usage Dashboard** — Track token usage per model with 7-day charts and daily limits
- 🛡️ **Admin Panel** — User management, plan changes, ban/unban, and usage monitoring
- 🚦 **Rate Limiting** — In-memory sliding window rate limiter with configurable limits per route
- 📱 **Responsive Design** — Mobile-first with adaptive sidebar, hamburger nav, and touch-friendly UI
- 🎨 **Premium Dark UI** — Gradient glow effects, glass morphism, smooth Framer Motion animations
- 🔍 **Chat Management** — Search conversations, group by date, rename, delete
- ⚡ **One-click Deploy** — Deploy to Vercel in minutes

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Auth & Database | Supabase |
| AI Streaming | Vercel AI SDK v6 |
| State Management | Zustand |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Payments | Stripe (or Lemon Squeezy) |
| Deployment | Vercel |

## 📸 Preview

Coming soon — live demo at [chatkit-ashy.vercel.app](https://chatkit-ashy.vercel.app)

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/your-username/chatkit.git
cd chatkit

# 2. Install dependencies
npm install

# 3. Copy env template
cp .env.example .env.local

# 4. Fill in your API keys (see SETUP.md for details)

# 5. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start chatting!

## 📁 Project Structure

```
chatkit/
├── app/
│   ├── (admin)/          # Admin panel (protected)
│   │   └── admin/
│   │       ├── page.tsx  # Dashboard
│   │       └── users/    # User management
│   ├── (auth)/           # Auth pages
│   │   ├── login/
│   │   ├── register/
│   │   └── verify-email/
│   ├── (chat)/           # Chat interface (protected)
│   │   └── chat/
│   ├── (landing)/        # Public pages
│   │   ├── page.tsx      # Landing page
│   │   └── pricing/
│   ├── api/              # API routes
│   │   ├── chat/         # AI streaming endpoint
│   │   ├── billing/      # Usage stats, subscriptions
│   │   └── stripe/       # Webhook, checkout, portal
│   ├── settings/         # User settings
│   └── auth/callback/    # OAuth callback
├── components/
│   ├── admin/            # Admin components
│   ├── auth/             # Login, register, verify forms
│   ├── chat/             # Chat area, messages, model selector
│   ├── landing/          # Hero, features, animations
│   ├── sidebar/          # Chat sidebar with search
│   └── ui/               # Shared UI components
├── lib/
│   ├── actions/          # Server actions
│   ├── supabase/         # Supabase client, server, middleware, admin client
│   ├── store/            # Zustand stores
│   ├── ai.ts             # AI model config
│   ├── crypto.ts         # AES-256-GCM message encryption
│   ├── sanitize.ts       # XSS input sanitization
│   ├── rate-limit.ts     # Rate limiter
│   └── utils.ts          # Utilities
└── types/                # TypeScript type definitions
```

## 📖 Documentation

| Guide | Description |
|-------|-------------|
| [SETUP.md](./SETUP.md) | Full step-by-step setup guide |
| [DEPLOY.md](./DEPLOY.md) | Deploy to production on Vercel |
| [CUSTOMIZE.md](./CUSTOMIZE.md) | Customize branding, pricing, AI models |

## 🔒 Security

ChatKit is built with security as a priority:

| Feature | Detail |
|---------|--------|
| **Message Encryption** | AES-256-GCM with random IV per message — even DB access can't read chats |
| **Zero-Knowledge Admin** | Admin panel never fetches message content — only metadata (titles, counts, dates) |
| **Admin Protection** | 3-layer guard: middleware + layout + server actions all verify admin role |
| **Rate Limiting** | Sliding window rate limiter on chat, auth, and API routes |
| **Input Sanitization** | XSS prevention — HTML tags, event handlers, and scripts stripped before storage |
| **Row Level Security** | Supabase RLS policies ensure users only access their own data |
| **Privacy & Terms** | Built-in `/privacy` and `/terms` pages with GDPR basics |

See [CUSTOMIZE.md](./CUSTOMIZE.md) for encryption key management.

## 💰 Monetization

ChatKit comes with built-in monetization:

- **Free tier**: 20 messages/day with basic models
- **Pro tier**: Unlimited messages + premium models
- **Enterprise tier**: Custom limits + priority support

Swap Stripe for Lemon Squeezy, Paddle, or any payment provider.

## 📄 License

This is a commercial template. Purchase includes a license for personal and commercial projects. See [LICENSE](./LICENSE) for details.

---

Built with ❤️ by [nicogulo](https://github.com/nicogulo)
