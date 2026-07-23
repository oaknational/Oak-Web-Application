import { test, expect } from "../fixtures";

test("teacher can click download all resources on lesson page", async ({
  lessonPage,
}) => {
  const downloadAllButton = lessonPage
    .locator('[data-testid="download-all-button"]:visible')
    .first();

  await downloadAllButton.click({ timeout: 20_000 });

  await lessonPage.waitForURL(/\/downloads/, { timeout: 20_000 });
});

test("teacher can complete download flow and download lesson assets", async ({
  lessonPage,
}) => {
  // Clerk JS times out in headless CI environments, which prevents the
  // downloads form from becoming interactive. We stub Clerk to resolve
  // immediately as unauthenticated. The proper long-term fix is to use
  // @clerk/testing with CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY configured
  // as GitHub Actions secrets (tracked as a platform request).
  await lessonPage.route(
    /clerk\.browser\.js|clerk\.accounts\.dev|\.clerk\.accounts/,
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: `(function(){const c={activeSessions:[],sessions:[],signInAttempt:null,signUpAttempt:null};window.Clerk={loaded:true,user:null,session:null,client:c,load:()=>Promise.resolve(),addListener:(fn)=>{setTimeout(()=>fn({user:null,session:null,client:c}),0);return()=>{}},removeListener:()=>{}};})();`,
      });
    },
  );

  const downloadAllButton = lessonPage
    .locator('[data-testid="download-all-button"]:visible')
    .first();

  await downloadAllButton.click({ timeout: 20_000 });

  await lessonPage.waitForURL(/\/downloads/, { timeout: 20_000 });

  // Wait for the download button to leave its initial loading state.
  const downloadButton = lessonPage.getByRole("button", {
    name: /loading\.{3}|download\s*\.zip/i,
  });

  await expect(downloadButton).toHaveAccessibleName(/download\s*\.zip/i, {
    timeout: 40_000,
  });

  await lessonPage.getByTestId("checkbox-download").check({ timeout: 20_000 });
  await lessonPage.getByTestId("termsCheckboxInput").check({ timeout: 20_000 });

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

  const [download] = await Promise.all([
    lessonPage.waitForEvent("download", { timeout: 30_000 }),
    downloadButton.click({ timeout: 30_000 }),
  ]);

  expect(download.suggestedFilename()).toMatch(/\.zip$/i);
});
