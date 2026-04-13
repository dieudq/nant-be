# Admin API Docs (Current State)

Tai lieu nay mo ta cac API lien quan den Admin theo code hien tai trong controllers.

## 1) Access model

- Auth: Bearer JWT (`Authorization: Bearer <token>`)
- Role enum: `ADMIN`, `WORKER`, `FAMILY`
- Admin-only routes dung `JwtAuthGuard + RolesGuard + @Roles(Role.ADMIN)`
- Co mot so route la "admin-relevant" (khong khoa role ADMIN, nhung Admin van dung de van hanh)

## 2) Admin-only APIs (implemented)

### Users

| Method | Path | Access | Req fields | Res fields | Status codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| GET | `/users` | ADMIN | Query: `page`, `limit` | `{ data: UserSummary[], meta: { total, page, lastPage } }` | `200`, `401`, `403` |
| GET | `/users/workers/pending` | ADMIN | None | `Worker[]` (include `user`) | `200`, `401`, `403` |
| POST | `/users/workers/:id/approve` | ADMIN | Param: `id` | `Worker` (updated `isApproved: true`) | `200`, `401`, `403`, `404` |
| POST | `/users/workers/:id/reject` | ADMIN | Param: `id` | `Worker` (deleted record) | `200`, `401`, `403`, `404` |

### Applications

| Method | Path | Access | Req fields | Res fields | Status codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PATCH | `/applications/:id/status` | ADMIN | Param: `id`; Body: `status` (`PENDING`/`REVIEWED`/`ACCEPTED`/`REJECTED`) | `JobApplication` (updated status) | `200`, `400`, `401`, `403`, `404` |

## 3) APIs admin co the dung de van hanh

> Cac route duoi day khong hoan toan khoa ADMIN-only nhung can cho trang Admin de monitor va support.

| Method | Path | Access hien tai | Req fields | Res fields | Status codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| GET | `/users/:id` | Auth | Param: `id` | `User` (include `worker`, `family`) | `200`, `401`, `404` |
| GET | `/users/workers/list` | Public | Query: `page`, `limit` | `{ data: Worker[], meta: { total, page, lastPage } }` | `200` |
| GET | `/users/workers/:id/documents` | Auth | Param: `id` | `WorkerDocument[]` | `200`, `401`, `404` |
| POST | `/users/workers/:id/documents` | Auth | Param: `id`; Body: `type`, `title`, `fileUrl`, `issuedAt?`, `expiresAt?`, `notes?` | `WorkerDocument` | `201`, `400`, `401`, `404` |
| POST | `/users/workers/:id/training-attempts` | Auth | Param: `id`; Body: `courseName`, `score` | `TrainingAttempt` | `201`, `400`, `401`, `404` |
| POST | `/users/workers/:id/interviews` | Auth | Param: `id`; Body: `familyId`, `scheduledAt`, `notes?` | `InterviewSession` | `201`, `400`, `401`, `404` |
| GET | `/families` | Public | Query: `page`, `limit` | `{ data: Family[], meta: { total, page, lastPage } }` | `200` |
| GET | `/families/:id` | Public | Param: `id` | `Family` (include `user`, `bookings`, `reviews`, `interviews`, `contracts`) | `200`, `404` |
| GET | `/families/job-postings` | Public | Query: `page`, `limit`, `status?` | `{ data: JobPosting[], meta: { total, page, lastPage } }` | `200` |
| GET | `/families/job-postings/:id` | Public | Param: `id` | `JobPosting` (include `family`, `applications`) | `200`, `404` |
| GET | `/families/job-postings/:id/recommended-workers` | Public | Param: `id`; Query: `limit?`, `includeApplied?`, `minScore?` | `{ jobPostingId, totalCandidates, includeApplied, minScore, data: RecommendedWorker[] }` | `200`, `404` |
| POST | `/families/job-postings/:id/close` | Auth | Param: `id` | `JobPosting` (updated `status: CLOSED`) | `200`, `401`, `404` |
| GET | `/applications/job-posting/:id` | ADMIN, FAMILY | Param: `id` | `JobApplication[]` (include `worker.user`, `worker.documents`, `worker.reviews`) | `200`, `401`, `403`, `404` |
| GET | `/applications/worker/:id` | Auth | Param: `id` | `JobApplication[]` (include `jobPosting.family.user`) | `200`, `401`, `404` |
| GET | `/applications/:id` | Auth | Param: `id` | `JobApplication` (include `worker.user`, `jobPosting.family.user`) | `200`, `401`, `404` |
| GET | `/bookings` | Public | Query: `page`, `limit` | `{ data: Booking[], meta: { total, page, lastPage } }` | `200` |
| GET | `/bookings/:id` | Public | Param: `id` | `Booking` (include `family.user`, `worker.user`, `payment`, `review`, `contract`, `shiftReport`) | `200`, `404` |
| POST | `/bookings/:id/confirm` | Auth | Param: `id` | `Booking` (updated `status: CONFIRMED`) | `200`, `401`, `404` |
| POST | `/bookings/:id/cancel` | Auth | Param: `id` | `Booking` (updated `status: CANCELLED`) | `200`, `401`, `404` |
| POST | `/bookings/:id/shift-report` | Auth | Param: `id`; Body: `activities`, `incidents?`, `handoverNotes?` | `ShiftReport` (upsert) | `201`, `400`, `401`, `404` |

## 4) Req/Res mau nhanh cho FE Admin

- `PATCH /applications/:id/status`
  - Req body: `{ "status": "ACCEPTED" }`
  - Res: `{ "id": 10, "status": "ACCEPTED", ... }`
- `GET /users`
  - Req query: `?page=1&limit=10`
  - Res: `{ "data": [...], "meta": { "total": 100, "page": 1, "lastPage": 10 } }`
- `GET /families/job-postings/:id/recommended-workers`
  - Req query: `?limit=10&includeApplied=false&minScore=40`
  - Res: `{ "jobPostingId": 1, "totalCandidates": 5, "data": [...] }`

## 5) Workflow admin (goi y)

1. Login admin qua `POST /auth/login`
2. Lay profile qua `GET /auth/me` de xac nhan role
3. Mo queue worker qua `GET /users/workers/pending`
4. Approve/reject qua `/users/workers/:id/approve` hoac `/users/workers/:id/reject`
5. Theo doi application qua `GET /applications/job-posting/:id`
6. Chot ket qua qua `PATCH /applications/:id/status`

## 6) Gaps cho admin roadmap (chua co API rieng)

- Payment dashboard/revenue API chua co module rieng
- Review moderation API chua co
- Contract management API chua co
- Audit log API chua co
- RBAC levels (`SUPER_ADMIN`, `OPS_ADMIN`, ...) chua co, hien tai chi co `ADMIN`

## 7) Ghi chu quan trong

- Co nhieu route dang de `Public`/`Auth` thay vi `Admin-only`.
- Neu su dung cho trang Admin production, nen bo sung ownership check va role guard chat hon cho tung route van hanh.

## 8) Error response format (tham chieu FE)

- Validation / bad request:
  - `{ "statusCode": 400, "message": ["..."], "error": "Bad Request" }`
- Unauthorized:
  - `{ "statusCode": 401, "message": "Unauthorized" }`
- Forbidden:
  - `{ "statusCode": 403, "message": "Forbidden resource" }`
- Not found:
  - `{ "statusCode": 404, "message": "... not found" }`

