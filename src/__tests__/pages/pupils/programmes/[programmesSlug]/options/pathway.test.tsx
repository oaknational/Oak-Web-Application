import PupilProgrammeListingPage, {
  getStaticProps,
} from "@/pages/pupils/programmes/[programmeSlug]/options/pathway/[pathwaySlug]";
import * as curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import { PupilViewsProgrammeListing } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { getAvailableProgrammeFactor } from "@/pages-helpers/pupil/options-pages/getAvailableProgrammeFactor";
import { pupilProgrammeListingFixturePathwaysEBs } from "@/node-lib/curriculum-api-2023/fixtures/pupilProgrammeListing.fixture";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

const render = renderWithProviders();

jest.mock(
  "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view",
  () => ({
    PupilViewsProgrammeListing: jest.fn((props) => <div>{props.baseSlug}</div>),
  }),
);

const programmes = pupilProgrammeListingFixturePathwaysEBs();
const examboards = getAvailableProgrammeFactor({
  factorPrefix: "examboard",
  programmes: programmes,
});
const pathways = getAvailableProgrammeFactor({
  factorPrefix: "pathway",
  programmes: programmes,
});

describe("pages/pupils/programmes/[programmeSlug]/options/examboard/aqa", () => {
  describe("renders", () => {
    it("should call PupilViewsProgrammeListing with correct props", () => {
      render(
        <PupilProgrammeListingPage
          programmes={programmes}
          baseSlug="physics-secondary-year-11"
          yearSlug="year-11"
          pathwaySlug={"gcse"}
          examboards={examboards}
          tiers={[]}
          pathways={pathways}
          topNav={topNavFixture}
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
          pathwaySlug: "gcse",
        },
      });

      expect(
        curriculumApi2023.default.pupilProgrammeListingQuery,
      ).toHaveBeenCalledWith({
        baseSlug: "physics-secondary-year-11",
      });
    });
    it("Should throw erro oak error if baseSlug is not provided", async () => {
      await expect(
        getStaticProps({
          params: {
            pathwaySlug: "gcse",
            programmeSlug: "",
          },
        }),
      ).rejects.toThrow();
    });
    it("Should throw erro oak error if examboardSlug is not provided", async () => {
      await expect(
        getStaticProps({
          params: {
            pathwaySlug: "fake-pathway",
            programmeSlug: "physics-secondary-year-11",
          },
        }),
      ).rejects.toThrow();
    });
  });
});
