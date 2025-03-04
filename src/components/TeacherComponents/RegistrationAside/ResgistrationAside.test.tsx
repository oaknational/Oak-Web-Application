import { screen } from "@testing-library/dom";

import RegistrationAside from "./ResgistrationAside";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("RegistrationAside", () => {
  it("renders the original component", () => {
    renderWithProviders()(<RegistrationAside useNew={false} />);
    const headerText = screen.getByRole("heading", {
      name: "Our resources will always be free. Creating an account gives you:",
    });
    expect(headerText).toBeInTheDocument();
  });
  it("renders the new component", () => {
    renderWithProviders()(<RegistrationAside useNew={true} />);
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
    renderWithProviders()(<RegistrationAside useNew={true} />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(4);
  });
});
