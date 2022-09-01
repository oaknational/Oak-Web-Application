import userEvent from "@testing-library/user-event";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";
import { getPupilsUrl, getTeachersUrl } from "../../common-lib/urls";

import SiteHeader from ".";

describe("components/SiteHeader", () => {
  test("header should be in the document", () => {
    const { getByRole } = renderWithProviders(<SiteHeader />);

    expect(getByRole("banner")).toBeInTheDocument();
  });

  test("it should contain a link to classroom", () => {
    const { getByText } = renderWithProviders(<SiteHeader />);

    expect(getByText("Classroom").closest("a")).toHaveAttribute(
      "href",
      getPupilsUrl()
    );
  });

  test("it should contain a link to teachers hub", () => {
    const { getByText } = renderWithProviders(<SiteHeader />);

    expect(getByText("Teacher Hub").closest("a")).toHaveAttribute(
      "href",
      getTeachersUrl()
    );
  });

  test("clicking on the hamburger button opens the menu", async () => {
    const { getByLabelText, queryByText } = renderWithProviders(<SiteHeader />);

    const user = userEvent.setup();
    const hamburgerButton = getByLabelText("Menu");
    expect(queryByText("Home")).not.toBeInTheDocument;

    await user.click(hamburgerButton);
    expect(queryByText("Home")).toBeInTheDocument;
  });

  test.todo("Open from keyboard");
});
