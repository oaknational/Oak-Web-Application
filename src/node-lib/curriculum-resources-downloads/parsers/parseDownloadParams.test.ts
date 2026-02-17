import { parseDownloadParams } from "./parseDownloadParams";

describe("parseParams", () => {
  const result = parseDownloadParams(
    new URLSearchParams({
      foo: "bar",
      baz: "qux,quux",
      corge: "",
    }),
  );
  it("should convert string to array", () => {
    expect(result.foo).toEqual(["bar"]);
  });
  it("should split comma-separated values into array", () => {
    expect(result.baz).toEqual(["qux", "quux"]);
  });
  it("should remove empty values", () => {
    expect(result.corge).toBeUndefined();
  });
});
