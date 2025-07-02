# Next.js Testing Patterns

**Testing Next.js-specific features including SSG, SSR, API routes, and framework patterns for the Oak Web Application**

## Core Next.js Testing Principles

Next.js applications have unique testing requirements due to their hybrid nature - combining client-side React with server-side rendering and static generation. Testing should verify both the generated output and the runtime behavior.

## Static Site Generation (SSG) Testing

### 1. Testing getStaticProps

```typescript
// pages/teachers/lessons/[lessonSlug].tsx
export async function getStaticProps({ params }: GetStaticPropsContext) {
  const lesson = await fetchLessonBySlug(params?.lessonSlug as string);
  
  if (!lesson) {
    return { notFound: true };
  }

  return {
    props: { lesson },
    revalidate: 3600 // 1 hour
  };
}

// __tests__/pages/teachers/lessons/[lessonSlug].test.ts
import { getStaticProps } from '../../../pages/teachers/lessons/[lessonSlug]';
import { fetchLessonBySlug } from '@/api/lessons';

vi.mock('@/api/lessons');

describe('LessonPage getStaticProps', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns lesson data for valid slug', async () => {
    const mockLesson = createMockLesson({ slug: 'fractions-intro' });
    vi.mocked(fetchLessonBySlug).mockResolvedValue(mockLesson);

    const result = await getStaticProps({
      params: { lessonSlug: 'fractions-intro' }
    });

    expect(result).toEqual({
      props: { lesson: mockLesson },
      revalidate: 3600
    });
    expect(fetchLessonBySlug).toHaveBeenCalledWith('fractions-intro');
  });

  it('returns notFound for invalid lesson slug', async () => {
    vi.mocked(fetchLessonBySlug).mockResolvedValue(null);

    const result = await getStaticProps({
      params: { lessonSlug: 'invalid-slug' }
    });

    expect(result).toEqual({ notFound: true });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(fetchLessonBySlug).mockRejectedValue(new Error('API Error'));

    await expect(getStaticProps({
      params: { lessonSlug: 'test-lesson' }
    })).rejects.toThrow('API Error');
  });
});
```

### 2. Testing getStaticPaths

```typescript
// Testing dynamic path generation
export async function getStaticPaths() {
  const lessons = await fetchPopularLessons(); // Pre-generate popular lessons
  
  const paths = lessons.map((lesson) => ({
    params: { lessonSlug: lesson.slug }
  }));

  return {
    paths,
    fallback: 'blocking' // Generate other lessons on-demand
  };
}

// __tests__/pages/teachers/lessons/[lessonSlug].static-paths.test.ts
describe('LessonPage getStaticPaths', () => {
  it('generates paths for popular lessons', async () => {
    const mockLessons = [
      createMockLesson({ slug: 'fractions-intro' }),
      createMockLesson({ slug: 'algebra-basics' })
    ];
    vi.mocked(fetchPopularLessons).mockResolvedValue(mockLessons);

    const result = await getStaticPaths();

    expect(result).toEqual({
      paths: [
        { params: { lessonSlug: 'fractions-intro' } },
        { params: { lessonSlug: 'algebra-basics' } }
      ],
      fallback: 'blocking'
    });
  });

  it('handles empty lesson list', async () => {
    vi.mocked(fetchPopularLessons).mockResolvedValue([]);

    const result = await getStaticPaths();

    expect(result.paths).toEqual([]);
    expect(result.fallback).toBe('blocking');
  });
});
```

## Server-Side Rendering (SSR) Testing

### 1. Testing getServerSideProps

