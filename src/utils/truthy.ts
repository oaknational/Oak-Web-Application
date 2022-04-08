// @see https://stackoverflow.com/questions/47632622/typescript-and-filter-boolean

export type Truthy<T> = T extends false | "" | 0 | null | undefined ? never : T; // from lodash

export default function truthy<T>(value: T): value is Truthy<T> {
  return !!value;
}
