import OakError from "@/errors/OakError";

/**
 * Throws if condition is false
 * while narrowing the type to something truthy
 */
export function invariant(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new OakError({
      code: "misc/unexpected-type",
      meta: { message },
    });
  }
}
