import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import _ from "lodash";
import {
  OakInfoProps,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import {
  PupilViewsUnitListing,
  getSecondUnitSectionProps,
} from "./PupilUnitListing.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { unitBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/unitBrowseData.fixture";

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

describe("PupilViewsUnitListing", () => {
  it("should render the subjectTitle, unitTitle, and yearDescription", () => {
    const data = unitBrowseDataFixture({
      programmeSlug: "maths-secondary-year-10-aqa-core",
    });

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsUnitListing
          programmeSlug="maths-secondary-year-10-aqa-core"
          units={[data]}
          programmeFields={data.programmeFields}
        />
      </OakThemeProvider>,
    );
    expect(getByText("Maths")).toBeInTheDocument();
    expect(getByText("Year 1")).toBeInTheDocument();
  });

  it("should render the unit titles and number of lessons", () => {
    const unit = unitBrowseDataFixture({
      programmeSlug: "maths-secondary-year-10-aqa-core",
      lessonCount: 26,
    });
    const data = [unit];

    const { getByText, getByTestId } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsUnitListing
          units={data}
          programmeSlug="maths-secondary-year-10-aqa-core"
          programmeFields={unit.programmeFields}
        />
      </OakThemeProvider>,
    );
    expect(getByText("unit-title")).toBeInTheDocument();
    expect(getByTestId("unit-count")).toHaveTextContent(`(${data.length})`);
  });

  it("should render the unit titles in the correct order", () => {
    const data = [
      unitBrowseDataFixture({
        unitData: {
          ...unitBrowseDataFixture({}).unitData,
          title: "unit-title-1",
        },
        supplementaryData: { unitOrder: 2 },
        programmeSlug: "maths-secondary-year-10-aqa-core",
        unitSlug: "unit-slug-1",
      }),
      unitBrowseDataFixture({
        unitData: {
          ...unitBrowseDataFixture({}).unitData,
          title: "unit-title-2",
        },
        unitSlug: "unit-slug-2",
        supplementaryData: { unitOrder: 1 },
        programmeSlug: "maths-secondary-year-10-aqa-core",
      }),
    ];

    if (!data[0]) {
      throw new Error("No curriculum data");
    }

    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsUnitListing
          programmeSlug="maths-secondary-year-10-aqa-core"
          units={data}
          programmeFields={data[0].programmeFields}
        />
      </OakThemeProvider>,
    );
    const e1 = getByText("unit-title-1");
    const e2 = getByText("unit-title-2");
    expect(e2.compareDocumentPosition(e1)).toBe(2);
  });

  it("should throw an error if the phase is foundation", () => {
    const data = unitBrowseDataFixture({
      programmeFields: {
        ...unitBrowseDataFixture({}).programmeFields,
        phase: "foundation",
      },
    });

    const consoleErrorFn = jest
      .spyOn(console, "error")
      .mockImplementation(() => jest.fn());

    expect(() =>
      render(
        <OakThemeProvider theme={oakDefaultTheme}>
          <PupilViewsUnitListing
            programmeSlug="maths-secondary-year-10-aqa-core"
            programmeFields={data.programmeFields}
            units={[data]}
          />
        </OakThemeProvider>,
      ),
    ).toThrow("Foundation phase not supported");

    consoleErrorFn.mockRestore();
  });

  it("should render breadcrumbs", () => {
    const data = unitBrowseDataFixture({
      programmeSlug: "combined-science-secondary-year-11-foundation-aqa",
      programmeFields: {
        ...unitBrowseDataFixture({}).programmeFields,
        subject: "Combined science",
        examboard: "AQA",
        phase: "secondary",
        yearDescription: "Year 11",
        tierDescription: "Foundation",
      },
    });

    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsUnitListing
          programmeSlug="maths-secondary-year-10-aqa-core"
          programmeFields={data.programmeFields}
          units={[data]}
        />
      </OakThemeProvider>,
    );
    expect(getByText("Combined science")).toBeInTheDocument();
    expect(getByText("Year 11")).toBeInTheDocument();
    expect(getByText("Foundation")).toBeInTheDocument();
    expect(getByText("AQA")).toBeInTheDocument();
  });
  it("should render units with optionality units if more than one option", () => {
    const data = [
      unitBrowseDataFixture({
        unitData: {
          ...unitBrowseDataFixture({}).unitData,
          title: "unit-title-1",
        },
        programmeFields: {
          ...unitBrowseDataFixture({}).programmeFields,
          optionality: "optional title 1",
        },
        supplementaryData: { unitOrder: 2 },
        programmeSlug: "maths-secondary-year-10-aqa-core",
        unitSlug: "unit-slug-1-2",
        lessonCount: 26,
      }),
      unitBrowseDataFixture({
        unitData: {
          ...unitBrowseDataFixture({}).unitData,
          title: "unit-title-1",
        },
        programmeFields: {
          ...unitBrowseDataFixture({}).programmeFields,
        },
        supplementaryData: { unitOrder: 2 },
        programmeSlug: "maths-secondary-year-10-aqa-core",
        unitSlug: "unit-slug-1-2",
        lessonCount: 26,
      }),
      unitBrowseDataFixture({
        unitData: {
          ...unitBrowseDataFixture({}).unitData,
          title: "unit-title-1",
        },
        programmeFields: {
          ...unitBrowseDataFixture({}).programmeFields,
          optionality: "optional title 2",
        },
        unitSlug: "unit-slug-1-2",
        supplementaryData: { unitOrder: 1 },
        programmeSlug: "maths-secondary-year-10-aqa-core",
        lessonCount: 26,
      }),
    ];

    if (!data[0]) {
      throw new Error("No curriculum data");
    }

    const { getByText, getByTestId } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsUnitListing
          programmeSlug="maths-secondary-year-10-aqa-core"
          units={data}
          programmeFields={data[0].programmeFields}
        />
      </OakThemeProvider>,
    );
    expect(getByText("unit-title-1")).toBeInTheDocument();
    expect(getByText("optional title 1")).toBeInTheDocument();
    expect(getByText("optional title 2")).toBeInTheDocument();

    expect(getByTestId("unit-count")).toHaveTextContent(`(${data.length})`);
  });
  it("should render OakPupilListitem if only one optionality option", () => {
    const data = [
      unitBrowseDataFixture({
        unitData: {
          ...unitBrowseDataFixture({}).unitData,
          title: "unit-title-1",
        },
        programmeFields: {
          ...unitBrowseDataFixture({}).programmeFields,
          optionality: "optional title 1",
        },
        supplementaryData: { unitOrder: 2 },
        programmeSlug: "maths-secondary-year-10-aqa-core",
        unitSlug: "unit-slug-1",
        lessonCount: 26,
      }),
      unitBrowseDataFixture({
        unitData: {
          ...unitBrowseDataFixture({}).unitData,
          title: "unit-title-1",
        },
        programmeFields: {
          ...unitBrowseDataFixture({}).programmeFields,
        },
        supplementaryData: { unitOrder: 2 },
        programmeSlug: "maths-secondary-year-10-aqa-core",
        unitSlug: "unit-slug-1-2",
        lessonCount: 52,
      }),
    ];

    if (!data[0]) {
      throw new Error("No curriculum data");
    }

    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsUnitListing
          programmeSlug="maths-secondary-year-10-aqa-core"
          units={data}
          programmeFields={data[0].programmeFields}
        />
      </OakThemeProvider>,
    );
    expect(getByText("unit-title-1 - optional title 1")).toBeInTheDocument();
  });

  it("should create props for secondary section of units correcly (show legacy)", () => {
    const cycle1Data = unitBrowseDataFixture({
      programmeSlug: "maths-secondary-year-10-aqa-core",
    });
    const legacyData = unitBrowseDataFixture({
      programmeSlug: "maths-secondary-year-10-aqa-core-l",
      isLegacy: true,
    });

    const unitsByProgramme = _.groupBy(
      [cycle1Data, legacyData],
      "programmeSlug",
    );

    const result = getSecondUnitSectionProps({
      programmeSlug: "maths-secondary-year-10-aqa-core",
      baseSlug: "maths-secondary-year-10",
      tierSlug: null,
      phase: "secondary",
      unitsByProgramme: unitsByProgramme,
    });

    if (!result.units || !result.units[0] || !result.units[0][0]) {
      throw new Error("No units");
    }

    expect(result.units).toHaveLength(1);
    expect(result.units[0][0].programmeSlug).toBe(
      "maths-secondary-year-10-aqa-core-l",
    );
  });

  it("should create props for secondary section of units correcly (show new)", () => {
    const cycle1Data = unitBrowseDataFixture({
      programmeSlug: "maths-secondary-year-10",
    });
    const legacyData = unitBrowseDataFixture({
      programmeSlug: "maths-secondary-year-10-l",
      isLegacy: true,
    });

    const unitsByProgramme = _.groupBy(
      [cycle1Data, legacyData],
      "programmeSlug",
    );

    const result = getSecondUnitSectionProps({
      programmeSlug: "maths-secondary-year-10-l",
      baseSlug: "maths-secondary-year-10",
      tierSlug: null,
      phase: "secondary",
      unitsByProgramme: unitsByProgramme,
    });

    if (!result.units || !result.units[0] || !result.units[0][0]) {
      throw new Error("No units");
    }

    expect(result.units).toHaveLength(1);
    expect(result.units[0][0].programmeSlug).toBe("maths-secondary-year-10");
  });

  it("should create props for secondary section of units correcly (tier match)", () => {
    const cycle1Data = unitBrowseDataFixture({
      programmeSlug: "combined-science-secondary-year-10-higher-aqa",
    });
    const legacyData = unitBrowseDataFixture({
      programmeSlug: "combined-science-secondary-year-10-higher-l",
      isLegacy: true,
    });

    const unitsByProgramme = _.groupBy(
      [cycle1Data, legacyData],
      "programmeSlug",
    );

    const result = getSecondUnitSectionProps({
      programmeSlug: "combined-science-secondary-year-10-higher-aqa",
      baseSlug: "combined-science-secondary-year-10",
      tierSlug: "higher",
      phase: "secondary",
      unitsByProgramme: unitsByProgramme,
    });

    if (!result.units || !result.units[0] || !result.units[0][0]) {
      throw new Error("No units");
    }

    expect(result.units).toHaveLength(1);
    expect(result.units[0][0].programmeSlug).toBe(
      "combined-science-secondary-year-10-higher-l",
    );
  });
});
