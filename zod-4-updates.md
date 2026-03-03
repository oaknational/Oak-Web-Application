# Zod 4 migration follow-up

Notes on every TypeScript fix needed after the upgrade, with before/after snippets and explicit file references.

## Unit data now exports `features`, `parent_programme_features`, `actions`

### Problem
Fixtures/tests omitted the new fields so TypeScript could no longer satisfy the schema.

```ts
// before
const unitData = [{ subject: "Biology", year: "11" }];
```

### Fix
Wrapped unit arrays with a helper that injects the required keys before spreading the rest.

```ts
const unitData = baseUnits.map((unit) => ({
  features: {},
  parent_programme_features: null,
  actions: {},
  ...unit,
}));
```

- [x] `src/node-lib/curriculum-api-2023/fixtures/curriculumUnits.fixture.ts`
- [x] `src/__tests__/pages/teachers/curriculum/[subjectPhaseSlug]/[tab].test.tsx`
- [x] `src/components/CurriculumComponents/CurricVisualiser/CurricVisualiser.stories.tsx`
- [x] `src/components/CurriculumComponents/CurricVisualiser/CurricVisualiser.test.tsx`
- [x] `src/components/CurriculumComponents/UnitsTab/UnitsTab.test.tsx`

## Quiz questions require an explicit `State`

### Problem
`State` became mandatory on quiz questions; fixtures only set `questionType`, causing hundreds of errors.

```ts
const quizQuestions = [{ questionId: 1, questionType: "match" }];
```

### Fix
Created a `withPublishedState` helper so every exported array automatically carries `State: "published"`.

```ts
const withPublishedState = (questions) =>
  questions.map((question) => ({ State: "published", ...question }));

export const quizQuestions = withPublishedState([...]);
```

- [x] `src/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture.ts`
- [x] All quiz component tests (`PupilQuiz`, `QuizMatchAnswer`, `QuizOrderAnswer`, etc.)

## Zod error shapes changed (`ZodSafeParseError` & `.issues`)

### Problem
Every reference to `SafeParseError` or `error.errors` broke under Zod 4.

```ts
const error = (result as SafeParseError<unknown>).error;
expect(error.errors[0]!.message).toBe("Required");
```

### Fix
Swapped in `ZodSafeParseError` and `.issues`, and updated shared helpers (`getParsedData`, `parseResults`) so downstream callers automatically use the new shape.

```ts
const error = (result as ZodSafeParseError<unknown>).error;
expect(error.issues[0]?.message).toBe("Required");
```

- [x] `src/common-lib/forms/formToZod.test.ts`
- [x] `src/components/CurriculumComponents/CurriculumDownloadView/schema.test.ts`
- [x] `src/browser-lib/hubspot/forms/hubspotSubmitForm.ts`
- [x] `src/pages/api/hubspot/contact-lookup/index.ts`
- [x] `src/components/SharedComponents/helpers/downloadAndShareHelpers/getParsedData.ts`
- [x] `src/node-lib/cms/sanity-client/parseResults.ts`
- [x] Lesson download query tests (main + teacher preview)

## Accepting the richer `Actions` shape

### Problem
The generated `Actions` now exposes camel and snake variants, but our type only allowed the old narrow subset.

```ts
const showRiskAssessmentBanner = !!actions?.isPePractical; // `isPePractical` missing
```

### Fix
Extended the `Actions` type with optional camel/snake fields and introduced local `lessonActions` aliases where needed.

```ts
export type Actions = z.infer<typeof actionsSchema> & {
  displayExpiringBanner?: boolean;
  display_expiring_banner?: boolean;
  // …
};
const lessonActions = actions ?? null;
const showRiskAssessmentBanner = !!lessonActions?.isPePractical;
```

