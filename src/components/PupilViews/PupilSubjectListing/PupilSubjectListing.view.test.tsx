import { render, screen, within } from "@testing-library/react";

import { PupilViewsSubjectListing } from "./PupilSubjectListing.view";

import {
  OakThemeProvider,
  isValidIconName,
  oakDefaultTheme,
} from "@oaknational/oak-components";
import { subjectBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/subjectBrowseData.fixture";

jest.mock("@oaknational/oak-components", () => {
  // Get the original module to preserve other exports.
  const originalModule = jest.requireActual("@oaknational/oak-components");
  return {
    ...originalModule,
    isValidIconName: jest.fn(() => true),
  };
});

// Mock the useAnalytics hook
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: jest.fn(() => ({ track: jest.fn() })),
}));

describe("PupilSubjectListing", () => {
  it("should render the subjects alphabetically ordered", () => {
    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsSubjectListing
          subjects={[
            subjectBrowseDataFixture({
              baseSlug: "maths-primary-year-6",
              isLegacy: false,
              programmeFields: {
                ...subjectBrowseDataFixture({}).programmeFields,
                subjectSlug: "maths",
                subject: "Maths",
              },
            }),
            subjectBrowseDataFixture({
              baseSlug: "biology-primary-year-6",
              isLegacy: false,
              programmeFields: {
                ...subjectBrowseDataFixture({}).programmeFields,
                subjectSlug: "biology",
                subject: "Biology",
              },
            }),
            subjectBrowseDataFixture({
              baseSlug: "biology-primary-year-6",
              isLegacy: false,
              programmeFields: {
                ...subjectBrowseDataFixture({}).programmeFields,
                subjectSlug: "biology",
                subject: "Biology",
              },
            }),
          ]}
        />
      </OakThemeProvider>,
    );
    const e1 = getByText("Biology");
    const e2 = getByText("Maths");
    expect(e2.compareDocumentPosition(e1)).toBe(2);
  });
  it("should filter non-curriculum subjects from the main grid and render them in 'Further lessons'", () => {
    (
      isValidIconName as jest.MockedFunction<typeof isValidIconName>
    ).mockReturnValue(false);

    const maths = subjectBrowseDataFixture({
      baseSlug: "maths-secondary-year-6",
      isLegacy: false,
      features: { nonCurriculum: true },
      programmeFields: {
        ...subjectBrowseDataFixture({}).programmeFields,
        subjectSlug: "maths",
        subject: "Maths",
        phaseSlug: "secondary",
      },
    });
    const biology = subjectBrowseDataFixture({
      baseSlug: "biology-secondary-year-6",
      isLegacy: false,
      features: { nonCurriculum: true },
      programmeFields: {
        ...subjectBrowseDataFixture({}).programmeFields,
        subjectSlug: "biology",
        subject: "Biology",
        phaseSlug: "secondary",
      },
    });

    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsSubjectListing subjects={[maths, biology]} />
      </OakThemeProvider>,
    );

    expect.assertions(5);
    const lists = screen.getAllByRole("list");
    expect(lists.length).toBe(2);
    expect(
      screen.getByRole("heading", { level: 2, name: /Further lessons/i }),
    ).toBeInTheDocument();
    if (lists.length < 2 || !lists[0] || !lists[1]) return;
    const furtherListItems = within(lists[1]).queryAllByRole("listitem");
    expect(furtherListItems.length).toBe(2);
    if (furtherListItems.length < 1 || !furtherListItems[0]) return;
    expect(
      within(furtherListItems[0]).getByText("Biology"),
    ).toBeInTheDocument();
    const img = within(furtherListItems[0]).queryByTestId("question-mark");
    expect(img).toBeInTheDocument();
  });

  it("should show questionmark icon if the icon is not valid'", () => {
    (
      isValidIconName as jest.MockedFunction<typeof isValidIconName>
    ).mockReturnValue(false);

    const maths = subjectBrowseDataFixture({
      baseSlug: "maths-secondary-year-6",
      isLegacy: false,
      features: { nonCurriculum: true },
      programmeFields: {
        ...subjectBrowseDataFixture({}).programmeFields,
        subjectSlug: "maths",
        subject: "Maths",
        phaseSlug: "secondary",
      },
    });
    const biology = subjectBrowseDataFixture({
      baseSlug: "biology-secondary-year-6",
      isLegacy: false,
      features: { nonCurriculum: true },
      programmeFields: {
        ...subjectBrowseDataFixture({}).programmeFields,
        subjectSlug: "biology",
        subject: "Biology",
        phaseSlug: "secondary",
      },
    });
    const french = subjectBrowseDataFixture({
      baseSlug: "french-secondary-year-6",
      isLegacy: false,
      programmeFields: {
        ...subjectBrowseDataFixture({}).programmeFields,
        subjectSlug: "french",
        subject: "French",
        phaseSlug: "secondary",
      },
    });

    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <PupilViewsSubjectListing subjects={[maths, biology, french]} />
      </OakThemeProvider>,
    );

    const lists = screen.getAllByRole("list");
    const furtherListItems = within(lists[1]!).getAllByRole("listitem");
    const img = within(furtherListItems[0]!).getByTestId("question-mark");
    expect(img).toBeInTheDocument();
  });
});
