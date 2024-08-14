import { screen } from "@testing-library/dom";

import RoleSelectionView from "./RoleSelection.view";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("RoleSelection", () => {
  it("renders a group of radio buttons in a form", () => {
    renderWithProviders()(<RoleSelectionView />);

    const radioGroup = screen.getByRole("radiogroup");
    expect(radioGroup).toBeDefined();

    expect(radioGroup.closest("form")).toBeDefined();
  });
});
