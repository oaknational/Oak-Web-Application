// import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import OakError from "@/errors/OakError";
import curriculumDownloadsTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumDownloads.fixture";

const curriculumDownloadsQuery =
  // (sdk: Sdk) =>


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
