-- Add role and banned columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' NOT NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS banned boolean DEFAULT false NOT NULL;

-- Set first user as admin
UPDATE profiles SET role = 'admin' WHERE id = '99d126cc-0c0c-4b76-b303-69f547692ee1';
