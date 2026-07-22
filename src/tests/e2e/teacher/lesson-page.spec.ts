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
}, testInfo) => {
  // Arrange
  const downloadAllButton = lessonPage
    .locator('[data-testid="download-all-button"]:visible')
    .first();

  await expect(downloadAllButton).toBeEnabled({
    timeout: 20_000,
  });

  await downloadAllButton.click();

  await expect(lessonPage).toHaveURL(/\/downloads/, {
    timeout: 20_000,
  });

  // Act

  await lessonPage.getByTestId("checkbox-download").check({
    timeout: 20_000,
  });

  await lessonPage.getByTestId("termsCheckboxInput").check({
    timeout: 20_000,
  });

  const downloadButton = lessonPage.getByRole("button", {
    name: /loading\.{3}|download\s*\.zip/i,
  });

  // Wait for the same button to leave its loading state.
  await expect(downloadButton).toHaveAccessibleName(/download\s*\.zip/i, {
    timeout: 40_000,
  });

  await expect(downloadButton).toBeEnabled({ timeout: 30_000 });

  // Temporary CI diagnostics to inspect form and button state before click.
  const schoolInput = lessonPage.getByLabel(/school \(required\)/i);
  const diagnostics = {
    url: lessonPage.url(),
    buttonText: await downloadButton.textContent(),
    buttonAriaDisabled: await downloadButton.getAttribute("aria-disabled"),
    checkboxDownloadChecked: await lessonPage
      .getByTestId("checkbox-download")
      .isChecked(),
    termsCheckboxChecked: await lessonPage
      .getByTestId("termsCheckboxInput")
      .isChecked(),
    schoolInputValue: await schoolInput.inputValue().catch(() => null),
  };

  await testInfo.attach("download-flow-diagnostics", {
    body: JSON.stringify(diagnostics, null, 2),
    contentType: "application/json",
  });

  await testInfo.attach("download-flow-pre-click", {
    body: await lessonPage.screenshot({ fullPage: true }),
    contentType: "image/png",
  });

  const downloadPromise = lessonPage.waitForEvent("download", {
    timeout: 30_000,
  });

  await downloadButton.click();

  const download = await downloadPromise;

  // Assert

  expect(download.suggestedFilename()).toMatch(/\.zip$/i);
});
