# Testing Strategy for AI Agents

Quick reference for writing and improving tests in Oak's codebase.

## Core Requirements

**All new code must use Test-Driven Development (TDD):**

1. STRONGLY prefer pure functions and unit tests
2. Write failing test first (Red)
3. Write minimal code to pass (Green)
4. Refactor with confidence (Refactor)

## Testing Patterns

### React Testing Library Queries (Use in Order)

1. `getByRole` - Preferred for accessibility
2. `getByLabelText` - For form elements
3. `getByText` - For visible text
4. `getByTestId` - Last resort only

### Component Testing Template

```typescript
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("user can [action]", async () => {
  const user = userEvent.setup();
  const { getByRole } = render(<Component />);
  
  await user.click(getByRole("button", { name: /submit/i }));
  
  expect(getByRole("alert")).toHaveTextContent(/success/i);
});
```

### Pure Function Extraction

Extract testable logic from components:

```typescript
// Before: Logic in component
const Component = () => {
  const filtered = items.filter(item => item.stage === "ks3");
  
// After: Extracted pure function
export const filterByKeyStage = (items, stage) => 
  items.filter(item => item.stage === stage);
```

### Mock Factory Pattern

```typescript
const createMockLesson = (overrides = {}) => ({
  id: "lesson-123",
  title: "Default Title",
  keyStage: "ks3",
  subject: "maths",
  ...overrides
});
```

## Oak Domain Testing

Use realistic Oak curriculum data:

- Key stages: `ks1`, `ks2`, `ks3`, `ks4`
- Subjects: `maths`, `english`, `science`
- Year groups: 1-11
- Exam boards: `aqa`, `edexcel`, `ocr`

## Review Checklist

Before submitting code:

- [ ] Tests written before implementation (TDD)
- [ ] Accessibility-first queries used
- [ ] Pure functions extracted where possible
- [ ] Type-safe mocks with proper types
- [ ] Tests use Oak domain terminology
- [ ] No `data-testid` unless absolutely necessary

## Common Patterns

**API Route Testing:**

```typescript
const { req, res } = createMocks({
  method: "POST",
  body: { lessonId: "123" }
});
await handler(req, res);
expect(res._getStatusCode()).toBe(200);
```

**Custom Hook Testing:**

```typescript
const { result } = renderHook(() => useOakData());
expect(result.current.lessons).toHaveLength(5);
```

**Next.js Page Testing:**

```typescript
const { getByRole } = render(<LessonPage lesson={mockLesson} />);
expect(getByRole("heading", { level: 1 })).toHaveTextContent("Lesson Title");
```

See full documentation in `docs/testing-strategy/` for detailed examples and migration guides.
