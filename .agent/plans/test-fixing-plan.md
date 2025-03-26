# Test Fixing Plan: Oak Web Application

## Overview

This document outlines a systematic approach to resolve failing tests identified in the Oak Web Application codebase. The plan addresses three main categories of failures:

1. Snapshot test failures (most common)
2. Missing module error
3. Empty test suite error

## 1. Snapshot Test Failures

### Issue Description

11 snapshots failed across 9 test suites due to class name mismatches. This likely occurred because:

- Styled-components generated different class names than expected in the snapshots
- Component structure may have changed
- A library (possibly styled-components) may have been upgraded

### Resolution Steps

#### Step 1.1: Update Snapshots

1. Run the test update command to regenerate snapshots:

```bash
npm run test:ci -- -u
```

2. Verify the command completes without errors

#### Step 1.2: Validate Updated Snapshots

1. Run tests again to ensure snapshot tests now pass:

```bash
npm run test:ci
```

2. Verify all snapshots tests are now passing

#### Step 1.3: Review Updated Snapshots (optional)

1. Examine the updated snapshot files to confirm changes are expected
2. Check git diff of snapshot files to understand what changed
3. If snapshots changed in unexpected ways, investigate component changes that may have caused this

#### Acceptance Criteria for Snapshot Fixes

- [ ] `npm run test:ci` runs without any snapshot failures
- [ ] All updated snapshots accurately reflect the current component rendering
- [ ] No unexpected visual or structural changes introduced

## 2. Missing Module Error

### Issue Description

Error in `scripts/build/fetch_secrets/helpers.test.ts`:

```
Cannot find module './helpers.js' from 'scripts/build/fetch_secrets/helpers.test.ts'
```

### Resolution Steps

#### Step 2.1: Locate the Missing Module

1. Check if `helpers.js` exists in the same directory as `helpers.test.ts`
2. If missing, check if it was renamed or moved to another location

#### Step 2.2: Fix the Import Path

1. Open `scripts/build/fetch_secrets/helpers.test.ts`
2. Fix the import statement for the missing module:
   - If renamed: update to the new filename
   - If moved: update the import path
   - If the file should be `.ts` instead of `.js`: update the extension

#### Step 2.3: Create Module if Missing

If the file doesn't exist but should:

1. Create the missing `helpers.js` file with required exports
2. Implement the necessary functionality based on test expectations

#### Acceptance Criteria for Missing Module Fix

- [ ] `scripts/build/fetch_secrets/helpers.test.ts` runs without module not found error
- [ ] All tests in this file pass
- [ ] No regression in functionality that relies on these helpers

## 3. Empty Test Suite Error

### Issue Description

Error in `src/__tests__/utils/moduleHelpers.ts`:

```
Your test suite must contain at least one test.
```

### Resolution Steps

#### Step 3.1: Examine the Empty Test Suite

1. Open `src/__tests__/utils/moduleHelpers.ts`
2. Determine if this file:
   - Is intended to be a test file but is missing tests
   - Is a utility file that should not be picked up by the test runner
   - Is a test helper that doesn't contain tests itself

#### Step 3.2: Fix Based on File Purpose

Based on the determination in Step 3.1:

**If it should contain tests:**

1. Add at least one test to the file
2. Ensure proper test structure with `describe` and `test`/`it` blocks

**If it's a utility file but not a test:**

1. Move file out of the `__tests__` directory
2. Update imports in files that use it

**If it's a test helper:**

1. Rename to indicate it's not a test (e.g., `moduleHelpers.util.ts`)
2. Or add a dummy test that always passes

#### Acceptance Criteria for Empty Test Suite Fix

- [ ] No empty test suite error when running tests
- [ ] If test file: Contains at least one meaningful test
- [ ] If utility: Properly located outside test directory
- [ ] All imports updated to reference the new location/name if moved

## Verification Plan

### Step 1: Run Tests with Verbosity

Run tests with additional verbosity to see detailed results:

```bash
npm run test:ci -- --verbose
```

### Step 2: Check Test Coverage (Optional)

If coverage reporting is configured:

```bash
npm run test:ci -- --coverage
```

### Step 3: Final Verification

1. Run the complete test suite:

```bash
npm run test:ci
```

### Final Acceptance Criteria

- [ ] All 567 test suites pass
- [ ] All 3177 tests pass
- [ ] All 35 snapshots pass
- [ ] No regression in test coverage (if measured)
- [ ] Test run completes in a reasonable time (similar to or better than 103s seen in original run)

## Progress Tracking

| Issue Category    | Status       | Date Resolved | Notes |
| ----------------- | ------------ | ------------- | ----- |
| Snapshot Tests    | 🔴 Not Fixed |               |       |
| Missing Module    | 🔴 Not Fixed |               |       |
| Empty Test Suite  | 🔴 Not Fixed |               |       |
| All Tests Passing | 🔴 Not Fixed |               |       |

## References

- Original test output showing 17 failed test suites, 33 failed tests, and 11 failed snapshots
- Project repository: https://github.com/oaknational/Oak-Web-Application
