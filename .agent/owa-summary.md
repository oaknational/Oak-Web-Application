# A Summary of the Oak Web Application

A comprehensive overview of the Oak Web Application, its intentions, tech stack, architecture, how it works, and how to develop it.

## Table of Contents

- [A Summary of the Oak Web Application](#a-summary-of-the-oak-web-application)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
    - [Purpose and Mission](#purpose-and-mission)
    - [Target Audience](#target-audience)
    - [Key Features](#key-features)
  - [Technical Architecture](#technical-architecture)
    - [Tech Stack](#tech-stack)
    - [Codebase Structure](#codebase-structure)
    - [Data Flow](#data-flow)
    - [State Management](#state-management)
    - [API Integration](#api-integration)
  - [UI Architecture](#ui-architecture)
    - [Component Structure](#component-structure)
    - [Styling Approach](#styling-approach)
    - [Accessibility](#accessibility)
  - [Development Workflow](#development-workflow)
    - [Development Environment Setup](#development-environment-setup)
    - [Testing Strategy](#testing-strategy)
    - [CI/CD Pipeline](#cicd-pipeline)
    - [Deployment Strategy](#deployment-strategy)
  - [Current Challenges](#current-challenges)
    - [Code Maintenance](#code-maintenance)
    - [Performance](#performance)
    - [Scalability](#scalability)
  - [Improvement Opportunities](#improvement-opportunities)
    - [Enhanced Modularity](#enhanced-modularity)
    - [Dependency Injection](#dependency-injection)
    - [Code Reusability](#code-reusability)
    - [Module Extraction](#module-extraction)
  - [Best Practices Roadmap](#best-practices-roadmap)
    - [SOLID Principles Implementation](#solid-principles-implementation)
    - [Enhanced Type Safety](#enhanced-type-safety)
    - [Automated Testing](#automated-testing)
    - [Documentation](#documentation)
  - [Conclusion](#conclusion)

## Project Overview

### Purpose and Mission

The Oak Web Application (OWA) serves as the frontend for Oak National Academy, a platform providing educational content and resources to teachers and pupils in the UK. It aims to deliver high-quality, curriculum-aligned resources that support teaching and learning in various subject areas.

The platform was developed to make educational resources more accessible, with a particular focus on delivering a seamless experience for both teachers and students. The application provides features like lesson viewing, curriculum browsing, and educational content discovery.

### Target Audience

The application serves two primary user groups:

- **Teachers**: Seeking resources, lesson plans, and teaching materials
- **Pupils**: Accessing learning content, lessons, and educational materials

### Key Features

Currently, the application offers:

- Curriculum-aligned lessons and resources
- Video content with transcripts
- Interactive learning materials
- Search functionality for educational content
- Teacher resources and support materials
- Pupil-focused learning paths

## Technical Architecture

### Tech Stack

The Oak Web Application is built with a modern JavaScript/TypeScript stack:

**Current Implementation:**

- **Framework**: Next.js (React-based framework)
- **Language**: TypeScript (98.6% of codebase)
- **Styling**: Styled Components
- **State Management**: React Context API
- **Data Fetching**: SWR, native fetch API
- **Testing**: Jest, React Testing Library
- **Component Documentation**: Storybook
- **CMS Integration**: Sanity (via GraphQL)
- **Authentication**: Clerk
- **Media**: Mux Player for video content
- **Analytics**: PostHog
- **Deployment**: Netlify (with Incremental Static Regeneration)

**Improvement Opportunities:**

- Adopt a state management library with better scalability (Redux Toolkit, Zustand, or Jotai)
- Implement stronger GraphQL typing with codegen
- Move to a more modular styling approach like CSS Modules or Tailwind CSS
- Enhance testing framework with Playwright for E2E tests

### Codebase Structure

The codebase follows a feature-oriented structure, with some aspects of domain-driven design:

**Current Implementation:**

```shell
/src
  /app                 # App Router components (newer Next.js features)
  /pages               # Next.js page components (page router)
  /components          # UI components organized by domain
    /TeacherComponents # Teacher-specific components
    /PupilComponents   # Pupil-specific components
    /SharedComponents  # Shared components
  /context             # React Context providers
  /hooks               # Custom React hooks
  /utils               # Utility functions
  /node-lib            # Server-side code
  /common-lib          # Shared code between client and server
  /browser-lib         # Browser-specific code
  /types               # TypeScript type definitions
  /fixtures            # Test fixtures
```

**Improvement Opportunities:**

- Move to a more consistent feature-based folder structure
- Apply clearer separation of concerns between UI, business logic, and data layers
- Implement a standardized approach to component organization
- Create a more robust typing system with shared types across modules

### Data Flow

**Current Implementation:**

- Server-side data fetching using Next.js's `getStaticProps` and `getServerSideProps`
- Client-side data fetching using SWR and native fetch
- GraphQL queries to Sanity and custom APIs
- React Context for state sharing between components
- Local storage for persistent client-side state

**Improvement Opportunities:**

- Establish clear unidirectional data flow patterns
- Create better abstraction layers for data fetching
- Centralize API calls with service layers
- Implement a more robust caching strategy
- Use typed client libraries for API integrations

### State Management

**Current Implementation:**

- React Context API for global state
- Local component state with useState/useReducer
- Custom hooks for shared logic
- Context providers organized by domain (e.g., Auth, Search, Analytics)

**Improvement Opportunities:**

- Implement more granular context providers to avoid unnecessary re-renders
- Adopt a more formal state management approach for complex features
- Create better patterns for server-client state synchronization
- Introduce stronger typing for state objects

### API Integration

**Current Implementation:**

- GraphQL for Sanity CMS integration
- Custom API clients for various services
- Direct fetch calls in some components/pages
- Mix of typed and untyped API responses

**Improvement Opportunities:**

- Create consistent API client modules
- Implement comprehensive request/response type safety
- Build better error handling and retry mechanisms
- Introduce middleware for common API concerns (auth, logging, etc.)

## UI Architecture

### Component Structure

**Current Implementation:**

- Components organized by domain (Teacher, Pupil, Shared)
- Mix of presentational and container components
- Some reusable UI primitives
- Storybook for component documentation

**Improvement Opportunities:**

- Implement a more consistent component API design
- Create a clearer separation between presentational and container components
- Build a comprehensive component library of UI primitives
- Apply more rigorous prop typing and validation

### Styling Approach

**Current Implementation:**

- Styled Components as the primary styling method
- Some global styles for common elements
- Theme provider for consistent styling
- Mix of responsive approaches

**Improvement Opportunities:**

- Move toward more atomic, composable styling
- Implement more comprehensive theme typing
- Create better documentation for styling patterns
- Consider adopting CSS Modules or Tailwind for better performance

### Accessibility

**Current Implementation:**

- Pa11y for accessibility testing
- ARIA attributes in some components
- Basic keyboard navigation support
- Screen reader considerations in key components

**Improvement Opportunities:**

- Implement comprehensive accessibility testing
- Create accessibility-focused component APIs
- Standardize keyboard navigation patterns
- Enhance screen reader support across all components

## Development Workflow

### Development Environment Setup

**Current Implementation:**

- Local environment setup with `.env` files
- NPM scripts for common tasks
- Husky for pre-commit hooks
- Basic linting and formatting rules

**Improvement Opportunities:**

- Create more comprehensive developer documentation
- Implement a standardized onboarding process
- Build more sophisticated development tooling
- Add better local development utilities

### Testing Strategy

**Current Implementation:**

- Jest for unit and integration tests
- React Testing Library for component testing
- Storybook for visual testing
- Pa11y for accessibility testing
- Tests co-located with code (except for pages)

**Improvement Opportunities:**

- Increase test coverage across the codebase
- Implement more consistent testing patterns
- Add E2E testing with Playwright or Cypress
- Create better mocking strategies for external dependencies

### CI/CD Pipeline

**Current Implementation:**

- GitHub Actions for CI/CD
- Semantic release for versioning
- Automatic deployments to Netlify
- Various testing and linting steps

**Improvement Opportunities:**

- Enhance the build process speed
- Add more comprehensive quality gates
- Implement better testing strategies in CI
- Create more sophisticated deployment strategies

### Deployment Strategy

**Current Implementation:**

- Static generation with Next.js
- Incremental Static Regeneration for dynamic content
- Netlify for hosting
- Fallback strategies for dynamic routes

**Improvement Opportunities:**

- Implement more sophisticated caching strategies
- Create better deployment rollback mechanisms
- Add performance monitoring in production
- Implement advanced CDN configurations

## Current Challenges

### Code Maintenance

The codebase faces several maintenance challenges:

- Large component files with multiple responsibilities
- Inconsistent patterns across different parts of the application
- Some tight coupling between components and data fetching
- Duplicate logic in different parts of the codebase

### Performance

Performance considerations include:

- Large bundle sizes in some areas
- Render optimization opportunities
- Data fetching optimizations
- Image and media loading strategies

### Scalability

Scalability concerns include:

- Growing complexity as features are added
- Ensuring consistent patterns across team members
- Managing increasing state complexity
- Handling an expanding component library

## Improvement Opportunities

### Enhanced Modularity

**Current State:**
The codebase has some modular organization but could benefit from stronger boundaries between modules.

**Target State:**

- Implement clearer module boundaries with explicit public APIs
- Reduce dependencies between modules
- Create better encapsulation of implementation details
- Use barrel exports to control what's exposed from each module

**Implementation Strategy:**

1. Define clear module boundaries based on domains
2. Create index.ts files with explicit exports
3. Refactor cross-module dependencies to use public APIs only
4. Document module purposes and responsibilities

### Dependency Injection

**Current State:**
The application has some implicit dependency injection through React Context, but lacks a formal pattern.

**Target State:**

- Implement a more formal dependency injection pattern
- Create service interfaces with concrete implementations
- Allow for easier testing through mock implementations
- Reduce direct dependencies on concrete implementations

**Implementation Strategy:**

1. Define interfaces for services
2. Create a service provider pattern for dependency injection
3. Use factories for creating service instances
4. Implement context-based injection for React components

Example implementation:

```typescript
// Define interface
interface UserService {
  getCurrentUser(): Promise<User>;
  updateUser(data: UserUpdateData): Promise<User>;
}

// Create concrete implementation
class ApiUserService implements UserService {
  constructor(private apiClient: ApiClient) {}

  async getCurrentUser(): Promise<User> {
    return this.apiClient.get('/user');
  }

  async updateUser(data: UserUpdateData): Promise<User> {
    return this.apiClient.patch('/user', data);
  }
}

// Service factory
const createUserService = (apiClient: ApiClient): UserService => {
  return new ApiUserService(apiClient);
};

// Context provider
const UserServiceContext = createContext<UserService | null>(null);

const UserServiceProvider: React.FC = ({ children, apiClient }) => {
  const userService = useMemo(() => createUserService(apiClient), [apiClient]);

  return (
    <UserServiceContext.Provider value={userService}>
      {children}
    </UserServiceContext.Provider>
  );
};

// Hook for consuming the service
const useUserService = () => {
  const service = useContext(UserServiceContext);
  if (!service) {
    throw new Error('useUserService must be used within UserServiceProvider');
  }
  return service;
};
```

### Code Reusability

**Current State:**
While the codebase has some reusable components and hooks, there are opportunities to increase reusability.

**Target State:**

- Create more composable, pure components
- Extract common patterns into reusable hooks
- Build utility functions for repeated logic
- Design components with reusability as a primary concern

**Implementation Strategy:**

1. Audit current component usage to identify duplication
2. Extract common UI patterns into shared components
3. Create specialized hooks for repetitive logic
4. Document reusable components and their APIs

### Module Extraction

**Current State:**
The application has some shared components and utilities, but they're tightly coupled to the main application.

**Target State:**

- Extract reusable modules into separate packages
- Create independent npm packages for shared functionality
- Implement proper versioning and documentation for extracted modules
- Design public APIs that follow best practices

**Candidate Modules for Extraction:**

1. **UI Component Library**: Core UI components that could be used across projects
2. **Form Handling Utilities**: Form validation, submission, and error handling
3. **API Client Library**: Type-safe API client with common patterns
4. **Analytics Framework**: Reusable analytics integrations
5. **Authentication Utilities**: Auth flows and integrations

**Implementation Strategy:**

1. Identify modules with clear boundaries and limited dependencies
2. Refactor selected modules to remove application-specific code
3. Set up monorepo structure or separate repositories
4. Create comprehensive documentation and examples
5. Implement versioning and release process

## Best Practices Roadmap

### SOLID Principles Implementation

**Single Responsibility Principle:**

- Refactor large components into smaller, focused ones
- Ensure each module has a clear, singular purpose
- Separate data fetching, business logic, and presentation

**Open/Closed Principle:**

- Design components that can be extended without modification
- Use composition over inheritance
- Create plugin or extension points for customization

**Liskov Substitution Principle:**

- Ensure interfaces are consistent and substitutable
- Create proper type hierarchies
- Use TypeScript to enforce substitutability

**Interface Segregation Principle:**

- Create smaller, more focused interfaces
- Avoid components that require many unrelated props
- Split large context providers into more focused ones

**Dependency Inversion Principle:**

- Depend on abstractions, not concrete implementations
- Create interfaces for services and repositories
- Implement dependency injection patterns

### Enhanced Type Safety

**Current State:**
The application uses TypeScript but has areas where type safety could be improved.

**Target State:**

- Comprehensive type coverage across the codebase
- Strict TypeScript configuration
- No use of `any` or unsafe type assertions
- Proper typing for external API responses

**Implementation Strategy:**

1. Enable strict mode in TypeScript configuration
2. Create comprehensive types for API responses
3. Use discriminated unions for state management
4. Implement proper error typing

### Automated Testing

**Current State:**
The application has unit tests but coverage could be improved.

**Target State:**

- High test coverage across all modules
- Clear testing patterns and helpers
- Comprehensive end-to-end tests
- Performance and accessibility testing automation

**Implementation Strategy:**

1. Establish clear testing goals and metrics
2. Create testing utilities and helpers
3. Implement CI/CD integration for testing
4. Prioritize critical user journeys for E2E testing

### Documentation

**Current State:**
Documentation exists but is inconsistent across the codebase.

**Target State:**

- Comprehensive documentation for all modules
- Consistent documentation style and format
- Usage examples and guidelines
- Architecture decision records

**Implementation Strategy:**

1. Implement JSDoc comments for public APIs
2. Create architecture decision records for major decisions
3. Document component props and usage patterns
4. Maintain up-to-date README files for key directories
5. Use Storybook for component documentation

## Conclusion

The Oak Web Application is a sophisticated Next.js application serving educational content. While it has a solid foundation, there are significant opportunities to improve its architecture, particularly in terms of modularity, dependency management, and code reusability.

By implementing the strategies outlined in this document, the codebase can evolve toward a more maintainable, scalable architecture that supports both current needs and future expansion. The focus on extracting reusable modules will also contribute to the open-source ecosystem and promote code reusability across projects.

This transformation will not happen overnight but can be achieved through incremental improvements and a consistent application of best practices. The result will be a more robust, maintainable, and developer-friendly codebase that better serves its educational mission.
