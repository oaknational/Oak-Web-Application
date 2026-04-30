import { screen } from "@testing-library/react";

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

  it("renders curriculum overview link", () => {
    renderWithTheme(<UnitViewSeoAccordion {...defaultProps} />);

    const curriculumLink = screen.getByText(/secondary English curriculum/i);
    expect(curriculumLink).toBeInTheDocument();
  });

  it("renders programmes link", () => {
    renderWithTheme(<UnitViewSeoAccordion {...defaultProps} />);

    const programmesLink = screen.getByText(/secondary English programmes/i);
    expect(programmesLink).toBeInTheDocument();
  });
});
