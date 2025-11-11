import { CurricAngledLabel } from "./CurricAngledLabel";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("CurricAngledLabel", () => {
  it("renders children correctly", () => {
    const { getByText } = render(
      <CurricAngledLabel>Test Content</CurricAngledLabel>,
    );
    expect(getByText("Test Content")).toBeInTheDocument();
  });

  it("applies correct styling", () => {
    const { getByText } = render(
      <CurricAngledLabel>Styled Text</CurricAngledLabel>,
    );
    const element = getByText("Styled Text");
    expect(element).toHaveStyle({
      display: "inline-block",
      transform: "rotate(-0.381deg)",
    });
  });
});
