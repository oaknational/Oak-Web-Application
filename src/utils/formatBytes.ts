/**
 * Nicer rendering of data sizes with reasonable rounding for most humans
 *
 * KB — no decimal places, too small to worry about
 * MB – 1 decimal place
 * GB – 2 decimal places
 *
 * @param bytes
 * @returns
 */
export function formatBytes(bytes: number): string {
  if (!+bytes) return "0 B";

  const k = 1024;

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const sizes = ["B", "KB", "MB", "GB"] as const;
  const decimals = {
    B: 0,
    KB: 0,
    MB: 1,
    GB: 2,
  }[sizes[i]!];

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}
