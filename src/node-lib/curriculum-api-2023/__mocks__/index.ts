import { CurriculumApi } from "@/node-lib/curriculum-api-2023";
import subjectPhaseOptionsFixture from "@/node-lib/curriculum-api-2023/fixtures/subjectPhaseOptions.fixture";

const curriculumApi: Pick<CurriculumApi, "subjectPhaseOptions"> = {
  subjectPhaseOptions: jest.fn(async () => {
    return subjectPhaseOptionsFixture();
  }),
};

export default curriculumApi;
