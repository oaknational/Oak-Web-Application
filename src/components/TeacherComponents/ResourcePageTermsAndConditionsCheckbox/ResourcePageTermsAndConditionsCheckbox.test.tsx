import { screen } from "@testing-library/react";

import ResourcePageTermsAndConditionsCheckbox from "./ResourcePageTermsAndConditionsCheckbox";

import { SHARE_FORM_ERROR_IDS } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/shareDownloadFormErrorIds";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("ResourcePageTermsAndConditionsCheckbox", () => {
  it("renders ResourcePageTermsAndConditionsCheckbox", () => {
    renderWithTheme(
      <ResourcePageTermsAndConditionsCheckbox
        checked={false}
        onChange={jest.fn()}
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
        onChange={jest.fn()}
        errorMessage="Please select the checkbox"
        id={"123"}
        name={"terms"}
      />,
    );

    const termsError = screen.getByText("Please select the checkbox");
    expect(termsError).toBeInTheDocument();
    expect(termsError).toHaveAttribute("id", SHARE_FORM_ERROR_IDS.terms);
    const termsInput = screen.getByTestId("termsCheckboxInput");
    expect(termsInput).toHaveAttribute(
      "aria-describedby",
      SHARE_FORM_ERROR_IDS.terms,
    );
    expect(termsInput).not.toHaveAttribute("aria-invalid");
    expect(termsInput).not.toBeRequired();
  });
});
