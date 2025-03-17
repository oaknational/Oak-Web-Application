import React from "react";
import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { additionalFilesFixture } from "@oaknational/oak-curriculum-schema";

import { PupilViewsIntro } from "./PupilIntro.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { LessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";
import * as downloadLessonResources from "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import { LessonContent } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { trackingEvents } from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";
import keysToCamelCase from "@/utils/snakeCaseConverter";

const usePupilAnalyticsMock = {
  track: Object.fromEntries(trackingEvents.map((event) => [event, jest.fn()])),
  identify: jest.fn(),
  posthogDistinctId: "123",
};
const useTrackSectionStartedMock = {
  trackSectionStarted: jest.fn(),
};
jest.mock(
  "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics",
  () => {
    return {
      usePupilAnalytics: () => usePupilAnalyticsMock,
    };
  },
);

jest.mock("@/hooks/useTrackSectionStarted", () => {
  return {
    useTrackSectionStarted: () => useTrackSectionStartedMock,
  };
});

jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources",
);

const curriculumData = lessonContentFixture({});
const equipmentAndResources = [{ equipment: "equipment" }];
const contentGuidance: LessonContent["contentGuidance"] = [
  {
    contentguidanceLabel: "content guidance",
    contentguidanceDescription: "content guidance",
    contentguidanceArea: "content guidance area",
  },
];
const supervisionLevel = "supervision level";

