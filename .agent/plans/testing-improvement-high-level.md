# Testing Improvement Plan

This document tracks planned improvements to Oak's automated testing approach and implementation.

## Current State

- Comprehensive testing documentation in `docs/testing-strategy/`
- Enhanced 6-category test quality rubric with performance standards
- 633 test files discovered across the codebase (massive scale)
- AI agent guidance in `docs/testing-strategy/` (centralized)
- Mixed adoption of TDD practices across the codebase
- Strong React Testing Library usage
- Jest as primary test runner
- Phase 1.1 systematic analysis in progress

## Planned Improvements

### Phase 1: Foundation

#### 1.0: Prepare ✅ COMPLETED

- [x] Review test code across the codebase. This will be shallow and broad, to enable in-depth analysis in the next phase.
- [x] Record the audit findings in a report

#### 1.1: Understand 🔄 RESTART REQUIRED

Using the review findings from phase 1.0, audit the codebase for opportunities for improvement. Enhanced 6-category rubric (with performance standards) requires reassessment of ALL 633 test files.

- [x] Audit existing test code quality across the codebase (5-category rubric - INVALID)
- [x] Audit existing test organisation across the codebase
- [x] Audit existing test coverage across the codebase
- [x] Record the audit findings in a report (Phase 1.1 report active)
- [x] Apply enhanced 6-category rubric to ALL 633 test files (previous analysis INVALID due to rubric enhancement)

#### 1.2: Identify ⏳ PENDING

Note that the [report from phase 1.1 is here](testing-improvement-phase-1-1-report.md), and [the analyses are here](../reviews/testing-improvement/phase-1-1/index.md)

Using the enhanced 6-category rubric findings from phase 1.1, identify opportunities for improvement.

- [ ] Identify violations of "test behaviour, not implementation". This is often coupled with poorly defined boundaries.
- [ ] Identify opportunities for pure function extraction
  - [ ] Components with inline business logic
  - [ ] API route handlers
  - [ ] Custom hooks
  - [ ] Any other code that is not side effect free
- [ ] Identify inconsistent mock patterns across the codebase
- [ ] Identify inconsistent test organisation across the codebase
- [ ] Identify opportunities for React best practice adoption to enable better testing through better boundary definitions
- [ ] Identify opportunities for Next.js best practice adoption to enable better testing
- [ ] Identify components lacking accessibility-first testing
- [ ] Identify testing anti-patterns leading to
  - [ ] low-quality tests, what is the test proving?
  - [ ] tests are the wrong level of abstraction, are we testing the right thing?
  - [ ] poor performance, are the tests fast, why not?
- [ ] Identify API route handlers missing test coverage
- [ ] Identify custom hooks missing test coverage
- [ ] Document investigation findings in a report

### Phase 2: Planning

Using the audit findings from phase 1.2, create a plan to implement those improvements, including but not limited to:

- [ ] Migrate high-traffic components to TDD approach
- [ ] Extract pure functions from complex components
- [ ] Implement mock factory patterns consistently
- [ ] Add accessibility testing to CI pipeline

### Phase 3: Implementation

Using the plan from phase 2, implement the plan.

### Phase 4: Maintaining Excellence

Anything can be fixed once, but we need to maintain excellence.

- [ ] Establish code review checklist for TDD compliance and best practices
- [ ] Achieve 80%+ test coverage across critical paths
- [ ] Establish mutation testing baseline
- [ ] Create component testing cookbook
- [ ] Implement visual regression testing
- [ ] Implement Contract testing for external APIs

## Test Related Technical Debt

To be reviewed after each phase. If not resolved, additional sub-phases will be added.

### High Priority

- Components with inline business logic need pure function extraction, enabling unit tests.
- API route handlers lack comprehensive testing
- Custom hooks missing test coverage

### Medium Priority

- Inconsistent mock patterns across the codebase
- Missing integration tests for data flows
- Test organization varies by package

### Low Priority

- Storybook tests could be expanded
- Performance benchmarks needed
- Contract testing for external APIs

## Success Metrics

- Average quality score: 5.8/10 → 8.5/10 (enhanced 6-category rubric)
- Accessibility testing coverage: 5% → 95% (jest-axe integration)
- Test coverage: 80%+ for new code
- TDD adoption: 100% for new features
- Accessibility violations: 0 in tested components
- Test execution time: <2 minutes for unit tests (with performance standards)
- Developer satisfaction: Improved confidence in changes

## Research Topics

- Explore property-based testing for curriculum logic
- Consider snapshot testing alternatives

## Team Resources

- Testing strategy documentation: `docs/testing-strategy/`
- Enhanced test quality rubrics: `docs/testing-strategy/test-quality-rubrics.md`
- AI assistant guidance: `docs/testing-strategy/` (centralized)
- Example patterns: `docs/testing-strategy/examples/`
- Transformation guide: `docs/testing-strategy/transformation-guide.md`
- API testing patterns: `docs/testing-strategy/api-testing.md`
