# Styled-Components v6 Migration Fixes

This document outlines a plan to address the warnings and errors related to the migration from Styled-Components v5 to v6 and Next.js 14 to 15.

## Identified Issues

Based on a thorough analysis of the dev-server logs, the following issues have been identified:

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

Given the large number of warnings, a phased approach is recommended:

### Phase 1: Global StyleSheetManager (1 day)

1. Implement the `shouldForwardProp` configuration in StyleSheetManager
2. Add the important custom props we've identified from the logs

This will immediately reduce the number of warnings without requiring many component changes.

### Phase 2: High-Priority Component Fixes (1-2 days)

1. Fix the most visible/used components first:

   - OakLessonLayout
   - OakPupilJourneyLayout
   - Button
   - OwaLink
   - FooterLink

2. Create wrapper components for oak-components library components as needed

### Phase 3: Systematic Clean-up (2-3 days)

1. Address remaining components with warnings
2. Fix useLayoutEffect issues
3. Fix ARIA attribute patterns

## Testing

For each phase:

1. Test on development server and verify console warnings are reduced
2. Test the main user flows to ensure functionality is maintained
3. Check that visual presentation remains correct after changes

## Important Considerations

1. **Gradual Migration**: Not all warnings need to be fixed immediately - the site is still functional
2. **Dependency on External Libraries**: Some issues are in external libraries which we may not be able to fix directly
3. **Component Library Compatibility**: Check with the @oaknational/oak-components team about a v6-compatible release

## Conclusion

By implementing these changes, we'll resolve the warnings appearing after the Styled-Components v5 to v6 migration. The approach prioritizes maintaining functionality while gradually eliminating warnings through a combination of global configuration and targeted component updates.
