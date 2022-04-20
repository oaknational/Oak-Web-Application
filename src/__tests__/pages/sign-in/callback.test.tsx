import { waitFor } from "@testing-library/react";

import renderWithProviders from "../../__helpers__/renderWithProviders";
import SignInCallback from "../../../pages/sign-in/callback";
import MockedAuthProvider from "../../__helpers__/MockedAuthProvider";

const testEmail = "test@thenational.academy";
const routerReplace = jest.fn();

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
      replace: routerReplace,
    };
  },
}));

describe("pages/sign-in/callback.tsx", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("redirects to /sign-in/success", async () => {
    window.prompt = jest.fn(() => testEmail);

    renderWithProviders(<SignInCallback />);

    await waitFor(() => {
      expect(routerReplace).toHaveBeenCalledWith(
        "/sign-in/success",
        undefined,
        {
          shallow: true,
        }
      );
    });
  });

  it("redirects to /sign-in/error", async () => {
    window.prompt = jest.fn(() => "wrongemail@thenational.academy");

    renderWithProviders(
      <MockedAuthProvider
        value={{
          signInWithEmailCallback: () => Promise.reject("Failed to sign in"),
        }}
      >
        <SignInCallback />
      </MockedAuthProvider>
    );

    await waitFor(() => {
      expect(routerReplace).toHaveBeenCalledWith("/sign-in/error", undefined, {
        shallow: true,
      });
    });
  });
});
