# Nanny Marketplace MVP Mapping

## Capability Status

- Candidate onboarding: Partial -> Added document/training/interview data models and APIs.
- Family onboarding: Partial -> Added passport/address/children detail fields in schema.
- Booking operations: Have (basic) -> Added post-shift report endpoint.
- Compliance and legal: Partial -> Added contract/acceptance and verification data models.
- Payments: Partial -> Added payment breakdown model for platform fee + worker payout.

## Requirement to Data Mapping

| Requirement                               | Existing | Added in this round                                                          |
| ----------------------------------------- | -------- | ---------------------------------------------------------------------------- |
| CCCD level 2 / health cert / certificates | None     | `WorkerDocument`, `WorkerDocumentType`                                       |
| Reference checks                          | None     | `WorkerReference`                                                            |
| Intro video and profile photo             | None     | `Worker.introVideoViUrl`, `Worker.introVideoEnUrl`, `Worker.profilePhotoUrl` |
| Training test >= 80% pass                 | None     | `TrainingAttempt`, `Worker.trainingPassed`                                   |
| 2:1 interview workflow                    | None     | `InterviewSession`                                                           |
| Legal contract and acceptance             | None     | `Contract`, `ContractAcceptance`                                             |
| Post-shift report                         | None     | `ShiftReport` + `/bookings/:id/shift-report`                                 |
| 30% platform fee tracking                 | None     | `PaymentBreakdown`                                                           |

## New API Endpoints (MVP)

- `POST /workers/:id/documents`
- `GET /workers/:id/documents`
- `POST /workers/:id/training-attempts`
- `POST /workers/:id/interviews`
- `POST /bookings/:id/shift-report`

## Notes

- Prisma migration is still required after schema update.
- Existing APIs remain compatible; new tables are additive.
