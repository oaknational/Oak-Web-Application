# Service Layer Design Document

## Overview

This document outlines the proposed service layer architecture to improve testability, maintainability, and separation of concerns in the Oak Web Application.

## Goals

1. Separate business logic from UI components
2. Improve testability through dependency injection
3. Create reusable business logic modules
4. Establish clear boundaries between layers
5. Enable easier mocking for tests

## Proposed Architecture

### Layer Structure

```
┌─────────────────────────────────────┐
│         UI Components               │
├─────────────────────────────────────┤
│         Custom Hooks                │
├─────────────────────────────────────┤
│        Service Layer                │
├─────────────────────────────────────┤
│       Repository Layer              │
├─────────────────────────────────────┤
│         API Clients                 │
└─────────────────────────────────────┘
```

## Service Layer Design

### 1. Core Service Interface

```typescript
interface Service<T> {
  initialize?(): Promise<void>;
  dispose?(): void;
}
```

### 2. Service Categories

#### Curriculum Service

**Purpose**: Handle all curriculum-related business logic

```typescript
interface CurriculumService {
  getPhaseOptions(): Promise<CurriculumPhaseOptions>;
  getSubjectsByPhase(phaseSlug: string): Promise<Subject[]>;
  getCurriculumOverview(params: CurriculumParams): Promise<CurriculumOverview>;
  downloadCurriculum(curriculumId: string): Promise<DownloadResult>;
}
```

#### Lesson Service

**Purpose**: Manage lesson-related operations

```typescript
interface LessonService {
  getLessonById(lessonId: string): Promise<Lesson>;
  getLessonsByUnit(unitId: string): Promise<Lesson[]>;
  downloadLessonResources(lessonId: string): Promise<DownloadResult>;
  shareLessonResources(lessonId: string, options: ShareOptions): Promise<ShareResult>;
}
```

#### Analytics Service (Enhancement)

**Purpose**: Centralize analytics operations

```typescript
interface AnalyticsService {
  trackEvent(event: AnalyticsEvent): void;
  trackPageView(page: PageViewEvent): void;
  identifyUser(userId: string, traits?: UserTraits): void;
  setConsent(consent: ConsentState): void;
}
```

#### Error Service

**Purpose**: Centralized error handling and reporting

```typescript
interface ErrorService {
  captureError(error: Error, context?: ErrorContext): void;
  captureMessage(message: string, level: ErrorLevel): void;
  setUserContext(user: UserContext): void;
  clearContext(): void;
}
```

### 3. Repository Pattern

#### Base Repository

```typescript
interface Repository<T> {
  find(id: string): Promise<T | null>;
  findMany(filter: FilterOptions): Promise<T[]>;
  create?(data: Partial<T>): Promise<T>;
  update?(id: string, data: Partial<T>): Promise<T>;
  delete?(id: string): Promise<void>;
}
```

#### Curriculum Repository

```typescript
interface CurriculumRepository {
  getPhaseOptions(): Promise<CurriculumPhaseOptions>;
  getCurriculumData(params: CurriculumParams): Promise<CurriculumData>;
  getDownloadUrls(curriculumId: string): Promise<string[]>;
}
```

## Implementation Strategy

### Phase 1: Foundation (Week 1-2)

1. Create base service interfaces
2. Implement service container/registry
3. Set up dependency injection patterns
4. Create service factory functions

### Phase 2: Core Services (Week 3-4)

1. Implement CurriculumService
2. Implement LessonService
3. Enhance existing AnalyticsService
4. Create ErrorService

### Phase 3: Repository Layer (Week 5-6)

1. Implement base repository pattern
2. Create specific repositories
3. Integrate with existing API clients
4. Add caching layer

### Phase 4: Integration (Week 7-8)

1. Create custom hooks for services
2. Migrate components to use services
3. Update tests to use service mocks
4. Documentation and examples

## Service Implementation Guidelines

### 1. Service Creation

```typescript
// services/curriculum/curriculumService.ts
export class CurriculumServiceImpl implements CurriculumService {
  constructor(
    private repository: CurriculumRepository,
    private analytics: AnalyticsService,
    private errorService: ErrorService
  ) {}

  async getPhaseOptions(): Promise<CurriculumPhaseOptions> {
    try {
      const options = await this.repository.getPhaseOptions();
      this.analytics.trackEvent({
        name: 'curriculum_phase_options_loaded',
        properties: { count: options.length }
      });
      return options;
    } catch (error) {
      this.errorService.captureError(error, {
        operation: 'getPhaseOptions'
      });
      throw error;
    }
  }
}
```

### 2. Service Registration

```typescript
// services/serviceRegistry.ts
export const createServices = (config: ServiceConfig): ServiceRegistry => {
  const errorService = new ErrorServiceImpl(config.errorReporting);
  const analyticsService = new AnalyticsServiceImpl(config.analytics);
  
  const curriculumRepo = new CurriculumRepositoryImpl(curriculumApi);
  const curriculumService = new CurriculumServiceImpl(
    curriculumRepo,
    analyticsService,
    errorService
  );

  return {
    curriculum: curriculumService,
    analytics: analyticsService,
    error: errorService,
  };
};
```

### 3. Hook Integration

```typescript
// hooks/useCurriculumService.ts
export const useCurriculumService = () => {
  const services = useServices();
  return services.curriculum;
};

// Usage in component
const MyComponent = () => {
  const curriculumService = useCurriculumService();
  const { data, error, isLoading } = useSWR(
    'phase-options',
    () => curriculumService.getPhaseOptions()
  );
};
```

## Testing Strategy

### 1. Service Mocking

```typescript
// __mocks__/services/curriculumService.mock.ts
export const createMockCurriculumService = (): CurriculumService => ({
  getPhaseOptions: jest.fn().mockResolvedValue(mockPhaseOptions),
  getSubjectsByPhase: jest.fn().mockResolvedValue(mockSubjects),
  // ... other methods
});
```

### 2. Test Setup

```typescript
// test-utils/serviceTestUtils.ts
export const renderWithServices = (
  ui: React.ReactElement,
  services: Partial<ServiceRegistry> = {}
) => {
  const mockServices = createMockServices(services);
  return render(
    <ServiceProvider services={mockServices}>
      {ui}
    </ServiceProvider>
  );
};
```

## Migration Plan

### Priority Components for Migration

1. SubjectPhasePicker - High complexity, high value
2. Lesson download flows - Business critical
3. Search functionality - High usage
4. Video player - Complex logic

### Migration Steps

1. Identify component dependencies
2. Extract business logic to service
3. Create repository if needed
4. Update component to use service
5. Update tests
6. Document changes

## Success Metrics

- Reduced component complexity (lines of code)
- Improved test coverage
- Faster test execution
- Reduced coupling metrics
- Easier onboarding for new developers

## Risks and Mitigations

1. **Risk**: Over-engineering
   - **Mitigation**: Start simple, iterate based on needs

2. **Risk**: Performance overhead
   - **Mitigation**: Implement caching, measure impact

3. **Risk**: Learning curve
   - **Mitigation**: Comprehensive documentation, examples

## Next Steps

1. Review and approve design
2. Create proof of concept
3. Set up service infrastructure
4. Begin incremental migration
