# TypeScript Issues Fix Plan

This document outlines a structured approach to resolving TypeScript type issues in the Oak Web Application codebase. The plan is organized by issue category and focuses on incremental fixes that can be applied and tested independently.

## Issue Analysis Summary

Based on the `npm run type-check` output, we've identified several categories of TypeScript errors:

1. **Styled Components Type Issues**: Problems with CSS template usage in styled components
2. **Custom Props with `$` Prefix**: Inconsistencies between prop definitions and usage
3. **Next-Sitemap Type Issues**: Incorrect return types in sitemap generation
4. **Missing Type Annotations**: Parameters without explicit types

## Environment Context

- **styled-components**: Version 6.1.15 (major version upgrade from v5 to v6)
- **next-sitemap**: Version 4.2.3
- **Next.js**: Version 15.2.3 (upgraded from v13)
- **@oaknational/oak-components**: Version 1.93.0

## 1. Styled Components Issues

### Background

Styled Components v6 was released with significant changes to its TypeScript support. The primary issues in our codebase are:

- Type inference in CSS template literals
- Generic type parameters in `css` functions not being properly propagated
- Required props being passed to templates but not to styled components

### Fix Plan

1. **BrushBorders and ButtonBorders Components**:

   - Update `css` usage to pass required props like `color` and `background`
   - Ensure proper type propagation when composing templates
   - Add explicit prop types to styled components

   ```typescript
   // Incorrect usage:
   ${brushBorder}  // Missing required color prop

   // Correct usage:
   ${(props) => brushBorder({ ...props, color: props.color })}
   ```

2. **CSS Composition Pattern Updates**:
   - Review pattern for composing styled components CSS
   - Implement consistent approach for prop type propagation

## 2. Custom `$` Prefix Props

### Background

The Oak Component library uses `$` prefix for styling props (following styled-system conventions). The main issues are:

- Some components using `$objectFit` and `$objectPosition` when the API expects `objectFit` and `objectPosition`
- Missing required props on components from `@oaknational/oak-components`
- Type mismatches in prop naming conventions

### Fix Plan

1. **OwaImage Component Issues**:

   - Review `OwaImage` component implementation
   - Fix inconsistencies between in-house naming (`$objectFit`) and oak-components API
   - Replace `$objectPosition` with `objectPosition` in `QuizOakImage` and `PostListItemImage`

2. **NewFocusUnderline Prop Requirements**:

   - Add required `name` prop to `NewFocusUnderline` component usage
   - Check for other required props in Oak Components

3. **RadioContainer `$zIndex` Issue**:
   - Fix inconsistency between custom `$zIndex` prop and expected props

## 3. Next-Sitemap API Issues

### Background

After upgrading to Next.js 15 and next-sitemap 4.x, the sitemap generation API has changed. The current implementation is using incompatible types.

### Fix Plan

1. **GetServerSideProps Return Type**:

   - Update sitemap API usage to match new requirements
   - Fix `getServerSideProps` return types to use `GetServerSidePropsResult`
   - Implement correct parameters for `getServerSideSitemap`

   ```typescript
   // Current incorrect pattern:
   export const getServerSideProps: GetServerSideProps = async (context) => {
     // ...
     return getServerSideSitemap(context, fields);
   };

   // Corrected pattern (based on next-sitemap docs):
   export const getServerSideProps: GetServerSideProps = async (context) => {
     // ...
     return {
       props: {},
     };
   };
   ```

2. **ISitemapField Type Usage**:
   - Fix mismatched argument types between `GetServerSidePropsContext` and `ISitemapField[]`

## 4. Missing Type Annotations

### Fix Plan

1. **OnboardingForm Event Handler**:

   - Add explicit type annotation to the `event` parameter
   - Replace `any` with a specific React event type:

   ```typescript
   // From:
   (event) => { ... }

   // To:
   (event: React.FormEvent<HTMLFormElement>) => { ... }
   ```

## Implementation Strategy

### Phase 1: Styled Components Fixes

1. Create a consistent pattern for CSS composition in styled components
2. Update BrushBorders.tsx and ButtonBorders.tsx components
3. Test changes by running `npm run type-check` for these specific files

### Phase 2: Oak Components Prop Alignment

1. Fix OwaLink component to add required `name` prop to NewFocusUnderline
2. Update OwaImage usages in QuizOakImage and PostListItemImage
3. Fix RadioContainer props in ResourceCard component
4. Verify changes with targeted type checks

### Phase 3: Next-Sitemap API Fixes

1. Update sitemap generation API usage in all affected files
2. Test sitemap generation functionality
3. Verify fixed return types

### Phase 4: Type Annotation Cleanup

1. Add missing type annotations to event handlers
2. Run comprehensive type check to ensure no new issues

## Questions for Clarification

1. Is there a custom implementation of OwaImage that wraps oak-components? This would explain the prop naming discrepancy.
2. Has the team adopted any specific patterns for handling styled-components v6 composition that should be followed?
3. Are there any automated tests for the sitemap generation that should be updated alongside the type fixes?
4. Should we consider upgrading TypeScript itself as part of this process, as some errors might be related to stricter type checking in newer versions?

## Additional Resources

- [Styled Components v6 Migration Guide](https://styled-components.com/docs/faqs#what-do-i-need-to-do-to-migrate-to-v6)
- [Next-Sitemap Documentation](https://github.com/iamvishnusankar/next-sitemap)
- [Oak Components Documentation](https://github.com/oaknational/oak-components)
