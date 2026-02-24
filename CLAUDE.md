# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Grocy Meal Planning is an Angular 21 SPA with a Node.js API server that provides a drag-and-drop meal planning interface for [Grocy](https://grocy.info/). Users connect to their own Grocy instance via URL + API key (stored in localStorage or passed as query params). All data stays in the browser — no backend database.

## Commands

```bash
# Development (Angular dev server + API server on ports 4200 and 3001)
npm run dev

# Angular dev server only
npm start

# API server only (port 3001, proxied via /api in dev)
npm run dev:api

# Production build (output: dist/grocy-meal-planning/browser/)
npm run build

# Tests (Karma + Jasmine)
npm test

# Extract i18n keys
npm run i18n:extract

# Version bump (generates changelog from conventional commits)
npm run version:patch   # or version:minor, version:major
```

**Note:** `npm install` requires `--legacy-peer-deps` (configured in `.npmrc`). Node 22 required.

## Architecture

### Module-Based Angular (Non-Standalone)

The app uses Angular's traditional module system (`AppModule` in `app.module.ts`), **not** standalone components. All components are declared in the root module.

### State Management

RxJS BehaviorSubjects and Observables — no NgRx or other store library. State lives in `AppComponent` and flows down via `@Input/@Output`. Key observables: `recipes$`, `mealPlan$`, `mealPlanSections$`.

### Key Services

- **`grocy.service.ts`** — HTTP wrapper for all Grocy API calls (recipes, meals, sections). Uses config from `AppConfigService`.
- **`appconfig.service.ts`** — Reads Grocy URL/API key from query params or localStorage.
- **`recipe-import.service.ts`** — Imports recipes from external URLs using a **Strategy pattern** with fallback chain: JSON-LD → RSC JSON-LD → Chefkoch HTML → Picnic HTML → Meta Tags. Strategies live in `services/recipe-strategies/`.
- **`dark-mode.service.ts`** — Theme management using Angular Signals.

### API Server (`server/`)

A Nuxt Nitro server in the `server/` subdirectory on port 3001 with two endpoints:
- `GET /api/fetch-recipe?url=<url>` — Fetches recipe HTML (host allowlist: chefkoch.de, picnic.app)
- `GET /api/fetch-image?url=<url>` — Proxies images with CORS headers

Server routes live in `server/server/api/`, shared utils in `server/server/utils/`. In development, Angular's proxy config (`proxy.conf.json`) routes `/api/*` to localhost:3001.

### Routing

Single route: `/:weekNumber` — the week number drives the calendar view. All navigation is week-based.

### Styling

Tailwind CSS 4.1 + SCSS. Custom `w-1/7` utility for 7-day grid columns. Angular Material for UI components.

### Internationalization

Transloco with two languages: English (`en`) and German (`de`). Translation files in `src/assets/i18n/`. Default language detected from browser.

## Conventions

- **Conventional commits** required (enforced by commitizen config in `.cz-config.js`). CI auto-generates changelog and release notes from commit messages.
- **Change detection:** Components use `OnPush` strategy.
- **Component location:** `src/app/_components/`
- **Pipes location:** `src/app/_pipes/`
- **Interfaces location:** `src/app/interfaces/`
- **Environment versions** (`src/environments/environment*.ts`) are auto-updated by the release workflow — don't manually edit version strings.
