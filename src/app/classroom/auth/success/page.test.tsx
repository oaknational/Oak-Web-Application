import React from "react";

import Page from "./page";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const useSearchParamsMock = jest.fn();
const authSuccessViewMock = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
  useSearchParams: () => useSearchParamsMock(),
}));

jest.mock("@oaknational/google-classroom-addon/ui", () => ({
  GoogleClassroomAuthSuccessView: (props: never) => {
    authSuccessViewMock(props);
    return <div data-testid="auth-success">Success</div>;
  },
}));

describe("src/app/classroom/auth/success/page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams("s=session-1&at=token-1"),
    );
  });

  it("renders success view when params exist", () => {
    renderWithTheme(<Page />);

    expect(authSuccessViewMock).toHaveBeenCalledWith(
      expect.objectContaining({
        session: "session-1",
        accessToken: "token-1",
      }),
    );
  });

  it("decodes encoded params", () => {
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams(
        `s=${encodeURIComponent("session=with+equals")}&at=${encodeURIComponent("token space")}`,
      ),
    );

    renderWithTheme(<Page />);

    expect(authSuccessViewMock).toHaveBeenCalledWith(
      expect.objectContaining({
        session: "session=with+equals",
        accessToken: "token space",
      }),
    );
  });

  it("shows fallback when params missing", () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams(""));

    const { getByText } = renderWithTheme(<Page />);

    expect(getByText("An error occurred.")).toBeInTheDocument();
    expect(authSuccessViewMock).not.toHaveBeenCalled();
  });
});
