-- ============================================================
-- Migration: Therapist Availability & Blocked Periods
-- ============================================================

-- Weekly recurring schedule
CREATE TABLE public.therapist_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_profile_id uuid NOT NULL REFERENCES public.therapist_profiles(id) ON DELETE CASCADE,
  weekday smallint NOT NULL CHECK (weekday >= 0 AND weekday <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  slot_duration_minutes integer NOT NULL DEFAULT 50,
  buffer_after_minutes integer NOT NULL DEFAULT 10,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT end_after_start CHECK (end_time > start_time),
  CONSTRAINT valid_slot_duration CHECK (slot_duration_minutes > 0 AND slot_duration_minutes <= 120)
);

CREATE INDEX idx_availability_therapist ON public.therapist_availability(therapist_profile_id);
CREATE INDEX idx_availability_weekday ON public.therapist_availability(therapist_profile_id, weekday);

-- Blocked periods (holidays, leave)
CREATE TABLE public.therapist_blocked_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_profile_id uuid NOT NULL REFERENCES public.therapist_profiles(id) ON DELETE CASCADE,
  start_datetime timestamptz NOT NULL,
  end_datetime timestamptz NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT end_after_start_blocked CHECK (end_datetime > start_datetime)
);

CREATE INDEX idx_blocked_therapist ON public.therapist_blocked_periods(therapist_profile_id);

-- Slot locks (temporary booking reservation)
CREATE TABLE public.slot_locks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_profile_id uuid NOT NULL REFERENCES public.therapist_profiles(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL,
  appointment_date date NOT NULL,
  start_time time NOT NULL,
  locked_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '5 minutes'),
  UNIQUE (therapist_profile_id, appointment_date, start_time)
);

-- RLS
ALTER TABLE public.therapist_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_blocked_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slot_locks ENABLE ROW LEVEL SECURITY;

-- Availability: public read (needed for slot generation), owner manage
CREATE POLICY availability_public_select ON public.therapist_availability FOR SELECT USING (is_active = true);
CREATE POLICY availability_owner_all ON public.therapist_availability FOR ALL USING (
  therapist_profile_id IN (SELECT id FROM therapist_profiles WHERE profile_id = auth.uid())
);

-- Blocked: public read (needed for slot generation), owner manage
CREATE POLICY blocked_public_select ON public.therapist_blocked_periods FOR SELECT USING (true);
CREATE POLICY blocked_owner_all ON public.therapist_blocked_periods FOR ALL USING (
  therapist_profile_id IN (SELECT id FROM therapist_profiles WHERE profile_id = auth.uid())
);

-- Slot locks: public read (check availability), server manages inserts
CREATE POLICY slot_locks_public_select ON public.slot_locks FOR SELECT USING (true);

-- Updated_at trigger
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.therapist_availability
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed availability for demo therapists (Mon-Sat, 9-6)
INSERT INTO public.therapist_availability (therapist_profile_id, weekday, start_time, end_time, slot_duration_minutes, buffer_after_minutes)
SELECT tp.id, day, '09:00', '13:00', 50, 10
FROM public.therapist_profiles tp, generate_series(1, 6) AS day;

INSERT INTO public.therapist_availability (therapist_profile_id, weekday, start_time, end_time, slot_duration_minutes, buffer_after_minutes)
SELECT tp.id, day, '14:00', '18:00', 50, 10
FROM public.therapist_profiles tp, generate_series(1, 5) AS day;
