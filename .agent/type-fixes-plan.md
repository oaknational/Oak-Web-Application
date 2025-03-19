# TypeScript Issues Fix Plan

This document outlines a structured approach to resolving TypeScript type issues in the Oak Web Application codebase. The plan is organized by issue category and focuses on incremental fixes that can be applied and tested independently.

after each change, and before making any further code changes, you **must**

- Run the type checking script `npm run type-check`
- **Review the @type-fixes-plan.md to make sure we are on track**
- If necessary, update the @type-fixes-plan.md
- Resolve any linting errors in edited files

## Issue Analysis Summary

Based on the `npm run type-check` output, we've identified several categories of TypeScript errors:

1. **Styled Components v6 Migration Issues**:

   - CSS template composition problems in styled components
   - Prop type issues with `$` prefixed props
   - Style function type mismatches in utility functions
   - Test file issues with styled-components props

2. **Next-Sitemap API Issues**:

   - Incorrect return types in `getServerSideProps`
   - Type mismatches in `getServerSideSitemap` parameters
   - Issues across multiple sitemap files

3. **Component-specific Issues**:

   - Image component prop type mismatches (`$objectFit`, `$objectPosition`)
   - Form event handling type issues
   - ResourceCard styling issues
   - Button and Card component type issues

4. **Theme and Utility Issues**:
   - Missing `buttonIconBackgroundColors` in theme type
   - Utility function type mismatches in style helpers
   - Test file issues with style utilities

## Environment Context

- **styled-components**: Version 6.1.15 (major version upgrade from v5 to v6)
- **next-sitemap**: Version 4.2.3
- **Next.js**: Version 15.2.3 (upgraded from v14)
- **@oaknational/oak-components**: Version 1.96.0

## Implementation Strategy

### Phase 1: Styled Components v6 Migration

1. **CSS Template Composition**:

   - Update `css` helper usage in styled components
   - Fix prop type propagation in style functions
   - Update test files to use correct prop types

2. **Style Utility Functions**:

   - Fix type definitions in style utility functions
   - Update test files to match new type requirements
   - Ensure proper type propagation in style composition

3. **Component Props**:
   - Update `$` prefixed props to match styled-components v6 requirements
   - Fix prop type definitions in components
   - Update test files to use correct prop types

### Phase 2: Next-Sitemap API Fixes

1. **GetServerSideProps Return Types**:

   - Update return types to match Next.js requirements
   - Fix parameter types in `getServerSideSitemap` calls
   - Apply fixes across all sitemap files

2. **Type Definitions**:
   - Add proper type imports from next-sitemap
   - Update type definitions for sitemap fields
   - Ensure consistent type usage across files

### Phase 3: Component-specific Fixes

1. **Image Components**:

   - Update prop types for `$objectFit` and `$objectPosition`
   - Fix type definitions in QuizOakImage and PostListItemImage
   - Update related test files

2. **Form Components**:

   - Add proper type annotations to event handlers
   - Fix type issues in OnboardingForm
   - Update related test files

3. **ResourceCard and Button Components**:
   - Fix styling prop type issues
   - Update component interfaces
   - Fix test file type issues

### Phase 4: Theme and Utility Fixes

1. **Theme Types**:

   - Add missing theme properties
   - Update theme type definitions
   - Fix theme-related type issues

2. **Style Utilities**:
   - Fix type definitions in style utility functions
   - Update test files to match new type requirements
   - Ensure proper type propagation

## Questions for Clarification

1. Is there a custom implementation of OwaImage that wraps oak-components?
2. Has the team adopted any specific patterns for handling styled-components v6 composition?
3. Are there any automated tests for the sitemap generation that should be updated?
4. What is the preferred approach for handling `$` prefixed props in styled-components v6?

## Additional Resources

- [Styled Components v6 Migration Guide](https://styled-components.com/docs/faqs#what-do-i-need-to-do-to-migrate-to-v6)
- [Next-Sitemap Documentation](https://github.com/iamvishnusankar/next-sitemap)
- [Oak Components Documentation](https://github.com/oaknational/oak-components)
