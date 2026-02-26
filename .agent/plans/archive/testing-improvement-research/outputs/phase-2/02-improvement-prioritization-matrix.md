# Improvement Prioritization Matrix

**Created**: December 2024  
**Purpose**: Rank all identified improvements by impact and effort  
**Scoring**: Impact (1-5) × Inverse Effort (1-5) = Priority Score

## Scoring Criteria

### Impact Score (1-5)
- **5**: Critical educational features, >20% quality improvement, affects >50 files
- **4**: Important features, 15-20% quality improvement, affects 20-50 files  
- **3**: Moderate features, 10-15% quality improvement, affects 10-20 files
- **2**: Minor features, 5-10% quality improvement, affects 5-10 files
- **1**: Nice-to-have, <5% quality improvement, affects <5 files

### Effort Score (1-5)
- **1**: Very High - Complex architecture changes, >5 days work
- **2**: High - Significant refactoring, 3-5 days work
- **3**: Medium - Moderate changes, 1-3 days work
- **4**: Low - Simple changes, <1 day work
- **5**: Very Low - Trivial changes, <2 hours work

### Priority Score = Impact × (6 - Effort)

## Quick Wins (Priority Score ≥ 16)

| ID | Improvement | Impact | Effort | Priority | Notes |
|----|-------------|---------|---------|-----------|--------|
| QW-001 | Extract Quiz Validation Functions | 5 | 5 | 25 | Core educational feature, ~200 lines ready for extraction |
| QW-002 | Extract Video Progress Calculations | 5 | 5 | 25 | Learning analytics, pure math functions |
| QW-003 | Extract School Data Validation | 3 | 5 | 15 | Onboarding flow, 4 validation functions |
| QW-004 | Extract Resource Formatting Logic | 3 | 5 | 15 | Display consistency, string manipulation |
| QW-005 | Extract Error Message Generation | 3 | 5 | 15 | User feedback, template logic |
| QW-006 | Add Performance Benchmarks | 4 | 4 | 16 | User experience, simple measurements |
| QW-007 | Create Base Test Utilities | 4 | 4 | 16 | Enables all other testing |
| QW-008 | Document Test Patterns | 3 | 4 | 12 | Team enablement |
| QW-009 | Fix Implementation Detail Tests | 4 | 4 | 16 | Quick quality boost |
| QW-010 | Add Missing Unit Tests | 3 | 4 | 12 | Coverage improvement |

## Strategic Investments (Priority Score 10-15)

| ID | Improvement | Impact | Effort | Priority | Notes |
|----|-------------|---------|---------|-----------|--------|
| SI-001 | Implement Mock Factory Patterns | 5 | 3 | 15 | Foundation for all testing |
| SI-002 | Test useShareExperiment Hook | 5 | 3 | 15 | Teacher collaboration, 179 lines |
| SI-003 | Test useTeacherNotes Hook | 5 | 3 | 15 | Content management, 164 lines |
| SI-004 | Test useCurriculumDownloads Hook | 5 | 3 | 15 | Resource access, 141 lines |
| SI-005 | Refactor SubjectPhasePicker | 4 | 2 | 12 | 1,468 lines, 10 useState calls |
| SI-006 | Refactor Flex.deprecated | 4 | 3 | 12 | 61 imports, widely used |
| SI-007 | Refactor ButtonAsLink | 3 | 4 | 12 | 35 usage sites |
| SI-008 | Add Accessibility Testing | 5 | 2 | 15 | Critical for inclusivity |
| SI-009 | Create Service Layer | 5 | 1 | 10 | Architecture improvement |
| SI-010 | Implement Error Boundaries | 4 | 3 | 12 | User experience |

## Foundation Building (Priority Score 6-9)

