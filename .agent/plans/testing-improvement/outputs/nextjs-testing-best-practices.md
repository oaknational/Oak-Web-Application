# Next.js Best Practices for Better Testing

**Purpose**: Improve Next.js patterns to enable better testing across Oak's application  
**Impact**: Cleaner architecture leads to easier testing and maintenance  
**Goal**: Separate Next.js concerns from business logic for improved testability

## Critical Issues Found

### 1. Heavy getStaticProps/getServerSideProps Functions

#### Current Anti-Pattern
Many pages have data fetching functions doing too much:
- Multiple API calls
- Complex data transformations
- Business logic
- Error handling

**Example Problem**:
```typescript
// pages/teachers/lessons/[lessonSlug].tsx
export const getStaticProps = async (context) => {
  // 100+ lines of:
  // - Multiple API calls
  // - Data transformation
  // - Complex error handling
  // - Business logic
};
```

#### Testing Challenges
- Cannot unit test logic without Next.js context
- Hard to mock all dependencies
- Difficult to test error scenarios

#### Improved Pattern
```typescript
// src/services/lesson.service.ts
export class LessonService {
  async getLessonPageData(lessonSlug: string) {
    const [lesson, resources, relatedLessons] = await Promise.all([
      this.fetchLesson(lessonSlug),
      this.fetchResources(lessonSlug),
      this.fetchRelatedLessons(lessonSlug),
    ]);
    
    return {
      lesson: this.transformLesson(lesson),
      resources: this.groupResources(resources),
      relatedLessons: this.filterRelatedLessons(relatedLessons),
    };
  }
  
  // Each method is independently testable
  private transformLesson(lesson: RawLesson): Lesson {
    // Pure transformation logic
  }
}

// pages/teachers/lessons/[lessonSlug].tsx
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const lessonService = new LessonService();
  
  try {
    const data = await lessonService.getLessonPageData(params.lessonSlug);
    return { 
      props: { data },
      revalidate: 60 * 60, // 1 hour
    };
  } catch (error) {
    return { notFound: true };
  }
};
```

### 2. Fat API Route Controllers

#### Current Anti-Pattern
**Worst Offender**: `/api/curriculum-downloads/index.ts` - 326 lines mixing:
- Request validation
- Multiple service calls
- Data transformation
- File generation
- Response formatting

#### Testing Challenges
- Need full HTTP context to test
- Complex mocking setup
- Business logic tied to API layer

