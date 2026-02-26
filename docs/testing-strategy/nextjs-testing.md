# Next.js Testing Patterns

**Testing Next.js-specific features for Oak's educational platform using Jest, TypeScript, and accessibility-first approaches**

## Core Next.js Testing Principles for Oak

Next.js applications have unique testing requirements due to their hybrid nature - combining client-side React with server-side rendering and static generation. For Oak's educational platform, testing must verify:

1. **Educational Content Delivery** - Lesson data is correctly fetched and rendered
2. **Teacher/Student Experience** - Different user journeys work seamlessly
3. **Accessibility Compliance** - Server-rendered content meets WCAG standards
4. **Performance** - Fast loading for classroom environments with variable connectivity
5. **SEO for Discoverability** - Educational content is properly indexed

Oak's testing focuses on educational data integrity, user experience differentiation (teacher vs pupil), and accessibility across all rendering strategies.

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
    revalidate: 3600, // 1 hour
  };
}

// __tests__/pages/teachers/lessons/[lessonSlug].test.ts - Oak's Actual Pattern
import { getStaticProps } from "@/pages/teachers/lessons/[lessonSlug]";
import { lessonBrowsePageProps } from "@/node-lib/curriculum-api-2023/queries";
import type { GetStaticPropsContext } from "next";
import { createMockLesson } from "@/__tests__/__helpers__/mockData/curriculum";

// Mock Oak's actual curriculum API
jest.mock("@/node-lib/curriculum-api-2023/queries");
const mockLessonBrowsePageProps = lessonBrowsePageProps as jest.MockedFunction<
  typeof lessonBrowsePageProps
>;

describe("Teacher Lesson Page getStaticProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns lesson data with teacher-specific resources", async () => {
    const mockLessonData = {
      lesson: createMockLesson({
        slug: "introduction-to-fractions-6crp",
        _state: "published",
      }),
      curriculumData: {
        subjectTitle: "Mathematics",
        keyStageTitle: "Key stage 2",
        keyStageSlug: "ks2",
      },
      isLegacyLesson: false,
    };

    mockLessonBrowsePageProps.mockResolvedValue(mockLessonData);

    const context: GetStaticPropsContext = {
      params: { lessonSlug: "introduction-to-fractions-6crp" },
    };

    const result = await getStaticProps(context);

    expect(result).toEqual({
      props: mockLessonData,
      revalidate: 60 * 60, // Oak's hourly revalidation
    });
    expect(mockLessonBrowsePageProps).toHaveBeenCalledWith({
      lessonSlug: "introduction-to-fractions-6crp",
    });
  });

  it("returns notFound for unpublished lessons", async () => {
    mockLessonBrowsePageProps.mockResolvedValue(null);

    const result = await getStaticProps({
      params: { lessonSlug: "unpublished-lesson" },
    });

    expect(result).toEqual({ notFound: true });
  });

  it("handles Sanity API errors gracefully", async () => {
    mockLessonBrowsePageProps.mockRejectedValue(
      new Error("Sanity API temporarily unavailable"),
    );

    // Oak's error handling - should still throw to trigger Next.js error page
    await expect(
      getStaticProps({
        params: { lessonSlug: "test-lesson" },
      }),
    ).rejects.toThrow("Sanity API temporarily unavailable");
  });

  it("handles legacy lesson redirects", async () => {
    const legacyLessonData = {
      lesson: createMockLesson({
        slug: "old-fractions-lesson",
        _state: "published",
      }),
      curriculumData: {
        subjectTitle: "Mathematics",
        keyStageTitle: "Key stage 2",
      },
      isLegacyLesson: true,
    };

    mockLessonBrowsePageProps.mockResolvedValue(legacyLessonData);

    const result = await getStaticProps({
      params: { lessonSlug: "old-fractions-lesson" },
    });

    // Oak handles legacy lessons with special props
    expect(result.props.isLegacyLesson).toBe(true);
  });
});
```

### 2. Testing getStaticPaths

```typescript
// Testing dynamic path generation
export async function getStaticPaths() {
  const lessons = await fetchPopularLessons(); // Pre-generate popular lessons

  const paths = lessons.map((lesson) => ({
    params: { lessonSlug: lesson.slug },
  }));

  return {
    paths,
    fallback: "blocking", // Generate other lessons on-demand
  };
}