| ID | Improvement | Impact | Effort | Priority | Notes |
|----|-------------|---------|---------|-----------|--------|
| FB-001 | Reorganize Test Files | 2 | 4 | 8 | Better structure |
| FB-002 | Update Test Documentation | 2 | 5 | 10 | Team knowledge |
| FB-003 | Create Component Templates | 3 | 3 | 9 | Consistency |
| FB-004 | Standardize Mock Patterns | 3 | 3 | 9 | Reduce duplication |
| FB-005 | Add Test Generators | 3 | 2 | 9 | Automation |
| FB-006 | Improve Test Names | 2 | 5 | 10 | Clarity |
| FB-007 | Add Test Categories | 2 | 4 | 8 | Organization |
| FB-008 | Create Test Helpers | 3 | 3 | 9 | DRY principle |
| FB-009 | Document Best Practices | 2 | 4 | 8 | Knowledge sharing |
| FB-010 | Set Up Metrics Dashboard | 3 | 2 | 9 | Visibility |

## Future Considerations (Priority Score ≤ 5)

| ID | Improvement | Impact | Effort | Priority | Notes |
|----|-------------|---------|---------|-----------|--------|
| FC-001 | Visual Regression Testing | 3 | 1 | 3 | Nice to have |
| FC-002 | Mutation Testing | 2 | 1 | 2 | Advanced technique |
| FC-003 | Contract Testing | 3 | 1 | 3 | External APIs |
| FC-004 | Property-Based Testing | 2 | 1 | 2 | Curriculum logic |
| FC-005 | Snapshot Testing | 2 | 2 | 4 | Component output |
| FC-006 | E2E Test Expansion | 4 | 1 | 4 | Full workflows |
| FC-007 | Load Testing | 3 | 1 | 3 | Performance |
| FC-008 | Security Testing | 3 | 1 | 3 | Vulnerability scanning |
| FC-009 | Chaos Engineering | 2 | 1 | 2 | Resilience |
| FC-010 | AI-Assisted Testing | 2 | 1 | 2 | Future exploration |

## Implementation Order

### Phase 3.0 - First Wave (Highest Priority)
1. QW-001: Extract Quiz Validation (Priority: 25)
2. QW-002: Extract Video Progress (Priority: 25)
3. SI-001: Mock Factory Patterns (Priority: 15)
4. QW-006: Performance Benchmarks (Priority: 16)
5. QW-007: Base Test Utilities (Priority: 16)

### Phase 3.1 - Second Wave (High Impact Hooks)
6. SI-002: Test useShareExperiment (Priority: 15)
7. SI-003: Test useTeacherNotes (Priority: 15)
8. SI-004: Test useCurriculumDownloads (Priority: 15)
9. QW-009: Fix Implementation Tests (Priority: 16)
10. SI-008: Add Accessibility Testing (Priority: 15)

### Phase 3.2 - Third Wave (Architecture)
11. SI-005: Refactor SubjectPhasePicker (Priority: 12)
12. SI-006: Refactor Flex.deprecated (Priority: 12)
13. SI-007: Refactor ButtonAsLink (Priority: 12)
14. SI-009: Create Service Layer (Priority: 10)
15. SI-010: Implement Error Boundaries (Priority: 12)

## Success Metrics

### After Phase 3.0
- 5+ pure functions extracted with 100% coverage
- Mock factory base implemented
- Performance benchmarks on 10 critical paths
- Test utilities reducing boilerplate by 30%

### After Phase 3.1
- 100% custom hook coverage (22 hooks tested)
- Accessibility tests on all user-facing components
- Implementation detail tests reduced by 50%

### After Phase 3.2
- Major components refactored (<500 lines each)
- Service layer handling business logic
- Error boundaries preventing crashes

## Risk Analysis

### High Risk Items
- SI-005: SubjectPhasePicker refactoring (1,468 lines)
- SI-009: Service layer creation (architecture change)

### Low Risk Items
- All QW items (pure function extractions)
- Documentation and pattern improvements

### Mitigation Strategy
- Start with lowest risk, highest value items
- Establish patterns before tackling complex refactoring
- Maintain parallel implementations during transition