```typescript
// pages/teachers/search.tsx - Server-rendered search results
export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const searchTerm = query.q as string;
  const subject = query.subject as string;
  const keyStage = query.keyStage as string;

  if (!searchTerm) {
    return {
      props: {
        results: [],
        searchParams: { q: '', subject: '', keyStage: '' }
      }
    };
  }

  const results = await searchLessons({ searchTerm, subject, keyStage });

  return {
    props: {
      results,
      searchParams: { q: searchTerm, subject, keyStage }
    }
  };
}

// __tests__/pages/teachers/search.test.ts
describe('SearchPage getServerSideProps', () => {
  it('returns search results for valid query', async () => {
    const mockResults = [createMockLesson({ title: 'Fractions Result' })];
    vi.mocked(searchLessons).mockResolvedValue(mockResults);

    const result = await getServerSideProps({
      query: { 
        q: 'fractions',
        subject: 'mathematics',
        keyStage: 'ks2'
      }
    });

    expect(result.props.results).toEqual(mockResults);
    expect(result.props.searchParams).toEqual({
      q: 'fractions',
      subject: 'mathematics', 
      keyStage: 'ks2'
    });
  });

  it('returns empty results for missing search term', async () => {
    const result = await getServerSideProps({ query: {} });

    expect(result.props.results).toEqual([]);
    expect(result.props.searchParams.q).toBe('');
  });

  it('includes partial search parameters', async () => {
    vi.mocked(searchLessons).mockResolvedValue([]);

    const result = await getServerSideProps({
      query: { q: 'algebra' } // Missing subject and keyStage
    });

    expect(result.props.searchParams).toEqual({
      q: 'algebra',
      subject: '',
      keyStage: ''
    });
  });
});
```

### 2. Testing SSR Page Components

```typescript
// Testing the page component that receives SSR props
import { render, screen } from '@testing-library/react';
import SearchPage from '../../../pages/teachers/search';

describe('SearchPage Component', () => {
  it('displays search results', () => {
    const props = {
      results: [
        createMockLesson({ title: 'Fractions Basics' }),
        createMockLesson({ title: 'Advanced Fractions' })
      ],
      searchParams: { q: 'fractions', subject: 'mathematics', keyStage: 'ks2' }
    };

    render(<SearchPage {...props} />);

    expect(screen.getByText('Fractions Basics')).toBeInTheDocument();
    expect(screen.getByText('Advanced Fractions')).toBeInTheDocument();
  });

  it('shows empty state for no results', () => {
    const props = {
      results: [],
      searchParams: { q: 'nonexistent', subject: '', keyStage: '' }
    };

    render(<SearchPage {...props} />);

    expect(screen.getByText(/no lessons found/i)).toBeInTheDocument();
  });
});
```

## API Routes Testing

### 1. API Route Testing Framework

```typescript
// __tests__/api-test-utils.ts
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

export function createApiMocks<T = any>(options: {
  method?: string;
  query?: Record<string, string>;
  body?: T;
  headers?: Record<string, string>;
}) {
  return createMocks<NextApiRequest, NextApiResponse>({
    method: options.method || 'GET',
    query: options.query || {},
    body: options.body,
    headers: options.headers || {}
  });
}

export function expectApiResponse(res: NextApiResponse, expectedStatus: number) {
  expect(res._getStatusCode()).toBe(expectedStatus);
  return {
    toHaveData: (expectedData: any) => {
      const data = JSON.parse(res._getData());
      expect(data).toEqual(expectedData);
    },
    toHaveError: (expectedMessage: string) => {
      const data = JSON.parse(res._getData());
      expect(data.error).toBe(expectedMessage);
    }
  };
}
```

### 2. Testing GET API Routes

```typescript
// pages/api/curriculum/[subject].ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subject } = req.query;
  const { keyStage } = req.query;

  try {
    const curriculum = await fetchCurriculumData(subject as string, keyStage as string);
    
    if (!curriculum) {
      return res.status(404).json({ error: 'Curriculum not found' });
    }

    res.status(200).json(curriculum);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// __tests__/api/curriculum/[subject].test.ts
import handler from '../../../pages/api/curriculum/[subject]';
import { fetchCurriculumData } from '@/api/curriculum';

vi.mock('@/api/curriculum');

describe('/api/curriculum/[subject]', () => {
  it('returns curriculum data for valid subject', async () => {
    const mockCurriculum = createMockCurriculum({ subject: 'mathematics' });
    vi.mocked(fetchCurriculumData).mockResolvedValue(mockCurriculum);

    const { req, res } = createApiMocks({
      method: 'GET',
      query: { subject: 'mathematics', keyStage: 'ks2' }
    });

    await handler(req, res);

    expectApiResponse(res, 200).toHaveData(mockCurriculum);
    expect(fetchCurriculumData).toHaveBeenCalledWith('mathematics', 'ks2');
  });

  it('returns 404 for non-existent subject', async () => {
    vi.mocked(fetchCurriculumData).mockResolvedValue(null);

    const { req, res } = createApiMocks({
      method: 'GET',
      query: { subject: 'invalid-subject' }
    });

    await handler(req, res);

    expectApiResponse(res, 404).toHaveError('Curriculum not found');
  });

  it('returns 405 for non-GET methods', async () => {
    const { req, res } = createApiMocks({
      method: 'POST',
      query: { subject: 'mathematics' }
    });

    await handler(req, res);

    expectApiResponse(res, 405).toHaveError('Method not allowed');
  });

  it('handles database errors', async () => {
    vi.mocked(fetchCurriculumData).mockRejectedValue(new Error('Database error'));

    const { req, res } = createApiMocks({
      method: 'GET',
      query: { subject: 'mathematics' }
    });

    await handler(req, res);

    expectApiResponse(res, 500).toHaveError('Internal server error');
  });
});
```

