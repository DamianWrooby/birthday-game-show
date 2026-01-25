# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Birthday Game Show is a mobile-first Angular web app featuring a trivia game show experience with a scratch card reward mechanic. Users answer three trivia questions sequentially and upon completion, reveal a hidden airplane ticket image through a touch-based scratch card interface.

## Build and Run Commands

```bash
npm install
ng serve              # Development server (typically http://localhost:4200)
ng build              # Production build
ng build --watch      # Build with file watching
ng test               # Run unit tests
ng e2e                # Run end-to-end tests
```

## Architecture

### Screen Flow
Welcome Screen → Question Screen #1 → Question Screen #2 → Question Screen #3 → Reward Screen

- Navigation uses Angular routing
- Wrong answers show hints and allow unlimited retries (no game-over state)
- Each screen triggers distinct audio playback

### Key Technical Components

**Scratch Card Mechanic:**
- Implemented via HTML canvas element
- Touch gestures remove an opaque layer to reveal hidden image beneath
- Must support continuous touch rendering (not button-triggered)
- Target: 90% revealable via scratching

**Audio System:**
- Each screen plays a distinct audio file
- Must handle mobile browser autoplay policies (may require one-time user gesture)
- Audio should not block UI interactions

### Directory Structure (Target)
```
src/
  app/
    components/     # Reusable UI components
    screens/        # Route-level screen components
    services/       # Audio, game state services
  assets/           # Images, audio files, ticket JPG
  styles/           # Global styles
```

### Configuration-Driven Design
The following must be configurable without modifying component logic:
- Questions, answers, and correct answer keys (structured data/JSON)
- Audio file paths per screen
- Ticket image path
- Number of questions (flow adapts dynamically)

## Design Requirements

- Mobile-first, portrait orientation
- Cartoonish visual style (colorful, friendly)
- Game show studio aesthetic for question screens
- Large, high-contrast tappable buttons
- No horizontal scrolling
