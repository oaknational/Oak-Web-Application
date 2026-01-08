import { screen } from "@testing-library/react";

import renderWithProviders from "../__helpers__/renderWithProviders";
import Custom404 from "../../pages/404";

import { defaultTopNavProps } from "@/pages/_error";

const render = renderWithProviders();

describe("pages/404.tsx", () => {
  it("Renders 404 message ", () => {
    render(<Custom404 topNav={defaultTopNavProps} />);
    expect(screen.getByTestId("errorStatus")).toHaveTextContent("404");
  });
});