### 3. Testing POST API Routes

```typescript
// pages/api/lessons/bookmark.ts - Teacher bookmarking API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { lessonId, teacherId } = req.body;

  if (!lessonId || !teacherId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const bookmark = await toggleLessonBookmark(lessonId, teacherId);
    res.status(200).json(bookmark);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle bookmark' });
  }
}

// __tests__/api/lessons/bookmark.test.ts
describe('/api/lessons/bookmark', () => {
  it('creates bookmark for valid lesson and teacher', async () => {
    const mockBookmark = { lessonId: 'lesson-123', teacherId: 'teacher-456', bookmarked: true };
    vi.mocked(toggleLessonBookmark).mockResolvedValue(mockBookmark);

    const { req, res } = createApiMocks({
      method: 'POST',
      body: { lessonId: 'lesson-123', teacherId: 'teacher-456' }
    });

    await handler(req, res);

    expectApiResponse(res, 200).toHaveData(mockBookmark);
  });

  it('validates required fields', async () => {
    const { req, res } = createApiMocks({
      method: 'POST',
      body: { lessonId: 'lesson-123' } // Missing teacherId
    });

    await handler(req, res);

    expectApiResponse(res, 400).toHaveError('Missing required fields');
  });
});
```

## Next.js App Router Testing (for future migration)

### 1. Layout Testing

```typescript
// app/teachers/layout.tsx
export default function TeachersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="teachers-layout">
      <TeacherNavigation />
      <main>{children}</main>
      <TeacherFooter />
    </div>
  );
}

// __tests__/app/teachers/layout.test.tsx
describe('TeachersLayout', () => {
  it('renders navigation and footer with content', () => {
    render(
      <TeachersLayout>
        <div>Test Content</div>
      </TeachersLayout>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
```

### 2. Server Component Testing

```typescript
// app/teachers/lessons/page.tsx - Server Component
async function LessonsPage({ searchParams }: { searchParams: { subject?: string } }) {
  const lessons = await fetchLessons({ subject: searchParams.subject });
  
  return (
    <div>
      <h1>Lessons</h1>
      <LessonGrid lessons={lessons} />
    </div>
  );
}

// Note: Server Components testing is still evolving in the ecosystem
// Current approach focuses on integration testing the rendered output
```

## Incremental Static Regeneration (ISR) Testing

### 1. Testing Revalidation Logic

```typescript
// Testing ISR behavior
describe('Lesson Page ISR', () => {
  it('revalidates lesson data hourly', async () => {
    const props = await getStaticProps({ params: { lessonSlug: 'test-lesson' } });
    
    expect(props).toMatchObject({
      props: expect.any(Object),
      revalidate: 3600 // 1 hour in seconds
    });
  });

  it('handles revalidation failures gracefully', async () => {
    // Simulate API failure during revalidation
    vi.mocked(fetchLessonBySlug).mockRejectedValue(new Error('API unavailable'));

    // Should still return cached version or handle gracefully
    await expect(getStaticProps({ 
      params: { lessonSlug: 'test-lesson' } 
    })).rejects.toThrow('API unavailable');
  });
});
```

## Image Optimization Testing

### 1. Testing Next.js Image Component

