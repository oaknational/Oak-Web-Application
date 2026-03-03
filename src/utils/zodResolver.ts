/**
 * Zod 4-compatible zodResolver for react-hook-form.
 *
 * @hookform/resolvers/zod expects Zod 3's error shape (.errors, .unionErrors).
 * Zod 4 uses .issues and nests union branches differently. This adapter
 * flattens Zod 4 validation issues into the FieldErrors map that
 * react-hook-form expects, without depending on any Zod 3 internals.
 */
import { toNestErrors } from "@hookform/resolvers";
import {
  FieldError,
  FieldErrors,
  FieldValues,
  Resolver,
} from "react-hook-form";
import type { z } from "zod";

interface ZodIssue {
  code: string;
  message: string;
  path: (string | number)[];
  errors?: ZodIssue[][];
}

function flattenIssues(issues: ZodIssue[]): ZodIssue[] {
  const flat: ZodIssue[] = [];
  for (const issue of issues) {
    if (issue.code === "invalid_union" && issue.errors) {
      // Include errors from all union branches so that field errors
      // from every branch are surfaced (matching Zod 3 resolver behaviour).
      for (const branch of issue.errors) {
        flat.push(...flattenIssues(branch as ZodIssue[]));
      }
    } else {
      flat.push(issue);
    }
  }
  return flat;
}

function parseIssues(issues: ZodIssue[]): Record<string, FieldError> {
  const errors: Record<string, FieldError> = {};
  for (const issue of flattenIssues(issues)) {
    const path = issue.path.join(".");
    if (path && !errors[path]) {
      errors[path] = { message: issue.message, type: issue.code };
    }
  }
  return errors;
}

export function zodResolver<TFieldValues extends FieldValues>(
  schema: z.ZodType,
): Resolver<TFieldValues> {
  return async (values, _, options) => {
    const result = await schema.safeParseAsync(values);

    if (result.success) {
      return {
        errors: {} as FieldErrors,
        values: result.data as TFieldValues,
      };
    }

    return {
      values: {},
      errors: toNestErrors(
        parseIssues(result.error.issues as unknown as ZodIssue[]),
        options,
      ),
    };
  };
}
