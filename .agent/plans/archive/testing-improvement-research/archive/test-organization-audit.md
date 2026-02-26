# Test Organization Audit - Oak Web Application

## Executive Summary

This audit analyzes the current test organization in Oak's codebase to establish a baseline for improvement recommendations in Phase 1.2. The audit examines test types, organization patterns, and quality differences across utility, component, API, and infrastructure tests.

## Key Findings

### 1. Test Organization Patterns

#### Co-located Tests (Primary Pattern)
- **Utilities**: Tests are co-located with source files (e.g., `formatDate.ts` → `formatDate.test.ts`)
- **Components**: Tests are co-located with components (e.g., `Card.tsx` → `Card.test.tsx`)
- **Hooks**: Tests are co-located with hook files
- **API Routes**: Tests follow Next.js structure in `pages/api` directory

#### Centralized Tests
- **Page Tests**: Located in `src/__tests__/pages/` mirroring the pages structure
- **Test Helpers**: Centralized in `src/__tests__/__helpers__/`
- **Fixtures and Mocks**: Spread between co-located fixtures and centralized helpers

### 2. Test Type Classification

#### True Unit Tests (No IO)
**Examples Found:**
- `src/utils/truthy.test.ts` - Pure function testing with no mocks
- `src/utils/formatDate.test.ts` - Pure date formatting logic
- `src/utils/curriculum/formatting.test.ts` - Complex pure functions for curriculum data formatting

**Characteristics:**
- No mocking of external dependencies
- Test pure functions with input/output assertions
- Fast execution
- High maintainability

#### Integration Tests (Mocked IO)
**Examples Found:**
- `src/utils/localstorage.test.ts` - Mocks Storage API
- `src/pages/api/hubspot/contacts/index.test.ts` - Mocks Hubspot client and Clerk
- `src/components/TeacherComponents/LessonOverviewKeywords/LessonOverviewKeywords.test.tsx` - Uses renderWithTheme helper

**Characteristics:**
- Heavy use of `jest.fn()`, `mockImplementation`, `mockResolvedValue`
- Mock external services (Storage, APIs, authentication)
- Test component integration with providers

#### Confused Tests
**Examples Found:**
- Component tests that mock internal implementation details
- Tests with excessive mocking that test mocks rather than behavior
- Tests that combine unit and integration concerns

### 3. Quality Patterns by Category

#### Utilities (Score: 7.8/10) - GOOD
**Strengths:**
- Clear separation of pure functions
- Comprehensive test coverage
- Good use of test data builders and fixtures
- Minimal mocking

**Example Pattern:**
```typescript
// Pure function test
describe("formatDate", () => {
  test("should default to format like 14 April 1989", () => {
    expect(formatDate("1989-04-14")).toBe("14 April 1989");
  });
});
```

#### Components (Score: 5.2/10) - NEEDS IMPROVEMENT
**Issues:**
- Over-reliance on `data-testid` instead of accessibility queries
- Shallow testing of visual properties rather than behavior
- Missing accessibility checks
- Inconsistent use of test utilities

**Example Anti-pattern:**
```typescript
// Testing implementation details
test("has default padding 24", async () => {
  const { getByTestId } = render(<Card data-testid="test" />);
  expect(getByTestId("test")).toHaveStyle("padding-left: 1.5rem");
});
```

#### API Tests
**Strengths:**
- Good mocking patterns for external services
- Clear request/response testing
- Proper authorization testing

**Pattern:**
```typescript
test("requires authorization", async () => {
  setGetAuth(mockGetAuthSignedOut);
  const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
    method: "GET",
  });
  await handler(req, res);
  expect(res._getStatusCode()).toBe(401);
});
```

#### Infrastructure/Test Helpers
**Well-Organized:**
- `renderWithProviders` - Comprehensive provider setup
- Centralized mock factories
- Type-safe test utilities

**Issues:**
- Complex provider composition
- Missing accessibility-first defaults
- No built-in accessibility checks

### 4. Accessibility Testing

**Current State:**
- No systematic accessibility testing
- No jest-axe integration found
- Component tests focus on visual properties rather than semantic HTML
- Missing ARIA and keyboard navigation tests

**Expected Pattern (from docs):**
```typescript
// Not found in actual tests
describe("accessibility compliance", () => {
  it("meets WCAG 2.1 Level AA standards", () => {
    // Test color contrast, focus management, ARIA usage
  });
});
```

### 5. Test Data Management

**Good Patterns Found:**
- Fixture files for complex data (e.g., curriculum data)
- Mock factories with TypeScript types
- Centralized mock data in `__tests__/__helpers__/`

**Example:**
```typescript
// Good pattern in fixtures
export function createMockLesson(overrides: Partial<OakLesson> = {}): OakLesson {
  return {
    _id: "lesson-123",
    _state: "published",
    title: "Introduction to Fractions",
    // ... comprehensive defaults
    ...overrides,
  };
}
```

### 6. TypeScript Integration

**Strengths:**
- Good use of type-safe mocks
- Proper typing for test utilities
- Type checking in test files

**Gaps:**
- Missing `MockedFunction` utility usage (mentioned in docs)
- Inconsistent typing for mock data

## Recommendations for Phase 1.2

### 1. Immediate Improvements

1. **Add Accessibility Testing**
   - Integrate jest-axe
   - Add accessibility checks to renderWithProviders
   - Create accessibility-first test examples

2. **Refactor Component Tests**
   - Replace data-testid with accessibility queries
   - Focus on user behavior over implementation
   - Add keyboard navigation tests

3. **Extract More Pure Functions**
   - Identify logic in components that can be extracted
   - Create pure function utilities with unit tests
   - Reduce mocking in component tests

