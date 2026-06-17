# Testing Improvement Phase 1.0: Prepare - Execution Plan

## Overview

Phase 1.0 focuses on creating a comprehensive inventory of the testing landscape across the Oak Web Application codebase. This is a shallow, broad scan to map what exists and where, enabling targeted deep analysis in Phase 1.1.

## Success Criteria

- [ ] Complete inventory of all test files and their locations, written to a markdown file
- [ ] Map of code organization patterns across packages, written to a markdown file
- [ ] Catalog of testing tools and configurations in use, written to a markdown file
- [ ] Foundation data collected for Phase 1.1 deep audit, written to a markdown file

All written to .agent/plans/testing-improvement-phase-1-0-report.md

## Execution Steps

### Step 0: Prepare

Read .agent/architectural-overview.md . Do not assume it is correct. Verify it is correct by reading the codebase. If you find any errors, or important new information, update the file. The main goal of this plan is to understand and report on the current state of the codebase in .agent/plans/testing-improvement-phase-1-0-report.md, but updating .agent/architectural-overview.md is a useful by-product of this process.

### Step 1: Map Repository Structure

**Action**: Create a comprehensive map of the repository structure

**Measurable Outcomes**:

- [ ] List of all packages/modules in the repository
- [ ] Directory structure documented
- [ ] Identification of monorepo vs single package structure
- [ ] Count of total source files vs test files per package

**Commands**:

```bash
# Map top-level structure
ls -la | grep "^d" | awk '{print $9}' | grep -v "^\."

# Find all package.json files to identify packages
find . -name "package.json" -not -path "*/node_modules/*" | sort

# Count source vs test files by directory
find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | cut -d'/' -f2 | sort | uniq -c
```

### Step 2: Inventory Test Files

**Action**: Create detailed inventory of all test files

**Data to Collect**:

- Test file locations and naming patterns
- Test file types (unit, integration, e2e, snapshot)
- Test framework indicators (Jest, Vitest, Cypress, etc.)
- File count by type and location

**Commands**:

```bash
# Find all test files
find . -name "*.test.*" -o -name "*.spec.*" | grep -v node_modules | sort > test-inventory.txt

# Categorize by file extension
find . -name "*.test.*" -o -name "*.spec.*" | grep -v node_modules | sed 's/.*\.//' | sort | uniq -c

# Find test directories
find . -type d -name "__tests__" -o -name "tests" -o -name "test" | grep -v node_modules
```

**Measurable Outcomes**:

- [ ] Complete list of test files with paths
- [ ] Test file naming conventions documented
- [ ] Test directory patterns identified
- [ ] File type distribution recorded

### Step 3: Inventory Non-Test Source Files

**Action**: Map source files that should have tests

**Data to Collect**:

- Components (*.tsx files in components/)
- Hooks (use* files or hooks/)
- Utilities/helpers
- API routes
- Services/modules
- Pure functions vs side-effect code

**Commands**:

```bash
# Find React components
find . -name "*.tsx" -not -path "*/node_modules/*" -not -name "*.test.*" -not -name "*.spec.*" | grep -E "(components?|pages?)" | sort

# Find custom hooks
find . -name "use*.ts" -o -name "use*.tsx" | grep -v node_modules | grep -v test

# Find API routes
find . -path "*/api/*" -name "*.ts" -not -name "*.test.*" | sort
```

**Measurable Outcomes**:

- [ ] Count of components with/without tests
- [ ] Count of hooks with/without tests
- [ ] Count of API routes with/without tests
- [ ] Identification of utility/helper modules

### Step 4: Testing Infrastructure Scan

**Action**: Inventory testing configurations and tools

**Data to Collect**:

- Test runner configurations (jest.config.*, vitest.config.*)
- Test scripts in package.json files
- CI/CD test commands
- Testing dependencies
- Coverage configurations
- Linting rules for tests

**Commands**:

```bash
# Find test configurations
find . -name "jest.config.*" -o -name "vitest.config.*" -o -name ".jestrc.*" | grep -v node_modules

# Extract test scripts from package.json files
find . -name "package.json" -not -path "*/node_modules/*" | xargs grep -l '"test"'

# Find test setup files
find . -name "setupTests.*" -o -name "test-utils.*" | grep -v node_modules
```

**Measurable Outcomes**:

- [ ] List of all test configurations
- [ ] Test script variations documented
- [ ] Testing tool versions recorded
- [ ] Shared test utilities located

### Step 5: Code Organization Patterns

**Action**: Document how code is organized across packages

**Data to Collect**:

- Package/module boundaries
- Colocation patterns (tests next to source vs separate)
- Naming conventions
- Directory structures
- Monorepo tooling (if applicable)

**Analysis Points**:

```bash
# Analyze test colocation
for dir in $(find . -type d -name "src" | grep -v node_modules); do
  echo "Package: $dir"
  echo "  Source files: $(find $dir -name "*.ts" -o -name "*.tsx" | grep -v test | wc -l)"
  echo "  Test files: $(find $dir -name "*.test.*" -o -name "*.spec.*" | wc -l)"
done
```

**Measurable Outcomes**:

- [ ] Organization patterns by package documented
- [ ] Colocation vs separation patterns identified
- [ ] Naming convention variations catalogued
- [ ] Package boundaries mapped

### Step 6: Create Testing Landscape Report

**Action**: Compile all findings into a comprehensive inventory report

**Report Sections**:

1. **Repository Overview**
   - Package structure
   - Total file counts
   - Technology stack

2. **Test File Inventory**
   - Total test files by type
   - Distribution across packages
   - Naming patterns

3. **Coverage Gaps**
   - Components without tests
   - Hooks without tests
   - API routes without tests
   - Utilities without tests

4. **Infrastructure Inventory**
   - Testing tools in use
   - Configuration files
   - CI/CD integration

5. **Organization Patterns**
   - How tests are organized
   - Consistency across packages
   - Identified patterns

**Measurable Outcomes**:

- [ ] Complete inventory report
- [ ] Data tables and visualizations
- [ ] Input ready for Phase 1.1 planning

### Step 7: Prepare Phase 1.1 Input

**Action**: Transform inventory data into actionable input for Phase 1.1

**Deliverables**:

1. **Priority Package List**
   - Ranked by size, complexity, and coverage gaps
   - Recommended audit order

2. **Focus Area Recommendations**
   - Which types of files need most attention
   - Where to find representative examples

3. **Resource Requirements**
   - Time estimates based on inventory
   - Tools needed for deep audit
   - Team expertise required

**Phase 1.1 Readiness Checklist**:

- [ ] Complete file inventory available
- [ ] Organization patterns documented
- [ ] Testing infrastructure mapped
- [ ] Coverage gap areas identified
- [ ] Package priorities established

**Measurable Outcomes**:

- [ ] Phase 1.1 scope document
- [ ] Prioritized package list
- [ ] Resource requirements estimated

## Key Differences from Phase 1

**Phase 1.0 (This Plan)**:

- **What**: Inventory and discovery only
- **How**: Automated scanning and counting
- **Depth**: Shallow - file names and locations only
- **Output**: Data and maps

**Phase 1.1 (Next Phase)**:

- **What**: Quality assessment and deep analysis
- **How**: Manual code review and evaluation
- **Depth**: Deep - code structure and patterns
- **Output**: Quality findings and recommendations

## Definition of Done

- [ ] Complete inventory of all test files
- [ ] Complete inventory of all source files needing tests
- [ ] Testing infrastructure fully mapped
- [ ] Organization patterns documented
- [ ] Testing landscape report delivered
- [ ] Phase 1.1 scope and priorities defined
- [ ] All data collected in reusable format
