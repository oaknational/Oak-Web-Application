// @see https://stackoverflow.com/questions/47632622/typescript-and-filter-boolean

export type Truthy<T> = T extends false | "" | 0 | null | undefined ? never : T; // from lodash

/**
 *
 * @description truthy takes a value and returns true|false with the correct type
 * It's useful, for example, when filtering out null values from an array.
 * Typescript compiler needs a hint to realise there aren't any more null values.
 * [{ foo: "bar" }, null]<Record | null>[].filter(truthy) // [{ foo: "bar"}]<Record>[]
 */
export default function truthy<T>(value: T): value is Truthy<T> {
  return !!value;
}
