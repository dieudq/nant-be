# Nanny Marketplace Backend

NestJS + Prisma + PostgreSQL

## Environment Setup

Create `.env` file:

```
DATABASE_URL="postgresql://user:password@localhost:5432/nanny_marketplace_db"
JWT_SECRET="your-secret-key-here"
NODE_ENV="development"
PORT=3000
```

## Installation

```bash
npm install
```

## Database Setup

```bash
# Create PostgreSQL database
createdb nanny_marketplace_db

# Run Prisma migrations
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

## Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Project Structure

```
src/
├── auth/           # Authentication module
├── users/          # User management
├── workers/        # Worker profiles
├── families/       # Family profiles
├── bookings/       # Booking management
├── payments/       # Payment processing
├── reviews/        # Review & ratings
├── messages/       # Messaging
├── app.module.ts   # Main module
└── main.ts         # Entry point

prisma/
├── schema.prisma   # Database schema
└── migrations/     # Database migrations
```

## API Endpoints (To Be Implemented)

### Auth
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- GET /auth/me

### Users
- GET /users/:id
- PATCH /users/:id
- DELETE /users/:id

### Workers
- GET /workers
- GET /workers/:id
- POST /workers
- PATCH /workers/:id
- GET /workers/:id/availability
- GET /workers/:id/reviews

### Families
- GET /families/:id
- POST /families
- PATCH /families/:id

### Bookings
- GET /bookings
- POST /bookings
- GET /bookings/:id
- PATCH /bookings/:id
- DELETE /bookings/:id

### Payments
- POST /payments/initiate
- POST /payments/confirm
- GET /payments/:id/status

### Reviews
- GET /reviews/:workerId
- POST /reviews
- PATCH /reviews/:id
- DELETE /reviews/:id

### Messages
- GET /messages
- POST /messages
- GET /messages/:conversationId

## Database Schema

### Key Models
- **User**: Base user entity (email, name, phone, role)
- **Worker**: Nanny/helper profile (languages, services, rates, availability)
- **Family**: Family profile (children info, preferences)
- **Booking**: Booking transaction (family-worker-service-date-time-rate)
- **Payment**: Payment info (amount, method, status, transaction ID)
- **Review**: Rating & comment (1-5 stars, text)
- **Message**: Direct messaging between users

## Status

✅ Project Setup
✅ Prisma Schema Created
⏳ Modules Implementation (pending)
⏳ Authentication (pending)
⏳ API Endpoints (pending)

## Next Steps

1. Create auth module with JWT
2. Generate Prisma client and migrations
3. Implement user module
4. Implement worker module
5. Implement booking module
6. Add payment integration
7. Add WebSocket for messaging
8. Add unit tests