- [x] `src/node-lib/curriculum-api-2023/shared.schema.ts`
- [x] `src/components/TeacherViews/LessonMedia/LessonMedia.view.tsx`
- [x] `src/components/TeacherViews/LessonOverview/LessonOverview.view.tsx`
- [x] `src/components/TeacherViews/LessonDownloads.view.tsx`
- [x] `src/components/TeacherComponents/UnitList/UnitListLegacyBanner.tsx`
- [x] `src/components/TeacherComponents/LessonOverviewCreateWithAiDropdown/teachingMaterialsConfig.ts`

## Enum helpers need typed guard values

### Problem
`examboardSlugs.options` is now a readonly tuple; comparing it to `string | null` failed.

```ts
examboardSlugs.options.includes(examboardSlug ?? "");
```

### Fix
Captured the tuple as `readonly ProgrammeFields["examboard_slug"][]` and cast the nullable input before comparing.

```ts
const options = examboardSlugs.options as readonly ProgrammeFields["examboard_slug"][];
return options.includes((examboardSlug ?? "") as ProgrammeFields["examboard_slug"]);
```

- [x] `src/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker.tsx`
- [x] `src/pages-helpers/pupil/options-pages/options-pages-helpers.ts`
- [x] `src/pages-helpers/curriculum/xlsx/helper.ts`

## Fixture shape drift (lesson data & copyright)

### Problem
Inline lesson objects no longer met the schema (missing asset IDs, timestamps), and copyright tests still used camel-case when the API sends snake-case.

```ts
lesson_data: {
  lesson_id: 1,
  title: "lesson-title",
  // missing asset ids, created_at…
};
```

### Fix
Replaced inline objects with `lessonDataFixture({ overrides })`, and when asserting copyright we now feed snake-case arrays through the same camel-case conversion used in production.

```ts
lesson_data: lessonDataFixture({
  overrides: { lesson_release_date: null, updated_at: "..."},
});
const copyrightSnake =
  [{ copyright_info: "info" }] as unknown as Record<string, never>[];
```

- [x] `src/node-lib/curriculum-api-2023/queries/lessonDownloads/constructCanonicalLessonDownloads.test.ts`
- [x] `src/node-lib/curriculum-api-2023/queries/lessonListing/lessonListing.query.test.ts`
- [x] `src/node-lib/curriculum-api-2023/queries/teacherPreviewLessonListing/teacherPreviewLessonListing.query.test.ts`
- [x] `src/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.query.test.ts`
- [x] `src/node-lib/curriculum-api-2023/queries/teacherPreviewLessonDownload/teacherPreviewLessonDownload.query.test.ts`
- [x] `src/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.query.test.ts`

## `legacyCopyrightContent` is camel-case

### Problem
The schema returns `{ copyrightInfo }`, but we were forwarding the raw snake-case payload.

```ts
return content; // incorrect
```

### Fix
Mapped each entry to the camel-case structure and defaulted missing values to empty strings.

```ts
return content.map((item) => ({
  copyrightInfo: item.copyrightInfo ?? "",
}));
```

- [x] `src/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.query.ts`
- [x] Lesson download + teacher preview tests
- [x] `src/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.query.ts`
- [x] `src/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.query.test.ts`

## `zod-to-camel-case` typings & downstream usage

### Problem
TypeScript couldn't resolve the module types, and the helper returned a different `safeParse` signature after the upgrade.

```ts
import zodToCamelCase from "zod-to-camel-case";
return zodToCamelCase(schema); // TS: no call signatures
```

### Fix
Added `types/zod-to-camel-case.d.ts`, imported the concrete build entry, and cast the helper’s result back to `z.ZodType`.

```ts
import _zodToCamelCase from "zod-to-camel-case/dist/npm/index";
return _zodToCamelCase(schema) as unknown as z.ZodType;
```

- [x] `types/zod-to-camel-case.d.ts`
- [x] `src/node-lib/curriculum-api-2023/helpers/zodToCamelCase.ts`
- [x] `src/node-lib/pupil-api/types/lessonAttempt.ts`

## Hubspot error payload

### Problem
Hubspot’s API now returns `errors`, but we were still indexing `issues`.

