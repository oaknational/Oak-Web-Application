import { screen, within } from "@testing-library/react";

import AiTab from "./AiTab";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("AiTab", () => {
  it("renders correct h1 copy", () => {
    renderWithProviders()(<AiTab aria-current="page" />);

    const aiTabContainer = screen.getByTestId("ai-tab");
    const aiH1 = within(aiTabContainer).getByRole("heading", { level: 1 });

    expect(aiH1).toHaveTextContent("Teachers");
  });
});
