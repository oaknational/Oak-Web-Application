import HomePage from "../pageobjects/homepage.page";

describe("OWA", () => {
  it("should have a front page", async () => {
    await HomePage.open();

    const title = await HomePage.title;
    expect(title).toHaveTextContaining("great lessons");
  });

  it("deliberately failing test", async () => {
    await HomePage.open();

    const title = await HomePage.title;
    expect(title).toHaveTextContaining(
      "And suddenly there was a terrible roar all around us and the sky was full of what looked like huge bats"
    );
  });
});
