# Galaktik Mission Control

A recruiter-facing React portfolio project built as a polished sci-fi operations dashboard. Galaktik Mission Control is designed to present the kind of frontend work you would expect in a product team environment: routed views, reusable UI systems, persistent local state, keyboard-first interactions, responsive layouts, and motion used with intent.

## At a glance

- Built with React, Vite, React Router, GSAP, and custom CSS
- Designed as a multi-page product demo, not a static landing page
- Includes dashboard, registry, detail, settings, notification, and command workflows
- Demonstrates reusable component architecture and client-side state orchestration
- Uses LocalStorage for preferences, command history, notifications, and scenario persistence
- Includes accessibility-minded interactions such as skip links, keyboard shortcuts, dialogs, focus handling, and reduced-motion support

## Why this project is portfolio-ready

This project was built to show more than visual design. It demonstrates:

- Component-driven UI architecture
- Real list/detail flows across multiple routes
- Practical state management in a medium-sized frontend
- Search and command palette interaction design
- Modal systems and overlay orchestration
- Persistent local state without backend complexity
- Theming and alert-state UI variations
- Thoughtful motion and transition work
- A branded concept translated into a believable product interface

## Screenshots

### Launch overlay

The experience opens on a branded mission-access screen to establish tone and frame the app like a product, not just a page load.

![Mission access overlay](README-assets/overlay-launch.png)

### Dashboard overview

The primary dashboard combines metrics, mission focus, resource tracking, crew summaries, and live operations into a single command surface.

![Mission control dashboard](README-assets/dashboard-overview.png)

### Mission registry

The mission registry demonstrates searchable/filterable data views, status styling, and the app's broader list/detail workflow.

![Mission registry](README-assets/mission-registry.png)

### Mission dossier

Mission detail pages expose objectives, budget, timeline progression, and direct mission status controls.

![Mission detail](README-assets/mission-detail.png)

### Explorer roster

The roster page extends the system beyond dashboards into a more operational people-focused workflow with reusable explorer cards.

![Explorer roster](README-assets/crew-roster.png)

### Crew dossier

Crew detail pages connect explorer identity, mission context, and certifications into dedicated profile views.

![Crew dossier](README-assets/crew-dossier.png)

### Control deck

The floating control deck provides compact access to navigation, settings, simulations, and session actions.

![Control deck](README-assets/control-deck.png)

### Command palette

The command palette supports keyboard-first routing and action dispatch across missions, crew, settings, and simulations.

![Command palette](README-assets/search-palette.png)

### Notification log

The notification log complements transient toasts with a persistent operational history view.

![Notification log](README-assets/notification-log.png)

## Key product features

### Mission Control Dashboard

- Sector overview with derived status metrics
- Priority mission spotlight cards
- Resource reserve meters
- Assigned explorer preview cards
- Unified live operations feed with filter controls

### Mission workflows

- Mission registry with search and filtering
- Dynamic mission detail routes
- Mission creation modal
- Mission editing modal
- Status progression and timeline controls

### Crew workflows

- Explorer roster view
- Dynamic crew dossier routes
- Crew creation modal
- Direct crew editing on dossier pages
- Hide/restore dataset controls

### Global interaction systems

- Branded launch overlay
- Floating control deck
- Simulation command panel
- Search and command palette
- Persistent notification log
- Toast notification system
- Theme and accessibility settings

## Skills demonstrated

### Frontend architecture

- Clear separation between shell, pages, shared state, data modules, and presentational components
- Reusable interface primitives such as cards, badges, feeds, meters, and modals
- Route-based composition with shared application chrome

### State management

- Shared application state managed through context
- Scenario-based data mutation for missions, crew, notifications, and alert mode
- Persistent preferences and UI state stored in LocalStorage

### UX and interaction design

- Keyboard shortcuts for command access
- Focus-aware overlays and dialogs
- Hover, reveal, and transition systems that support product feel
- Alert-mode and theme-driven UI variation

### Accessibility considerations

- Skip link to main content
- Dialog semantics and `aria` labeling
- Reduced-motion support
- Keyboard-friendly interaction flows
- Focus restoration and input auto-focus in key workflows

## Tech stack

- React 18
- Vite 5
- React Router DOM 6
- GSAP
- Custom CSS with CSS variable-based theming
- LocalStorage for lightweight persistence

## Routes

- `/`
  Main dashboard with metrics, missions, resources, crew preview, and live operations.
- `/missions`
  Mission registry with filters and creation flow.
- `/missions/:missionId`
  Mission dossier with objectives, timeline, resource budget, and status controls.
- `/crew`
  Explorer roster with dataset management.
- `/crew/:memberId`
  Explorer dossier with assignment context and edit flow.

## Project structure

```text
src/
  components/
  context/
  data/
  lib/
  pages/
  theme/
```

Notable areas:

- `src/components`
  Shared UI building blocks and interaction surfaces
- `src/context/AlertModeContext.jsx`
  Central shared state for alert mode, preferences, notifications, and data updates
- `src/data/galaktik`
  Split mock data modules for missions, crew, activity, metrics, resources, and scenario presets
- `src/pages`
  Routed product screens

## Local setup

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Notes on scope

This project is intentionally frontend-focused. It does not include:

- Backend APIs
- Authentication
- Database persistence
- Realtime networking
- Full automated test coverage

Those tradeoffs are intentional so the demo can stay focused on frontend product execution, interface quality, and interaction design.

## Suggested portfolio description

> A React-based sci-fi operations dashboard focused on reusable UI architecture, responsive design, persistent local state, and polished product-style interactions.

## Recruiter summary

If you are reviewing this project quickly, the main signal is this:

This is a frontend product demo that goes beyond static visuals. It shows the ability to structure a medium-sized React app, build coherent routed flows, manage shared UI state, design polished interactions, and turn a brand concept into a usable application experience.
