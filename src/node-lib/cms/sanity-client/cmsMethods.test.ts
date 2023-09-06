import { z } from "zod";

import { parseResults } from "./parseResults";
import { resolveSanityReferences } from "./resolveSanityReferences";
import { getBySlug, getList, getSingleton } from "./cmsMethods";

jest.mock("./parseResults", () => {
  const original = jest.requireActual("./parseResults");
  return {
    __esModule: true,
    parseResults: jest.fn(original.parseResults),
  };
});

jest.mock("./resolveSanityReferences", () => {
  return {
    __esModule: true,
    // Return self without transform, bypassing any errors caused by
    // dodgy mocks
    resolveSanityReferences: jest.fn((x) => x),
  };
});

describe("cms/sanity-client/cmsMethods", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe("getSingleton", () => {
    const singletonGraphQLMethod = jest
      .fn()
      .mockResolvedValue({ allResults: [{ foo: "bar" }] });

    const singletonClientMethod = getSingleton(
      singletonGraphQLMethod,
      z.any(),
      (res) => res.allResults?.[0],
    );

    it("invokes the provided graphql client method", async () => {
      await singletonClientMethod();
      expect(singletonGraphQLMethod).toBeCalled();
    });

    it("returns the value from getResultValue", async () => {
      const res = await singletonClientMethod();
      expect(res).toEqual({ foo: "bar" });
    });

    it("returns null when no content is found", async () => {
      const nullReturningSingletonClientMethod = getSingleton(
        jest.fn().mockResolvedValue({}),
        z.any(),
        (res) => res.allResults?.[0],
      );

      const res = await nullReturningSingletonClientMethod();
      expect(res).toBeNull();
    });

    it("attempts to resolve embedded portable text references", async () => {
      await singletonClientMethod();
      expect(resolveSanityReferences).toBeCalled();
    });

    it("does not fetch draft content by default", async () => {
      await singletonClientMethod();
      expect(singletonGraphQLMethod).toBeCalledWith(
        expect.objectContaining({ isDraftFilter: { is_draft: false } }),
      );
    });

    it("fetches draft content when previewMode flag is passed", async () => {
      await singletonClientMethod({ previewMode: true });
      expect(singletonGraphQLMethod).toBeCalledWith(
        expect.objectContaining({ isDraftFilter: { is_draft: undefined } }),
      );
    });

    it("passes previewMode flag to parseResults when false", async () => {
      await singletonClientMethod();
      expect(parseResults).toBeCalledWith(
        expect.anything(),
        expect.anything(),
        /* isPreviewMode: */ undefined,
      );
    });

    it("passes previewMode flag to parseResults when true", async () => {
      await singletonClientMethod({ previewMode: true });
      expect(parseResults).toBeCalledWith(
        expect.anything(),
        expect.anything(),
        /* isPreviewMode: */ true,
      );
    });
  });

  describe("getBySlug", () => {
    const bySlugGraphQLMethod = jest
      .fn()
      .mockResolvedValue({ allResults: [{ foo: "bar" }] });
    const bySlugClientMethod = getBySlug(
      bySlugGraphQLMethod,
      z.any(),
      (res) => res.allResults?.[0],
    );

    it("invokes the provided graphql client method", async () => {
      await bySlugClientMethod("some-slug");
      expect(bySlugGraphQLMethod).toBeCalled();
    });

    it("returns the value of getResultValue", async () => {
      const res = await bySlugClientMethod("some-slug");
      expect(res).toEqual({ foo: "bar" });
    });

    it("returns null when no content is found", async () => {
      const nullReturningBySlugClientMethod = getBySlug(
        jest.fn().mockResolvedValue({}),
        z.any(),
        (res) => res.allResults?.[0],
      );

      const res = await nullReturningBySlugClientMethod("some-slug");
      expect(res).toBeNull();
    });

    it("attempts to resolve embedded portable text references", async () => {
      await bySlugClientMethod("some-slug");
      expect(resolveSanityReferences).toBeCalled();
    });

    it("does not fetch draft content by default", async () => {
      await bySlugClientMethod("some-slug");
      expect(bySlugGraphQLMethod).toBeCalledWith(
        expect.objectContaining({ isDraftFilter: { is_draft: false } }),
      );
    });

    it("fetches draft content when previewMode flag is passed", async () => {
      await bySlugClientMethod("some-slug", { previewMode: true });
      expect(bySlugGraphQLMethod).toBeCalledWith(
        expect.objectContaining({ isDraftFilter: { is_draft: undefined } }),
      );
    });

    it("passes previewMode flag to parseResults when false", async () => {
      await bySlugClientMethod("some-slug");
      expect(parseResults).toBeCalledWith(
        expect.anything(),
        expect.anything(),
        /* isPreviewMode: */ undefined,
      );
    });

    it("passes previewMode flag to parseResults when true", async () => {
      await bySlugClientMethod("some-slug", { previewMode: true });
      expect(parseResults).toBeCalledWith(
        expect.anything(),
        expect.anything(),
        /* isPreviewMode: */ true,
      );
    });
  });

  describe("getList", () => {
    const listGraphQLMethod = jest
      .fn()
      .mockResolvedValue({ allResults: [{ foo: "bar" }] });

    const listClientMethod = getList(
      listGraphQLMethod,
      z.any(),
      (res) => res.allResults,
    );

    it("invokes the provided graphql client method", async () => {
      await listClientMethod();
      expect(listGraphQLMethod).toBeCalled();
    });

    it("returns the value of getResultValue", async () => {
      const res = await listClientMethod();
      expect(res).toEqual([{ foo: "bar" }]);
    });

    it("returns an empty array when no content is found", async () => {
      const emptyReturningListClientMethod = getList(
        jest.fn().mockResolvedValue({}),
        z.array(z.any()),
        (res) => res.allResults,
      );

      const res = await emptyReturningListClientMethod();
      expect(res).toEqual([]);
    });

    it("attempts to resolve embedded portable text references", async () => {
      await listClientMethod();
      expect(resolveSanityReferences).toBeCalled();
    });

    it("does not fetch draft content by default", async () => {
      await listClientMethod();
      expect(listGraphQLMethod).toBeCalledWith(
        expect.objectContaining({ isDraftFilter: { is_draft: false } }),
      );
    });

    it("fetches draft content when previewMode flag is passed", async () => {
      await listClientMethod({ previewMode: true });
      expect(listGraphQLMethod).toBeCalledWith(
        expect.objectContaining({ isDraftFilter: { is_draft: undefined } }),
      );
    });

    it("passes previewMode flag to parseResults when false", async () => {
      await listClientMethod();
      expect(parseResults).toBeCalledWith(
        expect.anything(),
        expect.anything(),
        /* isPreviewMode: */ undefined,
      );
    });

    it("passes previewMode flag to parseResults when true", async () => {
      await listClientMethod({ previewMode: true });
      expect(parseResults).toBeCalledWith(
        expect.anything(),
        expect.anything(),
        /* isPreviewMode: */ true,
      );
    });
  });
});
