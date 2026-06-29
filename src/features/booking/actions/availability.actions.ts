"use server";

import { AvailabilityRepository } from "../repositories";
import type { BookingDate, TimeSlot } from "../types";

export async function getAvailableDates(
  therapistProfileId: string
): Promise<BookingDate[]> {
  return AvailabilityRepository.getAvailableDates(therapistProfileId);
}

export async function getAvailableSlots(
  therapistProfileId: string,
  date: string
): Promise<TimeSlot[]> {
  return AvailabilityRepository.getAvailableSlots(therapistProfileId, date);
}