```ts
const isInvalidEmail = hubspotError.issues.some((err) => err.errorType === "INVALID_EMAIL");
```

### Fix
Swapped the code and tests to look at `hubspotError.errors`.

```ts
const isInvalidEmail = hubspotError.errors.some((err) => err.errorType === "INVALID_EMAIL");
```

- [x] `src/browser-lib/hubspot/forms/hubspotSubmitForm.ts`

## Subject/exam board guards

### Problem
Comparing `string | null` values against readonly tuples failed under `strict`.

```ts
examboardSlugs.options.includes(examboardSlug ?? "");
```

### Fix
Captured the tuple as a typed constant and cast the nullable input before using `includes`.

```ts
const options = examboardSlugs.options as readonly ProgrammeFields["examboard_slug"][];
return options.includes((examboardSlug ?? "") as ProgrammeFields["examboard_slug"]);
```

- [x] `src/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker.tsx`
- [x] `src/pages-helpers/pupil/options-pages/options-pages-helpers.ts`

## Generated SDK import drift

### Problem
`lessonOverview.query.ts` still referenced `Published_Mv_Synthetic_Unitvariants_With_Lesson_Ids_By_Keystage_16_0_0_Bool_Exp`, which no longer exists in the updated SDK.

```ts
import { …, Published_Mv_Synthetic_Unitvariants_With_Lesson_Ids_By_Keystage_16_0_0_Bool_Exp } from "../../generated/sdk";
```

### Fix
Swapped the import and downstream usage to the `18_0_0` alias exported by the new SDK.

```ts
import { …, Published_Mv_Synthetic_Unitvariants_With_Lesson_Ids_By_Keystage_18_0_0_Bool_Exp } from "../../generated/sdk";
```

- [x] `src/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.query.ts`

## Jest fails to parse ESM-only dependencies from `oak-curriculum-schema` v2

### Problem
After upgrading to `@oaknational/oak-curriculum-schema` v2, all 436 test suites failed with:

```
SyntaxError: Cannot use import statement outside a module

  > 1 | import camelcaseKeys from 'camelcase-keys';
```

`oak-curriculum-schema` v2 depends on `camelcase-keys` (v9+) which is ESM-only. That package in turn pulls in several other ESM-only transitive dependencies: `camelcase`, `map-obj`, `type-fest`, and `quick-lru`. The schema also depends on `zod-to-camel-case` which is ESM-only.

By default, `next/jest` tells Jest to **skip** transforming everything inside `node_modules` (except a small allowlist like `geist`). Since these ESM packages aren't transformed, Jest's CommonJS runtime chokes on `import` statements.

### Fix
Modified `jest.config.js` to intercept the `transformIgnorePatterns` generated by `next/jest` and inject the ESM packages into the negative lookahead so Jest will transform them.

```js
// oak-curriculum-schema v2 bundles ESM-only nested dependencies (camelcase-keys,
// camelcase, map-obj, type-fest). Jest must transform the whole package tree.
const esmPackages =
  "@oaknational/oak-curriculum-schema|camelcase-keys|camelcase|map-obj|type-fest|quick-lru|zod-to-camel-case";
const esmPackagesPnpm =
  "@oaknational\\+oak-curriculum-schema|camelcase-keys|camelcase|map-obj|type-fest|quick-lru|zod-to-camel-case";

const jestConfig = createJestConfig(customJestConfig);

module.exports = async () => {
  const config = await jestConfig();
  config.transformIgnorePatterns = config.transformIgnorePatterns.map(
    (pattern) =>
      pattern
        .replace("geist)", `geist|${esmPackages})`)
        .replace("geist)", `geist|${esmPackagesPnpm})`),
  );
  return config;
};
```

#### Why `@oaknational/oak-curriculum-schema` itself must be in the list
Some of the ESM deps (e.g. `camelcase-keys`) are installed as **nested** `node_modules` inside `oak-curriculum-schema`. The transform ignore pattern matches the path `node_modules/@oaknational/oak-curriculum-schema/node_modules/camelcase-keys/`, so the parent package must also be allowlisted for the nested path to match.

