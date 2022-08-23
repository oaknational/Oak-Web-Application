import { screen, waitFor } from "@testing-library/react";

import renderWithProviders from "../__helpers__/renderWithProviders";
import AboutWorkWithUs from "../../pages/about-us/work-with-us";
import { testAboutPageData } from "../pages/about-who-we-are.test";

describe("pages/about board.tsx", () => {
  it("Renders correct title ", async () => {
    renderWithProviders(
      <AboutWorkWithUs pageData={testAboutPageData} isPreviewMode={false} />
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "about us"
      );
    });
  });
});
