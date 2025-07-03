# Testing Improvement Phase 1.1 Input

**Source**: Phase 1.0 Inventory Results  
**Purpose**: Prioritized guidance for Phase 1.1 deep audit  
**Date**: July 3, 2025

## Phase 1.1 Scope Definition

Based on Phase 1.0 inventory findings, Phase 1.1 should focus on **quality assessment and deep analysis** of Oak's testing practices. The following prioritization provides maximum impact for the allocated audit time.

## Priority Package Ranking

### Tier 1: Critical Business Logic (Immediate Focus)

#### 1. `src/components/CurriculumComponents/` 
**Priority**: HIGHEST  
**Rationale**: Core curriculum functionality, complex domain logic  
**Files**: ~150 component files  
**Key Areas**: 
- CurricVisualiser components (data visualization complexity)
- CurriculumDownload components (business logic heavy)
- Unit and lesson management components

#### 2. `src/utils/curriculum/`
**Priority**: HIGHEST  
**Rationale**: Pure business logic functions, ideal for TDD assessment  
**Files**: ~30 utility files  
**Key Areas**:
- Filtering and sorting logic
- Data transformation functions  
- Curriculum-specific calculations

#### 3. `src/components/PupilComponents/`
**Priority**: HIGH  
**Rationale**: User-facing features, interaction complexity  
**Files**: ~80 component files  
**Key Areas**:
- Quiz components (complex state management)
- Lesson experience components
- Progress tracking components

### Tier 2: Infrastructure and Integration (Secondary Focus)

#### 4. `src/pages/api/` + `src/app/api/`
**Priority**: HIGH  
**Rationale**: API testing gaps identified, integration concerns  
**Files**: 15 API route files  
**Key Areas**:
- Authentication endpoints
- Data manipulation endpoints  
- Curriculum API integration

#### 5. `src/hooks/`
**Priority**: MEDIUM-HIGH  
**Rationale**: Custom logic patterns, reusability assessment  
**Files**: 66 hook files  
**Key Areas**:
- Data fetching hooks
- State management hooks
- Analytics and tracking hooks

### Tier 3: Supporting Infrastructure (Depth Permitting)

#### 6. `src/context/`
**Priority**: MEDIUM  
**Rationale**: State management patterns, provider testing  
**Files**: 6 main providers  

#### 7. `src/components/SharedComponents/`
**Priority**: MEDIUM  
**Rationale**: Reusable component patterns, cross-domain usage  
**Files**: ~100 component files

## Specific Investigation Framework

### 1. Test Quality Assessment Criteria

For each priority package, evaluate:

#### Behavior vs Implementation Testing
- [ ] Do tests assert on user-observable behavior?
- [ ] Are tests coupled to implementation details?
- [ ] Do test descriptions focus on "what" not "how"?

#### Accessibility-First Testing
- [ ] Primary use of `getByRole` queries?
- [ ] Semantic HTML testing approach?
- [ ] Screen reader compatibility verification?

#### Pure Function Extraction
- [ ] Business logic extracted from components?
- [ ] Testable functions separated from side effects?
- [ ] Domain logic in pure, testable form?

#### TDD Evidence
- [ ] Test structure suggests test-first development?
- [ ] Comprehensive edge case coverage?
- [ ] Tests drive component API design?

### 2. Coverage Gap Analysis

#### Systematic Gap Identification
For each priority package:
1. **Component Coverage**: Which components lack tests?
2. **Function Coverage**: Which exported functions lack tests?
3. **Edge Case Coverage**: Which error conditions lack tests?
4. **Integration Coverage**: Which component interactions lack tests?

#### Gap Prioritization Criteria
- **Business Impact**: User-facing features first
- **Complexity**: Complex logic requires testing
- **Change Frequency**: Active development areas
- **Risk Level**: Error-prone functionality

### 3. Mock Pattern Consistency

#### Mock Factory Assessment
- [ ] Consistent mock creation patterns?
- [ ] Reusable mock factories available?
- [ ] Type-safe mock implementations?
- [ ] Oak domain modeling in mocks?

#### Mock Strategy Evaluation
- [ ] Minimal mocking approach used?
- [ ] External dependencies properly mocked?
- [ ] Mock complexity appropriate for test scope?

## Investigation Methods

