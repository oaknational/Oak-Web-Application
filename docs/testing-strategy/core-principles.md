# Core Testing Principles

Foundation testing practices for Oak's educational platform.

## Quality Standards

All tests are evaluated using the [Test Quality Rubric](./test-quality-rubrics.md) (1-10 scale) with context-aware scoring:

- **Unit Tests**: Focus on testable patterns, descriptive names, and comprehensive coverage
- **Integration Tests**: Include domain modeling and accessibility (for React components)
- **API Tests**: Emphasize comprehensive coverage, testable patterns, and descriptive names

**Key Principle**: Prefer unit tests of pure functions. If it contains a mock, it is not a unit test - can it be refactored to be a unit test?

## Test Type Definitions

### Out-of-Process Tests (Current Oak Standard)
All IO is refactored out or mocked:

- **Unit Tests**: Pure functions with no IO to mock by definition
- **Integration Tests**: Multiple units working together, all IO mocked  
- **Component Tests**: React components with all IO mocked (APIs, file system)
- **API Tests**: Route handlers with database/external service calls mocked
- **Contract Tests**: API contract validation with external dependencies mocked

### In-Process Tests (Not Currently Used)
Real IO operations - for future consideration:

- **End-to-End Tests**: Real browser, real database, real external services
- **System Integration Tests**: Real database connections, real file system  
- **Service Integration Tests**: Real external API calls
- **Database Integration Tests**: Real database operations
- **Performance Tests**: Real infrastructure under load

## Test-Driven Development (TDD)

All new code must use TDD workflow.

#### The TDD Cycle

1. **Red**: Write a failing test that describes the desired behavior
2. **Green**: Write the minimal code to make the test pass
3. **Refactor**: Improve the code while keeping tests green
4. **Repeat**: Continue this cycle for each new feature or change

#### TDD Benefits

- Better component design
- Safe refactoring
- Living documentation
- Edge case coverage

```typescript
// Example: TDD for Oak curriculum logic (from actual research findings)
describe("areLessonsAvailable", () => {
  it("should return false when no lessons are published", () => {
    // Red: This test will fail because function doesn't exist yet
    const noPublishedLessons = [
      { title: "Lesson 1", _state: "new" },
      { title: "Lesson 2", _state: "new" },
    ];
    expect(areLessonsAvailable(noPublishedLessons)).toBe(false);
  });

  it("should return true when at least one lesson is published", () => {
    const mixedLessons = [
      { title: "Lesson 1", _state: "new" },
      { title: "Lesson 2", _state: "published" },
    ];
    expect(areLessonsAvailable(mixedLessons)).toBe(true);
  });
});

// Green: Write minimal implementation
export function areLessonsAvailable(
  lessons: Array<{ _state: string }>,
): boolean {
  return lessons.some((lesson) => lesson._state === "published");
}

// Refactor: Add type safety, handle edge cases
export function areLessonsAvailable(lessons: Lesson[]): boolean {
  if (!lessons || lessons.length === 0) return false;
  return lessons.some((lesson) => lesson._state === "published");
}
```

## Pure Functions

Extract business logic into pure functions wherever possible.

#### Benefits of Pure Functions

- **Easily Testable**: No mocking required
- **Predictable**: Same input always produces same output
- **Composable**: Can be combined safely
- **Parallelizable**: No shared state concerns
- **Cacheable**: Results can be memoized

```typescript
// Pure function - preferred
export function formatCurriculumTitle(
  subject: string,
  keyStage: string,
): string {
  return `${subject} - Key Stage ${keyStage}`;
}

// Impure function - needs refactoring
function displayCurriculumTitle(subject: string, keyStage: string): void {
  const title = `${subject} - Key Stage ${keyStage}`;
  document.title = title; // Side effect!
  console.log(title); // Side effect!
}

// Refactored: Separate pure logic from side effects
export function createCurriculumTitle(
  subject: string,
  keyStage: string,
): string {
  return `${subject} - Key Stage ${keyStage}`;
}

function displayTitle(title: string): void {
  document.title = title;
  console.log(title);
}
```

## Testing Categories and Their Purpose

### Unit Tests: The Foundation

**Test pure functions and isolated units of logic.**

```typescript
// Oak example: Testing curriculum data transformation (from actual codebase patterns)
describe("getLessonCount", () => {
  it("should extract lesson count from unit data", () => {
    const unitData = {
      title: "Fractions and Decimals",
      lessons: [
        {
          slug: "intro-to-fractions",
          title: "Introduction to Fractions",
          _state: "published",
        },
        {
          slug: "adding-fractions",
          title: "Adding Fractions",
          _state: "published",
        },
      ],
    };

    expect(getLessonCount(unitData)).toBe(2);
  });

  it("should handle units with no lessons", () => {
    const emptyUnit = { title: "Empty Unit", lessons: [] };
    expect(getLessonCount(emptyUnit)).toBe(0);
  });

  it("should handle units with mixed published/unpublished lessons", () => {
    const mixedUnit = {
      title: "Number and Place Value",
      lessons: [
        {
          slug: "place-value-basics",
          title: "Place Value Basics",
          _state: "published",
        },
        {
          slug: "advanced-place-value",
          title: "Advanced Place Value",
          _state: "new",
        },
      ],
    };
    expect(getLessonCount(mixedUnit)).toBe(2); // Count all lessons, not just published
  });
});
```

