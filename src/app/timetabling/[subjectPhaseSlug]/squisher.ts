import { ExtendedUnit, ExtendedUnitOption, Input } from "./types";

import { Unit } from "@/utils/curriculum/types";

// TODO: What is the optimum algo for lessons vs time optimisation
export function squishTimetable(
  input: Input,
  sequence: Unit[],
): {
  sequence: ExtendedUnit[];
  lessonsLeftOver: number;
  numberOfLessons: number;
} {
  const totalNumberOfLessons =
    input.autumn1Lessons +
    input.autumn2Lessons +
    input.spring1Lessons +
    input.spring2Lessons +
    input.summer1Lessons +
    input.summer2Lessons;

  let lessonsLeftOver = totalNumberOfLessons;
  let numberOfLessons = 0;
  const sequenceByYear = sequence
    .filter((unit) => unit.year === String(input.year))
    .sort((a, b) => a.order - b.order);

  const newSequence = sequenceByYear.map((unit) => {
    const newLessons = (unit.lessons ?? []).map((lesson) => {
      numberOfLessons++;
      lessonsLeftOver--;
      return {
        ...lesson,
        included: lessonsLeftOver > -1,
      };
    });

    return {
      ...unit,
      lessons: newLessons,
      unit_options: unit.unit_options.map((unitOption) => {
        return {
          ...unitOption,
          lessons: (unitOption.lessons ?? []).map((lesson, lessonIndex) => {
            return {
              ...lesson,
              included: newLessons[lessonIndex]?.included,
            };
          }),
        } as ExtendedUnitOption;
      }),
    };
  });

  return {
    sequence: newSequence,
    numberOfLessons,
    lessonsLeftOver: lessonsLeftOver,
  };
}