describe("PupilIntro", () => {
  let downloadSpy: jest.SpyInstance;

  beforeEach(() => {
    downloadSpy = jest
      .spyOn(downloadLessonResources, "default")
      .mockResolvedValue();
  });

  afterEach(() => {
    downloadSpy.mockRestore();
  });

  it("displays the section title: what will you need for this lesson?", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsIntro
            hasWorksheet={false}
            worksheetInfo={null}
            {...curriculumData}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(
      getByText("What will you need for this lesson?"),
    ).toBeInTheDocument();
  });
  it("displays the question card: are you ready to learn?", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsIntro
            hasWorksheet={false}
            worksheetInfo={null}
            {...curriculumData}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByText("Are you ready to learn?")).toBeInTheDocument();
  });
  it("displays the equipment card if there is equipment", () => {
    const curriculumDataWithEquipment = {
      ...curriculumData,
      equipmentAndResources,
    };
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsIntro
            hasWorksheet={false}
            worksheetInfo={null}
            {...curriculumDataWithEquipment}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByText("Equipment")).toBeInTheDocument();
    expect(getByText("equipment")).toBeInTheDocument();
  });
  it("displays the content guidance card if there is content guidance", () => {
    const curriculumDataWithContentGuidance = {
      ...curriculumData,
      contentGuidance: contentGuidance,
    };
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsIntro
            hasWorksheet={false}
            worksheetInfo={null}
            {...curriculumDataWithContentGuidance}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByText("Content guidance")).toBeInTheDocument();
  });
  it("displays the supervision card if there is supervision guidance", () => {
    const curriculumDataWithSupervision = {
      ...curriculumData,
      supervisionLevel,
    };
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsIntro
            hasWorksheet={false}
            worksheetInfo={null}
            {...curriculumDataWithSupervision}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByText("Supervision")).toBeInTheDocument();
    expect(getByText("supervision level")).toBeInTheDocument();
  });

  describe("additional download", () => {
    describe("when there is multiple additional files", () => {
      const subject = (
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsIntro
              {...curriculumData}
              hasAdditionalFiles
              hasWorksheet
              worksheetInfo={null}
            />
          </LessonEngineContext.Provider>
        </OakThemeProvider>
      );

      it("displays the additional downloads card", () => {
        const { queryByText, queryByRole } = renderWithTheme(subject);

        expect(
          queryByText("Files you will need for this lesson"),
        ).toBeInTheDocument();
        expect(
          queryByRole("button", { name: /Download files/i }),
        ).toBeInTheDocument();
      });

      it("allows the files to be downloaded", async () => {
        const { getByText } = renderWithTheme(subject);

        await userEvent.click(getByText("Download files"));

        expect(downloadLessonResources.default).toHaveBeenCalledWith({
          lessonSlug: curriculumData.lessonSlug,
          selectedResourceTypes: ["worksheet-pdf-questions"],
          isLegacyDownload: curriculumData.isLegacy,
        });
      });
    });
    describe("when there is a single additional file", () => {
      const snake = additionalFilesFixture({}).files[0];
      const camel = keysToCamelCase(snake);
      const curriculumDataSingleFile =
        camel !== undefined
          ? lessonContentFixture({
              additionalFiles: [{ files: [camel] }],
            })
          : lessonContentFixture({});

      const subject = (
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsIntro
              {...curriculumDataSingleFile}
              hasAdditionalFiles
              hasWorksheet
              worksheetInfo={null}
            />
          </LessonEngineContext.Provider>
        </OakThemeProvider>
      );

      it("displays the additional downloads card", () => {
        const { queryByText, queryByRole } = renderWithTheme(subject);

        expect(
          queryByText("Files you will need for this lesson"),
        ).toBeInTheDocument();
        expect(
          queryByRole("button", { name: /Download file/i }),
        ).toBeInTheDocument();
      });
    });
    describe("when there is no additional files", () => {
      const subject = (
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsIntro
              {...curriculumData}
              hasWorksheet={false}
              hasAdditionalFiles={false}
              worksheetInfo={null}
            />
          </LessonEngineContext.Provider>
        </OakThemeProvider>
      );

      it("does not display the additional files card", () => {
        const { queryByText } = renderWithTheme(subject);

        expect(
          queryByText("Files you will need for this lesson"),
        ).not.toBeInTheDocument();
      });
    });
  });
  describe("worksheet download", () => {
    describe("when there is a worksheet", () => {
      const subject = (
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsIntro
              {...curriculumData}
              hasWorksheet
              worksheetInfo={null}
            />
          </LessonEngineContext.Provider>
        </OakThemeProvider>
      );

      it("displays the worksheet card", () => {
        const { queryByText, queryByRole } = renderWithTheme(subject);

        expect(queryByText("Worksheet")).toBeInTheDocument();
        expect(
          queryByRole("button", { name: /Download worksheet/i }),
        ).toBeInTheDocument();
      });

      it("allows the worksheet to be downloaded", async () => {
        const { getByText } = renderWithTheme(subject);

        await userEvent.click(getByText("Download worksheet"));

        expect(downloadLessonResources.default).toHaveBeenCalledWith({
          lessonSlug: curriculumData.lessonSlug,
          selectedResourceTypes: ["worksheet-pdf-questions"],
          isLegacyDownload: curriculumData.isLegacy,
        });
      });
    });

    describe("when there is no worksheet", () => {
      const subject = (
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsIntro
              {...curriculumData}
              hasWorksheet={false}
              worksheetInfo={null}
            />
          </LessonEngineContext.Provider>
        </OakThemeProvider>
      );

      it("does not display the worksheet card", () => {
        const { queryByText } = renderWithTheme(subject);

        expect(queryByText("Worksheet")).not.toBeInTheDocument();
      });
    });
  });
  it("displays I'm ready button which completed section", () => {
    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsIntro
            hasWorksheet={false}
            worksheetInfo={null}
            {...curriculumData}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByRole("link", { name: /I'm ready/i })).toBeInTheDocument();
  });
  it("completes the section when I'm ready button is clicked", () => {
    const context = createLessonEngineContext();
    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={context}>
          <PupilViewsIntro
            hasWorksheet={false}
            worksheetInfo={null}
            {...curriculumData}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    fireEvent.click(getByRole("link", { name: /I'm ready/i }));
    expect(context.completeActivity).toHaveBeenCalledWith("intro");
  });

  it("updates the section results when the worksheet is downloaded", async () => {
    const context = createLessonEngineContext();
    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={context}>
          <PupilViewsIntro
            hasWorksheet={true}
            worksheetInfo={null}
            {...curriculumData}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    await userEvent.click(getByRole("button", { name: /Download worksheet/i }));
    expect(context.updateWorksheetDownloaded).toHaveBeenCalledWith({
      worksheetDownloaded: true,
      worksheetAvailable: true,
    });
  });

  it("updates the section results when the worksheet is available", async () => {
    const context = createLessonEngineContext({ currentSection: "intro" });
    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={context}>
          <PupilViewsIntro
            hasWorksheet={true}
            worksheetInfo={null}
            {...curriculumData}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    expect(context.updateSectionResult).toHaveBeenCalledWith({
      worksheetDownloaded: false,
      worksheetAvailable: true,
    });
  });
  it("sends tracking data when a intro is completed", () => {
    const lessonSectionCompletedIntroduction = jest.fn();

    jest
      .spyOn(usePupilAnalyticsMock.track, "lessonActivityCompletedIntroduction")
      .mockImplementation(lessonSectionCompletedIntroduction);

    const context = createLessonEngineContext();
    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={context}>
          <PupilViewsIntro
            hasWorksheet={false}
            worksheetInfo={null}
            {...curriculumData}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    fireEvent.click(getByRole("link", { name: /I'm ready/i }));
    expect(lessonSectionCompletedIntroduction).toHaveBeenCalledTimes(1);
  });
  it("sends abandoned event data when backbutton clicked", () => {
    const lessonActivityAbandonedIntroduction = jest.fn();

    jest
      .spyOn(usePupilAnalyticsMock.track, "lessonActivityAbandonedIntroduction")
      .mockImplementation(lessonActivityAbandonedIntroduction);

    const context = createLessonEngineContext();
    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={context}>
          <PupilViewsIntro
            hasWorksheet={false}
            worksheetInfo={null}
            {...curriculumData}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    fireEvent.click(getByRole("link", { name: /Back/i }));
    expect(lessonActivityAbandonedIntroduction).toHaveBeenCalledTimes(1);
  });
  it("calls trackSectionStarted when intro is complete and when continue lesson button is pressed", () => {
    const trackSectionStarted = jest.fn();
    jest
      .spyOn(useTrackSectionStartedMock, "trackSectionStarted")
      .mockImplementation(trackSectionStarted);
    const context = createLessonEngineContext({
      currentSection: "intro",
      sectionResults: {
        intro: {
          isComplete: true,
        },
      },
    });

    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={context}>
          <PupilViewsIntro
            hasWorksheet={false}
            worksheetInfo={null}
            {...curriculumData}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    fireEvent.click(getByRole("link", { name: /Continue lesson/i }));
    expect(trackSectionStarted).toHaveBeenCalledTimes(1);
  });
});
