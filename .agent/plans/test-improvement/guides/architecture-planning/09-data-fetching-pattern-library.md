# Data Fetching Pattern Library

**Phase**: 2.2 - Architecture Planning  
**Type**: Planning Document  
**Purpose**: Standardized approaches to data management for improved testability and consistency

## Executive Summary

This document establishes standardized data fetching patterns for the Oak Web Application. By creating consistent patterns for server-side and client-side data fetching, we improve testability, reduce duplication, and ensure reliable data management across the application.

## Current State Analysis

### Existing Patterns

1. **Server-Side Rendering (SSR)**
   - Next.js `getServerSideProps` and `getStaticProps`
   - Direct API calls in page components
   - Limited abstraction or reusability

2. **Client-Side Fetching**
   - Mix of `fetch`, custom hooks, and inline logic
   - No consistent caching strategy
   - Limited error handling

3. **API Routes**
   - Business logic mixed with HTTP handling
   - Inconsistent response formats
   - Limited type safety

## Proposed Data Fetching Architecture

### Core Principles

1. **Separation of Concerns**
   - Data fetching logic separate from components
   - HTTP concerns separate from business logic
   - Clear boundaries between layers

2. **Type Safety**
   - End-to-end type safety from API to UI
   - Generated types from GraphQL/OpenAPI
   - Runtime validation at boundaries

3. **Testability**
   - Easy to mock data sources
   - Isolated testing of each layer
   - Predictable behavior

### Layer Architecture

```
UI Layer (Components)
    ↓
Data Hooks Layer (useQuery, useMutation)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
HTTP/GraphQL Layer (Network)
```

## Server-Side Data Fetching Patterns

### Pattern 1: Repository Pattern for SSR

```typescript
// src/repositories/lesson.repository.ts
export interface LessonRepository {
  getLesson(slug: string): Promise<Lesson>;
  getLessonList(filters: LessonFilters): Promise<LessonList>;
}

export class ApiLessonRepository implements LessonRepository {
  constructor(private apiClient: ApiClient) {}

  async getLesson(slug: string): Promise<Lesson> {
    const response = await this.apiClient.get(`/lessons/${slug}`);
    return LessonSchema.parse(response.data);
  }

  async getLessonList(filters: LessonFilters): Promise<LessonList> {
    const response = await this.apiClient.get('/lessons', { params: filters });
    return LessonListSchema.parse(response.data);
  }
}
```

### Pattern 2: Service Layer for Business Logic

```typescript
// src/services/lesson.service.ts
export class LessonService {
  constructor(
    private lessonRepo: LessonRepository,
    private userRepo: UserRepository
  ) {}

  async getLessonWithProgress(slug: string, userId?: string): Promise<LessonWithProgress> {
    const [lesson, progress] = await Promise.all([
      this.lessonRepo.getLesson(slug),
      userId ? this.userRepo.getLessonProgress(userId, slug) : null,
    ]);

    return {
      ...lesson,
      progress,
      isCompleted: progress?.completedAt != null,
    };
  }
}
```

### Pattern 3: Next.js Integration

```typescript
// src/pages/lessons/[slug].tsx
import { createServerSideProps } from '@/utils/ssr';
import { lessonService } from '@/services';

export const getServerSideProps = createServerSideProps(async (context) => {
  const { slug } = context.params;
  const user = await getServerUser(context);

  try {
    const lesson = await lessonService.getLessonWithProgress(
      slug as string,
      user?.id
    );

    return {
      props: {
        lesson,
        user,
      },
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { notFound: true };
    }
    throw error; // Let error boundary handle
  }
});

// Utility for consistent SSR
export function createServerSideProps<P>(
  handler: GetServerSidePropsHandler<P>
): GetServerSideProps<P> {
  return async (context) => {
    try {
      // Add common context (auth, etc.)
      const enhancedContext = await enhanceContext(context);
      return await handler(enhancedContext);
    } catch (error) {
      // Consistent error handling
      return handleSSRError(error);
    }
  };
}
```

## Client-Side Data Fetching Patterns

### Pattern 1: React Query Integration

```typescript
// src/hooks/queries/useLesson.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { lessonService } from '@/services';

export function useLesson(
  slug: string,
  options?: UseQueryOptions<Lesson, Error>
) {
  return useQuery({
    queryKey: ['lesson', slug],
    queryFn: () => lessonService.getLesson(slug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

// Usage in component
export function LessonView({ slug }: Props) {
  const { data: lesson, isLoading, error } = useLesson(slug);

  if (isLoading) return <LessonSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return <Lesson data={lesson} />;
}
```

### Pattern 2: Mutation Pattern

```typescript
// src/hooks/mutations/useSaveLesson.ts
export function useSaveLesson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SaveLessonInput) => 
      lessonService.saveLesson(data),
    
    onSuccess: (savedLesson) => {
      // Update cache
      queryClient.setQueryData(
        ['lesson', savedLesson.slug],
        savedLesson
      );
      
      // Invalidate list queries
      queryClient.invalidateQueries({
        queryKey: ['lessons'],
      });
    },
    
    onError: (error) => {
      // Handle error consistently
      errorReporter.notify(error);
    },
  });
}
```

### Pattern 3: Optimistic Updates