// __tests__/pages/teachers/lessons/[lessonSlug].static-paths.test.ts - Oak's Strategic Pre-generation
import { getStaticPaths } from "@/pages/teachers/lessons/[lessonSlug]";
import { lessonSlugs } from "@/node-lib/curriculum-api-2023/queries";

// Mock Oak's curriculum API
jest.mock("@/node-lib/curriculum-api-2023/queries");
const mockLessonSlugs = lessonSlugs as jest.MockedFunction<typeof lessonSlugs>;

describe("Teacher Lesson Page getStaticPaths", () => {
  it("pre-generates paths for high-traffic lessons only", async () => {
    // Oak pre-generates popular lessons to reduce server load
    const popularLessonSlugs = [
      "introduction-to-fractions-6crp",
      "adding-fractions-with-same-denominator-6crt",
      "what-is-a-fraction-6crw",
      "equivalent-fractions-6cry",
    ];

    mockLessonSlugs.mockResolvedValue(popularLessonSlugs);

    const result = await getStaticPaths();

    expect(result).toEqual({
      paths: popularLessonSlugs.map((slug) => ({
        params: { lessonSlug: slug },
      })),
      fallback: "blocking", // Other lessons generated on-demand
    });
  });

  it("uses fallback blocking for performance", async () => {
    // Oak uses blocking fallback to ensure content is always available
    mockLessonSlugs.mockResolvedValue([]);

    const result = await getStaticPaths();

    expect(result.fallback).toBe("blocking");
    // Ensures teachers never see loading state for educational content
  });

  it("handles Sanity API failures during build", async () => {
    mockLessonSlugs.mockRejectedValue(new Error("Build-time API failure"));

    // Should provide fallback to prevent build failure
    const result = await getStaticPaths();

    expect(result).toEqual({
      paths: [], // No pre-generated paths if API fails
      fallback: "blocking", // All lessons generated on-demand
    });
  });
});
```

## Server-Side Rendering (SSR) Testing

### 1. Testing getServerSideProps

```typescript
// pages/teachers/search.tsx - Oak's teacher-focused search with real-time results
export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const searchTerm = query.q as string;
  const subject = query.subject as string;
  const keyStage = query.keyStage as string;
  const examBoard = query.examBoard as string;

  // Oak's search requires minimum search term length for performance
  if (!searchTerm || searchTerm.length < 2) {
    return {
      props: {
        searchResults: {
          lessons: [],
          units: [],
          programmes: [],
        },
        searchTerm: searchTerm || "",
        filters: {
          subjects: await fetchAvailableSubjects(),
          keyStages: await fetchAvailableKeyStages(),
          examBoards: await fetchAvailableExamBoards(),
        },
      },
    };
  }

  try {
    // Oak's comprehensive search across curriculum content
    const searchResults = await searchEducationalContent({
      term: searchTerm,
      subject,
      keyStage,
      examBoard,
      published: true, // Teachers only see published content
    });

    return {
      props: {
        searchResults,
        searchTerm,
        filters: {
          subjects: await fetchAvailableSubjects(),
          keyStages: await fetchAvailableKeyStages(),
          examBoards: await fetchAvailableExamBoards(),
        },
      },
    };
  } catch (error) {
    // Oak's graceful degradation for search failures
    console.error("Search API error:", error);

    return {
      props: {
        searchResults: { lessons: [], units: [], programmes: [] },
        searchTerm,
        error: "Search temporarily unavailable. Please try again.",
        filters: {
          subjects: [],
          keyStages: [],
          examBoards: [],
        },
      },
    };
  }
}

// __tests__/pages/teachers/search.test.ts - Oak's Educational Search Testing
import { getServerSideProps } from "@/pages/teachers/search";
import {
  searchEducationalContent,
  fetchAvailableSubjects,
  fetchAvailableKeyStages,
} from "@/node-lib/curriculum-api-2023";
import type { GetServerSidePropsContext } from "next";

