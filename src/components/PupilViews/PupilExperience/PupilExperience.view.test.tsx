import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import { OakTooltipProps } from "@oaknational/oak-components";

import {
  PupilExperienceView,
  pickAvailableSectionsForLesson,
} from "./PupilExperience.view";

import * as LessonEngineProvider from "@/components/PupilComponents/LessonEngineProvider";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { allLessonReviewSections } from "@/components/PupilComponents/LessonEngineProvider";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";
import "@/__tests__/__helpers__/IntersectionObserverMock";
import "@/__tests__/__helpers__/ResizeObserverMock";

jest.mock("next/router", () => jest.requireActual("next-router-mock"));

jest.mock("@/components/PupilComponents/LessonEngineProvider", () => ({
  ...jest.requireActual("@/components/PupilComponents/LessonEngineProvider"),
  useLessonEngineContext: jest.fn(),
}));

jest.mock("@/components/PupilViews/PupilExpired/PupilExpired.view", () => ({
  PupilExpiredView: jest.fn(() => "PupilExpiredView"),
}));

jest.mock("@/components/PupilViews/PupilReview", () => {
  return {
    PupilViewsReview: () => (
      <div>
        <div>Lesson review</div>
        <div data-testid="content-guidance-info">Guidance Title</div>
        <div data-testid="suervision-level-info">Supervision Level</div>
      </div>
    ),
  };
});

jest.mock("@/components/PupilViews/PupilLessonOverview", () => {
  return {
    PupilViewsLessonOverview: () => (
      <div>
        <div>Lesson Title</div>
        <div data-testid="content-guidance-info">Guidance Title</div>
        <div data-testid="suervision-level-info">Supervision Level</div>
      </div>
    ),
  };
});

jest.mock("@oaknational/oak-components", () => {
  return {
    ...jest.requireActual("@oaknational/oak-components"),
    OakTooltip: ({ children, tooltip }: OakTooltipProps) => (
      <>
        {children}
        <div role="tooltip">{tooltip}</div>
      </>
    ),
  };
});

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: jest.fn(),
}));

const render = renderWithProviders();

