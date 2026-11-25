import { test, expect } from "../fixtures";

test("teacher can click download all resources on lesson page", async ({
  lessonPage,
}) => {
  const downloadAllButton = lessonPage
    .locator('[data-testid="download-all-button"]:visible')
    .first();

  await downloadAllButton.click();

  await expect(lessonPage).toHaveURL(/\/downloads/);
});

test("teacher can complete download flow and download lesson assets", async ({
  lessonPage,
}) => {
  const downloadAllButton = lessonPage
    .locator('[data-testid="download-all-button"]:visible')
    .first();

  await downloadAllButton.click();

  await lessonPage.waitForURL(/\/downloads/);

  const downloadButton = lessonPage.getByRole("button", {
    name: /loading\.{3}|download\s*\.zip/i,
  });

  // Wait for the button to leave its initial loading state.
  await expect(downloadButton).toHaveAccessibleName(/download\s*\.zip/i);

  await lessonPage.getByTestId("checkbox-download").check();
  await lessonPage.getByTestId("termsCheckboxInput").check();

  await expect(downloadButton).toBeEnabled();

  const [download] = await Promise.all([
    lessonPage.waitForEvent("download"),
    downloadButton.click(),
  ]);

  expect(download.suggestedFilename()).toMatch(/\.zip$/i);
});
