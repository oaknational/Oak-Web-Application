import "../../__tests__/__helpers__/LocalStorageMock";

import getHasConsentedTo from "./getHasConsentedTo";

describe("getHasConsentedTo", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  test("returns true if user has consented to most recent policy", () => {
    window.localStorage.setItem(
      "metomic-consented-pol:b109d120-ec88-4dd7-9f6e-fc67ab6f0ffb",
      JSON.stringify({ enabled: true })
    );

    expect(getHasConsentedTo("statistics")).toBe(true);
  });
  test("returns false if user has not consented to policy", () => {
    window.localStorage.setItem(
      "metomic-consented-pol:b109d120-ec88-4dd7-9f6e-fc67ab6f0ffb",
      JSON.stringify({ enabled: false })
    );

    expect(getHasConsentedTo("statistics")).toBe(false);
  });

  /**
   * @TODO currently we can't achieve this behaviour, we will fix it when
   * we build our own solution
   */
  test.todo(
    "returns false if user has consented to a previous version of the policy but not the new one"
  );
});
