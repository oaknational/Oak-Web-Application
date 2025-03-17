# Next.js Upgrade Test Issues

This document outlines the issues encountered during test runs after upgrading to Next.js 14, React 19, and ESM modules, along with proposed solutions.

## Project Upgrade Status

_Last updated: July 19, 2023_

Current status:

- Next.js and React codemods have been applied
- Addressed ESM modules compatibility for `__dirname` and `__filename`
- TypeScript errors increased from 177 to 263 in 110 files, primarily related to styled-components
- Test failures still present and require additional fixes
- Just installed @types/lodash to fix lodash-related type errors
- Fixed/updated core style utility files: responsive.ts and theme/types.ts

### Progress Updates

**July 19, 2023:**

- Successfully applied Next.js and React codemods to update syntax.
- Addressed ESM module compatibility by implementing `moduleHelpers` approach for `__dirname` and `__filename`.
- Updated core style utility files (responsive.ts and theme/types.ts) to be compatible with styled-components v6.
- Installed @types/lodash to resolve type errors in files using lodash imports.
- Identified several categories of remaining TypeScript errors:

  1. **Styled-components v6 API changes**:

     - The `ThemedStyledProps` and `FlattenSimpleInterpolation` types are no longer exported directly.
     - SVG components and `FocusUnderline` components now require additional properties.
     - Changes in how props are handled with the `$` prefix for transient props.

  2. **React 19 changes**:

     - `defaultProps` is deprecated in functional components (FC) - needs refactoring to default parameters.
     - Stricter type checking for props, especially for children and event handlers.

  3. **Storybook compatibility issues**:
     - Type errors in Storybook stories with unknown props.
     - Potential mismatch with Storybook API and React 19.

**Next actions:**

- Continue addressing styled-components v6 related issues:
  - Update component files to use the correct prop passing pattern with `$` prefix for transient props
  - Fix FocusUnderline and SVG components that are missing required props
  - Address defaultProps deprecation in components
- Fix remaining style utility files based on the pattern established
- Create a plan for systematically addressing remaining TypeScript errors

**July 20, 2023:**

- Successfully applied fix patterns to resolve TypeScript errors:
  - Fixed several style utility test files (background.test.tsx, border.test.tsx) by properly typing styled components with the Props interface: `styled.div<ComponentProps>`
  - Updated Circle component from using `.defaultProps` to destructuring with default values
  - Installed @types/lodash to fix lodash-related type errors
- The number of TypeScript errors has slightly decreased, showing that our patterns are working
- Documented the fix patterns in this file to create a systematic approach

**Current Status Summary:**

- Many TypeScript errors remain in styled-components usage, especially in test files
- Theme property issues: `button` vs `buttons`, missing `contrastColors`
- Storybook decorator issues related to Story components
- Next.js type issues around `getServerSideProps`

**Next Steps:**

1. Continue applying the styled-components transient props pattern to other test files
2. Update theme properties to match the new structure
3. Fix defaultProps usage throughout the codebase
4. Address Storybook decorator issues
5. Fix Next.js server side props typing

By systematically applying these patterns, we can significantly reduce the TypeScript errors and make the codebase compatible with Next.js 14, React 19, and styled-components v6.

## ESLint Configuration Enhancement Plan

To help identify and resolve the TypeScript errors more effectively, we've enhanced the ESLint configuration with the following:

1. **Added styled-components ESLint plugin** to catch styled-components specific issues
2. **Strengthened TypeScript-ESLint rules** to better identify prop type mismatches
3. **Configured import resolution** to detect missing types and imports
4. **Added specific overrides for styled-components tests** to address patterns in test files
5. **Used path aliases** to ensure proper resolution of type files

These enhancements have helped identify several key issues with the styled-components implementation.

## Styled-Components Analysis Findings

After running linting with the enhanced ESLint configuration, we've identified the following specific issues:

1. **Missing Type Exports**: The most critical errors are related to missing type exports from styled-components:

   - `ThemedStyledProps`
   - `DefaultTheme`
   - `FlattenSimpleInterpolation`
   - `Interpolation`
   - `CSSProperties`

2. **Import Order Issues**: Many files have import order issues that need to be fixed to comply with ESLint rules. While these don't affect functionality, they reduce code consistency.

3. **Type vs Interface Usage**: Our ESLint rule enforcing the use of `interface` instead of `type` is flagging many type definitions in the styled-components utility files.

4. **Path Resolution Issues**: Multiple import errors indicate problems with path resolution, especially for imports using the `@/` alias.

## Next Steps for Styled-Components Fix

Based on our analysis, here's the plan to fix the styled-components related TypeScript errors:

1. **Create Type Declarations**: Create a custom type declaration file (`styled-components.d.ts`) that provides the missing type exports from styled-components. This approach avoids needing to update the styled-components library itself.

2. **Update @types/styled-components**: Install or update the `@types/styled-components` package to ensure it's compatible with React 19.

