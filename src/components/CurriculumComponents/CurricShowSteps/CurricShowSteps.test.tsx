import { CurricShowSteps } from "./CurricShowSteps";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurricShowSteps", () => {
  test("basic usage", () => {
    const { baseElement, getByTestId } = renderWithTheme(
      <CurricShowSteps numberOfSteps={4} currentStep={2} />,
    );
    expect(baseElement).toMatchSnapshot();
    expect(getByTestId("step-text")).toHaveTextContent("Step 3 of 4");
  });
});
