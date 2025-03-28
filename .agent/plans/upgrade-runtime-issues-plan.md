# Next.js 15 and Styled-Components v6 Migration Fixes

This document outlines a plan to address the warnings and errors related to the migration from Next.js 14 to 15 and Styled-Components v5 to v6.

## Identified Issues

Based on a thorough analysis of the dev-server and build logs, the following issues have been identified:

1. **Styled-Components Prop Forwarding**: Multiple warnings related to unknown props being passed to DOM elements, a breaking change in Styled-Components v6:

   ```
   styled-components: it looks like an unknown prop "sectionName" is being sent through to the DOM, which will likely trigger a React console error.
   ```

2. **useLayoutEffect SSR Warning**: Warnings related to using `useLayoutEffect` during server-side rendering:

   ```
   Warning: useLayoutEffect does nothing on the server, because its effect cannot be encoded into the server renderer's output format.
   ```

3. **Invalid ARIA Attributes**: Warnings about incorrect ARIA attribute naming:

   ```
   Warning: Invalid ARIA attribute `ariaLabel`. Did you mean `aria-label`?
   ```

4. **Type Errors for Boolean Props**: Warnings about using boolean values for non-boolean attributes:

   ```
   Warning: Received `false` for a non-boolean attribute `celebrate`.
   ```

5. **Build-Time Environment Issues**: Error during build related to missing environment variables:

   ```
   Error: getServerConfig('personalisationApiUrl') failed because there is no env value PERSONALISATION_API_URL
   ```

6. **Invalid ARIA Role Attributes**: Multiple components have invalid ARIA role attributes:
   ```
   Warning: aria-role: This attribute is an invalid ARIA attribute.  jsx-a11y/aria-props
   ```
   Affected components:
   - QuizResultInner
   - QuizResultMCQ
   - QuizResultMatch
   - QuizResultOrder

## Root Cause Analysis

### Styled-Components v6 Breaking Changes

In Styled-Components v6, all props are forwarded to the underlying DOM element by default. This is a significant change from v5, where unknown props were automatically filtered out. This is causing many warnings for custom props that were previously passed without issue.

