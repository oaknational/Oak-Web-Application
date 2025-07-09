# Curriculum Downloads API Test Plan

**Endpoint**: `/api/curriculum-downloads/index.ts`  
**Current Status**: Partially tested (180 lines of tests for 326 lines of code)  
**Purpose**: Generates downloadable curriculum documents for teachers

## Current Test Coverage Analysis

### What's Currently Tested ✅
1. Cache slug validation and redirects
2. 404 responses for invalid subjects/phases
3. 200 responses for valid requests
4. Missing units/examboard handling
5. "new" state rejection

### What's Missing ❌
1. **Pure Function Extraction Opportunities**
   - `getData()` function (lines 46-218) - complex business logic
   - Curriculum data sorting/filtering logic (lines 78-107)
   - Filename generation logic (lines 293-307)

2. **Error Handling Gaps**
   - CMS client failures beyond null response
   - Partial data scenarios (some data present, some missing)
   - Network timeouts and retries

3. **Business Logic Coverage**
   - KS4 option filtering
   - Tier and child subject filtering
   - Examboard sorting logic
   - Data warning scenarios

4. **Integration Points**
   - Document generation (`docx` function)
   - Multiple external API interactions
   - Cache header behavior

## Proposed Test Structure

### 1. Pure Function Tests (Extract First)

```typescript
// src/utils/curriculum/downloads.ts - NEW FILE
export function sortCurriculumUnits(units: Unit[]): Unit[] {
  // Extract lines 80-107
}

export function generateDocumentFilename(
  subjectTitle: string,
  phaseTitle: string,
  examboardTitle?: string,
  childSubject?: string,
  tier?: string
): string {
  // Extract lines 293-307
}

export function filterKS4Units(
  units: Unit[],
  childSubjectSlug?: string,
  tierSlug?: string
): Unit[] {
  // Extract filtering logic
}

// src/utils/curriculum/downloads.test.ts
describe('sortCurriculumUnits', () => {
  it('places units with examboard before those without', () => {
    const units = [
      { examboard: null, order: 1 },
      { examboard: 'AQA', order: 2 }
    ];
    expect(sortCurriculumUnits(units)[0].examboard).toBe('AQA');
  });

  it('maintains order within examboard groups', () => {
    // Test order preservation
  });

  it('handles null order values', () => {
    // Test -1000 default
  });
});
```

### 2. Integration Tests with Mocked Dependencies

```typescript
describe('curriculum-downloads API integration', () => {
  describe('getData function', () => {
    it('combines data from all three sources correctly', async () => {
      // Mock all three API calls
      // Verify combined data structure
    });

    it('handles missing Sanity data gracefully', async () => {
      // Mock null CMS response
      // Verify dummy data insertion
      // Check data warnings
    });

    it('filters KS4 units by child subject and tier', async () => {
      // Test complex filtering logic
    });
  });

  describe('caching behavior', () => {
    it('sets correct cache headers for published content', async () => {
      // Verify s-maxage and stale-while-revalidate
    });

    it('redirects when mvRefreshTime changes', async () => {
      // Test cache invalidation
    });
  });
});
```

### 3. Error Scenario Tests

```typescript
describe('error handling', () => {
  it('returns 404 when curriculumApi2023 throws', async () => {
    curriculumApi2023.curriculumSequence.mockRejectedValue(
      new Error('API Error')
    );
    // Verify graceful degradation
  });

  it('returns 404 when subject not found in phase options', async () => {
    // Mock missing subject scenario
  });

  it('handles partial data failures', async () => {
    // One API succeeds, another fails
  });
});
```

### 4. Business Logic Tests

```typescript
describe('curriculum business rules', () => {
  it('correctly identifies KS4 content needing filtering', () => {
    // Test keystage_slug === "ks4" logic
  });

  it('applies tier filtering only when both unit and filter have tiers', () => {
    // Test tier_slug logic
  });

  it('generates correct filenames for all subject combinations', () => {
    const testCases = [
      { subject: 'Maths', phase: 'Primary', expected: 'Maths - Primary' },
      { subject: 'English', phase: 'KS4', examboard: 'AQA', expected: 'English - KS4 - AQA' },
      // Add all edge cases
    ];
  });
});
```

### 5. Performance Tests

```typescript
describe('performance', () => {
  it('processes large curriculum datasets within 500ms', async () => {
    const largeDataset = generateLargeCurriculumData(1000); // 1000 units
    
    const start = performance.now();
    await getData({ /* params */ });
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(500);
  });

  it('generates document within 1s for typical curriculum', async () => {
    // Test document generation performance
  });
});
```

## Test Data Requirements

### Mock Factories Needed

```typescript
// __tests__/__helpers__/mockData/curriculum-downloads.ts
export const mockCurriculumSequence = (overrides = {}) => ({
  units: [
    {
      keystage_slug: 'ks3',
      subject_slug: 'english',
      tier_slug: null,
      examboard: null,
      order: 1,
      // ... full unit structure
    }
  ],
  ...overrides
});

export const mockCurriculumOverview = (overrides = {}) => ({
  subjectTitle: 'English',
  phaseTitle: 'Secondary',
  // ... full structure
});

export const mockSanityCMSData = (overrides = {}) => ({
  subjectPrinciples: ['Principle 1', 'Principle 2'],
  curriculumPartner: { name: 'Partner Name', image: null },
  // ... full structure
});
```

## Implementation Priority

1. **High Priority** (Missing Critical Coverage)
   - Extract and test pure functions (sorting, filtering, filename generation)
   - Test data combination logic in `getData`
   - Error handling for external service failures

2. **Medium Priority** (Business Logic)
   - KS4/tier filtering edge cases
   - Data warning scenarios
   - Cache behavior validation

3. **Low Priority** (Nice to Have)
   - Performance benchmarks
   - Generated document validation
   - Comprehensive filename edge cases

## Success Metrics

- Line coverage increases from ~55% to 90%+
- All pure functions extracted and tested at 100%
- All error paths have explicit tests
- Performance benchmarks established
- No untested business logic branches

## Notes for Phase 2 Implementation

1. Start by extracting the three pure functions identified
2. Add integration tests for the main `getData` flow
3. Ensure all teacher-facing features are thoroughly tested
4. Consider adding contract tests for external APIs
5. Add monitoring for document generation failures