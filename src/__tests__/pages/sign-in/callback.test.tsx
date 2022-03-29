import { waitFor } from "@testing-library/react";

import renderWithProviders from "../../__helpers__/renderWithProviders";
import SignInCallback from "../../../pages/sign-in/callback";

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
  it("calls router.replace()", async () => {
    renderWithProviders(<SignInCallback />);

    await waitFor(() => {
      expect(routerReplace).toHaveBeenCalledWith("/sign-in/error", undefined, {
        shallow: true,
      });
    });
  });
});
