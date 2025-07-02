# Research Findings - Current Test Landscape

**This document captures key findings from analyzing 655+ test files in the Oak codebase to inform the new testing strategy.**

## Quantitative Overview

- **Total test files**: 655+
- **Main categories**: Components, utilities, hooks, pages, API routes, contexts
- **Test runner**: Jest with React Testing Library
- **Coverage**: Varies significantly across modules

## Quality Assessment

### Examples of Good Tests (Patterns to Preserve)

```typescript
// src/utils/formatDate.test.ts - Simple, pure function test
describe("formatDate", () => {
  test("should default to format like 14 April 1989", () => {
    expect(formatDate("1989-04-14")).toBe("14 April 1989");
  });
  test("can update the month format with options", () => {
    expect(formatDate("1989-04-14", { month: "short" })).toBe("14 Apr 1989");
  });
});
```

**Why this is good**: 
- Tests pure function
- Clear, descriptive test names
- Tests behavior, not implementation
- Multiple scenarios covered

### Examples of Problematic Tests (Patterns to Transform)

```typescript
// src/context/Analytics/AnalyticsProvider.test.tsx - Over-mocked, complex setup
const posthogIdentify = jest.fn();
const posthogCapture = jest.fn();
const posthogInit = jest.fn();

// Heavy mocking of multiple systems
jest.mock("../../browser-lib/analytics/withQueue", () => ({...}));
jest.mock("@/browser-lib/getBrowserConfig", () => {...});

// Complex test setup with nested providers
const CallIdentify = () => {
  return (
    <CookieConsentProvider client={new MockOakConsentClient()}>
      <PostHogProvider client={{...}}>
        <AnalyticsProvider avoOptions={{...}}>
          <ChildCallingIdentify />
        </AnalyticsProvider>
      </PostHogProvider>
    </CookieConsentProvider>
  );
};
```

**Problems identified**:
- Too much setup for what's being tested
- Mocking implementation details rather than boundaries
- Testing integration of multiple systems in a "unit" test
- Hard to understand what's actually being verified

## Common Anti-Patterns Found

1. **Over-mocking**: Mocking everything instead of isolating at proper boundaries
2. **Testing implementation details**: Testing how things work instead of what they do
3. **Complex test setup**: Tests requiring extensive mocking suggest poor separation of concerns
4. **Missing TDD**: Tests written after code, leading to tests that validate implementation
5. **Generic test names**: "should work" instead of describing specific behavior

## Architecture Issues Revealed by Tests

1. **Side effects mixed with logic**: Many functions hard to test because they mix I/O with business logic
2. **Tightly coupled components**: Heavy mocking required suggests tight coupling
3. **Missing pure functions**: Opportunities to extract testable pure functions from complex components
4. **Context over-use**: Some contexts could be simplified or split

## Improvement Opportunities

### Immediate Wins
- Extract pure functions from components and test them separately
- Improve test naming to describe behavior
- Reduce mocking by testing at proper boundaries
- Add missing edge case tests

### Architectural Improvements
- Separate side effects from business logic
- Use dependency injection for easier testing
- Create more composable components
- Extract custom hooks for complex logic

### TDD Implementation
- Start all new features with failing tests
- Refactor existing code using TDD approach
- Focus on testing user behavior, not implementation

## Oak-Specific Testing Needs

### Curriculum Domain
- Test curriculum hierarchy (Programme → Unit → Lesson)
- Validate curriculum data transformations
- Test subject/key stage filtering logic

### Educational Content
- Test lesson content parsing
- Validate transcript handling
- Test accessibility features

### Next.js Patterns
- Test SSG pages with curriculum data
- Test API routes for downloads
- Test ISR behavior with CMS content

## Next Steps

Use these findings to:
1. Create transformation guides for improving existing tests
2. Establish patterns for new tests
3. Identify refactoring opportunities in the codebase
4. Define quality standards for future tests

---

**Date**: 2025-01-01  
**Files analyzed**: 655+ test files across src/ directory  
**Focus areas**: Components, utilities, hooks, contexts, pages, API routes