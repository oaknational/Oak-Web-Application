import { keysToCamelCase } from "zod-to-camel-case";

import { TeachersSitemapDataSchemaSnake } from "../queries/teachersSitemap/teacherSitemap.schema";

export const teachersSitemapDataFixture: TeachersSitemapDataSchemaSnake = {
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
};

export const teachersSitemapDataFixtureCamelCase = keysToCamelCase({
  ...teachersSitemapDataFixture,
});

const newDate = new Date();
export const generatedFields = [
  {
    loc: "https:/www.thenational.academy/teachers/key-stages/ks3/subjects",
    lastmod: newDate.toISOString(),
  },
];
