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
        showPostAlbCopyright={true}
      />,
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
        showPostAlbCopyright={true}
      />,
    );

    const termsError = screen.getByText("Please select the checkbox");
    expect(termsError).toBeInTheDocument();
  });

  it("renders pre-ALB copyright notice", () => {
    renderWithTheme(
      <TermsAndConditionsCheckbox
        checked={false}
        onChange={jest.fn()}
        id={"123"}
        name={"terms"}
        showPostAlbCopyright={false}
      />,
    );

    const preAlbCopyright = screen.getByText(
      "This content is made available by Oak and its partners",
      { exact: false },
    );
    expect(preAlbCopyright).toBeInTheDocument();
  });
  it("renders post-ALB copyright notice", () => {
    renderWithTheme(
      <TermsAndConditionsCheckbox
        checked={false}
        onChange={jest.fn()}
        id={"123"}
        name={"terms"}
        showPostAlbCopyright={true}
      />,
    );

    const preAlbCopyright = screen.getByText(
      "This content is © Oak National Academy (2023), licensed on",
      { exact: false },
    );
    expect(preAlbCopyright).toBeInTheDocument();
  });
});
