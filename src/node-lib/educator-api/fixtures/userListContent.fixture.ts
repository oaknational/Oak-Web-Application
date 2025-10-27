import { UserlistContentApiResponse } from "../queries/getUserListContent/getUserListContent.types";

const userListContentFixture = (
  programmeName: string,
  partial?: Partial<UserlistContentApiResponse[typeof programmeName]>,
): UserlistContentApiResponse => {
  return {
    [programmeName]: {
      programmeSlug: programmeName,
      units: [
        {
          unitSlug: "unit1",
          unitTitle: "Unit 1",
          optionalityTitle: null,
          savedAt: "2023-10-01T00:00:00Z",
          unitOrder: 1,
          yearOrder: 1,
          year: "1",
          yearSlug: "year-1",
          lessons: [
            {
              slug: "lesson1",
              title: "Lesson 1",
              state: "published",
              order: 1,
            },
          ],
        },
      ],
      keystage: "KS1",
      subject: "Maths",
      examboard: null,
      tier: null,
      subjectSlug: "maths",
      keystageSlug: "ks1",
      subjectCategory: null,
      ...partial,
    },
  };
};
export default userListContentFixture;
