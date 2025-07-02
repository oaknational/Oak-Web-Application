# React Component Testing

**Testing React components using React Testing Library with Jest for the Oak Web Application**

## Testing Philosophy

React Testing Library encourages testing from the user's perspective rather than implementation details. This aligns with Oak's mission of focusing on educational outcomes over technical complexity.

## Essential Patterns

### 1. Component Rendering and Queries

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LessonCard } from "./LessonCard";

describe("LessonCard", () => {
  const defaultProps = {
    lesson: {
      id: "lesson-123",
      title: "Introduction to Fractions",
      subject: "Mathematics",
      keyStage: "KS2",
      duration: 45,
      completed: false
    },
    onStart: vi.fn()
  };

  it("displays lesson information to teachers", () => {
    render(<LessonCard {...defaultProps} />);
    
    // Query by what users see
    expect(screen.getByText("Introduction to Fractions")).toBeInTheDocument();
    expect(screen.getByText("Mathematics")).toBeInTheDocument();
    expect(screen.getByText("45 minutes")).toBeInTheDocument();
    expect(screen.getByText("Key Stage 2")).toBeInTheDocument();
  });

  it("shows start button for incomplete lessons", () => {
    render(<LessonCard {...defaultProps} />);
    
    const startButton = screen.getByRole("button", { name: /start lesson/i });
    expect(startButton).toBeInTheDocument();
  });

  it("hides start button for completed lessons", () => {
    const completedLesson = { ...defaultProps.lesson, completed: true };
    render(<LessonCard {...defaultProps} lesson={completedLesson} />);
    
    expect(screen.queryByRole("button", { name: /start lesson/i })).not.toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });
});
```

### 2. User Interactions

```typescript
describe("LessonCard interactions", () => {
  it("calls onStart when start button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnStart = vi.fn();
    
    render(<LessonCard {...defaultProps} onStart={mockOnStart} />);
    
    const startButton = screen.getByRole("button", { name: /start lesson/i });
    await user.click(startButton);
    
    expect(mockOnStart).toHaveBeenCalledWith("lesson-123");
  });

  it("handles lesson bookmark toggle", async () => {
    const user = userEvent.setup();
    const mockOnBookmark = vi.fn();
    
    render(<LessonCard {...defaultProps} onBookmark={mockOnBookmark} />);
    
    const bookmarkButton = screen.getByRole("button", { name: /bookmark lesson/i });
    await user.click(bookmarkButton);
    
    expect(mockOnBookmark).toHaveBeenCalledWith("lesson-123", true);
  });
});
```

### 3. Conditional Rendering

```typescript
describe("LessonCard conditional rendering", () => {
  it("shows progress indicator for partially completed lessons", () => {
    const partialLesson = { 
      ...defaultProps.lesson, 
      progress: 60,
      completed: false 
    };
    
    render(<LessonCard {...defaultProps} lesson={partialLesson} />);
    
    expect(screen.getByText("60% complete")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "60");
  });

  it("displays prerequisite warning for advanced lessons", () => {
    const advancedLesson = { 
      ...defaultProps.lesson,
      prerequisites: ["basic-fractions"],
      hasPrerequisites: false
    };
    
    render(<LessonCard {...defaultProps} lesson={advancedLesson} />);
    
    expect(screen.getByText(/prerequisite lessons required/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start lesson/i })).toBeDisabled();
  });
});
```

### 4. Form Testing

```typescript
// Oak-specific: Teacher lesson search form
describe("LessonSearchForm", () => {
  it("filters lessons by subject and key stage", async () => {
    const user = userEvent.setup();
    const mockOnSearch = vi.fn();
    
    render(<LessonSearchForm onSearch={mockOnSearch} />);
    
    // Select subject
    const subjectSelect = screen.getByLabelText(/subject/i);
    await user.selectOptions(subjectSelect, "mathematics");
    
    // Select key stage
    const keyStageSelect = screen.getByLabelText(/key stage/i);
    await user.selectOptions(keyStageSelect, "ks2");
    
    // Enter search term
    const searchInput = screen.getByLabelText(/search lessons/i);
    await user.type(searchInput, "fractions");
    
    // Submit form
    const searchButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith({
      subject: "mathematics",
      keyStage: "ks2",
      query: "fractions"
    });
  });

  it("validates required fields", async () => {
    const user = userEvent.setup();
    
    render(<LessonSearchForm onSearch={vi.fn()} />);
    
    const searchButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchButton);
    
    expect(screen.getByText(/subject is required/i)).toBeInTheDocument();
    expect(screen.getByText(/key stage is required/i)).toBeInTheDocument();
  });
});
```

### 5. Loading and Error States

```typescript
describe("LessonListContainer", () => {
  it("shows loading spinner while fetching lessons", () => {
    render(<LessonListContainer isLoading={true} lessons={[]} error={null} />);
    
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(/loading lessons/i)).toBeInTheDocument();
  });

  it("displays error message when fetch fails", () => {
    const error = { message: "Failed to load lessons" };
    
    render(<LessonListContainer isLoading={false} lessons={[]} error={error} />);
    
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/failed to load lessons/i)).toBeInTheDocument();
  });

  it("shows empty state when no lessons found", () => {
    render(<LessonListContainer isLoading={false} lessons={[]} error={null} />);
    
    expect(screen.getByText(/no lessons found/i)).toBeInTheDocument();
    expect(screen.getByText(/try adjusting your search/i)).toBeInTheDocument();
  });
});
```

## Oak-Specific Testing Patterns

### 1. Curriculum Data Testing

```typescript
describe("CurriculumOverview", () => {
  const mockCurriculumData = {
    subject: "Mathematics",
    keyStage: "KS2",
    units: [
      {
        id: "unit-1",
        title: "Number and Place Value",
        lessonCount: 8,
        estimatedDuration: "6 hours"
      },
      {
        id: "unit-2", 
        title: "Addition and Subtraction",
        lessonCount: 12,
        estimatedDuration: "9 hours"
      }
    ]
  };

  it("displays curriculum structure for teachers", () => {
    render(<CurriculumOverview curriculum={mockCurriculumData} />);
    
    expect(screen.getByText("Mathematics - Key Stage 2")).toBeInTheDocument();
    expect(screen.getByText("Number and Place Value")).toBeInTheDocument();
    expect(screen.getByText("8 lessons")).toBeInTheDocument();
    expect(screen.getByText("6 hours")).toBeInTheDocument();
  });

  it("calculates total curriculum duration", () => {
    render(<CurriculumOverview curriculum={mockCurriculumData} />);
    
    expect(screen.getByText("Total: 20 lessons, 15 hours")).toBeInTheDocument();
  });
});
```

### 2. Accessibility Testing

```typescript
describe("LessonCard accessibility", () => {
  it("provides proper ARIA labels for screen readers", () => {
    render(<LessonCard {...defaultProps} />);
    
    const lessonCard = screen.getByRole("article");
    expect(lessonCard).toHaveAttribute(
      "aria-label", 
      "Introduction to Fractions, Mathematics, Key Stage 2, 45 minutes"
    );
  });

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    const mockOnStart = vi.fn();
    
    render(<LessonCard {...defaultProps} onStart={mockOnStart} />);
    
    const startButton = screen.getByRole("button", { name: /start lesson/i });
    startButton.focus();
    
    await user.keyboard("{Enter}");
    expect(mockOnStart).toHaveBeenCalled();
  });

  it("announces lesson completion status", () => {
    const completedLesson = { ...defaultProps.lesson, completed: true };
    render(<LessonCard {...defaultProps} lesson={completedLesson} />);
    
    expect(screen.getByText("Completed")).toHaveAttribute("aria-live", "polite");
  });
});
```

### 3. Responsive Behavior Testing

```typescript
describe("LessonGrid responsive behavior", () => {
  beforeEach(() => {
    // Mock window.matchMedia for responsive tests
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query.includes("768px") ? false : true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("adjusts layout for mobile screens", () => {
    render(<LessonGrid lessons={mockLessons} />);
    
    const grid = screen.getByTestId("lesson-grid");
    expect(grid).toHaveClass("grid-cols-1");
  });
});
```

## Custom Testing Utilities

### 1. Oak Test Helpers

```typescript
// test-utils/oak-helpers.ts
export function createMockLesson(overrides = {}) {
  return {
    id: "lesson-123",
    title: "Test Lesson",
    subject: "Mathematics",
    keyStage: "KS2",
    duration: 45,
    completed: false,
    ...overrides
  };
}

export function createMockCurriculum(overrides = {}) {
  return {
    subject: "Mathematics",
    keyStage: "KS2",
    units: [],
    ...overrides
  };
}

// Usage in tests
const lesson = createMockLesson({ completed: true });
```

### 2. Component Wrapper

```typescript
// test-utils/render-with-providers.tsx
export function renderWithProviders(ui: React.ReactElement, options = {}) {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={createTestQueryClient()}>
        <ThemeProvider theme="oak">
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
}
```

### 3. Mock Hooks

```typescript
// test-utils/mock-hooks.ts
export function mockUseLessonData(lesson: Lesson) {
  vi.mock("../hooks/useLessonData", () => ({
    useLessonData: () => ({
      lesson,
      isLoading: false,
      error: null
    })
  }));
}
```

## Anti-Patterns to Avoid

### ❌ Testing Implementation Details

```typescript
// Bad - testing internal state
expect(component.state.isVisible).toBe(true);

// Good - testing user-visible behavior  
expect(screen.getByText("Lesson Details")).toBeInTheDocument();
```

### ❌ Brittle Selectors

```typescript
// Bad - relies on implementation
expect(container.querySelector(".lesson-card__title")).toHaveTextContent("Fractions");

// Good - semantic queries
expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Fractions");
```

### ❌ Testing Everything Together

```typescript
// Bad - integration test disguised as unit test
describe("LessonPageContainer", () => {
  it("loads lesson data and displays it", () => {
    // Tests data fetching, transformation, AND rendering
  });
});

// Good - separate concerns
describe("LessonPage", () => {
  it("displays lesson data", () => {
    // Only tests rendering with known data
  });
});
```

## Testing Async Components

### 1. Data Fetching

```typescript
describe("LessonDetails", () => {
  it("loads and displays lesson data", async () => {
    const mockLesson = createMockLesson();
    vi.mocked(api.fetchLesson).mockResolvedValue(mockLesson);
    
    render(<LessonDetails lessonId="lesson-123" />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText("Test Lesson")).toBeInTheDocument();
    });
  });

  it("handles fetch errors gracefully", async () => {
    vi.mocked(api.fetchLesson).mockRejectedValue(new Error("Network error"));
    
    render(<LessonDetails lessonId="lesson-123" />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load lesson/i)).toBeInTheDocument();
    });
  });
});
```

### 2. User Actions with Side Effects

```typescript
describe("BookmarkButton", () => {
  it("toggles bookmark status", async () => {
    const user = userEvent.setup();
    vi.mocked(api.toggleBookmark).mockResolvedValue({ bookmarked: true });
    
    render(<BookmarkButton lessonId="lesson-123" initialBookmarked={false} />);
    
    const button = screen.getByRole("button", { name: /bookmark/i });
    await user.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/bookmarked/i)).toBeInTheDocument();
    });
    
    expect(api.toggleBookmark).toHaveBeenCalledWith("lesson-123", true);
  });
});
```

## Performance Testing

### 1. Re-render Prevention

```typescript
describe("LessonCard performance", () => {
  it("does not re-render when unrelated props change", () => {
    const { rerender } = render(<LessonCard {...defaultProps} />);
    
    const renderCount = vi.fn();
    vi.mocked(React.memo).mockImplementation((component) => {
      return React.forwardRef((props, ref) => {
        renderCount();
        return component(props, ref);
      });
    });
    
    rerender(<LessonCard {...defaultProps} unrelatedProp="changed" />);
    
    expect(renderCount).toHaveBeenCalledTimes(1);
  });
});
```

## Best Practices Summary

1. **Query by user-visible text and roles** rather than implementation details
2. **Use React Testing Library's semantic queries** (`getByRole`, `getByLabelText`)
3. **Test user workflows** rather than isolated component methods
4. **Mock at the API boundary** rather than deep in component hierarchy
5. **Focus on accessibility** - proper ARIA labels, keyboard navigation
6. **Test error and loading states** for better user experience
7. **Use custom test utilities** for Oak-specific patterns
8. **Keep tests focused** - one behavior per test

---

*These patterns serve Oak's mission of accessible, high-quality educational content by ensuring our React components work reliably for teachers and students.*