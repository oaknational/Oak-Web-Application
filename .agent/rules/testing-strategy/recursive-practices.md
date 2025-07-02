# Recursive Testing Practices

**Practical techniques for improving code quality through reflective development**

## Pre-Development Checklist

### Before Writing Code
Use this checklist to improve code and test quality:

**Clarify Intent**
- [ ] What specific behavior am I trying to create?
- [ ] How would I explain this to a colleague?
- [ ] What edge cases should I consider?

**Check Assumptions**
- [ ] What am I assuming about the inputs?
- [ ] What am I assuming about the environment?
- [ ] What could go wrong that I haven't considered?

```typescript
// Example: Before writing a function, clarify intent
// Intent: Format lesson duration for display to teachers
// Assumptions: Duration is in minutes, always positive
// Edge cases: Zero duration, very long durations

describe("formatLessonDuration", () => {
  it("should format standard durations clearly", () => {
    expect(formatLessonDuration(45)).toBe("45 minutes");
    expect(formatLessonDuration(90)).toBe("1 hour 30 minutes");
  });
  
  it("should handle edge cases gracefully", () => {
    expect(formatLessonDuration(0)).toBe("0 minutes");
    expect(formatLessonDuration(1)).toBe("1 minute");
  });
});
```

## The Five Whys Technique

When you notice resistance to writing a test, use this structured approach:

1. **Why don't I want to test this?** (e.g., "It seems too simple")
2. **Why does that matter?** (e.g., "Simple code doesn't break")
3. **Why do I believe that?** (e.g., "I've never seen this pattern fail")
4. **Why is that assumption risky?** (e.g., "If I'm wrong, users get bad data")
5. **Why does this pattern keep happening?** (e.g., "I often skip testing 'obvious' code")

**Action:** Write the test anyway, focusing on edge cases you initially dismissed.

## Pure Function Extraction Practice

### Identification Questions
- What logic in this component could exist independently?
- Which parts of this function have no side effects?
- What calculations could be extracted and tested in isolation?

### Extraction Pattern
```typescript
// Before: Mixed concerns
function StudentProgressCard({ studentId }: Props) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    fetchStudentData(studentId).then(data => {
      // Complex calculation mixed with side effects
      const percentage = Math.round((data.completed / data.total) * 100);
      const capped = Math.min(percentage, 100);
      setProgress(capped);
    });
  }, [studentId]);
  
  return <div>Progress: {progress}%</div>;
}

// After: Extracted pure function
export function calculateProgressPercentage(completed: number, total: number): number {
  if (total === 0) return 0;
  const percentage = Math.round((completed / total) * 100);
  return Math.min(percentage, 100);
}

// Easy to test in isolation
describe("calculateProgressPercentage", () => {
  it("calculates percentage correctly", () => {
    expect(calculateProgressPercentage(3, 10)).toBe(30);
  });
  
  it("handles division by zero", () => {
    expect(calculateProgressPercentage(0, 0)).toBe(0);
  });
  
  it("caps at 100%", () => {
    expect(calculateProgressPercentage(15, 10)).toBe(100);
  });
});
```

## Assumption Documentation Pattern

Before writing complex logic, document your assumptions explicitly:

```typescript
// Student progress calculation assumptions:
// 1. Completed lessons ≤ total lessons (usually)
// 2. Total lessons > 0 (usually)
// 3. Progress should be 0-100%
// 4. Edge cases should fail gracefully

describe("calculateStudentProgress edge cases", () => {
  it("handles completed > total lessons", () => {
    // Tests assumption #1
    expect(calculateStudentProgress(5, 3)).toBe(100);
  });
  
  it("handles zero total lessons", () => {
    // Tests assumption #2
    expect(calculateStudentProgress(0, 0)).toBe(0);
  });
  
  it("handles negative inputs gracefully", () => {
    // Tests assumption #4
    expect(calculateStudentProgress(-1, 5)).toBe(0);
  });
});
```

## Component Testability Patterns

