# ChatKit Technical Specification

**Version:** 1.0
**Author:** Template Studio
**Date:** 2026-05-15

---

## 1. Requirements Overview

### 1.1 Background/Goals

Developers and entrepreneurs want to launch AI chat products but spend weeks on boilerplate (auth, billing, database, streaming). ChatKit eliminates this by providing a production-ready Next.js starter kit.

**Project Goals:**
- Provide a complete, working AI chat product that buyers can deploy in under 1 hour
- Include all SaaS infrastructure: auth, billing, database, email
- Support multiple AI providers via Vercel AI SDK
- Beautiful dark UI with AI gradient theme that stands out from competitors

**Validation Question:** Does this solve a real business problem? YES — competitor analysis shows ShipFast ($199), MakerKit ($249-399), Supastarter ($249+) all selling well. Market is proven.

### 1.2 Business Value

| Metric | Target |
|--------|--------|
| Price | $149 (Basic) / $249 (Full) / $399 (Premium) |
| Sales target (month 1) | 10-20 sales |
| Revenue target (month 1) | $1,490 - $4,980 |
| Customer | Developers & entrepreneurs building AI products |
| Platform | Gumroad |

---

## 2. Requirements Analysis

### 2.1 Feature Breakdown

| Product Requirement | Pages/Modules | Changes |
|---------------------|---------------|---------|
| Project scaffold | Root, config files | package.json, tsconfig, tailwind, next.config, globals.css, folder structure |
| Database schema | Supabase migrations | 5 tables: profiles, conversations, messages, usage, subscriptions |
| Supabase clients | utils/supabase/, middleware.ts | server.ts, client.ts, middleware.ts |
| Login | app/(auth)/login | Page + form + OAuth buttons |
| Register | app/(auth)/register | Page + form + OAuth buttons + profile creation |
| Chat sidebar | components/sidebar/ | ChatSidebar component with conversation list |
| Chat messages | components/chat/ | ChatArea, MessageBubble, CodeBlock |
| Chat input | components/chat/ | MessageInput, ModelSelector |
| Conversation mgmt | lib/conversations.ts, sidebar | Create, rename, delete operations |
| Landing page | app/(landing)/ | Hero, features, tech stack, footer |
| Pricing page | app/(landing)/pricing | 3-tier pricing grid |
| Settings | app/settings/ | Profile, API keys, plan/usage |
| Stripe billing | lib/stripe.ts, api/stripe/ | Checkout, webhooks, portal |
| AI SDK multi-model | lib/ai.ts, api/chat/ | streamText with model switching |
| Documentation | README, setup guides | README, .env.example, SUPABASE_SETUP, STRIPE_SETUP |
| Marketing assets | public/ | Thumbnail, cover, OG, screenshots |
| Gumroad packaging | Build scripts | ZIP, product listing |

### 2.2 Use Case Analysis

**Flow 1: New User Registration → First Chat**
```
Visitor lands on /
  → Clicks "Get Started"
  → Redirected to /register
  → Signs up with Google OAuth
  → Profile auto-created in Supabase
  → Redirected to /chat/new
  → Types first message
  → AI streams response
  → Conversation saved to DB
  → Sidebar updates with "Today" group
```

**Flow 2: Returning User → Continue Chat**
```
User opens app
  → Middleware refreshes session
  → Redirected to /chat
  → Sidebar loads conversations from DB (grouped by date)
  → Clicks existing conversation
  → Messages load from DB
  → Continues chatting
```

**Flow 3: User Upgrades to Pro**
```
User in /settings sees "Free Plan" with usage bar
  → Clicks "Upgrade to Pro"
  → Stripe checkout session created
  → User completes payment
  → Webhook: checkout.session.completed
  → Subscription row updated in DB (plan: pro)
  → User redirected to billing portal
  → Usage limit removed
```

