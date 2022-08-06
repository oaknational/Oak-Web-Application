import { screen, waitFor } from "@testing-library/react";

import Policies from "../../pages/legal/[policyPageSlug]";
import renderWithProviders from "../__helpers__/renderWithProviders";
import policyPageBody from "../../browser-lib/fixtures/policyPageBody";

describe("policyPage", () => {
  it("Renders title from props ", async () => {
    renderWithProviders(
      <Policies
        policy={{
          title: "Privacy Policy",
          updatedAt: "2022",
          body: policyPageBody,
        }}
        isPreviewMode={false}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Privacy Policy"
      );
    });
  });
});
