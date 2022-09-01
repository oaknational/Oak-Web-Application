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
          {
            contentType: "newsPost",
            id: "ref2",
            slug: { current: "some-blog-post" },
          },
          {
            contentType: "sanity.imageAsset",
            id: "ref1",
            _id: "ref1",
            url: "https://example.com/foo.png",
          },
        ],
      });
    });

    const mockObjWithReferences = {
      foo: {
        bar: {
          post: { _type: "reference", _ref: "ref1", _key: "001" },
        },
      },
      baz: [
        {
          image: { _type: "reference", _ref: "ref2" },
        },
      ],
    };

    it("merges each _ref object with the result of the query", async () => {
      const resolved = await resolveReferences(mockObjWithReferences);
      expect(resolved.foo.bar.post).toMatchObject({
        contentType: "sanity.imageAsset",
        id: "ref1",
        url: "https://example.com/foo.png",
        _key: "001",
      });

      expect(resolved.baz[0].image).toMatchObject({
        contentType: "newsPost",
        id: "ref2",
        slug: { current: "some-blog-post" },
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
