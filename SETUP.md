# Setup Guide — ChatKit

Complete step-by-step guide to get ChatKit running locally.

**Estimated time: 15–20 minutes**

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- A [Supabase](https://supabase.com) account (free)
- An AI API key (see [AI Providers](#3-ai-provider-setup))

---

## 1. Clone & Install

```bash
git clone https://github.com/your-username/chatkit.git
cd chatkit
npm install
```

## 2. Supabase Setup

### 2.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Fill in:
   - **Name**: `chatkit` (or whatever you like)
   - **Database Password**: Save this somewhere safe
   - **Region**: Choose the closest to your users
4. Click **Create new project** and wait ~1 minute

### 2.2 Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the entire contents of `supabase-schema.sql` from this repo and paste it in
4. Click **Run** (or press `Ctrl+Enter`)

This creates all tables: `profiles`, `conversations`, `messages`, `usage`, `subscriptions` — plus indexes, RLS policies, and the auto-profile-creation trigger.

### 2.3 Get Your API Keys

1. In Supabase dashboard, go to **Settings → API**
2. Copy these values:
   - **Project URL** → this is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → this is your `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - **service_role** key → this is your `SUPABASE_SERVICE_ROLE_KEY` (⚠️ keep this secret!)

### 2.4 Configure Auth

1. In Supabase dashboard, go to **Authentication → URL Configuration**
2. Set **Site URL** to `http://localhost:3000` (development)
3. Under **Redirect URLs**, add: `http://localhost:3000/auth/callback`
4. Under **Email Auth**, toggle **Confirm email** ON if you want email verification (recommended)

## 3. AI Provider Setup

ChatKit uses the Vercel AI SDK with an OpenAI-compatible provider. You need an API key from one of these:

### Option A: ZAI API (GLM Models) — Default
- Sign up at [open.bigmodel.cn](https://open.bigmodel.cn)
- Get your API key
- This is the default provider in ChatKit

### Option B: OpenAI
- Sign up at [platform.openai.com](https://platform.openai.com)
- Get your API key
- You'll need to update the AI config in `lib/ai.ts` to use OpenAI models

### Option C: Groq
- Sign up at [console.groq.com](https://console.groq.com)
- Get your API key
- Fast inference, OpenAI-compatible API

### Option D: Any OpenAI-Compatible Provider
ChatKit works with any provider that uses the OpenAI chat completion format. Just update the base URL and model IDs in `lib/ai.ts`.

## 4. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Supabase (from step 2.3)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# AI Provider (from step 3)
ZAI_API_KEY=your-api-key-here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the landing page.

## 6. Create Your Admin Account

1. Go to [http://localhost:3000/register](http://localhost:3000/register)
2. Sign up with your email
3. Verify your email if verification is enabled
4. Go to **Supabase Dashboard → Table Editor → profiles**
5. Find your row and change `role` from `user` to `admin`

Or run in SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID';
```

Now you can access:
- **Chat**: http://localhost:3000/chat
- **Admin Panel**: http://localhost:3000/admin
- **Settings**: http://localhost:3000/settings

## ✅ Verify Everything Works

| Check | URL |
|-------|-----|
| Landing page loads | `/` |
| Registration works | `/register` |
| Login works | `/login` |
| Chat sends messages | `/chat` |
| Admin panel accessible | `/admin` |
| Settings page loads | `/settings` |

## Troubleshooting

### "Invalid API key"
- Check your `ZAI_API_KEY` in `.env.local`
- Restart the dev server after changing env vars (`Ctrl+C` then `npm run dev`)

### "User not found" after signup
- Make sure the `handle_new_user` trigger ran successfully
- Check Supabase → Table Editor → profiles for your row
- If missing, run the `supabase-schema.sql` again

### Auth redirect loops
- Verify **Site URL** is set correctly in Supabase Auth settings
- Check `NEXT_PUBLIC_APP_URL` in `.env.local` matches your actual URL
- Make sure `/auth/callback` is in Supabase Redirect URLs

### Rate limiting issues
- Rate limits are in-memory and reset on server restart
- Adjust limits in `lib/rate-limit.ts`

### Admin panel redirects to /chat
- Make sure you ran the SQL to set your role to `admin`
- Check Supabase Table Editor → your profile → `role` column

### Email verification not working
- Check Supabase → Authentication → Email → Confirm email is ON
- Verify SMTP settings in Supabase → Settings → Authentication → SMTP

---

**Next:** → [DEPLOY.md](./DEPLOY.md) — Deploy to production
