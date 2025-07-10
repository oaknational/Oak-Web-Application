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

#### 1.2: Identify ✅ COMPLETED (July 9, 2025)

**Context**: [Phase 1.1 report](testing-improvement-phase-1-1-report.md) complete with context-aware insights. [Phase 1.2 report](testing-improvement-phase-1-2-report.md) documents all findings.

**Key Findings**:

1. **641 test files** (not 633) with quality issues
2. **100% API coverage** but varying test quality
3. **22 custom hooks** completely untested
4. **Top 20 components** need behavior-focused refactoring

Using the Phase 1.1 findings, created actionable implementation tasks:

- [x] Identified violations of "test behaviour, not implementation"
  - Found: Component tests checking styles/state instead of behavior
  - Documented in: `outputs/test-organization-audit.md`
- [x] Identified opportunities for pure function extraction
  - [x] 10+ extraction candidates prioritized by impact
  - [x] Quiz, video, school validation as Priority 1
  - [x] Documented in: `outputs/pure-function-opportunities.md`
- [x] Identified inconsistent mock patterns
  - Created: `outputs/mock-factory-patterns.md` comprehensive guide
- [x] Identified inconsistent test organisation
  - Enhanced analysis in: `outputs/test-organization-audit.md`
- [x] Identified React best practice adoption opportunities
  - Found: 1,400+ line components, excessive state, inline functions
  - Documented in: `outputs/react-testing-best-practices.md`
- [x] Identified Next.js best practice adoption opportunities
  - Found: Fat controllers, missing error boundaries
  - Documented in: `outputs/nextjs-testing-best-practices.md`
- [x] Identified components lacking accessibility-first testing
  - No systematic a11y testing across all components
- [x] Identified testing anti-patterns
  - Implementation detail testing, wrong abstraction levels, no performance benchmarks
- [x] Identified API route handlers missing test coverage
  - Great news: 100% API coverage! Documented in: `outputs/api-routes-test-coverage.md`
- [x] Identified custom hooks missing test coverage
  - 22 hooks untested, documented in: `outputs/custom-hooks-test-coverage.md`
- [x] Documented all findings in comprehensive reports
  - 11 detailed analysis documents in `outputs/` directory

### Phase 2: Planning

**Purpose**: Transform Phase 1 findings into actionable implementation plans (no code changes)

#### Phase 2.0: Foundation Planning ✅ COMPLETED (July 2025)

**Status**: Deliverables created in `outputs/phase-2/`

- [x] Review all Phase 1.2 findings with stakeholders
  - Executive summary created
- [x] Prioritize improvements by impact/effort matrix
  - 10 quick wins identified and prioritized
- [x] Create sprint-sized work packages
  - Work items batch 1 documented
- [x] Establish success metrics and quality gates
  - Quality gates defined, tracking template created

#### Phase 2.1: Quick Win Planning ✅ COMPLETED (July 2025)

**Status**: All deliverables complete, ready for Phase 3

- [x] Identify 10 pure functions for extraction pilot
  - Quiz, video, school validation functions prioritized
- [x] Select 3 high-traffic components for refactoring pilot
  - ButtonAsLink, SubjectPhasePicker, Flex.deprecated identified
- [x] Choose 5 critical hooks for testing pilot
  - useShareExperiment, useTeacherNotes, useCurriculumDownloads prioritized
- [x] Design mock factory implementation strategy
  - Pattern templates created, risk mitigation documented

#### Phase 2.2: Architecture Planning 🚀 IN PROGRESS (Prerequisites: Phase 2.1 Complete)

**Status**: Ready to start based on Phase 2.1 learnings

- [ ] Design service layer for business logic separation
  - Focus on extracted pure functions from Phase 2.1
- [ ] Plan component decomposition strategy
  - Use SubjectPhasePicker as case study
- [ ] Create error boundary implementation plan
  - Address gaps identified in Phase 1.2
- [ ] Define data fetching patterns
  - Standardize based on current best practices

#### Phase 2.3: Team Enablement Planning (Prerequisites: Phase 2.2 Complete)

**Status**: Not started

- [ ] Create TDD training curriculum
- [ ] Design pairing program for knowledge transfer
- [ ] Establish code review checklists
- [ ] Plan accessibility testing rollout

### Phase 3: Implementation

**Purpose**: Execute the plans created in Phase 2 with code changes

#### Phase 3.0: Pilot Implementation (Prerequisites: Phase 2.3 Complete)

- [ ] Extract first 3 pure functions with comprehensive tests
- [ ] Refactor first high-traffic component with behavior tests
- [ ] Add tests to first critical hook
- [ ] Measure and document improvements

#### Phase 3.1: Scaled Implementation (Prerequisites: Phase 3.0 metrics positive)

- [ ] Extract remaining 7+ pure functions
- [ ] Refactor remaining high-traffic components
- [ ] Test remaining critical hooks
- [ ] Implement mock factory patterns across codebase

### Phase 4: Maintaining Excellence

**Purpose**: Embed quality practices to prevent regression

#### Phase 4.0: Quality Gates (Prerequisites: Phase 3.1 Complete)

- [ ] Implement automated TDD compliance checks
- [ ] Establish minimum test quality scores (8+/10)
- [ ] Add performance benchmarks to CI
- [ ] Create mutation testing baseline

#### Phase 4.1: Continuous Improvement (Prerequisites: Phase 4.0 Complete)

- [ ] Monitor test quality metrics dashboard
- [ ] Quarterly test improvement sprints
- [ ] Evolve patterns based on team feedback
- [ ] Maintain living documentation

## Test Related Technical Debt

To be reviewed after each phase. If not resolved, additional sub-phases will be added.

### High Priority (From Phase 1.1 Analysis)

- **Component accessibility**: 327 files with 12% coverage (user interface crisis)
- **Curriculum-downloads API**: Critical untested endpoint (teacher access risk)
- **Performance monitoring**: 0% in build processes, <50% elsewhere

### Medium Priority

- Service performance monitoring (Infrastructure/APIs)
- Page load performance (69% fail <2s threshold)
- Educational domain modelling in applicable tests

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
- Investigate visual regression testing tools
- Research mutation testing frameworks

## Current Phase Status (July 10, 2025)

**Active Phase**: 2.2 - Architecture Planning
**Previous Phases**: 1.0-1.2 ✅, 2.0-2.1 ✅
**Next Phase**: 2.3 - Team Enablement Planning

### Key Documents
- Phase reports archived in: `archive/phase-1-reports/`
- Current phase plans in: root directory
- Implementation guides referenced in: `phase-2-1-completion.md`
- Phase outputs in: `outputs/phase-1/` and `outputs/phase-2/`

## Team Resources

- Testing strategy documentation: `docs/testing-strategy/`
- Enhanced test quality rubrics: `docs/testing-strategy/test-quality-rubrics.md`
- AI assistant guidance: `docs/testing-strategy/` (centralized)
- Example patterns: `docs/testing-strategy/examples/`
- Transformation guide: `docs/testing-strategy/transformation-guide.md`
- API testing patterns: `docs/testing-strategy/api-testing.md`
