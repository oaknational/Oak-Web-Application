import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import HomePageTabImageNav from "./HomePageTabImageNav";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("HomePageTabImageNav Component", () => {
  it("renders without errors", () => {
    const { container } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <HomePageTabImageNav current="teachers" />
      </OakThemeProvider>,
    );
    expect(container).toBeTruthy();
  });

  it.each([
    [/Curriculum Plans/i, "/curriculum"],
    [/AI experiments/i, "/ai"],
    [/Pupils/i, "/pupils"],
  ])(
    "navigates to the correct tab when the button is clicked",
    (name, path) => {
      //mock window.location
      Object.defineProperty(window, "location", {
        value: {
          href: "/",
        },
        writable: true,
      });

      const { getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <HomePageTabImageNav current="teachers" />
        </OakThemeProvider>,
      );
      const curriculumButton = getByRole("link", {
        name,
      });
      expect(curriculumButton).toHaveAttribute("href", path);
    },
  );
});
