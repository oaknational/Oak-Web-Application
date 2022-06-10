import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import SiteHeader from ".";

describe("components/SiteHeader", () => {
  test("header should be in the document", () => {
    const { getByRole } = renderWithProviders(<SiteHeader />);

    expect(getByRole("banner")).toBeInTheDocument();
  });
});
