import { describe, expect, it } from "vitest";

import { THEME_NAMES } from "../../hooks/useOakTheme";

import { getOakGlobals, setOakGlobals } from "./oakGlobals";

describe("oakGlobals", () => {
  it("getOakGlobals should get the latest value of window.__oakGlobals", () => {
    const testValue = { foo: "bantz" };

    // eslint-disable-next-line
    // @ts-ignore
    window.__oakGlobals = testValue;

    expect(getOakGlobals()).toBe(testValue);
  });
  it("setOakGlobals should merge values", () => {
    const testValue = { foo: "bantz" };

    // eslint-disable-next-line
    // @ts-ignore
    window.__oakGlobals = testValue;
    const newValue = {
      oakThemes: { setTheme: vi.fn(), availableThemes: THEME_NAMES },
    };

    setOakGlobals(newValue);

    expect(getOakGlobals()).toEqual({ ...testValue, ...newValue });
  });
});
