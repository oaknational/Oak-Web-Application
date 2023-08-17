import { CurriculumApi } from "../../curriculum-api-2023";
import subjectPhaseOptionsFixture from "../fixtures/subjectPhaseOptions.fixture";
import curriculumOverviewFixture from "../fixtures/curriculumOverview.fixture";
import curriculumUnitsFixture from "../fixtures/curriculumUnits.fixture";
import curriculumDownloadsFixture from "../fixtures/curriculumDownloads.fixture";

const curriculumApi: Pick<
  CurriculumApi,
  | "subjectPhaseOptions"
  | "curriculumOverview"
  | "curriculumUnits"
  | "curriculumDownloads"
> = {
  subjectPhaseOptions: jest.fn(async () => {
    return subjectPhaseOptionsFixture();
  }),
  curriculumOverview: jest.fn(async () => {
    return curriculumOverviewFixture();
  }),
  curriculumUnits: jest.fn(async () => {
    return curriculumUnitsFixture();
  }),
  curriculumDownloads: jest.fn(async () => {
    return curriculumDownloadsFixture();
  }),
};

export default curriculumApi;
