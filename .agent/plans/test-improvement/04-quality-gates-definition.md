# Quality Gates Definition

**Purpose**: Automated checks to prevent test quality regression  
**Implementation**: Progressive rollout to avoid disruption  
**Philosophy**: Guide improvement, don't block progress

## Gate Levels and Triggers

### Level 1: Information Only
**Trigger**: Phase 3.0 start  
**Behavior**: Display metrics, no blocking

```bash
# Example output
=========================================
Test Quality Report (Information Only)
=========================================
File: quiz-validation.test.ts
Quality Score: 8.5/10 ✅
- Structure: 2/2
- Coverage: 2/2  
- Assertions: 1.5/2
- Patterns: 2/2
- Description: 1/1
- Performance: 1/1

Suggestions:
- Consider adding edge case assertions
=========================================
```

### Level 2: Warnings
**Trigger**: After 5 work items complete  
**Behavior**: Warn but don't block

```bash
# Example output
=========================================
⚠️  Test Quality Warning
=========================================
File: button-component.test.tsx
Quality Score: 5.5/10 (Target: 6+)

Issues Found:
- Testing implementation details (className checks)
- Missing accessibility tests
- No user interaction tests

Run with --bypass-quality-check to continue
=========================================
```

### Level 3: Enforcement
**Trigger**: After 10 work items complete  
**Behavior**: Block on quality issues

```bash
# Example output
=========================================
❌ Test Quality Gate Failed
=========================================
File: complex-hook.test.ts
Quality Score: 4/10 (Minimum: 7)

Must Fix:
- No performance benchmarks
- Coverage below 80%
- Missing error state tests

To override (requires justification):
npm test -- --quality-override="reason"
=========================================
```

## Quality Score Calculation

### Scoring Algorithm

```typescript
interface TestQualityScore {
  structure: number;      // 0-2 points
  coverage: number;       // 0-2 points
  assertions: number;     // 0-2 points
  patterns: number;       // 0-2 points
  description: number;    // 0-1 point
  performance: number;    // 0-1 point
  total: number;         // 0-10 points
}

function calculateQualityScore(testFile: TestFile): TestQualityScore {
  return {
    structure: evaluateStructure(testFile),
    coverage: evaluateCoverage(testFile),
    assertions: evaluateAssertions(testFile),
    patterns: evaluatePatterns(testFile),
    description: evaluateDescription(testFile),
    performance: evaluatePerformance(testFile),
    total: sum(all scores)
  };
}
```

### Evaluation Criteria

#### Structure (0-2 points)
- **2 points**: Clear arrange/act/assert, proper setup/teardown
- **1 point**: Some organization, minor issues
- **0 points**: Chaotic structure, no clear pattern

#### Coverage (0-2 points)
- **2 points**: >90% line coverage, all paths tested
- **1 point**: 70-90% coverage, main paths tested
- **0 points**: <70% coverage, missing critical paths

#### Assertions (0-2 points)
- **2 points**: Behavior-focused, comprehensive, clear
- **1 point**: Mix of behavior and implementation
- **0 points**: Implementation details, unclear intent

#### Patterns (0-2 points)
- **2 points**: Follows all best practices, DRY
- **1 point**: Most patterns followed, some duplication
- **0 points**: Anti-patterns present, heavy duplication

#### Description (0-1 point)
- **1 point**: Clear test names, documents behavior
- **0 points**: Unclear names, no documentation value

#### Performance (0-1 point)
- **1 point**: Meets type-specific thresholds
- **0 points**: Exceeds thresholds or not measured

## Performance Thresholds

### By Test Type

| Test Type | Threshold | Measurement Point |
|-----------|-----------|-------------------|
| Unit (pure functions) | <10ms | Single test execution |
| Unit (with mocks) | <50ms | Single test execution |
| Component | <100ms | Full render + assertions |
| Integration | <500ms | Complete flow |
| API | <200ms | Request/response cycle |

### Measurement Implementation

```typescript
// Test utility
export function measureTestPerformance(
  testName: string,
  testFn: () => void | Promise<void>
): void {
  it(testName, async () => {
    const start = performance.now();
    await testFn();
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(
      getThresholdForTestType(testName)
    );
  });
}
```

## Implementation Plan

### Phase 3.0 Start: Information Gathering
1. Add quality scoring to test runner
2. Log scores without blocking
3. Gather baseline metrics
4. Identify patterns in low scores

### After 5 Items: Warning Mode
1. Enable warnings for scores <6
2. Provide improvement suggestions
3. Track override frequency
4. Adjust thresholds based on data

### After 10 Items: Enforcement Mode
1. Block commits with scores <7
2. Require justification for overrides
3. Generate improvement reports
4. Celebrate quality improvements

## Configuration

### .testqualityrc.json

```json
{
  "enabled": true,
  "level": "info",
  "thresholds": {
    "info": 0,
    "warn": 6,
    "error": 7
  },
  "performance": {
    "unit": 10,
    "component": 100,
    "integration": 500,
    "api": 200
  },
  "coverage": {
    "lines": 80,
    "branches": 70,
    "functions": 80,
    "statements": 80
  },
  "exclude": [
    "**/*.stories.tsx",
    "**/*.mock.ts",
    "**/test-utils/**"
  ]
}
```

### Environment Variables

```bash
# Override in CI/local development
TEST_QUALITY_LEVEL=warn
TEST_QUALITY_THRESHOLD=6
TEST_QUALITY_PERF_MULTIPLIER=1.5  # CI is slower
```

## Reporting

### Console Output
- Colored output (green/yellow/red)
- Actionable suggestions
- Links to documentation
- Progress indicators

### File Output
- JSON report for CI parsing
- Markdown summary for PRs
- Trend charts over time
- Team leaderboard (gamification)

## Escape Hatches

### Valid Override Reasons
1. **Legacy Code**: "Refactoring planned in JIRA-123"
2. **External Dependency**: "Mocking not possible for library X"
3. **Performance**: "Intentionally slow for integration test"
4. **Temporary**: "Spike solution, will improve in next sprint"

### Override Process
```bash
# With justification (logged)
npm test -- --quality-override="Legacy code - JIRA-123"

# Temporary suppression (expires)
// @quality-ignore-next-line refactoring-planned
it('legacy test that needs work', () => {
  // existing test
});
```

## Success Metrics

### Short Term (Phase 3.0)
- Baseline quality scores established
- 50% of new tests score 8+
- No productivity impact

### Medium Term (Phase 3.1)
- Average score improves to 7.5
- 90% of new tests score 8+
- Team adopts patterns voluntarily

### Long Term (Phase 4)
- Average score reaches 8.5
- Quality gates prevent regression
- Testing excellence embedded in culture

## Rollback Plan

If quality gates cause issues:

1. **Immediate**: Drop to previous level
2. **Investigation**: Analyze friction points
3. **Adjustment**: Modify thresholds/criteria
4. **Communication**: Explain changes to team
5. **Retry**: Gradual reintroduction

Quality gates should enable, not hinder. Adjust as needed to maintain team velocity while improving quality.