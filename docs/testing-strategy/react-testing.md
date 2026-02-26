# React Component Testing

**Accessibility-first React component testing using React Testing Library with Jest for the Oak Web Application**

React Testing Library tests from the user's perspective using accessibility-first patterns. Oak has strong RTL foundations - this guide builds on existing expertise.

## Required Accessibility Testing Tools

```bash
# Install required accessibility testing tools
npm install --save-dev jest-axe @testing-library/jest-dom

# Optional but recommended for advanced testing
npm install --save-dev @axe-core/playwright  # For E2E accessibility tests
```

### Setup in Jest Configuration

```typescript
// jest.setup.js
import { toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';

expect.extend(toHaveNoViolations);
```

## The RTL Query Hierarchy (Accessibility-First)

React Testing Library queries are ordered by priority for both testing quality and accessibility:

### 1. Primary Queries (Accessible to Everyone)

```typescript
// 1. getByRole - Tests semantic structure (best for accessibility)
screen.getByRole("button", { name: /start lesson/i });
screen.getByRole("heading", { name: /mathematics/i });
screen.getByRole("textbox", { name: /search lessons/i });

// 2. getByLabelText - Tests form accessibility
screen.getByLabelText(/subject/i);
screen.getByLabelText(/key stage/i);

// 3. getByPlaceholderText - When labels aren't visible
screen.getByPlaceholderText(/enter lesson title/i);

// 4. getByText - Content that users read
screen.getByText(/introduction to fractions/i);
```

### 2. Secondary Queries (Use When Primary Queries Don't Work)

```typescript
// 5. getByDisplayValue - Current form values
screen.getByDisplayValue("Mathematics");

// 6. getByAltText - Image accessibility
screen.getByAltText(/fraction diagram showing 1 out of 4 parts/i);

// 7. getByTitle - Tooltip content
screen.getByTitle(/this lesson requires fractions basics/i);
```

### 3. Last Resort Queries (Avoid When Possible)

```typescript
// 8. getByTestId - Only when semantic queries impossible
screen.getByTestId("lesson-card-123");
// Note: If you need test IDs, consider improving the component's semantic structure instead
```

## Essential Patterns

