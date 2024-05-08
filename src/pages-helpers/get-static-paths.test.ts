import { getStaticPaths } from "./get-static-paths";

describe("getStaticPaths", () => {
  it("Should not generate pages at build time", async () => {
    const res = await getStaticPaths();
    expect(res).toEqual({
      fallback: "blocking",
      paths: [],
    });
  });
});
