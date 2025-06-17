import { renderHook } from "@testing-library/react";

import useBugSnag, { UseBugsnagProps } from "./useBugsnag";

const setUserMock = jest.fn();
const pauseSessionMock = jest.fn();
const clientMock = jest.fn(() => false);
jest.mock("@bugsnag/js", () => ({
  __esModule: true,
  default: {
    get _client() {
      return clientMock();
    },
    pauseSession: (...args: []) => pauseSessionMock(...args),
    setUser: (...args: []) => setUserMock(...args),
  },
}));

const initialiseBugsnag = jest.fn();
jest.mock("../../common-lib/error-reporter", () => ({
  __esModule: true,
  initialiseBugsnag: (...args: unknown[]) => initialiseBugsnag(...args),
}));

describe("useBugSnag", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.resetModules();
  });

  test("should call initialiseBugsnag() with the correct gleap config", () => {
    const initialArgs = { enabled: true, userId: "not_a_user" };
    renderHook(() => useBugSnag(initialArgs));

    expect(initialiseBugsnag).toHaveBeenCalledWith(initialArgs.userId);
  });
  test("should set userId on Bugsnag", () => {
    const initialArgs = { enabled: true, userId: null };
    const { rerender } = renderHook((args: UseBugsnagProps = initialArgs) =>
      useBugSnag(args),
    );
    expect(initialiseBugsnag).toHaveBeenCalledWith(null);
    expect(setUserMock).not.toHaveBeenCalled();

    clientMock.mockReturnValue(true);
    rerender({ enabled: true, userId: "not_a_user" });
    expect(setUserMock).toHaveBeenCalledWith("not_a_user");
  });
  test("should get paused if consent revoked", () => {
    const initialArgs = { enabled: false, userId: "not_a_user" };
    const { rerender } = renderHook((args: UseBugsnagProps = initialArgs) =>
      useBugSnag(args),
    );
    expect(initialiseBugsnag).not.toHaveBeenCalled();

    rerender({ enabled: true, userId: "not_a_user" });
    expect(initialiseBugsnag).toHaveBeenCalledWith(initialArgs.userId);
  });
});
