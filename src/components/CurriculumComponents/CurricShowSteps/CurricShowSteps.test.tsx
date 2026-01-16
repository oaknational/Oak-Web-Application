import { CurricShowSteps } from "./CurricShowSteps";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("CurricShowSteps", () => {
  test("basic usage", () => {
    const { baseElement, getByTestId } = render(
      <CurricShowSteps numberOfSteps={4} currentStepIndex={2} />,
    );
    expect(baseElement).toMatchSnapshot();
    expect(getByTestId("step-text")).toHaveTextContent("Step 3 of 4");
  });
});