From the [styled-components v6 migration guide](https://styled-components.com/docs/faqs#what-do-i-need-to-do-to-migrate-to-v6):

> "In v6, we no longer filter non-standard HTML attributes from the props passed to DOM elements by default."

The solution is to either:

1. Prefix custom props with `$` to indicate they should not be forwarded
2. Use `shouldForwardProp` to customize which props should be forwarded
3. Destructure and consume custom props before they reach DOM elements

## Action Plan

### 1. Implement Immediate Fix for Prop Forwarding

Add the `shouldForwardProp` configuration to the StyleSheetManager to filter out common custom props:

```tsx
// src/pages/_app.tsx or similar global component
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";

// Custom shouldForwardProp function
const shouldForwardProp = (prop, defaultValidatorFn) => {
  // List of custom props used in the application that shouldn't be forwarded
  const invalidProps = [
    "sectionName",
    "celebrate",
    "phase",
    "numQuestions",
    "grade",
    "index",
    "text",
    "ariaLabel",
    "blogSlug",
    "webinarSlug",
    "lines",
    "legalSlug",
    "desktopColSpan",
    "hideBottom",
    "labelColor",
    // Add other props as identified
  ];

  // Return false for our blacklisted props, otherwise use the default validator
  return !invalidProps.includes(prop) && defaultValidatorFn(prop);
};

// In your App component:
<StyleSheetManager shouldForwardProp={shouldForwardProp}>
  {/* App content */}
</StyleSheetManager>;
```

### 2. Prefixing Custom Props with $

For components under our control, update styled-component props to use the `$` prefix:

```tsx
// Before
const StyledComponent = styled.div`
  color: ${(props) => (props.customColor ? "red" : "blue")};
`;

// After
const StyledComponent = styled.div`
  color: ${(props) => (props.$customColor ? "red" : "blue")};
`;

// Usage
<StyledComponent $customColor />; // Instead of <StyledComponent customColor />
```

### 3. Fix @oaknational/oak-components Library

For the @oaknational/oak-components library, which shows many warnings, we need to:

1. Check if there's a newer version of the library that's compatible with Styled-Components v6
2. If not, create wrapper components for the most problematic components:

```tsx
// src/components/wrappers/OakLessonLayoutWrapper.tsx
import { OakLessonLayout } from "@oaknational/oak-components";

export type OakLessonLayoutWrapperProps = {
  sectionName?: string;
  celebrate?: boolean;
  phase?: string;
  children: React.ReactNode;
  // other props
};

export const OakLessonLayoutWrapper: React.FC<OakLessonLayoutWrapperProps> = ({
  sectionName,
  celebrate,
  phase,
  children,
  ...validProps
}) => {
  return (
    <OakLessonLayout
      // Use data attributes for custom data needed in the DOM
      data-section-name={sectionName}
      data-celebrate={celebrate}
      data-phase={phase}
      {...validProps}
    >
      {children}
    </OakLessonLayout>
  );
};
```

### 4. Fix Invalid ARIA Attributes

Update components that use camelCase ARIA attributes to use hyphenated versions:

```tsx
// Before
<Component ariaLabel="Some label" />

// After
<Component aria-label="Some label" />
```

### 5. Fix Boolean Props

Update components that pass boolean values directly to DOM elements:

```tsx
// Before
<Component celebrate={false} />

// After
<Component celebrate={false ? 'true' : undefined} />
// Or better yet
{false ? <Component celebrate /> : <Component />}
```

### 6. Fix useLayoutEffect SSR Warning

For components using `useLayoutEffect` with SSR, create a safe version that uses `useEffect` on the server:

```tsx
// src/utils/useIsomorphicLayoutEffect.ts
import { useLayoutEffect, useEffect } from "react";

// Use useLayoutEffect on client, useEffect on server
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
```

Then use this in components:

```tsx
import { useIsomorphicLayoutEffect } from "../../utils/useIsomorphicLayoutEffect";

// Instead of useLayoutEffect
useIsomorphicLayoutEffect(() => {
  // Effect code
}, [dependencies]);
```

## Implementation Strategy

Given the multiple issues discovered, a phased approach is recommended:

### Phase 1: Fix Build-Breaking Issues (1 day)

1. **Fix Location Reference Error**:

   ```typescript
   // Before (problematic code using location directly)
   const currentUrl = location.href;

   // After (safe usage with isomorphic check)
   const currentUrl = typeof window !== "undefined" ? window.location.href : "";

   // Or using Next.js utilities
   import { useRouter } from "next/router";

   const router = useRouter();
   const currentUrl = router.asPath;
   ```

   Files to check:

   - Search for direct `location` usage in the codebase
   - Focus on files that handle routing or URLs
   - Check `.next/server/chunks/2121.js` source mapping for original file

2. **Fix Avo Inspector Configuration**:

   ```typescript
   // In the file where Avo is initialized
   initAvo({
     env: getAvoEnv(),
     webDebugger: false,
     inspector: {
       // Add required inspector configuration
       enabled: process.env.NODE_ENV === "development",
       // other inspector options
     },
   });
   ```

3. **Fix Next.js Image Warning**:

   ```tsx
   // In src/components/GenericPagesComponents/Testimonials/Testimonials.test.tsx
   // Before
   <img src="..." />;

   // After
   import Image from "next/image";

   <Image src="..." width={width} height={height} alt={alt} />;
   ```

### Phase 2: Fix ARIA and Accessibility Issues (1 day)

1. **Fix Invalid ARIA Attributes in Quiz Components**:

   ```tsx
   // Before
   <div aria-role="some-role">

   // After
   <div role="some-role">
   ```

   Components to fix:

   - src/components/PupilComponents/QuizResultInner/QuizResultInner.tsx
   - src/components/PupilComponents/QuizResultMCQ/QuizResultMCQ.tsx
   - src/components/PupilComponents/QuizResultMatch/QuizResultMatch.tsx
   - src/components/PupilComponents/QuizResultOrder/QuizResultOrder.tsx

### Phase 3: Styled-Components Migration (1-2 days)

1. Address the warnings related to the migration from Styled-Components v5 to v6 and Next.js 14 to 15.

### Phase 4: Systematic Clean-up (2-3 days)

1. Address remaining components with warnings
2. Fix useLayoutEffect issues
3. Fix ARIA attribute patterns

## Testing Strategy

1. **Build Testing**:

   - Run `npm run build` after each change to location-related code
   - Test both development and production builds
   - Verify no SSR/build errors occur
   - Check source maps to track down build errors

2. **SSR Testing**:

   - Test pages with `next build && next start`
   - Verify pages render correctly with JavaScript disabled
   - Check network tab for hydration issues
   - Test routing functionality thoroughly

3. **Runtime Testing**:

   - Test on development server
   - Verify console warnings are reduced
   - Test the main user flows
   - Check visual presentation

4. **Accessibility Testing**:
   - Verify ARIA attributes work correctly
   - Test with screen readers
   - Run pa11y-ci checks

## Important Considerations

1. **Next.js 15 SSR Changes**:

   - Review Next.js 15 migration guide for SSR changes
   - Check for other browser APIs being used during SSR
   - Consider using Next.js middleware for URL handling
   - Test SSR behavior thoroughly

2. **Analytics Integration**:

   - Review Avo integration setup
   - Consider making analytics initialization lazy
   - Add better error handling for analytics
   - Document required analytics configuration

3. **Build Process**:

   - Monitor build output for new warnings
   - Check bundle sizes and performance metrics
   - Verify static generation works correctly

4. **Gradual Migration**:

   - Focus on fixing build errors first
   - Then address runtime warnings
   - Finally clean up remaining issues

5. **Dependency Management**:
   - Check compatibility of all dependencies with Next.js 15
   - Update oak-components library if needed
   - Monitor for dependency conflicts

## Conclusion

The immediate focus should be on fixing the build-breaking location reference error and ensuring proper SSR compatibility with Next.js 15. Once the build is stable, we can proceed with the styled-components migration and other improvements. This approach ensures we maintain a working build throughout the upgrade process.
