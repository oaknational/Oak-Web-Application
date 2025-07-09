# Testing Improvement Plan

This document tracks planned improvements to Oak's automated testing approach and implementation.

## Current State

- Comprehensive testing documentation in `docs/testing-strategy/`
- Enhanced 6-category test quality rubric with performance standards
- 633 test files analyzed with context-aware scoring (Phase 1.1 complete)
- Strong foundations: Utilities (7.8/10), APIs (6.8/10)
- Critical gap: Components (5.2/10) - largest category
- Untested critical endpoint: curriculum-downloads
- Mixed TDD adoption, strong React Testing Library usage
- Jest as primary test runner

## Planned Improvements

### Phase 1: Foundation

#### 1.0: Prepare ✅ COMPLETED

- [x] Review test code across the codebase. This will be shallow and broad, to enable in-depth analysis in the next phase.
- [x] Record the audit findings in a report

#### 1.1: Understand ✅ COMPLETED (July 7, 2025)

Applied enhanced 6-category rubric with performance standards to ALL 633 test files.

- [x] Context-aware scoring methodology applied
- [x] All 633 test files systematically assessed
- [x] Critical gaps identified: Component accessibility (12%), untested curriculum-downloads endpoint
- [x] Performance monitoring gaps documented across all layers
- [x] Comprehensive report created with implementation examples

#### 1.2: Identify 🏗️ IN PROGRESS (July 9, 2025)

**Context**: [Phase 1.1 report](testing-improvement-phase-1-1-report.md) complete with context-aware insights. [Detailed analyses archived](../reviews/testing-improvement/phase-1-1/).

**Top Priorities from Phase 1.1**:

1. Component accessibility crisis (327 files, 12% → 90% needed)
2. Curriculum-downloads endpoint (326 lines, 0 tests)
3. Performance monitoring implementation

Using the Phase 1.1 findings, create actionable implementation tasks:

- [x] Identify violations of "test behaviour, not implementation". This is often coupled with poorly defined boundaries.
  - Found: Component tests checking styles/state instead of behavior
  - Documented in: `test-organization-audit.md`
- [x] Identify opportunities for pure function extraction
  - [x] Components with inline business logic - 10+ opportunities identified
  - [x] Quiz form processing, video calculations, school validation prioritized
  - [x] Documented in: `pure-function-opportunities.md` with prioritization
- [x] Identify inconsistent mock patterns across the codebase
  - Found: Mix of jest.fn(), manual mocks, varying boundaries
  - Documented in: `test-organization-audit.md`
- [x] Identify inconsistent test organisation across the codebase
  - Found: Co-located (good) but inconsistent naming/structure
  - Enhanced analysis in: `test-organization-audit.md`
- [ ] Identify opportunities for React best practice adoption to enable better testing through better boundary definitions
- [ ] Identify opportunities for Next.js best practice adoption to enable better testing
- [x] Identify components lacking accessibility-first testing
  - Found: No systematic a11y testing, no jest-axe integration
  - Documented in: `test-organization-audit.md`
- [x] Identify testing anti-patterns leading to
  - [x] low-quality tests - implementation detail testing documented
  - [x] wrong abstraction level - mixed unit/integration tests found
  - [x] poor performance - no benchmarks, created examples in `test-type-examples.md`
- [ ] Identify API route handlers missing test coverage
- [ ] Identify custom hooks missing test coverage
- [x] Document investigation findings in reports
  - Created: `test-organization-audit.md`, `pure-function-opportunities.md`, `test-type-examples.md`
  - Summary: `phase-1-2-foundations-summary.md`

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

### High Priority (From Phase 1.1 Analysis)

- **Component accessibility**: 327 files with 12% coverage (user interface crisis)
- **Curriculum-downloads API**: Critical untested endpoint (teacher access risk)
- **Performance monitoring**: 0% in build processes, <50% elsewhere

### Medium Priority

- Service performance monitoring (Infrastructure/APIs)
- Page load performance (69% fail <2s threshold)
- Educational domain modeling in applicable tests

### Low Priority

- Storybook tests could be expanded
- Performance benchmarks needed
- Contract testing for external APIs

## Success Metrics (Updated from Phase 1.1)

- Average quality score: 6.2/10 → 8.5/10 (context-aware scoring)
- User-facing accessibility: 21% → 95% (Components + Pages)
- Performance compliance: 38% → 90% (context-appropriate)
- Critical endpoints: 0 → 100% tested
- Component quality: 5.2/10 → 8.0/10 (largest impact)
- Build monitoring: 0% → 90% (deployment reliability)
- Developer confidence: Measurable improvement in deployment frequency

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
