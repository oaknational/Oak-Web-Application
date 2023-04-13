import { screen } from "@testing-library/react";

import renderWithProviders from "../__helpers__/renderWithProviders";
import Custom404 from "../../pages/404";

const render = renderWithProviders();

describe("pages/404.tsx", () => {
  it("Renders 404 message ", () => {
    render(<Custom404 />);
    expect(screen.getByTestId("errorStatus")).toHaveTextContent("404");
  });
});
