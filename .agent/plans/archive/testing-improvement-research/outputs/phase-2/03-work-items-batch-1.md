# Work Items Batch 1: Quick Wins

**Purpose**: First 10 implementation items for Phase 3  
**Selection Criteria**: Highest priority score from matrix  
**Order**: Sequenced to build momentum and establish patterns

---

## Item ID: QW-001
**Title**: Extract Quiz Validation Functions from QuizRenderer  
**Complexity**: Low  
**Dependencies**: None  
**Assignee**: Me (AI Assistant)

### Definition of Done
- [ ] Extract 3 validation functions to new file `src/utils/quiz/validation.ts`
- [ ] Create comprehensive unit tests with 100% coverage
- [ ] Update QuizRenderer to use extracted functions
- [ ] Document extraction pattern for team reference
- [ ] Performance benchmarks show <5ms execution

### Acceptance Criteria
1. `validateQuizAnswer()` extracted with types preserved
2. `calculateQuizScore()` returns accurate percentage
3. `checkQuizCompletion()` handles all edge cases
4. All existing QuizRenderer tests still pass
5. New unit tests cover happy path and edge cases

### Implementation Notes
- Review `/src/components/QuizRenderer/QuizRenderer.tsx` for validation logic
- Look for functions around lines 150-350 (based on Phase 1 analysis)
- Preserve exact behavior to avoid regressions
- Use existing Quiz types from `@/types/quiz`
- Reference pattern in `docs/testing-strategy/pure-functions.md`

---

## Item ID: QW-002
**Title**: Extract Video Progress Calculations from VideoPlayer  
**Complexity**: Low  
**Dependencies**: QW-001 (pattern established)  
**Assignee**: Me (AI Assistant)

### Definition of Done
- [ ] Extract progress calculations to `src/utils/video/progress.ts`
- [ ] Create unit tests with mathematical precision
- [ ] Add performance benchmarks (<1ms target)
- [ ] Update VideoPlayer component
- [ ] Document mathematical formulas used

### Acceptance Criteria
1. `calculatePlayedPercentage()` handles duration edge cases
2. `formatVideoTime()` matches current display exactly
3. `isVideoComplete()` uses 95% threshold consistently
4. Performance benchmarks documented
5. No visual changes to video player

### Implementation Notes
- Check `/src/components/VideoPlayer/VideoPlayer.tsx`
- Progress logic likely in event handlers
- Consider extracting: percentage played, time formatting, completion checks
- These are pure mathematical functions - ideal for unit testing
- Add JSDoc comments explaining business rules

---

## Item ID: SI-001
**Title**: Implement Base Mock Factory Patterns  
**Complexity**: Medium  
**Dependencies**: None (can parallel with QW items)  
**Assignee**: You (Human) - architectural decision needed

### Definition of Done
- [ ] Create `src/test-utils/factories/base.ts` with TypeScript generics
- [ ] Implement factory pattern for 5 domain objects
- [ ] Add builder pattern for complex objects
- [ ] Create usage documentation with examples
- [ ] Update existing tests to use factories (2-3 examples)

### Acceptance Criteria
1. Type-safe factory creation with autocomplete
2. Supports partial overrides: `createLesson({ title: "Custom" })`
3. Handles nested objects (e.g., lesson with questions)
4. Reduces test setup code by 50%+
5. Pattern is intuitive for team adoption

### Implementation Notes
- Reference `docs/testing-strategy/mock-factories.md` for patterns
- Start with most used types: Lesson, Quiz, User, Programme, Unit
- Use TypeScript generics for reusability
- Consider using `faker` for realistic data
- Look at existing mocks in `__tests__/__helpers__/`

---

## Item ID: QW-003
**Title**: Extract School Data Validation Functions  
**Complexity**: Low  
**Dependencies**: QW-001 (pattern established)  
**Assignee**: Me (AI Assistant)

### Definition of Done
- [ ] Extract validations to `src/utils/school/validation.ts`
- [ ] Create unit tests for all validation rules
- [ ] Handle URN format validation correctly
- [ ] Document validation rules clearly
- [ ] Update onboarding components

### Acceptance Criteria
1. `validateSchoolURN()` checks format and checksum
2. `validatePostcode()` handles all UK formats
3. `isSchoolDataComplete()` enforces required fields
4. Error messages match current user experience
5. Validation logic centralized in one place

### Implementation Notes
- Check `/src/components/Onboarding/SchoolPicker.tsx`
- URN validation has specific format rules
- Postcode validation should use UK standards
- Consider extracting: URN validation, postcode validation, completeness checks
- These validations affect teacher onboarding - critical path

---

## Item ID: QW-006
**Title**: Add Performance Benchmarks to Critical User Paths  
**Complexity**: Low  
**Dependencies**: None  
**Assignee**: Me (AI Assistant)

### Definition of Done
- [ ] Identify 10 critical user paths
- [ ] Add performance measurements using `performance.now()`
- [ ] Create helper function for consistent measurement
- [ ] Document baseline performance metrics
- [ ] Add to existing test suites

### Acceptance Criteria
1. Lesson loading measured end-to-end
2. Quiz submission response time tracked
3. Search results rendering benchmarked
4. Video player initialization timed
5. All measurements output in CI logs

