import { getOakGlobals, setOakGlobals } from "./oakGlobals";

describe("oakGlobals", () => {
  test("getOakGlobals should get the latest value of window.__oakGlobals", () => {
    const testValue = { foo: "bantz" };

    // eslint-disable-next-line
    // @ts-ignore
    window.__oakGlobals = testValue;

    expect(getOakGlobals()).toBe(testValue);
  });
  test("setOakGlobals should merge values", () => {
    const testValue = { foo: "bantz" };

    // eslint-disable-next-line
    // @ts-ignore
    window.__oakGlobals = testValue;
    const newValue = { hubspot: { scriptLoaded: true } };

    setOakGlobals(newValue);

    expect(getOakGlobals()).toEqual({ ...testValue, ...newValue });
  });
});