#### Why two pattern variables (`esmPackages` / `esmPackagesPnpm`)
`next/jest` generates two `transformIgnorePatterns` entries — one for standard `node_modules` layouts and one for pnpm-style (`@oaknational+oak-curriculum-schema`). Both need the packages injected.

#### How to find new ESM deps if this breaks again
If a new transitive ESM dependency appears in future, it will produce the same `SyntaxError: Cannot use import statement outside a module` error pointing at the offending package. Add its name to both `esmPackages` and `esmPackagesPnpm` in `jest.config.js`.

- [x] `jest.config.js`

## Zod 4 error issue fields removed (`error`, `received`)

### Problem
Zod 3 error issues contained `error` and `received` fields (e.g. `{ code: "invalid_type", expected: "number", received: "undefined", error: "Required" }`). Zod 4 drops `error` and `received` and changes some field values, so tests that asserted the exact issue shape failed.

```ts
// before — asserting exact Zod 3 issue shape
expect(result.error.issues[0]).toEqual({
  code: "invalid_type",
  expected: "number",
  received: "undefined",
  path: ["isLegacy"],
  error: "Required",
});
```

### Fix
Use `expect.objectContaining()` to match only the stable fields (`code`, `expected`, `path`).

```ts
// after
expect(result.error.issues[0]).toEqual(
  expect.objectContaining({
    code: "invalid_type",
    expected: "number",
    path: ["isLegacy"],
  }),
);
```

- [x] `src/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.query.test.ts`
- [x] `src/node-lib/curriculum-api-2023/queries/teacherPreviewLessonDownload/teacherPreviewLessonDownload.query.test.ts`

## Zod 4 error message wording changed

### Problem
Zod 4 changed the wording of built-in error messages. For example:
- `"Expected boolean, received string"` → `"Invalid input: expected boolean, received string"`
- `"Expected string, received number"` → `"Invalid input: expected string, received number"`
- `"String must contain exactly 10 character(s)"` → `"Too big: expected string to have <=10 characters"`

Tests using exact string matches on these messages broke.

```ts
// before
expect(() => parse(value)).toThrowError("Expected boolean, received string");
expect(() => parse(value)).toThrow("String must contain exactly 10 character(s)");
```

### Fix
Use case-insensitive regex matchers that capture the key part of the message without depending on the exact phrasing.

```ts
// after
expect(() => parse(value)).toThrowError(/expected boolean/i);
expect(() => parse(value)).toThrow(/10 characters/i);
```

- [x] `src/node-lib/cms/sanity-client/parseResults.test.ts`
- [x] `src/utils/localstorage.test.ts`
- [x] `src/browser-lib/pupil-client/client.test.ts`
- [x] `src/components/CurriculumComponents/CurriculumDownloadView/helper.test.ts`

## Zod 4 codemod can drop `.email()` validation

### Problem
The automated Zod 3→4 codemod converted `z.string().email({ message: "..." })` into `z.string()`, silently dropping the `.email()` call. This meant email fields accepted any string without format validation.

```ts
// before (Zod 3)
export const emailSchema = z.string().email({ message: ERRORS.email }).optional().or(z.literal(""));

// after codemod (broken — no email validation!)
export const emailSchema = z.string().optional().or(z.literal(""));
```

### Fix
Manually restore the `.email()` call after running the codemod. Audit all schemas that had `.email()` in the Zod 3 version.

```ts
// fixed
export const emailSchema = z.string().email({ message: ERRORS.email }).optional().or(z.literal(""));
```

- [x] `src/components/CurriculumComponents/CurriculumDownloadView/schema.ts`

## `z.email().min(1)` validation order changed

### Problem
In Zod 4, `z.email()` creates a string schema with email format validation built-in. When chained with `.min(1)`, the email format check runs **before** the min-length check. This means an empty string (`""`) now fails with the email format error ("Enter a valid email") instead of the min-length error ("Enter an email").

