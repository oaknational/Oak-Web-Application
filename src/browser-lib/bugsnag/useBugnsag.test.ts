import { renderHook } from "@testing-library/react";

import useBugSnag from "./useBugsnag";

jest.mock("@bugsnag/js", () => ({
  __esModule: true,
  default: { _client: false },
}));

const setUser = jest.fn();
const initialiseBugsnag = jest.fn(() => {
  return {
    setUser: setUser,
    startSession: () => {},
    pauseSession: () => {},
  };
});
jest.mock("../../common-lib/error-reporter", () => ({
  __esModule: true,
  initialiseBugsnag: () => initialiseBugsnag(),
}));

describe("useBugSnag", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  test("should call initialiseBugsnag() with the correct gleap config", () => {
    const initialArgs = { enabled: true, userId: "not_a_user" };
    renderHook(() => useBugSnag(initialArgs));

    expect(initialiseBugsnag).toHaveBeenCalled();
    expect(setUser).toHaveBeenCalledWith(initialArgs.userId);
  });
  test.todo("should set userId on Bugsnag");
  test.todo("should get paused if consent revoked");
});
