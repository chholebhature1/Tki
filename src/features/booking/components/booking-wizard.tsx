"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { BookingState, ConsultationType, PatientDetails, BookingTherapistInfo } from "../types";
import { generateMockDates, mockTimeSlots } from "../constants";
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
  const [state, setState] = useState<BookingState>({
    step: 1,
    consultationType: null,
    selectedDate: null,
    selectedTime: null,
    patientDetails: null,
  });

  const dates = useMemo(() => generateMockDates(), []);

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
      setState((s) => ({ ...s, step: s.step + 1 }));
    }
  }

  function back() {
    if (state.step > 1) {
      setState((s) => ({ ...s, step: s.step - 1 }));
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      {/* Main Wizard */}
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
            <StepDateSelection
              dates={dates}
              selected={state.selectedDate}
              onSelect={(date: string) => setState((s) => ({ ...s, selectedDate: date }))}
            />
          )}
          {state.step === 3 && (
            <StepTimeSelection
              slots={mockTimeSlots}
              selected={state.selectedTime}
              onSelect={(time: string) => setState((s) => ({ ...s, selectedTime: time }))}
            />
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
              {/* Mobile price hint */}
              <span className="text-sm font-semibold text-text lg:hidden">
                ₹{therapist.sessionFee.toLocaleString("en-IN")}
              </span>
              <button
                type="button"
                onClick={next}
                disabled={!canContinue()}
                className="rounded-xl bg-primary px-7 py-3 text-sm font-medium text-white transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {state.step === 5 ? "Continue to Payment" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Summary Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-20">
          <BookingSummarySidebar state={state} therapist={therapist} />
        </div>
      </div>
    </div>
  );
}
