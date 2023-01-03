import userEvent from "@testing-library/user-event";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import AppHeader from ".";

describe("components/AppHeader", () => {
  test("header should be in the document", () => {
    const { getByRole } = renderWithProviders(<AppHeader />);

    expect(getByRole("banner")).toBeInTheDocument();
  });

  test("it should be the teachers header colour", () => {
    const { getByRole } = renderWithProviders(<AppHeader />);

    expect(getByRole("banner")).toHaveStyle(
      "background-color: rgb(176, 226, 222);"
    );
  });

  test("clicking on the hamburger button opens the menu", async () => {
    const { getByLabelText, getByTestId } = renderWithProviders(<AppHeader />);

    const user = userEvent.setup();
    const hamburgerButton = getByLabelText("Menu");
    expect(getByTestId("menu")).not.toBeVisible();

    await user.click(hamburgerButton);
    expect(getByTestId("menu")).toBeVisible();
  });

  test.skip("menu can be opened from keyboard", async () => {
    const { queryByText } = renderWithProviders(<AppHeader />);

    const user = userEvent.setup();
    expect(queryByText("Home")).not.toBeVisible();

    await user.keyboard("{tab}");
    await user.keyboard("{tab}");
    await user.keyboard("{Enter}");
    expect(queryByText("Home")).toBeVisible();
  });
});
