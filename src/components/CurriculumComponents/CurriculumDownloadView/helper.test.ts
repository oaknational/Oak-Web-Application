import { z } from "zod";

import {
  assertValidDownloadType,
  parseSchoolToListItems,
  runSchema,
} from "./helper";

describe("CurriculumDownloadView / helper", () => {
  test("parseSchoolToListItems", () => {
    const result = parseSchoolToListItems([
      {
        urn: "100076",
        la: "Camden",
        name: "South Hampstead High School",
        postcode: "NW3 5SS",
        fullInfo: "100076, Camden, South Hampstead High School, NW3 5SS",
        status: "Open",
      },
      {
        urn: "100090",
        la: "Camden",
        name: "Southbank International School Hampstead",
        postcode: "NW3 5TH",
        fullInfo:
          "100090, Camden, Southbank International School Hampstead, NW3 5TH",
        status: "Open",
      },
    ]);

    expect(result).toEqual([
      {
        key: "100076-South Hampstead High School",
        textValue: "South Hampstead High School, Camden, NW3 5SS",
      },
      {
        key: "100090-Southbank International School Hampstead",
        textValue: "Southbank International School Hampstead, Camden, NW3 5TH",
      },
    ]);
  });

  describe("runSchema", () => {
    test("valid", () => {
      const result1 = runSchema(
        z.object({ name: z.string(), favNumber: z.number() }),
        { name: "Bob", favNumber: 2 },
      );
      expect(result1.success).toEqual(true);
    });
    test("invalid", () => {
      const result2 = runSchema(
        z.object({ name: z.string(), favNumber: z.number() }),
        { name: "Bob", favNumber: "2" },
      );
      expect(result2.success).toEqual(false);
      expect(result2.errors).toEqual({
        favNumber: "Expected number, received string",
      });
    });
  });

  describe("assertValidDownloadType", () => {
    test("valid", () => {
      expect(assertValidDownloadType("curriculum-plans")).toEqual(
        "curriculum-plans",
      );
    });

    test("invalid", () => {
      expect(() => assertValidDownloadType("foobar")).toThrow();
    });
  });
});
