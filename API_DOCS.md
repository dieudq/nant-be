# Backend API Documentation

## Authentication Endpoints

### POST /auth/register
Register new user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "worker@example.com",
    "password": "password123",
    "name": "Linh Nanny",
    "phone": "+84 98 765 4321",
    "role": "WORKER"
  }'
```

### POST /auth/login
Login user
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "worker@example.com",
    "password": "password123"
  }'
```

### GET /auth/me
Get current user (requires JWT)
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Workers Endpoints

### GET /workers
Get all approved workers
```bash
curl http://localhost:3000/workers
```

### GET /workers/:id
Get worker by ID
```bash
curl http://localhost:3000/workers/1
```

### POST /workers
Create worker profile (requires JWT)
```bash
curl -X POST http://localhost:3000/workers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": 1,
    "languages": ["English B2", "Vietnamese"],
    "services": ["Babysitting", "House Help"],
    "hourlyRate": 250000,
    "dailyRate": 3500000,
    "availability": ["Monday", "Tuesday", "Wednesday"]
  }'
```

### GET /workers/pending
Get pending worker approvals (requires JWT)
```bash
curl -X GET http://localhost:3000/workers/pending \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### POST /workers/:id/approve
Approve worker (requires JWT)
```bash
curl -X POST http://localhost:3000/workers/1/approve \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### POST /workers/:id/reject
Reject worker (requires JWT)
```bash
curl -X POST http://localhost:3000/workers/1/reject \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Families Endpoints

### GET /families
Get all families
```bash
curl http://localhost:3000/families
```

### GET /families/:id
Get family by ID
```bash
curl http://localhost:3000/families/1
```

### POST /families
Create family profile (requires JWT)
```bash
curl -X POST http://localhost:3000/families \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": 2,
    "numChildren": 2,
    "childrenAges": "3 years, 6 years",
    "specialRequirements": "Allergy to peanuts"
  }'
```

---

## Bookings Endpoints

### GET /bookings
Get all bookings
```bash
curl http://localhost:3000/bookings
```

### GET /bookings/:id
Get booking by ID
```bash
curl http://localhost:3000/bookings/1
```

### POST /bookings
Create booking (requires JWT)
```bash
curl -X POST http://localhost:3000/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "familyId": 1,
    "workerId": 1,
    "date": "2026-04-10T14:00:00Z",
    "startTime": "14:00",
    "endTime": "17:00",
    "duration": 3,
    "service": "Babysitting",
    "rate": 250000
  }'
```

### POST /bookings/:id/confirm
Confirm booking (requires JWT)
```bash
curl -X POST http://localhost:3000/bookings/1/confirm \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### POST /bookings/:id/cancel
Cancel booking (requires JWT)
```bash
curl -X POST http://localhost:3000/bookings/1/cancel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Users Endpoints

### GET /users
Get all users (requires JWT)
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### GET /users/:id
Get user by ID (requires JWT)
```bash
curl -X GET http://localhost:3000/users/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Test Flow

1. **Register Worker**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "worker1@test.com",
    "password": "password123",
    "name": "Linh Nanny",
    "role": "WORKER"
  }'
```

2. **Register Family**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "family1@test.com",
    "password": "password123",
    "name": "John Family",
    "role": "FAMILY"
  }'
```

3. **Login & Get Token**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "worker1@test.com",
    "password": "password123"
  }'
```
Copy the `access_token` from response

4. **Create Worker Profile**
```bash
curl -X POST http://localhost:3000/workers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer COPIED_TOKEN" \
  -d '{
    "userId": 1,
    "languages": ["English B2"],
    "services": ["Babysitting"],
    "hourlyRate": 250000,
    "dailyRate": 3500000
  }'
```

---

## Response Examples

### Success Response
```json
{
  "id": 1,
  "email": "worker@example.com",
  "name": "Linh Nanny",
  "role": "WORKER",
  "createdAt": "2026-04-07T23:25:00Z"
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "User already exists",
  "error": "Bad Request"
}
```

---

## Status Codes

- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

---

## Running Backend

```bash
# Install dependencies
npm install

# Setup database
npx prisma migrate deploy

# Run server
npm run start:dev

# Server runs on http://localhost:3000
```

---

## Environment Variables

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/nanny_marketplace_db"
JWT_SECRET="your-super-secret-key-change-in-production"
NODE_ENV="development"
PORT=3000
```
