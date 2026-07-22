import { test, expect } from "../fixtures";

test("teacher can click download all resources on lesson page", async ({
  lessonPage,
}) => {
  // Arrange
  const downloadAllButton = lessonPage
    .locator('[data-testid="download-all-button"]:visible')
    .first();
  // Act
  await downloadAllButton.click({ timeout: 20_000 });
  // Assert
  await lessonPage.waitForURL(/\/downloads/, { timeout: 20_000 });
});

test("teacher can complete download flow and download lesson assets", async ({
  lessonPage,
}) => {
  // Arrange
  const downloadAllButton = lessonPage
    .locator('[data-testid="download-all-button"]:visible')
    .first();

  await downloadAllButton.click({ timeout: 20_000 });

  // Confirm we are on the downloads page.
  await lessonPage.waitForURL(/\/downloads/, { timeout: 20_000 });

  // Act

  // Required checkboxes
  await lessonPage.getByTestId("checkbox-download").check({ timeout: 20_000 });
  await lessonPage.getByTestId("termsCheckboxInput").check({ timeout: 20_000 });

  const downloadZipButton = lessonPage.getByRole("button", {
    name: /download\s*\.zip/i,
  });

  // Submit the form and wait for the download event.
  const [download] = await Promise.all([
    lessonPage.waitForEvent("download", { timeout: 30_000 }),
    downloadZipButton.click({ timeout: 30_000 }),
  ]);
  // Assert
  expect(download.suggestedFilename()).toMatch(/\.zip$/i);
});
