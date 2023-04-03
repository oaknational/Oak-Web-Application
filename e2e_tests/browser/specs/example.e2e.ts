import HomePage from "../pageobjects/homepage.page";

// This is Mocha, not Jest
// https://mochajs.org/#bdd
// WDIO seems to create one session (browser instance) per file, and name it after the
// last suite (describe/context block) and test name, which makes the default
// automation dashboard quite hard to use, the beta test observability dashboard is much better.
describe("OWA", () => {
  // context is an alias for describe.
  context("Example working test", () => {
    it("should have a front page", async () => {
      await HomePage.open();

      // Close the confirmic overlay if present.
      await HomePage.closeConfirmicOverlay();

      const title = await HomePage.title;
      await expect(title).toHaveTextContaining("great lessons");
    });
  });
  context("Example failing test", () => {
    it("should contain literary quotes", async () => {
      await HomePage.open();

      // Close the confirmic overlay if present.
      await HomePage.closeConfirmicOverlay();

      const title = await HomePage.title;
      await expect(title).toHaveTextContaining(
        "And suddenly there was a terrible roar all around us and the sky was full of what looked like huge bats"
      );
    });
  });
});
