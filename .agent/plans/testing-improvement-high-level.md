# Testing Improvement Plan

This document tracks planned improvements to Oak's automated testing approach and implementation.

## Current State

- Comprehensive testing documentation in `docs/testing-strategy/`
- AI agent guidance in `.agent/rules/testing-strategy.md`
- Mixed adoption of TDD practices across the codebase
- Strong React Testing Library usage
- Jest as primary test runner

## Planned Improvements

### Phase 1: Foundation

#### 1.0: Prepare

- [ ] Review test code across the codebase. This will be shallow and broad, to enable in-depth analysis in the next phase.
- [ ] Record the audit findings in a report

#### 1.1: Understand

Using the review findings from phase 1.0, audit the codebase for opportunities for improvement.

- [ ] Audit existing test code quality across the codebase
- [ ] Audit existing test organisation across the codebase
- [ ] Audit existing test coverage across the codebase
- [ ] Record the audit findings in a report

#### 1.2: Identify

Using the audit findings from phase 1.1, identify opportunities for improvement.

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

- Test coverage: 80%+ for new code
- TDD adoption: 100% for new features
- Accessibility violations: 0 in tested components
- Test execution time: <2 minutes for unit tests
- Developer satisfaction: Improved confidence in changes

## Research Topics

- Explore property-based testing for curriculum logic
- Consider snapshot testing alternatives

## Team Resources

- Testing strategy documentation: `docs/testing-strategy/`
- AI assistant guidance: `.agent/rules/testing-strategy.md`
- Example patterns: `docs/testing-strategy/examples/`
- Transformation guide: `docs/testing-strategy/transformation-guide.md`
