import PupilProgrammeListingPage, {
  getStaticProps,
} from "@/pages/pupils/programmes/[programmeSlug]/options";
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

const programmesEBsTiers = pupilProgrammeListingFixturePathwaysEBs();
const examboardsEBsTiers = getAvailableProgrammeFactor({
  factorPrefix: "examboard",
  programmes: programmesEBsTiers,
});
const tiersEBsTiers = getAvailableProgrammeFactor({
  factorPrefix: "tier",
  programmes: programmesEBsTiers,
});

describe("pages/pupils/programmes/[programmeSlug]/options", () => {
  describe("renders", () => {
    it("should call PupilViewsProgrammeListing with correct props", () => {
      render(
        <PupilProgrammeListingPage
          topNav={topNavFixture}
          programmes={programmesEBsTiers}
          baseSlug="physics-secondary-year-11"
          yearSlug="year-11"
          examboards={examboardsEBsTiers}
          tiers={tiersEBsTiers}
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
        },
      });

      expect(
        curriculumApi2023.default.pupilProgrammeListingQuery,
      ).toHaveBeenCalledWith({
        baseSlug: "physics-secondary-year-11",
      });
    });
  });
});
