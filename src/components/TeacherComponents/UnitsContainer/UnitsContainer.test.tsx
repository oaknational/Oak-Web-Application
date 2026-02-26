import React from "react";
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { OakBox } from "@oaknational/oak-components";

import { UnitsContainer } from "./UnitsContainer";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const props = {
  isLegacy: false,
  showHeader: true,
  unitCards: [
    <OakBox key="unit-1">Unit 1</OakBox>,
    <OakBox key="unit-2">Unit 2</OakBox>,
    <OakBox key="unit-3">Unit 3</OakBox>,
    <OakBox key="unit-4">Unit 4</OakBox>,
  ],
  subject: "maths",
  phase: "secondary",
  curriculumHref: "https://www.thenational.academy",
};

describe("UnitsContainer", () => {
  it("renders all unit cards in the list", () => {
    renderWithTheme(<UnitsContainer {...props} />);

    expect(screen.getByLabelText("A list of units")).toBeInTheDocument();
    expect(screen.getByText("Unit 1")).toBeInTheDocument();
    expect(screen.getByText("Unit 2")).toBeInTheDocument();
    expect(screen.getByText("Unit 3")).toBeInTheDocument();
    expect(screen.getByText("Unit 4")).toBeInTheDocument();
  });

  it("renders the header when showHeader is true", () => {
    renderWithTheme(<UnitsContainer {...props} />);

    expect(
      screen.getByRole("heading", { name: "maths units" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Brand-new teaching resources, thoughtfully crafted by teachers for classroom needs.",
      ),
    ).toBeInTheDocument();
  });

  it("hides the header when showHeader is false", () => {
    renderWithTheme(<UnitsContainer {...props} showHeader={false} />);

    expect(
      screen.queryByRole("heading", { name: "maths units" }),
    ).not.toBeInTheDocument();
  });

  it("shows legacy header content when isLegacy is true", () => {
    renderWithTheme(
      <UnitsContainer {...props} isLegacy={true} showHeader={true} />,
    );

    expect(
      screen.getByRole("heading", { name: "Units released in 2020-22" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Resources made during the pandemic to support lockdown learning.",
      ),
    ).toBeInTheDocument();
  });

  it("renders banner when passed and showHeader is true", () => {
    const bannerContent = "Takedown notice";
    renderWithTheme(
      <UnitsContainer
        {...props}
        banner={<OakBox data-testid="custom-banner">{bannerContent}</OakBox>}
      />,
    );

    expect(screen.getByTestId("custom-banner")).toBeInTheDocument();
    expect(screen.getByText(bannerContent)).toBeInTheDocument();
  });
});
