# Prompt: Deep Codebase Scan and Analysis - Oak Web Application

**Objective:** Conduct a comprehensive, deep-dive analysis of the Oak Web Application codebase. This scan will build upon previous analyses, focusing on verifying adherence to the "Copilot instructions for Next.js projects" at a granular code level. The ultimate goal is to produce an updated, detailed project summary and a revised plan reflecting the deep scan activities.

**Agent:** AI Coding Assistant (GitHub Copilot or similar)

**Key Inputs:**

1. **Full Codebase Access:** Assume you have read access to the entire `/Users/jim/code/oak/Oak-Web-Application` directory.
2. **Copilot Instructions:** The "Copilot instructions for Next.js projects" (provided separately, ensure you have internalized these).
3. **Existing Plan File:** `/Users/jim/code/oak/Oak-Web-Application/.agent/plans/project-summary.plan.md`
4. **Existing Project Summary File:** `/Users/jim/code/oak/Oak-Web-Application/.agent/project-summary.md`

**Core Task Breakdown:**

**Phase 1: Contextual Understanding & Plan Refinement**

1. **Internalize Instructions:** Thoroughly review and ensure you understand all aspects of the "Copilot instructions for Next.js projects". This document is your primary guide for the deep scan.
2. **Review Existing Plan:** Read the current `.agent/plans/project-summary.plan.md`. Identify tasks previously marked as requiring full code access or further investigation.
3. **Review Existing Summary:** Read the current `.agent/project-summary.md`. Pay close attention to:
   - Limitations mentioned in previous scans.
   - Areas where findings were inferred due to lack of full code access.
   - Specific questions or points of clarification raised.
4. **Update the Plan (`.agent/plans/project-summary.plan.md`):**
   - Create a new section in the plan titled "Phase X: Deep Codebase Scan (Detailed Investigation)".
   - For each relevant section of the "Copilot instructions for Next.js projects" (especially sections 1, 2, 3, 4, 5, 6, and 9), define specific, actionable tasks for the deep scan. These tasks should aim to verify practices at the code level. Examples:
     - **Instruction 1 (Code Style & Size):**
       - "Scan a representative sample of 10-15 components/modules for actual file/function LOC. Document findings against the ~200/~40 LOC targets."
       - "Verify file naming conventions (`camelCase.ts[x]`) across `src/components`, `src/hooks`, `src/services`. Document any deviations from `camelCase` or `PascalCase` for component files."
       - "Assess the practical application of `readonly`/`Readonly<>` in type definitions and props across various modules (e.g., in `src/services`, `src/hooks`, `src/components`). Note prevalence and consistency, especially given ESLint rule status."
       - "Identify usage of `console.*` within application logic (outside of config files or designated logging modules). Compare with injected logger/Next.js logger guideline."
     - **Instruction 2 (Type Safety):**
       - "Search for any remaining `any` or `unknown` types not properly narrowed. Verify Zod/Valibot usage for parsing at trust boundaries."
       - "Examine usage of type assertions (`as Foo`). Check if they are at trust boundaries and include explanatory comments."
       - "Look for examples of Branded/Opaque types and Discriminated Unions. Assess if their use aligns with the guidelines."
     - **Instruction 4 (Imports, Exports):**
       - "Review a sample of `index.ts` files to confirm they only export the intended public API."
       - "Verify the non-usage of `/** @internal */` JSDoc and assess potential areas where it could be beneficial."
       - "Scan for relative paths reaching up more than two directory levels (`../../..`)."
     - **Instruction 5 (Data Fetching):**
       - "Attempt to locate a centralized HTTP client (e.g., `src/lib/http/HttpClient.ts`). If found, analyze its structure, error handling, and header management against guidelines."
       - "Check for direct use of Node-only APIs in client-side code."
     - **Instruction 6 (Documentation):**
       - "Sample 5-10 exported functions/classes/types from different modules. Verify JSDoc completeness (`@param`, `@returns`, `@throws`, `@example`). Document findings."
     - **Instruction 9 (Next.js Conventions):**
       - "Analyze how Server Components and Client Components (`'use client'`) are used in the App Router. Assess adherence to 'Server Components First'."
       - "Identify usage of `next/dynamic` for large client-side libraries."
   - For each task, specify:
     - The exact instruction it relates to.
     - Key files, directories, or search patterns to use.
     - What specific evidence to look for (compliance, deviation, patterns).

**Phase 2: Deep Codebase Scan & Analysis Execution**

1. **Execute Planned Tasks:** Systematically work through the deep scan tasks defined in the updated `.agent/plans/project-summary.plan.md`.
2. **Document Observations:** For each task, meticulously record:
   - Specific file paths and code snippets (briefly, if illustrative).
   - Confirmation of adherence to guidelines.
   - Detailed descriptions of any deviations, including potential reasons or impacts.
   - Patterns of good practice or areas needing improvement.
3. **Iterate if Necessary:** If initial findings from a task open up new, related areas of inquiry relevant to the "Copilot instructions," briefly note these as potential follow-ups in your internal thought process or as minor additions to the plan.

**Phase 3: Update Project Summary & Finalize**

1. **Integrate Findings into `.agent/project-summary.md`:**
   - Go through each subsection of "4. Deep Dive Findings".
   - Replace previous statements like "Cannot assess without full code" or "Full code needed" with concrete findings from your deep scan. Be specific and provide evidence or examples where appropriate.
   - If a guideline is met, state so with confidence. If there are deviations, describe them clearly and reference the "Copilot instructions."
2. **Refine Key Findings & Recommendations:**
   - Update the "Strengths" and "Areas for Potential Investigation & Clarification" based on the deeper insights.
   - Make recommendations more specific and actionable. For example, if file naming is inconsistent, recommend a specific convention and a strategy for alignment.
3. **Update Limitations:** Revise the "Limitations" section of the summary to accurately reflect what was and wasn't possible during this deep scan.
4. **LLM Self-Checks (Instruction 10):** Before finalizing, perform a self-review based on Section 10 of the "Copilot instructions":
   - **Lint/Type-Check (Conceptual):** Have your findings or proposed analyses introduced any conceptual conflicts with linting/typing best practices?
   - **Context:** Have you considered the broader context of modules when analyzing specific files?
   - **Tests (Conceptual):** Do your findings suggest areas where tests might be lacking or where TDD was not followed?
   - **Atomic Commits (Conceptual):** Frame your findings as if they were to be addressed by atomic changes.
   - **Docs:** Have you identified gaps in JSDoc or other documentation based on your scan?
   - **Performance/Security:** Note any obvious performance or security considerations that arose during the scan.

**Expected Outputs:**

1. **Updated Plan File:** `/Users/jim/code/oak/Oak-Web-Application/.agent/plans/project-summary.plan.md` with the new deep scan phase and detailed tasks.
2. **Updated Project Summary File:** `/Users/jim/code/oak/Oak-Web-Application/.agent/project-summary.md` with comprehensive findings from the deep scan, replacing previous estimations with verified details.

**Instruction for AI Agent:**

- Begin by updating the plan file as described in Phase 1.
- Then, proceed to update the project summary file based on your real execution of that plan.
- Clearly indicate when you are describing updates to the plan versus updates to the summary.
- Be methodical and thorough. Your goal is to provide the most accurate and detailed analysis possible based on the provided instructions and real codebase access.
