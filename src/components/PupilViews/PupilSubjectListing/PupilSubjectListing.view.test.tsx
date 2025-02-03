import { render } from "@testing-library/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilViewsSubjectListing } from "./PupilSubjectListing.view";

import { subjectBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/subjectBrowseData.fixture";

// Mock the useAnalytics hook
vi.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: vi.fn(() => ({ track: vi.fn() })),
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
});
