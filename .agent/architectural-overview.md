# Architectural Overview

## Hybrid Next.js Application

- **Pages Router** (`src/pages/`): Primary routing for most content
- **App Router** (`src/app/`): Used for authentication routes and webhooks
- Static Site Generation (SSG) with Incremental Static Regeneration (ISR)
- Dynamic routes built on-demand with `fallback: "blocking"`

## Key Architectural Patterns

### Data Fetching

- `getPageProps` wrapper provides standardized error handling and ISR configuration
- Three main data sources: Sanity CMS, Curriculum API 2023, and Educator API
- GraphQL with code generation for type safety
- ISR revalidation controlled by `sanityRevalidateSeconds` config

### State Management

- Context-based architecture with specialized providers:
  - `AnalyticsProvider`: Event tracking and analytics
  - `CookieConsentProvider`: GDPR compliance
  - `MenuProvider`, `ToastProvider`, `SaveCountProvider`: UI state
- Authentication via Clerk with middleware protection

### Styling

- Styled Components with Oak Design System (`@oaknational/oak-components`)
- Theme provider with Oak brand tokens
- Global styles in `src/styles/`

### Content Structure

- Curriculum hierarchy: Programme → Unit → Lesson
- Separate views for teachers and pupils
- Key stages, subjects, and year groups organization

### Directory Structure

```text
src/
├── pages/              # Next.js Pages Router routes
├── app/                # Next.js App Router (auth & webhooks)
├── components/         # React components organized by domain
│   ├── AppComponents/
│   ├── CurriculumComponents/
│   ├── TeacherComponents/
│   └── SharedComponents/
├── node-lib/          # Server-side utilities and API clients
├── browser-lib/       # Client-side utilities and services
├── context/           # React Context providers
├── hooks/             # Custom React hooks
└── utils/             # Shared utilities
```

### Testing Structure

- Unit tests live next to the code they test
- Page tests in `src/__tests__/pages/` (mirroring src/pages)
- Component tests use `*.test.tsx` pattern
- Test utilities in `src/__tests__/__helpers__/`

### Important Configuration Files

- `next.config.ts`: Next.js configuration with webpack customizations
- `oak-config/`: Environment-specific configuration system
- `.env.example`: Template for local environment variables
- `src/middleware.ts`: Next.js middleware for auth and routing

### External Services Integration

- **Clerk**: Authentication and user management
- **Sanity**: Content management system
- **PostHog**: Product analytics
- **Bugsnag**: Error tracking
- **HubSpot**: Forms and CRM
- **Mux**: Video streaming
- **Cloudinary**: Image optimization
