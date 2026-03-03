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

---

With these changes in place, `tsc -p tsconfig.json` succeeds under Zod 4. Start by checking these same hot spots (fixtures, `Actions`, quiz state, Zod errors) if we upgrade again.***
