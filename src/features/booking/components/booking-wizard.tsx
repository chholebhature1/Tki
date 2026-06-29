"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { BookingState, ConsultationType, PatientDetails, BookingTherapistInfo, BookingDate, TimeSlot } from "../types";
import { getAvailableDates, getAvailableSlots, createBookingAction, lockSlotAction } from "../actions";
import { StepIndicator } from "./step-indicator";
import { StepConsultationType } from "./step-consultation-type";
import { StepDateSelection } from "./step-date-selection";
import { StepTimeSelection } from "./step-time-selection";
import { StepPatientDetails } from "./step-patient-details";
import { StepReview } from "./step-review";
import { BookingSummarySidebar } from "./booking-summary-sidebar";

interface BookingWizardProps {
  therapist: BookingTherapistInfo;
}

export function BookingWizard({ therapist }: BookingWizardProps) {
  const router = useRouter();
  const [state, setState] = useState<BookingState>({
    step: 1,
    consultationType: null,
    selectedDate: null,
    selectedTime: null,
    patientDetails: null,
  });

  const [dates, setDates] = useState<BookingDate[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Load dates when entering step 2
  const loadDates = useCallback(() => {
    if (dates.length > 0) return;
    setLoadingDates(true);
    getAvailableDates(therapist.therapistProfileId).then((d) => {
      setDates(d);
      setLoadingDates(false);
    });
  }, [dates.length, therapist.therapistProfileId]);

  // Load slots when a date is selected
  const loadSlots = useCallback(
    (date: string) => {
      setLoadingSlots(true);
      setSlots([]);
      getAvailableSlots(therapist.therapistProfileId, date).then((s) => {
        setSlots(s);
        setLoadingSlots(false);
      });
    },
    [therapist.therapistProfileId]
  );

  function handleDateSelect(date: string) {
    setState((s) => ({ ...s, selectedDate: date, selectedTime: null }));
    loadSlots(date);
  }

  // Lock slot when user selects a time
  function handleTimeSelect(time: string) {
    setState((s) => ({ ...s, selectedTime: time }));
    // Convert display time to 24h format for DB
    const time24 = convertTo24h(time);
    if (state.selectedDate) {
      lockSlotAction(therapist.therapistProfileId, state.selectedDate, time24);
    }
  }

  // Submit booking on step 5
  async function handleSubmitBooking() {
    if (!state.selectedDate || !state.selectedTime || !state.consultationType) return;
    setSubmitting(true);
    setBookingError("");

    const time24 = convertTo24h(state.selectedTime);

    const result = await createBookingAction({
      therapistProfileId: therapist.therapistProfileId,
      appointmentDate: state.selectedDate,
      startTime: time24,
      durationMinutes: therapist.sessionDuration,
      consultationMode: state.consultationType === "video" ? "online" : "online",
      notes: state.patientDetails?.notes || null,
    });

    if (!result.success) {
      setBookingError(result.error || "Booking failed. Please try again.");
      setSubmitting(false);
      return;
    }

    // Redirect to payment page
    router.push(`/payment/${result.appointmentId}`);
  }

  function canContinue(): boolean {
    switch (state.step) {
      case 1: return state.consultationType !== null;
      case 2: return state.selectedDate !== null;
      case 3: return state.selectedTime !== null;
      case 4: return !!(state.patientDetails && state.patientDetails.reason);
      case 5: return true;
      default: return false;
    }
  }

  function next() {
    if (canContinue() && state.step < 5) {
      const nextStep = state.step + 1;
      setState((s) => ({ ...s, step: nextStep }));
      if (nextStep === 2) loadDates();
    }
  }

  function back() {
    if (state.step > 1) {
      setState((s) => ({ ...s, step: s.step - 1 }));
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div>
        <StepIndicator currentStep={state.step} />

        <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
          {state.step === 1 && (
            <StepConsultationType
              selected={state.consultationType}
              onSelect={(type: ConsultationType) => setState((s) => ({ ...s, consultationType: type }))}
            />
          )}
          {state.step === 2 && (
            loadingDates ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <StepDateSelection
                dates={dates}
                selected={state.selectedDate}
                onSelect={handleDateSelect}
              />
            )
          )}
          {state.step === 3 && (
            loadingSlots ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <StepTimeSelection
                slots={slots}
                selected={state.selectedTime}
                onSelect={handleTimeSelect}
              />
            )
          )}
          {state.step === 4 && (
            <StepPatientDetails
              details={state.patientDetails}
              onChange={(details: PatientDetails) => setState((s) => ({ ...s, patientDetails: details }))}
            />
          )}
          {state.step === 5 && (
            <StepReview state={state} therapist={therapist} />
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={back}
              className={cn(
                "rounded-lg px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                state.step === 1 && "invisible"
              )}
            >
              Back
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-text lg:hidden">
                ₹{therapist.sessionFee.toLocaleString("en-IN")}
              </span>
              {bookingError && (
                <span className="text-xs text-danger">{bookingError}</span>
              )}
              <button
                type="button"
                onClick={state.step === 5 ? handleSubmitBooking : next}
                disabled={!canContinue() || submitting}
                className="rounded-xl bg-primary px-7 py-3 text-sm font-medium text-white transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {submitting ? "Creating booking..." : state.step === 5 ? "Continue to Payment" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-20">
          <BookingSummarySidebar state={state} therapist={therapist} />
        </div>
      </div>
    </div>
  );
}

/** Converts "9:00 AM" or "2:30 PM" to "09:00" or "14:30" */
function convertTo24h(time12: string): string {
  const [timePart, period] = time12.split(" ");
  const [h, m] = timePart.split(":").map(Number);
  let hours = h;
  if (period === "PM" && h !== 12) hours += 12;
  if (period === "AM" && h === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