### Package-by-Package Audit Approach

#### Step 1: Sample Analysis (2-3 files per package)
- Select representative complex components
- Analyze test quality against criteria
- Document patterns and anti-patterns
- Identify common issues

#### Step 2: Comprehensive Scan (All files in package)
- Count coverage gaps
- Categorize missing tests by type
- Identify quick wins vs major refactors
- Map dependencies between components

#### Step 3: Pattern Documentation
- Document good practices found
- Document concerning patterns
- Create improvement recommendations
- Estimate implementation effort

### Specific File Recommendations

#### High-Value Audit Targets

**CurriculumComponents Priority Files**:
- `CurricVisualiser/CurricVisualiser.tsx` - Complex data visualization
- `CurriculumDownloadView/index.tsx` - Multi-step business logic  
- `CurricUnitModal/CurricUnitModalContent.tsx` - State management complexity

**Curriculum Utils Priority Files**:
- `utils/curriculum/filtering.ts` - Core filtering logic
- `utils/curriculum/sorting.ts` - Data manipulation  
- `utils/curriculum/features.ts` - Feature flag logic

**PupilComponents Priority Files**:
- `QuizEngineProvider/QuizEngineProvider.tsx` - Complex state management
- `PupilExperience/PupilExperience.view.tsx` - User journey orchestration
- `QuizRenderer/QuizRenderer.tsx` - Dynamic component rendering

**API Routes Priority Files**:
- `pages/api/curriculum-downloads/index.ts` - File generation logic
- `app/api/auth/onboarding/route.ts` - Authentication flow
- `pages/api/video/signed-url.ts` - External service integration

## Expected Deliverables from Phase 1.1

### 1. Quality Assessment Report
- **Test Quality Score** per priority package (1-10 scale)
- **Pattern Analysis** (good practices vs concerning patterns)
- **Coverage Gap Matrix** (component/function level)
- **Accessibility Testing Evaluation**

### 2. Improvement Opportunity Catalog
- **Quick Wins** (low effort, high impact improvements)
- **Strategic Refactors** (extract pure functions, improve architecture)
- **Testing Infrastructure** (improve mock patterns, test utilities)
- **Coverage Expansion** (new tests needed, priority order)

### 3. Phase 2 Planning Input
- **Prioritized Improvement List** with effort estimates
- **Resource Requirements** for implementation
- **Risk Assessment** for each improvement area
- **Success Metrics** for measuring progress

## Resource Allocation Recommendations

### Time Distribution (40-60 hour estimate)
- **Tier 1 Packages**: 60% of time (24-36 hours)
- **Tier 2 Packages**: 30% of time (12-18 hours)  
- **Tier 3 Packages**: 10% of time (4-6 hours)

### Audit Sequence
1. **Start with `utils/curriculum/`** - Pure functions, clearest patterns
2. **Move to `CurriculumComponents`** - Build on utility understanding
3. **Analyze `PupilComponents`** - Compare component patterns
4. **Assess API routes** - Different testing challenges
5. **Review hooks** - Reusability and pattern consistency

## Success Criteria for Phase 1.1

### Primary Objectives
- [ ] Quality assessment completed for all Tier 1 packages
- [ ] Coverage gaps systematically identified and prioritized
- [ ] Testing patterns documented (good and concerning)
- [ ] Actionable improvement recommendations prepared

### Secondary Objectives  
- [ ] Quick wins identified for immediate implementation
- [ ] Strategic refactoring opportunities mapped
- [ ] Phase 2 planning input prepared
- [ ] Team guidance documents refined

## Risk Mitigation

### Potential Challenges
- **Time Constraints**: Focus on Tier 1 packages if time runs short
- **Complexity Overload**: Use sampling approach, don't audit every file
- **Pattern Inconsistency**: Document variations, focus on most common patterns

### Quality Assurance
- **Validate Findings**: Cross-reference patterns across packages
- **Evidence-Based Recommendations**: Support all recommendations with specific examples
- **Actionable Output**: Ensure all recommendations include implementation guidance

---

**Ready for Phase 1.1**: This input provides clear priorities, systematic investigation methods, and measurable success criteria for the deep audit phase. The prioritized package list enables focused effort on the areas with highest impact potential for Oak's testing transformation.