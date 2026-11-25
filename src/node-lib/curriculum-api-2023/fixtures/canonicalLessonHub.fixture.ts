import { CanonicalLessonHubData } from "../queries/canonicalLessonOverview/canonicalLessonOverview.schema";

const canonicalLessonHubFixture = (
  partial?: Partial<CanonicalLessonHubData>,
): CanonicalLessonHubData => {
  return {
    lessonTitle: "Adverbial complex sentences",
    subjectSlug: "english",
    pathways: [],
    ...partial,
  };
};

export default canonicalLessonHubFixture;
