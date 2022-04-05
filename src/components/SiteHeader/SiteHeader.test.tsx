import { render, screen, fireEvent } from "@testing-library/react";

import { UserStyleContextProvider } from "../../context/UserStyleContext";

import SiteHeader from "./SiteHeader";

function renderUserContext() {
  return render(
    <UserStyleContextProvider>
      <SiteHeader />
    </UserStyleContextProvider>
  );
}

test("Renders teacher as default user", () => {
  renderUserContext();
  expect(screen.getByText("teacher")).toBeInTheDocument();
});

test("User changes to pupil when button is clicked", () => {
  renderUserContext();
  const buttonElement = screen.getByRole("button", { name: /teacher/i });
  fireEvent.click(buttonElement);

  expect(screen.getByText("pupil")).toBeInTheDocument();
});
