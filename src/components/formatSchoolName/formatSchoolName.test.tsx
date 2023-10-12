import { render } from "@testing-library/react";

import { formatSchoolName } from "./formatSchoolName";

describe("formatSchoolName", () => {
  it("should return the expected div with input value in bold", () => {
    const { getByText, getByTestId } = render(
      formatSchoolName(
        "Macaulay Church of England Primary School, Lambeth, SW4 0NU",
        "ima",
      ),
    );

    const divWithText = getByText("ry School, Lambeth, SW4 0NU");
    expect(divWithText).toBeInTheDocument();
    const stronElement = getByText("ima");
    expect(stronElement).toBeInTheDocument();
    const strongElement = getByTestId("strong-element");
    expect(strongElement.tagName).toBe("STRONG");
  });
});
