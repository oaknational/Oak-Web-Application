import { screen } from "@testing-library/react";

import RiskAssessmentCheckbox from "./RiskAssessmentCheckbox";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("RiskAssessmentCheckbox", () => {
  it("renders RiskAssessmentCheckbox", () => {
    renderWithTheme(
      <RiskAssessmentCheckbox
        checked={false}
        onChange={jest.fn()}
        id={"123"}
        name={"terms"}
      />,
    );

    const termsCheckbox = screen.getByTestId("termsCheckbox");
    expect(termsCheckbox).toBeInTheDocument();
  });

  it("renders RiskAssessmentCheckbox with error message if passed", () => {
    renderWithTheme(
      <RiskAssessmentCheckbox
        checked={false}
        onChange={jest.fn()}
        errorMessage="Please select the checkbox"
        id={"123"}
        name={"terms"}
      />,
    );

    const error = screen.getByText("Please select the checkbox");
    expect(error).toBeInTheDocument();
  });
});
