import React from "react";
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { OakInlineBanner } from "@oaknational/oak-components";

import { UnitsHeader } from "./UnitsHeader";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const props = {
  isLegacy: false,
  subject: "maths",
  phase: "secondary",
  curriculumHref: "https://www.thenational.academy",
};

describe("UnitsHeader", () => {
  it("renders standard header with heading, subheading and curriculum link", () => {
    renderWithTheme(<UnitsHeader {...props} />);

    expect(
      screen.getByRole("heading", { name: "maths units" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Brand-new teaching resources, thoughtfully crafted by teachers for classroom needs.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Full secondary curriculum" }),
    ).toHaveAttribute("href", "https://www.thenational.academy");
  });

  it("renders legacy header with different heading, subheading and link text", () => {
    renderWithTheme(<UnitsHeader {...props} isLegacy={true} />);

    expect(
      screen.getByRole("heading", { name: "Units released in 2020-22" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Resources made during the pandemic to support remote teaching.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Curriculum download" }),
    ).toHaveAttribute("href", "https://www.thenational.academy");
  });

  it("uses phase for curriculum link text", () => {
    renderWithTheme(<UnitsHeader {...props} phase="primary" />);

    expect(
      screen.getByRole("link", { name: "Full primary curriculum" }),
    ).toBeInTheDocument();
  });

  it("hides curriculum link when curriculumHref is null", () => {
    renderWithTheme(<UnitsHeader {...props} curriculumHref={null} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders custom unit heading and hides subheading and curriculum link when isCustomUnit", () => {
    renderWithTheme(
      <UnitsHeader
        {...props}
        isCustomUnit={true}
        customHeadingText="My custom units"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "My custom units" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        "Brand-new teaching resources, thoughtfully crafted by teachers for classroom needs.",
      ),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders standard heading when isCustomUnit but customHeadingText is not provided", () => {
    renderWithTheme(<UnitsHeader {...props} isCustomUnit={true} />);

    expect(
      screen.getByRole("heading", { name: "maths units" }),
    ).toBeInTheDocument();
  });

  it("renders banner when passed", () => {
    const bannerMessage = "Example banner text";
    renderWithTheme(
      <UnitsHeader
        {...props}
        banner={
          <OakInlineBanner
            isOpen={true}
            message={bannerMessage}
            type="neutral"
            $width={"100%"}
          />
        }
      />,
    );

    expect(screen.getByText(bannerMessage)).toBeInTheDocument();
  });
});
