# Galactica Leaderboard Application

## Overview

This is a full-stack web application featuring a space-themed leaderboard system built with React, Express, and PostgreSQL. The application displays user rankings with reputation points, levels, and daily changes in an elegant, interactive interface with animated stardust backgrounds.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration for development and production
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Type Safety**: Full TypeScript coverage with strict configuration

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon serverless PostgreSQL
- **API Design**: RESTful endpoints with JSON responses
- **Development**: Hot reloading with tsx and Vite integration

### Data Storage
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle with type-safe schema definitions
- **Migrations**: Drizzle Kit for database schema management
- **Development Fallback**: In-memory storage class for development/testing

## Key Components

### Database Schema
- **leaderboard_users table**: Core entity storing user data
  - Primary key with UUID generation
  - Username, wallet address (unique), reputation points
  - Level, daily change tracking, avatar representation
  - Timestamps for created/updated tracking

### API Endpoints
- `GET /api/leaderboard` - Retrieve ranked users with optional filtering and search
- `GET /api/users/search` - Search users by query string
- `GET /api/stats` - Get network statistics and aggregated data

### Frontend Components
- **LeaderboardTable**: Main data display with ranking, avatars, and stats
- **FilterBar**: Time period filtering and search functionality
- **StardustBackground**: Animated canvas particle system
- **UI Components**: Comprehensive shadcn/ui component library

### Authentication & Authorization
- Currently no authentication system implemented
- Wallet address used as unique identifier
- Public API endpoints without access control

## Data Flow

1. **Client Request**: React components trigger API calls via TanStack Query
2. **Server Processing**: Express routes handle requests and validate parameters
3. **Data Access**: Storage layer (Drizzle ORM or memory store) processes queries
4. **Response**: JSON data returned with proper error handling
5. **UI Update**: React Query manages caching and UI state updates

### Query Management
- Automatic background refetching disabled for performance
- Infinite stale time for static leaderboard data
- Error boundaries for graceful failure handling

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Query)
- Express.js with TypeScript support
- Drizzle ORM with PostgreSQL driver

### UI/UX Dependencies
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography
- Custom animations and particle systems

### Development Dependencies
- Vite for fast development and building
- TypeScript for type safety
- ESBuild for server-side bundling
- Replit-specific development tools

### Database Dependencies
- @neondatabase/serverless for PostgreSQL connection
- Drizzle Kit for migrations and schema management
- Connection pooling handled by Neon

## Deployment Strategy

### Development Mode
- Vite dev server with HMR for frontend
- tsx for TypeScript execution with hot reload
- In-memory storage for rapid development
- Replit integration with live preview

### Production Build
- Frontend: Vite build outputs to `dist/public`
- Backend: ESBuild bundles server to `dist/index.js`
- Database: Production PostgreSQL via environment variables
- Static file serving through Express

### Environment Configuration
- `DATABASE_URL` required for PostgreSQL connection
- `NODE_ENV` determines development vs production behavior
- Replit-specific environment variables for platform integration

### Scaling Considerations
- Serverless-ready architecture with Neon PostgreSQL
- Stateless server design for horizontal scaling
- Client-side caching reduces database load
- Optimized bundle sizes for fast loading