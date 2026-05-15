# ChatKit — Design System & Wireframes

## 1. Brand Identity

| Property | Value |
|----------|-------|
| **Name** | ChatKit |
| **Tagline** | "Ship your AI product in hours, not months" |
| **Vibe** | Premium, AI-native, developer-friendly |
| **References** | Cursor, v0.dev, Raycast, Linear |

---

## 2. Color Palette

### Primary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--background` | `#09090b` | Page background |
| `--foreground` | `#fafafa` | Primary text |
| `--card` | `#141419` | Card backgrounds, sidebar |
| `--card-foreground` | `#fafafa` | Card text |
| `--border` | `#1f1f28` | Borders, dividers |
| `--input` | `#1f1f28` | Input field background |

### Accent Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#7c3aed` | Primary actions (buttons, links, focus) |
| `--primary-hover` | `#6d28d9` | Hover state |
| `--primary-foreground` | `#ffffff` | Text on primary |
| `--accent` | `#06b6d4` | Secondary accent (badges, highlights) |
| `--accent-blue` | `#2563eb` | Gradient middle point |

### Gradient
```css
--gradient-ai: linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #06b6d4 100%);
```
Usage: text highlights, borders (glow), buttons (CTA), decorative elements

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--destructive` | `#ef4444` | Errors, delete actions |
| `--success` | `#22c55e` | Success states, online indicator |
| `--warning` | `#f59e0b` | Warnings, rate limit |

### Text Hierarchy
| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#fafafa` | Headings, primary text |
| `--text-secondary` | `#a1a1aa` | Descriptions, labels |
| `--text-muted` | `#71717a` | Placeholders, timestamps |
| `--text-inverse` | `#09090b` | Text on primary buttons |

---

## 3. Typography

### Font Family
| Token | Font | Fallback |
|-------|------|----------|
| `--font-sans` | Geist Sans | Inter, system-ui, sans-serif |
| `--font-mono` | Geist Mono | JetBrains Mono, monospace |

### Type Scale
| Level | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `display` | 4.5rem (72px) | 700 | 1.1 | -0.02em | Landing hero h1 |
| `h1` | 2.25rem (36px) | 700 | 1.2 | -0.01em | Page titles |
| `h2` | 1.5rem (24px) | 600 | 1.3 | 0 | Section headings |
| `h3` | 1.25rem (20px) | 600 | 1.4 | 0 | Card titles |
| `h4` | 1rem (16px) | 600 | 1.4 | 0 | Subsections |
| `body` | 0.875rem (14px) | 400 | 1.6 | 0 | Body text, descriptions |
| `caption` | 0.75rem (12px) | 400 | 1.5 | 0 | Timestamps, labels |
| `code` | 0.8125rem (13px) | 400 | 1.6 | 0 | Code blocks (font-mono) |

---

## 4. Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Inline gaps, icon padding |
| `space-2` | 8px | Tight element spacing |
| `space-3` | 12px | Form element gaps |
| `space-4` | 16px | Standard padding |
| `space-5` | 20px | Card internal padding |
| `space-6` | 24px | Section gaps |
| `space-8` | 32px | Between sections |
| `space-10` | 40px | Page padding |
| `space-12` | 48px | Major section dividers |
| `space-16` | 64px | Hero padding |
| `space-24` | 96px | Landing page sections |

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 6px | Small elements (badges, tags) |
| `radius-md` | 8px | Buttons, inputs |
| `radius-lg` | 12px | Cards, modals |
| `radius-xl` | 16px | Panels, large cards |
| `radius-full` | 9999px | Avatars, pills |

---

## 6. Shadows & Effects

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
```

### Glow Effects
```css
/* Primary glow (buttons, cards on hover) */
--glow-primary: 0 0 20px rgba(124, 58, 237, 0.15), 0 0 40px rgba(6, 182, 212, 0.08);

/* Input focus glow */
--glow-focus: 0 0 0 2px rgba(124, 58, 237, 0.3), 0 0 20px rgba(124, 58, 237, 0.1);