### 1. Accessibility-First Component Testing

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
    onStart: jest.fn()
  };

  it("displays lesson information accessibly to teachers", () => {
    render(<LessonCard {...defaultProps} />);

    // Accessibility-first queries - test semantic structure
    expect(screen.getByRole("heading", { name: /introduction to fractions/i }))
      .toBeInTheDocument();

    // Test educational metadata is accessible
    expect(screen.getByText("Mathematics")).toBeInTheDocument();
    expect(screen.getByText(/key stage 2/i)).toBeInTheDocument();

    // Duration should be announced properly for screen readers
    expect(screen.getByText(/45 minutes/i)).toBeInTheDocument();
  });

  it("provides accessible lesson interaction", () => {
    render(<LessonCard {...defaultProps} />);

    // Test button has proper accessible name
    const startButton = screen.getByRole("button", {
      name: /start introduction to fractions lesson/i
    });
    expect(startButton).toBeInTheDocument();
    expect(startButton).not.toBeDisabled();
  });

  it("communicates completion status accessibly", () => {
    const completedLesson = { ...defaultProps.lesson, completed: true };
    render(<LessonCard {...defaultProps} lesson={completedLesson} />);

    // Start button should not exist for completed lessons
    expect(screen.queryByRole("button", { name: /start.*lesson/i }))
      .not.toBeInTheDocument();

    // Completion should be announced to screen readers
    const completionStatus = screen.getByText(/completed/i);
    expect(completionStatus).toBeInTheDocument();
    expect(completionStatus).toHaveAttribute("aria-live", "polite");
  });
});
```

### 2. Accessible User Interactions

```typescript
describe("LessonCard interactions", () => {
  it("supports both mouse and keyboard lesson start", async () => {
    const user = userEvent.setup();
    const mockOnStart = jest.fn();

    render(<LessonCard {...defaultProps} onStart={mockOnStart} />);

    const startButton = screen.getByRole("button", {
      name: /start introduction to fractions lesson/i
    });

    // Test mouse interaction
    await user.click(startButton);
    expect(mockOnStart).toHaveBeenCalledWith("lesson-123");

    mockOnStart.mockClear();

    // Test keyboard interaction (accessibility requirement)
    startButton.focus();
    await user.keyboard("{Enter}");
    expect(mockOnStart).toHaveBeenCalledWith("lesson-123");
  });

  it("provides accessible bookmark functionality", async () => {
    const user = userEvent.setup();
    const mockOnBookmark = jest.fn();

    render(<LessonCard {...defaultProps} onBookmark={mockOnBookmark} />);

    const bookmarkButton = screen.getByRole("button", {
      name: /bookmark introduction to fractions lesson/i
    });

    // Test initial state is communicated
    expect(bookmarkButton).toHaveAttribute("aria-pressed", "false");

    await user.click(bookmarkButton);

    expect(mockOnBookmark).toHaveBeenCalledWith("lesson-123", true);

    // After interaction, state should update for screen readers
    expect(bookmarkButton).toHaveAttribute("aria-pressed", "true");
  });

  it("handles focus management for lesson navigation", async () => {
    const user = userEvent.setup();

    render(<LessonCard {...defaultProps} />);

    const lessonCard = screen.getByRole("article", {
      name: /introduction to fractions.*mathematics.*key stage 2/i
    });

    // Lesson card should be focusable for keyboard navigation
    expect(lessonCard).toHaveAttribute("tabindex", "0");

    // Focus should be visually indicated
    lessonCard.focus();
    expect(lessonCard).toHaveFocus();
  });
});
```

### 3. Accessible Conditional Rendering

```typescript
describe("LessonCard conditional rendering", () => {
  it("communicates progress accessibly to screen readers", () => {
    const partialLesson = {
      ...defaultProps.lesson,
      progress: 60,
      completed: false
    };

    render(<LessonCard {...defaultProps} lesson={partialLesson} />);

    // Progress should be accessible to screen readers
    const progressBar = screen.getByRole("progressbar", {
      name: /lesson progress/i
    });
    expect(progressBar).toHaveAttribute("aria-valuenow", "60");
    expect(progressBar).toHaveAttribute("aria-valuemin", "0");
    expect(progressBar).toHaveAttribute("aria-valuemax", "100");
    expect(progressBar).toHaveAttribute("aria-valuetext", "60% complete");

    // Visual progress text should also be present
    expect(screen.getByText(/60% complete/i)).toBeInTheDocument();
  });

  it("provides accessible prerequisite warnings", () => {
    const advancedLesson = {
      ...defaultProps.lesson,
      prerequisites: ["basic-fractions"],
      hasPrerequisites: false
    };

    render(<LessonCard {...defaultProps} lesson={advancedLesson} />);

    // Warning should be announced to screen readers
    const warning = screen.getByRole("alert");
    expect(warning).toHaveTextContent(/prerequisite lessons required/i);

    // Start button should be disabled with explanation
    const startButton = screen.getByRole("button", {
      name: /start introduction to fractions lesson/i
    });
    expect(startButton).toBeDisabled();
    expect(startButton).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining("prerequisite-warning")
    );
  });
});
```

## Comprehensive Accessibility Testing

### Automated Accessibility Testing with jest-axe

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('LessonCard accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<LessonCard {...defaultProps} />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should maintain accessibility with dynamic content', async () => {
    const { container, rerender } = render(
      <LessonCard {...defaultProps} />
    );

    // Test with completed lesson
    rerender(
      <LessonCard 
        {...defaultProps} 
        lesson={{ ...defaultProps.lesson, completed: true }}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should be accessible with error states', async () => {
    const { container } = render(
      <LessonCard 
        {...defaultProps} 
        error="Failed to load lesson resources"
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Keyboard Navigation Testing

```typescript
describe('LessonCard keyboard accessibility', () => {
  it('should support full keyboard navigation', async () => {
    const user = userEvent.setup();
    const mockOnStart = jest.fn();

    render(<LessonCard {...defaultProps} onStart={mockOnStart} />);

    // Tab to lesson card
    await user.tab();
    expect(screen.getByRole('article')).toHaveFocus();

    // Tab to start button
    await user.tab();
    const startButton = screen.getByRole('button', { name: /start.*lesson/i });
    expect(startButton).toHaveFocus();

    // Activate with Enter
    await user.keyboard('{Enter}');
    expect(mockOnStart).toHaveBeenCalled();

    // Tab to bookmark button
    await user.tab();
    const bookmarkButton = screen.getByRole('button', { name: /bookmark/i });
    expect(bookmarkButton).toHaveFocus();

    // Activate with Space
    await user.keyboard(' ');
    expect(bookmarkButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('should handle escape key for modal dismissal', async () => {
    const user = userEvent.setup();
    const mockOnClose = jest.fn();

    render(
      <LessonModal 
        lesson={defaultProps.lesson}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    await user.keyboard('{Escape}');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should trap focus within modal dialogs', async () => {
    const user = userEvent.setup();

    render(
      <LessonModal 
        lesson={defaultProps.lesson}
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    const firstButton = screen.getByRole('button', { name: /start lesson/i });
    const lastButton = screen.getByRole('button', { name: /close/i });

    // Focus should start on first interactive element
    expect(firstButton).toHaveFocus();

    // Tab to last element
    await user.tab();
    expect(lastButton).toHaveFocus();

    // Tab again should wrap to first element
    await user.tab();
    expect(firstButton).toHaveFocus();

    // Shift+Tab should go to last element
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(lastButton).toHaveFocus();
  });
});
```

### Screen Reader Testing

```typescript
describe('LessonCard screen reader accessibility', () => {
  it('should provide rich accessible descriptions', () => {
    render(<LessonCard {...defaultProps} />);

    const lessonCard = screen.getByRole('article');
    
    // Should have accessible name
    expect(lessonCard).toHaveAccessibleName(
      'Introduction to Fractions Mathematics Key Stage 2 45 minutes'
    );

    // Should have accessible description
    expect(lessonCard).toHaveAccessibleDescription(
      'Learn the basics of fractions including numerators and denominators'
    );
  });

  it('should announce dynamic status changes', async () => {
    const user = userEvent.setup();
    
    render(<LessonCard {...defaultProps} />);

    const bookmarkButton = screen.getByRole('button', { name: /bookmark/i });
    
    // Initial state
    expect(bookmarkButton).toHaveAttribute('aria-pressed', 'false');
    expect(bookmarkButton).toHaveAccessibleName('Bookmark Introduction to Fractions lesson');

    // After activation
    await user.click(bookmarkButton);
    expect(bookmarkButton).toHaveAttribute('aria-pressed', 'true');
    expect(bookmarkButton).toHaveAccessibleName('Remove bookmark from Introduction to Fractions lesson');
  });

  it('should provide progress information for screen readers', () => {
    const partialLesson = {
      ...defaultProps.lesson,
      progress: 75,
      timeRemaining: 10
    };

    render(<LessonCard {...defaultProps} lesson={partialLesson} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuetext', '75% complete, 10 minutes remaining');
    
    // Should also have live region for dynamic updates
    const statusRegion = screen.getByRole('status');
    expect(statusRegion).toHaveTextContent('Progress updated: 75% complete');
  });
});
```

### Color and Contrast Testing

```typescript
describe('LessonCard visual accessibility', () => {
  it('should not rely solely on color for information', () => {
    const errorLesson = {
      ...defaultProps.lesson,
      hasError: true,
      error: 'Resource unavailable'
    };

    render(<LessonCard {...defaultProps} lesson={errorLesson} />);

    // Error should be indicated by more than just color
    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toHaveTextContent('Error: Resource unavailable');
    
    // Should have error icon
    expect(screen.getByRole('img', { name: /error/i })).toBeInTheDocument();
  });

  it('should provide high contrast focus indicators', async () => {
    const user = userEvent.setup();
    
    render(<LessonCard {...defaultProps} />);

    const startButton = screen.getByRole('button', { name: /start/i });
    
    // Focus should be clearly visible (tested through CSS class)
    await user.tab();
    expect(startButton).toHaveFocus();
    expect(startButton).toHaveClass('focus-visible');
  });
});
```

### Performance Standards for Component Tests

```typescript
describe('LessonCard performance', () => {
  it('should render within performance thresholds', () => {
    const startTime = Date.now();
    
    render(<LessonCard {...defaultProps} />);
    
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(100); // Component test threshold: <100ms
  });

  it('should handle large lesson lists efficiently', () => {
    const largeLessonList = Array.from({ length: 100 }, (_, i) => ({
      ...defaultProps.lesson,
      id: `lesson-${i}`,
      title: `Lesson ${i}`
    }));

    const startTime = Date.now();
    
    render(
      <LessonList lessons={largeLessonList} />
    );
    
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(250); // Large list threshold
  });
});

    // Provide actionable next steps
    expect(screen.getByRole("link", {
      name: /view prerequisite lessons/i
    })).toBeInTheDocument();
  });

  it("indicates lesson availability for different user types", () => {
    const teacherOnlyLesson = {
      ...defaultProps.lesson,
      audienceType: "teacher",
      isPublic: false
    };

    render(<LessonCard {...defaultProps} lesson={teacherOnlyLesson} />);

    // Audience restriction should be clearly communicated
    expect(screen.getByText(/teacher access only/i)).toBeInTheDocument();

    // Should have proper ARIA labeling
    const accessBadge = screen.getByText(/teacher access only/i);
    expect(accessBadge).toHaveAttribute("aria-label",
      "This lesson is only available to registered teachers");
  });
});
```

### 4. Form Testing

```typescript
// Oak-specific: Accessible teacher lesson search form
describe("LessonSearchForm", () => {
  it("provides accessible lesson filtering for teachers", async () => {
    const user = userEvent.setup();
    const mockOnSearch = jest.fn();

    render(<LessonSearchForm onSearch={mockOnSearch} />);

    // All form controls should have proper labels
    const subjectSelect = screen.getByLabelText(/subject/i);
    expect(subjectSelect).toHaveAttribute("aria-required", "true");
    await user.selectOptions(subjectSelect, "mathematics");

    const keyStageSelect = screen.getByLabelText(/key stage/i);
    expect(keyStageSelect).toHaveAttribute("aria-required", "true");
    await user.selectOptions(keyStageSelect, "ks2");

    // Search input should have helpful description
    const searchInput = screen.getByLabelText(/search lessons/i);
    expect(searchInput).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining("search-help")
    );
    expect(screen.getByText(/search by lesson title, topic, or keywords/i))
      .toBeInTheDocument();

    await user.type(searchInput, "fractions");

    // Form should have proper structure
    const searchForm = screen.getByRole("search");
    expect(searchForm).toHaveAttribute("aria-label", "Search for lessons");

    const searchButton = screen.getByRole("button", { name: /search lessons/i });
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith({
      subject: "mathematics",
      keyStage: "ks2",
      query: "fractions"
    });
  });

  it("provides accessible validation feedback", async () => {
    const user = userEvent.setup();

    render(<LessonSearchForm onSearch={jest.fn()} />);

    const searchButton = screen.getByRole("button", { name: /search lessons/i });
    await user.click(searchButton);

    // Validation errors should be announced to screen readers
    const subjectError = screen.getByRole("alert");
    expect(subjectError).toHaveTextContent(/subject is required/i);

    const keyStageError = screen.getByText(/key stage is required/i);
    expect(keyStageError).toHaveAttribute("role", "alert");

    // Form controls should be linked to their error messages
    const subjectSelect = screen.getByLabelText(/subject/i);
    expect(subjectSelect).toHaveAttribute("aria-invalid", "true");
    expect(subjectSelect).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining("subject-error")
    );
  });

  it("supports keyboard-only navigation", async () => {
    const user = userEvent.setup();
    const mockOnSearch = jest.fn();

    render(<LessonSearchForm onSearch={mockOnSearch} />);

    // Tab through form in logical order
    await user.tab();
    expect(screen.getByLabelText(/subject/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/key stage/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/search lessons/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: /search lessons/i })).toHaveFocus();

    // Enter key should submit form
    await user.keyboard("{Enter}");
    expect(mockOnSearch).toHaveBeenCalled();
  });
});
```

### 5. Accessible Loading and Error States

```typescript
describe("LessonListContainer", () => {
  it("provides accessible loading feedback", () => {
    render(<LessonListContainer isLoading={true} lessons={[]} error={null} />);

    // Loading state should be announced to screen readers
    const loadingIndicator = screen.getByRole("status", {
      name: /loading lessons/i
    });
    expect(loadingIndicator).toBeInTheDocument();
    expect(loadingIndicator).toHaveAttribute("aria-live", "polite");

    // Visual loading text should also be present
    expect(screen.getByText(/loading lessons for teachers/i)).toBeInTheDocument();
  });

  it("communicates errors accessibly with recovery options", () => {
    const error = {
      message: "Failed to load lessons",
      code: "NETWORK_ERROR"
    };

    render(<LessonListContainer isLoading={false} lessons={[]} error={error} />);

    // Error should be announced immediately
    const errorAlert = screen.getByRole("alert");
    expect(errorAlert).toHaveTextContent(/failed to load lessons/i);
    expect(errorAlert).toHaveAttribute("aria-live", "assertive");

    // Provide actionable recovery options
    expect(screen.getByRole("button", { name: /try again/i }))
      .toBeInTheDocument();
    expect(screen.getByRole("link", { name: /report this issue/i }))
      .toBeInTheDocument();

    // Include helpful context for teachers
    expect(screen.getByText(/check your internet connection/i))
      .toBeInTheDocument();
  });

  it("provides helpful empty state with next steps", () => {
    render(<LessonListContainer isLoading={false} lessons={[]} error={null} />);

    // Empty state should be clearly communicated
    const emptyHeading = screen.getByRole("heading", {
      name: /no lessons found/i
    });
    expect(emptyHeading).toBeInTheDocument();

    // Provide specific guidance for teachers
    expect(screen.getByText(/try adjusting your search criteria/i))
      .toBeInTheDocument();
    expect(screen.getByText(/expand key stage selection/i))
      .toBeInTheDocument();

    // Include actionable next steps
    expect(screen.getByRole("button", { name: /clear all filters/i }))
      .toBeInTheDocument();
    expect(screen.getByRole("link", { name: /browse all subjects/i }))
      .toBeInTheDocument();
  });

  it("manages focus appropriately during state changes", async () => {
    const { rerender } = render(
      <LessonListContainer isLoading={true} lessons={[]} error={null} />
    );

    // Focus should be on loading indicator initially
    const loadingIndicator = screen.getByRole("status");
    expect(loadingIndicator).toHaveFocus();

    // When lessons load, focus should move to lesson list
    const mockLessons = [{ id: "1", title: "Test Lesson", subject: "Math" }];
    rerender(
      <LessonListContainer isLoading={false} lessons={mockLessons} error={null} />
    );

    const lessonList = screen.getByRole("list", { name: /lesson results/i });
    expect(lessonList).toHaveFocus();
  });
});
```

## Oak-Specific Accessibility-First Testing Patterns

### 1. Curriculum Data Testing with Educational Context

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
        estimatedDuration: "6 hours",
        order: 1
      },
      {
        id: "unit-2",
        title: "Addition and Subtraction",
        lessonCount: 12,
        estimatedDuration: "9 hours",
        order: 2
      }
    ]
  };

  it("presents curriculum structure accessibly for teachers", () => {
    render(<CurriculumOverview curriculum={mockCurriculumData} />);

    // Main curriculum heading should be properly structured
    expect(screen.getByRole("heading", {
      name: /mathematics.*key stage 2/i,
      level: 1
    })).toBeInTheDocument();

    // Units should be in logical navigation structure
    const unitList = screen.getByRole("list", { name: /curriculum units/i });
    expect(unitList).toBeInTheDocument();

    // Each unit should be accessible with proper metadata
    expect(screen.getByRole("heading", {
      name: /number and place value/i,
      level: 2
    })).toBeInTheDocument();

    // Lesson counts should be clearly labeled
    expect(screen.getByText(/8 lessons available/i)).toBeInTheDocument();
    expect(screen.getByText(/estimated 6 hours of teaching/i)).toBeInTheDocument();
  });

  it("provides accessible curriculum summary for planning", () => {
    render(<CurriculumOverview curriculum={mockCurriculumData} />);

    // Summary should be in a landmark region
    const summary = screen.getByRole("region", {
      name: /curriculum summary/i
    });
    expect(summary).toBeInTheDocument();

    // Totals should be clearly announced
    expect(summary).toHaveTextContent(/total: 20 lessons.*15 hours/i);

    // Should include educational context
    expect(summary).toHaveTextContent(/covers full.*mathematics.*key stage 2/i);
  });

  it("supports keyboard navigation through units", async () => {
    const user = userEvent.setup();

    render(<CurriculumOverview curriculum={mockCurriculumData} />);

    // Tab through units in curriculum order
    await user.tab();
    expect(screen.getByRole("button", {
      name: /view number and place value unit/i
    })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", {
      name: /view addition and subtraction unit/i
    })).toHaveFocus();
  });
});
```

