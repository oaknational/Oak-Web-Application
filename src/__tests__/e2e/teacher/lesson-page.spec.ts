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
      body: `(function(){const c={activeSessions:[],sessions:[],signInAttempt:null,signUpAttempt:null};window.Clerk={loaded:true,user:null,session:null,client:c,load:()=>Promise.resolve(),addListener:(fn)=>{setTimeout(()=>fn({user:null,session:null,client:c}),0);return()=>{}},removeListener:()=>{}};})();`,
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
