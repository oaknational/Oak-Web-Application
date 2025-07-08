# Phase 1.2 Implementation Plan: Identify & Prioritize

**Phase**: 1.2 - Identify Improvements  
**Prerequisites**: Phase 1.1 Complete (633 files analyzed with context-aware scoring)  
**Outcome**: Concrete, prioritized improvements with example implementations

## Executive Summary

Phase 1.1 revealed that Oak has strong utility testing (7.8/10) but weak component testing (5.2/10). The primary need is **solid testing foundations**: pure functions, well-defined boundaries, and proper test types as defined in [docs/testing-strategy/index.md](../../docs/testing-strategy/index.md). Once the foundations are solid, we can address accessibility and performance.

## Priority 1: Build Testing Foundations

### Extract Pure Functions from Components

**What I'll Actually Do**:

1. **Analyze High-Impact Components**
   - Use `Grep` to find components with inline business logic
   - Read components like `QuizRenderer`, `CurriculumDownloadView`, `VideoPlayer`
   - Identify calculations, transformations, and logic mixed with React code

2. **Create Example Refactorings**
   - Write pure function extractions with tests
   - Show before/after examples
   - Document the pattern for team adoption

**Example Pattern I'll Demonstrate**:

```typescript
// BEFORE: Logic mixed in component
const QuizComponent = () => {
  const calculateScore = () => {
    // Complex scoring logic inside component
  };
}

// AFTER: Pure function extracted
// src/utils/quiz/scoring.ts
export const calculateQuizScore = (answers: Answer[]): Score => {
  // Pure function, easily testable
};

// src/utils/quiz/scoring.test.ts
describe('calculateQuizScore', () => {
  it('calculates percentage correctly', () => {
    // Simple, fast unit test
  });
});
```

### Establish Clear Test Type Boundaries

**What I'll Actually Do**:

1. **Audit Current Test Organization**
   - Map which tests are true unit tests (no IO)
   - Identify integration tests masquerading as unit tests
   - Find components with mocked IO vs real IO

2. **Create Test Type Examples**
   - Write example unit tests for pure functions
   - Write example integration tests with mocked IO
   - Document when to use each type

**Deliverable**: `test-type-examples.md` with real code from Oak's codebase

## Priority 2: Critical Untested Code

### Curriculum Downloads Endpoint

**What I'll Actually Do**:

1. **Deep Analysis of the Endpoint**
   - Read `/pages/api/curriculum-downloads/index.ts` (326 lines)
   - Map all code paths and edge cases
   - Identify external dependencies

2. **Write Comprehensive Test Suite**
   - Create unit tests for pure logic
   - Create integration tests with mocked external calls
   - Focus on teacher workflow scenarios

**Example Test Structure**:

```typescript
// Unit tests for pure logic
describe('curriculum-downloads utilities', () => {
  describe('generateDownloadPackage', () => {
    it('creates correct file structure for single lesson', () => {
      // Test pure transformation logic
    });
  });
});

// Integration tests with mocked IO
describe('curriculum-downloads API', () => {
  it('handles teacher download request with mocked external services', async () => {
    // Mock external curriculum API
    // Test request/response flow
  });
});
```

### Performance Measurement Implementation

**What I'll Actually Do**:

1. **Create Performance Testing Patterns**
   - Use native `performance.now()` for measurements
   - Write helper functions for consistent timing
   - Document thresholds based on test type

2. **Implement in Key Areas**
   - Add timing to critical component renders
   - Measure API endpoint response times
   - Create performance assertion helpers

**Example Pattern**:

```typescript
// Simple performance helper
const measurePerformance = async (fn: () => Promise<void>): Promise<number> => {
  const start = performance.now();
  await fn();
  return performance.now() - start;
};

// Usage in tests
it('renders within performance budget', async () => {
  const renderTime = await measurePerformance(async () => {
    render(<ExpensiveComponent />);
  });
  expect(renderTime).toBeLessThan(100); // ms
});
```

## Priority 3: Component Test Quality

### Improve Top 20 High-Traffic Components

**What I'll Actually Do**:

1. **Identify High-Traffic Components**
   - Use `Grep` to find most imported components
   - Focus on teacher and pupil critical paths
   - List components by user impact

2. **Refactor Tests Following Best Practices**
   - Remove implementation detail testing
   - Add user behaviour testing
   - Extract business logic to pure functions
   - Mock IO appropriately

**Example Improvements**:

```typescript
// BEFORE: Testing implementation
it('sets state correctly', () => {
  // Tests internal state changes
});

// AFTER: Testing behaviour
it('displays lesson content when teacher selects topic', () => {
  // Tests user-observable behaviour
});
```

## Foundation Before Features

### Test Organization Improvements

**What I'll Actually Do**:

1. **Create Test Organization Guide**
   - Document where different test types belong
   - Show examples from Oak's codebase
   - Create templates for common patterns

2. **Implement Mock Factories**
   - Create reusable mock factories for common objects
   - Ensure type safety
   - Document usage patterns

### Quick Wins Through Pure Function Extraction

**What I'll Actually Do**:

1. **Find Low-Hanging Fruit**
   - Search for components with inline calculations
   - Identify formatting logic in components
   - Find validation logic mixed with UI

2. **Create Quick Extraction PRs**
   - Each PR extracts one pure function
   - Includes comprehensive tests
   - Shows immediate value

## Deliverables

### Analysis Documents

- `pure-function-opportunities.md` - List of extraction candidates
- `test-type-audit.md` - Current state of test organization
- `component-complexity-ranking.md` - Components needing refactoring

### Example Implementations

- `examples/pure-function-extraction/` - Before/after code
- `examples/test-types/` - Proper test type examples
- `examples/performance-testing/` - Performance measurement patterns

### Test Improvements

- `curriculum-downloads.test.ts` - Comprehensive test suite
- Refactored tests for top 5 components
- Mock factory implementations

## Success Indicators

### Foundation Strength

- [ ] 10+ pure functions extracted with tests
- [ ] Clear test type boundaries established
- [ ] Mock factories reducing duplication

### Critical Coverage

- [ ] Curriculum-downloads endpoint fully tested
- [ ] Top 20 components have behaviour-focused tests
- [ ] Performance patterns implemented

### Team Enablement

- [ ] Examples demonstrate each pattern
- [ ] Documentation enables self-service
- [ ] Quick wins build momentum

## How This Builds Better Foundations

1. **Pure Functions First**: Easy to test, fast feedback, clear value
2. **Proper Test Types**: Right tool for right job, faster test suites
3. **Behaviour Over Implementation**: Resilient tests that enable refactoring
4. **Gradual Improvement**: Each change makes the next one easier

## Next Steps

After completing these identifications and examples, Phase 2 will involve:

- Scaling patterns across the codebase
- Training team on established patterns
- Automating quality checks
- Building on solid foundations

---
