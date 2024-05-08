import { render } from "@testing-library/react";
import {
  OakThemeProvider,
  OakTooltipProps,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { PupilViewsLessonListing } from "./PupilLessonListing.view";

import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";

jest.mock("@oaknational/oak-components", () => {
  return {
    ...jest.requireActual("@oaknational/oak-components"),
    OakInfo: ({ children, tooltip }: OakTooltipProps) => (
      <>
        {children}
        <div role="tooltip">{tooltip}</div>
      </>
    ),
  };
});

describe("PupilViewsLessonListing", () => {
  const props = {
    unitData: lessonBrowseDataFixture({
      lessonData: {
        ...lessonBrowseDataFixture({}).lessonData,
        title: "lesson-title-2",
      },
      supplementaryData: { orderInUnit: 2, unitOrder: 4 },
    })["unitData"],
    programmeFields: lessonBrowseDataFixture({
      lessonData: {
        ...lessonBrowseDataFixture({}).lessonData,
        title: "lesson-title-2",
      },
      supplementaryData: { orderInUnit: 2, unitOrder: 4 },
    })["programmeFields"],
    orderedCurriculumData: [
      lessonBrowseDataFixture({
        lessonData: {
          ...lessonBrowseDataFixture({}).lessonData,
          title: "lesson-title-2",
        },
        supplementaryData: { orderInUnit: 2, unitOrder: 4 },
      }),
      lessonBrowseDataFixture({
        lessonData: {
          ...lessonBrowseDataFixture({}).lessonData,
          title: "lesson-title-1",
        },
        supplementaryData: { orderInUnit: 1, unitOrder: 4 },
      }),
    ],
    programmeSlug: lessonBrowseDataFixture({
      lessonData: {
        ...lessonBrowseDataFixture({}).lessonData,
        title: "lesson-title-2",
      },
      supplementaryData: { orderInUnit: 2, unitOrder: 4 },
    })["programmeSlug"],
  };

  it("should render the subjectTitle, unitTitle, and yearDescription", () => {
    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        {" "}
        <PupilViewsLessonListing {...props} />
      </OakThemeProvider>,
    );

    expect(getByText("unit-title")).toBeInTheDocument();
    expect(getByText("Maths")).toBeInTheDocument();
    expect(getByText("Year 1")).toBeInTheDocument();
  });
  it("should render the lesson titles as a tags", () => {
    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        {" "}
        <PupilViewsLessonListing {...props} />
      </OakThemeProvider>,
    );
    expect(getByText("lesson-title-1")).toBeInTheDocument();
  });
});
