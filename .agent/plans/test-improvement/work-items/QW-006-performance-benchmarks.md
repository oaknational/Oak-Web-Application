# Implementation Guide: QW-006 - Add Performance Benchmarks to Critical User Paths

**Quick Win ID**: QW-006  
**Title**: Add Performance Benchmarks to Critical User Paths  
**Assignee**: AI Assistant  
**Complexity**: Low  
**Expected Outcome**: Baseline performance metrics for optimization

## Pre-Implementation Checklist

- [ ] Review Phase 1 analysis for most-used components
- [ ] Identify critical user journeys
- [ ] Check for existing performance tests
- [ ] Understand current CI/CD setup for test output
- [ ] Plan measurement points for each user path
- [ ] Document acceptable performance thresholds

## Implementation Steps

### Step 1: Identify Critical User Paths

Based on Phase 1 analysis, prioritize these paths:

1. **Lesson Loading** - Most frequent user action
2. **Quiz Submission** - High impact on user experience  
3. **Search Results** - Performance-sensitive operation
4. **Video Player Init** - Media loading is critical
5. **Resource Downloads** - Teacher workflow dependency
6. **Login Flow** - First impression matters
7. **Programme Navigation** - Core browsing experience
8. **Assessment Creation** - Teacher productivity
9. **Student Progress View** - Dashboard performance
10. **Content Filtering** - Used throughout platform

### Step 2: Create Performance Measurement Utility

**File**: `/src/test-utils/performance.ts`

```typescript
// src/test-utils/performance.ts
/**
 * Performance measurement utilities for tests
 * Provides consistent performance tracking across test suites
 */

export interface PerformanceResult {
  operation: string;
  duration: number;
  threshold: number;
  passed: boolean;
  timestamp: Date;
}

/**
 * Measures the performance of an async operation
 * @param operation - Name of the operation being measured
 * @param fn - Async function to measure
 * @param threshold - Maximum acceptable duration in ms
 * @returns Performance result with timing data
 */
export async function measurePerformance<T>(
  operation: string,
  fn: () => Promise<T>,
  threshold: number
): Promise<{ result: T; performance: PerformanceResult }> {
  const start = performance.now();
  
  try {
    const result = await fn();
    const duration = performance.now() - start;
    
    const performanceResult: PerformanceResult = {
      operation,
      duration,
      threshold,
      passed: duration <= threshold,
      timestamp: new Date(),
    };
    
    // Log to console for CI visibility
    console.log(`[PERF] ${operation}: ${duration.toFixed(2)}ms (threshold: ${threshold}ms) ${performanceResult.passed ? '✓' : '✗'}`);
    
    return { result, performance: performanceResult };
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`[PERF] ${operation} failed after ${duration.toFixed(2)}ms:`, error);
    throw error;
  }
}

/**
 * Measures the performance of a sync operation
 * @param operation - Name of the operation
 * @param fn - Function to measure
 * @param threshold - Maximum acceptable duration in ms
 */
export function measureSyncPerformance<T>(
  operation: string,
  fn: () => T,
  threshold: number
): { result: T; performance: PerformanceResult } {
  const start = performance.now();
  
  const result = fn();
  const duration = performance.now() - start;
  
  const performanceResult: PerformanceResult = {
    operation,
    duration,
    threshold,
    passed: duration <= threshold,
    timestamp: new Date(),
  };
  
  console.log(`[PERF] ${operation}: ${duration.toFixed(2)}ms (threshold: ${threshold}ms) ${performanceResult.passed ? '✓' : '✗'}`);
  
  return { result, performance: performanceResult };
}

/**
 * Helper to collect multiple performance measurements
 */
export class PerformanceCollector {
  private results: PerformanceResult[] = [];
  
  add(result: PerformanceResult): void {
    this.results.push(result);
  }
  
  getReport(): {
    total: number;
    passed: number;
    failed: number;
    averageDuration: number;
    results: PerformanceResult[];
  } {
    const passed = this.results.filter(r => r.passed).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    return {
      total: this.results.length,
      passed,
      failed: this.results.length - passed,
      averageDuration: this.results.length > 0 ? totalDuration / this.results.length : 0,
      results: this.results,
    };
  }
  
  logSummary(): void {
    const report = this.getReport();
    console.log('\n[PERF] Performance Summary:');
    console.log(`[PERF] Total operations: ${report.total}`);
    console.log(`[PERF] Passed: ${report.passed} | Failed: ${report.failed}`);
    console.log(`[PERF] Average duration: ${report.averageDuration.toFixed(2)}ms\n`);
  }
}
```

### Step 3: Add Performance Tests to Lesson Loading

**File**: Update existing lesson component tests