**Flow 4: Buyer Downloads ChatKit**
```
Buyer visits Gumroad listing
  → Reads description, sees screenshots
  → Purchases ($149-$399)
  → Downloads ZIP
  → Unzips → reads README
  → npm install → fills .env.local
  → Runs Supabase migrations
  → npm run dev
  → Working AI chat product!
```

### 2.3 Page Operation Details

| Operation | Constraints | Object | Description |
|-----------|-------------|--------|-------------|
| Sign in | Valid email + password OR valid OAuth | User session | Create session, redirect to /chat |
| Sign up | Unique email, password ≥ 8 chars | User account + profile | Create auth user, insert profile row |
| Send message | Authenticated, within usage limit, model selected | Message row + AI response | Insert user message, stream AI, insert AI message, update usage |
| Create conversation | Authenticated | Conversation row | Insert with auto-title from first message |
| Delete conversation | Owner only (RLS) | Conversation + messages | Cascade delete all related messages |
| Switch model | Authenticated, model available on user's plan | Conversation model field | Update conversation model, use for subsequent messages |
| Upgrade plan | Authenticated | Stripe checkout | Create checkout session, redirect to Stripe |
| Webhook process | Valid Stripe signature | Subscription row | Verify signature, update subscription status |

---

## 3. Technical Design

