# Nant-BE Client API Documentation (Updated)

This document is aligned with currently implemented NestJS controllers.

---

## 1. General

- Base URL (local): `http://localhost:3000`
- Swagger: `http://localhost:3000/api/docs`
- Auth header: `Authorization: Bearer <access_token>`

### Enums

| Enum | Values |
| :--- | :--- |
| Role | `ADMIN`, `WORKER`, `FAMILY` |
| JobType | `BABYSITTING`, `NANNY`, `MAID` |
| VerificationStatus | `PENDING`, `APPROVED`, `REJECTED` |
| WorkerDocumentType | `ID_CARD_LEVEL_2`, `HEALTH_CERT`, `ENGLISH_CERT`, `CPR_CERT`, `REFERENCE_LETTER`, `INTRO_VIDEO`, `PROFILE_PHOTO`, `OTHER` |
| JobPostingStatus | `OPEN`, `CLOSED`, `FILLED` |
| ApplicationStatus | `PENDING`, `REVIEWED`, `ACCEPTED`, `REJECTED` |
| BookingStatus | `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `NO_SHOW` |

---

## 2. Authentication

### `POST /auth/register`
Register account.

Body:
```json
{
  "email": "family@example.com",
  "password": "StrongPassword123!",
  "name": "Family Name",
  "phone": "0901234567",
  "role": "FAMILY"
}
```

### `POST /auth/login`
Login and receive token.

Body:
```json
{
  "email": "family@example.com",
  "password": "StrongPassword123!"
}
```

### `POST /auth/google/callback` (Recommended)
Google login endpoint for FE. FE obtains `idToken` from Google SDK, then sends it to backend for verification.

Body:
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...",
  "role": "WORKER"
}
```

Notes:
- `idToken`: required
- `role`: optional, only used on first login when user does not exist yet
- supported values: `WORKER`, `FAMILY` (if omitted, backend defaults to `WORKER`)

Success response (`200`):
```json
{
  "access_token": "<jwt_token>",
  "user": {
    "id": 12,
    "email": "worker@example.com",
    "name": "Worker A",
    "role": "WORKER"
  }
}
```

Common error responses:
- `401 Invalid Google token`
- `401 Google email is not verified`
- `401 Google token audience mismatch`
- `401 Google token does not contain email`

### `GET /auth/google/callback` (Legacy - Deprecated)
Legacy query mode for backward compatibility only. New FE integrations should use `POST /auth/google/callback`.

Query example:
`/auth/google/callback?idToken=<google_id_token>&role=WORKER`

### `GET /auth/me` (Auth)
Get current user from token.

### FE integration flow (Google)
1. FE logs user in with Google and gets `idToken`.
2. FE calls `POST /auth/google/callback` with JSON body.
3. FE stores `access_token` from response.
4. FE includes `Authorization: Bearer <access_token>` for protected APIs.

---

## 3. Users / Workers

### `GET /users/:id` (Auth)
Get user detail (includes worker/family relation if available).

### `GET /users/workers/list`
Get approved workers (paginated).

Query:
- `page` (default `1`)
- `limit` (default `10`)

### `POST /users/workers/profile` (Auth)
Create worker profile for current logged-in user.

### `POST /users/workers/:id/documents` (Auth)
Create worker document metadata.

Body:
```json
{
  "type": "ID_CARD_LEVEL_2",
  "title": "National ID",
  "fileUrl": "https://storage.example.com/id.jpg",
  "issuedAt": "2026-01-01T00:00:00Z",
  "expiresAt": "2036-01-01T00:00:00Z",
  "notes": "Verified copy"
}
```

### `GET /users/workers/:id/documents` (Auth)
Get worker documents.

### `POST /users/workers/:id/training-attempts` (Auth)
Submit training score.

Body:
```json
{
  "courseName": "Basic Safety",
  "score": 95
}
```

### `POST /users/workers/:id/interviews` (Auth)
Create interview session.

Body:
```json
{
  "familyId": 1,
  "scheduledAt": "2026-05-20T09:00:00Z",
  "notes": "2:1 interview"
}
```

### Admin-only worker endpoints
- `GET /users` (Auth + `ADMIN`)
- `GET /users/workers/pending` (Auth + `ADMIN`)
- `POST /users/workers/:id/approve` (Auth + `ADMIN`)
- `POST /users/workers/:id/reject` (Auth + `ADMIN`)

---

## 4. Families / Job Postings

### `GET /families`
List families (paginated).

### `GET /families/:id`
Get family detail.

### `POST /families` (Auth)
Create family profile manually.

Body:
```json
{
  "userId": 1,
  "passportNumber": "B1234567",
  "currentAddress": "123 Street, District 1",
  "numChildren": 2,
  "childrenAges": "2 years, 5 years"
}
```

### `GET /families/job-postings`
List job postings (paginated).

Query:
- `page` (default `1`)
- `limit` (default `10`)
- `status` (`OPEN` | `CLOSED` | `FILLED`)

### `GET /families/job-postings/:id`
Get job posting detail.

Response: full `JobPosting` with nested `family` and `applications`.

