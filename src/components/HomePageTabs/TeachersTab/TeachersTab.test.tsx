import { screen } from "@testing-library/react";

import TeachersTab from "./TeachersTab";

import keyStageKeypad from "@/browser-lib/fixtures/keyStageKeypad";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("TeachersTab", () => {
  it("renders without crashing", () => {
    renderWithProviders()(<TeachersTab keyStages={keyStageKeypad.keyStages} />);
    const teachersH1 = screen.getByRole("heading", { level: 1 });
    expect(teachersH1).toHaveTextContent("Teachers");
  });
});
