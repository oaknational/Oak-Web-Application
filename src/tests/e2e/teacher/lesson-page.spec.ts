import { test, expect, type Page } from "@playwright/test";

// single lesson initially. This will be expanded in the future to include a lesson from the database
const lessonPath =
  "/teachers/programmes/science-secondary-ks3/units/cells/lessons/the-common-processes-of-all-living-organisms";

test.beforeAll(async ({ browser }) => {
  // Warm the route once to reduce first-test flakiness from cold Next.js startup.
  const page = await browser.newPage();
  await page.goto(lessonPath, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await page.close();
});

const openLessonPage = async (page: Page) => {
  await page.goto(lessonPath, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });

  // Wait for app-level loading skeletons to clear before looking up interactive UI.
  await page.locator("#__next:not(:has([data-testid='loading']))").waitFor();
};

const getDownloadAllButton = async (page: Page) => {
  const downloadAllButton = page
    .locator('[data-testid="download-all-button"]:visible')
    .first();

  await expect(downloadAllButton).toBeVisible();
  await expect(downloadAllButton).toBeEnabled();

  return downloadAllButton;
};

test("teacher can click download all resources on lesson page", async ({
  page,
}) => {
  await openLessonPage(page);

  const downloadAllButton = await getDownloadAllButton(page);
  await downloadAllButton.click();

  await expect(page).toHaveURL(/\/downloads/);
});

test("teacher can complete download flow and download lesson assets", async ({
  page,
}) => {
  await openLessonPage(page);

  const downloadAllButton = await getDownloadAllButton(page);
  await downloadAllButton.click();

  // Confirm we are on the downloads page/step.
  await expect(page).toHaveURL(/\/downloads/);

  // Required checkboxes
  await page.getByTestId("checkbox-download").check();
  await page.getByTestId("termsCheckboxInput").check();

  // Submit the form and wait for the download event.
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /download\s*\.zip/i }).click(),
  ]);

  expect(download.suggestedFilename()).toMatch(/\.zip$/i);
});
