import { CurricAngledLabel } from "./CurricAngledLabel";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurricAngledLabel", () => {
  it("renders children correctly", () => {
    const { getByText } = renderWithTheme(
      <CurricAngledLabel>Test Content</CurricAngledLabel>,
    );
    expect(getByText("Test Content")).toBeInTheDocument();
  });

  it("applies correct styling", () => {
    const { getByText } = renderWithTheme(
      <CurricAngledLabel>Styled Text</CurricAngledLabel>,
    );
    const element = getByText("Styled Text");
    expect(element).toHaveStyle({
      display: "inline-block",
      transform: "rotate(-0.381deg)",
    });
  });
});