Example response:
```json
{
  "id": 12,
  "familyId": 3,
  "title": "Need Nanny for Toddler",
  "description": "Full-day care",
  "jobType": "BABYSITTING",
  "location": "Ho Chi Minh City",
  "hourlyRateMin": 80000,
  "hourlyRateMax": 120000,
  "status": "OPEN",
  "family": {
    "id": 3,
    "user": {
      "name": "Family A",
      "email": "family@example.com",
      "phone": "0901234567"
    }
  },
  "applications": [
    {
      "id": 101,
      "workerId": 20,
      "status": "PENDING",
      "worker": {
        "id": 20,
        "user": {
          "name": "Worker A",
          "email": "worker@example.com"
        }
      }
    }
  ]
}
```

### `POST /families/job-postings` (Auth + `FAMILY`)
Create job posting. Backend takes family ownership from JWT user.

Notes:
- `familyId` is not required in body.
- If family profile does not exist, backend auto-creates it by JWT user.

Body (minimal):
```json
{
  "title": "Need Nanny for Toddler",
  "description": "Looking for someone energetic",
  "jobType": "BABYSITTING",
  "location": "Ho Chi Minh City"
}
```

Body (with optional fields):
```json
{
  "title": "Need Nanny for Toddler",
  "description": "Looking for someone energetic",
  "jobType": "BABYSITTING",
  "location": "Ho Chi Minh City",
  "numChildren": 1,
  "childrenAges": "2 years",
  "hourlyRateMin": 80000,
  "hourlyRateMax": 120000,
  "startDate": "2026-06-01T00:00:00Z",
  "endDate": "2026-06-30T00:00:00Z",
  "startTime": "08:00",
  "endTime": "17:00",
  "requirements": "Non-smoker, CPR preferred",
  "familyProfile": {
    "passportNumber": "B1234567",
    "currentAddress": "123 Street, District 1",
    "numChildren": 1,
    "childrenAges": "2 years",
    "allergies": "Peanut allergy",
    "specialInstructions": "No TV after 8PM",
    "specialRequirements": "Need basic English communication"
  }
}
```

### `POST /families/job-postings/:id/close` (Auth)
Set job posting status to `CLOSED`.

### `GET /families/job-postings/:id/recommended-workers`
Get suggested workers for a specific job posting.

Query:
- `limit` (default `10`, min `1`, max `50`)
- `includeApplied` (`true`/`false`, default `false`)
- `minScore` (default `0`, min `0`, max `120`)

Example:
`GET /families/job-postings/12/recommended-workers?limit=8&includeApplied=false&minScore=40`

Example response:
```json
{
  "jobPostingId": 12,
  "totalCandidates": 2,
  "includeApplied": false,
  "minScore": 40,
  "data": [
    {
      "workerId": 20,
      "userId": 15,
      "name": "Worker A",
      "email": "worker.a@example.com",
      "phone": "0901234567",
      "jobTypes": ["BABYSITTING"],
      "rating": 4.8,
      "reviewCount": 12,
      "hourlyRate": 100000,
      "dailyRate": 850000,
      "nonSmoker": true,
      "hasReliableTransportation": true,
      "trainingPassed": true,
      "score": 87,
      "scoreBreakdown": {
        "jobType": 40,
        "rate": 20,
        "trust": 20,
        "training": 10,
        "rating": 14,
        "requirements": 5
      }
    }
  ]
}
```

---

## 5. Applications

### `POST /applications` (Auth)
Worker applies for a job posting.

Body:
```json
{
  "jobPostingId": 1,
  "workerId": 5,
  "coverLetter": "I am interested because..."
}
```

### `GET /applications/job-posting/:id` (Auth + `ADMIN`)
Get all applications by job posting.

### `GET /applications/worker/:id` (Auth)
Get all applications by worker.

### `GET /applications/:id` (Auth)
Get one application detail.

### `PATCH /applications/:id/status` (Auth + `ADMIN`)
Update application status.

Body:
```json
{
  "status": "ACCEPTED"
}
```

---

## 6. Bookings

### `GET /bookings`
Get bookings list (paginated).

### `GET /bookings/:id`
Get booking detail.

### `POST /bookings` (Auth)
Create booking.

Body:
```json
{
  "familyId": 1,
  "workerId": 5,
  "date": "2026-05-20T00:00:00Z",
  "startTime": "08:00",
  "endTime": "17:00",
  "duration": 9,
  "service": "BABYSITTING",
  "rate": 100000,
  "notes": "Please come 10 minutes early"
}
```

### `POST /bookings/:id/confirm` (Auth)
Confirm booking.

### `POST /bookings/:id/cancel` (Auth)
Cancel booking.

### `POST /bookings/:id/shift-report` (Auth)
Create or update shift report.

Body:
```json
{
  "activities": "Played games, fed lunch",
  "incidents": "None",
  "handoverNotes": "Baby slept at 11 AM"
}
```

---

## 7. Pagination / Errors

Paginated response shape:
```json
{
  "data": [],
  "meta": {
    "total": 100,
    "page": 1,
    "lastPage": 10
  }
}
```

Validation error shape:
```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

---

## 8. Not Available Yet (Do Not Call)

These are not exposed in controller routes yet:

- `GET /families/job-postings/:id/matching-candidates`

If FE needs suggestion nanny now, use `GET /users/workers/list` as temporary source.

