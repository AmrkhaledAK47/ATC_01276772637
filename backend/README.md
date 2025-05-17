# Event Hub - Backend

This directory contains the backend application for Event Hub, a modern event management platform built with NestJS, TypeScript, and PostgreSQL.

## 📚 Table of Contents

- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Testing](#testing)
- [Best Practices](#best-practices)

## 🏗️ Architecture

The backend is built using the following architecture:

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based authentication with refresh tokens
- **API Documentation**: OpenAPI/Swagger
- **Testing**: Jest for unit and integration testing

## 📁 Project Structure

```
backend/
├── prisma/                  # Prisma schema and migrations
│   ├── schema.prisma        # Database schema definition
│   ├── migrations/          # Database migrations
│   └── seed.ts              # Database seeding script
├── src/
│   ├── app.module.ts        # Main application module
│   ├── main.ts              # Application entry point
│   ├── common/              # Common utilities, guards, decorators
│   │   ├── decorators/      # Custom decorators
│   │   ├── guards/          # Authentication guards
│   │   ├── exceptions/      # Custom exceptions
│   │   └── filters/         # Exception filters
│   ├── config/              # Configuration files
│   │   └── env.config.ts    # Environment configuration
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Authentication module
│   │   ├── users/           # Users module
│   │   ├── events/          # Events module
│   │   ├── bookings/        # Bookings module
│   │   ├── categories/      # Categories module
│   │   └── tags/            # Tags module
│   └── scripts/             # Utility scripts
│       └── seed.ts          # Data seeding script
├── test/                    # Test files
│   ├── e2e/                 # End-to-end tests
│   └── unit/                # Unit tests
├── .env                     # Environment variables (not committed)
├── .env.example             # Example environment variables
├── nest-cli.json            # NestJS CLI configuration
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

## 📋 Available Scripts

In the project directory, you can run:

### `npm run start:dev`

Runs the app in the development mode with hot-reload.

### `npm run build`

Builds the app for production to the `dist` folder.

### `npm run start:prod`

Starts the application in production mode.

### `npm run seed`

Seeds the database with initial data.

### `npm run test`

Runs tests using Jest.

### `npm run test:e2e`

Runs end-to-end tests.

### `npx prisma studio`

Opens the Prisma Studio database UI on [http://localhost:5555](http://localhost:5555).

## 🗄️ Database Schema

The database schema is defined in `prisma/schema.prisma`. Here's an overview of the main models:

### User
```prisma
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  name      String
  password  String
  avatar    String?
  role      UserRole  @default(USER)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  bookings  Booking[]
  events    Event[]   @relation("Organizer")

  @@map("users")
}
```

### Event
```prisma
model Event {
  id             String         @id @default(uuid())
  title          String
  description    String
  date           DateTime
  time           String
  location       String
  price          Float
  image          String?
  capacity       Int
  availableSeats Int
  isFeatured     Boolean        @default(false)
  categoryId     String
  organizerId    String
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
  category       Category       @relation(fields: [categoryId], references: [id])
  organizer      User           @relation("Organizer", fields: [organizerId], references: [id])
  tags           TagsOnEvents[]
  bookings       Booking[]

  @@map("events")
}
```

### Booking
```prisma
model Booking {
  id            String        @id @default(uuid())
  userId        String
  eventId       String
  tickets       Int
  totalPrice    Float
  status        BookingStatus @default(CONFIRMED)
  paymentStatus PaymentStatus @default(COMPLETED)
  paymentMethod PaymentMethod
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  user          User          @relation(fields: [userId], references: [id])
  event         Event         @relation(fields: [eventId], references: [id])

  @@map("bookings")
}
```

### Category
```prisma
model Category {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  image       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  events      Event[]

  @@map("categories")
}
```

### Tag
```prisma
model Tag {
  id        String         @id @default(uuid())
  name      String         @unique
  events    TagsOnEvents[]
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt

  @@map("tags")
}
```

## 🚀 API Endpoints

The API follows RESTful principles. Here are the main endpoints:

### Auth Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| POST | `/auth/register` | Register a new user | `{ name, email, password }` | User object with token |
| POST | `/auth/login` | Login a user | `{ email, password }` | User object with token |
| POST | `/auth/verify-otp` | Verify OTP code | `{ email, otpCode }` | Success message |
| POST | `/auth/refresh` | Refresh access token | `{ refreshToken }` | New access token |
| GET | `/auth/profile` | Get current user profile | - | User object |

### Events Endpoints

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|-------------|----------|
| GET | `/events` | Get all events | `categoryId, tagIds, search, isFeatured, page, limit` | Array of events |
| GET | `/events/featured` | Get featured events | - | Array of events |
| GET | `/events/:id` | Get a single event | - | Event object |
| POST | `/events` | Create a new event | Event object | Created event |
| PATCH | `/events/:id` | Update an event | Updated fields | Updated event |
| DELETE | `/events/:id` | Delete an event | - | Success message |

### Bookings Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| GET | `/bookings` | Get all bookings (admin) | `status, userId, eventId` | Array of bookings |
| GET | `/bookings/me` | Get user bookings | - | Array of bookings |
| GET | `/bookings/:id` | Get a booking | - | Booking object |
| POST | `/bookings` | Create a booking | `{ eventId, tickets, paymentMethod }` | Booking object |
| PATCH | `/bookings/:id` | Update a booking | Updated fields | Updated booking |
| DELETE | `/bookings/:id` | Cancel a booking | - | Success message |

### Categories Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| GET | `/categories` | Get all categories | - | Array of categories |
| GET | `/categories/:id` | Get a category | - | Category object |
| POST | `/categories` | Create a category | `{ name, description, image }` | Category object |
| PATCH | `/categories/:id` | Update a category | Updated fields | Updated category |
| DELETE | `/categories/:id` | Delete a category | - | Success message |

### Tags Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| GET | `/tags` | Get all tags | - | Array of tags |
| GET | `/tags/:id` | Get a tag | - | Tag object |
| POST | `/tags` | Create a tag | `{ name }` | Tag object |
| PATCH | `/tags/:id` | Update a tag | `{ name }` | Updated tag |
| DELETE | `/tags/:id` | Delete a tag | - | Success message |

## 🔑 Authentication

The application uses JWT-based authentication:

1. **Registration Process**:
   - User registers with email and password
   - An OTP is generated and sent to the user's email (simulated in development)
   - User verifies email with OTP before gaining full access

2. **Login Process**:
   - User logs in with email and password
   - Server returns an access token and a refresh token
   - Access token is short-lived (15-60 minutes)
   - Refresh token is long-lived (7-30 days) and stored securely

3. **Request Authorization**:
   - Protected routes require a valid JWT in the `Authorization` header
   - Format: `Authorization: Bearer <token>`
   - JWT is verified and decoded to authenticate the user

4. **Role-Based Access Control**:
   - Routes can be protected with role guards
   - Three roles: `USER`, `ORGANIZER`, and `ADMIN`
   - Admin routes are protected with `@Roles(UserRole.ADMIN)` decorator

## 🔐 Environment Variables

The backend requires the following environment variables:

```
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/eventhub"

# Authentication
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="15m"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_REFRESH_EXPIRATION="7d"

# App
PORT=3000
FRONTEND_URL="http://localhost:5173"

# Email (optional for full functionality)
SENDGRID_API_KEY="your-sendgrid-api-key"
EMAIL_FROM="noreply@yourdomain.com"
```

For local development:
- Create a `.env` file in the root directory
- Add your variables following the example above
- This file should be git-ignored

## 🌩️ Deployment

### Deploying to Render

1. Create a Render account at [render.com](https://render.com)
2. Set up a new Web Service:
   - Connect to your GitHub repository
   - Set the Root Directory to `backend/`
   - Set the Build Command: `npm install && npm run build`
   - Set the Start Command: `npm run start:prod`
3. Add the required environment variables
4. Create a PostgreSQL database from the Render dashboard
5. Set `DATABASE_URL` to the internal connection string provided by Render
6. Deploy the service

### Database Migrations on Deployment

For Render and similar platforms:
1. Add a build script in `package.json`:
   ```json
   "scripts": {
     "prebuild": "npx prisma generate",
     "build": "nest build",
     "postbuild": "npx prisma migrate deploy"
   }
   ```
2. This ensures that Prisma Client is generated and migrations are applied during deployment

## 🧪 Testing

The application includes both unit and integration tests using Jest:

### Unit Tests
- Test individual components in isolation
- Located in `test/unit/`
- Run with `npm test`

### E2E Tests
- Test complete API endpoints and flows
- Located in `test/e2e/`
- Run with `npm run test:e2e`

### Test Database
For E2E tests, the application can use:
- A test PostgreSQL database
- An in-memory SQLite database via Prisma

## 💡 Best Practices

### Code Style

- Follow the NestJS style guide
- Use dependency injection pattern
- Create small, focused modules
- Write meaningful comments
- Document public APIs

### Security

- Validate all inputs with DTO classes and class-validator
- Use bcrypt for password hashing
- Implement rate limiting for authentication routes
- Set appropriate CORS settings
- Use secure HTTP headers

### Performance

- Use database indexes for frequently queried fields
- Implement caching for expensive operations
- Use connection pooling for database connections
- Optimize database queries with proper relation loading

### Error Handling

- Use NestJS exception filters for centralized error handling
- Return appropriate HTTP status codes
- Include meaningful error messages
- Log errors with appropriate severity levels 