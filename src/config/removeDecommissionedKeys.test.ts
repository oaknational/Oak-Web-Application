import { beforeEach, describe, expect, it, vi } from "vitest";

import "../__tests__/__helpers__/LocalStorageMock";

import removeDecommissionedKeys from "./removeDecommissionedKeys";

vi.mock("./localStorageKeys", () => ({
  decommissionedKeys: [
    {
      key: "some-old-feature-key",
      decommissionedAt: "2023-03-15",
    },
    { key: "another old feature key", decommissionedAt: "2023-03-15" },
  ],
}));
vi.spyOn(localStorage, "removeItem");

describe("removeDecommissionedKeys", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("removes the first key", () => {
    removeDecommissionedKeys();
    expect(localStorage.removeItem).toHaveBeenCalledWith(
      "some-old-feature-key",
    );
  });
  it("removes the correct number of keys", () => {
    removeDecommissionedKeys();
    expect(localStorage.removeItem).toHaveBeenCalledTimes(2);
  });
});