### Separation of Concerns Template
```typescript
// 1. Pure presentation component (easy to test)
interface LessonCardProps {
  lesson: {
    title: string;
    duration: number;
    completed: boolean;
  };
  onStart: () => void;
}

export function LessonCard({ lesson, onStart }: LessonCardProps) {
  return (
    <Card>
      <h3>{lesson.title}</h3>
      <span>{lesson.duration} minutes</span>
      {!lesson.completed && <Button onClick={onStart}>Start</Button>}
    </Card>
  );
}

// 2. Container handles side effects (mock in tests)
export function LessonCardContainer({ lessonId }: { lessonId: string }) {
  const lesson = useLessonData(lessonId);
  const { startLesson } = useLessonActions();
  
  return <LessonCard lesson={lesson} onStart={() => startLesson(lessonId)} />;
}
```

### Test Template for Components
```typescript
describe("LessonCard", () => {
  const defaultProps = {
    lesson: {
      title: "Test Lesson",
      duration: 45,
      completed: false
    },
    onStart: vi.fn()
  };

  it("displays lesson information", () => {
    render(<LessonCard {...defaultProps} />);
    expect(screen.getByText("Test Lesson")).toBeInTheDocument();
    expect(screen.getByText("45 minutes")).toBeInTheDocument();
  });

  it("shows start button for incomplete lessons", () => {
    render(<LessonCard {...defaultProps} />);
    expect(screen.getByText("Start")).toBeInTheDocument();
  });

  it("hides start button for completed lessons", () => {
    render(<LessonCard {...defaultProps} lesson={{ ...defaultProps.lesson, completed: true }} />);
    expect(screen.queryByText("Start")).not.toBeInTheDocument();
  });
});
```

## User-Focused Testing Practice

### User Story to Test Pattern
```typescript
// User story: "As a teacher, I want to search for lessons by topic"

describe("LessonSearch for teachers", () => {
  it("finds lessons with partial topic matches", () => {
    const results = searchLessons("fract");
    expect(results).toContain(
      expect.objectContaining({ title: expect.stringContaining("Fractions") })
    );
  });
  
  it("handles common misspellings", () => {
    const results = searchLessons("algoritm"); // missing 'h'
    expect(results).toContain(
      expect.objectContaining({ title: expect.stringContaining("Algorithm") })
    );
  });
  
  it("prioritizes current curriculum lessons", () => {
    const results = searchLessons("algebra");
    expect(results[0].curriculum).toBe("current");
  });
});
```

## Code Review Checklist

### For Authors
- [ ] Are my tests focused on behavior, not implementation?
- [ ] Do my tests cover the edge cases I documented?
- [ ] Can someone understand what this code does from the tests alone?
- [ ] Are there pure functions that could be extracted?

### For Reviewers
- [ ] Do the tests give confidence to refactor this code?
- [ ] Are there obvious edge cases missing from tests?
- [ ] Does the component structure make testing natural?
- [ ] Are there untested assumptions in the code?

## Weekly Reflection Template

Use this template in retrospectives or personal reflection:

**Test Quality Assessment**
- Which tests gave me the most confidence this week?
- Which tests felt like busywork?
- What testing patterns am I developing?

**TDD Practice Review**
- How often did I write tests first?
- When I skipped TDD, what was the reason?
- What would make TDD feel more natural?

**Learning Insights**
- What did tests reveal about my assumptions?
- How did testing change my approach to solutions?
- What testing techniques do I want to try next?

## Integration with Oak Development

### Oak-Specific Patterns
```typescript
// Testing curriculum data transformations
describe("transformCurriculumData", () => {
  it("preserves lesson order within units", () => {
    const result = transformCurriculumData(mockUnitData);
    expect(result.lessons.map(l => l.order)).toEqual([1, 2, 3, 4]);
  });
});

// Testing educational content validation
describe("validateLessonContent", () => {
  it("ensures age-appropriate content", () => {
    const result = validateLessonContent(lessonContent, { keyStage: "KS1" });
    expect(result.errors).toHaveLength(0);
  });
});
```

### Team Practices
- **Pair Programming**: Take turns being the "test-first" person
- **Code Reviews**: Include testability in review criteria
- **Sprint Planning**: Consider testing approach when estimating stories

---

*These practices are tools for improving code quality through reflective development. Use what serves the team and adapt based on what you learn.*