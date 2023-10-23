import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import AppHeader from ".";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("components/AppHeader", () => {
  test("header should be in the document", () => {
    const { getByRole } = render(<AppHeader />);

    expect(getByRole("banner")).toBeInTheDocument();
  });

  test("it should be the teachers header colour", () => {
    const { getByRole } = render(<AppHeader />);

    expect(getByRole("banner")).toHaveStyle(
      "background-color: rgb(255, 255, 255);",
    );
  });

  test("clicking on the hamburger button opens the menu", async () => {
    const { getByLabelText, getByTestId } = render(<AppHeader />);

    const user = userEvent.setup();
    const hamburgerButton = getByLabelText("Menu");
    expect(getByTestId("menu")).not.toBeVisible();

    await user.click(hamburgerButton);
    expect(getByTestId("menu")).toBeVisible();
  });

  test("menu can be opened from keyboard", async () => {
    render(<AppHeader />);

    const user = userEvent.setup();
    expect(screen.getByTestId("menu")).not.toBeVisible();
    await user.keyboard("{tab}");
    await user.keyboard("{tab}");
    await user.keyboard("{tab}");
    await user.keyboard("{tab}");
    await user.keyboard("{Enter}");

    expect(screen.getByTestId("menu")).toBeVisible();
  });

  test("menu does not show old menu sections", async () => {
    render(<AppHeader />);
    const user = userEvent.setup();
    const hamburgerButton = screen.getByLabelText("Menu");
    await user.click(hamburgerButton);

    const oldMenuLink = screen.queryByText("Classroom");
    expect(oldMenuLink).not.toBeInTheDocument();
  });

  test("it should include a link for new teacher experience", () => {
    render(<AppHeader />);
    const teacherLink = screen.getAllByRole("link")[1];

    if (!teacherLink) {
      throw new Error("Failed to find link to teacher experience");
    }

    expect(teacherLink.closest("a")).toHaveAttribute("href", "/");
  });
  test("it should include a link for classroom", () => {
    render(<AppHeader />);
    const pupilsLink = screen.getAllByRole("link")[2];

    if (!pupilsLink) {
      throw new Error("Failed to find link to classroom");
    }

    expect(pupilsLink.closest("a")).toHaveAttribute(
      "href",
      "https://classroom.thenational.academy",
    );
  });
});
