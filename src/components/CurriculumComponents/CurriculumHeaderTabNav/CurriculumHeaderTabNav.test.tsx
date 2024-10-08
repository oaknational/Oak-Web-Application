import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider } from "styled-components";

import CurriculumHeaderTabNav from "./index";

import { ButtonAsLinkProps } from "@/components/SharedComponents/Button/ButtonAsLink";
import oakTheme from "@/styles/theme";

describe("CurriculumHeaderTabNav Component", () => {
  const mockLinks: ButtonAsLinkProps[] = [
    {
      label: "Unit sequence",
      page: "curriculum-units",
      subjectPhaseSlug: "maths-secondary",
      isCurrent: true,
      scroll: false,
    },
    {
      label: "Overview",
      page: "curriculum-overview",
      subjectPhaseSlug: "maths-secondary",
      isCurrent: false,
      scroll: false,
    },
    {
      label: "Download",
      page: "curriculum-downloads",
      subjectPhaseSlug: "maths-secondary",
      isCurrent: false,
      scroll: false,
    },
  ];

  const defaultProps = {
    label: "Curriculum Selection",
    links: mockLinks,
  };

  it("renders all provided links", () => {
    render(
      <ThemeProvider theme={oakTheme}>
        <CurriculumHeaderTabNav {...defaultProps} />
      </ThemeProvider>,
    );
    mockLinks.forEach((link) => {
      const linkElement = screen.getByText(link.label);
      expect(linkElement).toBeInTheDocument();
    });
  });

  it('sets aria-current="page" on the current tab', () => {
    render(
      <ThemeProvider theme={oakTheme}>
        <CurriculumHeaderTabNav {...defaultProps} />
      </ThemeProvider>,
    );
    const currentLink = screen.getByRole("link", { name: "Unit sequence" });
    currentLink.click();
    expect(currentLink).toHaveAttribute("aria-current", "page");

    const otherLinks = mockLinks.filter((link) => !link.isCurrent);
    otherLinks.forEach((link) => {
      const linkElement = screen.getByRole("link", { name: link.label });
      expect(linkElement).not.toHaveAttribute("aria-current");
    });
  });

  it("container is a nav element with correct aria-label", () => {
    render(
      <ThemeProvider theme={oakTheme}>
        <CurriculumHeaderTabNav {...defaultProps} />
      </ThemeProvider>,
    );
    const navElement = screen.getByRole("navigation", {
      name: "Curriculum Selection",
    });
    expect(navElement).toBeInTheDocument();
  });
});
