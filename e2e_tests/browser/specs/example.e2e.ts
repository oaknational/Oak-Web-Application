import HomePage from "../pageobjects/homepage.page";

// This is Mocha, not Jest
// https://mochajs.org/#bdd
describe("OWA", () => {
  context("Example working test", () => {
    it("should have a front page", async () => {
      await HomePage.open();

      const title = await HomePage.title;
      await expect(title).toHaveTextContaining("great lessons");
    });
  });
  context("Example failing test", () => {
    it("should contain literary quotes", async () => {
      await HomePage.open();

      const title = await HomePage.title;
      await expect(title).toHaveTextContaining(
        "And suddenly there was a terrible roar all around us and the sky was full of what looked like huge bats"
      );
    });
  });
});
