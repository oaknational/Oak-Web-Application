import { screen } from "@testing-library/react";

import { NutshellSection } from "./NutshellSection";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("NutshellSection", () => {
  const renderSection = () =>
    renderWithTheme(
      <NutshellSection
        id="explanation"
        heading="Explanation in a nutshell"
        intro="Intro text"
        content={[
          { type: "heading-and-text", heading: "What?", text: "What text" },
        ]}
      />,
    );

  it("renders the heading as an h2 with the anchor id", () => {
    renderSection();

    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Explanation in a nutshell",
    });
    expect(heading).toHaveAttribute("id", "explanation");
  });

  it("renders the intro and content", () => {
    renderSection();

    expect(screen.getByText("Intro text")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "What?" }),
    ).toBeInTheDocument();
    expect(screen.getByText("What text")).toBeInTheDocument();
  });
});