### 2. Comprehensive Accessibility Testing for Educational Components

```typescript
describe("LessonCard accessibility compliance", () => {
  it("meets WCAG 2.1 Level AA standards for educational content", () => {
    render(<LessonCard {...defaultProps} />);

    // Proper semantic structure for curriculum content
    const lessonCard = screen.getByRole("article", {
      name: /introduction to fractions.*mathematics.*key stage 2/i
    });
    expect(lessonCard).toBeInTheDocument();

    // Educational metadata should be accessible
    expect(lessonCard).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining("lesson-metadata")
    );

    // Duration important for lesson planning
    const duration = screen.getByText(/45 minutes/i);
    expect(duration).toHaveAttribute("aria-label",
      "Estimated lesson duration: 45 minutes");
  });

  it("provides comprehensive keyboard navigation for teachers", async () => {
    const user = userEvent.setup();
    const mockOnStart = jest.fn();

    render(<LessonCard {...defaultProps} onStart={mockOnStart} />);

    // Card should be focusable for overview navigation
    const lessonCard = screen.getByRole("article");
    expect(lessonCard).toHaveAttribute("tabindex", "0");

    // Focus should move logically through interactive elements
    await user.tab();
    expect(lessonCard).toHaveFocus();

    await user.tab();
    const startButton = screen.getByRole("button", {
      name: /start introduction to fractions lesson/i
    });
    expect(startButton).toHaveFocus();

    // Both Enter and Space should activate buttons
    await user.keyboard("{Enter}");
    expect(mockOnStart).toHaveBeenCalledTimes(1);

    await user.keyboard(" ");
    expect(mockOnStart).toHaveBeenCalledTimes(2);
  });

  it("announces dynamic content changes for screen readers", async () => {
    const { rerender } = render(<LessonCard {...defaultProps} />);

    // Initial state should be announced
    expect(screen.getByText(/not started/i))
      .toHaveAttribute("aria-live", "polite");

    // Progress updates should be announced
    const progressLesson = { ...defaultProps.lesson, progress: 50 };
    rerender(<LessonCard {...defaultProps} lesson={progressLesson} />);

    const progressStatus = screen.getByText(/50% complete/i);
    expect(progressStatus).toHaveAttribute("aria-live", "polite");

    // Completion should be announced with higher priority
    const completedLesson = { ...defaultProps.lesson, completed: true };
    rerender(<LessonCard {...defaultProps} lesson={completedLesson} />);

    const completionStatus = screen.getByText(/lesson completed/i);
    expect(completionStatus).toHaveAttribute("aria-live", "assertive");
  });

  it("provides educational context for assistive technology", () => {
    render(<LessonCard {...defaultProps} />);

    // Subject and key stage should be clearly associated
    const subjectInfo = screen.getByText(/mathematics/i);
    expect(subjectInfo).toHaveAttribute("aria-label",
      "Subject: Mathematics, suitable for Key Stage 2 students");

    // Learning objectives should be discoverable
    const objectives = screen.getByText(/introduction to fractions/i);
    expect(objectives).toHaveAttribute("aria-describedby",
      expect.stringContaining("learning-objectives"));
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
    title: "Introduction to Fractions",
    subject: "Mathematics",
    keyStage: "Key Stage 2",
    duration: 45,
    completed: false,
    _state: "published",
    audienceType: "teacher-student",
    learningObjectives: [
      "Understand what a fraction represents",
      "Identify unit fractions",
    ],
    ...overrides,
  };
}

export function createMockUnit(overrides = {}) {
  return {
    id: "unit-123",
    title: "Number and Place Value",
    order: 1,
    lessonCount: 8,
    estimatedDuration: "6 hours",
    keyStage: "Key Stage 2",
    subject: "Mathematics",
    ...overrides,
  };
}

export function createMockCurriculum(overrides = {}) {
  return {
    subject: "Mathematics",
    keyStage: "Key Stage 2",
    units: [createMockUnit()],
    totalLessons: 20,
    totalDuration: "15 hours",
    ...overrides,
  };
}

// Accessibility-focused test helper
export function expectAccessibleButton(
  button: HTMLElement,
  expectedName: string,
) {
  expect(button).toHaveAttribute("role", "button");
  expect(button).toHaveAccessibleName(expectedName);
  expect(button).not.toHaveAttribute("aria-disabled", "true");
}

// Usage in tests
const lesson = createMockLesson({ completed: true });
const curriculum = createMockCurriculum({ subject: "Science" });
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
      error: null,
    }),
  }));
}
```

