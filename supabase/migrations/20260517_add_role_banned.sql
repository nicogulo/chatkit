-- Add role and banned columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS banned BOOLEAN NOT NULL DEFAULT false;

-- Set YOUR account as admin (replace with your user ID after signup)
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID_HERE';
