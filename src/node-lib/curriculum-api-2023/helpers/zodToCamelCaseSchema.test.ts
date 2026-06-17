import { z } from "zod";

import { zodToCamelCaseSchema } from "./zodToCamelCaseSchema";

describe("zodToCamelCaseSchema", () => {
  const snakeSchema = z.object({
    user_id: z.string(),
    profile_data: z.object({
      display_name: z.string(),
      tag_list: z.array(
        z.object({
          tag_value: z.string(),
        }),
      ),
    }),
  });

  it("converts parsed output keys to camel case", () => {
    const schema = zodToCamelCaseSchema(snakeSchema);

    expect(
      schema.parse({
        user_id: "user-1",
        profile_data: {
          display_name: "Test User",
          tag_list: [{ tag_value: "maths" }],
        },
      }),
    ).toEqual({
      userId: "user-1",
      profileData: {
        displayName: "Test User",
        tagList: [{ tagValue: "maths" }],
      },
    });
  });

  it("accepts camel-case input when bidirectional mode is enabled", () => {
    const schema = zodToCamelCaseSchema(snakeSchema, {
      bidirectional: true,
    });

    expect(
      schema.parse({
        userId: "user-1",
        profileData: {
          displayName: "Test User",
          tagList: [{ tagValue: "maths" }],
        },
      }),
    ).toEqual({
      userId: "user-1",
      profileData: {
        displayName: "Test User",
        tagList: [{ tagValue: "maths" }],
      },
    });
  });

  it("supports Zod wrappers after conversion", () => {
    const actionSchema = zodToCamelCaseSchema(
      z.object({
        opt_out: z.array(z.string()).optional(),
      }),
      {
        bidirectional: true,
      },
    );

    const schema = z.object({
      actions: actionSchema.nullish(),
    });

    expect(schema.parse({})).toEqual({});
    expect(schema.parse({ actions: null })).toEqual({ actions: null });
    expect(schema.parse({ actions: { optOut: ["teacher"] } })).toEqual({
      actions: { optOut: ["teacher"] },
    });
  });

  it("rewrites bidirectional error paths to camel case", () => {
    const schema = zodToCamelCaseSchema(snakeSchema, {
      bidirectional: true,
    });

    const result = schema.safeParse({
      userId: "user-1",
      profileData: {
        displayName: "Test User",
        tagList: [{ tagValue: 123 }],
      },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual([
        "profileData",
        "tagList",
        0,
        "tagValue",
      ]);
    }
  });
});
