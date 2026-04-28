import { render, screen } from "@testing-library/react";

import { UnitViewSeoAccordion } from "./UnitViewSeoAccordion";

describe("UnitViewSeoAccordion", () => {
  const defaultProps = {
    examBoardTitle: "AQA",
    yearGroup: "Year 10",
    keyStage: "KS4",
    unitTitle: "Coordination and control",
    subjectTitle: "Biology",
    phaseSlug: "secondary",
    subjectPhaseSlug: "biology-secondary",
  };

  it("renders the accordion with correct header", () => {
    render(<UnitViewSeoAccordion {...defaultProps} />);

    const header = screen.getByText(
      /Explore this AQA Year 10 KS4 unit to find free lesson teaching resources/,
    );
    expect(header).toBeInTheDocument();
  });

  it("renders the header without exam board title when not provided", () => {
    const props = { ...defaultProps, examBoardTitle: undefined };
    render(<UnitViewSeoAccordion {...props} />);

    const header = screen.getByText(
      /Explore this Year 10 KS4 unit to find free lesson teaching resources/,
    );
    expect(header).toBeInTheDocument();
  });

  it("renders curriculum overview link", () => {
    render(<UnitViewSeoAccordion {...defaultProps} />);

    const curriculumLink = screen.getByRole("link", {
      name: /curriculum/i,
    });
    expect(curriculumLink).toBeInTheDocument();
  });

  it("renders programmes link", () => {
    render(<UnitViewSeoAccordion {...defaultProps} />);

    const programmesLink = screen.getByRole("link", {
      name: /programmes/i,
    });
    expect(programmesLink).toBeInTheDocument();
  });

  it("renders keystages and years for secondary phase", () => {
    render(<UnitViewSeoAccordion {...defaultProps} />);

    expect(screen.getByText(/KS3 Biology/)).toBeInTheDocument();
    expect(screen.getByText(/KS4 Biology/)).toBeInTheDocument();
    expect(screen.getByText(/Year 7 Biology/)).toBeInTheDocument();
    expect(screen.getByText(/Year 11 Biology/)).toBeInTheDocument();
  });

  it("renders keystages and years for primary phase", () => {
    const primaryProps = {
      ...defaultProps,
      phaseSlug: "primary",
      yearGroup: "Year 2",
      keyStage: "KS1",
      programmeSlug: "primary-english",
    };
    render(<UnitViewSeoAccordion {...primaryProps} />);

    expect(screen.getByText(/KS1 Biology/)).toBeInTheDocument();
    expect(screen.getByText(/KS2 Biology/)).toBeInTheDocument();
    expect(screen.getByText(/Year 1 Biology/)).toBeInTheDocument();
    expect(screen.getByText(/Year 6 Biology/)).toBeInTheDocument();
  });
});
