import { fireEvent, waitFor } from "@testing-library/react";

import renderWithProviders from "../__helpers__/renderWithProviders";
import SignIn from "../../pages/sign-in";

describe("pages/sign-in.tsx", () => {
  it("should contain email input", async () => {
    const { getByTestId } = renderWithProviders(<SignIn />);

    await waitFor(() => {
      // @TODO: use find by label text here
      expect(getByTestId("sign-in-email-input")).toBeTruthy();
    });
  });
  it("should contain a sign in button", async () => {
    const { getByRole } = renderWithProviders(<SignIn />);

    await waitFor(() => {
      expect(
        getByRole("button", {
          name: /sign in/i,
        })
      ).toHaveTextContent("Sign in");
    });
  });

  describe("clicking 'sign in'", () => {
    it("should should display 'link requested' message ", async () => {
      const { getByTestId, getByText, getByRole } = renderWithProviders(
        <SignIn />
      );

      const testEmail = "test@thenational.academy";
      const emailInput = getByTestId("sign-in-email-input");
      const submitButton = getByRole("button", {
        name: /sign in/i,
      });
      fireEvent.change(emailInput, {
        target: { value: testEmail },
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(getByText(/we sent/i)).toHaveTextContent(
          `We sent a link to ${testEmail}.`
        );
      });
    });
    it("should display a 'go back' button, which takes you back", async () => {
      const { getByTestId, getByRole } = renderWithProviders(<SignIn />);

      const testEmail = "test@thenational.academy";
      const emailInput = getByTestId("sign-in-email-input");
      const submitButton = getByRole("button", {
        name: /sign in/i,
      });
      fireEvent.change(emailInput, {
        target: { value: testEmail },
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const goBackButton = getByRole("button", { name: /go back/i });
        fireEvent.click(goBackButton);
      });

      expect(getByTestId("sign-in-email-input")).toBeTruthy;
    });
  });
});
