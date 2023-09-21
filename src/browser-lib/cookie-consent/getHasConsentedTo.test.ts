import "../../__tests__/__helpers__/LocalStorageMock";

import getHasConsentedTo from "./getHasConsentedTo";

describe("getHasConsentedTo", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  test("returns 'pending' if user has consented to most recent policy", () => {
    window.localStorage.setItem(
      "metomic-consented-pol:b109d120-ec88-4dd7-9f6e-fc67ab6f0ffb",
      JSON.stringify({ enabled: true }),
    );

    expect(getHasConsentedTo("posthog")).toBe("enabled");
  });
  test("returns 'disabled' if user has denied consent to policy", () => {
    window.localStorage.setItem(
      "metomic-consented-pol:b109d120-ec88-4dd7-9f6e-fc67ab6f0ffb",
      JSON.stringify({ enabled: false }),
    );

    expect(getHasConsentedTo("posthog")).toBe("disabled");
  });
  test("returns 'pending' if user has neither denied nor consented to policy", () => {
    window.localStorage.setItem(
      "metomic-consented-pol:b109d120-ec88-4dd7-9f6e-fc67ab6f0ffb",
      JSON.stringify({ enabled: null }),
    );

    expect(getHasConsentedTo("posthog")).toBe("pending");
  });

  /**
   * @TODO currently we can't achieve this behaviour, we will fix it when
   * we build our own solution
   */
  test.todo(
    "returns false if user has consented to a previous version of the policy but not the new one",
  );
});
