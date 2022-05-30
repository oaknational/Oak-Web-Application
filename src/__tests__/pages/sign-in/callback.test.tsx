import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import renderWithProviders from "../../__helpers__/renderWithProviders";
import SignInCallback from "../../../pages/sign-in/callback";
import { loggedInAuthProviderProps } from "../../__helpers__/MockedAuthProvider";

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
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });
  it("calls signInWithEmailCallback()", async () => {
    const signInWithEmailCallback = jest.fn();
    const { getByRole, getByTestId } = renderWithProviders(
      <SignInCallback />,
      {},
      {
        authProviderProps: {
          value: {
            signInWithEmailCallback,
            user: null,
          },
        },
      }
    );
    const input = getByRole("textbox");
    const user = userEvent.setup();
    await user.click(input);
    await user.keyboard(testEmail);

    const button = getByTestId("callback-signin-button");
    await user.click(button);

    await waitFor(() => {
      expect(signInWithEmailCallback).toHaveBeenCalledWith(testEmail);
    });
  });
  it("redirects to /sign-in/success", async () => {
    renderWithProviders(
      <SignInCallback />,
      {},
      { authProviderProps: loggedInAuthProviderProps }
    );

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
    const { getByRole, getByTestId } = renderWithProviders(
      <SignInCallback />,
      {},
      {
        authProviderProps: {
          value: {
            signInWithEmailCallback: jest.fn(() => Promise.reject()),
          },
        },
      }
    );

    const input = getByRole("textbox");
    const user = userEvent.setup();
    await user.click(input);
    await user.keyboard(testEmail);

    const button = getByTestId("callback-signin-button");
    await user.click(button);

    await waitFor(() => {
      expect(routerReplace).toHaveBeenCalledWith("/sign-in/error", undefined, {
        shallow: true,
      });
    });
  });
});
