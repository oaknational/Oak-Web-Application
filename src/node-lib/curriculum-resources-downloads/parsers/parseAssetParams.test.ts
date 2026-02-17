import { parseAssetParams } from "./parseAssetParams";

describe("parseAssetParams", () => {
  const result = parseAssetParams(
    new URLSearchParams({
      foo: "bar",
      baz: "qux",
      corge: "",
    }),
  );
  it("should return the value for the key", () => {
    expect(result.foo).toEqual("bar");
    expect(result.baz).toEqual("qux");
  });

  it("should remove empty values", () => {
    expect(result.corge).toBeUndefined();
  });
});