```ts
// Zod 4 codemod output — email format check runs first
email: z.email({ error: "Enter a valid email" }).min(1, { error: "Enter an email" }),
// Empty string → "Enter a valid email" (wrong — should say "Enter an email")
```

### Fix
Use `z.string().min(1).email()` so the min-length check runs first for empty strings.

```ts
// fixed — min check runs before email format check
email: z.string().min(1, { error: "Enter an email" }).email({ error: "Enter a valid email" }),
// Empty string → "Enter an email" ✓
// "not-an-email" → "Enter a valid email" ✓
```

This also applies anywhere `z.email()` was used as a base type. The same principle holds for other Zod 4 "convenience" constructors like `z.url()` — the built-in format check runs before any chained checks.

- [x] `src/components/GenericPagesComponents/NewsletterForm/NewsletterForm.tsx`
- [x] `src/common-lib/forms/formToZod.test.ts`

## `zod-to-camel-case` requires `bidirectional: true` for camelCase input

### Problem
After the Zod 4 upgrade, `zod-to-camel-case` in its default (non-bidirectional) mode expects **snake_case** input and converts it to camelCase during parsing. If the incoming data already uses camelCase keys (as our API responses do after transformation), parsing silently drops unrecognised keys or fails validation.

```ts
// before — only accepts snake_case input
export const zodToCamelCase = <T extends z.ZodObject<z.ZodRawShape>>(schema: T): z.ZodType => {
  return oakZodToCamelCase(schema) as unknown as z.ZodType;
};
```

### Fix
Pass `{ bidirectional: true }` so both snake_case and camelCase input are accepted.

```ts
// after — accepts both input formats
export const zodToCamelCase = <T extends z.ZodObject<z.ZodRawShape>>(schema: T): z.ZodType => {
  return oakZodToCamelCase(schema, { bidirectional: true }) as unknown as z.ZodType;
};
```

- [x] `src/node-lib/curriculum-api-2023/helpers/zodToCamelCase.ts`
- [x] `src/node-lib/curriculum-api-2023/helpers/zodToCamelCase.test.ts`

## `structuredClone` not available in Jest (OpenAI `zodResponseFormat`)

### Problem
OpenAI SDK's `zodResponseFormat` helper internally calls `structuredClone`, which is not available in the Jest/jsdom test environment. Tests that import modules using `zodResponseFormat` fail with:

```
ReferenceError: structuredClone is not defined
```

### Fix
Mock the `openai/helpers/zod` module in affected test files.

```ts
jest.mock("openai/helpers/zod", () => ({
  zodResponseFormat: jest.fn(() => ({ type: "json_schema" })),
}));
```

- [x] `src/context/Search/ai/callModel.test.ts`
- [x] `src/__tests__/pages/api/search/intent.test.ts`

## ZodError exact constructor comparison breaks

### Problem
Zod 4 changed the property serialisation order of `ZodError`. Tests that compared against `new ZodError([{ code, message, path }])` failed because the actual error has properties in a different order (e.g. `{ code, path, message }` vs `{ code, message, path }`).

```ts
// before — exact constructor match, relies on property ordering
expect(() => parse(data)).toThrow(
  new ZodError([{ code: "custom", message: "Please select the ways Oak can support you", path: ["root"] }]),
);
```

### Fix
Match on the error message string instead of constructing an exact `ZodError` instance.

```ts
// after
expect(() => parse(data)).toThrow("Please select the ways Oak can support you");
```

- [x] `src/components/TeacherComponents/OnboardingForm/OnboardingForm.schema.test.ts`

## `@hookform/resolvers/zod` is incompatible with Zod 4

### Problem
The official `@hookform/resolvers/zod` resolver relies on Zod 3 internals:
- `isZodError` checks `error?.errors` (Zod 3 used `.errors`, Zod 4 uses `.issues`)
- `parseErrorSchema` reads `error.errors` and `unionErrors` to flatten union branch errors
- As a result, forms silently swallow all validation errors — the resolver never detects that validation failed

