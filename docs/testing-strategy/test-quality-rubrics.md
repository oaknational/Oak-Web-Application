# Test Quality Rubrics

**Status**: Active  
**Current Version**: 2.0  
**Last Updated**: July 7, 2025  
**Purpose**: Comprehensive test quality evaluation criteria with performance and tooling standards

---

## Testing Philosophy & Test Types

### Core Principle: Out-of-Process vs In-Process Testing

**Out-of-Process Tests** (Current Oak Standard): All IO is refactored out or mocked

- **Unit Tests**: Pure functions with no IO to mock by definition
- **Integration Tests**: Multiple units working together, all IO mocked
- **Component Tests**: React components with all IO mocked (API calls, file system, etc.)
- **API Tests**: Route handlers with database/external service calls mocked
- **Contract Tests**: API contract validation with external dependencies mocked

**In-Process Tests** (Not currently used): Real IO operations

- **End-to-End Tests**: Real browser, real database, real external services
- **System Integration Tests**: Real database connections, real file system
- **Service Integration Tests**: Real external API calls
- **Database Integration Tests**: Real database operations
- **Performance Tests**: Real infrastructure under load

### Test Type Definitions

#### Unit Tests

- **Definition**: Test pure functions with no side effects
- **Scope**: Single function/method in isolation
- **IO**: None by definition (pure functions)
- **Example**: `calculateGrade(score, maxScore) => percentage`

#### Integration Tests

- **Definition**: Test multiple units working together
- **Scope**: Multiple functions/modules interacting
- **IO**: All external dependencies mocked
- **Example**: User authentication flow with mocked database

#### Component Tests

- **Definition**: Test React components in isolation
- **Scope**: Single component with its hooks and state
- **IO**: All API calls, routing, external services mocked
- **Example**: Login form with mocked authentication API

#### API Tests

- **Definition**: Test API route handlers
- **Scope**: Single endpoint with business logic
- **IO**: Database queries, external APIs mocked
- **Example**: `/api/lessons` with mocked Sanity CMS

#### Contract Tests

- **Definition**: Verify API contracts between services
- **Scope**: Request/response structure validation
- **IO**: External service contracts mocked
- **Example**: Verify HubSpot API integration matches expected schema

---

## Test Quality Rubric (1-10 Scale)

### Scoring Categories

Each category worth 2 points maximum. Where criteria don't apply, final score **MUST** be normalised to 1-10 scale.

#### 1. Accessibility-First Testing (0-2 points)

*Applies to React Testing Library tests only*

- **2 points**: ≥90% semantic queries + comprehensive accessibility
  - Semantic queries: `getByRole`, `getByLabelText`, `getByText`
  - Keyboard navigation testing
  - Screen reader compatibility validation
  - ARIA attributes testing
  - Focus management verification
  - **Tools**: jest-axe, @testing-library/jest-dom
- **1 point**: 50-89% semantic queries
- **0 points**: <50% semantic queries, heavy `getByTestId` usage

#### 2. Descriptive Test Names (0-2 points)

*Applies to all tests*

- **2 points**: User-story format with clear business value
  - Example: "should allow authenticated teacher to download lesson resources"
- **1 point**: Technical but clear descriptions
  - Example: "renders lesson title correctly"
- **0 points**: Vague or implementation-focused
  - Example: "test 1", "should work"

#### 3. Comprehensive Coverage (0-2 points)

*Applies to all tests*

- **2 points**: Complete scenario coverage
  - Happy paths fully tested
  - Error states and edge cases
  - Loading and async states
  - User interaction flows
  - Performance considerations
- **1 point**: Good coverage with gaps
- **0 points**: Happy path only

#### 4. Domain Modelling (0-2 points)

*Applies to integration tests only*

- **2 points**: Rich educational domain modelling
  - Realistic Oak curriculum scenarios
  - Teacher/pupil journey representation
  - Authentic lesson/unit/subject data
- **1 point**: Some domain concepts present
- **0 points**: Generic test data only

#### 5. Testable Patterns (0-2 points)

*Applies to all tests and source code*

- **2 points**: Excellent test architecture
  - Pure functions extracted for business logic
  - Proper mocking and isolation
  - No implementation detail testing
  - Clear arrange-act-assert structure
  - Reusable test utilities
- **1 point**: Good patterns with issues
- **0 points**: Poor patterns, brittle tests

#### 6. Performance Standards (0-2 points)

*Applies to all tests*

- **2 points**: Excellent performance
  - Unit tests: <10ms per test
  - Component tests: <100ms per test
  - Integration tests: <500ms per test
  - API tests: <200ms per test
  - Contract tests: <50ms per test
- **1 point**: Good performance (within 2x thresholds)
- **0 points**: Poor performance (>2x thresholds)

### Test Type Scoring Matrix

