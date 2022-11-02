import { SafeParseError } from "zod";

import { FormDefinition, FormField } from "./FormDefinition";
import formToZod, { fieldToZod } from "./formToZod";

describe("formToZod.ts", () => {
  describe("fieldToZod", () => {
    it("marks fields as required by default", () => {
      const field = {
        name: "name",
        type: "string",
      } as FormField;

      const schema = fieldToZod(field);

      expect(schema.parse("ross")).toEqual("ross");
      expect(() => {
        schema.parse(undefined);
      }).toThrow();
    });

    it("handles optional fields", () => {
      const field: FormField = {
        name: "name",
        type: "string",
        required: false,
      };

      const schema = fieldToZod(field);

      expect(schema.parse("ross")).toEqual("ross");
      expect(schema.parse(undefined)).toEqual(undefined);
    });

    it("marks required `string` type fields as non-empty", () => {
      const field: FormField = {
        name: "name",
        label: "The Label",
        type: "string",
        required: true,
      };

      const schema = fieldToZod(field);

      expect(() => {
        schema.parse("");
      }).toThrow();

      const parseResult = schema.safeParse("") as SafeParseError<unknown>;
      expect(parseResult.error.issues?.[0]?.message).toBe(
        `The Label can't be empty`
      );
    });

    it("allows empty strings in optional `string` type fields", () => {
      const field: FormField = {
        name: "name",
        type: "string",
        required: false,
      };

      const schema = fieldToZod(field);

      expect(schema.parse("")).toEqual(undefined);
    });

    it("handles `select` type fields", () => {
      const field: FormField = {
        name: "user_type",
        type: "select",
        required: true,
        options: [
          { label: "Teacher", value: "teacher" },
          { label: "Pupil", value: "pupil" },
        ],
      };

      const schema = fieldToZod(field);

      expect(schema.parse("teacher")).toEqual("teacher");

      expect(() => {
        schema.parse("not-in-allowed");
      }).toThrow();

      // Not sure currently how to set an error message on a z.enum
      // const parseResult = schema.safeParse("not-in-allowed") as SafeParseError<unknown>;
      // expect(parseResult.error.issues?.[0]?.message).toBe(``);
    });

    it("allows empty strings in optional `select` type fields", () => {
      const field: FormField = {
        name: "user_type",
        type: "select",
        required: false,
        options: [
          { label: "Teacher", value: "teacher" },
          { label: "Pupil", value: "pupil" },
        ],
      };

      const schema = fieldToZod(field);

      expect(schema.parse("")).toEqual(undefined);

      expect(() => {
        schema.parse("not-in-allowed");
      }).toThrow();
    });

    it("doesn't allow empty strings in required `select` type fields", () => {
      /**
       * Make sure we didn't pass the above test by blindly setting .optional()
       */
      const field: FormField = {
        name: "user_type",
        type: "select",
        required: true,
        options: [
          { label: "Teacher", value: "teacher" },
          { label: "Pupil", value: "pupil" },
        ],
      };

      const schema = fieldToZod(field);

      expect(() => {
        schema.parse("");
      }).toThrow();
    });

    it("handles `email` type fields", () => {
      const field: FormField = {
        name: "email",
        type: "email",
        label: "Email Label",
        required: true,
      };

      const schema = fieldToZod(field);

      expect(schema.parse("hi@example.com")).toEqual("hi@example.com");

      expect(() => {
        schema.parse("not-an-email");
      }).toThrow();

      const emptyParseResult = schema.safeParse("") as SafeParseError<unknown>;
      expect(emptyParseResult.error.issues?.[0]?.message).toBe(
        `Email Label can't be empty`
      );

      const invalidParseResult = schema.safeParse(
        "not-an-email"
      ) as SafeParseError<unknown>;
      expect(invalidParseResult.error.issues?.[0]?.message).toBe(
        `Email not valid`
      );
    });
  });

  describe("formToZod", () => {
    it("creates a zod object schema from the form fields", () => {
      const form = {
        fields: [
          {
            name: "name",
            type: "string",
          },
        ],
      } as FormDefinition;

      const schema = formToZod(form);

      expect(schema.parse({ name: "ross" })).toEqual({ name: "ross" });

      expect(() => {
        schema.parse({});
      }).toThrow();
    });
  });

  it("handles optional fields in the returned object schema", () => {
    const form = {
      fields: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "school",
          type: "string",
          required: false,
        },
      ],
    } as FormDefinition;

    const schema = formToZod(form);

    expect(schema.parse({ name: "ross" })).toEqual({ name: "ross" });
    expect(schema.parse({ name: "ross", school: "oak" })).toEqual({
      name: "ross",
      school: "oak",
    });
  });
});
