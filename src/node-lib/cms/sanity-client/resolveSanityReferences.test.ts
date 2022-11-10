import OakError from "../../../errors/OakError";
import sanityGraphqlApi from "../../sanity-graphql";

import {
  getAllPaths,
  resolveSanityReferences,
} from "./resolveSanityReferences";

jest.mock("../../sanity-graphql");

const mockSanityGraphqlApi = sanityGraphqlApi as jest.MockedObject<
  typeof sanityGraphqlApi
>;

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

      mockSanityGraphqlApi.blogPortableTextReferences.mockResolvedValue({
        allDocument: [
          {
            contentType: "newsPost",
            _type: "newsPost",
            id: "ref2",
            slug: { current: "some-blog-post" },
          },
          {
            contentType: "sanity.imageAsset",
            _type: "sanity.imageAsset",
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
      const resolved = await resolveSanityReferences(mockObjWithReferences);
      expect(resolved.foo.bar.post).toMatchObject({
        contentType: "sanity.imageAsset",
        id: "ref1",
        url: "https://example.com/foo.png",
        _key: "001",
      });

      expect(resolved?.baz?.[0]?.image).toMatchObject({
        contentType: "newsPost",
        id: "ref2",
        slug: "some-blog-post",
      });
    });

    it("calls api.blogPortableTextReferences with each referenced ID", async () => {
      await resolveSanityReferences(mockObjWithReferences);

      expect(sanityGraphqlApi.blogPortableTextReferences).toBeCalledWith({
        ids: ["ref1", "ref2"],
      });
    });

    it("throws an OakError with metadata when it can't match refs to responses", async () => {
      const mockErrorCausingResponse = [
        {
          contentType: "aboutCorePage",
          _type: "aboutCorePage",
          id: "wont-be-found",
        },
      ];

      mockSanityGraphqlApi.blogPortableTextReferences.mockResolvedValue({
        allDocument: mockErrorCausingResponse,
      });

      const capturedError = await resolveSanityReferences(
        mockObjWithReferences
      ).catch((err) => err);

      await expect(
        async () => await resolveSanityReferences(mockObjWithReferences)
      ).rejects.toThrowError(
        new OakError({ code: "cms/invalid-reference-data" })
      );

      expect(capturedError.meta).toEqual({
        portableTextPath: ["foo", "bar", "post"],
        portableTextRefId: "ref1",
        queryResults: JSON.stringify(mockErrorCausingResponse),
      });
    });
  });
});
