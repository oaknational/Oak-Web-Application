import { screen } from "@testing-library/react";

import renderWithProviders from "../__helpers__/renderWithProviders";
import Custom500 from "../../pages/500";

import { defaultTopNavProps } from "@/pages/_error";

const render = renderWithProviders();

describe("pages/500.tsx", () => {
  it("Renders 500 message ", async () => {
    render(<Custom500 topNav={defaultTopNavProps} />);
    expect(screen.getByTestId("errorStatus")).toHaveTextContent("500");
  });
});
