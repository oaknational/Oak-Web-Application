import { screen, waitFor } from "@testing-library/react";

import renderWithProviders from "../__helpers__/renderWithProviders";
import SignIn from "../../pages/sign-in";

describe("pages/sign-in.tsx", () => {
  it("should contain email input", async () => {
    renderWithProviders(<SignIn />);

    await waitFor(() => {
      // @TODO: use find by label text here
      expect(screen.getByTestId("sign-in-email-input")).toBeTruthy();
    });
  });
  it("should contain a sign in button", async () => {
    renderWithProviders(<SignIn />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /sign in/i,
        })
      ).toHaveTextContent("Sign up/ sign in");
    });
  });
});
