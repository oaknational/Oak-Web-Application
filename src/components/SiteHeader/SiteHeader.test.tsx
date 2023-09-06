import userEvent from "@testing-library/user-event";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import SiteHeader from ".";

const render = renderWithProviders();

describe("components/SiteHeader", () => {
  test("logo should accessibly link to the home page", () => {
    const { getByRole } = render(<SiteHeader />);

    const logoLink = getByRole("link", {
      name: "Oak National Academy",
    });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");
  });
  test("header should be in the document", () => {
    const { getByRole } = render(<SiteHeader />);

    expect(getByRole("banner")).toBeInTheDocument();
  });

  test("it should contain a link to classroom", () => {
    const { getByTestId } = render(<SiteHeader />);

    expect(getByTestId("SiteHeaderClassroomLink").closest("a")).toHaveAttribute(
      "href",
      "https://classroom.thenational.academy",
    );
  });

  test("it should contain a link to teachers hub", () => {
    const { getByText } = render(<SiteHeader />);

    expect(getByText("Teacher Hub").closest("a")).toHaveAttribute(
      "href",
      "https://teachers.thenational.academy",
    );
  });

  test("clicking on the hamburger button opens the menu", async () => {
    const { getByLabelText, getByTestId } = render(<SiteHeader />);

    const user = userEvent.setup();
    const hamburgerButton = getByLabelText("Menu");
    expect(getByTestId("menu")).not.toBeVisible();

    await user.click(hamburgerButton);
    expect(getByTestId("menu")).toBeVisible();
  });

  test("menu can be opened from keyboard", async () => {
    const { queryByText } = render(<SiteHeader />);

    const user = userEvent.setup();
    expect(queryByText("Home")).not.toBeVisible();

    await user.keyboard("{tab}");
    await user.keyboard("{tab}");
    await user.keyboard("{Enter}");
    expect(queryByText("Home")).toBeVisible();
  });
});
