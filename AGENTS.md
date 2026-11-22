# AGENTS.md - Weight on Space / Astronomy App

## Project Direction

This project is evolving from a planet-weight calculator into a mobile-first astronomy app. New features should prioritize daily astronomical content (events, APOD, Moon/planet visibility), clear educational value, and smooth visual interaction.

## Tech Stack

- **Vue 3** with Composition API and `<script setup lang="ts">`
- **TypeScript** for app code
- **Vite** for dev/build
- **Vue Router** for navigation
- **Pinia** preferred for new state management; migrate Vuex incrementally if present
- **Sass** for styles
- **Vitest** + **Vue Test Utils** for unit/component tests
- **ESLint** for linting

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run test
```

## Workflow

For every task/feature:

1. Create a branch named `feature/<task>` before changing code.
2. Implement the feature with focused commits.
3. Add or update tests for the functionality.
4. Run relevant checks (`lint`, `test`, `build`) and verify the affected UI flow.
5. Report branch, changes, checks, and remaining risks.

## Architecture

Use a feature-oriented structure:

```text
src/
  app/                # App shell, router, global providers/plugins
  assets/             # Static assets
  features/           # Feature modules (UI + composables + local types)
    astronomy/
    planets/
    weight-calculator/
  shared/             # Reusable cross-feature code
    components/       # Generic UI components
    composables/      # Generic composables
    services/         # API clients, HTTP wrappers
    types/            # Shared TypeScript types
    utils/            # Pure helpers
    styles/           # Global styles, tokens, mixins
  tests/              # Test setup/helpers when needed
```

### Guidelines

- **Feature-first**: keep feature-specific components, composables, and types close to the feature. Move code to `shared/` only when reused.
- **Composition API**: prefer composables for reusable logic; avoid large components with mixed responsibilities.
- **Typed boundaries**: type API responses, component props/emits, composable returns, and store state.
- **Services**: isolate external API calls in `shared/services` or feature services; components should not call `axios/fetch` directly.
- **State**: keep state local when possible. Use a store for cross-feature or persisted state.

## Vue + TypeScript Best Practices

- Use `<script setup lang="ts">` for components.
- Define props/emits with typed macros (`defineProps`, `defineEmits`).
- Avoid `any`; prefer explicit interfaces/types.
- Keep components small and presentational where possible; move data/loading logic to composables.
- Use `computed` for derived values; avoid mutating props.
- Handle loading, empty, and error states for async data.
- Prefer accessible semantic HTML, labels, keyboard support, and visible focus.

## Mobile-First & UI

- Design mobile-first, then scale up with breakpoints.
- Touch targets should be comfortable (minimum ~44px).
- Avoid horizontal overflow; test at narrow widths (360px).
- Use animations purposefully: subtle transitions, reveal-on-load, and state changes. Respect `prefers-reduced-motion`.
- Keep visual style cohesive: space/astronomy theme, readable contrast, clear hierarchy.
- Optimize images and lazy-load heavy content where appropriate.

## Testing

- Add tests for new logic, composables, and critical UI behavior.
- For bug fixes, add a regression test when feasible.
- Manual UI checks must include mobile viewport and key interaction flow.
- Do not mark work complete without running tests/checks relevant to the change.

## API & Secrets

- Do not hardcode secrets. Use environment variables for API keys.
- Provide graceful fallback/mock data when external APIs are unavailable.
- Cache or throttle external requests where sensible.