import React from "react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/react";

import { PupilViewsIntro } from "./PupilIntro.view";

import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import {
  LessonEngineContext,
  LessonEngineContextType,
} from "@/components/PupilComponents/LessonEngineProvider";


const curriculumData = {
  ...lessonOverviewFixture(),
};

const equipmentAndResources = [{ equipment: "equipment" }];
const contentGuidance = [
  {
    contentGuidanceLabel: "content guidance",
    contentGuidanceDescription: "content guidance",
    contentGuidanceArea: "content guidance area",
  },
];
const supervisionLevel = "supervision level";

const getLessonEngineContext = (): NonNullable<LessonEngineContextType> => ({
  currentSection: "starter-quiz",
  completedSections: [],
  sectionResults: {},
  getIsComplete: jest.fn(),
  completeSection: jest.fn(),
  updateCurrentSection: jest.fn(),
  proceedToNextSection: jest.fn(),
  updateQuizResult: jest.fn(),
});

describe("PupilIntro", () => {
  it("displays the section title: what will you need for this lesson?", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={getLessonEngineContext()}>
          <PupilViewsIntro {...curriculumData} />
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
        <LessonEngineContext.Provider value={getLessonEngineContext()}>
          <PupilViewsIntro {...curriculumData} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByText("Are you ready to learn?")).toBeInTheDocument();
  });
  it("displays the equipment card if there is equipment", () => {
    const curriculumDataWithEquipment = {
      ...curriculumData,
      lessonEquipmentAndResources: equipmentAndResources,
    };
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={getLessonEngineContext()}>
          <PupilViewsIntro {...curriculumDataWithEquipment} />
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
        <LessonEngineContext.Provider value={getLessonEngineContext()}>
          <PupilViewsIntro {...curriculumDataWithContentGuidance} />
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
        <LessonEngineContext.Provider value={getLessonEngineContext()}>
          <PupilViewsIntro {...curriculumDataWithSupervision} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByText("Supervision")).toBeInTheDocument();
    expect(getByText("supervision level")).toBeInTheDocument();
  });
  it("displays the worksheet card if there is a worksheet url", () => {
    const curriculumDataWithWorksheet = {
      ...curriculumData,
      worksheetUrl: "worksheet url",
    };
    const { getByText, getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={getLessonEngineContext()}>
          <PupilViewsIntro {...curriculumDataWithWorksheet} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByText("Worksheet")).toBeInTheDocument();
    expect(
      getByRole("button", { name: /Download worksheet/i }),
    ).toBeInTheDocument();
    expect(getByRole("button", { name: /Download worksheet/i })).toBeDisabled();
  });
  it("displays I'm ready button which completed section", () => {
    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={getLessonEngineContext()}>
          <PupilViewsIntro {...curriculumData} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByRole("button", { name: /I'm ready/i })).toBeInTheDocument();
  });
  it("completes the section when I'm ready button is clicked", () => {
    const context = getLessonEngineContext();
    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={context}>
          <PupilViewsIntro {...curriculumData} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    fireEvent.click(getByRole("button", { name: /I'm ready/i }));
    expect(context.completeSection).toHaveBeenCalledWith("intro");
  });
});