// Mock Oak's search APIs
jest.mock("@/node-lib/curriculum-api-2023");
const mockSearchEducationalContent =
  searchEducationalContent as jest.MockedFunction<
    typeof searchEducationalContent
  >;
const mockFetchAvailableSubjects =
  fetchAvailableSubjects as jest.MockedFunction<typeof fetchAvailableSubjects>;
const mockFetchAvailableKeyStages =
  fetchAvailableKeyStages as jest.MockedFunction<
    typeof fetchAvailableKeyStages
  >;

describe("Teacher Search Page getServerSideProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default filter mocks
    mockFetchAvailableSubjects.mockResolvedValue([
      { slug: "mathematics", title: "Mathematics" },
      { slug: "english", title: "English" },
    ]);
    mockFetchAvailableKeyStages.mockResolvedValue([
      { slug: "ks1", title: "Key stage 1" },
      { slug: "ks2", title: "Key stage 2" },
    ]);
  });

  it("returns comprehensive search results for teachers", async () => {
    const mockSearchResults = {
      lessons: [createMockLesson({ title: "Introduction to Fractions" })],
      units: [createMockUnit({ title: "Fractions and Decimals" })],
      programmes: [createMockProgramme({ title: "Mathematics KS2" })],
    };

    mockSearchEducationalContent.mockResolvedValue(mockSearchResults);

    const context: GetServerSidePropsContext = {
      query: {
        q: "fractions",
        subject: "mathematics",
        keyStage: "ks2",
      },
    };

    const result = await getServerSideProps(context);

    expect(result.props.searchResults).toEqual(mockSearchResults);
    expect(result.props.searchTerm).toBe("fractions");
    expect(mockSearchEducationalContent).toHaveBeenCalledWith({
      term: "fractions",
      subject: "mathematics",
      keyStage: "ks2",
      examBoard: undefined,
      published: true, // Only published content for teachers
    });
  });

  it("enforces minimum search term length for performance", async () => {
    const result = await getServerSideProps({
      query: { q: "a" }, // Too short
    });

    expect(result.props.searchResults).toEqual({
      lessons: [],
      units: [],
      programmes: [],
    });
    expect(mockSearchEducationalContent).not.toHaveBeenCalled();
  });

  it("provides filter options for educational browsing", async () => {
    const result = await getServerSideProps({
      query: { q: "mathematics" },
    });

    expect(result.props.filters).toEqual({
      subjects: expect.arrayContaining([
        { slug: "mathematics", title: "Mathematics" },
      ]),
      keyStages: expect.arrayContaining([
        { slug: "ks1", title: "Key stage 1" },
      ]),
      examBoards: expect.any(Array),
    });
  });

  it("handles search API failures gracefully for teachers", async () => {
    mockSearchEducationalContent.mockRejectedValue(
      new Error("Search service unavailable"),
    );

    const result = await getServerSideProps({
      query: { q: "mathematics" },
    });

    expect(result.props.error).toBe(
      "Search temporarily unavailable. Please try again.",
    );
    expect(result.props.searchResults).toEqual({
      lessons: [],
      units: [],
      programmes: [],
    });
  });

  it("filters results to published content only", async () => {
    await getServerSideProps({
      query: { q: "test lesson" },
    });

    expect(mockSearchEducationalContent).toHaveBeenCalledWith(
      expect.objectContaining({
        published: true, // Teachers should never see draft content
      }),
    );
  });
});
```

### 2. Testing SSR Page Components

```typescript
// Testing Oak's teacher search page component with accessibility focus
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/__tests__/test-utils';
import TeacherSearchPage from '@/pages/teachers/search';

