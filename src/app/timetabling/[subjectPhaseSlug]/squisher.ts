import { ExtendedUnit, ExtendedUnitOption, Input } from "./types";

import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { Unit } from "@/utils/curriculum/types";

function sortByTrimFactor(a: TrimMatch, b: TrimMatch) {
  return a.trimFactor - b.trimFactor;
}

type TrimMatch = {
  slug: string;
  trimFactor: number;
};
const trimList: Record<string, TrimMatch[]> = {
  "maths:2": [
    {
      slug: "explain-what-the-difference-is-between-consecutive-numbers",
      trimFactor: 1,
    },
    {
      slug: "use-number-facts-to-add-or-subtract-a-one-digit-number-and-a-two-digit-number",
      trimFactor: 2,
    },
    { slug: "add-multiples-of-10-to-2-digit-numbers", trimFactor: 3 },
    {
      slug: "represent-equal-groups-as-repeated-addition-and-multiplication",
      trimFactor: 1,
    },
    {
      slug: "subtract-two-digit-numbers-crossing-the-tens-boundary",
      trimFactor: 4,
    },
    {
      slug: "relate-finding-half-of-a-number-to-halving-and-doubling",
      trimFactor: 2,
    },
    {
      slug: "review-of-using-mathematical-language-to-describe-position",
      trimFactor: 1,
    },
    {
      slug: "explain-how-a-dividend-of-zero-affects-the-quotient",
      trimFactor: 3,
    },
    {
      slug: "explain-how-a-divisor-of-one-affects-the-quotient",
      trimFactor: 4,
    },
    { slug: "solve-problems-involving-multiples-of-ten", trimFactor: 5 },
    {
      slug: "use-knowledge-of-calculating-within-20-to-solve-problems",
      trimFactor: 6,
    },
    { slug: "represent-counting-in-fives-as-the-5-times-table", trimFactor: 5 },
    {
      slug: "use-knowledge-of-the-2-5-and-10-times-tables-to-solve-problems",
      trimFactor: 6,
    },
    { slug: "create-addition-and-subtraction-problems", trimFactor: 7 },
    {
      slug: "use-knowledge-of-divisibility-rules-when-the-divisor-is-10-to-solve-problems",
      trimFactor: 7,
    },
    {
      slug: "use-knowledge-of-divisibility-rules-when-the-divisor-is-5-to-solve-problems",
      trimFactor: 8,
    },
    { slug: "calculate-the-difference-in-different-contexts", trimFactor: 8 },
    {
      slug: "use-bridging-to-solve-addition-and-subtraction-problems",
      trimFactor: 9,
    },
    {
      slug: "explain-that-factor-pairs-can-be-written-in-any-order",
      trimFactor: 9,
    },
    {
      slug: "tell-and-write-the-time-to-five-minutes-past-on-a-clock-face",
      trimFactor: 2,
    },
  ].toSorted(sortByTrimFactor),
};

function mapOverLessons<T extends Unit>(
  sequenceByYear: T[],
  fn: (
    lesson: NonNullable<T["lessons"]>[number],
  ) => ExtendedUnit["lessons"][number],
) {
  return sequenceByYear.map((unit) => {
    const newLessons = (unit.lessons ?? []).map((lesson) => {
      return fn(lesson);
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
}

// TODO: What is the optimum algo for lessons vs time optimisation
export function squishTimetable(
  input: Input,
  sequence: Unit[],
  slugs: CurriculumSelectionSlugs,
): {
  sequence: ExtendedUnit[];
  numberOfLessons: number;
  numberOfLessonsToRemove: number;
  numberOfLessonsLeftToRemove: number;
  lessonsLeftOver: number;
  totalNumberOfLessons: number;
} {
  const availableNumberOfLessons =
    input.autumn1Lessons +
    input.autumn2Lessons +
    input.spring1Lessons +
    input.spring2Lessons +
    input.summer1Lessons +
    input.summer2Lessons;

  const sequenceByYear = sequence
    .filter((unit) => unit.year === String(input.year))
    .toSorted((a, b) => a.order - b.order);

  const totalNumberOfLessons = sequenceByYear.reduce((count, unit) => {
    return count + (unit.lessons ?? []).length;
  }, 0);
  const numberOfLessonsToRemove = Math.max(
    0,
    totalNumberOfLessons - availableNumberOfLessons,
  );
  let numberOfLessonsLeftToRemove = numberOfLessonsToRemove;

  const key = `${slugs.subjectSlug}:${input.year}`;
  const trimListForYear = trimList[key];
  const trimmingEnabled = !!trimListForYear;
  let trimSequence = mapOverLessons(sequenceByYear, (lesson) => ({
    ...lesson,
    included: true,
  }));

  if (trimmingEnabled) {
    trimListForYear.forEach((item) => {
      const newTrimSequence = mapOverLessons(trimSequence, (lesson) => {
        if (numberOfLessonsLeftToRemove > 0 && item.slug === lesson.slug) {
          console.log(">>> match", item.slug, item.trimFactor);
          numberOfLessonsLeftToRemove--;
          return {
            ...lesson,
            included: false,
          };
        } else {
          return {
            ...lesson,
            included: lesson.included ?? true,
          };
        }
      });
      trimSequence = newTrimSequence;
    });
  }

  const chopAtCount = totalNumberOfLessons - numberOfLessonsLeftToRemove;
  let lessonCount = 0;
  const cutSequence = mapOverLessons(trimSequence, (lesson) => {
    lessonCount++;
    if (lesson.included === false) {
      return { ...lesson, included: false };
    }
    return {
      ...lesson,
      included: lessonCount <= chopAtCount,
    };
  });

  return {
    sequence: cutSequence,
    numberOfLessons: availableNumberOfLessons,
    numberOfLessonsToRemove,
    numberOfLessonsLeftToRemove,
    lessonsLeftOver: availableNumberOfLessons - totalNumberOfLessons,
    totalNumberOfLessons,
  };
}
