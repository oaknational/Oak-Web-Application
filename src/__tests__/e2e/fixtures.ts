import { test as base, type Page } from "@playwright/test";
import { setupClerkTestingToken } from "@clerk/testing/playwright";
export { expect } from "@playwright/test";

// This lesson path is going to be used for the initial implementation.
const lessonPath =
  "/teachers/programmes/science-secondary-ks3/units/cells/lessons/the-common-processes-of-all-living-organisms";

type Fixtures = {
  clerkPage: Page;
  lessonPage: Page;
};

export const test = base.extend<Fixtures>({
  clerkPage: async ({ page }, use) => {
    // Must run before navigation so Clerk's frontend API requests carry the testing token.
    await setupClerkTestingToken({ page });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);
  },
  lessonPage: async ({ clerkPage }, use) => {
    await clerkPage.goto(lessonPath, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    // Wait for app-level loading skeletons to clear before tests interact with UI.
    await clerkPage
      .locator("#__next:not(:has([data-testid='loading']))")
      .waitFor();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(clerkPage);
  },
});
