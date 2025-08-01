import {
  OakInfoProps,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";
import mockRouter from "next-router-mock";

import { PupilViewsLessonListing } from "./PupilLessonListing.view";

import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

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
      programmeFields: {
        ...lessonBrowseDataFixture({}).programmeFields,
        tierDescription: "Core",
        examboard: "Edexcel",
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
      lessonBrowseDataFixture({
        lessonData: {
          ...lessonBrowseDataFixture({}).lessonData,
          title: "lesson-title-3",
          deprecatedFields: { expired: true },
        },
        supplementaryData: { orderInUnit: 3, unitOrder: 4 },
      }),
    ],
    programmeSlug: lessonBrowseDataFixture({
      lessonData: {
        ...lessonBrowseDataFixture({}).lessonData,
        title: "lesson-title-2",
      },
      supplementaryData: { orderInUnit: 2, unitOrder: 4 },
    })["programmeSlug"],
    backLink: "/back-link",
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
    expect(getByText("Core")).toBeInTheDocument();
    expect(getByText("Edexcel")).toBeInTheDocument();
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

  it("should only count none expired lessons in the lesson count", () => {
    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        {" "}
        <PupilViewsLessonListing {...props} />
      </OakThemeProvider>,
    );
    expect(getByText("(2)")).toBeInTheDocument();
  });

  describe("redirected overlay", () => {
    beforeEach(() => {
      mockRouter.setCurrentUrl("/?redirected=true");
    });
    it("should show redirect modal when redirected query param is present", () => {
      mockRouter.setCurrentUrl("/?redirected=true");
      const { getByTestId } = render(
        <OakThemeProvider theme={oakDefaultTheme}>
          {" "}
          <PupilViewsLessonListing {...props} />
        </OakThemeProvider>,
      );
      expect(getByTestId("pupil-redirected-overlay-btn")).toBeInTheDocument();
    });
  });
});
