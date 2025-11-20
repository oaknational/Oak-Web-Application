Remove

 - sonarcloud
   - [-] Prefer using an optional chain (35)
   - [ ] 'Component' is deprecated. (14)
     - Ignore these!
   - [ ] Prefer `Date.now()` (9)
     - NEED TO PUSH `fix/sonarcloud-prefer-date-now`
   - [ ] Remove this redundant type alias (7)
   - [ ] Compare with `undefined` directly instead of using `typeof` (10)
   - [ ] Remove this commented out code. (6)
   - [ ] to the outer scope. (5)

   - [ ] `String.raw` should be used to avoid escaping `\`. (35)
   - [ ] Prefer `.some(…)` over `.find(…)`. (10)
   - [ ] Move this array "sort" operation (12)
   - [ ] Prefer using nullish (12)
   - [ ] Prefer `globalThis` (100)
   - [ ] Unexpected negated condition (75)
     - Might want to ignore this...
   - [ ] Extract this nested ternary operation (38)
   - [ ] Consider removing 'undefined' type or '?' (11)
   - [ ] PropType is defined but prop is never used (30)
   - [ ] Prefer `String#replaceAll()` over `String#replace()`. (8)
   - [ ] Handle this exception or don't catch it at all. (20)

----

   - [x] This assertion is unnecessary (18)
   - [ ] Prefer `Number.isNaN` over `isNaN`. (4)
   - [x] Spread an object literal in object literal is unnecessary. (6)
   - [ ] Do not call `Array#push()` multiple times. (3)
   - [x] Unexpected empty function 'Sitemap'. (5)
   - [ ] globalThis (97)
   - [x] new Array() (15)
   - [x] "A fragment with only one child is redundant." (15)
   - [ ] Is defined but prop is never used (31)
   - [ ] Do not use Array index in keys (24)
   - [ ] Separate statement or replace it with "toSorted". (12)
   - [ ] Unnecessary use of boolean literals in conditional expression. (38)
   - [ ] Unexpected negated condition. (78)
   - [ ] Move this component definition out of the parent component and pass data as props. (13)
   - [ ] Extract this nested ternary operation into an independent statement. (36)
   - [ ] Use `for…of` instead of `.forEach(…)`. (58)
   - [ ] Handle this exception or don't catch it at all. (3)
   - [ ] useState call is not destructured into value + setter pair (3)
   - [ ] Prefer `node: (49)
   - [ ] Prefer top-level await (3)
   - [ ] Use the "RegExp.exec()" (9)
   - [ ] Compare with `undefined` directly instead of using `typeof` (10)
   - [ ] Cognitive complexity (17)


 - Update FEC template with this chart @Engineering suppliers and link to bugsnag
 - `fix/added-node-prefixes-to-imports`
 - `fix/sonarcloud-always-use-new-with-array`

 - `fix/parseInt-to-Number-namespace`
 - Fix security issues https://sonarcloud.io/project/security_hotspots?id=oaknational_owa
 - Add other `node:` prefixes <https://sonarcloud.io/project/issues?impactSeverities=MEDIUM&issueStatuses=OPEN%2CCONFIRMED&tags=import&id=oaknational_owa>
 - Look at these reliability issues <https://sonarcloud.io/project/issues?impactSoftwareQualities=RELIABILITY&issueStatuses=OPEN%2CCONFIRMED&types=BUG&id=oaknational_owa>
 - Look at `./src/node-lib/curriculum-api-2023/fixtures`
 - Rewrite tests in `./src/pages-helpers/curriculum/docx/builder/8_units/8_units.fixture.ts`
 - `fix/remove-old-test-logging-report`
 - [x] `src/utils/curriculum/flags.ts`
 - [ ] `src/utils/curriculum/filtering.ts`
 - [x] `src/utils/curriculum/constants.ts`
 - [ ] `src/utils/filterUnits/filterUnits.ts` — should move into curriculum
 - move `src/utils/curriculum/isVisibleUnit.ts` into `src/utils/curriculum/units.ts`
 - check `scripts/dev/old-components/index.ts` still works
 - I think we can remove `./scripts/dev/test` now & ./scripts/dev/process_test_results.py
   - Maybe we want to keep test timings for now
 - Review `sonar-project.properties`
 - fix/sonarcloud-node-import-issue


UX Failures:

 - Found it easy, but didn't complete the task?
   - Ah bulk was successful
   - Do we have numbers on those that actually did succeed
 - Drop down menus are odd (keep the number input with validation?)
 - 