```typescript
// Oak-specific image testing
import { render, screen } from '@testing-library/react';
import Image from 'next/image';

describe('LessonThumbnail', () => {
  it('optimizes lesson images correctly', () => {
    render(
      <Image
        src="/images/lessons/fractions-intro.jpg"
        alt="Introduction to Fractions lesson thumbnail"
        width={400}
        height={300}
        priority={true}
      />
    );

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', 'Introduction to Fractions lesson thumbnail');
    expect(image).toHaveAttribute('width', '400');
    expect(image).toHaveAttribute('height', '300');
  });
});
```

## Middleware Testing

### 1. Testing Next.js Middleware

```typescript
// middleware.ts - Teacher authentication middleware
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isTeacherRoute = request.nextUrl.pathname.startsWith('/teachers');
  const authToken = request.cookies.get('auth-token');

  if (isTeacherRoute && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// __tests__/middleware.test.ts
import { middleware } from '../middleware';
import { NextRequest, NextResponse } from 'next/server';

describe('Teacher Auth Middleware', () => {
  it('redirects unauthenticated users from teacher routes', () => {
    const request = new NextRequest(new URL('/teachers/lessons', 'http://localhost'));
    // No auth token cookie

    const response = middleware(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get('location')).toBe('http://localhost/login');
  });

  it('allows authenticated users to access teacher routes', () => {
    const request = new NextRequest(new URL('/teachers/lessons', 'http://localhost'));
    request.cookies.set('auth-token', 'valid-token');

    const response = middleware(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get('location')).toBeNull();
  });

  it('allows public routes without authentication', () => {
    const request = new NextRequest(new URL('/about', 'http://localhost'));

    const response = middleware(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get('location')).toBeNull();
  });
});
```

## Performance Testing

### 1. Core Web Vitals Testing

```typescript
// __tests__/performance/web-vitals.test.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

describe('Core Web Vitals', () => {
  it('measures lesson page performance', async () => {
    const vitals: Record<string, number> = {};

    getCLS((metric) => { vitals.CLS = metric.value; });
    getFID((metric) => { vitals.FID = metric.value; });
    getFCP((metric) => { vitals.FCP = metric.value; });
    getLCP((metric) => { vitals.LCP = metric.value; });
    getTTFB((metric) => { vitals.TTFB = metric.value; });

    // Simulate page interaction
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Assert performance thresholds
    expect(vitals.LCP).toBeLessThan(2500); // 2.5s threshold
    expect(vitals.FID).toBeLessThan(100);  // 100ms threshold
    expect(vitals.CLS).toBeLessThan(0.1);  // 0.1 threshold
  });
});
```

## Testing Best Practices for Next.js

### 1. Mocking Next.js APIs

```typescript
// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: { subject: 'mathematics' },
    pathname: '/teachers/lessons'
  })
}));

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

// Mock Next.js Head
jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children
}));
```

### 2. Testing Environment Configuration

```typescript
// __tests__/setup.ts - Next.js specific setup
import { setConfig } from 'next/config';
import config from '../next.config.js';

// Make Next.js config available in tests
setConfig({
  serverRuntimeConfig: config.serverRuntimeConfig,
  publicRuntimeConfig: config.publicRuntimeConfig
});
```

## Oak-Specific Next.js Patterns

### 1. Curriculum Data Flow Testing

```typescript
describe('Curriculum SSG Flow', () => {
  it('generates static pages for all subjects and key stages', async () => {
    const paths = await getStaticPaths();
    
    // Verify Oak curriculum structure
    expect(paths.paths).toEqual(
      expect.arrayContaining([
        { params: { subject: 'mathematics', keyStage: 'ks1' } },
        { params: { subject: 'mathematics', keyStage: 'ks2' } },
        { params: { subject: 'english', keyStage: 'ks1' } },
        { params: { subject: 'english', keyStage: 'ks2' } }
      ])
    );
  });
});
```

### 2. SEO and Metadata Testing

```typescript
describe('Lesson Page SEO', () => {
  it('generates proper meta tags for lesson pages', () => {
    const lesson = createMockLesson({
      title: 'Introduction to Fractions',
      description: 'Learn the basics of fractions with interactive examples'
    });

    render(<LessonPage lesson={lesson} />);

    expect(document.title).toBe('Introduction to Fractions - Oak National Academy');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content'))
      .toBe('Learn the basics of fractions with interactive examples');
  });
});
```

---

*These Next.js testing patterns ensure Oak's educational platform delivers reliable, performant experiences for teachers and students across all rendering strategies.*