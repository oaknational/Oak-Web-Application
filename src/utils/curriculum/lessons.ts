import { Lesson } from "./types";

export const areLessonsAvailable = (lessons: Lesson[] | null): boolean => {
  return (
    lessons?.some((lesson: Lesson) => lesson._state === "published") || false
  );
};
