import { createXmlIndexMap } from "./helper";

describe("createXmlIndexMap", () => {
  it("should return XML and mapped keys/indexes", () => {
    const { xml, indexMap } = createXmlIndexMap({
      foo: "test1",
      bar: "test2",
    });
    expect(xml).toEqual("test1\ntest2");
    expect(indexMap).toEqual({ foo: "0", bar: "1" });
  });
});
