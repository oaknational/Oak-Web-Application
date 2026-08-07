import { screen } from "@testing-library/react";

import NationalCurriculumInsightsLoading from "./loading";
import NationalCurriculumInsightsNotFound from "./not-found";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("National Curriculum Insights route states", () => {
  it("renders an accessible loading status", () => {
    renderWithTheme(<NationalCurriculumInsightsLoading />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading National Curriculum Insights.",
    );
  });

  it("renders a not-found heading and a route-helper hub link", () => {
    renderWithTheme(<NationalCurriculumInsightsNotFound />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "National Curriculum Insight not found",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Browse National Curriculum Insights" }),
    ).toHaveAttribute("href", "/teachers/national-curriculum-insights");
  });
});
