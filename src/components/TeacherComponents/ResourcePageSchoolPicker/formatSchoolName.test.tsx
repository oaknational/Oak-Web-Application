import { formatSchoolName } from "./formatSchoolName";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("formatSchoolName", () => {
  it("should return the expected div with input value in bold", () => {
    const { getByText, getByTestId } = renderWithTheme(
      formatSchoolName(
        "Macaulay Church of England Primary School, Lambeth, SW4 0NU",
        "ima",
      ),
    );

    const divWithText = getByText("ry School, Lambeth, SW4 0NU");
    expect(divWithText).toBeInTheDocument();
    const strongElement = getByTestId("strong-element");
    expect(strongElement).toHaveStyle("font-weight: 700");
    expect(strongElement).toHaveStyle("color: rgb(55, 76, 241)");
    expect(strongElement).toHaveTextContent("ima");
  });
});
