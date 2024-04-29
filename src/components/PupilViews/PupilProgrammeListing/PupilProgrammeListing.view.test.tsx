import { act, render } from "@testing-library/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilViewsProgrammeListing } from "./PupilProgrammeListing.view";

import {
  ProgrammeFields,
  PupilProgrammeListingData,
} from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";
import { programmeFieldsFixture } from "@/node-lib/curriculum-api-2023/fixtures/programmeFields.fixture";

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
      examboard: "Edexcel",
      examboardSlug: "edexcel",
      examboardDisplayOrder: 2,
    },
    {
      tier: "core",
      tierSlug: "core",
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

    const props = {
      programmes: programmes,
      baseSlug: "baseSlug",
      isLegacy: false,
      yearSlug: "year-11",
    };
    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsProgrammeListing {...props} />
      </OakThemeProvider>,
    );

    expect(getByText("Choose an Examboard")).toBeInTheDocument();
  });

  it("renders BrowseTierSelector when there are multiple tiers and only one examboard", () => {
    const programmes: PupilProgrammeListingData[] = programmeFields
      .filter((p) => p.examboard === "AQA")
      .map((programmeField) => ({
        programmeSlug: "physics-test-slug",
        programmeFields: programmeField,
        yearSlug: "year-11",
      }));

    const props = {
      programmes: programmes,
      baseSlug: "baseSlug",
      isLegacy: false,
      yearSlug: "year-11",
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

    const props = {
      programmes: programmes,
      baseSlug: "baseSlug",
      isLegacy: false,
      yearSlug: "year-11",
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

    expect(getByRole("link", { name: "foundation" })).toBeInTheDocument();
  });
});