| Test Type | Accessibility | Names | Coverage | Domain | Patterns | Performance | Max Points |
|-----------|--------------|-------|----------|---------|----------|-------------|------------|
| **Unit Tests** | N/A | ✓ | ✓ | N/A | ✓ | ✓ | 8 |
| **Integration Tests** | N/A | ✓ | ✓ | ✓ | ✓ | ✓ | 10 |
| **Component Tests** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 12 |
| **API Tests** | N/A | ✓ | ✓ | ✓ | ✓ | ✓ | 10 |
| **Contract Tests** | N/A | ✓ | ✓ | N/A | ✓ | ✓ | 8 |

### Quality Grade Interpretation

Scores are normalised to 1-10 scale:

- **9-10 (Exceptional)**: Template-worthy, organisational best practices
- **7-8 (Good)**: Solid foundation with specific improvements needed
- **5-6 (Adequate)**: Functional but requires multiple improvements
- **3-4 (Poor)**: Significant gaps requiring substantial refactoring
- **1-2 (Critical)**: Fundamental issues requiring complete redesign

---

## Accessibility Testing Tools & Standards

### Required Tools

```bash
# Core accessibility testing
npm install --save-dev jest-axe @testing-library/jest-dom

# Optional but recommended
npm install --save-dev @axe-core/playwright  # For E2E tests
```

### Accessibility Test Patterns

#### Basic Accessibility Test

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should have no accessibility violations', async () => {
  const { container } = render(<LessonCard lesson={mockLesson} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

#### Comprehensive Accessibility Test

```typescript
it('should support full keyboard navigation', async () => {
  const user = userEvent.setup();
  render(<LessonDownloadForm />);
  
  // Tab navigation
  await user.tab();
  expect(screen.getByRole('button', { name: /download/i })).toHaveFocus();
  
  // Enter key activation
  await user.keyboard('{Enter}');
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  
  // Escape key dismissal
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
```

#### Screen Reader Testing

```typescript
it('should provide proper screen reader context', () => {
  render(<LessonProgress completed={3} total={10} />);
  
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3');
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '10');
  expect(screen.getByRole('progressbar')).toHaveAttribute(
    'aria-valuetext', 
    'Completed 3 of 10 lessons'
  );
});
```

---

## Test Type Examples

### Unit Test Example (10/10)

```typescript
// Pure function - no IO to mock
describe('calculateLessonProgress', () => {
  it('should calculate percentage completion for completed lessons', () => {
    const completed = 7;
    const total = 10;
    
    const result = calculateLessonProgress(completed, total);
    
    expect(result).toEqual({
      percentage: 70,
      isComplete: false,
      remainingLessons: 3
    });
  });
  
  it('should handle edge case of zero total lessons', () => {
    expect(calculateLessonProgress(0, 0)).toEqual({
      percentage: 0,
      isComplete: true,
      remainingLessons: 0
    });
  });
});
```

### Component Test Example (10/10)

```typescript
describe('LessonCard', () => {
  it('should allow teacher to bookmark lesson with accessibility support', async () => {
    const mockBookmark = jest.fn();
    const user = userEvent.setup();
    
    render(
      <LessonCard 
        lesson={mockMathsLesson} 
        onBookmark={mockBookmark}
      />
    );
    
    const bookmarkButton = screen.getByRole('button', { 
      name: /bookmark maths lesson fractions/i 
    });
    
    await user.click(bookmarkButton);
    
    expect(mockBookmark).toHaveBeenCalledWith('maths-fractions-lesson');
    expect(bookmarkButton).toHaveAttribute('aria-pressed', 'true');
    
    // Accessibility validation
    const { container } = render(<LessonCard lesson={mockMathsLesson} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### API Test Example (8/10)

```typescript
describe('GET /api/lessons/[lessonId]', () => {
  it('should return lesson data for authenticated teacher', async () => {
    const mockLesson = createMockLesson({ subject: 'Mathematics' });
    mockSanityClient.fetch.mockResolvedValue(mockLesson);
    
    const { req, res } = createMocks({
      method: 'GET',
      query: { lessonId: 'maths-fractions-001' }
    });
    
    await handler(req, res);
    
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      lesson: mockLesson,
      downloadUrl: expect.stringContaining('/download/maths-fractions-001')
    });
  });
});
```

### Integration Test Example (10/10)

```typescript
describe('Teacher lesson download flow', () => {
  it('should complete full download journey for authenticated teacher', async () => {
    const mockAuthenticatedTeacher = createMockTeacher({ 
      region: 'GB', 
      verified: true 
    });
    
    const user = userEvent.setup();
    
    render(
      <AuthProvider user={mockAuthenticatedTeacher}>
        <LessonDownloadPage lessonSlug="fractions-introduction" />
      </AuthProvider>
    );
    
    // Navigate to download
    await user.click(screen.getByRole('button', { name: /download resources/i }));
    
    // Complete terms acceptance
    await user.click(screen.getByRole('checkbox', { name: /accept terms/i }));
    
    // Submit download
    await user.click(screen.getByRole('button', { name: /start download/i }));
    
    // Verify analytics tracking
    expect(mockTrack).toHaveBeenCalledWith('teacher.download_started', {
      lessonSlug: 'fractions-introduction',
      teacherRegion: 'GB'
    });
    
    // Verify download initiated
    expect(screen.getByRole('alert')).toHaveTextContent(/download starting/i);
  });
});
```

### Contract Test Example (8/10)

```typescript
describe('HubSpot API Contract', () => {
  it('should match expected contact creation schema', async () => {
    const mockHubSpotResponse = {
      id: '12345',
      properties: {
        email: 'teacher@school.edu',
        region: 'GB',
        created: '2025-01-01T00:00:00Z'
      }
    };
    
    mockHubSpotClient.post.mockResolvedValue(mockHubSpotResponse);
    
    const result = await createHubSpotContact({
      email: 'teacher@school.edu',
      region: 'GB'
    });
    
    expect(result).toMatchSchema(hubSpotContactSchema);
    expect(mockHubSpotClient.post).toHaveBeenCalledWith(
      '/contacts',
      expect.objectContaining({
        properties: {
          email: 'teacher@school.edu',
          region: 'GB'
        }
      })
    );
  });
});
```

---

## Performance Standards

### Test Execution Time Thresholds

| Test Type | Target Time | Maximum Time | Rationale |
|-----------|-------------|--------------|-----------|
| Unit Tests | <10ms | <25ms | Pure functions, no IO |
| Component Tests | <100ms | <250ms | React rendering, user events |
| Integration Tests | <500ms | <1000ms | Multiple components, complex flows |
| API Tests | <200ms | <500ms | Mocked external services |
| Contract Tests | <50ms | <100ms | Schema validation only |

### Performance Monitoring

```typescript
// Jest timeout configuration
jest.setTimeout(10000); // 10 second global timeout

