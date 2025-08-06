import { getByRole } from "@testing-library/dom";

import SuccessMessage from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("SuccessMessage", () => {
  test("component renders with correctly", async () => {
    const { baseElement } = renderWithTheme(
      <SuccessMessage
        title="Success"
        message="We hope this worked correctly"
        buttonProps={{
          label: "Back",
        }}
      />,
    );
    const headingElement = getByRole(baseElement, "heading", { level: 2 });
    expect(headingElement).toHaveTextContent("Success");

    expect(baseElement).toHaveTextContent("We hope this worked correctly");

    const buttonElement = getByRole(baseElement, "button");
    expect(buttonElement).toHaveTextContent("Back");
  });

  test("component renders fires button click", async () => {
    const mockFn = jest.fn();
    const { baseElement } = renderWithTheme(
      <SuccessMessage
        title="Success"
        message="We hope this worked correctly"
        buttonProps={{
          label: "Back",
          onClick: mockFn,
        }}
      />,
    );

    const buttonElement = getByRole(baseElement, "button");
    buttonElement.click();
    expect(mockFn).toHaveBeenCalled();
  });
});
