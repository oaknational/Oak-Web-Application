import { test, expect } from "@playwright/test";

// single lesson initially. This will be expanded in the future to include a lesson from the database
const lessonPath =
  "/teachers/programmes/science-secondary-ks3/units/cells/lessons/the-common-processes-of-all-living-organisms";

test("teacher can click download all resources on lesson page", async ({
  page,
}) => {
  await page.goto(lessonPath);

  const downloadAllButton = page
    .locator('[data-testid="download-all-button"]:visible')
    .first();
  await expect(downloadAllButton).toBeVisible();
  await downloadAllButton.click();

  await expect(page).toHaveURL(/\/downloads/);
});

test("teacher can complete download flow and download lesson assets", async ({
  page,
}) => {
  await page.goto(lessonPath);

  const downloadAllButton = page
    .locator('[data-testid="download-all-button"]:visible')
    .first();
  await expect(downloadAllButton).toBeVisible();
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

  await expect(
    page.getByRole("heading", { name: "Thanks for downloading!" }),
  ).toBeVisible();
});
