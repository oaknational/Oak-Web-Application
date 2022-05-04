import { screen } from "@testing-library/react";

import renderWithProviders from "../__helpers__/renderWithProviders";
import Custom404 from "../../pages/404";

describe("pages/404.tsx", () => {
  it("Renders 404 message ", () => {
    renderWithProviders(<Custom404 />);
    expect(screen.getByTestId("404Heading")).toHaveTextContent(
      "404 - Page Not Found"
    );
  });
  it("contains a button with link to homepage", () => {
    renderWithProviders(<Custom404 />);

    expect(screen.getByText("Homepage").closest("a")).toHaveAttribute(
      "href",
      "/"
    );
  });
});