## Anti-Patterns to Avoid

#### Testing Implementation Instead of User Experience

```typescript
// ❌ Bad - tests internal state, no accessibility benefit
expect(component.state.isVisible).toBe(true);
expect(wrapper.find(".hidden-content")).toHaveLength(0);

// ✅ Good - tests user experience AND validates accessibility
expect(
  screen.getByRole("region", { name: /lesson details/i }),
).toBeInTheDocument();
expect(
  screen.getByRole("region", { name: /lesson details/i }),
).not.toHaveAttribute("aria-hidden", "true");
```

#### Using Brittle Selectors Instead of Semantic Queries

```typescript
// ❌ Bad - fragile, no accessibility validation
expect(container.querySelector(".lesson-card__title")).toHaveTextContent(
  "Fractions",
);
expect(container.querySelector(".btn-primary")).toBeInTheDocument();

// ✅ Good - resilient, validates semantic structure
expect(
  screen.getByRole("heading", {
    name: /introduction to fractions/i,
    level: 3,
  }),
).toBeInTheDocument();
expect(
  screen.getByRole("button", {
    name: /start introduction to fractions lesson/i,
  }),
).toBeInTheDocument();
```

#### Testing Too Much at Once

```typescript
// ❌ Bad - unclear what's being tested, hard to debug
describe("LessonPageContainer", () => {
  it("loads lesson data and displays it", () => {
    // Tests data fetching, transformation, state management, AND rendering
    render(<LessonPageContainer lessonId="123" />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    // ... complex mocking and async logic
  });
});

// ✅ Good - focused tests with clear responsibilities
describe("LessonPage", () => {
  it("renders lesson content accessibly", () => {
    const mockLesson = createMockLesson();
    render(<LessonPage lesson={mockLesson} />);

    expect(screen.getByRole("main", { name: /lesson content/i }))
      .toBeInTheDocument();
  });
});

describe("useLessonData", () => {
  it("fetches and transforms lesson data", () => {
    // Test hook logic in isolation
  });
});
```

