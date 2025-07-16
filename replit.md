# LCD Media Center - Project Documentation

## Overview

This is a retro-style LCD media center application built with React and Express. The application simulates a vintage hardware device with an LCD screen interface, providing functionality for photo viewing, MP3 playback, and simple games. It features a distinctive dark theme with green LCD-style text and hardware-inspired UI elements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom LCD/retro theme
- **UI Components**: Radix UI primitives via shadcn/ui
- **Routing**: Wouter for client-side routing
- **State Management**: React hooks with TanStack Query for server state
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **File Storage**: In-memory storage with base64 encoding for media files
- **Session Management**: Express sessions with PostgreSQL store
- **API Style**: RESTful JSON API

## Key Components

### Frontend Components
- **MediaCenter**: Main application hub with LCD-style interface
- **PhotoGallery**: Image viewer with navigation controls
- **Mp3Player**: Audio player with playlist management
- **GameCenter**: Simple games including Snake
- **HardwarePanel**: Hardware status indicators and controls

### Backend Components
- **Storage Layer**: Abstract interface with in-memory implementation
- **Media API**: File upload, retrieval, and deletion endpoints
- **Game Scores**: Score tracking and leaderboards

### Database Schema
- **media_files**: Stores uploaded images and audio files
- **game_scores**: Tracks game achievements and high scores

## Data Flow

1. **File Upload**: Files are uploaded via multipart form data, converted to base64, and stored in database
2. **Media Retrieval**: Files are served as data URIs from database storage
3. **Game Scoring**: Scores are posted to backend and stored in PostgreSQL
4. **Real-time Updates**: TanStack Query manages cache invalidation and updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **multer**: File upload middleware

### UI/UX Dependencies
- **class-variance-authority**: Utility for component variants
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel/slider functionality
- **lucide-react**: Icon library

## Deployment Strategy

### Development
- Uses Vite dev server with HMR for frontend
- Express server with TypeScript compilation via tsx
- Replit-specific plugins for development environment

### Production Build
- Frontend: Vite builds to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- Database: Drizzle migrations in `migrations/` directory

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Separate development and production build processes
- TypeScript configuration supports both client and server code

## Recent Changes (July 16, 2025)

### Fixed Game Bugs
- **Snake Game**: Fixed direction handling, collision detection, and game loop timing
- **Added Pong Game**: Implemented classic Pong with AI opponent and physics
- **Added Tetris Game**: Full implementation with all 7 tetrominoes, line clearing, and level progression
- **Game Controls**: Added WASD support alongside arrow keys for better accessibility
- **High Scores**: Added persistent scoring system with leaderboard display

### Enhanced User Experience
- **Animations**: Added glow effects, flicker animations, and smooth transitions
- **System Monitor**: New section showing simulated CPU, RAM, temperature, and uptime
- **Menu Navigation**: Improved keyboard navigation with joystick simulation
- **Visual Polish**: Enhanced LCD aesthetic with scan lines and CRT-style effects

### Technical Improvements
- **TypeScript Fixes**: Resolved multer and React import issues
- **Performance**: Optimized game rendering with proper cleanup and intervals
- **Code Quality**: Added useCallback hooks and proper dependency management
- **File Upload**: Fixed FormData handling for image and audio file uploads

### Latest Updates (July 16, 2025 - 4:00 PM)
- **MP3 Player Controls**: Fixed progress bar to be clickable for seeking
- **Keyboard Navigation**: Added full keyboard controls for all components
- **Pong Responsiveness**: Increased paddle speed from 5 to 15 for better gameplay
- **Volume Control**: Added mouse wheel support for hardware panel volume
- **Photo Gallery**: Fixed useEffect import error and added keyboard navigation

## Deployment Options

### GitHub Pages
- Static deployment option available
- Requires conversion to client-side only storage
- See DEPLOYMENT.md for full instructions

### VS Code Development
- Full-stack development environment
- Requires Node.js 18+ and npm install
- Uses Vite dev server with Express backend

## Key Design Decisions

### Storage Strategy
- **Problem**: Need to store and serve media files
- **Solution**: Base64 encoding in PostgreSQL with data URI serving
- **Rationale**: Simplifies deployment and eliminates need for separate file storage service
- **Trade-offs**: Higher database storage usage but improved portability

### UI Theme
- **Problem**: Create distinctive retro aesthetic
- **Solution**: Custom LCD-inspired color scheme with green text on dark background
- **Rationale**: Matches hardware device concept and provides unique visual identity

### State Management
- **Problem**: Coordinate client-server state and caching
- **Solution**: TanStack Query for server state, React hooks for local state
- **Rationale**: Provides optimistic updates, cache management, and error handling

### Database ORM
- **Problem**: Type-safe database operations
- **Solution**: Drizzle ORM with PostgreSQL
- **Rationale**: Better TypeScript integration than traditional ORMs while maintaining SQL transparency