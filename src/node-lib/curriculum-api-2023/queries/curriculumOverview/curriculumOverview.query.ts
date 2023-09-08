import OakError from "@/errors/OakError";
import curriculumOverviewTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";

const curriculumOverviewQuery =
  () =>
  async (args: {
    subjectSlug: string;
    phaseSlug: string;
    examboardSlug: string | null;
  }) => {
    const { subjectSlug, phaseSlug } = args;
    if (!subjectSlug || !phaseSlug) {
      throw new OakError({ code: "curriculum-api/params-incorrect" });
    }
    return curriculumOverviewTabFixture();
  };

export default curriculumOverviewQuery;
