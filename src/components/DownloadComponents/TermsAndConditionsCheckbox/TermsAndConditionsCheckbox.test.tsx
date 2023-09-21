import { screen } from "@testing-library/react";

import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";

import TermsAndConditionsCheckbox from "./TermsAndConditionsCheckbox";

describe("TermsAndConditionsCheckbox", () => {
  it("renders TermsAndConditionsCheckbox", () => {
    renderWithTheme(
      <TermsAndConditionsCheckbox
        checked={false}
        onChange={jest.fn()}
        id={"123"}
        name={"terms"}
      />
    );

    const termsCheckbox = screen.getByTestId("termsCheckbox");
    expect(termsCheckbox).toBeInTheDocument();
  });

  it("renders TermsAndConditionsCheckbox with error message if passed", () => {
    renderWithTheme(
      <TermsAndConditionsCheckbox
        checked={false}
        onChange={jest.fn()}
        errorMessage="Please select the checkbox"
        id={"123"}
        name={"terms"}
      />
    );

    const termsError = screen.getByText("Please select the checkbox");
    expect(termsError).toBeInTheDocument();
  });
});
