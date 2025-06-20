# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a property listing application built with SolidJS, TypeScript, and Mapbox GL JS. The application allows users to search for properties to rent or buy, view them on an interactive map, and filter results based on various criteria.

## Technical Stack

- **Framework**: SolidJS with TypeScript
- **Map Library**: Mapbox GL JS
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Package Manager**: pnpm (but npm/yarn also work)

## Development Commands

- `npm run dev` or `npm start` - Start development server on port 3000
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run serve` - Preview production build

## Project Architecture

- **Entry Point**: `src/index.tsx` - renders the main App component
- **Main App**: `src/App.tsx` - main application component with routing
- **Components**: Modular components in `src/components/` organized by feature
- **Pages**: Page components in `src/pages/`
- **Types**: TypeScript interfaces and types in `src/types/`
- **Utils**: Utility functions in `src/utils/`
- **Styling**: Tailwind CSS for styling with component-specific CSS modules when needed

## Key Configuration

- **TypeScript**: Strict mode enabled with SolidJS JSX transform
- **Environment Variables**: Use `VITE_` prefix for client-side env vars (e.g., `VITE_MAPBOX_ACCESS_TOKEN`)
- **Port**: Development server runs on port 3000
- **Build Target**: ESNext for modern JavaScript features

## Development Guidelines

- Use TypeScript for all new files (.tsx for components, .ts for utilities)
- Follow existing component patterns and naming conventions
- Keep components small and focused on a single responsibility
- Use SolidJS reactive primitives (createSignal, createMemo, createEffect)
- Implement proper error boundaries and loading states
- Ensure mobile responsiveness with Tailwind CSS
- Add proper TypeScript types for all props and state

## Testing

Currently no testing framework is set up. When implementing tests:
- Use Vitest for unit tests (integrates well with Vite)
- Consider Solid Testing Library for component tests

## Environment Setup

Create a `.env` file in the project root:
```
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

## Current Implementation Status

See PROJECT_PLAN.md for the detailed implementation roadmap and current progress.