export function convertSubjectToSlug(subject: string): string {
  if (subject === "Relationships, sex and health education") {
    return "rshe";
  }
  if (subject === "Art and design") {
    return "art";
  }

  return subject
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[\\()\\[\]\\{\\}]/g, "")
    .replace(/-{2,}/g, "-");
}
