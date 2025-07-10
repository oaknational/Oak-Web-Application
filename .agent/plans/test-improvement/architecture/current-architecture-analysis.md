# Current Architecture Analysis

## Overview

This document analyzes the current architectural patterns in the Oak Web Application codebase to inform the architecture planning phase of the test improvement initiative.

## 1. Service Layer Patterns

### Current State

- **Limited Service Layer**: The codebase shows minimal use of traditional service layer patterns
- **Analytics Service**: `useAnalyticsService.ts` is the primary example of a service pattern implementation
- **API Client Pattern**: Instead of services, the app uses an API client pattern with `curriculum-api-2023`

### Key Findings

- No dedicated business logic services
- Business logic is embedded within components and API query functions
- Limited separation of concerns between UI and business logic

## 2. Data Fetching Patterns

### Primary Patterns

1. **Server-Side Data Fetching**
   - Uses Next.js `getStaticProps` and `getServerSideProps`
   - GraphQL client for curriculum API (`curriculum-api-2023/sdk.ts`)
   - Centralized API configuration with auth headers

2. **Client-Side Data Fetching**
   - SWR (Stale-While-Revalidate) for client-side data fetching
   - Custom hooks: `useFetch`, `useGetEducatorData`, `useSignedVideoToken`
   - Error handling with custom `OakError` class

### API Architecture

```
src/node-lib/curriculum-api-2023/
├── sdk.ts                    # GraphQL client configuration
├── index.ts                  # API method aggregation
├── queries/                  # Individual query implementations
└── generated/sdk.ts         # Generated GraphQL SDK
```

## 3. Component Architecture

### Large Components Analysis

#### SubjectPhasePicker (1,468 lines)

- **Location**: `src/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker.tsx`
- **Characteristics**:
  - Monolithic component handling multiple responsibilities
  - Complex state management with `useState`, `useTransition`
  - Inline styled components
  - Mixed presentation and business logic
  - No clear separation of concerns

#### Flex.deprecated

- **Status**: Marked as deprecated
- **Replacement**: `OakFlex` from `@oaknational/oak-components`
- **Usage**: Still widely used throughout the codebase

### Component Organization

- Components organized by type (SharedComponents, TeacherComponents, etc.)
- Mix of old and new component patterns
- Gradual migration to Oak Components library

## 4. Error Handling Patterns

### Current Implementation

1. **Error Boundaries**
   - `ErrorBoundary.tsx` with Bugsnag integration
   - Fallback UI for unhandled errors
   - Conditional error reporting based on user consent

2. **API Error Handling**
   - Custom `OakError` class for structured errors
   - Error wrapping in data fetching hooks
   - Inconsistent error handling across different parts of the app

3. **Issues Identified**
   - No centralized error handling strategy
   - Limited error recovery mechanisms
   - Inconsistent error reporting

## 5. State Management

### Current Patterns

- Local component state with React hooks
- No global state management solution (Redux, Zustand, etc.)
- Context API for specific features (Analytics, Auth)
- Server state management with SWR

## 6. Testing Implications

### Current Challenges

1. **Tight Coupling**: Components tightly coupled with business logic
2. **Large Components**: Difficult to test in isolation
3. **API Dependencies**: Direct API calls in components
4. **Side Effects**: Mixed concerns make testing complex

### Opportunities

1. Extract business logic into testable services
2. Create smaller, focused components
3. Implement dependency injection patterns
4. Separate data fetching from presentation

## 7. Recommendations for Architecture Improvements

### High Priority

1. **Service Layer Implementation**
   - Create dedicated service modules for business logic
   - Implement repository pattern for data access
   - Separate API concerns from UI components

2. **Component Decomposition**
   - Break down large components like SubjectPhasePicker
   - Extract reusable logic into custom hooks
   - Implement container/presenter pattern

3. **Error Handling Strategy**
   - Centralized error handling service
   - Consistent error boundaries
   - Better error recovery mechanisms

### Medium Priority

1. **State Management**
   - Evaluate need for global state management
   - Implement proper data flow patterns
   - Consider server state caching strategies

2. **Testing Infrastructure**
   - Mock service layer for easier testing
   - Component testing utilities
   - Integration test patterns

### Low Priority

1. **Complete migration to Oak Components**
2. **Remove deprecated components**
3. **Optimize bundle size with code splitting

## Next Steps

1. Create detailed service layer design
2. Define component architecture patterns
3. Establish error handling guidelines
4. Create migration strategy for large components