### 2. Organization Improvements

1. **Standardize Test Patterns**
   - Create test templates for each category
   - Document when to use unit vs integration tests
   - Establish clear mocking guidelines

2. **Improve Test Utilities**
   - Add accessibility checks by default
   - Simplify provider composition
   - Create category-specific render helpers

3. **Consolidate Test Data**
   - Create centralized fixture directory
   - Standardize mock factories
   - Add curriculum-specific test builders

### 3. Cultural Changes

1. **Adopt TDD for New Features**
   - Start with failing tests
   - Focus on behavior, not implementation
   - Extract pure functions early

2. **Accessibility-First Mindset**
   - Every component test includes accessibility
   - Use semantic queries
   - Test keyboard navigation

3. **Clear Test Categories**
   - Label tests as UNIT, INTEGRATION, or E2E
   - Separate concerns appropriately
   - Minimize mocking in unit tests

## Examples of Well-Organized Tests

### 1. Pure Function Unit Test
```typescript
// src/utils/curriculum/formatting.test.ts
describe("pluralizeUnits", () => {
  it("one", () => {
    expect(pluralizeUnits(1)).toEqual("unit");
  });
  it("many", () => {
    expect(pluralizeUnits(2)).toEqual("units");
  });
  it("none", () => {
    expect(pluralizeUnits(0)).toEqual("");
  });
});
```

### 2. Good Test Data Builder
```typescript
// Fixture with sensible defaults and overrides
export function createMockLesson(overrides: Partial<OakLesson> = {}): OakLesson {
  return {
    _id: "lesson-123",
    _state: "published",
    title: "Introduction to Fractions",
    // ... comprehensive defaults
    ...overrides,
  };
}
```

### 3. Clear API Test Pattern
```typescript
// Clear setup, execution, assertion
test("should return 200 with valid contact data", async () => {
  // Setup
  jest.spyOn(hubspot.crm.contacts.basicApi, "getById").mockResolvedValueOnce({...});
  
  // Execute
  const { req, res } = createMocks<NextApiRequest, NextApiResponse>({ method: "GET" });
  await handler(req, res);
  
  // Assert
  expect(res._getStatusCode()).toBe(200);
  expect(res._getJSONData()).toEqual({...});
});
```

## Detailed Test Organization Patterns

### Test Helper Organization

**Current Structure:**
```
__tests__/
├── __helpers__/
│   ├── mockData/
│   │   ├── curriculum.ts    # Type-safe mock factories
│   │   └── lessons.ts       # Domain-specific fixtures
│   ├── renderWithProviders.tsx  # Enhanced render utilities
│   └── testUtils.ts        # Common test helpers
├── setup.ts                # Jest setup and global mocks
└── mocks/
    ├── handlers.ts         # MSW request handlers
    └── server.ts           # MSW server setup
```

### Naming Convention Patterns

**Good Examples Found:**
- `formatDate.test.ts` - Clear function being tested
- `LessonOverviewHeader.test.tsx` - Component name matches file
- `curriculum-downloads.test.ts` - API route clearly identified

**Problematic Examples:**
- Tests with generic names like `helpers.test.ts`
- Tests that don't match their source file names
- Inconsistent use of `.test.` vs `.spec.`

### Import Pattern Analysis

**Clean Import Pattern (Utilities):**
```typescript
import { formatDate } from './formatDate';
import { mockDate } from '@/__tests__/__helpers__/mockData';
```

**Complex Import Pattern (Components):**
```typescript
import { render } from '@testing-library/react';
import { renderWithProviders } from '@/__tests__/__helpers__/renderWithProviders';
import { mockLesson } from '@/__tests__/__helpers__/mockData/lessons';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useRouter } from 'next/router';
// Multiple mocks and utilities needed
```

## Specific Improvement Opportunities

### 1. Test Utility Consolidation

**Current Issues:**
- Multiple render helpers with similar functionality
- Inconsistent mock data creation
- No centralized accessibility testing utilities

**Proposed Structure:**
```typescript
// __tests__/__helpers__/render.tsx
export const render = createRenderWithDefaults({
  providers: ['theme', 'query', 'analytics'],
  accessibility: true,  // Run axe by default
  performance: true     // Measure render time
});
```

### 2. Mock Data Organization

**Current Good Pattern:**
```typescript
export function createMockLesson(overrides: Partial<Lesson> = {}): Lesson {
  return { ...defaultLesson, ...overrides };
}
```

**Enhancement Opportunity:**
```typescript
// Domain-specific builders
export const lessonBuilder = {
  withVideo: () => createMockLesson({ hasVideo: true }),
  withQuiz: () => createMockLesson({ hasQuiz: true }),
  forKeyStage: (ks: KeyStage) => createMockLesson({ keyStage: ks })
};
```

### 3. Test Category Markers

**Proposed Convention:**
```typescript
// Clear test type identification
describe('[UNIT] formatDate', () => {});
describe('[INTEGRATION] LessonPage', () => {});
describe('[E2E] Teacher Journey', () => {});
```

## Conclusion

Oak's test organization shows a clear pattern of co-located tests with some centralization for page tests and helpers. The utility tests demonstrate good patterns that should be replicated across components. The main improvements needed are:

1. **Accessibility testing integration**
2. **Component test refactoring for behavior over implementation**
3. **Clearer separation of unit and integration tests**
4. **Standardized test patterns and utilities**
5. **Consistent naming and organization conventions**
6. **Enhanced mock data builders**
7. **Performance testing integration**

The foundation is solid, but applying the patterns from the testing strategy documentation will significantly improve test quality and maintainability.