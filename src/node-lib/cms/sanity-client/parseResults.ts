import { z, ZodArray, ZodSchema, ZodTypeAny } from "zod";

type WrapValue = {
  <D, T extends Array<D>>(item: T): T;
  <T>(item: T): T[];
};

const wrapValue: WrapValue = (item: unknown) =>
  Array.isArray(item) ? item : [item];

export function createInvalidRejectingSchema<E, S extends ZodArray<E, "many">>(
  arraySchema: S
) {
  const validate = (item: unknown) =>
    arraySchema.element.safeParse(item).success;
  return z.preprocess((val) => wrapValue(val).filter(validate), arraySchema);
}

const isZodArraySchema = <T extends ZodTypeAny>(
  schema: unknown
): schema is ZodArray<T> => {
  return typeof schema === "object" && schema !== null && "element" in schema;
};
/**
 * Filters a list to only unique items
 * - calls getProp on each item to get the value to compare
 * - when 2 items clash (getProp returns the same for both) onConflict
 *   is invoked. If it returns the previously seen value it's left at
 *   it's current index, otherwise the current/new value will be appended to acc
 *
 * @example
 *   uniqBy(
 *     [{ id: 1 }, { id: 2, keepMe: true }, { id: 3 }, { id: 2 }],
 *     (x) => x.id,
 *     (prev, current) =>
 *       current.keepMe ? current : prev.keepMe ? prev : current
 *   )
 *   // -> [{ id: 1 }, { id: 2, keepMe: true }, { id: 3 }]
 */

export const uniqBy = <T>(
  data: T[],
  getProp: (el: T) => unknown,
  onConflict: (prev: T, current: T) => T
): T[] => {
  return data.reduce<T[]>((acc, item) => {
    const alreadyExistsIdx = acc.findIndex(
      (el) => getProp(el) === getProp(item)
    );
    const alreadyExists = alreadyExistsIdx >= 0;
    const prevItem = acc[alreadyExistsIdx];

    if (alreadyExists && prevItem) {
      const itemToKeep = onConflict(prevItem, item);
      const keepPrev = itemToKeep === prevItem;

      if (keepPrev) {
        return acc;
      } else {
        const withoutPrevious = acc.filter((_, i) => i !== alreadyExistsIdx);
        return [...withoutPrevious, itemToKeep];
      }
    } else {
      return [...acc, item];
    }
  }, []);
};

const draftPrefixRegex = /^drafts\./;
const isDraft = (id: string): boolean => draftPrefixRegex.test(id);
const trimDraftsPrefix = (id: string) => id.replace(draftPrefixRegex, "");

export const parseResults = <S extends ZodSchema, D>(
  schema: S,
  data: D,
  isPreviewMode?: boolean
): ReturnType<typeof schema["parse"]> => {
  if (isPreviewMode) {
    if (isZodArraySchema(schema)) {
      /**
       * Take the provided schema and create a version of it that
       * will silently filter out any items that are invalid
       */
      const invalidRejectingSchema = createInvalidRejectingSchema(schema);
      const parsedItems = invalidRejectingSchema.parse(data);

      /**
       * Filter out any duplicates, rejecting the non-draft version
       * when a draft with a matching ID exists
       */
      const uniqueItems = uniqBy(
        parsedItems,
        (item) => trimDraftsPrefix(item.id),
        (prev, current) => (isDraft(prev.id) ? prev : current)
      );

      return uniqueItems;
    } else {
      return schema.parse(data);
    }
  }

  return schema.parse(data);
};