3. **Fix Utility Files First**: Start by fixing the core utility files:

   - `src/styles/utils/responsive.ts`
   - `src/styles/theme/types.ts`
   - Other utility files in `src/styles/utils/`

4. **Convert Types to Interfaces**: Update type definitions to use interfaces where appropriate to comply with our ESLint rules.

5. **Fix Import Order**: Address import order issues to improve code consistency and maintainability.

## Summary of Issues

After running the test suite, we observed the following categories of issues:

1. **SEO-related failures**: Many tests expected SEO properties but received `undefined`
2. **Snapshot failures**: Style class names changed, causing snapshot test failures
3. **Component prop testing failures**: Several components aren't receiving expected props
4. **Styling test failures**: Style assertions failing due to style implementation changes
5. **TypeScript type errors**: Numerous type errors, particularly with styled-components
6. **TurboPack issues**: We can't use Turbopack yet because it causes issues with the use of the generated SVG sprite images. We should resolve this so we can benefit from the performance gains.

## Major Upgrade Factors

Two major upgrades are likely contributing to these issues:

1. **Next.js 14 Upgrade**: Changes in routing, metadata handling, and module structure
2. **React 19 Upgrade**: Changes in component rendering, prop handling, and internal mechanisms

## TypeScript Configuration Analysis

The project uses a single main TypeScript configuration file (`tsconfig.json`) with the following key settings:

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "esnext",
    "moduleResolution": "node",
    "jsx": "preserve",
    "strict": true,
    "noImplicitAny": true,
    "esModuleInterop": true,
    "plugins": [
      { "name": "typescript-plugin-css-modules" },
      { "name": "next" }
    ],
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Type Check Results

Running `pnpm type-check` after applying the Next.js and React codemods revealed 263 TypeScript errors in 110 files (up from 177 errors in 73 files previously). The errors fall into several categories:

1. **styled-components compatibility issues**: The most prevalent errors are still related to styled-components and its type definitions:

   - Missing exported types: `ThemedStyledProps`, `FlattenSimpleInterpolation`
   - Type mismatches in prop handling for styled components
   - Additional errors in the styles utils tests

2. **Expanded scope of affected files**: The codemods have introduced type errors in more files, including:

   - More components in the PupilComponents directory
   - Additional style utility tests
   - Various page files

3. **React 19 compatibility issues**: New errors related to React 19 type incompatibilities:
   - Changed prop types in React components
   - Issues with hooks and contexts

### Key Styled-Components Issues

The errors continue to show the pattern where styled-components utility functions are failing with errors like:

```
Type 'FastOmit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>' has no properties in common with type 'BackgroundProps'.
```

This still indicates that the styled-components library or its TypeScript definitions need to be updated to be compatible with React 19.

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
- `

### TypeScript Error Fix Patterns

To address the numerous TypeScript errors in the codebase following the upgrade to Next.js 14, React 19, and styled-components v6, we've identified several common patterns that can be systematically applied:

#### 1. Styled-components v6 Transient Props

In styled-components v6, props with a `$` prefix are used as "transient props" that won't be passed to the DOM. These need to be properly typed:

```tsx
// Before
const StyledComponent = styled.div`
  ${someStyleFunction}
`;
<StyledComponent $someTransientProp={value} />; // Error: $someTransientProp doesn't exist

// After - Fix by importing and using the props type
import someStyleFunction, { SomeStyleProps } from "./someStyleFunction";

const StyledComponent = styled.div<SomeStyleProps>`
  ${someStyleFunction}
`;
<StyledComponent $someTransientProp={value} />; // Works!
```

#### 2. React 19 defaultProps Deprecation

React 19 has deprecated the use of `defaultProps` on functional components. Update components to use default parameter values instead:

```tsx
// Before
const MyComponent: FC<MyComponentProps> = (props) => {
  const { someValue, ...rest } = props;
  // ...
};

MyComponent.defaultProps = {
  someValue: "defaultValue",
};

// After - Fix by using destructuring with default values
const MyComponent: FC<MyComponentProps> = (props) => {
  const { someValue = "defaultValue", ...rest } = props;
  // ...
};
```

#### 3. Missing Styled-components Types

Some types that were exported in styled-components v5 are not exported in v6. For example, `ThemedStyledProps` and `FlattenSimpleInterpolation` are no longer exported directly. Update imports and use the types that are available:

```tsx
// Before
import {
  ThemedStyledProps,
  FlattenSimpleInterpolation,
} from "styled-components";

// After
// Either define these types locally or use alternative approaches that don't require them
```

#### 4. Theme Property Updates

Some theme properties might have been renamed or restructured. Check the theme type definitions and update references:

```tsx
// Before
theme.button.someProperty;

// After - if the property was renamed
theme.buttons.someProperty;
```

By systematically applying these patterns throughout the codebase, we can address many of the TypeScript errors that have arisen from the upgrade process.
