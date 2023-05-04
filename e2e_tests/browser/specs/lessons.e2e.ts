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

      // ks-4
      // maths
      // core
      // second unit
      // first lesson
      // open transcript
      // check text is displayed
    });
  });
});
