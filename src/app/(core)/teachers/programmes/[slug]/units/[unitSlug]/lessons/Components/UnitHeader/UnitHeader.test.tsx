import { screen } from "@testing-library/dom";

import UnitHeader, { UnitHeaderProps } from "./UnitHeader";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

const defaultProps: UnitHeaderProps = {
  heading: "Unit 1 in maths",
  phase: "primary",
  prevUnit: null,
  nextUnit: null,
  subjectIcon: "subject-maths",
  programmeSlug: "maths-ks4-higher",
  subjectPhaseSlug: "maths-secondary",
  trackingProps: {
    unitName: "IT and the world of work",
    unitSlug: "",
    keyStageSlug: "",
    keyStageTitle: "Key stage 4",
    subjectSlug: "computer-science",
    subjectTitle: "Computer science",
  },
  downloadButtonState: {
    downloadError: false,
    setDownloadError: jest.fn(),
    showDownloadMessage: false,
    setShowDownloadMessage: jest.fn(),
    downloadInProgress: false,
    setDownloadInProgress: jest.fn(),
    showIncompleteMessage: false,
    setShowIncompleteMessage: jest.fn(),
  },
};

describe("UnitHeader", () => {
  it("renders a heading", () => {
    render(<UnitHeader {...defaultProps} />);

    const heading = screen.getByRole("heading", { name: defaultProps.heading });
    expect(heading).toBeInTheDocument();
  });
});
