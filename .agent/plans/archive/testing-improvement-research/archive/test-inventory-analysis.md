# Comprehensive Test Inventory Analysis

**Total Test Files**: 641 (not 633 as previously reported)  
**Analysis Date**: July 9, 2025  
**Purpose**: Deep dive into Oak's test coverage to understand what we're working with

## Test Distribution by Category

### 1. Page Tests (91 files) - 14.2%
Located in `src/__tests__/pages/`:
- Teacher pages: 31 tests
- Pupil pages: 18 tests  
- General pages: 13 tests (index, 404, 500, contact, etc.)
- API routes: 13 tests
- About/blog/webinar pages: 16 tests

**Key Finding**: Good coverage of page-level tests, including API routes

### 2. Component Tests (348 files) - 54.3%

#### SharedComponents (58 tests)
- Core UI: Button, Card, Input, Checkbox
- Media: VideoPlayer (7 separate test files!), CMSImage, CMSVideo
- Layout: AspectRatio, Breadcrumbs, Typography
- **Notable**: Heavy VideoPlayer testing suggests critical functionality

#### TeacherComponents (96 tests)
- Download functionality: 13 test files
- Lesson overview: 19 test files
- Onboarding: 8 test files
- Resource management: Multiple test files
- **Notable**: Download and share functionality heavily tested

#### PupilComponents (41 tests)
- Quiz functionality: 17 test files
- Lesson navigation: Multiple files
- Video/media: Several files
- **Notable**: Quiz system has comprehensive testing

#### CurriculumComponents (65 tests)
- Downloads: 10 test files
- Visualizer: 12 test files
- Units/cards: Multiple files
- **Notable**: Oak Components Kitchen has 13 test files

#### GenericPagesComponents (22 tests)
- Various page-specific components

#### AppComponents (11 tests)
- Core app structure components

### 3. Utility/Helper Tests (83 files) - 12.9%
- `src/utils/`: 40 test files
- Component helpers: 20+ files
- Formatting, validation, data transformation

### 4. Node/API Layer Tests (55 files) - 8.6%
- `src/node-lib/curriculum-api-2023/`: 42 test files
- CMS integration: 8 test files
- Educator API: 5 test files

### 5. Browser Library Tests (17 files) - 2.7%
- Analytics: 4 files
- Cookie consent, Hubspot, error reporting
- Browser-specific utilities

### 6. Infrastructure Tests (47 files) - 7.3%
- Scripts/build: 5 files
- Styles/utils: 13 files
- Pages helpers: 29 files

## Critical Insights

### 1. Test File Naming Patterns
- Consistent `.test.ts` and `.test.tsx` naming
- Co-located with source files (good practice)
- Some concentrated test directories (`__tests__/`)

### 2. High-Coverage Areas
- **VideoPlayer**: 7 dedicated test files for one component
- **Quiz System**: 17+ files covering all quiz types
- **Downloads**: 23+ files across curriculum and teacher downloads
- **Curriculum API**: 42 files for the 2023 API

### 3. Potential Gaps Identified
- **New App Directory**: Only 2 test files in `src/app/`
- **Hooks**: 11 test files for hooks (seems low given complexity)
- **Context**: 9 test files (might need more coverage)

### 4. Test Organization Patterns

#### Well-Organized Areas:
- Curriculum API queries (each query has a test)
- Page tests mirror page structure
- Component tests co-located with components

#### Inconsistent Areas:
- Some helpers tested in component folders
- Mix of `__tests__` directories and co-located tests
- Varying depth of helper function testing

## Surprising Discoveries

### 1. Comprehensive Feature Testing
- **Curriculum Downloads**: Has tests despite being marked as "untested"
- **Onboarding**: 8 dedicated test files
- **Share Experiments**: Teacher sharing functionality well-tested

### 2. Infrastructure Testing
- Build scripts have tests
- Style utilities have comprehensive tests
- Even SEO and sitemap generation tested

### 3. Domain-Specific Testing
- Specialist programmes have dedicated test suites
- Financial education has specific test files
- Accessibility tools (axe) have tests

## Test Type Distribution (Estimated)

Based on file names and locations:
- **Unit Tests**: ~200 files (31%) - Utils, helpers, pure functions
- **Component Tests**: ~348 files (54%) - React component testing
- **Integration Tests**: ~70 files (11%) - API routes, page tests
- **Infrastructure Tests**: ~23 files (4%) - Build, styles, scripts

## Recommendations for Phase 1.2

### 1. Update Test Count
- Actual count is 641, not 633
- This changes our coverage calculations

### 2. Focus Areas for Improvement
1. **Component Test Quality**: 348 files but low quality score (5.2/10)
2. **App Directory**: New Next.js structure needs more tests
3. **Hook Testing**: Complex hooks may need better coverage
4. **Context Testing**: Critical for state management

### 3. Already Well-Tested Areas
- VideoPlayer (maybe over-tested?)
- Quiz system
- Curriculum API layer
- Download functionality

### 4. Quick Wins
- Extract pure functions from the 348 component tests
- Improve test quality in existing files rather than adding new ones
- Focus on behavior testing in components

## Next Steps

1. Analyze test quality in high-file-count areas (components)
2. Identify which of the 348 component tests are testing implementation
3. Check if video player's 7 test files are necessary or could be consolidated
4. Verify coverage in new app directory structure
5. Create strategy for improving quality without adding more files