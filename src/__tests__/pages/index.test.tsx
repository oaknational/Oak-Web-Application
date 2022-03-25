import { screen, waitFor } from "@testing-library/react";

import Home from "../../pages";
import renderWithProviders from "../__helpers__/renderWithProviders";

describe("pages/index.tsx", () => {
  it("Renders 'loading' during fetch", async () => {
    renderWithProviders(<Home />);

    expect(screen.getByText(/^Status:/).textContent).toBe("Status: loading");
  });
  it("Renders lesson title after fetch", async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "Physics only review"
      );
    });
  });
});
