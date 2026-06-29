-- ============================================================
-- Migration: Therapist Availability & Blocked Periods
-- ============================================================

-- Therapist weekly recurring schedule
CREATE TABLE public.therapist_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_profile_id uuid NOT NULL REFERENCES public.therapist_profiles(id) ON DELETE CASCADE,
  weekday smallint NOT NULL CHECK (weekday >= 0 AND weekday <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  slot_duration_minutes integer NOT NULL DEFAULT 50 CHECK (slot_duration_minutes > 0),
  buffer_after_minutes integer NOT NULL DEFAULT 10,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time),
  CONSTRAINT unique_therapist_weekday_slot UNIQUE (therapist_profile_id, weekday, start_time)
);

CREATE INDEX idx_availability_therapist ON public.therapist_availability(therapist_profile_id);
CREATE INDEX idx_availability_weekday ON public.therapist_availability(weekday);

-- Blocked periods (holidays, leaves, breaks)
CREATE TABLE public.therapist_blocked_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_profile_id uuid NOT NULL REFERENCES public.therapist_profiles(id) ON DELETE CASCADE,
  start_datetime timestamptz NOT NULL,
  end_datetime timestamptz NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_blocked_range CHECK (end_datetime > start_datetime)
);

CREATE INDEX idx_blocked_therapist ON public.therapist_blocked_periods(therapist_profile_id);

-- Slot locks (temporary reservation during payment)
CREATE TABLE public.slot_locks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_profile_id uuid NOT NULL REFERENCES public.therapist_profiles(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL,
  appointment_date date NOT NULL,
  start_time time NOT NULL,
  locked_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '5 minutes'),
  CONSTRAINT unique_slot_lock UNIQUE (therapist_profile_id, appointment_date, start_time)
);

-- Enable RLS
ALTER TABLE public.therapist_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_blocked_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slot_locks ENABLE ROW LEVEL SECURITY;

-- Availability: public read (needed for slot generation), owner manages
CREATE POLICY availability_public_select ON public.therapist_availability FOR SELECT USING (is_active = true);
CREATE POLICY availability_owner_all ON public.therapist_availability FOR ALL USING (
  therapist_profile_id IN (SELECT id FROM therapist_profiles WHERE profile_id = auth.uid())
);

-- Blocked periods: public read, owner manages
CREATE POLICY blocked_public_select ON public.therapist_blocked_periods FOR SELECT USING (true);
CREATE POLICY blocked_owner_all ON public.therapist_blocked_periods FOR ALL USING (
  therapist_profile_id IN (SELECT id FROM therapist_profiles WHERE profile_id = auth.uid())
);

-- Slot locks: public read (needed for availability check)
CREATE POLICY slot_locks_public_select ON public.slot_locks FOR SELECT USING (true);

-- Apply updated_at trigger
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.therapist_availability
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- Seed availability for demo therapists
-- Weekdays: 0=Sunday, 1=Monday ... 6=Saturday
-- ============================================================

-- Dr. Priya Sharma: Mon-Fri 9:00-13:00, 15:00-18:00
INSERT INTO public.therapist_availability (therapist_profile_id, weekday, start_time, end_time, slot_duration_minutes, buffer_after_minutes) VALUES
  ('00000000-0000-0000-0001-000000000001', 1, '09:00', '13:00', 50, 10),
  ('00000000-0000-0000-0001-000000000001', 1, '15:00', '18:00', 50, 10),
  ('00000000-0000-0000-0001-000000000001', 2, '09:00', '13:00', 50, 10),
  ('00000000-0000-0000-0001-000000000001', 2, '15:00', '18:00', 50, 10),
  ('00000000-0000-0000-0001-000000000001', 3, '09:00', '13:00', 50, 10),
  ('00000000-0000-0000-0001-000000000001', 3, '15:00', '18:00', 50, 10),
  ('00000000-0000-0000-0001-000000000001', 4, '09:00', '13:00', 50, 10),
  ('00000000-0000-0000-0001-000000000001', 4, '15:00', '18:00', 50, 10),
  ('00000000-0000-0000-0001-000000000001', 5, '09:00', '13:00', 50, 10);

-- Dr. Arjun Mehta: Mon-Sat 10:00-14:00, 16:00-19:00
INSERT INTO public.therapist_availability (therapist_profile_id, weekday, start_time, end_time, slot_duration_minutes, buffer_after_minutes) VALUES
  ('00000000-0000-0000-0001-000000000002', 1, '10:00', '14:00', 50, 10),
  ('00000000-0000-0000-0001-000000000002', 1, '16:00', '19:00', 50, 10),
  ('00000000-0000-0000-0001-000000000002', 2, '10:00', '14:00', 50, 10),
  ('00000000-0000-0000-0001-000000000002', 3, '10:00', '14:00', 50, 10),
  ('00000000-0000-0000-0001-000000000002', 4, '10:00', '14:00', 50, 10),
  ('00000000-0000-0000-0001-000000000002', 5, '10:00', '14:00', 50, 10),
  ('00000000-0000-0000-0001-000000000002', 6, '10:00', '13:00', 50, 10);

-- Add availability for remaining therapists (simplified: Mon-Fri 9:00-17:00)
INSERT INTO public.therapist_availability (therapist_profile_id, weekday, start_time, end_time, slot_duration_minutes, buffer_after_minutes)
SELECT tp.id, w.weekday, '09:00'::time, '13:00'::time, 50, 10
FROM public.therapist_profiles tp
CROSS JOIN (VALUES (1),(2),(3),(4),(5)) AS w(weekday)
WHERE tp.id NOT IN ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0001-000000000002');

INSERT INTO public.therapist_availability (therapist_profile_id, weekday, start_time, end_time, slot_duration_minutes, buffer_after_minutes)
SELECT tp.id, w.weekday, '14:00'::time, '18:00'::time, 50, 10
FROM public.therapist_profiles tp
CROSS JOIN (VALUES (1),(2),(3),(4),(5)) AS w(weekday)
WHERE tp.id NOT IN ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0001-000000000002');
