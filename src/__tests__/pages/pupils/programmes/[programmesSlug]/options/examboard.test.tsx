import PupilProgrammeListingPage, {
  getStaticProps,
} from "@/pages/pupils/programmes/[programmeSlug]/options/examboard/[examboardSlug]";
import * as curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import { PupilViewsProgrammeListing } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { getAvailableProgrammeFactor } from "@/pages-helpers/pupil/options-pages/getAvailableProgrammeFactor";
import { pupilProgrammeListingFixtureEBs } from "@/node-lib/curriculum-api-2023/fixtures/pupilProgrammeListing.fixture";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

const render = renderWithProviders();

jest.mock(
  "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view",
  () => ({
    PupilViewsProgrammeListing: jest.fn((props) => <div>{props.baseSlug}</div>),
  }),
);

const programmesEBs = pupilProgrammeListingFixtureEBs();
const examboardsEBs = getAvailableProgrammeFactor({
  factorPrefix: "examboard",
  programmes: programmesEBs,
});

describe("pages/pupils/programmes/[programmeSlug]/options/examboard/aqa", () => {
  describe("renders", () => {
    it("should call PupilViewsProgrammeListing with correct props", () => {
      render(
        <PupilProgrammeListingPage
          topNav={topNavFixture}
          programmes={programmesEBs}
          baseSlug="physics-secondary-year-11"
          yearSlug="year-11"
          examboardSlug={"aqa"}
          examboards={examboardsEBs}
          tiers={[]}
          pathways={[]}
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
          examboardSlug: "aqa",
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
            examboardSlug: "aqa",
            programmeSlug: "",
          },
        }),
      ).rejects.toThrowError();
    });
    it("Should throw erro oak error if examboardSlug is not provided", async () => {
      await expect(
        getStaticProps({
          params: {
            examboardSlug: "fake-examboard",
            programmeSlug: "physics-secondary-year-11",
          },
        }),
      ).rejects.toThrowError();
    });
  });
});
