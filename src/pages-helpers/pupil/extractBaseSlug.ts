export function extractBaseSlug(programmeSlug: string): string {
  // Split the programmeSlug by '-' and find the first section that is a number between 1 and 11 or is 'reception'
  const parts = programmeSlug.split("-");
  const index = parts.findIndex(
    (part) =>
      (!Number.isNaN(Number.parseInt(part, 10)) &&
        Number.parseInt(part, 10) >= 1 &&
        Number.parseInt(part, 10) <= 11) ||
      part.toLowerCase() === "reception",
  );
  // Return the first part of the programmeSlug up to and including the number
  return parts.slice(0, index + 1).join("-");
}
