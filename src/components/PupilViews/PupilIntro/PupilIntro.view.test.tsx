import React from "react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { userEvent } from "@testing-library/user-event";

import { PupilViewsIntro } from "./PupilIntro.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { LessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";
import * as downloadLessonResources from "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import { LessonContent } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

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
          <PupilViewsIntro hasWorksheet={false} {...curriculumData} />
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
          <PupilViewsIntro hasWorksheet={false} {...curriculumData} />
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
            {...curriculumDataWithSupervision}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByText("Supervision")).toBeInTheDocument();
    expect(getByText("supervision level")).toBeInTheDocument();
  });

  describe("worksheet download", () => {
    describe("when there is a worksheet", () => {
      const subject = (
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsIntro {...curriculumData} hasWorksheet />
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

        expect(downloadLessonResources.default).toHaveBeenCalledWith(
          curriculumData.lessonSlug,
          ["worksheet-pdf"],
          curriculumData.isLegacy,
        );
      });
    });

    describe("when there is no worksheet", () => {
      const subject = (
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsIntro {...curriculumData} hasWorksheet={false} />
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
          <PupilViewsIntro hasWorksheet={false} {...curriculumData} />
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
          <PupilViewsIntro hasWorksheet={false} {...curriculumData} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    fireEvent.click(getByRole("link", { name: /I'm ready/i }));
    expect(context.completeSection).toHaveBeenCalledWith("intro");
  });

  it("updates the section results when the worksheet is downloaded", async () => {
    const context = createLessonEngineContext();
    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={context}>
          <PupilViewsIntro hasWorksheet={true} {...curriculumData} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    await userEvent.click(getByRole("button", { name: /Download worksheet/i }));
    expect(context.updateSectionResult).toHaveBeenCalledWith({
      worksheetDownloaded: true,
      worksheetAvailable: true,
    });
  });

  it("updates the section results when the worksheet is available", async () => {
    const context = createLessonEngineContext();
    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={context}>
          <PupilViewsIntro hasWorksheet={true} {...curriculumData} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    expect(context.updateSectionResult).toHaveBeenCalledWith({
      worksheetDownloaded: false,
      worksheetAvailable: true,
    });
  });
});
