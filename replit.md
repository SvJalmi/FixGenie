# FixGenie - AI-Powered Code Error Analysis Platform

## Overview

FixGenie is a comprehensive code analysis platform that combines AI-powered error detection with text-to-speech capabilities. The application analyzes code across multiple programming languages, identifies errors and improvement opportunities, and provides voice explanations for better understanding.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom FixGenie dark theme
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Code Editor**: Monaco Editor with custom theming and error highlighting

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Middleware**: Express middleware for request logging and error handling
- **Development**: Hot reload with Vite middleware integration

### Database & ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations
- **Storage**: In-memory storage fallback for development

## Key Components

### Code Analysis Engine
- **Primary Service**: OpenAI GPT-4o integration for intelligent code analysis
- **Error Detection**: Multi-type error identification (syntax, logical, runtime, semantic)
- **Severity Classification**: Error, warning, and info level categorization
- **Fix Suggestions**: Actionable code improvements and corrections

### Text-to-Speech Integration
- **Provider**: Murf AI TTS service
- **Voice Options**: Multiple voice personalities and languages
- **Audio Controls**: Playback speed, volume, and download functionality
- **Real-time Generation**: On-demand audio explanation creation

### Multi-Language Support
- **Supported Languages**: 30+ programming languages across 5 categories
  - Compiled: C, C++, C#, Java, Fortran, ALGOL, COBOL, Visual Basic, Smalltalk
  - Interpreted: Python, Ruby, Perl, Pascal, Lisp, BASIC, APL
  - Scripting: PHP, VBScript, PowerShell, Bash, R, Lua
  - Markup: HTML, XML, XHTML, SGML
  - Functional: Haskell, F#, Scala, Erlang, Elixir, Clojure
- **Monaco Integration**: Language-specific syntax highlighting and IntelliSense

### User Interface Components
- **Code Editor**: Full-featured Monaco editor with error markers
- **Error Panel**: Detailed error analysis with fix suggestions
- **Voice Player**: Audio playback controls with progress tracking
- **Sidebar**: Language selection, voice settings, and recent analyses
- **Floating Actions**: Voice commands and help accessibility

## Data Flow

1. **Code Input**: User writes or pastes code in Monaco editor
2. **Analysis Request**: Code sent to backend analysis endpoint
3. **AI Processing**: OpenAI analyzes code and returns structured error data
4. **Database Storage**: Analysis results stored with user association
5. **UI Update**: Frontend displays errors with visual indicators
6. **Voice Generation**: On-demand TTS generation via Murf API
7. **Audio Playback**: Generated audio served and played in browser

## External Dependencies

### AI Services
- **OpenAI API**: GPT-4o model for code analysis
- **Murf AI**: Text-to-speech generation service

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection**: @neondatabase/serverless driver

### Development Tools
- **Replit Integration**: Development environment optimization
- **Monaco Editor**: Microsoft's code editor (VS Code engine)
- **Cartographer**: Replit's development tooling

### UI Framework
- **Radix UI**: Headless component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide Icons**: Consistent icon library

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite development server with Express backend
- **Environment Variables**: API keys and database URLs
- **TypeScript**: Full type checking and compilation

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: esbuild bundles Node.js server code
- **Serving**: Express serves both API and static files

### Environment Configuration
- **Database**: PostgreSQL via DATABASE_URL environment variable
- **API Keys**: OpenAI and Murf API credentials via environment variables
- **Build Targets**: Separate client and server build processes

### Session Management
- **Storage**: connect-pg-simple for PostgreSQL session store
- **Authentication**: Placeholder user system (userId: 1)
- **State Persistence**: Query caching with TanStack Query

The application is designed as a full-stack TypeScript application with clear separation between frontend and backend concerns, leveraging modern development practices and AI services for an enhanced code analysis experience.