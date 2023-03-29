import "../__tests__/__helpers__/LocalStorageMock";

import removeDecommissionedKeys from "./removeDecommissionedKeys";

jest.mock("./localStorageKeys", () => ({
  decommissionedKeys: [
    {
      key: "some-old-feature-key",
      decommissionedAt: "2023-03-15",
    },
    { key: "another old feature key", decommissionedAt: "2023-03-15" },
  ],
}));
jest.spyOn(localStorage, "removeItem");

describe("removeDecommissionedKeys", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("removes the first key", () => {
    removeDecommissionedKeys();
    expect(localStorage.removeItem).toHaveBeenCalledWith(
      "some-old-feature-key"
    );
  });
  test("removes the correct number of keys", () => {
    removeDecommissionedKeys();
    expect(localStorage.removeItem).toHaveBeenCalledTimes(2);
  });
});
