import RiskAssessmentBanner from "./RiskAssessmentBanner";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("RiskAssessmentBanner", () => {
  it("renders the RiskAssessmentBanner component", () => {
    renderWithTheme(<RiskAssessmentBanner />);
  });
});