#### Ignoring Error States and Edge Cases

```typescript
// ❌ Bad - only tests happy path
describe("LessonCard", () => {
  it("displays lesson", () => {
    render(<LessonCard lesson={mockLesson} />);
    expect(screen.getByText(mockLesson.title)).toBeInTheDocument();
  });
});

// ✅ Good - tests edge cases that affect all users
describe("LessonCard", () => {
  it("handles missing lesson data gracefully", () => {
    render(<LessonCard lesson={null} />);

    expect(screen.getByRole("alert"))
      .toHaveTextContent(/lesson information unavailable/i);
    expect(screen.getByRole("button", { name: /return to lesson list/i }))
      .toBeInTheDocument();
  });

  it("announces lesson loading state", () => {
    render(<LessonCard lesson={mockLesson} isLoading={true} />);

    expect(screen.getByRole("status", { name: /loading lesson/i }))
      .toBeInTheDocument();
  });
});
```

````

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
````

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

## Best Practices for Oak

### Query Hierarchy

- **Primary**: `getByRole` - validates semantic structure
- **Secondary**: `getByLabelText` - form accessibility
- **Last Resort**: `getByTestId` - only when semantic structure isn't possible

### Educational Context

- Use real Oak curriculum examples (Mathematics, Key Stages, lesson titles)
- Test educational workflows (teacher planning, student progression)
- Validate learning-specific interactions (prerequisite checking, progress tracking)

