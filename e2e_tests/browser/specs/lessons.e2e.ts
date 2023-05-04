import TeacherHomePage from "../pageobjects/teacher_homepage.page";

// This is Mocha, not Jest
// https://mochajs.org/#bdd
// WDIO seems to create one session (browser instance) per file, and name it after the
// last suite (describe/context block) and test name, which makes the default
// automation dashboard quite hard to use, the beta test observability dashboard is much better.
describe("Lessons", () => {
  // context is an alias for describe.
  context("in the teacher experience", () => {
    it("can be navigated to by browsing", async () => {
      await TeacherHomePage.open();

      // Close the confirmic overlay if present.
      await TeacherHomePage.closeConfirmicOverlay();

      const title = await TeacherHomePage.title;

      // These do need an await, despite what VSCode might tell you.
      await expect(title).toHaveTextContaining("great lessons");
    });
  });
});
