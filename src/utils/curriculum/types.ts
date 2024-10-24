export function notUndefined<TValue>(
  value: TValue | undefined,
): value is TValue {
  return value !== undefined;
}
