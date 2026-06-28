-- ============================================================
-- Migration: Auth Profile Synchronization
-- Purpose: Auto-create profiles row when a new user signs up
-- ============================================================

-- 1. Function: handle_new_user
-- Triggered after INSERT on auth.users
-- Creates a profiles row with default Patient role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  patient_role_id uuid;
BEGIN
  -- Get the patient role ID
  SELECT id INTO patient_role_id FROM public.roles WHERE name = 'patient';

  -- Insert profile only if it doesn't already exist
  INSERT INTO public.profiles (
    id,
    role_id,
    full_name,
    email,
    phone,
    avatar_url,
    country,
    is_active,
    email_verified,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    patient_role_id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.email,
    NEW.raw_user_meta_data ->> 'phone',
    NEW.raw_user_meta_data ->> 'avatar_url',
    'India',
    true,
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- 2. Trigger: on_auth_user_created
-- Fires after every new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 3. Reusable updated_at trigger function
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply to all tables with updated_at column
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.therapist_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