```typescript
// src/components/Lesson/Lesson.test.tsx (example)
import { measurePerformance, PerformanceCollector } from '@/test-utils/performance';
import { render, screen, waitFor } from '@testing-library/react';

describe('Lesson Component Performance', () => {
  const collector = new PerformanceCollector();
  
  afterAll(() => {
    collector.logSummary();
  });
  
  it('should load lesson content within performance budget', async () => {
    const { performance } = await measurePerformance(
      'Lesson Initial Load',
      async () => {
        render(<Lesson lessonId="test-123" />);
        await waitFor(() => {
          expect(screen.getByTestId('lesson-content')).toBeInTheDocument();
        });
      },
      200 // 200ms threshold for initial load
    );
    
    collector.add(performance);
    expect(performance.passed).toBe(true);
  });
  
  it('should render lesson resources quickly', async () => {
    const { performance } = await measurePerformance(
      'Lesson Resources Render',
      async () => {
        const { rerender } = render(<Lesson lessonId="test-123" />);
        
        // Simulate resources loading
        await waitFor(() => {
          expect(screen.getByTestId('lesson-resources')).toBeInTheDocument();
        });
      },
      100 // 100ms for resources section
    );
    
    collector.add(performance);
    expect(performance.passed).toBe(true);
  });
});
```

### Step 4: Add Performance Tests to Quiz Submission

```typescript
// src/components/Quiz/QuizRenderer.test.tsx
describe('Quiz Submission Performance', () => {
  const collector = new PerformanceCollector();
  
  afterAll(() => {
    collector.logSummary();
  });
  
  it('should process quiz submission quickly', async () => {
    render(<QuizRenderer quiz={mockQuiz} />);
    
    // Answer all questions
    const submitButton = screen.getByText('Submit Quiz');
    
    const { performance } = await measurePerformance(
      'Quiz Submission Processing',
      async () => {
        fireEvent.click(submitButton);
        await waitFor(() => {
          expect(screen.getByText('Quiz Complete!')).toBeInTheDocument();
        });
      },
      150 // 150ms threshold for submission
    );
    
    collector.add(performance);
    expect(performance.passed).toBe(true);
  });
  
  it('should calculate quiz score efficiently', () => {
    const answers = generateMockAnswers(50); // 50 questions
    
    const { performance } = measureSyncPerformance(
      'Quiz Score Calculation',
      () => calculateQuizScore(answers, mockQuiz.questions),
      10 // 10ms for score calculation
    );
    
    collector.add(performance);
    expect(performance.passed).toBe(true);
  });
});
```

### Step 5: Add Performance Tests to Search

```typescript
// src/components/Search/SearchResults.test.tsx
describe('Search Performance', () => {
  it('should render search results quickly', async () => {
    const mockResults = generateMockSearchResults(100); // 100 results
    
    const { performance } = await measurePerformance(
      'Search Results Render',
      async () => {
        render(<SearchResults results={mockResults} />);
        await waitFor(() => {
          expect(screen.getAllByTestId('search-result-item')).toHaveLength(100);
        });
      },
      300 // 300ms for 100 results
    );
    
    expect(performance.passed).toBe(true);
  });
  
  it('should filter results efficiently', async () => {
    const { performance } = await measurePerformance(
      'Search Filter Application',
      async () => {
        const { rerender } = render(
          <SearchResults results={mockResults} filters={{}} />
        );
        
        // Apply multiple filters
        rerender(
          <SearchResults 
            results={mockResults} 
            filters={{ subject: 'math', keyStage: 'ks3' }} 
          />
        );
        
        await waitFor(() => {
          expect(screen.getAllByTestId('search-result-item').length).toBeLessThan(100);
        });
      },
      50 // 50ms for filtering
    );
    
    expect(performance.passed).toBe(true);
  });
});
```

### Step 6: Add Performance Tests to Video Player

```typescript
// src/components/VideoPlayer/VideoPlayer.test.tsx
describe('Video Player Performance', () => {
  it('should initialize video player quickly', async () => {
    const { performance } = await measurePerformance(
      'Video Player Initialization',
      async () => {
        render(<VideoPlayer videoUrl="https://example.com/video.mp4" />);
        
        await waitFor(() => {
          expect(screen.getByTestId('video-player')).toBeInTheDocument();
          expect(screen.getByTestId('play-button')).toBeEnabled();
        });
      },
      100 // 100ms for player init
    );
    
    expect(performance.passed).toBe(true);
  });
  
  it('should update progress smoothly', () => {
    const { getByTestId } = render(<VideoPlayer videoUrl="test.mp4" />);
    const video = getByTestId('video-element') as HTMLVideoElement;
    
    const { performance } = measureSyncPerformance(
      'Video Progress Update',
      () => {
        // Simulate 60 time updates (1 second at 60fps)
        for (let i = 0; i < 60; i++) {
          fireEvent.timeUpdate(video, {
            target: { currentTime: i / 60, duration: 300 },
          });
        }
      },
      16 // Should handle 60 updates in ~16ms (60fps)
    );
    
    expect(performance.passed).toBe(true);
  });
});
```

