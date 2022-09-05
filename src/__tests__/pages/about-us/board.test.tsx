import { screen, waitFor } from "@testing-library/react";

import renderWithProviders from "../../__helpers__/renderWithProviders";
import AboutBoard from "../../../pages/about-us/board";

import { testAboutPageData } from "./who-we-are.test";

describe("pages/about us who we are.tsx", () => {
  it("Renders correct title ", async () => {
    renderWithProviders(
      <AboutBoard pageData={testAboutPageData} isPreviewMode={false} />
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "About us"
      );
    });
  });
});
