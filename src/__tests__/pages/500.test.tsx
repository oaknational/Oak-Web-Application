import { screen } from "@testing-library/react";

import renderWithProviders from "../__helpers__/renderWithProviders";
import Custom500 from "../../pages/500";

describe("pages/500.tsx", () => {
  it("Renders 500 message ", async () => {
    renderWithProviders(<Custom500 />);
    expect(screen.getByTestId("errorStatus")).toHaveTextContent("500");
  });
});