describe('Teacher Search Page Component', () => {
  it('displays comprehensive search results accessibly', () => {
    const props = {
      searchResults: {
        lessons: [
          createMockLesson({ title: 'Introduction to Fractions' }),
          createMockLesson({ title: 'Adding Fractions' })
        ],
        units: [
          createMockUnit({ title: 'Fractions and Decimals' })
        ],
        programmes: []
      },
      searchTerm: 'fractions',
      filters: {
        subjects: [{ slug: 'mathematics', title: 'Mathematics' }],
        keyStages: [{ slug: 'ks2', title: 'Key stage 2' }],
        examBoards: []
      }
    };

    renderWithProviders(<TeacherSearchPage {...props} />);

    // Results should be organized in accessible sections
    expect(screen.getByRole('region', { name: /lesson results/i }))
      .toBeInTheDocument();
    expect(screen.getByRole('region', { name: /unit results/i }))
      .toBeInTheDocument();

    // Individual results should be accessible
    expect(screen.getByRole('heading', { name: /introduction to fractions/i }))
      .toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /fractions and decimals/i }))
      .toBeInTheDocument();
  });

  it('provides accessible search form for teachers', async () => {
    const user = userEvent.setup();
    const props = {
      searchResults: { lessons: [], units: [], programmes: [] },
      searchTerm: '',
      filters: {
        subjects: [{ slug: 'mathematics', title: 'Mathematics' }],
        keyStages: [{ slug: 'ks2', title: 'Key stage 2' }],
        examBoards: []
      }
    };

    renderWithProviders(<TeacherSearchPage {...props} />);

    // Search form should be properly labeled
    const searchInput = screen.getByLabelText(/search for lessons/i);
    expect(searchInput).toBeInTheDocument();

    const subjectFilter = screen.getByLabelText(/filter by subject/i);
    expect(subjectFilter).toBeInTheDocument();

    // Form should support keyboard navigation
    await user.tab();
    expect(searchInput).toHaveFocus();

    await user.type(searchInput, 'algebra');
    expect(searchInput).toHaveValue('algebra');
  });

  it('shows helpful empty state for teachers', () => {
    const props = {
      searchResults: { lessons: [], units: [], programmes: [] },
      searchTerm: 'nonexistent topic',
      filters: {
        subjects: [],
        keyStages: [],
        examBoards: []
      }
    };

    renderWithProviders(<TeacherSearchPage {...props} />);

    // Empty state should provide guidance
    expect(screen.getByRole('heading', { name: /no results found/i }))
      .toBeInTheDocument();
    expect(screen.getByText(/try adjusting your search/i))
      .toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear filters/i }))
      .toBeInTheDocument();
  });

  it('handles search errors gracefully', () => {
    const props = {
      searchResults: { lessons: [], units: [], programmes: [] },
      searchTerm: 'test',
      error: 'Search temporarily unavailable. Please try again.',
      filters: { subjects: [], keyStages: [], examBoards: [] }
    };

    renderWithProviders(<TeacherSearchPage {...props} />);

    // Error should be announced to screen readers
    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toHaveTextContent(/search temporarily unavailable/i);

    // Should provide retry option
    expect(screen.getByRole('button', { name: /try again/i }))
      .toBeInTheDocument();
  });
});
```

## API Routes Testing

### 1. API Route Testing Framework

```typescript
// __tests__/api-test-utils.ts
import { createMocks } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";

export function createApiMocks<T = any>(options: {
  method?: string;
  query?: Record<string, string>;
  body?: T;
  headers?: Record<string, string>;
}) {
  return createMocks<NextApiRequest, NextApiResponse>({
    method: options.method || "GET",
    query: options.query || {},
    body: options.body,
    headers: options.headers || {},
  });
}

export function expectApiResponse(
  res: NextApiResponse,
  expectedStatus: number,
) {
  expect(res._getStatusCode()).toBe(expectedStatus);
  return {
    toHaveData: (expectedData: any) => {
      const data = JSON.parse(res._getData());
      expect(data).toEqual(expectedData);
    },
    toHaveError: (expectedMessage: string) => {
      const data = JSON.parse(res._getData());
      expect(data.error).toBe(expectedMessage);
    },
  };
}
```

### 2. Testing GET API Routes

```typescript
// pages/api/2023-curriculum/programmes/[programmeSlug]/units.ts - Oak's Actual API Pattern
import type { NextApiRequest, NextApiResponse } from "next";
import { programmeUnits } from "@/node-lib/curriculum-api-2023/queries";
import type { ProgrammeUnitsPageData } from "@/node-lib/curriculum-api-2023/queries";
import { setCommonCorsHeaders } from "@/utils/cors";
import { rateLimit } from "@/utils/rateLimit";

