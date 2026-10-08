import { test, expect } from "../fixtures";

/**
 * Minimal stand-in for clerk.browser.js, resolving immediately as signed out.
 *
 * Clerk v7 reads `__internal_lastEmittedResources` (not the listener payload)
 * for `useUser`/`useAuth`, and `getToken()` awaits a `status` event emitted by
 * `Clerk.on`, so both have to be present or the downloads form never becomes
 * interactive.
 */
const clerkStubScript = `(function () {
  var client = { activeSessions: [], sessions: [], signInAttempt: null, signUpAttempt: null };
  var resources = { user: null, session: null, client: client, organization: null };
  window.Clerk = {
    loaded: true,
    status: "ready",
    user: null,
    session: null,
    organization: null,
    client: client,
    __internal_lastEmittedResources: resources,
    load: function () { return Promise.resolve(); },
    addListener: function (fn) { setTimeout(function () { fn(resources); }, 0); return function () {}; },
    removeListener: function () {},
    on: function (event, handler) { if (event === "status") { handler("ready"); } },
    off: function () {},
  };
})();`;

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
  // Clerk JS times out in headless CI environments, which prevents the
  // downloads form from becoming interactive. We stub Clerk to resolve
  // immediately as unauthenticated. The proper long-term fix is to use
  // @clerk/testing with CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY configured
  // as GitHub Actions secrets (tracked as a platform request).
  await lessonPage.route(/clerk\.browser\.js/, async (route, request) => {
    if (request.resourceType() !== "script") {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: clerkStubScript,
    });
  });

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
