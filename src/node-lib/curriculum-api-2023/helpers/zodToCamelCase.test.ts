import { z } from "zod";

import { zodToCamelCase } from "./zodToCamelCase";

import keysToCamelCase from "@/utils/snakeCaseConverter";

describe("zodToCamelCase", () => {
  it("converts a snake_case schema to camelCase", () => {
    const snake_case_schema = z.object({
      test_param: z.string(),
      test_param2: z.number(),
    });

    const snake_data = {
      test_param: "test",
      test_param2: 123,
    };

    expect(snake_case_schema.parse(snake_data)).toEqual(snake_data);

    const camelData = keysToCamelCase(snake_data);

    const camelCaseSchema = zodToCamelCase(snake_case_schema);

    expect(camelCaseSchema.parse(camelData)).toEqual(camelData);
  });

  it("converts a nested snake_case schema to camelCase", () => {
    const nested_schema = z.object({
      test_param: z.string(),
      nested_param: z.object({
        nested_param_2: z.number(),
      }),
    });

    const nested_data = {
      test_param: "test",
      nested_param: {
        nested_param_2: 123,
      },
    };

    expect(nested_schema.parse(nested_data)).toEqual(nested_data);

    const camelData = keysToCamelCase(nested_data);

    const camelCaseSchema = zodToCamelCase(nested_schema);

    expect(camelCaseSchema.parse(camelData)).toEqual(camelData);
  });
});