#### Improved Pattern
```typescript
// src/services/curriculum-download.service.ts
export class CurriculumDownloadService {
  async generateDownload(params: DownloadParams): Promise<Buffer> {
    const data = await this.fetchCurriculumData(params);
    const document = this.createDocument(data);
    return this.generateBuffer(document);
  }
  
  private async fetchCurriculumData(params: DownloadParams) {
    // Testable data fetching
  }
  
  private createDocument(data: CurriculumData): Document {
    // Pure transformation
  }
}

// src/validators/curriculum-download.validator.ts
export const validateDownloadParams = (query: any): DownloadParams => {
  const result = downloadParamsSchema.safeParse(query);
  if (!result.success) {
    throw new ValidationError(result.error);
  }
  return result.data;
};

// pages/api/curriculum-downloads/index.ts - Thin controller
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const downloadService = new CurriculumDownloadService();
  
  try {
    const params = validateDownloadParams(req.query);
    const buffer = await downloadService.generateDownload(params);
    
    res
      .setHeader('Content-Type', 'application/vnd.openxmlformats')
      .setHeader('Content-Disposition', `attachment; filename="curriculum.docx"`)
      .send(buffer);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

### 3. Missing Error Boundaries

#### Current State
- Only one global error boundary in `_app.tsx`
- No feature-specific error handling
- No partial failure recovery

#### Testing Challenges
- Cannot test error states in isolation
- No way to verify graceful degradation
- Hard to test error recovery

#### Improved Pattern
```typescript
// src/components/ErrorBoundaries/LessonErrorBoundary.tsx
export function LessonErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={LessonErrorFallback}
      onError={(error, errorInfo) => {
        // Log to error service
        errorReporter.logError(error, {
          context: 'lesson_view',
          ...errorInfo
        });
      }}
      onReset={() => {
        // Clear lesson cache
        queryClient.invalidateQueries(['lesson']);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Use at page level
export default function LessonPage({ data }) {
  return (
    <LessonErrorBoundary>
      <LessonContent data={data} />
    </LessonErrorBoundary>
  );
}

// Test error scenarios
it('shows error fallback when lesson fails to load', () => {
  const ThrowError = () => {
    throw new Error('Lesson not found');
  };
  
  render(
    <LessonErrorBoundary>
      <ThrowError />
    </LessonErrorBoundary>
  );
  
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
});
```

### 4. Route Organization Complexity

#### Current Issues
- Complex dynamic routes with multiple segments
- Route parsing logic in components
- No centralized route definitions

#### Improved Pattern
```typescript
// src/lib/routes.ts - Centralized route definitions
export const routes = {
  teacher: {
    lessons: (lessonSlug: string) => `/teachers/lessons/${lessonSlug}`,
    unit: (programmeSlug: string, unitSlug: string) => 
      `/teachers/programmes/${programmeSlug}/units/${unitSlug}`,
    downloads: (lessonSlug: string) => 
      `/teachers/lessons/${lessonSlug}/downloads`,
  },
  pupil: {
    lesson: (lessonSlug: string, section: string) => 
      `/pupils/lessons/${lessonSlug}/${section}`,
  },
  api: {
    lessonData: (lessonSlug: string) => `/api/lessons/${lessonSlug}`,
    download: () => '/api/curriculum-downloads',
  }
} as const;

// src/lib/route-utils.ts - Route parsing utilities
export function parseLessonRoute(query: ParsedUrlQuery) {
  const schema = z.object({
    lessonSlug: z.string(),
    section: z.enum(['overview', 'intro', 'video', 'quiz']).optional(),
  });
  
  return schema.parse(query);
}

// Use in pages
export default function LessonPage() {
  const router = useRouter();
  const { lessonSlug, section } = parseLessonRoute(router.query);
  
  // Component logic with validated params
}
```

### 5. Data Fetching Patterns

#### Current Issues
- Mix of client and server fetching
- No consistent data fetching strategy
- useEffect fetching without proper abstraction

#### Improved Pattern
```typescript
// src/hooks/queries/useLesson.ts
export function useLesson(lessonSlug: string) {
  return useQuery({
    queryKey: ['lesson', lessonSlug],
    queryFn: () => lessonApi.getLesson(lessonSlug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

// For server-side data, use React Query hydration
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const queryClient = new QueryClient();
  
  await queryClient.prefetchQuery({
    queryKey: ['lesson', params.lessonSlug],
    queryFn: () => lessonApi.getLesson(params.lessonSlug),
  });
  
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

// Component uses the same hook
export default function LessonPage() {
  const { lessonSlug } = useRouter().query;
  const { data: lesson, isLoading } = useLesson(lessonSlug);
  
  // Component has data immediately from SSR
}
```

### 6. App Directory Migration Strategy

#### Current State
- Most code in pages directory
- New features split between pages and app
- Inconsistent patterns

#### Migration Strategy
```typescript
// app/teachers/lessons/[lessonSlug]/page.tsx
import { LessonService } from '@/services/lesson.service';

// Server Component - runs on server only
export default async function LessonPage({ 
  params 
}: { 
  params: { lessonSlug: string } 
}) {
  const lessonService = new LessonService();
  const data = await lessonService.getLessonPageData(params.lessonSlug);
  
  return <LessonClient initialData={data} />;
}

// app/teachers/lessons/[lessonSlug]/lesson-client.tsx
'use client';

// Client Component - handles interactivity
export function LessonClient({ initialData }: { initialData: LessonData }) {
  // Interactive features here
}

// Easy to test both components independently
```

## Testing Utilities for Next.js

### 1. Page Props Testing Helper
```typescript
// __tests__/__helpers__/next-helpers.ts
export async function testGetStaticProps(
  getStaticProps: GetStaticProps,
  params: any = {}
) {
  const context = {
    params,
    query: params,
    preview: false,
    previewData: undefined,
    locale: 'en',
    locales: ['en'],
    defaultLocale: 'en',
  };
  
  return getStaticProps(context);
}

// Usage in tests
it('fetches lesson data correctly', async () => {
  const result = await testGetStaticProps(
    getStaticProps,
    { lessonSlug: 'fractions-intro' }
  );
  
  expect(result).toEqual({
    props: {
      data: expect.objectContaining({
        lesson: expect.any(Object),
      }),
    },
  });
});
```

### 2. API Route Testing Helper
```typescript
export function testApiHandler(
  handler: NextApiHandler,
  options: {
    method?: string;
    query?: any;
    body?: any;
    headers?: any;
  } = {}
) {
  const { req, res } = createMocks({
    method: options.method || 'GET',
    query: options.query,
    body: options.body,
    headers: options.headers,
  });
  
  return handler(req as NextApiRequest, res as NextApiResponse)
    .then(() => ({
      status: res._getStatusCode(),
      data: res._getJSONData(),
      headers: res._getHeaders(),
    }));
}

// Usage
it('returns curriculum data', async () => {
  const response = await testApiHandler(handler, {
    query: { subjectSlug: 'maths', phaseSlug: 'primary' },
  });
  
  expect(response.status).toBe(200);
  expect(response.data).toHaveProperty('curriculum');
});
```

## Implementation Priorities

### Phase 1: Service Layer Extraction
1. Extract business logic from getStaticProps/getServerSideProps
2. Create service classes for major features
3. Move API route logic to services

### Phase 2: Error Handling
1. Implement feature-specific error boundaries
2. Add proper error logging
3. Create error recovery mechanisms

### Phase 3: Data Fetching Standardization
1. Implement React Query across the app
2. Move to server-side fetching where appropriate
3. Standardize on data fetching patterns

### Phase 4: App Directory Migration
1. Start with new features in app directory
2. Gradually migrate existing pages
3. Use Server Components for data fetching

## Success Metrics

- **Service Coverage**: 100% of business logic in services
- **API Route Size**: No route > 50 lines
- **Error Boundaries**: One per major feature
- **Data Fetching**: Consistent patterns across app
- **Test Coverage**: 90%+ for services, 80%+ for pages

These improvements will significantly improve testability by separating Next.js framework concerns from business logic.