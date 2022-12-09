import { screen, waitFor } from "@testing-library/react";

import SubjectTierPage from "../../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects";
import renderWithProviders from "../../__helpers__/renderWithProviders";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("pages/teachers/key-stages/[keyStageSlug]/subjects/", () => {
  it("Renders title ", () => {
    renderWithProviders(<SubjectTierPage />);

    waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Tiers page"
      );
    });
  });
});
