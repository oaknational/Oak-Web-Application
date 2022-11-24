/**
 * Serializes date, which is required for next page props
 * @see https://github.com/vercel/next.js/issues/11993
 */
export const serializeDate = <T extends { date: Date }>(
  item: T
): T & { date: string } => ({
  ...item,
  date: item.date.toISOString(),
});
