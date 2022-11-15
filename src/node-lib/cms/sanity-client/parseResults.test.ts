import { z } from "zod";

import { parseResults, uniqBy } from "./parseResults";

describe("cms/sanity-client/parseResults", () => {
  describe("uniqBy", () => {
    it("it filters a list to contain only unique items", () => {
      const filtered = uniqBy(
        [1, 2, 3, 2],
        (x) => x,
        (_prev, current) => current
      );
      /**
       * Surprising result here - because the values being compared
       * are primitives it's always considering the returned `current`
       * to equal `prevItem` because 2 === 2
       *
       * This doesn't matter in our usage as we're comparing objects
       * but the return here strictly speaking should be [1, 3, 2]
       */
      expect(filtered).toEqual([1, 2, 3]);
    });

    it("uses the getProp arg to discern uniqueness", () => {
      const filtered = uniqBy(
        [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 2 }],
        (x) => x.id,
        (_prev, current) => current
      );

      expect(filtered).toEqual([{ id: 1 }, { id: 3 }, { id: 2 }]);
    });

    it("uses the onConflict arg to decide which to keep", () => {
      const filtered = uniqBy(
        [{ id: 1 }, { id: 2, keepMe: true }, { id: 3 }, { id: 2 }],
        (x) => x.id,
        (prev, current) =>
          current.keepMe ? current : prev.keepMe ? prev : current
      );

      expect(filtered).toEqual([{ id: 1 }, { id: 2, keepMe: true }, { id: 3 }]);
    });
  });

  describe("parseResults", () => {
    it("parses data with the given schema", () => {
      const schema = z.object({ foo: z.boolean() });
      expect(parseResults(schema, { foo: true })).toEqual({ foo: true });
    });

    it("throws when invalid data is provided for schema", () => {
      const schema = z.object({ foo: z.boolean() });

      expect(() => {
        parseResults(schema, { foo: "true" });
      }).toThrow();
    });

    it("throws on invalid list items without isPreviewMode", () => {
      const schema = z.array(z.object({ foo: z.boolean() }));
      const data = [{ foo: null }, { foo: true }];
      expect(() => {
        parseResults(schema, data);
      }).toThrow();
    });

    it("filters invalid list items with isPreviewMode=true", () => {
      const schema = z.array(z.object({ foo: z.boolean() }));
      const data = [{ foo: "bar" }, { foo: true }];
      expect(parseResults(schema, data, true)).toEqual([{ foo: true }]);
    });

    it("filters non-draft content when matching draft content exists", () => {
      const schema = z.array(z.object({ id: z.string() }));

      const data = [
        { id: "abc" },
        { id: "drafts.abc" },
        { id: "asdf" },
        { id: "drafts.wasd" },
      ];
      const parsed = parseResults(schema, data, true);

      expect(parsed).toEqual([
        { id: "drafts.abc" },
        { id: "asdf" },
        { id: "drafts.wasd" },
      ]);
    });
  });
});

// Silence module error
export {};
