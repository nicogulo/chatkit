# Deploy Guide — ChatKit

Deploy ChatKit to production on Vercel.

**Estimated time: 5–10 minutes**

## Prerequisites

- A [Vercel](https://vercel.com) account (free tier works)
- Your ChatKit repo pushed to GitHub
- All environment variables ready (from SETUP.md)

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/chatkit.git
git push -u origin main
```

## 2. Deploy to Vercel

### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

Follow the prompts. On first deploy, Vercel will detect Next.js automatically.

### Option B: Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Framework Preset: **Next.js** (auto-detected)
4. Click **Deploy**

## 3. Set Environment Variables

In your Vercel project dashboard, go to **Settings → Environment Variables**:

Add these variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Your anon key | Production, Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | Production, Preview |
| `ZAI_API_KEY` | Your AI API key | Production |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Production |

### Optional (Stripe):

| Variable | Value | Environment |
|----------|-------|-------------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Production |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Production |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Production |
| `STRIPE_PRO_PRICE_ID` | `price_...` | Production |
| `STRIPE_ENTERPRISE_PRICE_ID` | `price_...` | Production |

After adding variables, redeploy:

```bash
vercel --prod
```

## 4. Update Supabase Auth Settings

1. Go to **Supabase Dashboard → Authentication → URL Configuration**
2. Update **Site URL** to your production URL: `https://your-app.vercel.app`
3. Add redirect URL: `https://your-app.vercel.app/auth/callback`

## 5. Set Admin in Production

After you sign up on your production site, set yourself as admin:

```sql
-- Run in Supabase SQL Editor
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

Or update by user ID:

```sql
UPDATE profiles SET role = 'admin' WHERE id = 'your-user-uuid';
```

## 6. Custom Domain (Optional)

1. In Vercel dashboard → **Settings → Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` env var to your custom domain
5. Update Supabase Auth **Site URL** and **Redirect URLs**

## Updating

```bash
# Make changes, then:
git add .
git commit -m "your message"
git push origin main

# Or deploy directly:
vercel --prod
```

## Monitoring

- **Vercel Dashboard** → Deployments, analytics, logs
- **Supabase Dashboard** → Database, auth, storage
- **ChatKit Admin Panel** → `/admin` for user management and usage stats

---

Next: [CUSTOMIZE.md](./CUSTOMIZE.md) — Customize your ChatKit instance
