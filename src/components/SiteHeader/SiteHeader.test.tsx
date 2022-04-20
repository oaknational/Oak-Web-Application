import { screen, fireEvent } from "@testing-library/react";

import { UserStyleContextProvider } from "../../context/UserStyleContext";
import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import SiteHeader from "./SiteHeader";

function renderUserContext() {
  return renderWithProviders(
    <UserStyleContextProvider>
      <SiteHeader />
    </UserStyleContextProvider>
  );
}

test("Renders pupil as default user", () => {
  renderUserContext();
  expect(screen.getByText("pupils")).toBeInTheDocument();
});

test("User changes to teacher when button is clicked", () => {
  renderUserContext();
  const buttonElement = screen.getByRole("button", { name: /pupils/i });
  fireEvent.click(buttonElement);

  expect(screen.getByText("teachers")).toBeInTheDocument();
});
