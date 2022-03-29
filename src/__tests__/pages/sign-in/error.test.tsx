import { screen } from "@testing-library/react";

import renderWithProviders from "../../__helpers__/renderWithProviders";
import SignInError from "../../../pages/sign-in/error";

describe("pages/sign-in/error.tsx", () => {
  it("renders an error message", () => {
    renderWithProviders(<SignInError />);

    expect(screen.getByTestId("sign-in-error-message")).toHaveTextContent(
      "There was an error signing you in"
    );
  });
});