Additionally, `@hookform/resolvers/standard-schema` (the Standard Schema adapter) works for simple schemas but fails for **union schemas**. Zod 4 union errors nest branch errors in an `errors` array, and the Standard Schema adapter's `getDotPath()` cannot resolve paths from this nested structure, returning empty errors.

```ts
// before — uses @hookform/resolvers/zod (Zod 3 only)
import { zodResolver } from "@hookform/resolvers/zod";

const { formState } = useForm<FormProps>({
  resolver: zodResolver(schema),
});
// formState.errors is always {} — validation errors are lost
```

### Fix
Create a custom `zodResolver` at `src/utils/zodResolver.ts` that:
1. Calls `schema.safeParseAsync(values)` directly
2. Reads `.issues` (Zod 4) instead of `.errors` (Zod 3)
3. Flattens union errors by iterating all branches of `invalid_union` issues (each branch's errors are in `issue.errors[][]`)
4. Converts flattened issues to `FieldError` records and passes them through `toNestErrors` from `@hookform/resolvers`

```ts
// src/utils/zodResolver.ts
import { toNestErrors } from "@hookform/resolvers";
import { FieldError, FieldErrors, FieldValues, Resolver } from "react-hook-form";
import type { z } from "zod";

interface ZodIssue {
  code: string;
  message: string;
  path: (string | number)[];
  errors?: ZodIssue[][];
}

function flattenIssues(issues: ZodIssue[]): ZodIssue[] {
  const flat: ZodIssue[] = [];
  for (const issue of issues) {
    if (issue.code === "invalid_union" && issue.errors) {
      for (const branch of issue.errors) {
        flat.push(...flattenIssues(branch as ZodIssue[]));
      }
    } else {
      flat.push(issue);
    }
  }
  return flat;
}

export function zodResolver<TFieldValues extends FieldValues>(
  schema: z.ZodType,
): Resolver<TFieldValues> {
  return async (values, _, options) => {
    const result = await schema.safeParseAsync(values);
    if (result.success) {
      return { errors: {} as FieldErrors, values: result.data as TFieldValues };
    }
    const errors: Record<string, FieldError> = {};
    for (const issue of flattenIssues(result.error.issues as unknown as ZodIssue[])) {
      const path = issue.path.join(".");
      if (path && !errors[path]) {
        errors[path] = { message: issue.message, type: issue.code };
      }
    }
    return { values: {}, errors: toNestErrors(errors, options) };
  };
}
```

Update all form components to import from the custom resolver:

```ts
// after
import { zodResolver } from "@/utils/zodResolver";
```

**Important**: The generic signature must be `zodResolver<TFieldValues>(schema: z.ZodType)` — NOT `zodResolver(schema: z.ZodType<TFieldValues>)`. Many form components define `FormProps` as `SchemaOutput & { onSubmit: ... }`, so the form's type is a superset of the schema's output. Using `z.ZodType<TFieldValues>` would force TypeScript to infer `TFieldValues` from the schema, causing a type mismatch with the broader form props type.

- [x] `src/utils/zodResolver.ts` (new file)
- [x] `src/components/TeacherViews/Onboarding/RoleSelection/RoleSelection.view.tsx`
- [x] `src/components/TeacherViews/Onboarding/SchoolSelection/SchoolSelection.view.tsx`
- [x] `src/components/TeacherViews/Onboarding/Onboarding.view.tsx`
- [x] `src/components/TeacherViews/Onboarding/HowCanOakSupport/HowCanOakSupport.view.tsx`
- [x] `src/components/GenericPagesComponents/NewsletterForm/NewsletterForm.tsx`
- [x] `src/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormState.tsx`

---

With these changes in place, all 794 test suites pass under Zod 4. Start by checking these same hot spots (fixtures, `Actions`, quiz state, Zod errors, form resolvers, validation ordering) if we upgrade again.
