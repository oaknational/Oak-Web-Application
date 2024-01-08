export type ShallowNullable<T> = { [K in keyof T]: T[K] | null };

export type SnakeToCamel<T> = {
  [K in keyof T as K extends string ? SnakeToCamelCase<K> : K]: T[K];
};

type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S;