// Individual test timeouts
it('should complete lesson search quickly', async () => {
  const startTime = Date.now();
  
  // Test implementation
  await searchLessons('mathematics');
  
  const executionTime = Date.now() - startTime;
  expect(executionTime).toBeLessThan(100); // Component test threshold
}, 250); // Maximum timeout
```

---

## Application Guidelines

1. **Code Reviews**: Apply rubric during all test-related reviews
2. **CI/CD Integration**: Automated performance monitoring
3. **Test Scoring**: Record rubric scores in test file comments
4. **Regular Audits**: Monthly rubric compliance assessment
5. **Tool Integration**: Mandatory jest-axe for accessibility testing

## Success Metrics

### Current Baseline (July 2025)

- Average Score: 5.8/10 across codebase
- Accessibility Testing: 5% of React components
- Performance: 60% of tests within thresholds

### Target Metrics (Phase 2)

- Average Score: 8.5/10
- Accessibility Testing: 95% of React components
- Performance: 90% of tests within thresholds
- Tool Coverage: 100% jest-axe integration

---

## Deprecated Rubrics (Historical Reference Only)

### ⚠️ Phase 1.0 Initial Rubric (DEPRECATED)

**Status**: ❌ ARCHIVED  
**Reason**: Less comprehensive, didn't emphasize accessibility or performance standards

This earlier version used 5 categories (without performance standards) and had less stringent requirements:

#### Original Test Type Scoring Matrix (Pre-Performance Standards)

| Test Type | Accessibility | Descriptive Names | Coverage | Domain Modelling | Testable Patterns | Max Points |
|-----------|--------------|-------------------|----------|------------------|------------------|------------|
| **Unit Tests (Pure Functions)** | N/A | ✓ | ✓ | N/A | ✓ | 6 |
| **React Component Tests** | ✓ | ✓ | ✓ | ✓ | ✓ | 10 |
| **API Route Tests** | N/A | ✓ | ✓ | ✓ | ✓ | 8 |
| **Integration Tests** | ✓ | ✓ | ✓ | ✓ | ✓ | 10 |
| **Utility Function Tests** | N/A | ✓ | ✓ | N/A | ✓ | 6 |

**Key Changes in Version 2.0**:

- Added Performance Standards (6th category)
- Increased accessibility requirements (90% vs 70% semantic queries)  
- Enhanced domain modelling expectations
- Added comprehensive accessibility tooling requirements
- Updated scoring matrix to include performance criteria

---

## Related Documents

- [Testing Strategy Index](./index.md) - Complete testing guidance
- [Core Testing Principles](./core-principles.md) - Fundamental concepts
- [React Testing Patterns](./react-testing.md) - Component-specific guidance
- [API Testing Strategies](./api-testing.md) - Backend testing approaches
- [Testing Improvement Phase 1.1 Report](../../.agent/plans/testing-improvement-phase-1-1-report.md) - Application results
