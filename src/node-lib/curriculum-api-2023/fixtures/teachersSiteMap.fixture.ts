import { teachersSitemapDataSchema } from "../queries/teachersSitemap/teacherSitemap.schema";

import keysToCamelCase from "@/utils/snakeCaseConverter";

export const teachersSitemapDataFixture = {
  keyStages: ["ks1", "ks2"],
  programmes: [
    {
      programme_slug: "programme-1",
    },
    {
      programme_slug: "programme-2",
    },
  ],
  units: [
    {
      programme_slug: "programme-1",
      unit_slug: "unit-1",
    },
    {
      programme_slug: "programme-2",
      unit_slug: "unit-2",
    },
  ],
  lessons: [
    {
      programme_slug: "programme-1",
      unit_slug: "unit-1",
      lesson_slug: "lesson-1",
    },
    {
      programme_slug: "programme-2",
      unit_slug: "unit-2",
      lesson_slug: "lesson-2",
    },
  ],
  specialistProgrammes: [
    {
      programme_slug: "specialist-programme-1",
    },
    {
      programme_slug: "specialist-programme-2",
    },
  ],
  specialistUnits: [
    {
      programme_slug: "specialist-programme-1",
      unit_slug: "specialist-unit-1",
    },
    {
      programme_slug: "specialist-programme-2",
      unit_slug: "specialist-unit-2",
    },
  ],
  specialistLessons: [
    {
      programme_slug: "specialist-programme-1",
      unit_slug: "specialist-unit-1",
      lesson_slug: "specialist-lesson-1",
    },
    {
      programme_slug: "specialist-programme-2",
      unit_slug: "specialist-unit-2",
      lesson_slug: "specialist-lesson-2",
    },
  ],
};

const parsedFixture = teachersSitemapDataSchema.parse(
  teachersSitemapDataFixture,
);

export const teachersSitemapDataFixtureCamelCase = keysToCamelCase({
  ...parsedFixture,
});

const newDate = new Date();
export const generatedFields = [
  {
    loc: "https:/www.thenational.academy/teachers/key-stages/ks3/subjects",
    lastmod: newDate.toISOString(),
  },
];
