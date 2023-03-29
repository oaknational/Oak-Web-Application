import HomePage from "../pageobjects/homepage.page";

describe("My application", () => {
  it("should have a front page", async () => {
    await HomePage.open();

    const title = await HomePage.title;

    expect(title).toHaveTextContaining("great lessons");
  });
});
