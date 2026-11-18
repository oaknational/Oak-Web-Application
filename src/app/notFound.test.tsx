import NotFound from "./not-found";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("notFound", () => {
  it("shows 404", async () => {
    const { container } = render(NotFound());
    expect(container).toHaveTextContent("404");
  });
});
