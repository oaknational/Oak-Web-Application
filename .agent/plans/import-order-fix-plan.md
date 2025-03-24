# Import Ordering Fix Plan

## Current State Analysis

From running `npm run lint`, I've identified a large number of import order violations across the codebase. The ESLint configuration in `eslint.config.ts` defines the following import order rule:

```javascript
"import/order": [
  "error",
  {
    "newlines-between": "always",
    groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
    alphabetize: { order: "asc", caseInsensitive: true },
    warnOnUnassignedImports: true,
  },
],
```

This rule requires:

1. Imports must be grouped by type (builtin → external → internal → parent → sibling → index)
2. A newline must separate each group
3. Within each group, imports must be alphabetized (case-insensitive)
4. Unassigned imports will trigger a warning

## SMART Goals

### Specific

The plan targets fixing import order violations according to the ESLint rule, ensuring:

- Correct grouping of imports
- Proper newline separation
- Alphabetical ordering within groups
- Type import preservation

### Measurable

Success metrics:

1. Number of import order violations reduced to 0
2. All files pass ESLint import order checks
3. Each file's imports follow the correct grouping and ordering
4. Zero regressions in functionality

### Achievable

The plan breaks down the work into manageable chunks with clear success criteria for each phase.

### Relevant

The plan aligns with:

1. Code quality standards
2. Team's ESLint configuration
3. Project's TypeScript usage
4. Existing codebase structure

### Time-bound

Total duration: 5 days

- Day 1: Infrastructure setup
- Days 2-4: Directory-by-directory fixes
- Day 5: Verification and documentation

## Implementation Plan

### Phase 1: Core Infrastructure (Day 1)

#### 1. Automated Bulk Fix

We've already run ESLint's `--fix` option, which fixed some issues but not all of them. We'll build on this foundation.

#### 2. Custom Import Order Fixer Script

We've developed a specialized TypeScript script (`.agent/scripts/fix-type-imports.ts`) that:

- Properly parses TypeScript/JavaScript files
- Categorizes imports according to ESLint rules
- Preserves `type` imports (which ESLint's --fix was stripping)
- Orders imports correctly by group
- Adds proper newlines between groups
- Verifies fixed files with ESLint to ensure compliance

#### 3. Test Suite Development

Create comprehensive test suite for import ordering:

- Test cases for each import group
- Test cases for edge cases
- Success metric: All test cases pass

### Phase 2: Directory-by-Directory Fix (Days 2-4)

Process directories in order of complexity:

#### 1. Core Utilities (Day 2)

```bash
# Core utility libraries
npx tsx .agent/scripts/fix-type-imports.ts src/utils src/hooks
```

Success metric: All files in these directories pass import order checks

#### 2. Components (Day 3)

```bash
# Shared components
npx tsx .agent/scripts/fix-type-imports.ts src/components/SharedComponents
# Context providers
npx tsx .agent/scripts/fix-type-imports.ts src/context
```

Success metric: All files in these directories pass import order checks

#### 3. API and Data Layer (Day 4)

```bash
# API related code
npx tsx .agent/scripts/fix-type-imports.ts src/node-lib
# Common libraries
npx tsx .agent/scripts/fix-type-imports.ts src/common-lib
```

Success metric: All files in these directories pass import order checks

### Phase 3: Verification and Documentation (Day 5)

#### 1. Full Codebase Verification

- Run ESLint on all files
- Success metric: Zero import order violations

#### 2. Documentation Updates

- Add import order guidelines to README
- Document common patterns
- Success metric: Documentation is clear and complete

## Batch Processing Strategy

To avoid overwhelming the system, process directories in batches:

1. Start with smaller directories first to verify behavior
2. Move to larger directories after confirming success
3. Use the batch size parameter (default: 50) to control processing speed
4. For very large directories, consider running by subdirectory instead of all at once

## Verification Process

After each batch of fixes:

1. Run `git status` to see which files were modified
2. Randomly check a few files to ensure imports were ordered correctly
3. Run ESLint on a sample of the fixed files to verify no import/order issues remain
4. Run tests to ensure no regressions

## Problematic Files Handling

If some files still have issues after running the script:

1. Run ESLint on the file to identify specific issues
2. Manually inspect the file to understand why the script didn't fix it
3. Consider manually fixing edge cases that the script can't handle

## Running the Script

### Basic Usage

```bash
npx tsx .agent/scripts/fix-type-imports.ts [filepath(s)]
```

### Example Commands

```bash
# Fix a single file
npx tsx .agent/scripts/fix-type-imports.ts src/components/ComponentName.tsx

# Fix a specific directory
npx tsx .agent/scripts/fix-type-imports.ts src/hooks

# Fix multiple directories
npx tsx .agent/scripts/fix-type-imports.ts src/hooks src/utils

# Fix all TypeScript files in a directory
npx tsx .agent/scripts/fix-type-imports.ts "src/components/**/*.tsx"
```

### Performance Considerations

- The script processes files in batches (default: 50 files per batch)
- For large directories, consider increasing the `BATCH_SIZE` in the script
- Running on specific subdirectories rather than the entire codebase at once is recommended
- The verification step uses ESLint and may take additional time

## Troubleshooting

If issues occur when running the script:

1. **Script hangs or crashes**: Try reducing the batch size or running on fewer files at once
2. **Import order issues remain**: Check if there are special cases in those files that need manual fixing
3. **Type imports are still being affected**: Verify if there are imports with unusual syntax

## Expected Outcome

When this effort is complete, we should have:

- All import order issues resolved across the codebase
- Consistent import ordering following the ESLint rules
- Preserved type imports
- Clear newline separation between import groups
- Alphabetized imports within each group
- Updated documentation and guidelines
- CI/CD integration for import order checks

This is a low-risk change affecting code style but not functionality. However, due to the large number of files being modified, careful testing and deployment monitoring are recommended.
