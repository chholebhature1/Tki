-- ============================================================
-- Migration: Seed Demo Data
-- 10 Therapists, 3 Patients, Reviews, Appointments
-- NOTE: Demo profiles bypass auth.users FK by temporarily disabling the constraint.
-- In production, profiles are created via the on_auth_user_created trigger.
-- ============================================================

-- Temporarily drop FK to auth.users for seeding demo data
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Step 1: Demo patients
INSERT INTO public.profiles (id, role_id, full_name, email, phone, gender, city, state, country, is_active, email_verified, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000101', (SELECT id FROM roles WHERE name = 'patient'), 'Ananya Verma', 'ananya@demo.talkindia.in', '+919876543001', 'female', 'Mumbai', 'Maharashtra', 'India', true, true, now(), now()),
  ('00000000-0000-0000-0000-000000000102', (SELECT id FROM roles WHERE name = 'patient'), 'Rahul Gupta', 'rahul@demo.talkindia.in', '+919876543002', 'male', 'Delhi', 'Delhi', 'India', true, true, now(), now()),
  ('00000000-0000-0000-0000-000000000103', (SELECT id FROM roles WHERE name = 'patient'), 'Sneha Iyer', 'sneha@demo.talkindia.in', '+919876543003', 'female', 'Bangalore', 'Karnataka', 'India', true, true, now(), now());

-- Step 2: Demo therapist base profiles
INSERT INTO public.profiles (id, role_id, full_name, email, phone, gender, city, state, country, is_active, email_verified, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', (SELECT id FROM roles WHERE name = 'therapist'), 'Dr. Priya Sharma', 'priya@demo.talkindia.in', '+919876543101', 'female', 'Mumbai', 'Maharashtra', 'India', true, true, now(), now()),
  ('00000000-0000-0000-0000-000000000002', (SELECT id FROM roles WHERE name = 'therapist'), 'Dr. Arjun Mehta', 'arjun@demo.talkindia.in', '+919876543102', 'male', 'Ahmedabad', 'Gujarat', 'India', true, true, now(), now()),
  ('00000000-0000-0000-0000-000000000003', (SELECT id FROM roles WHERE name = 'therapist'), 'Dr. Kavitha Nair', 'kavitha@demo.talkindia.in', '+919876543103', 'female', 'Kochi', 'Kerala', 'India', true, true, now(), now()),
  ('00000000-0000-0000-0000-000000000004', (SELECT id FROM roles WHERE name = 'therapist'), 'Dr. Rohit Kapoor', 'rohit@demo.talkindia.in', '+919876543104', 'male', 'Delhi', 'Delhi', 'India', true, true, now(), now()),
  ('00000000-0000-0000-0000-000000000005', (SELECT id FROM roles WHERE name = 'therapist'), 'Dr. Meera Reddy', 'meera@demo.talkindia.in', '+919876543105', 'female', 'Hyderabad', 'Telangana', 'India', true, true, now(), now()),
  ('00000000-0000-0000-0000-000000000006', (SELECT id FROM roles WHERE name = 'therapist'), 'Dr. Sameer Khan', 'sameer@demo.talkindia.in', '+919876543106', 'male', 'Lucknow', 'Uttar Pradesh', 'India', true, true, now(), now()),
  ('00000000-0000-0000-0000-000000000007', (SELECT id FROM roles WHERE name = 'therapist'), 'Dr. Anita Desai', 'anita@demo.talkindia.in', '+919876543107', 'female', 'Pune', 'Maharashtra', 'India', true, true, now(), now()),
  ('00000000-0000-0000-0000-000000000008', (SELECT id FROM roles WHERE name = 'therapist'), 'Dr. Vikram Singh', 'vikram@demo.talkindia.in', '+919876543108', 'male', 'Chandigarh', 'Punjab', 'India', true, true, now(), now()),
  ('00000000-0000-0000-0000-000000000009', (SELECT id FROM roles WHERE name = 'therapist'), 'Dr. Lakshmi Iyer', 'lakshmi@demo.talkindia.in', '+919876543109', 'female', 'Chennai', 'Tamil Nadu', 'India', true, true, now(), now()),
  ('00000000-0000-0000-0000-000000000010', (SELECT id FROM roles WHERE name = 'therapist'), 'Dr. Aditya Joshi', 'aditya@demo.talkindia.in', '+919876543110', 'male', 'Kolkata', 'West Bengal', 'India', true, true, now(), now());

-- Restore FK (new real users still get created via trigger which ensures auth.users exists)
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE NOT VALID;

-- Step 3: Therapist professional profiles
INSERT INTO public.therapist_profiles (id, profile_id, professional_title, license_number, years_experience, consultation_fee, biography, consultation_mode, average_rating, total_reviews, total_sessions, is_featured, verification_status)
VALUES
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Clinical Psychologist', 'RCI-CP-2012-4521', 12, 1500, 'Specializing in CBT and mindfulness for anxiety, depression, and stress. Over a decade of experience helping individuals build resilience.', 'online', 4.9, 28, 340, true, 'approved'),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000002', 'Psychiatrist', 'MCI-PSY-2016-7832', 8, 2000, 'Experienced psychiatrist helping individuals and couples navigate life transitions through medication and psychotherapy.', 'both', 4.8, 22, 210, true, 'approved'),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000003', 'Child & Adolescent Psychologist', 'RCI-CP-2014-6201', 10, 1200, 'Supporting young minds through academic pressure, social challenges, and developmental concerns using play therapy and CBT.', 'online', 4.9, 18, 180, true, 'approved'),
  ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000004', 'Addiction Counselor', 'RCI-CC-2009-3145', 15, 1800, 'Helping individuals recover from substance use and behavioral addictions through structured, compassionate therapy.', 'both', 4.7, 14, 420, false, 'approved'),
  ('00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0000-000000000005', 'Counseling Psychologist', 'RCI-CP-2018-9012', 6, 1000, 'Helping women navigate life transitions, self-esteem issues, and workplace challenges with a warm approach.', 'online', 4.8, 12, 95, true, 'approved'),
  ('00000000-0000-0000-0001-000000000006', '00000000-0000-0000-0000-000000000006', 'Psychiatrist', 'MCI-PSY-2013-5567', 11, 2200, 'Medication management and psychotherapy for OCD, severe anxiety, and mood disorders.', 'both', 4.6, 16, 280, false, 'approved'),
  ('00000000-0000-0000-0001-000000000007', '00000000-0000-0000-0000-000000000007', 'Couples Therapist', 'RCI-CP-2010-2234', 14, 1800, 'Expert in relationship counseling, communication patterns, and rebuilding trust using Gottman Method and EFT.', 'online', 4.9, 24, 310, true, 'approved'),
  ('00000000-0000-0000-0001-000000000008', '00000000-0000-0000-0000-000000000008', 'Clinical Social Worker', 'RCI-SW-2015-8890', 9, 1300, 'Community-focused professional specializing in trauma recovery, family systems therapy, and PTSD.', 'online', 4.7, 10, 150, false, 'approved'),
  ('00000000-0000-0000-0001-000000000009', '00000000-0000-0000-0000-000000000009', 'Clinical Psychologist', 'RCI-CP-2017-7456', 7, 1400, 'CBT and mindfulness-based interventions for anxiety, insomnia, and emotional regulation.', 'online', 4.8, 15, 120, false, 'approved'),
  ('00000000-0000-0000-0001-000000000010', '00000000-0000-0000-0000-000000000010', 'Neuropsychologist', 'RCI-NP-2006-1123', 18, 2800, 'Expert in cognitive assessments, ADHD diagnosis, and rehabilitation after neurological events.', 'offline', 4.7, 11, 500, false, 'approved');

-- Step 4: Specialization links
INSERT INTO public.therapist_specializations (therapist_profile_id, specialization_id)
SELECT tp.id, s.id FROM therapist_profiles tp, specializations s WHERE tp.profile_id = '00000000-0000-0000-0000-000000000001' AND s.slug IN ('anxiety','depression','stress-management');
INSERT INTO public.therapist_specializations (therapist_profile_id, specialization_id)
SELECT tp.id, s.id FROM therapist_profiles tp, specializations s WHERE tp.profile_id = '00000000-0000-0000-0000-000000000002' AND s.slug IN ('relationships','family','career');
INSERT INTO public.therapist_specializations (therapist_profile_id, specialization_id)
SELECT tp.id, s.id FROM therapist_profiles tp, specializations s WHERE tp.profile_id = '00000000-0000-0000-0000-000000000003' AND s.slug IN ('child-teen','anxiety','adhd');
INSERT INTO public.therapist_specializations (therapist_profile_id, specialization_id)
SELECT tp.id, s.id FROM therapist_profiles tp, specializations s WHERE tp.profile_id = '00000000-0000-0000-0000-000000000004' AND s.slug IN ('addiction','stress-management','trauma');
INSERT INTO public.therapist_specializations (therapist_profile_id, specialization_id)
SELECT tp.id, s.id FROM therapist_profiles tp, specializations s WHERE tp.profile_id = '00000000-0000-0000-0000-000000000005' AND s.slug IN ('stress-management','career','self-esteem');
INSERT INTO public.therapist_specializations (therapist_profile_id, specialization_id)
SELECT tp.id, s.id FROM therapist_profiles tp, specializations s WHERE tp.profile_id = '00000000-0000-0000-0000-000000000006' AND s.slug IN ('ocd','anxiety','depression');
INSERT INTO public.therapist_specializations (therapist_profile_id, specialization_id)
SELECT tp.id, s.id FROM therapist_profiles tp, specializations s WHERE tp.profile_id = '00000000-0000-0000-0000-000000000007' AND s.slug IN ('relationships','family','grief');
INSERT INTO public.therapist_specializations (therapist_profile_id, specialization_id)
SELECT tp.id, s.id FROM therapist_profiles tp, specializations s WHERE tp.profile_id = '00000000-0000-0000-0000-000000000008' AND s.slug IN ('trauma','family','depression');
INSERT INTO public.therapist_specializations (therapist_profile_id, specialization_id)
SELECT tp.id, s.id FROM therapist_profiles tp, specializations s WHERE tp.profile_id = '00000000-0000-0000-0000-000000000009' AND s.slug IN ('anxiety','insomnia','stress-management');
INSERT INTO public.therapist_specializations (therapist_profile_id, specialization_id)
SELECT tp.id, s.id FROM therapist_profiles tp, specializations s WHERE tp.profile_id = '00000000-0000-0000-0000-000000000010' AND s.slug IN ('adhd','trauma','depression');

-- Step 5: Language links
INSERT INTO public.therapist_languages (therapist_profile_id, language_id)
SELECT tp.id, l.id FROM therapist_profiles tp, languages l WHERE tp.profile_id = '00000000-0000-0000-0000-000000000001' AND l.code IN ('en','hi');
INSERT INTO public.therapist_languages (therapist_profile_id, language_id)
SELECT tp.id, l.id FROM therapist_profiles tp, languages l WHERE tp.profile_id = '00000000-0000-0000-0000-000000000002' AND l.code IN ('en','hi','gu');
INSERT INTO public.therapist_languages (therapist_profile_id, language_id)
SELECT tp.id, l.id FROM therapist_profiles tp, languages l WHERE tp.profile_id = '00000000-0000-0000-0000-000000000003' AND l.code IN ('en','ml','ta');
INSERT INTO public.therapist_languages (therapist_profile_id, language_id)
SELECT tp.id, l.id FROM therapist_profiles tp, languages l WHERE tp.profile_id = '00000000-0000-0000-0000-000000000004' AND l.code IN ('en','hi','pa');
INSERT INTO public.therapist_languages (therapist_profile_id, language_id)
SELECT tp.id, l.id FROM therapist_profiles tp, languages l WHERE tp.profile_id = '00000000-0000-0000-0000-000000000005' AND l.code IN ('en','te','hi');
INSERT INTO public.therapist_languages (therapist_profile_id, language_id)
SELECT tp.id, l.id FROM therapist_profiles tp, languages l WHERE tp.profile_id = '00000000-0000-0000-0000-000000000006' AND l.code IN ('en','hi','ur');
INSERT INTO public.therapist_languages (therapist_profile_id, language_id)
SELECT tp.id, l.id FROM therapist_profiles tp, languages l WHERE tp.profile_id = '00000000-0000-0000-0000-000000000007' AND l.code IN ('en','hi','mr');
INSERT INTO public.therapist_languages (therapist_profile_id, language_id)
SELECT tp.id, l.id FROM therapist_profiles tp, languages l WHERE tp.profile_id = '00000000-0000-0000-0000-000000000008' AND l.code IN ('en','hi','pa');
INSERT INTO public.therapist_languages (therapist_profile_id, language_id)
SELECT tp.id, l.id FROM therapist_profiles tp, languages l WHERE tp.profile_id = '00000000-0000-0000-0000-000000000009' AND l.code IN ('en','ta','kn');
INSERT INTO public.therapist_languages (therapist_profile_id, language_id)
SELECT tp.id, l.id FROM therapist_profiles tp, languages l WHERE tp.profile_id = '00000000-0000-0000-0000-000000000010' AND l.code IN ('en','hi','bn');

-- Step 6: Appointments (20)
INSERT INTO public.appointments (patient_profile_id, therapist_profile_id, appointment_date, start_time, end_time, duration_minutes, consultation_mode, status, booking_reference) VALUES
('00000000-0000-0000-0000-000000000101','00000000-0000-0000-0001-000000000001',CURRENT_DATE+2,'09:00','09:50',50,'online','confirmed','TKI-2024-00001'),
('00000000-0000-0000-0000-000000000102','00000000-0000-0000-0001-000000000001',CURRENT_DATE+3,'11:00','11:50',50,'online','confirmed','TKI-2024-00002'),
('00000000-0000-0000-0000-000000000103','00000000-0000-0000-0001-000000000002',CURRENT_DATE+1,'14:00','14:50',50,'both','confirmed','TKI-2024-00003'),
('00000000-0000-0000-0000-000000000101','00000000-0000-0000-0001-000000000003',CURRENT_DATE-5,'10:00','10:50',50,'online','completed','TKI-2024-00004'),
('00000000-0000-0000-0000-000000000102','00000000-0000-0000-0001-000000000004',CURRENT_DATE-7,'15:00','15:50',50,'both','completed','TKI-2024-00005'),
('00000000-0000-0000-0000-000000000103','00000000-0000-0000-0001-000000000005',CURRENT_DATE-3,'16:00','16:50',50,'online','completed','TKI-2024-00006'),
('00000000-0000-0000-0000-000000000101','00000000-0000-0000-0001-000000000006',CURRENT_DATE-10,'09:00','09:50',50,'both','completed','TKI-2024-00007'),
('00000000-0000-0000-0000-000000000102','00000000-0000-0000-0001-000000000007',CURRENT_DATE-14,'11:00','11:50',50,'online','completed','TKI-2024-00008'),
('00000000-0000-0000-0000-000000000103','00000000-0000-0000-0001-000000000001',CURRENT_DATE-21,'14:00','14:50',50,'online','completed','TKI-2024-00009'),
('00000000-0000-0000-0000-000000000101','00000000-0000-0000-0001-000000000002',CURRENT_DATE-28,'10:00','10:50',50,'both','completed','TKI-2024-00010'),
('00000000-0000-0000-0000-000000000102','00000000-0000-0000-0001-000000000003',CURRENT_DATE-30,'15:00','15:50',50,'online','completed','TKI-2024-00011'),
('00000000-0000-0000-0000-000000000103','00000000-0000-0000-0001-000000000004',CURRENT_DATE-35,'09:00','09:50',50,'both','completed','TKI-2024-00012'),
('00000000-0000-0000-0000-000000000101','00000000-0000-0000-0001-000000000005',CURRENT_DATE+5,'10:00','10:50',50,'online','confirmed','TKI-2024-00013'),
('00000000-0000-0000-0000-000000000102','00000000-0000-0000-0001-000000000007',CURRENT_DATE+4,'16:00','16:50',50,'online','confirmed','TKI-2024-00014'),
('00000000-0000-0000-0000-000000000103','00000000-0000-0000-0001-000000000009',CURRENT_DATE+6,'11:00','11:50',50,'online','confirmed','TKI-2024-00015'),
('00000000-0000-0000-0000-000000000101','00000000-0000-0000-0001-000000000001',CURRENT_DATE-45,'14:00','14:50',50,'online','cancelled','TKI-2024-00016'),
('00000000-0000-0000-0000-000000000102','00000000-0000-0000-0001-000000000006',CURRENT_DATE-50,'09:00','09:50',50,'both','completed','TKI-2024-00017'),
('00000000-0000-0000-0000-000000000103','00000000-0000-0000-0001-000000000008',CURRENT_DATE-40,'10:00','10:50',50,'online','completed','TKI-2024-00018'),
('00000000-0000-0000-0000-000000000101','00000000-0000-0000-0001-000000000010',CURRENT_DATE-60,'15:00','15:50',50,'offline','completed','TKI-2024-00019'),
('00000000-0000-0000-0000-000000000102','00000000-0000-0000-0001-000000000009',CURRENT_DATE-55,'11:00','11:50',50,'online','completed','TKI-2024-00020');

-- Step 7: Reviews for completed appointments
INSERT INTO public.reviews (appointment_id, patient_profile_id, therapist_profile_id, rating, comment) SELECT a.id, a.patient_profile_id, a.therapist_profile_id, 5, 'Dr. Sharma helped me understand my anxiety patterns and gave me practical tools.' FROM appointments a WHERE a.booking_reference = 'TKI-2024-00004';
INSERT INTO public.reviews (appointment_id, patient_profile_id, therapist_profile_id, rating, comment) SELECT a.id, a.patient_profile_id, a.therapist_profile_id, 5, 'Compassionate and structured approach. Feeling much better about recovery.' FROM appointments a WHERE a.booking_reference = 'TKI-2024-00005';
INSERT INTO public.reviews (appointment_id, patient_profile_id, therapist_profile_id, rating, comment) SELECT a.id, a.patient_profile_id, a.therapist_profile_id, 4, 'Helpful session. Saw my work stress from a new perspective.' FROM appointments a WHERE a.booking_reference = 'TKI-2024-00006';
INSERT INTO public.reviews (appointment_id, patient_profile_id, therapist_profile_id, rating, comment) SELECT a.id, a.patient_profile_id, a.therapist_profile_id, 5, 'Medication adjustment made a noticeable difference within weeks.' FROM appointments a WHERE a.booking_reference = 'TKI-2024-00007';
INSERT INTO public.reviews (appointment_id, patient_profile_id, therapist_profile_id, rating, comment) SELECT a.id, a.patient_profile_id, a.therapist_profile_id, 5, 'Helped us communicate better as a couple. We look forward to sessions.' FROM appointments a WHERE a.booking_reference = 'TKI-2024-00008';
INSERT INTO public.reviews (appointment_id, patient_profile_id, therapist_profile_id, rating, comment) SELECT a.id, a.patient_profile_id, a.therapist_profile_id, 4, 'Consistent quality and genuine care. Second session was great.' FROM appointments a WHERE a.booking_reference = 'TKI-2024-00009';
INSERT INTO public.reviews (appointment_id, patient_profile_id, therapist_profile_id, rating, comment) SELECT a.id, a.patient_profile_id, a.therapist_profile_id, 5, 'Understood my family dynamics quickly. Culturally sensitive advice.' FROM appointments a WHERE a.booking_reference = 'TKI-2024-00010';
INSERT INTO public.reviews (appointment_id, patient_profile_id, therapist_profile_id, rating, comment) SELECT a.id, a.patient_profile_id, a.therapist_profile_id, 5, 'My daughter opened up for the first time. Amazing experience.' FROM appointments a WHERE a.booking_reference = 'TKI-2024-00011';
INSERT INTO public.reviews (appointment_id, patient_profile_id, therapist_profile_id, rating, comment) SELECT a.id, a.patient_profile_id, a.therapist_profile_id, 4, 'Patient and non-judgmental. Solid progress on recovery.' FROM appointments a WHERE a.booking_reference = 'TKI-2024-00012';
INSERT INTO public.reviews (appointment_id, patient_profile_id, therapist_profile_id, rating, comment) SELECT a.id, a.patient_profile_id, a.therapist_profile_id, 5, 'Careful medication management and prompt follow-up.' FROM appointments a WHERE a.booking_reference = 'TKI-2024-00017';
INSERT INTO public.reviews (appointment_id, patient_profile_id, therapist_profile_id, rating, comment) SELECT a.id, a.patient_profile_id, a.therapist_profile_id, 4, 'Helped me process difficult memories in a safe environment.' FROM appointments a WHERE a.booking_reference = 'TKI-2024-00018';
INSERT INTO public.reviews (appointment_id, patient_profile_id, therapist_profile_id, rating, comment) SELECT a.id, a.patient_profile_id, a.therapist_profile_id, 5, 'Thorough cognitive assessment. Very professional report.' FROM appointments a WHERE a.booking_reference = 'TKI-2024-00019';
INSERT INTO public.reviews (appointment_id, patient_profile_id, therapist_profile_id, rating, comment) SELECT a.id, a.patient_profile_id, a.therapist_profile_id, 4, 'Sleep hygiene techniques that actually work. Grateful.' FROM appointments a WHERE a.booking_reference = 'TKI-2024-00020';
