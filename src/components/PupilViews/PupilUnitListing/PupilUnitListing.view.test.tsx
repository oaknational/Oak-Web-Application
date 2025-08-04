import "@testing-library/jest-dom";
import {
  OakInfoProps,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";
import mockRouter from "next-router-mock";

import { PupilViewsUnitListing } from "./PupilUnitListing.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { unitBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/unitBrowseData.fixture";
import { UnitsSectionData } from "@/pages/pupils/programmes/[programmeSlug]/units";

// Mock the useAnalytics hook
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: jest.fn(() => ({ track: jest.fn() })),
}));

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
          unitSlug: "unit-slug-1",
          unitData: {
            ...unitBrowseDataFixture({}).unitData,
            title: "Unit title 1",
          },
          lessonCount: 26,
        }),
      ],
      [
        unitBrowseDataFixture({
          unitSlug: "unit-slug-2",
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
    breadcrumbs: ["Maths", "Year 10"],
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
          unitSlug: "unit-slug-1",
          unitData: {
            ...unitBrowseDataFixture({}).unitData,
            title: "Unit title 1",
          },
          lessonCount: 26,
        }),
      ],
      [
        unitBrowseDataFixture({
          unitSlug: "unit-slug-2",
          unitData: {
            ...unitBrowseDataFixture({}).unitData,
            title: "Unit title 2",
          },
          programmeFields: {
            ...unitBrowseDataFixture({}).programmeFields,
          },
        }),
        unitBrowseDataFixture({
          unitSlug: "unit-slug-3",
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
    breadcrumbs: ["Maths", "Year 10"],
  },
];

const backHrefSlugs = {
  baseSlug: "maths-secondary-year-10",
  yearSlug: "year-10",
  tierSlug: "foundation",
  examboardSlug: null,
};

const programmeFields = unitBrowseDataFixture({}).programmeFields;

describe("PupilViewsUnitListing", () => {
  it("should render the subjectTitle, unitTitle, and yearDescription", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsUnitListing
          unitSections={unitSections}
          phase="secondary"
          backHrefSlugs={backHrefSlugs}
          subjectCategories={[]}
          programmeFields={programmeFields}
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
          subjectCategories={[]}
          programmeFields={programmeFields}
        />
      </OakThemeProvider>,
    );
    expect(getByText("Unit title 1")).toBeInTheDocument();
    expect(getByTestId("unit-count")).toHaveTextContent(
      `(${unitSections[0]?.counterLength})`,
    );
  });

  it("should render breadcrumbs", () => {
    if (unitSections[0]) {
      unitSections[0].breadcrumbs = [
        "Combined science",
        "Year 11",
        "Foundation",
        "AQA",
      ];
    }

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsUnitListing
          unitSections={unitSections}
          phase="secondary"
          backHrefSlugs={backHrefSlugs}
          subjectCategories={[]}
          programmeFields={programmeFields}
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
          subjectCategories={[]}
          programmeFields={programmeFields}
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
          subjectCategories={[]}
          programmeFields={programmeFields}
        />
      </OakThemeProvider>,
    );
    expect(getByText("Unit title 1")).toBeInTheDocument();
    expect(getByText("Unit title 2")).toBeInTheDocument();
    expect(getByText("Optionality Title 1")).toBeInTheDocument();
    expect(getByText("Optionality Title 2")).toBeInTheDocument();
  });
  it("does render subject description for financial education", async () => {
    const { queryByTestId } = await renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsUnitListing
          unitSections={unitsWithOptionality}
          phase="secondary"
          backHrefSlugs={backHrefSlugs}
          subjectCategories={[]}
          programmeFields={{
            ...programmeFields,
            subjectSlug: "financial-education",
          }}
        />
      </OakThemeProvider>,
    );
    const financeSubjectDescription = await queryByTestId(
      "pupil-financial-education-description",
    );
    expect(financeSubjectDescription).toBeInTheDocument();
  });

  it("doesn't render subject description for computing", async () => {
    const { queryByTestId } = await renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsUnitListing
          unitSections={unitsWithOptionality}
          phase="secondary"
          backHrefSlugs={backHrefSlugs}
          subjectCategories={[]}
          programmeFields={programmeFields}
        />
      </OakThemeProvider>,
    );
    const financeSubjectDescription = await queryByTestId(
      "pupil-financial-education-description",
    );
    expect(financeSubjectDescription).not.toBeInTheDocument();
  });
  it("renders a related subject banner if present", async () => {
    const { queryByTestId } = await renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsUnitListing
          unitSections={unitsWithOptionality}
          phase="secondary"
          backHrefSlugs={backHrefSlugs}
          subjectCategories={[]}
          programmeFields={programmeFields}
          relatedSubjects={["financial-education"]}
        />
      </OakThemeProvider>,
    );
    const financeSubjectDescription = await queryByTestId(
      "financial-education-banner",
    );
    expect(financeSubjectDescription).toBeInTheDocument();
  });

  it("renders no related subject banners if no related subjects", async () => {
    const { queryByTestId } = await renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsUnitListing
          unitSections={unitsWithOptionality}
          phase="secondary"
          backHrefSlugs={backHrefSlugs}
          subjectCategories={[]}
          programmeFields={programmeFields}
          relatedSubjects={[]}
        />
      </OakThemeProvider>,
    );
    const financeSubjectDescription = await queryByTestId(
      "financial-education-banner",
    );
    expect(financeSubjectDescription).not.toBeInTheDocument();
  });
});
describe("redirected overlay", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/?redirected=true");
  });
  it("should show redirect modal when redirected query param is present", async () => {
    mockRouter.setCurrentUrl("/?redirected=true");
    const { getByTestId } = await renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsUnitListing
          unitSections={unitSections}
          phase="secondary"
          backHrefSlugs={backHrefSlugs}
          subjectCategories={[]}
          programmeFields={programmeFields}
        />
      </OakThemeProvider>,
    );
    expect(getByTestId("pupil-redirected-overlay-btn")).toBeInTheDocument();
  });
});
