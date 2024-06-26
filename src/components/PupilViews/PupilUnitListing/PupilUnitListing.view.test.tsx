import "@testing-library/jest-dom";
import {
  OakInfoProps,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { PupilViewsUnitListing } from "./PupilUnitListing.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { unitBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/unitBrowseData.fixture";
import { UnitsSectionData } from "@/pages/pupils/programmes/[programmeSlug]/units";

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

const unitSections: UnitsSectionData[] = [
  {
    title: "Units",
    phase: "secondary",
    icon: "subject-maths",
    units: [
      [
        unitBrowseDataFixture({
          unitData: {
            ...unitBrowseDataFixture({}).unitData,
            title: "Unit title 1",
          },
          lessonCount: 26,
        }),
      ],
      [
        unitBrowseDataFixture({
          unitData: {
            ...unitBrowseDataFixture({}).unitData,
            title: "Unit title 2",
          },
          programmeFields: {
            ...unitBrowseDataFixture({}).programmeFields,
            optionality: "optional title 2",
          },
          lessonCount: 52,
        }),
      ],
    ],
    counterText: "Units",
    counterLength: 2,
  },
];

const unitsWithOptionality: UnitsSectionData[] = [
  {
    title: "Units",
    phase: "secondary",
    icon: "subject-maths",
    units: [
      [
        unitBrowseDataFixture({
          unitData: {
            ...unitBrowseDataFixture({}).unitData,
            title: "Unit title 1",
          },
          lessonCount: 26,
        }),
      ],
      [
        unitBrowseDataFixture({
          unitData: {
            ...unitBrowseDataFixture({}).unitData,
            title: "Unit title 2",
          },
          programmeFields: {
            ...unitBrowseDataFixture({}).programmeFields,
          },
        }),
        unitBrowseDataFixture({
          unitData: {
            ...unitBrowseDataFixture({}).unitData,
            title: "Unit title 2",
          },
          programmeFields: {
            ...unitBrowseDataFixture({}).programmeFields,
            optionality: "Optionality Title 1",
          },
          lessonCount: 42,
        }),
        unitBrowseDataFixture({
          unitData: {
            ...unitBrowseDataFixture({}).unitData,
            title: "Unit title 2",
          },
          programmeFields: {
            ...unitBrowseDataFixture({}).programmeFields,
            optionality: "Optionality Title 2",
          },
          lessonCount: 52,
        }),
      ],
    ],
    counterText: "Units",
    counterLength: 2,
  },
];

// const unitsWithOptionality = unitSections;
// unitsWithOptionality[1].units[].push([

const backHrefSlugs = {
  baseSlug: "maths-secondary-year-10",
  yearSlug: "year-10",
  tierSlug: "foundation",
  examboardSlug: null,
};

describe("PupilViewsUnitListing", () => {
  it("should render the subjectTitle, unitTitle, and yearDescription", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsUnitListing
          unitSections={unitSections}
          phase="secondary"
          backHrefSlugs={backHrefSlugs}
          breadcrumbs={["Maths", "Year 10"]}
        />
      </OakThemeProvider>,
    );
    expect(getByText("Maths")).toBeInTheDocument();
    expect(getByText("Year 10")).toBeInTheDocument();
  });

  it("should render the unit titles and number of lessons", () => {
    const { getByText, getByTestId } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsUnitListing
          unitSections={unitSections}
          phase="secondary"
          backHrefSlugs={backHrefSlugs}
          breadcrumbs={["Maths", "Year 10"]}
        />
      </OakThemeProvider>,
    );
    expect(getByText("Unit title 1")).toBeInTheDocument();
    expect(getByTestId("unit-count")).toHaveTextContent(
      `(${unitSections[0]?.counterLength})`,
    );
  });

  it("should render breadcrumbs", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsUnitListing
          unitSections={unitSections}
          phase="secondary"
          backHrefSlugs={backHrefSlugs}
          breadcrumbs={["Combined science", "Year 11", "Foundation", "AQA"]}
        />
      </OakThemeProvider>,
    );
    expect(getByText("Combined science")).toBeInTheDocument();
    expect(getByText("Year 11")).toBeInTheDocument();
    expect(getByText("Foundation")).toBeInTheDocument();
    expect(getByText("AQA")).toBeInTheDocument();
  });

  it("should render OakPupilListitem if only one optionality option", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsUnitListing
          unitSections={unitSections}
          phase="secondary"
          backHrefSlugs={backHrefSlugs}
          breadcrumbs={["Maths", "Year 10"]}
        />
      </OakThemeProvider>,
    );
    expect(getByText("Unit title 2 - optional title 2")).toBeInTheDocument();
  });

  it("should render units with optionality units if more than one option", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsUnitListing
          unitSections={unitsWithOptionality}
          phase="secondary"
          backHrefSlugs={backHrefSlugs}
          breadcrumbs={["Maths", "Year 10"]}
        />
      </OakThemeProvider>,
    );
    expect(getByText("Unit title 1")).toBeInTheDocument();
    expect(getByText("Unit title 2")).toBeInTheDocument();
    expect(getByText("Optionality Title 1")).toBeInTheDocument();
    expect(getByText("Optionality Title 2")).toBeInTheDocument();
  });
});
