import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  UnitViewSeoAccordion,
  UnitViewSeoAccordionProps,
} from "./UnitViewSeoAccordion";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("UnitViewSeoAccordion", () => {
  const defaultProps: UnitViewSeoAccordionProps = {
    examBoardTitle: "AQA",
    yearGroupTitle: "Year 7",
    unitTitle: "Test Unit",
    subjectTitle: "English",
    phaseTitle: "Secondary",
    nonCurriculum: false,
    subjectPhaseSlug: "english-secondary-ks3",
  };

  it("renders the accordion with correct header", () => {
    renderWithTheme(<UnitViewSeoAccordion {...defaultProps} />);

    const header = screen.getByText(
      /Explore this AQA year 7 english unit to find free lesson teaching resources/,
    );
    expect(header).toBeInTheDocument();
  });

  it("renders the header without exam board title when not provided", () => {
    const props = { ...defaultProps, examBoardTitle: undefined };
    renderWithTheme(<UnitViewSeoAccordion {...props} />);

    const header = screen.getByText(
      /Explore this year 7 english unit to find free lesson teaching resources/,
    );
    expect(header).toBeInTheDocument();
  });

  it("renders curriculum overview link", async () => {
    renderWithTheme(<UnitViewSeoAccordion {...defaultProps} />);

    const accordionButton = screen.getByRole("button", {
      name: /Explore this AQA year 7 english unit/i,
    });
    await userEvent.click(accordionButton);

    const curriculumLink = screen.getByRole("link", {
      name: /secondary English curriculum/i,
    });
    expect(curriculumLink).toBeInTheDocument();
  });

  it("does not render curriculum overview link when nonCurriculum is true", () => {
    const props = { ...defaultProps, nonCurriculum: true };
    renderWithTheme(<UnitViewSeoAccordion {...props} />);

    const curriculumLink = screen.queryByRole("link", {
      name: /secondary English curriculum/i,
    });
    expect(curriculumLink).not.toBeInTheDocument();
  });

  it("renders programmes link", async () => {
    renderWithTheme(<UnitViewSeoAccordion {...defaultProps} />);

    const accordionButton = screen.getByRole("button", {
      name: /Explore this AQA year 7 english unit/i,
    });
    await userEvent.click(accordionButton);

    const programmesLink = screen.getByRole("link", {
      name: /secondary English programmes/i,
    });
    expect(programmesLink).toBeInTheDocument();
  });
});
