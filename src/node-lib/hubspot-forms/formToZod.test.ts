import formToZod from "./formToZod";
import { FormDefinition } from "./FormDefinition";

describe("formToZod", () => {
  it("creates a zod schema from the form fields", () => {
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

  it("marks fields as required by default", () => {
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

  it("marks `string` type fields as non-empty", () => {
    const form = {
      fields: [
        {
          name: "name",
          type: "string",
        },
      ],
    } as FormDefinition;

    const schema = formToZod(form);

    expect(() => {
      schema.parse({ name: "" });
    }).toThrow();
  });

  it("handles `select` type fields", () => {
    const form = {
      fields: [
        {
          name: "user_type",
          type: "select",
          options: [
            { label: "Teacher", value: "teacher" },
            { label: "Pupil", value: "pupil" },
          ],
        },
      ],
    } as FormDefinition;

    const schema = formToZod(form);

    expect(schema.parse({ user_type: "teacher" })).toEqual({
      user_type: "teacher",
    });

    expect(() => {
      schema.parse({ user_type: "not-in-allowed" });
    }).toThrow();
  });

  it("handles `email` type fields", () => {
    const form = {
      fields: [
        {
          name: "email",
          type: "email",
        },
      ],
    } as FormDefinition;

    const schema = formToZod(form);

    expect(schema.parse({ email: "hi@example.com" })).toEqual({
      email: "hi@example.com",
    });

    expect(() => {
      schema.parse({ email: "not-an-email" });
    }).toThrow();
  });
});