type ApiError = {
  error: string;
  statusCode: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProgrammeUnitsPageData | ApiError>,
) {
  // Oak's CORS and rate limiting
  setCommonCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
      statusCode: 405,
    });
  }

  // Apply rate limiting for API protection
  try {
    await rateLimit(req, res);
  } catch {
    return res.status(429).json({
      error: "Too many requests",
      statusCode: 429,
    });
  }

  const { programmeSlug } = req.query;

  if (!programmeSlug || typeof programmeSlug !== "string") {
    return res.status(400).json({
      error: "Programme slug is required",
      statusCode: 400,
    });
  }

  try {
    const unitsData = await programmeUnits({ programmeSlug });

    if (!unitsData) {
      return res.status(404).json({
        error: "Programme not found or has no published units",
        statusCode: 404,
      });
    }

    // Oak includes cache headers for performance
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400",
    );
    res.status(200).json(unitsData);
  } catch (error) {
    console.error("API Error:", error);

    // Oak's structured error response
    res.status(500).json({
      error: "Failed to fetch programme units",
      statusCode: 500,
    });
  }
}

// __tests__/api/2023-curriculum/programmes/[programmeSlug]/units.test.ts - Oak's API Testing
import handler from "@/pages/api/2023-curriculum/programmes/[programmeSlug]/units";
import { programmeUnits } from "@/node-lib/curriculum-api-2023/queries";
import { createApiMocks, expectApiResponse } from "@/__tests__/api-test-utils";
import { rateLimit } from "@/utils/rateLimit";

// Mock Oak's curriculum API and rate limiting
jest.mock("@/node-lib/curriculum-api-2023/queries");
jest.mock("@/utils/rateLimit");

const mockProgrammeUnits = programmeUnits as jest.MockedFunction<
  typeof programmeUnits
>;
const mockRateLimit = rateLimit as jest.MockedFunction<typeof rateLimit>;

describe("/api/2023-curriculum/programmes/[programmeSlug]/units", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRateLimit.mockResolvedValue(undefined); // Allow requests by default
  });

  it("returns programme units for valid slug", async () => {
    const mockUnitsData = {
      programme: createMockProgramme({
        slug: "mathematics-secondary-ks3",
        title: "Mathematics Key stage 3",
      }),
      units: [
        createMockUnit({ title: "Number", order: 1 }),
        createMockUnit({ title: "Algebra", order: 2 }),
      ],
    };

    mockProgrammeUnits.mockResolvedValue(mockUnitsData);

    const { req, res } = createApiMocks({
      method: "GET",
      query: { programmeSlug: "mathematics-secondary-ks3" },
    });

    await handler(req, res);

    expectApiResponse(res, 200).toHaveData(mockUnitsData);
    expect(mockProgrammeUnits).toHaveBeenCalledWith({
      programmeSlug: "mathematics-secondary-ks3",
    });

    // Verify cache headers for performance
    expect(res.getHeader("Cache-Control")).toBe(
      "public, s-maxage=3600, stale-while-revalidate=86400",
    );
  });

  it("handles missing programme slug", async () => {
    const { req, res } = createApiMocks({
      method: "GET",
      query: {}, // Missing programmeSlug
    });

    await handler(req, res);

    expectApiResponse(res, 400).toHaveError("Programme slug is required");
    expect(mockProgrammeUnits).not.toHaveBeenCalled();
  });

  it("returns 404 for non-existent programme", async () => {
    mockProgrammeUnits.mockResolvedValue(null);

    const { req, res } = createApiMocks({
      method: "GET",
      query: { programmeSlug: "non-existent-programme" },
    });

    await handler(req, res);

    expectApiResponse(res, 404).toHaveError(
      "Programme not found or has no published units",
    );
  });

  it("applies rate limiting protection", async () => {
    mockRateLimit.mockRejectedValue(new Error("Rate limit exceeded"));

    const { req, res } = createApiMocks({
      method: "GET",
      query: { programmeSlug: "test-programme" },
    });

    await handler(req, res);

    expectApiResponse(res, 429).toHaveError("Too many requests");
    expect(mockProgrammeUnits).not.toHaveBeenCalled();
  });

  it("handles CORS preflight requests", async () => {
    const { req, res } = createApiMocks({
      method: "OPTIONS",
      query: { programmeSlug: "test" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(mockProgrammeUnits).not.toHaveBeenCalled();
  });

  it("handles Sanity API errors gracefully", async () => {
    mockProgrammeUnits.mockRejectedValue(new Error("Sanity API error"));

    const { req, res } = createApiMocks({
      method: "GET",
      query: { programmeSlug: "test-programme" },
    });

    await handler(req, res);

    expectApiResponse(res, 500).toHaveError("Failed to fetch programme units");
  });

  it("validates HTTP methods correctly", async () => {
    const { req, res } = createApiMocks({
      method: "POST", // Not allowed
      query: { programmeSlug: "test" },
    });

    await handler(req, res);

    expectApiResponse(res, 405).toHaveError("Method not allowed");
  });
});
```

### 3. Testing POST API Routes

```typescript
// pages/api/lessons/bookmark.ts - Teacher bookmarking API
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { lessonId, teacherId } = req.body;

  if (!lessonId || !teacherId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const bookmark = await toggleLessonBookmark(lessonId, teacherId);
    res.status(200).json(bookmark);
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle bookmark" });
  }
}