### Component Tests: User-Focused

**Test React components from the user's perspective using React Testing Library.**

```typescript
// Oak example: Testing teacher lesson overview (from actual research findings)
import { render, screen } from "@testing-library/react";
import { LessonOverviewHeader } from "@/components/TeacherComponents/LessonOverviewHeader";

describe("LessonOverviewHeader", () => {
  const defaultProps = {
    lesson: {
      title: "Introduction to Fractions",
      subject: "Mathematics",
      keyStage: "KS2",
      expired: false
    },
    showDownloadAll: true
  };

  it("renders the download button when lesson is not expired and download is enabled", () => {
    const { getAllByTestId } = render(<LessonOverviewHeader {...defaultProps} />);

    // Tests real Oak teacher workflow - download functionality is key feature
    expect(getAllByTestId("download-all-button")).toHaveLength(2); // mobile and desktop
  });

  it("hides download button when lesson is expired", () => {
    const expiredProps = { ...defaultProps, lesson: { ...defaultProps.lesson, expired: true } };
    const { queryByTestId } = render(<LessonOverviewHeader {...expiredProps} />);

    expect(queryByTestId("download-all-button")).not.toBeInTheDocument();
  });
});
```

### Integration Tests: System Boundaries

**Test how multiple units work together, with external dependencies mocked.**

```typescript
// Oak example: Testing lesson data flow
describe("LessonDataFlow", () => {
  beforeEach(() => {
    vi.mock("../api/curriculum", () => ({
      fetchLessonData: vi.fn().mockResolvedValue(mockLessonData),
    }));
  });

  it("should transform and display lesson data correctly", async () => {
    const { result } = renderHook(() => useLessonData("lesson-123"));

    await waitFor(() => {
      expect(result.current.lesson.title).toBe("Introduction to Algebra");
      expect(result.current.lesson.duration).toBe(45);
    });
  });
});
```

## Design for Testability

### Component Composition

**Build components that are naturally testable through composition.**

```typescript
// Hard to test - mixed concerns
function LessonPageBad({ lessonId }: { lessonId: string }) {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLesson(lessonId).then(data => {
      setLesson(data);
      setLoading(false);
      // Side effect mixed with logic
      document.title = `${data.title} - Oak National Academy`;
    });
  }, [lessonId]);

  if (loading) return <div>Loading...</div>;
  return <div>{lesson?.title}</div>;
}

// Easy to test - separated concerns
function LessonPage({ lesson }: { lesson: Lesson }) {
  return (
    <div>
      <LessonTitle title={lesson.title} />
      <LessonContent content={lesson.content} />
    </div>
  );
}

function LessonPageContainer({ lessonId }: { lessonId: string }) {
  const { lesson, loading } = useLessonData(lessonId);

  useDocumentTitle(lesson ? `${lesson.title} - Oak National Academy` : "Loading...");

  if (loading) return <LoadingSpinner />;
  return <LessonPage lesson={lesson} />;
}
```

### Dependency Injection

**Make dependencies explicit and injectable for easier testing.**

```typescript
// Hard to test - hidden dependencies
export class LessonService {
  async getLesson(id: string): Promise<Lesson> {
    const response = await fetch(`/api/lessons/${id}`); // Hidden dependency
    return response.json();
  }
}

// Easy to test - injected dependencies
export class LessonService {
  constructor(private httpClient: HttpClient) {}

  async getLesson(id: string): Promise<Lesson> {
    const response = await this.httpClient.get(`/api/lessons/${id}`);
    return response.data;
  }
}

// In tests
const mockHttpClient = {
  get: vi.fn().mockResolvedValue({ data: mockLesson }),
};
const lessonService = new LessonService(mockHttpClient);
```

## Implementation Guidelines

### Starting with TDD

1. Define expected behavior
2. Write failing test
3. Minimal implementation to pass
4. Refactor while keeping tests green
5. Repeat for next feature

### Refactoring Existing Code

1. **Add Characterization Tests**: Test current behavior first
2. **Extract Pure Functions**: Pull logic out of side effects
3. **Isolate Dependencies**: Make external dependencies explicit
4. **Improve Gradually**: Small, safe steps with tests protecting each change

### Team Integration

- Code reviews include TDD and testability checks
- Pair programming for TDD knowledge sharing
- Regular retrospectives on testing effectiveness
- Mentoring on TDD techniques

## Success Indicators

### Technical Indicators

- Tests are written before implementation code
- Functions are predominantly pure and easily testable
- Mock usage is minimal and focused on boundaries
- Refactoring is safe and frequent

### Cultural Indicators

- Developers naturally reach for tests first
- Architecture discussions include testability considerations
- Test quality is a source of pride, not an afterthought
- Team members help each other improve testing practices