describe("PupilExperienceView", () => {
  describe("pickAvailableSectionsForLesson", () => {
    it("returns all sections if all are available", () => {
      const sections = pickAvailableSectionsForLesson(
        lessonContentFixture({
          starterQuiz: quizQuestions,
          exitQuiz: quizQuestions,
          videoMuxPlaybackId: "123",
        }),
      );
      expect(sections).toEqual(allLessonReviewSections);
    });
    it("should not include a section if it has no content", () => {
      const withoutStarterQuiz = pickAvailableSectionsForLesson(
        lessonContentFixture({
          starterQuiz: [],
        }),
      );
      const withoutExitQuiz = pickAvailableSectionsForLesson(
        lessonContentFixture({
          exitQuiz: [],
        }),
      );
      const withoutVideo = pickAvailableSectionsForLesson(
        lessonContentFixture({
          videoMuxPlaybackId: null,
        }),
      );
      expect(withoutStarterQuiz).not.toContain("starter-quiz");
      expect(withoutExitQuiz).not.toContain("exit-quiz");
      expect(withoutVideo).not.toContain("video");
    });
  });

  describe("PupilPageContent", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should render", () => {
      const lessonContent = lessonContentFixture({
        lessonTitle: "Lesson Title",
      });
      const lessonBrowseData = lessonBrowseDataFixture({
        lessonSlug: "lesson-slug",
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
      });

      jest
        .spyOn(LessonEngineProvider, "useLessonEngineContext")
        .mockReturnValue(
          createLessonEngineContext({
            currentSection: "overview",
          }),
        );
      const { getByText } = render(
        <PupilExperienceView
          lessonContent={lessonContent}
          browseData={lessonBrowseData}
          hasWorksheet={false}
          hasAdditionalFiles={false}
          worksheetFileData={null}
          initialSection="overview"
          pageType="browse"
        />,
      );

      expect(getByText("Lesson Title")).toBeInTheDocument();
    });

    // we don't render the video section as it crashes without a valid mux id
    [
      [/Introduction/, "intro"],
      [/Starter Quiz/, "starter-quiz"],
      [/Exit Quiz/, "exit-quiz"],
    ].forEach(([name, section]) => {
      it("renders the current section", () => {
        const lessonContent = lessonContentFixture({});
        const lessonBrowseData = lessonBrowseDataFixture({});

        jest
          .spyOn(LessonEngineProvider, "useLessonEngineContext")
          .mockReturnValue(
            createLessonEngineContext({
              currentSection: section as LessonEngineProvider.LessonSection,
            }),
          );

        const { getByText } = render(
          <PupilExperienceView
            lessonContent={lessonContent}
            browseData={lessonBrowseData}
            hasWorksheet={false}
            hasAdditionalFiles={false}
            worksheetFileData={null}
            initialSection="overview"
            pageType="browse"
          />,
        );

        expect(getByText(name as RegExp)).toBeInTheDocument();
      });
    });
  });

  it("should render the expired view if the lesson is expired", () => {
    const lessonContent = lessonContentFixture({});

    const lessonBrowseData = lessonBrowseDataFixture({});
    lessonBrowseData.lessonData.deprecatedFields = { expired: true };

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "overview",
      }),
    );

    const { getByText } = render(
      <PupilExperienceView
        lessonContent={lessonContent}
        browseData={lessonBrowseData}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        worksheetFileData={null}
        initialSection="overview"
        pageType="browse"
      />,
    );

    expect(getByText("PupilExpiredView", { exact: false })).toBeInTheDocument();
  });

  it("should render the content guidance on lessons that have guidance", () => {
    const supervisionLevel = "Supervision Level";
    const contentguidanceLabel = "Guidance Title";
    const lessonContent = lessonContentFixture({
      lessonTitle: "Lesson Title",
      contentGuidance: [
        {
          contentguidanceLabel,
          contentguidanceArea: "Guidance Area",
          contentguidanceDescription: "Guidance Description",
        },
      ],
      supervisionLevel,
    });
    const lessonBrowseData = lessonBrowseDataFixture({});

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "overview",
      }),
    );
    const { getByTestId, getByRole } = render(
      <PupilExperienceView
        lessonContent={lessonContent}
        browseData={lessonBrowseData}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        worksheetFileData={null}
        initialSection="overview"
        pageType="browse"
      />,
    );
    const dialog = getByRole("alertdialog");

    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(contentguidanceLabel);
    expect(dialog).toHaveTextContent(supervisionLevel);
    expect(getByTestId("content-guidance-info")).toHaveTextContent(
      contentguidanceLabel,
    );
    expect(getByTestId("suervision-level-info")).toHaveTextContent(
      supervisionLevel,
    );
  });

  it("should close content guidance modal when modal is accepted", async () => {
    const supervisionLevel = "Supervision Level";
    const contentguidanceLabel = "Guidance Title";
    const lessonContent = lessonContentFixture({
      lessonTitle: "Lesson Title",
      contentGuidance: [
        {
          contentguidanceLabel,
          contentguidanceArea: "Guidance Area",
          contentguidanceDescription: "Guidance Description",
        },
      ],
      supervisionLevel,
    });
    const lessonBrowseData = lessonBrowseDataFixture({});

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "overview",
      }),
    );
    const { getByTestId, getByRole } = render(
      <PupilExperienceView
        lessonContent={lessonContent}
        browseData={lessonBrowseData}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        worksheetFileData={null}
        initialSection="overview"
        pageType="browse"
      />,
    );
    await userEvent.click(getByTestId("acceptButton"));
    waitFor(() => {
      expect(getByRole("alertdialog")).not.toBeInTheDocument();
    });
  });

  it.skip("should navigate away from page when 'take me back' is clicked", async () => {
    const supervisionLevel = "Supervision Level";
    const contentguidanceLabel = "Guidance Title";
    const lessonContent = lessonContentFixture({
      lessonTitle: "Lesson Title",
      contentGuidance: [
        {
          contentguidanceLabel,
          contentguidanceArea: "Guidance Area",
          contentguidanceDescription: "Guidance Description",
        },
      ],
      supervisionLevel,
    });
    const lessonBrowseData = lessonBrowseDataFixture({});

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "overview",
      }),
    );
    mockRouter.push("/initial-path");

    const { getByTestId } = render(
      <PupilExperienceView
        backUrl="/somewhere-else"
        lessonContent={lessonContent}
        browseData={lessonBrowseData}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        worksheetFileData={null}
        initialSection="overview"
        pageType="browse"
      />,
    );

    expect(mockRouter.asPath).toBe("/initial-path");
    await userEvent.click(getByTestId("declineButton"));
    waitFor(() => {
      expect(mockRouter.asPath).toBe("/somewhere-else");
    });
  });
  it("should have robots meta tag with index & follow", async () => {
    const supervisionLevel = "Supervision Level";
    const contentguidanceLabel = "Guidance Title";
    const lessonContent = lessonContentFixture({
      lessonTitle: "Lesson Title",
      contentGuidance: [
        {
          contentguidanceLabel,
          contentguidanceArea: "Guidance Area",
          contentguidanceDescription: "Guidance Description",
        },
      ],
      supervisionLevel,
    });
    const lessonBrowseData = lessonBrowseDataFixture({});

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "overview",
      }),
    );

    render(
      <PupilExperienceView
        backUrl="/somewhere-else"
        lessonContent={lessonContent}
        browseData={lessonBrowseData}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        worksheetFileData={null}
        initialSection="overview"
        pageType="browse"
      />,
    );

    expect(
      document.querySelector("meta[name=robots]")?.getAttribute("content"),
    ).toEqual("index,follow");
  });

  it("should have robots meta tag with noindex & nofollow", async () => {
    const supervisionLevel = "Supervision Level";
    const contentguidanceLabel = "Guidance Title";
    const lessonContent = lessonContentFixture({
      lessonTitle: "Lesson Title",
      contentGuidance: [
        {
          contentguidanceLabel,
          contentguidanceArea: "Guidance Area",
          contentguidanceDescription: "Guidance Description",
        },
      ],
      deprecatedFields: {
        isSensitive: true,
      },
      supervisionLevel,
    });
    const lessonBrowseData = lessonBrowseDataFixture({});

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "overview",
      }),
    );

    render(
      <PupilExperienceView
        backUrl="/somewhere-else"
        lessonContent={lessonContent}
        browseData={lessonBrowseData}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        worksheetFileData={null}
        initialSection="overview"
        pageType="browse"
      />,
    );

    expect(
      document.querySelector("meta[name=robots]")?.getAttribute("content"),
    ).toEqual("noindex,nofollow");
  });

  it("should render with phase secondary and no lessonContent title", async () => {
    const lessonContent = lessonContentFixture({
      lessonTitle: "Lesson Title",
    });
    const lessonBrowseData = lessonBrowseDataFixture({
      lessonSlug: "lesson-slug",
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
    });

    lessonBrowseData.programmeFields.phase = "secondary";
    lessonContent.lessonTitle = null;

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "review",
      }),
    );

    const { getByText, queryByText } = render(
      <PupilExperienceView
        lessonContent={lessonContent}
        browseData={lessonBrowseData}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        worksheetFileData={null}
        initialSection="review"
        pageType="browse"
      />,
    );

    expect(queryByText("Lesson Title")).toBeNull();
    expect(getByText("Lesson review")).toBeInTheDocument();
  });

  it("should show nothing with unknown section", async () => {
    const lessonContent = lessonContentFixture({
      lessonTitle: "Lesson Title",
    });
    const lessonBrowseData = lessonBrowseDataFixture({});

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: undefined,
      }),
    );

    const { queryByText } = render(
      <PupilExperienceView
        lessonContent={lessonContent}
        browseData={lessonBrowseData}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        worksheetFileData={null}
        initialSection="overview"
        pageType="browse"
      />,
    );

    expect(queryByText("Lesson Title")).toBeNull();
  });
});
