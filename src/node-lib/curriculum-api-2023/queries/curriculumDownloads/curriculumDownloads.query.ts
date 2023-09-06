import OakError from "@/errors/OakError";
import curriculumDownloadsTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumDownloads.fixture";

const curriculumDownloadsQuery =
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
    return curriculumDownloadsTabFixture();
  };

export default curriculumDownloadsQuery;
