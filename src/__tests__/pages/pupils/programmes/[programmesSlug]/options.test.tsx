import PupilProgrammeListingPage, {
  getStaticProps,
} from "@/pages/pupils/beta//programmes/[programmeSlug]/options";
import * as curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import {
  ProgrammeFields,
  PupilProgrammeListingData,
} from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";
import { programmeFieldsFixture } from "@/node-lib/curriculum-api-2023/fixtures/programmeFields.fixture";
import { PupilViewsProgrammeListing } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

jest.mock(
  "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view",
  () => ({
    PupilViewsProgrammeListing: jest.fn((props) => <div>{props.baseSlug}</div>),
  }),
);

jest.mock("next/navigation", () => ({
  useSearchParams: () => ({ get: jest.fn() }),
}));

describe("pages/pupils/programmes/[programmeSlug]/options", () => {
  const overrides: Partial<ProgrammeFields>[] = [
    {
      examboard: "AQA",
      examboardSlug: "aqa",
      examboardDisplayOrder: 1,
    },
    {
      examboard: "Edexcel",
      examboardSlug: "edexcel",
      examboardDisplayOrder: 2,
    },
  ];

  const programmeFields = overrides.map((override) =>
    programmeFieldsFixture({ overrides: override }),
  );

  const programmes: PupilProgrammeListingData[] = programmeFields.map(
    (programmeField) => ({
      programmeSlug: "physics-secondary-year-11",
      programmeFields: programmeField,
      yearSlug: "year-11",
    }),
  );

  describe("renders", () => {
    it("should call PupilViewsProgrammeListing with correct props", () => {
      render(
        <PupilProgrammeListingPage
          programmes={programmes}
          baseSlug="physics-secondary-year-11"
          yearSlug="year-11"
        />,
      );
      expect(PupilViewsProgrammeListing).toHaveBeenCalled();
    });
  });

  describe("getStaticProps", () => {
    it("Should call API:pupilProgrammeListingQuery", async () => {
      await getStaticProps({
        params: {
          programmeSlug: "physics-secondary-year-11",
        },
      });

      expect(
        curriculumApi2023.default.pupilProgrammeListingQuery,
      ).toHaveBeenCalledWith({
        baseSlug: "physics-secondary-year-11",
        isLegacy: false,
      });
    });
  });
});
