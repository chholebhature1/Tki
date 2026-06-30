-- Extend notifications table with category, link, email_sent
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS category text DEFAULT 'general';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS link text;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS email_sent boolean DEFAULT false;
