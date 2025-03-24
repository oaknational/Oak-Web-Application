# Import Order Fix Implementation Prompt

## Purpose and Scope

You are tasked with implementing the import order fix plan detailed in `.agent/plans/import-order-fix-plan.md`. This plan addresses ESLint import order violations across the codebase following specific ordering rules.

### How to use ESLint

ESLint is already installed and configured in the project. You can run it using `npm run lint` or `npm run lint -- --file <file-path>` or `npm run lint -- --dir <directory-path>`. If you need to know what commands are available, you can run `npm run lint -- --help`. Never, ever run Eslint directly, it must always be invoked via `npm run lint`, with or without arguments. The same goes for type checks and tests.

Pipe the linter output to a file so you can refer to it repeatedly without having to rerun the linter, only running the linter to verify fixes.

```bash
npm run lint &> lint.log
```

**IMPORTANT**: **ALWAYS VERIFY FIXES BY RUNNING ESLINT**, never assume the fixes are correct, never assume the lint.log file is up to date if you have modified the codebase since running the linter.

### In Scope

- Running the existing script `.agent/scripts/fix-type-imports.ts` on specified directories
- Verifying fixes using ESLint.
- Handling problematic files according to the plan
- Documenting progress and outcomes

### Out of Scope

- Modifying the fix script itself
- Changing ESLint rules or configuration
- Altering any non-import related code
- Making manual changes to the codebase, the script is the only manual intervention. If the script cannot fix a file, flag that to the user, and ask for assistance.
- Making any functional changes to the codebase

## Required Initial Actions

1. **READ THE PLAN FIRST**: Before taking any action, read the full plan at `.agent/plans/import-order-fix-plan.md`
2. **VERIFY UNDERSTANDING**: Summarize the plan's key components, including:
   - Import ordering rules
   - Implementation phases
   - Success criteria
   - Verification process
3. **CONFIRM TOOLS**: Verify the existence of the script at `.agent/scripts/fix-type-imports.ts`

## Implementation Guidelines

Always follow these guidelines:

1. **FOLLOW THE PHASES**: Strictly adhere to the phases outlined in the plan
2. **ONE DIRECTORY AT A TIME**: Process one directory at a time as specified in the plan
3. **VERIFY AFTER EACH STEP**: Always run verification after each batch of files
4. **DOCUMENT PROGRESS**: Track which directories have been processed and their outcomes
5. **REFER BACK TO THE PLAN**: Before each new phase or step, re-read the relevant section of the plan

## Phase-by-Phase Implementation

### Phase 1: Core Infrastructure Verification

1. Verify the script exists and understand its functionality
2. Check script parameters and options
3. Confirm the script handles type imports correctly
4. DO NOT modify the script - use it as provided

### Phase 2: Directory-by-Directory Fix

Follow these steps for EACH directory specified in the plan:

1. Run the script on the specified directory using the exact commands from the plan
2. After each directory:
   - Run ESLint to verify fixes
   - Check a sample of files to confirm correct ordering
   - Document any problematic files for later handling
3. DO NOT proceed to the next directory until the current one passes verification

### Phase 3: Verification and Documentation

1. Run final verification across the entire codebase
2. Document all fixes and any remaining issues
3. Update documentation as specified in the plan

## Guard Rails and Safety Measures

### STOP IMMEDIATELY if

- The script produces errors not related to import ordering
- You detect any changes to functional code
- More than 10% of files in a directory fail verification after running the script
- You encounter unexpected behavior not covered in the troubleshooting section

### Before running ANY command

- Double-check the command against the plan
- Verify you are targeting the correct directory
- Ensure you are not about to process too many files at once (follow batch size recommendations)

## Success Criteria and Measurement

Track success using these specific metrics:

1. **Per Directory Success**:

   - All files in the directory pass ESLint import order checks
   - No functional regressions in the directory's code
   - Clear documentation of any manual fixes required

2. **Overall Success**:
   - Zero ESLint import order violations across the codebase
   - All imports follow the correct grouping and ordering
   - Documentation is updated with guidelines
   - No negative impact on application functionality

### Measuring Progress

- After each directory, run: `npx eslint <directory-path> --rule 'import/order: error'`
- Count remaining violations and track reduction
- Document specific files that required manual intervention

## Handling Problematic Files

When encountering files that the script cannot fix:

1. Identify the specific import order issue using ESLint
2. Document the file path and specific issue
3. If it's one of these common cases, handle manually:
   - Multiple import statements for the same module
   - Imports with side effects
   - Dynamic imports
   - Import paths with special characters
4. For manual fixes, follow EXACTLY the import order rules in the plan
5. After manual fixes, verify with ESLint again

## Troubleshooting

If you encounter issues:

1. **Script Hangs or Crashes**:

   - Reduce batch size
   - Try running on a smaller subset of files
   - Check console output for specific errors

2. **Import Order Issues Remain**:

   - Check for special cases mentioned in the plan
   - Verify correct command syntax
   - Try running ESLint's fix option first, then the script

3. **Type Imports Being Affected**:
   - Document specific examples
   - Handle these files manually if needed

## Progress Tracking Template

Use this template to track progress:

```markdown
## Directory: [directory name]

- Command run: [exact command]
- Files processed: [number]
- Files fixed: [number]
- Files with remaining issues: [number]
- Specific issues encountered: [list]
- ESLint verification: [PASS/FAIL]
- Next steps: [actions needed]
```

## Final Reporting

When the task is complete, provide a final report with:

1. Summary of all directories processed
2. Total files fixed
3. Any remaining issues and recommendations
4. Verification that all success criteria have been met
5. Documentation updates made

## REMINDER: CHECK THE PLAN FREQUENTLY

Before taking ANY action, refer back to the relevant section of the plan. The plan is your primary source of truth. If something is unclear, re-read the plan before proceeding.

Remember: This is a code style change only. If you find yourself making or considering functional changes, STOP and reassess.
