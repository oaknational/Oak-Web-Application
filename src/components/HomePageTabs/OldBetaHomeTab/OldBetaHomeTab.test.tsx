import { screen } from "@testing-library/react";

import OldBetaHomeTab from "./OldBetaHomeTab";

import keyStageKeypad from "@/browser-lib/fixtures/keyStageKeypad";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("TeachersTab", () => {
  it("renders without crashing", () => {
    renderWithProviders()(<OldBetaHomeTab curriculumData={keyStageKeypad} />);
    const teachersH1 = screen.getByRole("heading", { level: 1 });
    expect(teachersH1).toHaveTextContent("Your foundation for great lessons");
  });
});
