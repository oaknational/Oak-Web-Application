import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

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
      "https://classroom.thenational.academy/"
    );
  });

  test("it should contain a link to teachers hub", () => {
    const { getByText } = renderWithProviders(<SiteHeader />);

    expect(getByText("Teacher Hub").closest("a")).toHaveAttribute(
      "href",
      "https://teachers.thenational.academy/"
    );
  });
});
