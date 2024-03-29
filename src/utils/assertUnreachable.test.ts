import { assertUnreachable } from "./assertUnreachable";

describe("assertUnreachable", () => {
  it("causes a type error when used in a switch", () => {
    /**
     * This test has 0 assertions and exists to check the
     * type error generated by calling the function
     *
     * If you remove the @ts-expect-error you should see:
     *   Argument of type 'string' is not assignable to parameter of type 'never'
     * If you uncomment `case "bar"` the @ts-expect-error will become invalid
     * as the switch is now exhaustive, and it's no longer a type error
     */
    const switchable = "foo" as "foo" | "bar";

    switch (switchable) {
      case "foo":
        // case "bar":
        break;
      default:
        // @ts-expect-error - this should be a type error when the switch is exhaustive
        assertUnreachable(switchable);
    }
  });

  it("throws an error when called", () => {
    expect(() => {
      assertUnreachable("" as never);
    }).toThrow();
  });

  it("throws the provided custom error", () => {
    const customError = new Error("Custom error");

    expect(() => {
      assertUnreachable("" as never, customError);
    }).toThrow(customError);
  });
});
