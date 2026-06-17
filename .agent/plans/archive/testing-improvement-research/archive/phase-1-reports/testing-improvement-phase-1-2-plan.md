# Phase 1.2 Plan: Identify & Prioritize

**Phase**: 1.2 - Identify Improvements  
**Status**: COMPLETE (July 9, 2025)  
**Prerequisites**: Phase 1.1 Complete (633 files analyzed with context-aware scoring)  
**Outcome**: Documented improvement opportunities with example patterns (no production code changes)

**Important**: Phase 1 is about understanding and planning. No production code will be modified. All code examples will be created in documentation to demonstrate patterns.

## Progress Update

### Completed Work (July 9, 2025)
- ✅ Test organization audit with specific patterns and anti-patterns
- ✅ Pure function extraction opportunities identified and prioritized (10+ functions)
- ✅ Test type examples created with Oak-specific code patterns
- ✅ Foundation documents created in `.agent/plans/testing-improvement/outputs/`
- ✅ Older documents archived to `.agent/plans/testing-improvement/archive/`

## Executive Summary

Phase 1.1 revealed that Oak has strong utility testing (7.8/10) but weak component testing (5.2/10). The primary need is **solid testing foundations**: pure functions, well-defined boundaries, and proper test types as defined in [docs/testing-strategy/index.md](../../docs/testing-strategy/index.md). Once the foundations are solid, we can address accessibility and performance.

## Priority 1: Build Testing Foundations

### Extract Pure Functions from Components

**What I'll Actually Do**:

1. **Analyze High-Impact Components**
   - Use `Grep` to find components with inline business logic
   - Read components like `QuizRenderer`, `CurriculumDownloadView`, `VideoPlayer`
   - Identify calculations, transformations, and logic mixed with React code

2. **Document Example Refactorings**
   - Create example pure function extractions in documentation
   - Show before/after patterns (not actual code changes)
   - Document the approach for Phase 2 implementation

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

2. **Document Comprehensive Test Strategy**
   - Outline unit tests needed for pure logic
   - Design integration test approach with mocked external calls
   - Document teacher workflow test scenarios

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

2. **Document Performance Patterns**
   - Show how to add timing to critical component renders
   - Design API endpoint response time measurement
   - Document performance assertion helper patterns

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

2. **Document Test Improvement Strategies**
   - Identify implementation detail testing to remove
   - Design user behaviour test approaches
   - Plan business logic extraction to pure functions
   - Document IO mocking strategies

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

2. **Design Mock Factory Patterns**
   - Document reusable mock factory patterns for common objects
   - Show type-safe examples
   - Create usage guidelines for Phase 2

### Quick Wins Through Pure Function Extraction

**What I'll Actually Do**:

1. **Find Low-Hanging Fruit**
   - Search for components with inline calculations
   - Identify formatting logic in components
   - Find validation logic mixed with UI

2. **Document Quick Win Opportunities**
   - Identify specific functions ready for extraction
   - Outline test requirements for each
   - Prioritize by immediate value for Phase 2

## Deliverables

### Analysis Documents ✅ COMPLETED

- ✅ `pure-function-opportunities.md` - 10+ extraction candidates with prioritization
- ✅ `test-organization-audit.md` - Current state with patterns and anti-patterns
- ✅ `test-type-examples.md` - Oak-specific test patterns and examples
- ✅ `phase-1-2-foundations-summary.md` - Summary of foundation work

### Example Implementations ✅ COMPLETED

- ✅ Pure function extraction patterns documented in `pure-function-opportunities.md`
- ✅ Test type examples in `test-type-examples.md` with Oak code
- ✅ Performance testing patterns using performance.now()
- ✅ Component refactoring examples in `high-traffic-components-test-plan.md`

### Test Improvement Documentation ✅ COMPLETED

- ✅ `curriculum-downloads-test-plan.md` - Comprehensive test strategy
- ✅ `high-traffic-components-test-plan.md` - Top 20 components with behavior test plans
- ✅ `mock-factory-patterns.md` - Implementation patterns for Phase 2

## Success Indicators

### Foundation Strength ✅ COMPLETE

- [x] 10+ pure functions identified for extraction with test plans
- [x] Clear test type boundaries documented (unit, integration, component, API)
- [x] Mock factory patterns designed (comprehensive guide created)

### Critical Coverage ✅ COMPLETE

- [x] Curriculum-downloads endpoint test strategy documented
- [x] Top 20 components identified with behaviour test plans (full list in high-traffic-components-test-plan.md)
- [x] Performance patterns documented with examples using performance.now()

### Team Enablement ✅ COMPLETE

- [x] Examples demonstrate each pattern (pure functions, test types, performance)
- [x] Documentation enables self-service (foundation docs created)
- [x] Quick wins build momentum (Priority 1 functions identified)

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

**Note**: This plan focuses on identification and documentation only. All code examples will be in markdown documentation to demonstrate patterns. Actual implementation of these improvements will occur in Phase 2. No production code changes in Phase 1.