### Accessibility Requirements

- All interactive elements have accessible names
- Form validation errors announced to screen readers
- Dynamic content uses appropriate `aria-live` regions
- Keyboard navigation follows logical flow

### User Scenarios

- Teacher planning workflows (searching, filtering, bookmarking)
- Student learning paths (prerequisite checking, progress tracking)
- Error recovery (network failures, missing content)

### Performance Testing

- Loading states don't block accessibility features
- Focus management during content updates
- Animations respect `prefers-reduced-motion`

### Oak-Specific Patterns

- Use `createMockLesson()` and `createMockCurriculum()` helpers
- Test educational metadata (subjects, key stages, learning objectives)
- Validate curriculum progression and prerequisite relationships

## Quick Reference: RTL Query Priority

```typescript
// ✅ PRIORITY 1: Accessible to everyone
getByRole("button", { name: /start lesson/i });
getByRole("heading", { name: /mathematics/i });
getByLabelText(/search lessons/i);

// ✅ PRIORITY 2: When semantic queries don't work
getByText(/introduction to fractions/i);
getByAltText(/fraction diagram/i);

// ⚠️ LAST RESORT: Avoid when possible
getByTestId("lesson-card");
```

**Remember**: If you need `getByTestId`, consider improving the component's semantic HTML structure instead.
