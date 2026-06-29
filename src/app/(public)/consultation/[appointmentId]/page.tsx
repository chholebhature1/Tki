import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { MeetingRepository } from "@/features/livekit/repositories";
import { authorizeMeetingJoin } from "@/features/livekit/services";
import { EARLY_JOIN_MINUTES, LATE_JOIN_MINUTES } from "@/features/livekit/constants";
import { ConsultationUnavailable } from "@/features/livekit/components/consultation-unavailable";
import { ConsultationReady } from "@/features/livekit/components/consultation-ready";

export const metadata = { title: "Video Consultation" };

export default async function ConsultationPage(
  props: { params: Promise<{ appointmentId: string }> }
) {
  const { appointmentId } = await props.params;

  // 1. Authenticate
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/consultation/${appointmentId}`);
  }

  // 2. Fetch appointment
  const { data: appointment } = await supabase
    .from("appointments")
    .select("id, appointment_date, start_time, duration_minutes, status, patient_profile_id, therapist_profile_id")
    .eq("id", appointmentId)
    .single();

  if (!appointment) {
    return <ConsultationUnavailable reason="not_found" />;
  }

  // 3. Check status
  if (appointment.status === "cancelled") {
    return <ConsultationUnavailable reason="cancelled" />;
  }
  if (appointment.status === "payment_pending") {
    return <ConsultationUnavailable reason="payment_pending" />;
  }
  if (appointment.status === "completed" || appointment.status === "no_show") {
    return <ConsultationUnavailable reason="ended" />;
  }
  if (appointment.status !== "confirmed") {
    return <ConsultationUnavailable reason="unauthorized" />;
  }

  // 4. Validate participant
  const { valid, role } = await MeetingRepository.validateParticipant(appointmentId, user.id);
  if (!valid || !role) {
    return <ConsultationUnavailable reason="unauthorized" />;
  }

  // 5. Validate time window
  const appointmentStart = new Date(`${appointment.appointment_date}T${appointment.start_time}`);
  const appointmentEnd = new Date(appointmentStart.getTime() + appointment.duration_minutes * 60000);
  const joinWindowStart = new Date(appointmentStart.getTime() - EARLY_JOIN_MINUTES * 60000);
  const joinWindowEnd = new Date(appointmentEnd.getTime() + LATE_JOIN_MINUTES * 60000);
  const now = new Date();

  if (now < joinWindowStart) {
    return (
      <ConsultationUnavailable
        reason="too_early"
        scheduledDate={appointmentStart.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}
        scheduledTime={appointment.start_time}
      />
    );
  }

  if (now > joinWindowEnd) {
    return <ConsultationUnavailable reason="ended" />;
  }

  // 6. Generate token
  const authResult = await authorizeMeetingJoin(appointmentId, user.id);

  if (!authResult.success || !authResult.data) {
    return <ConsultationUnavailable reason="unauthorized" />;
  }

  // 7. Get participant info
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  // Get the other participant's name
  const otherProfileId = role === "patient"
    ? appointment.therapist_profile_id
    : appointment.patient_profile_id;

  let otherName = "Participant";
  if (role === "patient") {
    const { data: tp } = await supabase
      .from("therapist_profiles")
      .select("profile:profiles!therapist_profiles_profile_id_fkey(full_name)")
      .eq("id", otherProfileId)
      .single();
    otherName = (tp?.profile as unknown as { full_name: string })?.full_name || "Therapist";
  } else {
    const { data: pp } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", otherProfileId)
      .single();
    otherName = pp?.full_name || "Patient";
  }

  // 8. Render ready state (Phase 6.4 will replace with actual LiveKit room)
  return (
    <ConsultationReady
      token={authResult.data}
      participantName={profile?.full_name || "Participant"}
      role={role}
      therapistName={otherName}
      appointmentDate={appointmentStart.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
      appointmentTime={appointment.start_time}
      duration={appointment.duration_minutes}
    />
  );
}
