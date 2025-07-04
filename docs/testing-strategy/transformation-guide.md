# Testing Transformation Guide

Evolving Oak's testing practices toward accessibility-first TDD.

## Oak's Current Testing Foundation

### Existing Strengths

- Comprehensive RTL usage across codebase
- Domain integration with realistic curriculum fixtures
- User-focused testing patterns
- Well-structured helper utilities (`renderWithProviders`, `renderWithTheme`)
- Educational context understanding

### Enhancement Opportunities

- Systematize existing excellence
- Add accessibility-first query patterns
- Implement TDD workflow

## Migration Strategies

### Enhanced Query Patterns

```typescript
// Current approach
expect(screen.getByText("Mathematics")).toBeInTheDocument();

// Enhanced approach
expect(
  screen.getByRole("heading", { name: /mathematics/i }),
).toBeInTheDocument();
```

### Gradual TDD Adoption

```typescript
// Start with simple utility functions
describe("formatStudentName", () => {
  it("should capitalize first and last name", () => {
    expect(formatStudentName("john doe")).toBe("John Doe");
  });
});
```

### Legacy Code Refactoring

```typescript
// Current code (hard to test)
function processLessonData(lessonId: string) {
  const lesson = database.getLessonById(lessonId);
  lesson.viewCount += 1;
  database.saveLessonViewCount(lesson.id, lesson.viewCount);
  analytics.track("lesson_viewed", { lessonId, title: lesson.title });
  return lesson;
}

// Refactored: Extract pure functions
function incrementViewCount(currentCount: number): number {
  return currentCount + 1;
}

function createAnalyticsEvent(lesson: Lesson): AnalyticsEvent {
  return {
    event: "lesson_viewed",
    properties: { lessonId: lesson.id, title: lesson.title },
  };
}
```

## Implementation Phases

### Phase 1: Foundation Building (Months 1-2)

1. Start TDD with pure functions in `src/utils/`
2. Use TDD for all new, isolated functionality
3. Begin with utility functions

```typescript
describe("calculateGradeLevel", () => {
  it("should return correct grade for age 7", () => {
    expect(calculateGradeLevel(7)).toBe("Year 2");
  });

  it("should handle edge cases gracefully", () => {
    expect(calculateGradeLevel(3)).toBe("Early Years");
    expect(calculateGradeLevel(18)).toBe("Year 13");
  });
});
```

### Phase 2: Component Testing (Months 2-4)

1. Test all new components using TDD
2. Refactor components that break frequently
3. Focus on simple presentation components first

```typescript
describe("SubjectCard", () => {
  it("should display subject name and key stage", () => {
    render(<SubjectCard subject="Mathematics" keyStage="Key Stage 2" />);

    expect(screen.getByText("Mathematics")).toBeInTheDocument();
    expect(screen.getByText("Key Stage 2")).toBeInTheDocument();
  });
});
```

### Phase 3: Integration Testing (Months 4-6)

1. Test critical user journeys
2. Mock only at system boundaries
3. Focus on Oak-specific workflows

### Phase 4: Cultural Integration (Months 6+)

1. Include test quality in code reviews
2. Regular retrospectives on testing effectiveness
3. Adapt practices based on team feedback

## Existing Component Migration

### Step-by-Step Approach

```typescript
// Step 1: Add characterization tests
describe("LessonCard - current behavior", () => {
  it("renders without crashing", () => {
    render(<LessonCard lesson={mockLesson} />);
  });
});

// Step 2: Test one behavior at a time
describe("LessonCard - display logic", () => {
  it("shows lesson title", () => {
    render(<LessonCard lesson={{ title: "Fractions", ...mockLesson }} />);
    expect(screen.getByText("Fractions")).toBeInTheDocument();
  });
});

// Step 3: Refactor with test protection
```

### Legacy Business Logic

```typescript
// Step 1: Wrap in characterization tests
describe("calculateLessonProgress - legacy behavior", () => {
  it("returns expected values for known inputs", () => {
    expect(calculateLessonProgress(mockData)).toEqual(expectedLegacyOutput);
  });
});

// Step 2: Extract pure functions
function calculateCompletionPercentage(
  completed: number,
  total: number,
): number {
  return total === 0 ? 0 : Math.round((completed / total) * 100);
}

// Step 3: Test the pure function
describe("calculateCompletionPercentage", () => {
  it("calculates percentage correctly", () => {
    expect(calculateCompletionPercentage(3, 10)).toBe(30);
  });

  it("handles edge case of zero total", () => {
    expect(calculateCompletionPercentage(0, 0)).toBe(0);
  });
});
```

## Success Metrics

### Technical Metrics

- Test coverage 80%+ on new code
- Tests that catch real bugs
- Safe refactoring capabilities

### Team Metrics

- Developer confidence in making changes
- Code review discussions include testability
- "How would we test this?" becomes natural question

### Business Metrics

- Reduced production bugs
- Faster feature development
- Improved developer satisfaction

## Common Challenges and Solutions

### When Tests Feel Burdensome

- Review test quality - are they testing the right things?
- Simplify complex tests (often indicates complex code)
- Refocus on value - what are tests protecting?

### TDD Adoption Resistance

- Start with utility functions
- Build on existing RTL skills
- Show debugging time saved

### Time Pressure

- Apply "boy scout rule" - leave code slightly better
- Integrate improvements into regular feature work
- Demonstrate testing saves debugging time

### Legacy Code Complexity

- Add characterization tests first
- Extract pure functions gradually
- Focus on problem areas that break frequently

## Team Building Strategies

### Build Confidence

- Start with easy wins
- Share success stories in team meetings
- Document time savings and bug prevention

### Knowledge Sharing

- Pair programming for TDD adoption
- Code review focus on test quality
- Regular retrospectives on testing practices

### Cultural Change

- Connect testing to Oak's educational mission
- Create space for questions and experimentation
- Celebrate improvements and learning

## Implementation Checklist

### Week 1-2

- [ ] Identify utility functions for TDD practice
- [ ] Set up enhanced test helpers
- [ ] Begin accessibility-first query patterns

### Month 1

- [ ] TDD for all new utility functions
- [ ] Enhanced RTL queries in new tests
- [ ] Team training on accessibility-first testing

### Month 2-3

- [ ] TDD for new components
- [ ] Characterization tests for critical legacy code
- [ ] Refactor one problem component with test coverage

### Month 4-6

- [ ] Integration tests for critical user journeys
- [ ] Code review standards include test quality
- [ ] Measure and celebrate improvements

### Ongoing

- [ ] Regular retrospectives on testing effectiveness
- [ ] Continuous refinement of testing practices
- [ ] Knowledge sharing and mentoring
