import { act } from "@testing-library/react";
import {
  OakInfoProps,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import {
  PupilViewsProgrammeListing,
  PupilViewsProgrammeListingProps,
} from "./PupilProgrammeListing.view";

import {
  ProgrammeFields,
  PupilProgrammeListingData,
} from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";
import { programmeFieldsFixture } from "@/node-lib/curriculum-api-2023/fixtures/programmeFields.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const examboards: PupilViewsProgrammeListingProps["examboards"] = [
  {
    examboard: "AQA",
    examboardSlug: "aqa",
    examboardDisplayOrder: 1,
    isLegacy: false,
  },
  {
    examboard: "Edexcel",
    examboardSlug: "edexcel",
    examboardDisplayOrder: 2,
    isLegacy: false,
  },
];

const tiers: PupilViewsProgrammeListingProps["tiers"] = [
  {
    tier: "foundation",
    tierSlug: "foundation",
    tierDisplayOrder: 1,
    tierDescription: "Foundation",
    isLegacy: false,
  },
  {
    tier: "core",
    tierSlug: "core",
    tierDisplayOrder: 2,
    tierDescription: "Core",
    isLegacy: true,
  },
  {
    tier: "higher",
    tierSlug: "higher",
    tierDisplayOrder: 3,
    tierDescription: "Higher",
    isLegacy: false,
  },
];

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

describe("PublicProgrammeListing", () => {
  const overrides: Partial<ProgrammeFields>[] = [
    {
      tier: "foundation",
      tierSlug: "foundation",
      tierDisplayOrder: 1,
      examboard: "AQA",
      examboardSlug: "aqa",
      examboardDisplayOrder: 1,
    },
    {
      tier: "foundation",
      tierSlug: "foundation",
      tierDisplayOrder: 1,
      examboard: "Edexcel",
      examboardSlug: "edexcel",
      examboardDisplayOrder: 2,
    },
    {
      tier: "core",
      tierSlug: "core",
      tierDisplayOrder: 2,
      tierDescription: "Core",
      examboard: "Edexcel",
      examboardSlug: "edexcel",
      examboardDisplayOrder: 2,
    },
    {
      tier: "core",
      tierSlug: "core",
      tierDescription: "Core",
      tierDisplayOrder: 2,
      examboard: "AQA",
      examboardSlug: "aqa",
      examboardDisplayOrder: 1,
    },
  ];

  const programmeFields = overrides.map((override) =>
    programmeFieldsFixture({ overrides: override }),
  );

  it("renders BrowseExamboardSelector when there are multiple examboards and no examboard is chosen", () => {
    const programmes: PupilProgrammeListingData[] = programmeFields.map(
      (programmeField) => ({
        programmeSlug: "physics-test-slug",
        programmeFields: programmeField,
        yearSlug: "year-11",
      }),
    );

    const props: PupilViewsProgrammeListingProps = {
      programmes: programmes,
      baseSlug: "baseSlug",
      yearSlug: "year-11",
      examboardSlug: undefined,
      examboards,
      tiers: [],
    };
    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsProgrammeListing {...props} />
      </OakThemeProvider>,
    );

    expect(getByText("Choose an exam board")).toBeInTheDocument();
  });

  it("renders BrowseTierSelector when there are multiple tiers and only one examboard", () => {
    const programmes: PupilProgrammeListingData[] = programmeFields
      .filter((p) => p.examboard === "AQA")
      .map((programmeField) => ({
        programmeSlug: "physics-test-slug",
        programmeFields: programmeField,
        yearSlug: "year-11",
      }));

    const props: PupilViewsProgrammeListingProps = {
      programmes: programmes,
      baseSlug: "maths-secondary-year-10",
      yearSlug: "year-10",
      examboardSlug: undefined,
      examboards: [],
      tiers,
    };
    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsProgrammeListing {...props} />
      </OakThemeProvider>,
    );

    expect(getByText("Choose a tier")).toBeInTheDocument();
  });

  it("renders BrowseTierSelector when there are multiple tiers and multiple examboards and an examboard is chosen", () => {
    const programmes: PupilProgrammeListingData[] = programmeFields.map(
      (programmeField) => ({
        programmeSlug: "physics-test-slug",
        programmeFields: programmeField,
        yearSlug: "year-11",
      }),
    );

    const props: PupilViewsProgrammeListingProps = {
      programmes: programmes,
      baseSlug: "maths-secondary-year-10",
      yearSlug: "year-10",
      examboardSlug: undefined,
      examboards: examboards,
      tiers,
    };

    const { getByRole } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsProgrammeListing {...props} />
      </OakThemeProvider>,
    );

    expect(getByRole("button", { name: "AQA" })).toBeInTheDocument();

    act(() => {
      getByRole("button", { name: "AQA" }).click();
    });

    expect(getByRole("link", { name: "Core" })).toBeInTheDocument();
  });
});
