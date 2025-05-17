# Event Hub


## 🚀 Live Demo

**Application URL:** [https://event-hub-demo.vercel.app](https://event-hub-demo.vercel.app)

**Admin Dashboard:** Use credentials admin@example.com / admin123 to explore admin features

## 📋 Overview

Event Hub is a comprehensive event management platform that allows users to discover, book, and manage events. The application features a modern UI, real-time updates, and a seamless booking experience.

### Key Features

- **Event Discovery**: Browse and search events by category, date, or location
- **User Authentication**: Secure login/registration with email verification
- **Booking System**: Book tickets for events with instant confirmation
- **User Dashboard**: Manage bookings, view past events, and save favorites
- **Admin Panel**: Comprehensive event and user management tools
- **Responsive Design**: Optimized for all devices from mobile to desktop

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API & React Query
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form with Zod validation

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh token rotation
- **API**: RESTful API with OpenAPI/Swagger documentation
- **File Storage**: AWS S3 (optional)
- **Email Service**: SendGrid for notifications

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- PostgreSQL database
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Event-Hub.git
   cd Event-Hub
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies (optional)
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` files in both frontend and backend directories:

   Backend `.env` example:
   ```
   # Database
   DATABASE_URL="postgresql://postgres:password@localhost:5432/ATC_01276772637"
   
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

   Frontend `.env` example:
   ```
   VITE_API_URL="http://localhost:3000/api"
   ```

4. **Initialize the database**
   ```bash
   # Create PostgreSQL database (if not already created)
   # Using psql:
   psql -U postgres -c "CREATE DATABASE eventhub"
   
   # From backend directory
   cd ../backend
   npx prisma migrate dev --name init
   npm run seed
   ```

5. **Start the development servers**
   ```bash
   # Start backend (from backend directory)
   npm run start:dev
   
   # Start frontend (from frontend directory, in another terminal)
   cd ../frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api/docs
   - Prisma Studio (database visualization): http://localhost:5555 (run with `npx prisma studio` from backend directory)


## 🔄 API Documentation

### Authentication
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| POST | `/auth/register` | Register a new user | `{ name, email, password }` | User object with token |
| POST | `/auth/login` | Login a user | `{ email, password }` | User object with token |
| POST | `/auth/verify-otp` | Verify OTP code | `{ email, otpCode }` | Success message |
| POST | `/auth/refresh` | Refresh access token | `{ refreshToken }` | New access token |
| GET | `/auth/profile` | Get current user profile | - | User object |

### Events
| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|-------------|----------|
| GET | `/events` | Get all events | `categoryId, tagIds, search, isFeatured, page, limit` | Array of events |
| GET | `/events/featured` | Get featured events | - | Array of events |
| GET | `/events/:id` | Get a single event | - | Event object |
| POST | `/events` | Create a new event (admin) | Event object | Created event |
| PATCH | `/events/:id` | Update an event (admin) | Updated fields | Updated event |
| DELETE | `/events/:id` | Delete an event (admin) | - | Success message |

### Bookings
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| GET | `/bookings/me` | Get user bookings | - | Array of bookings |
| GET | `/bookings/:id` | Get a booking | - | Booking object |
| POST | `/bookings` | Create a booking | `{ eventId, tickets, paymentMethod }` | Booking object |
| PATCH | `/bookings/:id` | Update a booking | `{ status }` | Updated booking |
| DELETE | `/bookings/:id` | Cancel a booking | - | Success message |

### Categories
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| GET | `/categories` | Get all categories | - | Array of categories |
| GET | `/categories/:id` | Get a category | - | Category object |
| POST | `/categories` | Create a category (admin) | `{ name, description, image }` | Category object |
| PATCH | `/categories/:id` | Update a category (admin) | Updated fields | Updated category |
| DELETE | `/categories/:id` | Delete a category (admin) | - | Success message |

### Tags
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| GET | `/tags` | Get all tags | - | Array of tags |
| GET | `/tags/:id` | Get a tag | - | Tag object |
| POST | `/tags` | Create a tag (admin) | `{ name }` | Tag object |
| PATCH | `/tags/:id` | Update a tag (admin) | `{ name }` | Updated tag |
| DELETE | `/tags/:id` | Delete a tag (admin) | - | Success message |

## 🧪 Testing Guide

### User Role Testing
1. **Register/Login**
   - Access the app and register a new account
   - Verify the email (OTP verification)
     - In development, you can find the OTP in the console log or use the development endpoint
     - In production, the OTP is sent via email
   - Login with your credentials

2. **Browse Events**
   - Explore featured events on the homepage
   - Use filters to find specific events by category or date
   - Search for events by name or location
   - Test the event discovery page with different filter combinations

3. **Event Booking**
   - View event details
   - Select ticket quantity (test various quantities)
   - Complete booking process
   - Review booking confirmation
   - Check that available seats decrease after booking
   - Test booking an event that's already at capacity
   - Test the booking limit per user (if applicable)

4. **User Dashboard**
   - View upcoming events in your dashboard
   - Cancel a booking
   - View past events
   - Test the booking status changes (confirmed, cancelled)
   - Verify booking details match what was selected

### Admin Role Testing
1. **Admin Access**
   - Login with admin credentials (admin@example.com / admin123)
   - Access the admin dashboard
   - Verify that regular users cannot access admin routes

2. **Event Management**
   - Create a new event
     - Fill in all required fields
     - Upload an event image
     - Set capacity, price, and other details
   - Edit an existing event
     - Change various fields and verify updates
   - Delete an event
     - Verify that associated bookings are handled correctly
   - Mark an event as featured/unfeatured
   - Check validation for required fields

3. **User Management**
   - View registered users
   - Search and filter users
   - View user booking history
   - Edit user roles (if applicable)

4. **Category and Tag Management**
   - Create new categories with images
   - Edit existing categories
   - Create and manage tags
   - Assign tags to events
   - Test category and tag filtering on frontend

## 📚 Additional Documentation

- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)
- [API Swagger Documentation](https://event-hub-demo.onrender.com/api/docs)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/yourusername/Event-Hub/issues).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is [MIT](./LICENSE) licensed.

## 👏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
