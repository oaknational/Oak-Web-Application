import { fireEvent, screen } from "@testing-library/react";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import A from "./A";

describe("A", () => {
  it("is a link if clicked", async () => {
    const { getByText } = renderWithProviders(
      <A href={"https://www.test.com"} data-testid="test" mb={12}>
        Click Me!
      </A>
    );

    const link = getByText("Click Me!");

    fireEvent.click(link);

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://www.test.com"
    );
  });
});