/* AI sparkle glow (avatar, badges) */
--glow-ai: 0 0 12px rgba(124, 58, 237, 0.2), 0 0 24px rgba(6, 182, 212, 0.1);
```

### Glassmorphism
```css
--glass-bg: rgba(20, 20, 25, 0.8);
--glass-border: rgba(255, 255, 255, 0.06);
--glass-blur: blur(12px);
```
Usage: Navbar, overlays, floating elements

### Gradient Border
```css
/* Used for input fields, featured cards */
border: 1px solid transparent;
background-image: linear-gradient(var(--card), var(--card)),
                  linear-gradient(135deg, #7c3aed, #2563eb, #06b6d4);
background-origin: border-box;
background-clip: padding-box, border-box;
opacity: 0.4; /* default */
opacity: 1.0; /* on focus */
```

---

## 7. Component Specs

### 7.1 Sidebar

```
┌────────────────────────┐
│ width: 280px            │
│ bg: --card (#141419)    │
│ border-right: 1px solid │
│         --border        │
├────────────────────────┤
│ HEADER (h-16)           │
│ ┌────────────────────┐  │
│ │ ✦ ChatKit   [+ ]  │  │  logo: gradient-text, 18px bold
│ │              36px  │  │  [+]: icon button, primary bg/10
│ └────────────────────┘  │
├────────────────────────┤
│ SEARCH (px-3, py-2)     │
│ ┌────────────────────┐  │
│ │ 🔍 Search...       │  │  bg: --background, text: --text-muted
│ └────────────────────┘  │  radius-md, h-9
├────────────────────────┤
│ CONVERSATIONS           │
│ (scroll, flex-1)        │
│                         │
│ Today                   │  caption, --text-muted, px-3 py-1.5
│ ├─ 💬 Build REST API   │  h-9, radius-md, text: body
│ ├─ 💬 React hooks      │  hover: bg --background
│ └─ 💬 TypeScript tips  │  active: bg-primary/10, text-primary
│                         │
│ Yesterday               │
│ ├─ 💬 CSS Grid         │
│ └─ 💬 Auth flow        │
│                         │
│ Last 7 Days             │
│ ├─ 💬 Next.js App...   │  truncate text if > 28 chars
│ └─ 💬 Tailwind tips    │
├────────────────────────┤
│ FOOTER                  │
│ ┌────────────────────┐  │
│ │ 👤 Nico     [Pro]  │  │  avatar: 32px, gradient ring
│ │ nico@email   ▾     │  │  plan badge: primary/10, caption
│ └────────────────────┘  │  hover: bg --background
│ ┌────────────────────┐  │
│ │ ⚙ Settings         │  │  text: --text-secondary
│ └────────────────────┘  │
└────────────────────────┘
```

### 7.2 Chat Bubble — AI

```
┌─────────────────────────────────────────────┐
│ gap: space-3 (12px)                         │
│                                              │
│  ┌──────┐                                    │
│  │ ✨   │  ← avatar: 32x32, bg-primary/10   │
│  │      │    rounded-lg, glow-ai            │
│  └──────┘                                    │
│        ┌──────────────────────────┐          │
│        │ AI message content       │          │
│        │                          │          │  bg: --card
│        │ Max width: 75%           │          │  border: 1px --border
│        │                          │          │  radius-xl
│        │ Supports:                │          │  px-4, py-3
│        │ • Markdown               │          │
│        │ • Code blocks            │          │
│        │ • Lists                  │          │
│        │ • Bold/italic            │          │
│        └──────────────────────────┘          │
│                                              │
└─────────────────────────────────────────────┘
```

### 7.3 Chat Bubble — User

```
                              ┌──────────────┐
                              │ 👤 Nico      │  ← avatar: 32x32
                              └──────────────┘
        ┌──────────────────────────┐
        │ User message content     │  bg: --primary
        │                          │  text: --primary-foreground
        │ Max width: 75%           │  radius-xl
        │                          │  px-4, py-3
        └──────────────────────────┘
```

### 7.4 Code Block (inside AI bubble)

```
┌─────────────────────────────────────────┐
│ Header bar: bg #0d0d12                   │
│ ┌───────────────────────────┬──────────┐ │
│ │ typescript                │ 📋 Copy  │ │  lang: caption, --text-muted
│ └───────────────────────────┴──────────┘ │  Copy: icon button, hover primary
│                                          │
│ const hello = "world";                   │  font-mono, code (13px)
│ function greet(name: string) {           │  line-numbers optional
│   return `Hello ${name}`;                │  syntax highlight:
│ }                                        │    keyword: #c084fc (purple)
│                                          │    string: #34d399 (green)
│                                          │    function: #60a5fa (blue)
│                                          │    type: #f59e0b (amber)
└─────────────────────────────────────────┘
border: gradient-border, opacity 0.3
radius: radius-lg
```

### 7.5 Input Field

```
┌─────────────────────────────────────────────────────┐
│ Container: gradient-border wrapper                    │
│ ┌─────────────────────────────────────────────────┐ │
│ │                                                   │ │  bg: --card
│ │  ✨ Message ChatKit...              📎  🎤  ⬆️  │ │  radius-xl
│ │                                                   │ │  px-4, py-3
│ └─────────────────────────────────────────────────┘ │  glow-focus on focus
└─────────────────────────────────────────────────────┘

States:
- Default: gradient border opacity 0.3
- Focus: gradient border opacity 1.0, glow-focus
- Disabled: opacity 0.5

Max width: 768px, centered
```

### 7.6 Model Selector Dropdown

```
┌──────────────────────────┐
│ 🌟 GPT-4o           ▾  │  trigger: button, bg-secondary
├──────────────────────────┤
│ ┌──────────────────────┐ │  dropdown: bg-card, border, shadow-lg
│ │ 🔵 GPT-4o           │ │  radius-lg
│ │ 🟢 GPT-4o mini      │ │  each item: h-9, px-3, hover bg-background
│ │ 🟠 Claude Sonnet    │ │  selected: text-primary, check icon
│ │ 🔵 Gemini Flash     │ │
│ └──────────────────────┘ │
└──────────────────────────┘
```

---

## 8. Page Wireframes

### 8.1 Landing Page (`/`)

```
┌─────────────────────────────────────────────────────────┐
│ NAVBAR (h-16, glass, sticky)                             │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ✦ ChatKit    Features  Pricing    Login  [Get Started] │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ HERO (py-24, centered)                                   │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                                                       │ │
│ │        ✨ Ship your AI product in hours              │ │  pill: border, caption, glow-sm
│ │                                                       │ │
│ │   Build your AI Chat product                         │ │  display (72px)
│ │         with Next.js                                  │ │  "AI Chat" = gradient-text
│ │                                                       │ │
│ │  Production-ready starter kit with multi-model AI,   │ │  body (18px), --text-secondary
│ │  Stripe billing, Supabase auth, and dark UI.          │ │  max-width: 640px
│ │                                                       │ │
│ │     [Get Started Free →]  [Live Demo]                 │ │  primary = glow, secondary = gradient-border
│ │                                                       │ │
│ │         ▼ Screenshot/Preview Image                    │ │  optional: product screenshot
│ │                                                       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ FEATURES (py-24, grid 3 cols)                            │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│ │ 🤖 Multi    │ │ ⚡ Stream-  │ │ 🔐 Auth     │        │  each card:
│ │ Model AI    │ │ ing Chat    │ │ (Supabase)  │        │  gradient-border
│ │             │ │             │ │             │        │  bg-card, p-6
│ │ Switch      │ │ Real-time   │ │ Email,      │        │  radius-xl
│ │ between     │ │ token       │ │ Google,     │        │
│ │ GPT-4o,     │ │ streaming   │ │ GitHub      │        │
│ │ Claude,     │ │ with MD     │ │ OAuth       │        │
│ │ Gemini      │ │ rendering   │ │             │        │
│ └─────────────┘ └─────────────┘ └─────────────┘        │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│ │ 💳 Stripe   │ │ 💬 Chat     │ │ 🎨 Premium  │        │
│ │ Billing     │ │ History     │ │ Dark UI     │        │
│ └─────────────┘ └─────────────┘ └─────────────┘        │
│                                                          │
│ TECH STACK (py-16)                                       │
│   [Next.js] [React] [TS] [Tailwind] [Supabase]          │  pills: gradient-border
│   [AI SDK] [Stripe] [Zustand] [Framer Motion]           │  bg-card
│                                                          │
│ FOOTER                                                   │
│ © 2026 ChatKit. Built with ♥                             │  border-t, --text-muted
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 8.2 Chat Page (`/chat/[id]`)

```
┌──────────┬──────────────────────────────────────────────┐
│          │ HEADER (h-14, border-b)                       │
│ SIDEBAR  │ ┌──────────────────────────────────────────┐ │
│ (280px)  │ │ New Conversation        🌟 GPT-4o ▾     │ │  title: h4
│          │ └──────────────────────────────────────────┘ │
│ (see     │                                              │
│  7.1)    │ MESSAGES (flex-1, scroll, centered max-3xl)  │
│          │ ┌──────────────────────────────────────────┐ │
│          │ │                                          │ │
│          │ │  ✨ ┌──────────────────────────┐         │ │
│          │ │     │ Hello! How can I help?   │         │ │  AI bubble
│          │ │     └──────────────────────────┘         │ │
│          │ │                                          │ │
│          │ │         ┌──────────────────┐ 👤          │ │
│          │ │         │ Build todo app   │             │ │  User bubble
│          │ │         └──────────────────┘             │ │
│          │ │                                          │ │
│          │ │  ✨ ┌──────────────────────────┐         │ │
│          │ │     │ Sure! Here's the code:   │         │ │  AI bubble
│          │ │     │ ┌──────────────────────┐ │         │ │
│          │ │     │ │ typescript    📋 Copy│ │         │ │  Code block
│          │ │     │ │ const x = 1          │ │         │ │
│          │ │     │ └──────────────────────┘ │         │ │
│          │ │     └──────────────────────────┘         │ │
│          │ │                                          │ │
│          │ └──────────────────────────────────────────┘ │
│          │                                              │
│          │ INPUT (border-t, py-4)                       │
│          │ ┌──────────────────────────────────────────┐ │
│          │ │ ┌──────────────────────────────────────┐ │ │
│          │ │ │ ✨ Message ChatKit...     📎 🎤  ⬆️  │ │ │  gradient-border
│          │ │ └──────────────────────────────────────┘ │ │  max-w-3xl centered
│          │ │     ChatKit can make mistakes.            │ │  caption, centered
│          │ └──────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────┘
```

### 8.3 Login Page (`/login`)

```
┌─────────────────────────────────────────────────────────┐
│                     bg: --background                     │
│                                                          │
│              centered (flex, min-h-screen)               │
│              ┌──────────────────────┐                    │
│              │      ✦ ChatKit       │  h1, gradient-text │
│              │  Sign in to account  │  body, --text-muted│
│              │                      │                    │
│              │ [Continue with Google]│  gradient-border  │
│              │ [Continue w/ GitHub] │  full width        │
│              │                      │                    │
│              │ ─────── or ──────── │  divider            │
│              │                      │                    │
│              │ Email                │  label: h4          │
│              │ [________________]   │  input: bg-card     │
│              │ Password             │                    │
│              │ [________________]   │                    │
│              │                      │                    │
│              │ [    Sign In     ]   │  bg-primary, glow   │
│              │                      │                    │
│              │ Don't have account?  │  --text-muted       │
│              │ Sign up →            │  text-primary       │
│              └──────────────────────┘  max-w-sm (384px)  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 8.4 Register Page (`/register`)
Same layout as Login, different copy.

### 8.5 Pricing Page (`/pricing`)

```
┌─────────────────────────────────────────────────────────┐
│              Simple, transparent pricing                 │  h1
│              "pricing" = gradient-text                   │
│              Start free. Upgrade when you need more.     │  --text-secondary
│                                                          │
│     ┌───────────┐ ┌───────────┐ ┌───────────┐          │
│     │   Free     │ │    Pro    │ │Enterprise │          │  grid 3 cols
│     │            │ │ ⭐ Popular│ │           │          │  Pro: gradient-border + glow
│     │   $0/mo    │ │  $19/mo   │ │  $49/mo   │          │  Others: border
│     │            │ │           │ │           │          │
│     │ ✓ 10 msg/d│ │ ✓ Unlimit │ │ ✓ All Pro │          │  check: text-primary
│     │ ✓ GPT-4o  │ │ ✓ Models  │ │ ✓ Teams   │          │
│     │ ✓ History │ │ ✓ Support │ │ ✓ API     │          │
│     │           │ │ ✓ Prompts │ │ ✓ SLA     │          │
│     │           │ │           │ │           │          │
│     │[Get Start]│ │[Subscribe]│ │[Subscribe]│          │  primary / primary / primary
│     └───────────┘ └───────────┘ └───────────┘          │
└─────────────────────────────────────────────────────────┘
```

### 8.6 Settings Page (`/settings`)

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Chat                     Settings            │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Profile                                             │ │  bg-card, radius-xl, p-6
│  │ ┌──────────┐                                       │ │
│  │ │  Avatar   │ Nico Gulo                            │ │  avatar: 64px, gradient ring
│  │ │  (upload) │ nico@email.com                       │ │
│  │ └──────────┘ [Edit Profile]                        │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ API Keys                                            │ │
│  │ OpenAI    [sk-••••••••••••]  [Change]              │ │  input: bg-background
│  │ Anthropic [sk-ant-••••••••]  [Change]              │ │
│  │ Google    [AIza•••••••••••]  [Change]              │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Plan: Free                              [Upgrade]   │ │
│  │ Usage: 7/10 messages today   ████████░░  70%        │ │  progress bar: bg-primary
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  [Delete Account]                                        │  text-destructive
└─────────────────────────────────────────────────────────┘
```

---

## 9. Animation Specs

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Page transition | fade in + slight up | 200ms | ease-out |
| Chat message appear | fade in + slide up | 300ms | spring(1, 0.8) |
| Sidebar hover | bg color transition | 150ms | ease |
| Button hover | scale 1.02 + glow | 150ms | ease |
| Streaming text | cursor blink | 800ms | infinite |
| Loading shimmer | gradient slide | 1.5s | linear infinite |
| Modal/Dialog | scale 0.95→1 + fade | 200ms | ease-out |

---

## 10. Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| **Desktop** | ≥1024px | Sidebar visible, full layout |
| **Tablet** | 768-1023px | Sidebar collapsible (sheet) |
| **Mobile** | <768px | Sidebar hidden (hamburger), stacked layout |

### Mobile Chat Layout (<768px)
```
┌───────────────────┐
│ ☰  ChatKit   👤   │  hamburger menu
├───────────────────┤
│                   │
│  Chat messages    │  full width
│                   │
├───────────────────┤
│ [Message...  ] ⬆ │  input pinned bottom
└───────────────────┘
```

---

## 11. States

### Button States
| State | Style |
|-------|-------|
| Default | bg-primary, no glow |
| Hover | bg-primary-hover, glow-sm |
| Focus | ring-2 ring-primary/30 |
| Active | scale-0.98 |
| Disabled | opacity-0.5, no pointer |

### Input States
| State | Style |
|-------|-------|
| Default | bg-card, border-border |
| Focus | gradient-border opacity 1, glow-focus |
| Error | border-destructive |
| Disabled | opacity-0.5 |

### Conversation Item States
| State | Style |
|-------|-------|
| Default | transparent bg |
| Hover | bg-background |
| Active/Selected | bg-primary/10, text-primary, border-l-2 primary |
