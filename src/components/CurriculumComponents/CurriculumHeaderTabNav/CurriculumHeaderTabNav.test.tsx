import React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { ThemeProvider } from "styled-components";

import CurriculumHeaderTabNav from "./index";

import { ButtonAsLinkProps } from "@/components/SharedComponents/Button/ButtonAsLink";
import oakTheme from "@/styles/theme";
import { PhaseValueType } from "@/browser-lib/avo/Avo";

const curriculumVisualiserTabAccessed = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      curriculumVisualiserTabAccessed: (...args: unknown[]) =>
        curriculumVisualiserTabAccessed(...args),
    },
  }),
}));

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
    trackingData: {
      subjectTitle: "Mathematics",
      subjectSlug: "maths",
      phaseSlug: "primary" as PhaseValueType,
      tab: "overview",
    },
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

  describe("curriculumVisualiserTabAccessed", () => {
    test("calls track.curriculumVisualiserTabAccessed with correct parameters", async () => {
      const { findAllByTestId } = render(
        <ThemeProvider theme={oakTheme}>
          <CurriculumHeaderTabNav {...defaultProps} />
        </ThemeProvider>,
      );

      const tabs = await findAllByTestId("header-nav-tab");
      const tab = tabs[1]!;

      await act(async () => {
        await userEvent.click(tab.querySelector("button")!);
      });

      expect(curriculumVisualiserTabAccessed).toHaveBeenCalledTimes(1);
      expect(curriculumVisualiserTabAccessed).toHaveBeenCalledWith({
        subjectTitle: "Mathematics",
        subjectSlug: "maths",
        platform: "owa",
        product: "curriculum visualiser",
        engagementIntent: "explore",
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
        phase: "primary",
        componentType: "units_tab",
      });
    });
  });
});
