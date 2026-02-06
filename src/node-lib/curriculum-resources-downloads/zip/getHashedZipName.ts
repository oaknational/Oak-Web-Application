import crypto from "crypto";

/**
 * Generate a deterministic ZIP filename based on content hash.
 * This enables caching - same selection + assets = same filename = cache hit.
 *
 * @param slug - Lesson or unit slug
 * @param selection - Array of selected resource types
 * @param assetsUpdatedAt - Timestamp of latest asset update
 * @returns Filename in format: {slug}-{8-char-hash}.zip
 */
export function getHashedZipName({
  slug,
  selection,
  assetsUpdatedAt,
}: {
  slug: string;
  selection: string[];
  assetsUpdatedAt: string;
}): string {
  const stringToHash = [...selection, assetsUpdatedAt]
    .filter(Boolean)
    .sort()
    .join(",");

  const hash = crypto.createHash("sha512").update(stringToHash).digest("hex");
  const shortenedHash = hash.slice(0, 8);

  return `${slug}-${shortenedHash}.zip`;
}
