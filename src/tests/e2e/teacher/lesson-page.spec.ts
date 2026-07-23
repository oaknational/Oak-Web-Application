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
  const networkIssues: Array<{
    kind: "response" | "requestfailed";
    url: string;
    method: string;
    status?: number;
    statusText?: string;
    failureText?: string;
  }> = [];

  const pushNetworkIssue = (event: (typeof networkIssues)[number]): void => {
    networkIssues.push(event);
    if (networkIssues.length > 40) networkIssues.shift();
  };

  const isRelevantUrl = (url: string): boolean => {
    return (
      url.includes("/downloads") ||
      url.includes("/api") ||
      url.includes("lesson-assets")
    );
  };

  lessonPage.on("response", (response) => {
    const url = response.url();
    if (!response.ok() && isRelevantUrl(url)) {
      pushNetworkIssue({
        kind: "response",
        url,
        method: response.request().method(),
        status: response.status(),
        statusText: response.statusText(),
      });
    }
  });

  lessonPage.on("requestfailed", (request) => {
    const url = request.url();
    if (isRelevantUrl(url)) {
      pushNetworkIssue({
        kind: "requestfailed",
        url,
        method: request.method(),
        failureText: request.failure()?.errorText,
      });
    }
  });

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

  // The download button starts in a loading state while the page fetches
  // initial data. Wait for it to become ready BEFORE touching the form,
  // since locally this resolves without any user input.
  const downloadButton = lessonPage.getByRole("button", {
    name: /loading\.{3}|download\s*\.zip/i,
  });

  // Capture diagnostics early so they are always available even if the wait below fails.
  const earlyDiagnostics = {
    url: lessonPage.url(),
    buttonTextOnArrival: await downloadButton.textContent().catch(() => null),
    networkIssueCount: networkIssues.length,
    networkIssues: [...networkIssues],
  };

  await testInfo.attach("download-page-on-arrival", {
    body: JSON.stringify(earlyDiagnostics, null, 2),
    contentType: "application/json",
  });

  await testInfo.attach("download-page-screenshot-on-arrival", {
    body: await lessonPage.screenshot({ fullPage: true }),
    contentType: "image/png",
  });

  // Wait for the initial data fetch to complete and button to become interactive.
  await expect(downloadButton).toHaveAccessibleName(/download\s*\.zip/i, {
    timeout: 40_000,
  });

  // Act — fill the form now that the page is ready.
  await lessonPage.getByTestId("checkbox-download").check({
    timeout: 20_000,
  });

  await lessonPage.getByTestId("termsCheckboxInput").check({
    timeout: 20_000,
  });

  // Select school via autocomplete.
  const schoolInput = lessonPage.getByLabel(/school \(required\)/i);
  await schoolInput.pressSequentially("Homeschool", { timeout: 20_000 });
  await lessonPage
    .getByRole("option", { name: /homeschool/i })
    .first()
    .click({ timeout: 20_000 })
    .catch(() =>
      lessonPage
        .getByText(/^Homeschool$/i)
        .first()
        .click({ timeout: 10_000 }),
    );
  await expect(schoolInput).toHaveValue(/homeschool/i, { timeout: 20_000 });

  await expect(downloadButton).toBeEnabled({ timeout: 30_000 });

  const downloadPromise = lessonPage.waitForEvent("download", {
    timeout: 30_000,
  });

  await downloadButton.click();

  const download = await downloadPromise;

  // Assert

  expect(download.suggestedFilename()).toMatch(/\.zip$/i);
});