```typescript
// src/hooks/mutations/useToggleFavorite.ts
export function useToggleFavorite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ lessonId, isFavorite }: ToggleFavoriteInput) =>
      lessonService.toggleFavorite(lessonId, isFavorite),
    
    onMutate: async ({ lessonId, isFavorite }) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries(['lesson', lessonId]);
      
      // Snapshot previous value
      const previousLesson = queryClient.getQueryData(['lesson', lessonId]);
      
      // Optimistically update
      queryClient.setQueryData(['lesson', lessonId], (old: Lesson) => ({
        ...old,
        isFavorite,
      }));
      
      return { previousLesson };
    },
    
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousLesson) {
        queryClient.setQueryData(
          ['lesson', variables.lessonId],
          context.previousLesson
        );
      }
    },
  });
}
```

## Caching Strategies

### 1. Static Data Caching

```typescript
// For rarely changing data
export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: () => subjectService.getAllSubjects(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    cacheTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}
```

### 2. User-Specific Caching

```typescript
// Include user ID in cache key
export function useUserLessons(userId: string) {
  return useQuery({
    queryKey: ['lessons', 'user', userId],
    queryFn: () => lessonService.getUserLessons(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### 3. Prefetching Strategy

```typescript
// Prefetch on hover
export function usePrefetchLesson() {
  const queryClient = useQueryClient();
  
  return (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: ['lesson', slug],
      queryFn: () => lessonService.getLesson(slug),
      staleTime: 10 * 60 * 1000,
    });
  };
}
```

## Loading States

### 1. Skeleton Screens

```typescript
// src/components/Skeletons/LessonSkeleton.tsx
export function LessonSkeleton() {
  return (
    <OakFlex $flexDirection="column" $gap="all-spacing-4">
      <Skeleton height={40} width="60%" />
      <Skeleton height={20} width="80%" />
      <Skeleton height={200} />
    </OakFlex>
  );
}
```

### 2. Progressive Loading

```typescript
// Load critical data first
export function useLessonProgressive(slug: string) {
  // Critical data
  const { data: lesson } = useLesson(slug);
  
  // Non-critical data
  const { data: relatedLessons } = useRelatedLessons(slug, {
    enabled: !!lesson, // Load after main data
  });
  
  return { lesson, relatedLessons };
}
```

## Error Handling

### 1. Centralized Error Handler

```typescript
// src/utils/query-error-handler.ts
export function queryErrorHandler(error: unknown): void {
  if (error instanceof NetworkError) {
    showToast({
      type: 'error',
      message: 'Please check your internet connection',
    });
  } else if (error instanceof UnauthorizedError) {
    // Redirect to login
    router.push('/login');
  } else {
    // Generic error
    showToast({
      type: 'error',
      message: 'Something went wrong. Please try again.',
    });
  }
}

// Configure globally
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: queryErrorHandler,
    },
    mutations: {
      onError: queryErrorHandler,
    },
  },
});
```

### 2. Retry Logic

```typescript
// Custom retry logic
export function useResilientQuery<T>(
  key: QueryKey,
  fn: () => Promise<T>
) {
  return useQuery({
    queryKey: key,
    queryFn: fn,
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error instanceof HttpError && error.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => 
      Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
```

## Testing Patterns

### 1. Mock Service Layer

```typescript
// src/services/__mocks__/lesson.service.ts
export const mockLessonService: LessonService = {
  getLesson: jest.fn().mockResolvedValue(mockLesson),
  getLessonList: jest.fn().mockResolvedValue(mockLessonList),
  saveLesson: jest.fn().mockResolvedValue(mockSavedLesson),
};
```

### 2. Testing Hooks

```typescript
// src/hooks/queries/__tests__/useLesson.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('useLesson', () => {
  let queryClient: QueryClient;
  
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });
  
  it('should fetch lesson data', async () => {
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
    
    const { result } = renderHook(
      () => useLesson('test-slug'),
      { wrapper }
    );
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    
    expect(result.current.data).toEqual(mockLesson);
  });
});
```

### 3. Testing SSR

```typescript
// src/pages/__tests__/lessons/[slug].test.tsx
import { GetServerSidePropsContext } from 'next';

describe('Lesson Page SSR', () => {
  it('should fetch lesson data', async () => {
    const context = {
      params: { slug: 'test-lesson' },
    } as GetServerSidePropsContext;
    
    const result = await getServerSideProps(context);
    
    expect(result).toEqual({
      props: {
        lesson: mockLesson,
        user: null,
      },
    });
  });
  
  it('should return 404 for missing lesson', async () => {
    mockLessonService.getLesson.mockRejectedValueOnce(
      new NotFoundError()
    );
    
    const result = await getServerSideProps(context);
    
    expect(result).toEqual({ notFound: true });
  });
});
```

## Migration Strategy

### Phase 1: Establish Patterns
1. Create base service and repository interfaces
2. Set up React Query
3. Create utility functions

### Phase 2: Migrate Critical Paths
1. Start with high-traffic pages
2. Migrate one feature at a time
3. Maintain backwards compatibility

### Phase 3: Standardize
1. Update all data fetching to new patterns
2. Remove legacy code
3. Document patterns

## Best Practices

1. **Always validate data at boundaries** - Use Zod or similar
2. **Handle loading states gracefully** - Use skeletons
3. **Implement proper error boundaries** - Catch and handle
4. **Cache appropriately** - Balance freshness and performance
5. **Test all scenarios** - Success, error, loading

## Conclusion

These data fetching patterns provide a solid foundation for scalable, testable data management. By separating concerns and standardizing approaches, we improve both developer experience and application reliability.