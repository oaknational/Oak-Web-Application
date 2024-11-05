import { Subject } from "./types";

export function sortYears(a: string, b: string) {
  if (a === "all-years") {
    return -1;
  }
  return parseInt(a) - parseInt(b);
}

export function sortChildSubjects(a: Subject, b: Subject) {
  // Special logic we always want combined-science first.
  if (a.subject_slug === "combined-science") return -10;
  if (b.subject_slug === "combined-science") return 10;

  // Alphabetical
  if (a.subject_slug < b.subject_slug) return -1;
  if (a.subject_slug > b.subject_slug) return 1;
  return 0;
}
