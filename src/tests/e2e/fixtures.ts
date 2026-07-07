import { test as base, expect, type Page } from "@playwright/test";

// This lesson path is going to be used for the initial implementation.
const lessonPath =
  "/teachers/programmes/science-secondary-ks3/units/cells/lessons/the-common-processes-of-all-living-organisms";

type Fixtures = {
  lessonPage: Page;
};

export const test = base.extend<Fixtures>({
  lessonPage: async ({ page }, use) => {
    await page.goto(lessonPath, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    // Wait for app-level loading skeletons to clear before tests interact with UI.
    await page.locator("#__next:not(:has([data-testid='loading']))").waitFor();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);
  },
});

export { expect };
