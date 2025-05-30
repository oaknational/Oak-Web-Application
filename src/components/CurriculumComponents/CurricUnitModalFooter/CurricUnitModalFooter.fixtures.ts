import { createUnit } from "@/fixtures/curriculum/unit";
import { createLesson } from "@/fixtures/curriculum/lesson";
import { createUnitOption } from "@/fixtures/curriculum/unitOption";

export const mockUnit = createUnit({
  slug: "composition-of-numbers-6-to-10",
  subject_slug: "maths",
  year: "7",
});

export const mockUnitWithOptions = createUnit({
  slug: "composition-of-numbers-6-to-10",
  subject_slug: "maths",
  year: "7",
  unit_options: [
    createUnitOption({ slug: "opt-1" }),
    createUnitOption({ slug: "opt-2" }),
  ],
});

export const mockUnitWithLessons = createUnit({
  slug: "composition-of-numbers-6-to-10",
  subject_slug: "maths",
  year: "7",
  lessons: [
    createLesson({
      slug: "test",
    }),
  ],
});
