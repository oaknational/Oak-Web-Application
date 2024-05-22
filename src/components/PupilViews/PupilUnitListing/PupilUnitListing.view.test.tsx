import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  OakInfoProps,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { PupilViewsUnitListing } from "./PupilUnitListing.view";

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
          units={[data]}
          programmeFields={data.programmeFields}
        />
      </OakThemeProvider>,
    );
    expect(getByText("Maths")).toBeInTheDocument();
    expect(getByText("Year 1")).toBeInTheDocument();
  });

  it("should render the unit titles and number of lessons", () => {
    const data = unitBrowseDataFixture({
      programmeSlug: "maths-secondary-year-10-aqa-core",
    });

    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsUnitListing
          programmeFields={data.programmeFields}
          units={[data]}
        />
      </OakThemeProvider>,
    );
    expect(getByText("unit-title")).toBeInTheDocument();
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

    expect(() =>
      render(
        <OakThemeProvider theme={oakDefaultTheme}>
          <PupilViewsUnitListing
            programmeFields={data.programmeFields}
            units={[data]}
          />
        </OakThemeProvider>,
      ),
    ).toThrow("Foundation phase not supported");
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
      }),
    ];

    if (!data[0]) {
      throw new Error("No curriculum data");
    }

    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsUnitListing
          units={data}
          programmeFields={data[0].programmeFields}
        />
      </OakThemeProvider>,
    );
    expect(getByText("unit-title-1")).toBeInTheDocument();
    expect(getByText("optional title 1")).toBeInTheDocument();
    expect(getByText("optional title 2")).toBeInTheDocument();
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
      }),
    ];

    if (!data[0]) {
      throw new Error("No curriculum data");
    }

    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsUnitListing
          units={data}
          programmeFields={data[0].programmeFields}
        />
      </OakThemeProvider>,
    );
    expect(getByText("unit-title-1 - optional title 1")).toBeInTheDocument();
  });
});
