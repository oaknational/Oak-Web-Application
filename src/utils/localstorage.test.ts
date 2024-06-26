import { z } from "zod";

import {
  getLocalstorageWithSchema,
  setLocalstorageWithSchema,
} from "./localstorage";

describe("localstorage", () => {
  describe("getLocalstorageWithSchema", () => {
    it("valid", () => {
      jest.spyOn(Storage.prototype, "getItem").mockImplementationOnce(() => {
        return JSON.stringify({
          one: 1,
          two: "two",
        });
      });

      const results = getLocalstorageWithSchema(
        "test",
        z.object({
          one: z.number(),
          two: z.string(),
        }),
      );

      expect(results).toEqual({
        one: 1,
        two: "two",
      });
    });

    it("schema invalid", () => {
      jest.spyOn(Storage.prototype, "getItem").mockImplementationOnce(() => {
        return JSON.stringify({
          one: 1,
          two: 2,
        });
      });

      expect(() => {
        getLocalstorageWithSchema(
          "test",
          z.object({
            one: z.number(),
            two: z.string(),
          }),
        );
      }).toThrow("Expected string, received number");
    });

    it("JSON invalid", () => {
      jest.spyOn(Storage.prototype, "getItem").mockImplementationOnce(() => {
        return "TRUE";
      });

      expect(() => {
        getLocalstorageWithSchema("test", z.boolean());
      }).toThrow("Not valid JSON at key 'test'");
    });

    it("missing", () => {
      jest
        .spyOn(Storage.prototype, "getItem")
        .mockImplementationOnce(() => null);

      expect(() => {
        getLocalstorageWithSchema("test", z.boolean());
      }).toThrow("No data in localStorage at key 'test'");
    });

    it("schema invalid (with default)", () => {
      jest
        .spyOn(Storage.prototype, "getItem")
        .mockImplementationOnce(() => null);

      expect(() => {
        getLocalstorageWithSchema("test", z.boolean());
      }).toThrow("No data in localStorage at key 'test'");
    });
  });

  describe("setLocalstorageWithSchema", () => {
    it("valid", () => {
      const fn = jest.spyOn(Storage.prototype, "setItem");

      setLocalstorageWithSchema("test", z.string(), "testing123");
      expect(fn).toHaveBeenCalledWith("test", '"testing123"');
    });

    it("invalid", () => {
      jest.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => {});

      expect(() => {
        // @ts-expect-error: schema is invalid because we're testing an invalid input
        setLocalstorageWithSchema("test", z.string(), true);
      }).toThrow();
    });
  });
});
