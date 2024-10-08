import {
  OakInfoProps,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { PupilViewsProgrammeListing } from "./PupilProgrammeListing.view";

import * as BrowseFactorSelector from "@/components/PupilComponents/BrowseFactorSelector";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import {
  pupilProgrammeListingFixtureEBs,
  pupilProgrammeListingFixturePathwaysEBs,
} from "@/node-lib/curriculum-api-2023/fixtures/pupilProgrammeListing.fixture";
import { getAvailableProgrammeFactor } from "@/pages-helpers/pupil/options-pages/getAvailableProgrammeFactor";

const programmesPathwaysEBs = pupilProgrammeListingFixturePathwaysEBs();
const examboards = getAvailableProgrammeFactor({
  factorPrefix: "examboard",
  programmes: programmesPathwaysEBs,
});

const programmesEBs = pupilProgrammeListingFixtureEBs();
const examboardsEBs = getAvailableProgrammeFactor({
  factorPrefix: "examboard",
  programmes: programmesEBs,
});

const programmesEBsTiers = pupilProgrammeListingFixturePathwaysEBs();
const examboardsEBsTiers = getAvailableProgrammeFactor({
  factorPrefix: "examboard",
  programmes: programmesEBsTiers,
});
const tiersEBsTiers = getAvailableProgrammeFactor({
  factorPrefix: "tier",
  programmes: programmesEBsTiers,
});

const pathways = getAvailableProgrammeFactor({
  factorPrefix: "pathway",
  programmes: programmesPathwaysEBs,
});

const render = renderWithProviders();

jest.mock("@oaknational/oak-components", () => {
  return {
    ...jest.requireActual("@oaknational/oak-components"),
    OakInfo: ({ hint }: OakInfoProps) => (
      <>
        <div role="tooltip">{hint}</div>
      </>
    ),
  };
});

// mock browse factor selector component
jest.mock("@/components/PupilComponents/BrowseFactorSelector", () => {
  const originalModule = jest.requireActual<typeof BrowseFactorSelector>(
    "@/components/PupilComponents/BrowseFactorSelector",
  );
  return {
    ...originalModule,
    BrowseFactorSelector: jest.fn(() => <div>BrowseFactorSelector</div>),
  };
});

describe("PublicProgrammeListing", () => {
  it("presents pathways before examboards", () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsProgrammeListing
          baseSlug="my-subject"
          yearSlug="year-11"
          programmes={programmesPathwaysEBs}
          examboards={examboards}
          pathways={pathways}
          tiers={[]}
        />
        ,
      </OakThemeProvider>,
    );

    expect(BrowseFactorSelector.BrowseFactorSelector).toHaveBeenCalledWith(
      expect.objectContaining({
        factorType: "pathway",
      }),
      {},
    );
  });

  it("presents examboards before tiers", () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsProgrammeListing
          baseSlug="my-subject"
          yearSlug="year-11"
          programmes={programmesPathwaysEBs}
          examboards={examboardsEBsTiers}
          pathways={[]}
          tiers={tiersEBsTiers}
        />
        ,
      </OakThemeProvider>,
    );

    expect(BrowseFactorSelector.BrowseFactorSelector).toHaveBeenCalledWith(
      expect.objectContaining({
        factorType: "examboard",
      }),
      {},
    );
  });

  it("renders the correct option information", () => {
    // render the component
    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsProgrammeListing
          baseSlug="my-subject"
          yearSlug="year-11"
          programmes={programmesPathwaysEBs}
          examboards={examboardsEBsTiers}
          pathways={[]}
          tiers={tiersEBsTiers}
        />
        ,
      </OakThemeProvider>,
    );
    expect(getByText("Choose an exam board")).toBeInTheDocument();
  });

  it("renders the correct backlink", () => {
    // render the component
    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsProgrammeListing
          baseSlug="my-subject"
          yearSlug="year-11"
          programmes={programmesEBs}
          examboards={examboardsEBs}
          pathways={[]}
          tiers={[]}
        />
        ,
      </OakThemeProvider>,
    );
    expect(getByText("Change subject")).toBeInTheDocument();
  });
});