### Implementation Notes
- Start with most-used components from Phase 1 analysis
- Use pattern from `docs/testing-strategy/test-types-guide.md`
- Add measurements to existing integration tests
- Consider creating `measurePerformance()` test utility
- Establish baselines before optimization

---

## Item ID: QW-007
**Title**: Create Base Test Utilities Package  
**Complexity**: Low  
**Dependencies**: SI-001 (complements factories)  
**Assignee**: Me (AI Assistant)

### Definition of Done
- [ ] Create `src/test-utils/helpers/index.ts`
- [ ] Extract common test setup patterns
- [ ] Add render helpers with providers
- [ ] Create async test utilities
- [ ] Document all utilities with examples

### Acceptance Criteria
1. `renderWithProviders()` includes all app providers
2. `waitForLoadingToFinish()` handles common patterns
3. `mockApiResponse()` simplifies API mocking
4. Reduces boilerplate in 10+ test files
5. TypeScript autocomplete works correctly

### Implementation Notes
- Audit existing tests for repeated patterns
- Start with most common: render with theme, wait for loading, mock API
- Make utilities composable
- Ensure tree-shaking works for test bundle
- Consider existing helpers in `__tests__/__helpers__/`

---

## Item ID: SI-002
**Title**: Add Tests for useShareExperiment Hook  
**Complexity**: Medium  
**Dependencies**: SI-001 (needs mock factories)  
**Assignee**: You (Human) - complex state logic

### Definition of Done
- [ ] Create `src/hooks/useShareExperiment.test.tsx`
- [ ] Cover all sharing workflows
- [ ] Test error states and edge cases
- [ ] Mock external dependencies properly
- [ ] Document testing approach for complex hooks

### Acceptance Criteria
1. Share creation flow tested end-to-end
2. Permission checks verified
3. Error handling covers network failures
4. Loading states tested accurately
5. 100% line coverage achieved

### Implementation Notes
- Hook is 179 lines with complex state
- Located in `/src/hooks/useShareExperiment.tsx`
- Involves teacher collaboration features
- Need to mock: API calls, auth state, analytics
- Use `renderHook` from React Testing Library

---

## Item ID: QW-004
**Title**: Extract Resource Formatting Logic  
**Complexity**: Low  
**Dependencies**: QW-001 (pattern established)  
**Assignee**: Me (AI Assistant)

### Definition of Done
- [ ] Extract formatters to `src/utils/resources/formatting.ts`
- [ ] Create unit tests for all format functions
- [ ] Preserve exact current formatting
- [ ] Add type safety to formatters
- [ ] Update components using formatters

### Acceptance Criteria
1. `formatResourceTitle()` handles special characters
2. `truncateDescription()` preserves word boundaries
3. `formatFileSize()` uses correct units (KB/MB)
4. All existing displays unchanged
5. Formatters are pure functions

### Implementation Notes
- Search for formatting logic in resource components
- Common patterns: title casing, description truncation, file size display
- These affect teacher-facing resource displays
- Ensure accessibility (screen reader friendly)
- Consider i18n needs for future

---

## Item ID: SI-003
**Title**: Add Tests for useTeacherNotes Hook  
**Complexity**: Medium  
**Dependencies**: SI-001, SI-002 (pattern from first hook)  
**Assignee**: You (Human) - complex state management

### Definition of Done
- [ ] Create comprehensive hook tests
- [ ] Cover CRUD operations for notes
- [ ] Test optimistic updates
- [ ] Handle conflict resolution
- [ ] Document patterns for stateful hooks

### Acceptance Criteria
1. Note creation/update/delete tested
2. Optimistic updates revert on error
3. Pagination handled correctly
4. Search/filter functionality tested
5. Performance remains under 100ms

### Implementation Notes
- Hook is 164 lines with local state management
- Features optimistic updates for better UX
- Need to test: CRUD operations, error recovery, pagination
- Mock storage layer and API
- Consider testing custom hook composition

---

## Item ID: QW-009
**Title**: Fix Implementation Detail Tests in ButtonAsLink  
**Complexity**: Low  
**Dependencies**: None  
**Assignee**: Me (AI Assistant)

### Definition of Done
- [ ] Refactor tests to check behavior not implementation
- [ ] Remove style/className assertions
- [ ] Add user interaction tests
- [ ] Improve test descriptions
- [ ] Document as example of test improvement

### Acceptance Criteria
1. Tests check what users see/do, not how
2. Click behavior verified properly
3. Accessibility attributes tested
4. Href handling tested correctly
5. Tests serve as component documentation

### Implementation Notes
- Component has 35 usage sites - high impact
- Current tests likely check props/state directly
- Refactor to: click behavior, keyboard navigation, screen reader text
- Use patterns from `docs/testing-strategy/react-testing.md`
- This is a good "example" refactoring for the team

---

## Summary

These 10 items represent a mix of:
- **Pure function extractions** (QW-001, QW-002, QW-003, QW-004) - Quick wins with immediate value
- **Foundation building** (SI-001, QW-006, QW-007) - Enable future improvements
- **Complex hook testing** (SI-002, SI-003) - Address critical gaps
- **Test quality improvement** (QW-009) - Model best practices

Estimated Phase 3.0 velocity: 2-3 items per session, completing batch in 4-5 work sessions.