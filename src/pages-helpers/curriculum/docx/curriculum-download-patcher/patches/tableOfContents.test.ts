import { tableOfContentsPatch } from "./tableOfContents";

describe("tableOfContents", () => {
  it("should modify node if present", async () => {
    const patcher = tableOfContentsPatch();

    const node = await patcher({
      type: "text",
      text: "testing {{=TABLE_OF_CONTENTS}} a node",
    });

    expect(node).toEqual({
      type: "cdata",
      cdata: "testing TODO a node",
    });
  });

  it("should not modify invalid element", async () => {
    const patcher = await tableOfContentsPatch();

    const node = await patcher({
      type: "text",
      text: "testing {{=FOOBAR}} a node",
    });

    expect(node).toEqual({
      type: "text",
      text: "testing {{=FOOBAR}} a node",
    });
  });
});
