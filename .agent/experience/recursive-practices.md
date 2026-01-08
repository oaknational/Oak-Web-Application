# Advanced Testing Techniques

Practical development techniques using Oak's curriculum domain and accessibility-first testing

## Pre-Development Checklist

### Before Writing Code

Use this checklist to improve code and test quality:

Clarify Intent

- [ ] What specific behaviour am I trying to create?
- [ ] How would I explain this to a colleague?
- [ ] What edge cases should I consider?

Check Assumptions

- [ ] What am I assuming about the inputs?
- [ ] What am I assuming about the environment?
- [ ] What could go wrong that I haven't considered?

```typescript
// Example: Before writing a function, clarify intent
// Intent: Determine if lessons are available for teacher download
// Assumptions: Lessons have _state property, published means available
// Edge cases: Empty arrays, mixed states, invalid lesson objects

describe("areLessonsAvailable", () => {
  it("should return true when published lessons exist", () => {
    const lessons = [
      { title: "Fractions Intro", _state: "published" },
      { title: "Adding Fractions", _state: "new" },
    ];
    expect(areLessonsAvailable(lessons)).toBe(true);
  });

  it("should handle edge cases gracefully", () => {
    expect(areLessonsAvailable([])).toBe(false);
    expect(areLessonsAvailable([{ title: "Draft", _state: "new" }])).toBe(
      false,
    );
  });
});
```

## The Five Whys Technique

When you notice resistance to writing a test, use this structured approach:

1. Why don't I want to test this? (e.g., "It seems too simple")
2. Why does that matter? (e.g., "Simple code doesn't break")
3. Why do I believe that? (e.g., "I've never seen this pattern fail")
4. Why is that assumption risky? (e.g., "If I'm wrong, users get bad data")
5. Why does this pattern keep happening? (e.g., "I often skip testing 'obvious' code")

Action: Write the test anyway, focusing on edge cases you initially dismissed.

## Pure Function Extraction Practice

### Identification Questions

- What logic in this component could exist independently?
- Which parts of this function have no side effects?
- What calculations could be extracted and tested in isolation?

### Extraction Pattern

```typescript
// Before: Mixed concerns in lesson listing
function ProgrammeOverviewCard({ programmeSlug }: Props) {
  const [unitData, setUnitData] = useState(null);

  useEffect(() => {
    fetchProgrammeData(programmeSlug).then(data => {
      // Complex unit ordering mixed with side effects
      const sortedUnits = data.units.sort((a, b) => a.order - b.order);
      const withLessonCounts = sortedUnits.map(unit => ({
        ...unit,
        lessonCount: unit.lessons?.filter(l => l._state === 'published').length || 0
      }));
      setUnitData(withLessonCounts);
    });
  }, [programmeSlug]);

  return <div>Units: {unitData?.length}</div>;
}

// After: Extracted pure functions
export function sortUnitsByOrder(units: Unit[]): Unit[] {
  return [...units].sort((a, b) => a.order - b.order);
}

export function countPublishedLessons(lessons: Lesson[]): number {
  return lessons?.filter(lesson => lesson._state === 'published').length || 0;
}

// Easy to test in isolation with accessibility focus
describe("sortUnitsByOrder", () => {
  it("maintains correct curriculum sequence", () => {
    const units = [
      { title: "Fractions", order: 2 },
      { title: "Number Sense", order: 1 }
    ];
    const sorted = sortUnitsByOrder(units);
    expect(sorted[0].title).toBe("Number Sense");
  });

  it("handles empty arrays gracefully", () => {
    expect(sortUnitsByOrder([])).toEqual([]);
  });
});

describe("countPublishedLessons", () => {
  it("counts only published lessons for teachers", () => {
    const lessons = [
      { title: "Intro", _state: "published" },
      { title: "Draft", _state: "new" },
      { title: "Advanced", _state: "published" }
    ];
    expect(countPublishedLessons(lessons)).toBe(2);
  });
});
```

## Assumption Documentation Pattern

Before writing complex logic, document your assumptions explicitly:

