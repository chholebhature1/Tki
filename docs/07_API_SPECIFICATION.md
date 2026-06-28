# 07_API_SPECIFICATION.md

# TalkIndia

## API & Server Action Specification

Version: 1.0

Dependencies

* 01_PRODUCT_REQUIREMENTS.md
* 04_SYSTEM_ARCHITECTURE.md
* 06_USERS_AND_AUTH_SCHEMA.md
* 06.06_ROW_LEVEL_SECURITY_AND_AUTHORIZATION.md

---

# 1. Purpose

This document defines every backend operation available to the application.

TalkIndia uses:

* Next.js Server Actions
* Route Handlers (where required)
* Supabase Database
* Supabase Auth

The API specification exists to guarantee consistency.

---

# 2. Architecture

```text
React UI

↓

Server Action

↓

Validation (Zod)

↓

Service Layer

↓

Repository Layer

↓

Supabase

↓

Database
```

Client components never communicate directly with Supabase using business logic.

---

# 3. API Design Principles

Every operation must:

* Validate input
* Validate authentication
* Validate authorization
* Execute business rules
* Return predictable responses
* Log important events

---

# 4. Standard Response Format

Success

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully."
}
```

Failure

```json
{
  "success": false,
  "error": {
    "code": "BOOKING_CONFLICT",
    "message": "Selected time slot is no longer available."
  }
}
```

Never expose stack traces.

---

# 5. Authentication Module

## Register Patient

Action

createPatientAccount()

Input

* name
* email
* password
* phone

Validation

* email unique
* password strength
* phone format

Returns

* User
* Session

---

## Register Therapist

createTherapistAccount()

Input

* profile information
* license details
* password

Returns

Pending verification.

---

## Login

login()

Input

* email
* password

Returns

Authenticated session.

---

## Logout

logout()

Destroys session.

---

## Forgot Password

requestPasswordReset()

---

## Reset Password

resetPassword()

---

# 6. Profile Module

Get Profile

getProfile()

Update Profile

updateProfile()

Upload Avatar

uploadAvatar()

Delete Avatar

deleteAvatar()

---

# 7. Therapist Module

Search Therapists

searchTherapists(filters)

Supports

* Pagination
* Sorting
* Filtering

---

Get Therapist

getTherapist(slug)

---

Update Therapist Profile

updateTherapistProfile()

---

Submit Verification

submitVerification()

---

Get Availability

getAvailability()

---

Update Availability

updateAvailability()

---

# 8. Booking Module

Check Availability

getAvailableSlots(therapistId, date)

Returns dynamically generated slots for a specific therapist and date.
Excludes slots that are booked or locked.

---

Lock Slot

lockSlot(therapistId, date, startTime)

Creates a 5-minute slot lock. Returns lock ID.
Fails if slot is already locked or booked.

---

Create Booking

createAppointment(therapistId, date, startTime, consultationType, lockId)

Validation

* Lock exists and belongs to current user
* Slot still available
* Therapist approved
* User authenticated

Creates appointment with status `payment_pending`.

---

Confirm Booking (server-side only)

confirmAppointment(appointmentId, paymentId)

Called after Razorpay webhook verification.
Updates status to `confirmed`.
Creates video session.
Sends notification.

---

Cancel Appointment

cancelAppointment(appointmentId, reason)

---

Reschedule Appointment

rescheduleAppointment(appointmentId, newDate, newStartTime)

---

Appointment History

getAppointmentHistory()

---

Appointment Details

getAppointment(appointmentId)

---

# 9. Payment Module

Create Payment Attempt

createPaymentAttempt(appointmentId)

Creates a Razorpay order. Returns order ID and key for client-side checkout.
Only callable by the patient who owns the appointment.
Appointment must be in `payment_pending` status.

---

Verify Payment (Route Handler — server only)

POST `/api/webhooks/razorpay`

Razorpay sends webhook event after payment.

Steps:
1. Verify webhook signature using `razorpay_webhook_secret`.
2. Extract `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`.
3. Match to existing payment attempt via `gateway_order_id`.
4. If verified: create `payments` record, update appointment to `confirmed`, create video session, send notification.
5. If verification fails: log the event, do nothing.

This is idempotent — duplicate webhook calls do not create duplicate records (unique constraint on `gateway_payment_id`).

---

Client-Side Payment Callback

handlePaymentSuccess(paymentId, orderId, signature)

After Razorpay checkout modal closes with success:
1. Call a Server Action that verifies the payment signature server-side.
2. If valid: confirm appointment immediately (don't wait for webhook as a UX improvement).
3. Redirect to booking confirmation page.

Note: The webhook is the authoritative source. The client callback is a UX optimization.

---

Get Invoice

getInvoice(appointmentId)

Returns invoice for a confirmed/completed appointment.

---

Request Refund (Admin only)

processRefund(paymentId, amount, reason)

---

# 10. Video Module

Create Video Session (server-side, called during booking confirmation)

createVideoSession(appointmentId)

Called by BookingService after payment verification.
Creates a LiveKit room. Stores room_id, meeting_url, and host_url.

---

Get Meeting Details

getMeetingDetails(appointmentId)

Returns meeting URL for the participant.
Patient receives `meeting_url`. Therapist receives `host_url`.
Only available for `confirmed` appointments within the join window (15 min before start).

---

End Meeting

endMeeting(appointmentId)

Marks video session as `completed`.
Updates appointment status to `completed`.
Triggered by therapist or automatically after scheduled duration.

---

Record Attendance

recordAttendance(videoSessionId, userId)

Called when a participant joins. Records `joined_at` timestamp.
Updates `left_at` when participant leaves.

---

# 11. Review Module

Create Review

createReview(appointmentId, rating, comment)

Validation

* Appointment status must be `completed`
* Patient must own the appointment
* No existing review for this appointment
* Rating between 1-5

After insert: update `therapist_profiles.average_rating` and `total_reviews`.

---

Update Review

updateReview(reviewId, rating, comment)

Allowed only within 24 hours of creation.
Only the authoring patient can update.

---

Get Therapist Reviews

getTherapistReviews(therapistProfileId, page, pageSize)

Public. Returns paginated reviews for a therapist profile.

---

# 12. Notification Module

Get Notifications

getNotifications(page, pageSize)

Returns paginated notifications for the current user.
Sorted by `created_at` descending.

---

Mark Read

markNotificationRead(notificationId)

Sets `is_read = true` and `read_at = now()`.

---

Mark All Read

markAllNotificationsRead()

Marks all unread notifications for the current user as read.

---

Get Unread Count

getUnreadNotificationCount()

Returns the count of unread notifications (for badge display).

---

# 13. Support Module

Create Ticket

createSupportTicket()

---

Reply Ticket

replySupportTicket()

---

Close Ticket

closeSupportTicket()

---

# 14. Blog Module

List Articles

getBlogs()

---

Get Article

getBlog()

---

Admin

createBlog()

updateBlog()

publishBlog()

archiveBlog()

---

# 15. Admin Module

Approve Therapist

approveTherapist(therapistProfileId)

Updates verification status to `approved`.
Logs action in `audit_logs`.
Sends notification to therapist.

---

Reject Therapist

rejectTherapist(therapistProfileId, reason)

Updates verification status to `rejected` with reason.
Logs action in `audit_logs`.
Sends notification to therapist.

---

Dashboard Analytics

getDashboardAnalytics()

Returns: total patients, total therapists, total appointments, revenue this month.

---

Platform Settings

getPlatformSettings()

updatePlatformSetting(key, value)

Admin only.

---

# 16. Route Handlers

Route Handlers are used for external service callbacks that cannot use Server Actions.

## POST /api/webhooks/razorpay

Purpose: Receive payment confirmation from Razorpay.

Authentication: Razorpay webhook signature verification (not Supabase Auth).

Steps:
1. Read raw body
2. Verify signature with `RAZORPAY_WEBHOOK_SECRET`
3. Process payment event
4. Return 200 OK (or 400 if signature invalid)

## POST /api/webhooks/livekit (Future)

Purpose: Receive video session events from LiveKit.

For MVP, this is optional. Session end can be triggered manually by the therapist.

---

# 17. Pagination Standard

Every listing endpoint supports:

page

pageSize

sort

filters

Default page size: 10. Maximum: 50.

---

# 18. Validation

Every API must validate:

Authentication

Authorization

Input (Zod schema)

Business Rules

---

# 19. Error Codes

AUTH_REQUIRED

INVALID_INPUT

NOT_FOUND

FORBIDDEN

BOOKING_CONFLICT

PAYMENT_FAILED

PAYMENT_VERIFICATION_FAILED

THERAPIST_NOT_VERIFIED

SLOT_ALREADY_LOCKED

SERVER_ERROR

---

# 20. Idempotency

Required for:

Payment verification (webhook)

Booking confirmation

Duplicate requests must not create duplicate records.
Use unique constraints (`gateway_payment_id`, `appointment_id` on reviews, etc.).

---

# 21. Logging

Use `console.error` for unexpected errors in development.

In production (Vercel), logs are automatically captured.

Log:
- Payment events (success/failure)
- Authentication failures
- Webhook processing

Never log: passwords, tokens, full request bodies with sensitive data.

---

# 22. Acceptance Criteria

Every backend operation:

* Has Zod input validation
* Has authorization check
* Returns standardized `{ success, data/error }` response
* Handles errors gracefully
* Is idempotent where required

---

# 23. Kiro Implementation Notes

* Prefer Server Actions for authenticated operations.
* Use Route Handlers only for webhooks (`/api/webhooks/*`).
* Keep Server Actions thin — call services.
* Services contain business logic.
* Repositories handle Supabase queries only.
* Use shared Zod schemas for client + server validation.

---

# End of Document

# End of Document
