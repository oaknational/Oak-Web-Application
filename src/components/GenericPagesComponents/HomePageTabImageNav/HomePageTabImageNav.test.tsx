import HomePageTabImageNav from "./HomePageTabImageNav";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("HomePageTabImageNav Component", () => {
  test("renders without errors", () => {
    const { container } = renderWithTheme(
      <HomePageTabImageNav current="teachers" />,
    );
    expect(container).toBeTruthy();
  });
});