```typescript
// Programme structure validation assumptions:
// 1. Units should have sequential order numbers
// 2. Lessons within units should be accessible to teachers
// 3. Empty programmes should display appropriately
// 4. Invalid data should fail gracefully

describe("validateProgrammeStructure edge cases", () => {
  it("handles units with duplicate order numbers", () => {
    const units = [
      { title: "Unit 1", order: 1 },
      { title: "Unit 2", order: 1 }, // Duplicate!
    ];
    expect(validateProgrammeStructure({ units })).toHaveProperty("warnings");
  });

  it("handles programmes with no units", () => {
    expect(validateProgrammeStructure({ units: [] })).toEqual(
      expect.objectContaining({ isValid: true, isEmpty: true }),
    );
  });

  it("handles malformed lesson data gracefully", () => {
    const unitsWithBadLessons = [
      {
        title: "Unit 1",
        order: 1,
        lessons: [null, undefined, { title: "Valid Lesson" }],
      },
    ];
    expect(() =>
      validateProgrammeStructure({ units: unitsWithBadLessons }),
    ).not.toThrow();
  });
});
```

## Component Testability Patterns

### Separation of Concerns Template

```typescript
// 1. Pure presentation component (accessibility-first testing)
interface UnitCardProps {
  unit: {
    title: string;
    lessonCount: number;
    keyStage: string;
    order: number;
  };
  onSelectUnit: () => void;
}

export function UnitCard({ unit, onSelectUnit }: UnitCardProps) {
  return (
    <Card>
      <h3>{unit.title}</h3>
      <p>Key Stage: {unit.keyStage}</p>
      <p>{unit.lessonCount} lessons available</p>
      <Button
        onClick={onSelectUnit}
        aria-label={`View lessons for ${unit.title} unit`}
      >
        View Lessons
      </Button>
    </Card>
  );
}

// 2. Container handles side effects (mock in tests)
export function UnitCardContainer({ unitSlug }: { unitSlug: string }) {
  const unit = useUnitData(unitSlug);
  const { selectUnit } = useUnitNavigation();

  return <UnitCard unit={unit} onSelectUnit={() => selectUnit(unitSlug)} />;
}
```

### Test Template for Components (Accessibility-First)

```typescript
describe("UnitCard", () => {
  const defaultProps = {
    unit: {
      title: "Fractions and Decimals",
      lessonCount: 12,
      keyStage: "Key Stage 2",
      order: 3
    },
    onSelectUnit: jest.fn()
  };

  it("displays unit information accessibly", () => {
    render(<UnitCard {...defaultProps} />);

    // Accessibility-first queries
    expect(screen.getByRole("heading", { name: /fractions and decimals/i }))
      .toBeInTheDocument();
    expect(screen.getByText(/key stage 2/i)).toBeInTheDocument();
    expect(screen.getByText(/12 lessons available/i)).toBeInTheDocument();
  });

  it("provides accessible navigation button", () => {
    render(<UnitCard {...defaultProps} />);

    const viewButton = screen.getByRole("button", {
      name: /view lessons for fractions and decimals unit/i
    });
    expect(viewButton).toBeInTheDocument();

    // Test interaction
    fireEvent.click(viewButton);
    expect(defaultProps.onSelectUnit).toHaveBeenCalledTimes(1);
  });

  it("handles empty lesson count gracefully", () => {
    const propsWithNoLessons = {
      ...defaultProps,
      unit: { ...defaultProps.unit, lessonCount: 0 }
    };
    render(<UnitCard {...propsWithNoLessons} />);
    expect(screen.getByText(/0 lessons available/i)).toBeInTheDocument();
  });
});
```

## User-Focused Testing Practice

### User Story to Test Pattern

