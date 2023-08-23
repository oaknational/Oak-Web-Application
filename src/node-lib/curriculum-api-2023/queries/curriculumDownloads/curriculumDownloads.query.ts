import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import curriculumDownloadTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumDownload.fixture";

const curriculumDownloadsQuery =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (sdk: Sdk) => async (args: { slug: string }) => {
    if (Object.values(args).some((arg) => !arg.length)) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }
    return curriculumDownloadTabFixture();
  };

export default curriculumDownloadsQuery;
