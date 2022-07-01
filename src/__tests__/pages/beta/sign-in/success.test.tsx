import { screen } from "@testing-library/react";

import renderWithProviders from "../../../__helpers__/renderWithProviders";
import SignInSuccess from "../../../../pages/beta/sign-in/success";

describe("pages/beta/sign-in/error.tsx", () => {
  it("renders a success message", () => {
    renderWithProviders(<SignInSuccess />);

    expect(screen.getByTestId("sign-in-success-message")).toHaveTextContent(
      "Thanks for signing in"
    );
  });
});
