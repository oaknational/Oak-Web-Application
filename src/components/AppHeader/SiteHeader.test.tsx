import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import AppHeader from ".";

describe("components/SiteHeader", () => {
  test("header should be in the document", () => {
    const { getByRole } = renderWithProviders(<AppHeader />);

    expect(getByRole("banner")).toBeInTheDocument();
  });
});
