# Next.js Upgrade Test Issues

This document outlines the issues encountered during test runs after upgrading to Next.js 14, React 19, and ESM modules, along with proposed solutions.

## Summary of Issues

After running the test suite, we observed the following categories of issues:

1. **SEO-related failures**: Many tests expected SEO properties but received `undefined`
2. **Snapshot failures**: Style class names changed, causing snapshot test failures
3. **Component prop testing failures**: Several components aren't receiving expected props
4. **ES Module vs CommonJS issues**: Conflicts between module systems
5. **Styling test failures**: Style assertions failing due to style implementation changes

## Major Upgrade Factors

Two major upgrades are likely contributing to these issues:

1. **Next.js 14 Upgrade**: Changes in routing, metadata handling, and module structure
2. **React 19 Upgrade**: Changes in component rendering, prop handling, and internal mechanisms

## Detailed Analysis and Solutions

### 1. SEO-related Failures

**Issue**: Multiple page component tests are failing because they expect SEO metadata but receive `undefined` values. This affects files like:

- `src/__tests__/pages/about-us/who-we-are.test.tsx`
- `src/__tests__/pages/teachers/curriculum/index.test.tsx`
- `src/__tests__/pages/teachers/programmes/[programmeSlug]/units/unitListing.test.tsx`
- and many others with SEO tests

**Cause**:

- **Next.js factor**: Changes in the metadata API, especially if migrating from Pages Router to App Router
- **React 19 factor**: Possible changes in how React handles or exposes metadata during test rendering

**Solution**:

1. Update the SEO test utilities to match the new Next.js metadata API
2. Review how SEO metadata is being extracted during tests
3. Check if React 19 requires different approaches for accessing context or metadata in tests
4. Either update the test expectations or fix the implementation to provide the expected SEO values

### 2. Snapshot Test Failures

**Issue**: Snapshot tests are failing because the generated HTML includes different class names than expected, particularly in:

- `src/components/CurriculumComponents/Banners/Banners.test.tsx`
- `src/components/GenericPagesComponents/CurriculumTab/CurriculumTab.test.tsx`

**Cause**:

- **Styled Components factor**: Possibly generating different class names in the new environment
- **React 19 factor**: Changes in how React generates and manages component rendering, potentially affecting class name generation and attribute ordering

**Solution**:

1. Update snapshots with `npm run test:ci -- -u` if the UI appearance is correct
2. If there are actual visual differences, investigate why the styling changed
3. Check if styled-components needs an update for React 19 compatibility

### 3. Component Prop Testing Failures

**Issue**: Several component tests expect props to be passed in a certain way but the actual calls don't match expectations:

- `src/components/GenericPagesComponents/ConditionalScript/ConditionalScript.test.tsx`
- `src/components/GenericPagesComponents/Testimonials/Testimonials.test.tsx`
- `src/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view.test.tsx`

**Cause**:

- **React 19 factor**: Changes in how React.createElement behaves or how components receive props
- **Testing library compatibility**: Jest mocks may behave differently with React 19

**Solution**:

1. Update mock expectations to match the new component implementations
2. Check if React 19 has changed how props are passed or how createElement behaves
3. Ensure testing libraries (React Testing Library, Jest) are updated to versions compatible with React 19
4. Update the components to maintain backward compatibility with tests where possible

### 4. ES Module vs CommonJS Issues

**Issue**: Some tests are failing because of conflicts between ESM and CommonJS, notably in:

- `src/pages-helpers/curriculum/docx/builder/1_frontCover.test.ts` (SyntaxError: Identifier '\_\_dirname' has already been declared)
- `src/__tests__/utils/moduleHelpers.ts` (No tests found)

**Cause**: The migration to ESM has created conflicts with code that uses CommonJS patterns, particularly around `__dirname` and `__filename`.

**Solution**:

1. Update the test files to consistently use the `moduleHelpers` approach we've implemented
2. Fix duplicate declarations of `__dirname` in affected files
3. Ensure all test files have at least one test to avoid the "must contain at least one test" error

### 5. Styling Test Failures

**Issue**: Some tests that assert specific CSS styles are failing:

- `src/components/GenericPagesComponents/HopePageTabButtonLabelWithScreenReaderTitle/HopePageTabButtonLabelWithScreenReaderTitle.test.tsx`
- `src/components/SharedComponents/Card/Card.test.tsx`

**Cause**:

- **React 19 factor**: Possible changes in how inline styles are applied or how DOM elements are rendered
- **Styled-components compatibility**: The styling library may need updates for React 19

**Solution**:

1. Update the style testing approach to work with the new implementation
2. Check if there are actual style changes that need to be addressed
3. Ensure styled-components is updated to a version compatible with React 19
4. Update tests to match the current styling implementation

## Additional React 19 Considerations

React 19 introduces several changes that could affect tests:

1. **New React rendering architecture**: React 19 has a new concurrent rendering architecture that could affect how components render in tests
2. **Changes to event handling**: React 19 may handle synthetic events differently
3. **Hook behavior changes**: Some React hooks may have subtle behavior differences
4. **Testing library compatibility**: Make sure @testing-library/react is updated to a version that supports React 19

## Next Steps

1. **Update testing dependencies**: Ensure all testing libraries are compatible with React 19
2. **Prioritize SEO fixes**: Since many tests are failing due to SEO issues, address this first
3. **Update snapshots**: For purely cosmetic changes, update snapshots
4. **Fix ES Module conflicts**: Address the module system conflicts in the test files
5. **Update component tests**: Revise test expectations to match the new component behavior
6. **Refresh styling tests**: Update how styles are tested to work with the current implementation

By addressing these issues methodically, we can fully migrate the test suite to work with the upgraded Next.js version, React 19, and ES Module pattern.
