import sanityGraphqlApi from "../../sanity-graphql";

import { getAllPaths, resolveReferences } from "./resolveReferences";

jest.mock("../../sanity-graphql");

describe("resolveReferences", () => {
  describe("getAllPaths", () => {
    it("returns all paths to a match", () => {
      const obj1 = {
        foo: { bar: [{ baz: "bing" }, { baz: "bing" }] },
      };

      const matcher = (v: unknown) => (v as { baz: string })?.baz === "bing";

      expect(getAllPaths(obj1, matcher)).toEqual([
        ["foo", "bar", "0"],
        ["foo", "bar", "1"],
      ]);
    });
  });

  describe("resolveReferences", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetModules();

      (
        sanityGraphqlApi.blogPortableTextReferences as jest.Mock
      ).mockReturnValue({
        allDocument: [
          { _id: "ref2", assetId: "abcdef" },
          { _id: "ref1", url: "https://example.com/foo.png" },
        ],
      });
    });

    const mockObjWithReferences = {
      foo: {
        bar: {
          image: { _type: "reference", _ref: "ref1" },
        },
      },
      baz: [
        {
          video: { _type: "reference", _ref: "ref2" },
        },
      ],
    };

    it("replaces each _ref object with the result of the query", async () => {
      const resolved = await resolveReferences(mockObjWithReferences);
      expect(resolved.foo.bar.image).toMatchObject({
        _id: "ref1",
        url: "https://example.com/foo.png",
      });

      expect(resolved.baz[0].video).toMatchObject({
        _id: "ref2",
        assetId: "abcdef",
      });
    });

    it("calls api.blogPortableTextReferences with each referenced ID", async () => {
      await resolveReferences(mockObjWithReferences);

      expect(sanityGraphqlApi.blogPortableTextReferences).toBeCalledWith({
        ids: ["ref1", "ref2"],
      });
    });
  });
});
