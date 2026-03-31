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
  subjectPhaseSlug: "maths-primary",
  trackingProps: {
    unitName: "IT and the world of work",
    unitSlug: "",
    keyStageSlug: "",
    keyStageTitle: "Key stage 4",
    subjectSlug: "computer-science",
    subjectTitle: "Computer science",
  },
};

describe("UnitHeader", () => {
  it("renders a heading", () => {
    render(<UnitHeader {...defaultProps} />);

    const heading = screen.getByRole("heading", { name: defaultProps.heading });
    expect(heading).toBeInTheDocument();
  });
});
