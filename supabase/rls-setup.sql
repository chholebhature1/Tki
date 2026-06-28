-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT r.name FROM public.profiles p
  JOIN public.roles r ON r.id = p.role_id
  WHERE p.id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT public.get_user_role() = 'admin'
$$;

-- Roles: public read
CREATE POLICY roles_public_select ON public.roles FOR SELECT USING (true);

-- Profiles: owner read/update, admin all
CREATE POLICY profiles_owner_select ON public.profiles FOR SELECT USING (id = auth.uid() OR public.is_admin());
CREATE POLICY profiles_owner_update ON public.profiles FOR UPDATE USING (id = auth.uid() OR public.is_admin());
CREATE POLICY profiles_insert ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());

-- Therapist profiles: public read verified, owner all, admin all
CREATE POLICY therapist_profiles_public_select ON public.therapist_profiles FOR SELECT USING (verification_status = 'approved' OR profile_id = auth.uid() OR public.is_admin());
CREATE POLICY therapist_profiles_owner_update ON public.therapist_profiles FOR UPDATE USING (profile_id = auth.uid() OR public.is_admin());
CREATE POLICY therapist_profiles_owner_insert ON public.therapist_profiles FOR INSERT WITH CHECK (profile_id = auth.uid());

-- Lookup tables: public read
CREATE POLICY specializations_public_select ON public.specializations FOR SELECT USING (true);
CREATE POLICY languages_public_select ON public.languages FOR SELECT USING (true);
CREATE POLICY therapist_spec_public_select ON public.therapist_specializations FOR SELECT USING (true);
CREATE POLICY therapist_lang_public_select ON public.therapist_languages FOR SELECT USING (true);

-- Appointments: patient reads own, therapist reads assigned, admin all
CREATE POLICY appointments_patient_select ON public.appointments FOR SELECT USING (patient_profile_id = auth.uid() OR public.is_admin());
CREATE POLICY appointments_therapist_select ON public.appointments FOR SELECT USING (
  therapist_profile_id IN (SELECT id FROM public.therapist_profiles WHERE profile_id = auth.uid())
);

-- Reviews: public read
CREATE POLICY reviews_public_select ON public.reviews FOR SELECT USING (true);
CREATE POLICY reviews_patient_insert ON public.reviews FOR INSERT WITH CHECK (patient_profile_id = auth.uid());

-- Notifications: owner read/update
CREATE POLICY notifications_owner_select ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY notifications_owner_update ON public.notifications FOR UPDATE USING (user_id = auth.uid());
