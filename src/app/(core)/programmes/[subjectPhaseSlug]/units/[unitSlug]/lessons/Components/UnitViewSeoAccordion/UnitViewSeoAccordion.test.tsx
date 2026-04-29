import { screen } from "@testing-library/react";

import {
  UnitViewSeoAccordion,
  UnitViewSeoAccordionProps,
} from "./UnitViewSeoAccordion";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("UnitViewSeoAccordion", () => {
  const defaultProps: UnitViewSeoAccordionProps = {
    examBoardTitle: "AQA",
    yearGroup: "Year 7",
    keyStage: "KS3",
    unitTitle: "Test Unit",
    subjectTitle: "English",
    phaseSlug: "secondary",
    subjectPhaseSlug: "english-secondary-ks3",
  };

  it("renders the accordion with correct header", () => {
    renderWithTheme(<UnitViewSeoAccordion {...defaultProps} />);

    const header = screen.getByText(
      /Explore this AQA Year 7 KS3 unit to find free lesson teaching resources/,
    );
    expect(header).toBeInTheDocument();
  });

  it("renders the header without exam board title when not provided", () => {
    const props = { ...defaultProps, examBoardTitle: undefined };
    renderWithTheme(<UnitViewSeoAccordion {...props} />);

    const header = screen.getByText(
      /Explore this Year 7 KS3 unit to find free lesson teaching resources/,
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

  it("renders keystages and years for secondary phase", () => {
    renderWithTheme(<UnitViewSeoAccordion {...defaultProps} />);

    expect(screen.getByText(/KS3 English/)).toBeInTheDocument();
    expect(screen.getByText(/KS4 English/)).toBeInTheDocument();
    expect(screen.getByText(/Year 7 English/)).toBeInTheDocument();
    expect(screen.getByText(/Year 11 English/)).toBeInTheDocument();
  });

  it("renders keystages and years for primary phase", () => {
    const primaryProps = {
      ...defaultProps,
      phaseSlug: "primary",
      yearGroup: "Year 2",
      keyStage: "KS1",
      subjectPhaseSlug: "english-primary",
    };
    renderWithTheme(<UnitViewSeoAccordion {...primaryProps} />);

    expect(screen.getByText(/KS1 English/)).toBeInTheDocument();
    expect(screen.getByText(/KS2 English/)).toBeInTheDocument();
    expect(screen.getByText(/Year 1 English/)).toBeInTheDocument();
    expect(screen.getByText(/Year 6 English/)).toBeInTheDocument();
  });
});
