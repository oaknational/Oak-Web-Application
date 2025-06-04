import { screen } from "@testing-library/dom";

import RegistrationAside from "./RegistrationAside";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("RegistrationAside", () => {
  it("renders the component", () => {
    renderWithProviders()(<RegistrationAside />);
    const headerText1 = screen.getByRole("heading", {
      name: "Our resources will",
    });
    expect(headerText1).toBeInTheDocument();
    const headerText2 = screen.getByRole("heading", {
      name: "always be free.",
    });
    expect(headerText2).toBeInTheDocument();
  });
  it("renders a list of items", () => {
    renderWithProviders()(<RegistrationAside />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(4);
  });
});
