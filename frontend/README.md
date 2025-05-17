# Event Hub - Frontend

This directory contains the frontend application for Event Hub, a modern event management platform built with React, TypeScript, and Tailwind CSS.

## 📚 Table of Contents

- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Components](#components)
- [Routing](#routing)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Environment Variables](#environment-variables)
- [Build and Deployment](#build-and-deployment)
- [Best Practices](#best-practices)

## 🏗️ Architecture

The frontend is built using the following architecture:

- **View Layer**: React with functional components and hooks
- **State Management**: React Context API for global state, React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router v6 with protected routes
- **Form Handling**: React Hook Form with Zod validation
- **API Integration**: Custom HTTP client with Axios

## 📁 Project Structure

```
frontend/
├── public/             # Static files
│   ├── assets/         # Images and other assets
│   └── favicon.ico     # Favicon
├── src/
│   ├── assets/         # Local static assets
│   ├── components/     # Reusable components
│   │   ├── ui/         # UI components
│   │   ├── common/     # Common components
│   │   ├── events/     # Event-related components
│   │   └── admin/      # Admin-specific components
│   ├── contexts/       # React context providers
│   ├── hooks/          # Custom hooks
│   ├── layouts/        # Layout components
│   │   ├── main-layout.tsx   # Main layout for public pages
│   │   └── admin-layout.tsx  # Layout for admin pages
│   ├── lib/            # Utility libraries
│   │   └── api-client.ts     # API client
│   ├── pages/          # Page components
│   │   ├── admin/      # Admin pages
│   │   ├── auth/       # Authentication pages
│   │   ├── events/     # Event pages
│   │   └── user/       # User account pages
│   ├── services/       # API service modules
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main App component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── .env                # Environment variables (not committed)
├── .env.example        # Example environment variables
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## 📋 Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### `npm run build`

Builds the app for production to the `dist` folder.

### `npm run preview`

Serves the production build locally for previewing.

### `npm run lint`

Runs ESLint to check for code issues.

### `npm run format`

Formats code using Prettier.

## 🧩 Components

The application uses a component-based architecture with several types of components:

### UI Components

Built with shadcn/ui, these are the foundational UI elements:
- `Button`, `Input`, `Card`, `Dialog`, etc.
- Located in `src/components/ui/`

### Common Components

Shared components used throughout the application:
- `Header`, `Footer`, `Newsletter`, etc.
- Located in `src/components/common/`

### Feature Components

Components specific to features:
- `EventCard`, `BookingForm`, `CategoryFilter`, etc.
- Located in directories like `src/components/events/`

### Page Components

Full pages that are rendered by the router:
- `EventDetail`, `UserDashboard`, `AdminEvents`, etc.
- Located in `src/pages/`

### Layout Components

Components that provide layout structure:
- `MainLayout`, `AdminLayout`, etc.
- Located in `src/layouts/`

## 🔀 Routing

The application uses React Router v6 for routing:

- **Public Routes**: Accessible to all users
  - Home (`/`)
  - Events listing (`/events`)
  - Event detail (`/events/:id`)
  - Authentication (`/auth`)

- **Protected User Routes**: Require user authentication
  - User dashboard (`/user/dashboard`)
  - User profile (`/user/profile`)
  - Bookings (`/user/bookings`)

- **Admin Routes**: Require admin authentication
  - Admin dashboard (`/admin`)
  - Event management (`/admin/events`)
  - User management (`/admin/users`)

## 🧠 State Management

The application uses a combination of state management approaches:

### Local Component State

- Used for UI state that is only relevant to a specific component
- Implemented using React's `useState` hook

### Context API

- Used for shared state across multiple components
- Implemented in `src/contexts/`
- Main contexts:
  - `AuthContext`: User authentication state
  - `ThemeContext`: Theme preferences
  - `ToastContext`: Toast notifications

### React Query

- Used for server state management
- Handles data fetching, caching, and synchronization
- Implemented with custom hooks in `src/hooks/`

## 🔌 API Integration

API calls are made using a custom HTTP client built with Axios:

- Base client configuration in `src/lib/api-client.ts`
- Service modules in `src/services/` for different API endpoints
  - `AuthService`: Authentication endpoints
  - `EventsService`: Event-related endpoints
  - `BookingsService`: Booking-related endpoints
  - `UserService`: User-related endpoints

## 🔐 Environment Variables

The frontend uses environment variables for configuration:

```
VITE_API_URL=http://localhost:3000/api        # Backend API URL
VITE_APP_NAME="Event Hub"                     # Application name
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX         # Optional: Google Analytics ID
```

For local development:
- Create a `.env.local` file in the root directory
- Add your variables following the example above
- This file should be git-ignored

## 🚀 Build and Deployment

### Build Process

The build process is handled by Vite:
1. TypeScript is transpiled to JavaScript
2. CSS is processed by Tailwind
3. Code is bundled and minified
4. Assets are optimized
5. Output is generated in the `dist` directory

### Deployment

For deployment on Vercel:
1. Connect your GitHub repository
2. Set the root directory to `frontend/`
3. Configure the build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add the required environment variables
5. Deploy

## 💡 Best Practices

### Code Style

- Follow the [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- Use functional components with hooks
- Use TypeScript for type safety
- Follow the [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)

### Performance

- Use `React.memo()` for components that render often
- Avoid unnecessary re-renders
- Use React Query for efficient data fetching and caching
- Optimize images and assets
- Use code splitting with lazy loading

### Accessibility

- Use semantic HTML
- Include proper ARIA attributes
- Ensure keyboard navigation works
- Maintain good color contrast
- Test with screen readers

### Testing

For component testing:
- Unit tests with Vitest and React Testing Library
- Run tests with `npm test` 