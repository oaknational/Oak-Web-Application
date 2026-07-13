import { test, expect } from "../fixtures";

test("teacher can click download all resources on lesson page", async ({
  lessonPage,
}) => {
  const downloadAllButton = lessonPage
    .locator('[data-testid="download-all-button"]:visible')
    .first();

  await expect(downloadAllButton).toBeEnabled();
  await downloadAllButton.click();

  await expect(lessonPage).toHaveURL(/\/downloads/);
});

test("teacher can complete download flow and download lesson assets", async ({
  lessonPage,
}) => {
  const downloadAllButton = lessonPage
    .locator('[data-testid="download-all-button"]:visible')
    .first();

  await expect(downloadAllButton).toBeEnabled();
  await downloadAllButton.click();

  // Confirm we are on the downloads page.
  await expect(lessonPage).toHaveURL(/\/downloads/);

  // Required checkboxes
  await lessonPage.getByTestId("checkbox-download").check();
  await lessonPage.getByTestId("termsCheckboxInput").check();

  // Submit the form and wait for the download event.
  const [download] = await Promise.all([
    lessonPage.waitForEvent("download"),
    lessonPage.getByRole("button", { name: /download\s*\.zip/i }).click(),
  ]);

  expect(download.suggestedFilename()).toMatch(/\.zip$/i);
});
