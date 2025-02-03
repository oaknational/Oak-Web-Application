import { screen } from "@testing-library/react";

import ResourcePageTermsAndConditionsCheckbox from "./ResourcePageTermsAndConditionsCheckbox";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("ResourcePageTermsAndConditionsCheckbox", () => {
  it("renders ResourcePageTermsAndConditionsCheckbox", () => {
    renderWithTheme(
      <ResourcePageTermsAndConditionsCheckbox
        checked={false}
        onChange={vi.fn()}
        id={"123"}
        name={"terms"}
      />,
    );

    const termsCheckbox = screen.getByTestId("termsCheckbox");
    expect(termsCheckbox).toBeInTheDocument();
  });

  it("renders TermsAndConditionsCheckbox with error message if passed", () => {
    renderWithTheme(
      <ResourcePageTermsAndConditionsCheckbox
        checked={false}
        onChange={vi.fn()}
        errorMessage="Please select the checkbox"
        id={"123"}
        name={"terms"}
      />,
    );

    const termsError = screen.getByText("Please select the checkbox");
    expect(termsError).toBeInTheDocument();
  });
});