### Step 7: Create Performance Test Suite

**File**: `/src/__tests__/performance/critical-paths.test.tsx`

```typescript
import { measurePerformance, PerformanceCollector } from '@/test-utils/performance';

describe('Critical User Paths Performance', () => {
  const collector = new PerformanceCollector();
  
  afterAll(() => {
    collector.logSummary();
    
    // Fail the test suite if any performance test failed
    const report = collector.getReport();
    if (report.failed > 0) {
      throw new Error(`${report.failed} performance tests failed. See logs above.`);
    }
  });
  
  describe('Teacher Workflows', () => {
    it('should load lesson planner quickly', async () => {
      const { performance } = await measurePerformance(
        'Lesson Planner Load',
        async () => {
          render(<LessonPlanner />);
          await waitFor(() => {
            expect(screen.getByTestId('planner-ready')).toBeInTheDocument();
          });
        },
        250
      );
      
      collector.add(performance);
    });
    
    it('should create assessment efficiently', async () => {
      const { performance } = await measurePerformance(
        'Assessment Creation',
        async () => {
          render(<AssessmentBuilder />);
          // Add 10 questions
          for (let i = 0; i < 10; i++) {
            fireEvent.click(screen.getByText('Add Question'));
          }
          fireEvent.click(screen.getByText('Save Assessment'));
          
          await waitFor(() => {
            expect(screen.getByText('Assessment Saved')).toBeInTheDocument();
          });
        },
        500
      );
      
      collector.add(performance);
    });
  });
  
  describe('Student Workflows', () => {
    it('should navigate programme quickly', async () => {
      const { performance } = await measurePerformance(
        'Programme Navigation',
        async () => {
          render(<ProgrammeView programmeId="year-7-math" />);
          
          // Click through units
          fireEvent.click(await screen.findByText('Unit 1'));
          fireEvent.click(await screen.findByText('Unit 2'));
          fireEvent.click(await screen.findByText('Lesson 1'));
          
          await waitFor(() => {
            expect(screen.getByTestId('lesson-view')).toBeInTheDocument();
          });
        },
        400
      );
      
      collector.add(performance);
    });
  });
});
```

### Step 8: Add CI Integration

**File**: Update test scripts to output performance data

```json
// package.json
{
  "scripts": {
    "test:performance": "jest --testPathPattern=performance --verbose",
    "test:ci": "npm run test:unit && npm run test:performance"
  }
}
```

## Rollback Plan

Performance tests are additive and non-breaking:

1. **To disable**: Comment out performance assertions
2. **To remove**: Delete performance test files
3. **No production impact**: These only run in test environment

## Success Verification

- [ ] All 10 critical paths have performance tests
- [ ] Performance measurements appear in CI logs
- [ ] Baseline metrics documented for each path
- [ ] No impact on existing functionality tests
- [ ] Clear output format: `[PERF] Operation: XXXms (threshold: YYYms) ✓`
- [ ] Summary report shows overall performance health
- [ ] Failed performance tests fail the CI build

## Performance Thresholds

### Component Rendering
- Simple components: <50ms
- Complex components: <200ms
- Large lists (100 items): <300ms

### User Interactions
- Button clicks: <100ms
- Form submissions: <200ms
- Navigation: <300ms

### Data Operations
- Calculations: <10ms
- Filtering/sorting: <50ms
- API calls: (mocked in tests)

## Future Enhancements

### Real User Monitoring (RUM)
```typescript
// Future: Add production performance tracking
export function trackRealPerformance(operation: string, duration: number) {
  // Send to analytics
  analytics.track('Performance', {
    operation,
    duration,
    timestamp: Date.now(),
  });
}
```

### Performance Budgets
```typescript
// Future: Enforce budgets in CI
export const PERFORMANCE_BUDGETS = {
  'Lesson Load': 200,
  'Quiz Submit': 150,
  'Search Results': 300,
  // ...
};
```

### Trend Analysis
- Track performance over time
- Alert on regression
- Visualize in dashboards

## Pattern Benefits

1. **Visibility**: Performance is measured and logged
2. **Prevention**: Catch regressions before production
3. **Optimization**: Clear targets for improvement
4. **Documentation**: Performance expectations are explicit
5. **Consistency**: Standardized measurement approach

## Related Documentation

- Performance measurement utilities can be reused
- Consider adding to other test suites
- Link to web-vitals for production monitoring
- Reference React DevTools Profiler for debugging