```typescript
// User story: "As a teacher, I want to find appropriate units for my key stage"

describe("UnitFilter for teachers", () => {
  it("filters units by key stage accurately", () => {
    const allUnits = [
      { title: "Counting", keyStage: "Key Stage 1" },
      { title: "Fractions", keyStage: "Key Stage 2" },
      { title: "Algebra", keyStage: "Key Stage 3" },
    ];
    const ks2Units = filterUnitsByKeyStage(allUnits, "Key Stage 2");
    expect(ks2Units).toHaveLength(1);
    expect(ks2Units[0].title).toBe("Fractions");
  });

  it("handles partial key stage matches for flexibility", () => {
    const results = filterUnitsByKeyStage(mockUnits, "KS2");
    expect(results).toContain(
      expect.objectContaining({
        keyStage: expect.stringMatching(/key stage 2/i),
      }),
    );
  });

  it("prioritizes units with published lessons", () => {
    const results = filterUnitsByKeyStage(mockUnits, "Key Stage 2");
    const hasPublishedLessons = results.every((unit) =>
      unit.lessons.some((lesson) => lesson._state === "published"),
    );
    expect(hasPublishedLessons).toBe(true);
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

Test Quality Assessment

- Which tests gave me the most confidence this week?
- Which tests felt like busywork?
- What testing patterns am I developing?

TDD Practice Review

- How often did I write tests first?
- When I skipped TDD, what was the reason?
- What would make TDD feel more natural?

Learning Insights

- What did tests reveal about my assumptions?
- How did testing change my approach to solutions?
- What testing techniques do I want to try next?

## Integration with Oak Development

### Oak-Specific Patterns with Accessibility Focus

```typescript
// Testing curriculum data transformations with accessibility validation
describe("transformCurriculumData", () => {
  it("preserves lesson order for logical navigation", () => {
    const unitData = {
      lessons: [
        { title: "Introduction to Fractions", order: 1, _state: "published" },
        { title: "Adding Fractions", order: 2, _state: "published" },
        { title: "Subtracting Fractions", order: 3, _state: "new" },
      ],
    };
    const result = transformCurriculumData(unitData);

    expect(result.publishedLessons.map((l) => l.order)).toEqual([1, 2]);
    expect(result.navigationStructure).toHaveProperty(
      "hasLogicalProgression",
      true,
    );
  });
});

// Testing educational content validation with inclusive design
describe("validateLessonContent", () => {
  it("ensures content meets accessibility standards", () => {
    const lessonContent = {
      title: "Fractions Introduction",
      description: "Learn about fractions with visual examples",
      mediaItems: [{ alt: "Pie chart showing 1/4 sections", type: "image" }],
    };
    const result = validateLessonContent(lessonContent, {
      keyStage: "Key Stage 1",
      includeAccessibilityCheck: true,
    });

    expect(result.errors).toHaveLength(0);
    expect(result.accessibilityScore).toBeGreaterThan(0.8);
  });

  it("flags missing alt text for images", () => {
    const problematicContent = {
      title: "Visual Fractions",
      mediaItems: [{ type: "image" }], // Missing alt text
    };
    const result = validateLessonContent(problematicContent, {
      includeAccessibilityCheck: true,
    });

    expect(result.accessibilityIssues).toContain(
      expect.objectContaining({
        type: "missing_alt_text",
        severity: "high",
      }),
    );
  });
});
```

### Team Practices with Recursive Awareness

- **Pair Programming**: Take turns being the "test-first" person, notice when assumptions about curriculum emerge
- **Code Reviews**: Include testability AND accessibility patterns in review criteria, ask "how would a screen reader user experience this?"
- **Sprint Planning**: Consider testing approach when estimating stories, reflect on how feature complexity affects teacher/student experience
- **Retrospectives**: Dedicate time to examining testing patterns - what do they reveal about how we think about education?
- **Accessibility Reviews**: Each PR includes check for semantic HTML and ARIA usage that supports both testing and inclusive design

---

## Accessibility-First Testing Integration

### Enhanced Query Patterns for Oak

```typescript
// Before: Basic text matching
expect(screen.getByText("Mathematics")).toBeInTheDocument();

// After: Accessibility-aware testing
expect(
  screen.getByRole("heading", { name: /mathematics/i }),
).toBeInTheDocument();

// Benefits:
// 1. Tests semantic structure (good for screen readers)
// 2. More resilient to styling changes
// 3. Validates educational content hierarchy
```

### Curriculum-Aware Testing Practices

```typescript
// Test educational flow and accessibility together
describe("LessonNavigation", () => {
  it("provides logical progression for screen reader users", () => {
    render(<LessonNavigation lessons={mockLessons} currentIndex={1} />);

    const prevButton = screen.getByRole("button", { name: /previous lesson/i });
    const nextButton = screen.getByRole("button", { name: /next lesson/i });

    expect(prevButton).not.toBeDisabled();
    expect(nextButton).toHaveAttribute("aria-describedby",
      expect.stringContaining("lesson-progress"));
  });
});
```

### Meta-Testing Questions

Regularly ask yourself:

- How do these tests reflect our understanding of teaching and learning?
- What assumptions about curriculum structure are embedded in our test design?
- Are we testing the experience of diverse learners and educators?
- How might our testing practices shape the educational tools we build?

---

_These practices integrate consciousness of educational purpose with technical excellence. Testing becomes a way of caring for the teachers and students who will use our software._