// __tests__/api/lessons/bookmark.test.ts
describe("/api/lessons/bookmark", () => {
  it("creates bookmark for valid lesson and teacher", async () => {
    const mockBookmark = {
      lessonId: "lesson-123",
      teacherId: "teacher-456",
      bookmarked: true,
    };
    vi.mocked(toggleLessonBookmark).mockResolvedValue(mockBookmark);

    const { req, res } = createApiMocks({
      method: "POST",
      body: { lessonId: "lesson-123", teacherId: "teacher-456" },
    });

    await handler(req, res);

    expectApiResponse(res, 200).toHaveData(mockBookmark);
  });

  it("validates required fields", async () => {
    const { req, res } = createApiMocks({
      method: "POST",
      body: { lessonId: "lesson-123" }, // Missing teacherId
    });

    await handler(req, res);

    expectApiResponse(res, 400).toHaveError("Missing required fields");
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
describe("Lesson Page ISR", () => {
  it("revalidates lesson data hourly", async () => {
    const props = await getStaticProps({
      params: { lessonSlug: "test-lesson" },
    });

    expect(props).toMatchObject({
      props: expect.any(Object),
      revalidate: 3600, // 1 hour in seconds
    });
  });

  it("handles revalidation failures gracefully", async () => {
    // Simulate API failure during revalidation
    vi.mocked(fetchLessonBySlug).mockRejectedValue(
      new Error("API unavailable"),
    );

    // Should still return cached version or handle gracefully
    await expect(
      getStaticProps({
        params: { lessonSlug: "test-lesson" },
      }),
    ).rejects.toThrow("API unavailable");
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
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isTeacherRoute = request.nextUrl.pathname.startsWith("/teachers");
  const authToken = request.cookies.get("auth-token");

  if (isTeacherRoute && !authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// __tests__/middleware.test.ts
import { middleware } from "../middleware";
import { NextRequest, NextResponse } from "next/server";

describe("Teacher Auth Middleware", () => {
  it("redirects unauthenticated users from teacher routes", () => {
    const request = new NextRequest(
      new URL("/teachers/lessons", "http://localhost"),
    );
    // No auth token cookie

    const response = middleware(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("location")).toBe("http://localhost/login");
  });

  it("allows authenticated users to access teacher routes", () => {
    const request = new NextRequest(
      new URL("/teachers/lessons", "http://localhost"),
    );
    request.cookies.set("auth-token", "valid-token");

    const response = middleware(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("location")).toBeNull();
  });

  it("allows public routes without authentication", () => {
    const request = new NextRequest(new URL("/about", "http://localhost"));

    const response = middleware(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("location")).toBeNull();
  });
});
```

## Performance Testing

### 1. Core Web Vitals Testing

```typescript
// __tests__/performance/web-vitals.test.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

describe("Core Web Vitals", () => {
  it("measures lesson page performance", async () => {
    const vitals: Record<string, number> = {};

    getCLS((metric) => {
      vitals.CLS = metric.value;
    });
    getFID((metric) => {
      vitals.FID = metric.value;
    });
    getFCP((metric) => {
      vitals.FCP = metric.value;
    });
    getLCP((metric) => {
      vitals.LCP = metric.value;
    });
    getTTFB((metric) => {
      vitals.TTFB = metric.value;
    });

    // Simulate page interaction
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Assert performance thresholds
    expect(vitals.LCP).toBeLessThan(2500); // 2.5s threshold
    expect(vitals.FID).toBeLessThan(100); // 100ms threshold
    expect(vitals.CLS).toBeLessThan(0.1); // 0.1 threshold
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
import { setConfig } from "next/config";
import config from "../next.config.js";

// Make Next.js config available in tests
setConfig({
  serverRuntimeConfig: config.serverRuntimeConfig,
  publicRuntimeConfig: config.publicRuntimeConfig,
});
```

## Oak-Specific Next.js Patterns

### 1. Educational Content Flow Testing

```typescript
// Testing Oak's actual curriculum hierarchy and content strategy
describe("Programme Units SSG Flow", () => {
  it("generates pages for all published programmes", async () => {
    const mockProgrammeSlugs = [
      "mathematics-primary-ks1",
      "mathematics-primary-ks2",
      "mathematics-secondary-ks3",
      "english-primary-ks1",
      "english-primary-ks2",
      "science-secondary-ks3",
    ];

    mockFetchAllProgrammeSlugs.mockResolvedValue(mockProgrammeSlugs);

    const paths = await getStaticPaths();

    expect(paths.paths).toEqual(
      expect.arrayContaining(
        mockProgrammeSlugs.map((slug) => ({
          params: { programmeSlug: slug },
        })),
      ),
    );
    expect(paths.fallback).toBe(false); // All programmes pre-generated
  });

  it("separates teacher and pupil content paths", async () => {
    // Oak has different paths for teacher vs pupil experiences
    const teacherPaths = await getStaticPaths({ context: "teacher" });
    const pupilPaths = await getStaticPaths({ context: "pupil" });

    expect(teacherPaths.paths[0].params).toEqual(
      expect.objectContaining({
        programmeSlug: expect.any(String),
        audience: "teachers",
      }),
    );

    expect(pupilPaths.paths[0].params).toEqual(
      expect.objectContaining({
        programmeSlug: expect.any(String),
        audience: "pupils",
      }),
    );
  });
});
```

### 2. Educational SEO and Accessibility Testing

```typescript
describe('Oak Lesson Page SEO and Accessibility', () => {
  it('generates comprehensive educational metadata', () => {
    const lesson = createMockLesson({
      title: 'Introduction to Fractions',
      description: 'Learn about fractions using visual diagrams and practical examples',
      subject: 'mathematics',
      keyStage: 'key-stage-2',
      year: '3'
    });

    render(<LessonPage lesson={lesson} />);

    // Oak's structured title format for SEO
    expect(document.title)
      .toBe('Introduction to Fractions | Year 3 Mathematics | Oak National Academy');

    // Educational content description
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content'))
      .toContain('Learn about fractions using visual diagrams');

    // Oak includes curriculum metadata for educational search
    expect(document.querySelector('meta[name="curriculum.subject"]')?.getAttribute('content'))
      .toBe('mathematics');
    expect(document.querySelector('meta[name="curriculum.keyStage"]')?.getAttribute('content'))
      .toBe('key-stage-2');

    // Accessibility: proper heading structure
    const mainHeading = document.querySelector('h1');
    expect(mainHeading).toHaveTextContent('Introduction to Fractions');
    expect(mainHeading).toHaveAttribute('id'); // For skip links
  });

  it('includes structured data for educational content', () => {
    const lesson = createMockLesson();
    render(<LessonPage lesson={lesson} />);

    // Oak uses JSON-LD for educational content discovery
    const structuredData = document.querySelector('script[type="application/ld+json"]');
    expect(structuredData).toBeInTheDocument();

    const data = JSON.parse(structuredData?.textContent || '{}');
    expect(data['@type']).toBe('LearningResource');
    expect(data.educationalLevel).toBeDefined();
    expect(data.teaches).toBeDefined();
  });

  it('provides proper navigation landmarks for accessibility', () => {
    render(<LessonPage lesson={createMockLesson()} />);

    // Oak ensures proper landmark structure for screen readers
    expect(document.querySelector('nav[aria-label="breadcrumb"]'))
      .toBeInTheDocument();
    expect(document.querySelector('main'))
      .toBeInTheDocument();
    expect(document.querySelector('aside[aria-label="lesson resources"]'))
      .toBeInTheDocument();
  });
});
```

---

## Performance Testing for Educational Content

### 1. Oak-Specific Performance Metrics

```typescript
// Testing performance with educational content in mind
describe("Educational Content Performance", () => {
  it("loads lesson pages within classroom connection constraints", async () => {
    // Oak optimizes for variable school internet connections
    const performanceEntry = await measurePageLoad(
      "/teachers/lessons/test-lesson",
    );

    expect(performanceEntry.loadTime).toBeLessThan(3000); // 3s for slow connections
    expect(performanceEntry.firstContentfulPaint).toBeLessThan(1500);
    expect(performanceEntry.largestContentfulPaint).toBeLessThan(2500);
  });

  it("prioritizes critical educational resources", async () => {
    // Test that lesson video and worksheets load first
    const resourcePriority = await analyzeResourceLoading();

    expect(resourcePriority.videoThumbnail).toBe("high");
    expect(resourcePriority.worksheetPDF).toBe("high");
    expect(resourcePriority.decorativeImages).toBe("low");
  });
});
```

### 2. Accessibility Performance Testing

```typescript
describe('Accessible Performance', () => {
  it('maintains screen reader performance under load', async () => {
    // Test that ARIA announcements don't lag during content updates
    const { container } = render(<LessonProgress lessons={largeLessonSet} />);

    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();

    // Simulate progress update
    fireEvent.click(screen.getByRole('button', { name: /next lesson/i }));

    // Should announce within 100ms for good UX
    await waitFor(() => {
      expect(liveRegion).toHaveTextContent(/now viewing lesson/i);
    }, { timeout: 100 });
  });
});
```

## Best Practices Summary for Oak

### 1. Educational Content Strategy

- **Pre-generate popular lessons** to reduce server load during peak usage
- **Use blocking fallback** to ensure content is always available to teachers
- **Separate teacher/pupil rendering paths** for role-specific experiences
- **Include curriculum metadata** in all pages for educational search

### 2. Performance for Educational Context

- **Optimize for variable school internet** with aggressive caching
- **Prioritize educational resources** (videos, worksheets) over decorative content
- **Test Core Web Vitals** with realistic educational content sizes
- **Monitor API performance** for curriculum data fetching

### 3. Accessibility-First Next.js Testing

- **Test SSR content accessibility** before hydration
- **Validate semantic HTML structure** in generated pages
- **Test focus management** across route transitions
- **Ensure ARIA announcements** work with dynamic content

### 4. Type Safety in Next.js Testing

- **Mock APIs with TypeScript** for better test reliability
- **Type getStaticProps/getServerSideProps** return values
- **Use typed query parameters** for route testing
- **Validate API response shapes** match expected types

---

_These Next.js testing patterns ensure Oak's educational platform delivers reliable, performant, and accessible experiences for teachers and students across all rendering strategies and network conditions._