### 3.1 Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Next.js 15                        │
│                   (App Router)                       │
├──────────┬──────────┬──────────┬────────────────────┤
│  Public  │   Auth   │   Chat   │     Settings       │
│  /       │ /login   │ /chat/*  │  /settings/*       │
│  /pricing│ /register│          │                    │
├──────────┴──────────┴──────────┴────────────────────┤
│                   Server Layer                       │
│  ┌─────────┐ ┌──────────┐ ┌─────────────────────┐  │
│  │ Server  │ │  Route   │ │   Server Actions    │  │
│  │Components│ │ Handlers │ │ (mutations)         │  │
│  └─────────┘ └──────────┘ └─────────────────────┘  │
├─────────────────────────────────────────────────────┤
│                   External Services                  │
│  ┌──────────┐ ┌──────────┐ ┌──────┐ ┌──────────┐  │
│  │ Supabase │ │  Stripe  │ │  AI  │ │  Resend  │  │
│  │ Auth+DB  │ │ Billing  │ │ APIs │ │  Email   │  │
│  └──────────┘ └──────────┘ └──────┘ └──────────┘  │
└─────────────────────────────────────────────────────┘
```

### 3.2 Component Design

#### ChatSidebar
**Used by:** `app/(chat)/layout.tsx`
**Purpose:** Navigation, conversation list, user info

| Prop/State | Type | Description |
|------------|------|-------------|
| conversations | Conversation[] | From Supabase query |
| activeId | string \| null | Currently selected conversation |
| searchQuery | string | Filter conversations |
| isMobileOpen | boolean | Sheet open state (mobile) |

**Implementation Notes:**
- Fetch conversations on mount via server component or Zustand store
- Group by date: today, yesterday, last 7 days, older
- Mobile: render as Sheet (shadcn/ui) triggered by hamburger
- Real-time update: re-fetch after create/delete

#### ChatArea
**Used by:** `app/(chat)/chat/[id]/page.tsx`
**Purpose:** Display messages, handle streaming input

| Prop/State | Type | Description |
|------------|------|-------------|
| conversationId | string | From URL params |
| messages | Message[] | From DB + streaming |
| isLoading | boolean | AI generating state |

**Implementation Notes:**
- Use Vercel AI SDK `useChat()` hook for streaming
- Auto-scroll to bottom on new message
- Empty state when conversationId === "new"

#### MessageBubble
**Used by:** ChatArea
**Purpose:** Render single message (user or AI)

| Prop | Type | Description |
|------|------|-------------|
| role | "user" \| "assistant" | Determines styling |
| content | string | Markdown content |
| isStreaming | boolean | Show cursor animation |

**Implementation Notes:**
- AI: glass card, sparkle avatar, markdown rendering
- User: primary bg, right-aligned
- Code blocks: extract with react-markdown + custom CodeBlock component

#### MessageInput
**Used by:** ChatArea
**Purpose:** Text input with gradient border

| Prop/State | Type | Description |
|------------|------|-------------|
| onSubmit | (text: string) => void | Send message callback |
| disabled | boolean | While streaming |
| model | ModelId | Selected AI model |

**Implementation Notes:**
- Gradient border wrapper (CSS pseudo-element)
- Glow effect on focus
- Submit on Enter, not Shift+Enter

### 3.3 Data Flow — Chat Message

```
User types message → Enter
  ↓
useChat() sends POST to /api/chat
  ↓ Body: { messages: [...], model: "gpt-4o" }
API route handler:
  1. Verify auth (get user from Supabase session)
  2. Check usage limit (query usage table)
  3. Select model via lib/ai.ts
  4. Call streamText() from Vercel AI SDK
  5. On finish: insert user message + AI message to DB
  6. Increment usage counter
  7. Return streaming response
  ↓
Client: tokens stream in real-time
  ↓
Message appears in chat area
```

**Pseudocode — /api/chat route:**
```
POST /api/chat:
  session = getSupabaseSession(request)
  if not session: return 401
  
  user = session.user
  plan = getPlan(user.id)
  usageToday = countMessagesToday(user.id)
  
  if plan == "free" AND usageToday >= 10:
    return 429 "Daily limit reached"
  
  body = parse(request)
  model = body.model ?? "gpt-4o-mini"
  messages = body.messages
  
  result = streamText({
    model: getModel(model),
    messages: messages,
    onFinish: async (response) => {
      // Save to DB (non-blocking)
      saveMessage(user.id, conversation_id, messages, response)
      incrementUsage(user.id, model, response.usage)
    }
  })
  
  return result.toDataStreamResponse()
```

### 3.4 Data Flow — Stripe Webhook

```
Stripe sends POST /api/stripe/webhook
  ↓
Verify signature with STRIPE_WEBHOOK_SECRET
  ↓
Parse event type:
  checkout.session.completed → create subscription row
  customer.subscription.updated → update plan, status
  customer.subscription.deleted → set status to "canceled"
  ↓
Update Supabase subscriptions table
  ↓
Return 200 OK
```

---

## 4. State Management

### 4.1 Server State (Supabase)
- Auth session → handled by Supabase + middleware
- Conversations → fetched per request (server components)
- Messages → fetched per conversation
- Profile → fetched once, cached
- Subscription → fetched for billing checks

### 4.2 Client State (Zustand)

```typescript
// stores/chat-store.ts
interface ChatStore {
  // Sidebar
  conversations: Conversation[]
  activeConversationId: string | null
  searchQuery: string
  
  // Chat
  selectedModel: ModelId
  
  // Actions
  setConversations: (conversations: Conversation[]) => void
  setActiveConversation: (id: string | null) => void
  setSearchQuery: (query: string) => void
  setSelectedModel: (model: ModelId) => void
}
```

### 4.3 AI Streaming State
- Managed by Vercel AI SDK `useChat()` hook
- Messages, input, loading, error states handled internally

---

## 5. Interface Design

### 5.1 API Routes

| Endpoint | Method | Purpose | Request | Response |
|----------|--------|---------|---------|----------|
| `/api/chat` | POST | AI chat streaming | `{ messages, model }` | Streaming (text/event-stream) |
| `/api/stripe/checkout` | POST | Create checkout session | `{ priceId }` | `{ url: string }` |
| `/api/stripe/webhook` | POST | Stripe events | Stripe event body | 200 OK |
| `/api/stripe/portal` | POST | Customer portal URL | `{ customerId }` | `{ url: string }` |

### 5.2 Server Actions

| Action | File | Purpose |
|--------|------|---------|
| `createConversation` | `lib/actions/conversations.ts` | Insert conversation row |
| `renameConversation` | `lib/actions/conversations.ts` | Update title |
| `deleteConversation` | `lib/actions/conversations.ts` | Delete conversation + messages |
| `updateProfile` | `lib/actions/profile.ts` | Update display name, avatar |
| `saveApiKey` | `lib/actions/profile.ts` | Save encrypted API key |
| `checkUsage` | `lib/actions/usage.ts` | Get today's message count |

### 5.3 Database Queries

| Query | Table | Purpose |
|-------|-------|---------|
| `getConversations(userId)` | conversations | List user's chats, ordered by updated_at |
| `getMessages(conversationId)` | messages | Get all messages for a chat |
| `saveMessage(...)` | messages | Insert user + AI message |
| `incrementUsage(userId, model, tokens)` | usage | Track token usage |
| `getUsageToday(userId)` | usage | Count messages today for limit check |
| `getSubscription(userId)` | subscriptions | Get active subscription |
| `upsertSubscription(...)` | subscriptions | Create/update from Stripe webhook |

---

## 6. Technical Research

### 6.1 AI SDK Comparison

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| **Vercel AI SDK** ✅ | Unified API for multiple AI providers | One API for OpenAI/Anthropic/Google, built-in streaming, React hooks, edge-compatible | Vendor lock-in to Vercel patterns |
| LangChain | Chain-based AI orchestration | Flexible, agents, RAG, tools | Overkill for chat, heavier bundle, more complex |
| Direct API calls | Fetch to each provider's API | No dependencies | Different APIs per provider, no streaming abstraction |

**Decision:** Vercel AI SDK — best DX, built for Next.js, handles multi-model with one interface.

### 6.2 Auth Provider Comparison

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| **Supabase Auth** ✅ | Built-in auth with Supabase | Already using Supabase for DB, RLS integration, OAuth support | Vendor lock-in |
| NextAuth/Auth.js | Popular Next.js auth library | Flexible, many providers | Separate from DB, need custom session management |
| Clerk | Managed auth service | Beautiful UI, drop-in components | Paid at scale, another vendor |

**Decision:** Supabase Auth — keeps everything in one platform, RLS works seamlessly with auth.

### 6.3 Billing Provider Comparison

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| **Stripe** ✅ | Industry standard payment | Mature, well-documented, webhooks, customer portal | Complex API, 2.9% + 30¢ per transaction |
| Lemon Squeezy | Simpler payment platform | Easier setup, handles taxes | Less flexible, fewer features |

**Decision:** Stripe — buyers expect it, most flexible, customer portal included.

---

## 7. Folder Structure

```
chatkit/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (chat)/
│   │   ├── layout.tsx          # ChatLayout with sidebar
│   │   └── chat/
│   │       ├── page.tsx         # Redirect to /chat/new
│   │       └── [id]/page.tsx    # Conversation view
│   ├── (landing)/
│   │   ├── page.tsx             # Landing page
│   │   └── pricing/page.tsx     # Pricing page
│   ├── settings/
│   │   ├── page.tsx             # Profile + API keys
│   │   └── billing/page.tsx     # Subscription management
│   ├── api/
│   │   ├── chat/route.ts        # AI streaming endpoint
│   │   └── stripe/
│   │       ├── checkout/route.ts
│   │       ├── webhook/route.ts
│   │       └── portal/route.ts
│   ├── layout.tsx               # Root layout (font, theme)
│   ├── globals.css              # Design tokens + utilities
│   └── middleware.ts            # Auth session refresh
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── chat/
│   │   ├── chat-area.tsx
│   │   ├── message-bubble.tsx
│   │   ├── code-block.tsx
│   │   ├── message-input.tsx
│   │   └── model-selector.tsx
│   ├── sidebar/
│   │   ├── chat-sidebar.tsx
│   │   └── conversation-list.tsx
│   ├── landing/
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── pricing-card.tsx
│   │   ├── tech-stack.tsx
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   └── auth/
│       ├── login-form.tsx
│       └── register-form.tsx
├── lib/
│   ├── supabase/
│   │   ├── server.ts
│   │   ├── client.ts
│   │   └── middleware.ts
│   ├── ai.ts                    # Model registry
│   ├── stripe.ts                # Stripe client
│   ├── utils.ts                 # cn() helper
│   └── actions/
│       ├── conversations.ts
│       ├── profile.ts
│       └── usage.ts
├── stores/
│   └── chat-store.ts            # Zustand store
├── types/
│   └── index.ts                 # TypeScript interfaces
├── supabase/
│   └── migrations/
│       └── 001_initial.sql
├── public/
│   ├── cover.png
│   ├── thumbnail.png
│   └── og-image.png
├── agents/
│   └── prd.json
├── DESIGN-SYSTEM.md
├── TECH-SPEC.md
├── .env.example
├── .env.local (gitignored)
├── README.md
└── package.json
```

---

## 8. Development Effort Estimate

| Phase | Task | Stories | Hours |
|-------|------|---------|-------|
| 1 | Project scaffold & config | US-001 | 3h |
| 1 | Database schema & migrations | US-002 | 2h |
| 1 | Supabase clients & middleware | US-003 | 2h |
| 2 | Login page + OAuth | US-004 | 3h |
| 2 | Register page + profile creation | US-005 | 2h |
| 3 | Chat sidebar + conversation list | US-006 | 4h |
| 3 | Chat message area + streaming | US-007 | 6h |
| 3 | Input field + model selector | US-008 | 3h |
| 3 | Conversation management | US-009 | 3h |
| 4 | Landing page | US-010 | 4h |
| 4 | Settings page | US-011 | 3h |
| 5 | Stripe billing | US-012 | 5h |
| 5 | AI SDK multi-model | US-013 | 4h |
| 6 | Documentation | US-014 | 3h |
| 6 | Marketing assets | US-015 | 3h |
| 6 | Gumroad packaging | US-016 | 2h |
| | **Total** | **16 stories** | **~52h** |

---

## 9. Risk & Edge Cases

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI API key invalid/missing | Chat won't work | Graceful error message, mock mode fallback |
| Stripe webhook fails | Subscription status stale | Retry logic, manual sync via portal |
| Rate limit hit on AI API | 429 errors | Queue system, exponential backoff |
| Supabase free tier limits | DB/Auth pauses | Document upgrade path, suggest Pro tier |
| Token usage exceeds expected | Cost overruns | Hard limits per plan, warning at 80% |
| OAuth provider down | Can't sign in | Email/password as fallback |
| Mobile layout breaks | Bad UX on phones | Test all breakpoints, responsive-first |

---

## 10. Pending Questions

| # | Question | Status |
|---|----------|--------|
| 1 | Should ChatKit support custom/self-hosted AI models (Ollama, etc)? | Future consideration |
| 2 | Should conversations support file attachments? | V2 feature |
| 3 | Should there be an admin dashboard for the seller? | V2 feature |
| 4 | Team/multi-tenant support included in v1? | No — Enterprise tier only |
| 5 | Support email/passwordless (magic link)? | Nice-to-have, add if time permits |

---

## Appendix

### A. Type Definitions

```typescript
// types/index.ts
type Plan = "free" | "pro" | "enterprise";
type MessageRole = "user" | "assistant" | "system";
type ModelId = "gpt-4o" | "gpt-4o-mini" | "claude-sonnet-4-20250514" | "gemini-2.0-flash";
type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing";

interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  plan: Plan;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

interface Conversation {
  id: string;
  user_id: string;
  title: string;
  model: ModelId;
  system_prompt: string | null;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  tokens_input: number | null;
  tokens_output: number | null;
  model: string | null;
  created_at: string;
}

interface Usage {
  id: string;
  user_id: string;
  model: string;
  tokens_input: number;
  tokens_output: number;
  created_at: string;
}

interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  plan: Plan;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}
```

### B. Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Models
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_AI_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Email
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
