import React from "react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

import { LessonOverviewHeaderProps } from "../LessonOverviewHeader";

import { LessonOverviewCreateWithAiNav } from "./LessonOverviewCreateWithAiNav";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("LessonOverviewCreateWithAiNav", () => {
  const defaultProps: LessonOverviewHeaderProps = {
    // Core required props for the component functionality
    lessonSlug: "test-lesson-slug",
    programmeSlug: "test-programme-slug",
    trackCreateWithAiButtonClicked: jest.fn(),
    trackTeachingMaterialsSelected: jest.fn(),

    // Required props from LessonOverviewHeaderProps interface
    subjectSlug: "test-subject",
    unitSlug: "test-unit",
    unitTitle: "Test Unit",
    subjectTitle: "Test Subject",
    lessonTitle: "Test Lesson",
    isSpecialist: false,
    isCanonical: true,
    breadcrumbs: [],
    background: "mint50",
    isNew: true,
    isShareable: true,
    subjectIconBackgroundColor: "mint",
    track: {} as LessonOverviewHeaderProps["track"],
    analyticsUseCase: "Teacher",
    onClickDownloadAll: jest.fn(),
    onClickShareAll: jest.fn(),
    showDownloadAll: true,
    showShare: true,
    excludedFromTeachingMaterials: false,

    // Optional props with sensible defaults
    yearTitle: null,
    examBoardTitle: null,
    tierTitle: null,
    keyStageSlug: "ks2",
    keyStageTitle: "Key Stage 2",
    expired: false,
    lessonDescription: "Test lesson description",
    phonicsOutcome: null,
    orderInUnit: 1,
    unitTotalLessonCount: 10,
    geoRestricted: false,
    loginRequired: false,
    isLegacy: false,
    lessonReleaseDate: null,
    pupilLessonOutcome: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Analytics Tracking", () => {
    it("calls trackCreateWithAiButtonClicked when primary button is clicked", async () => {
      const user = userEvent.setup();
      const { getByText } = renderWithTheme(
        <LessonOverviewCreateWithAiNav {...defaultProps} />,
      );

      await user.click(getByText("Create more with AI"));

      expect(defaultProps.trackCreateWithAiButtonClicked).toHaveBeenCalledTimes(
        1,
      );
    });

    it("calls trackTeachingMaterialsSelected with correct parameter when glossary is clicked", async () => {
      const user = userEvent.setup();
      const { getByText, getByRole } = renderWithTheme(
        <LessonOverviewCreateWithAiNav {...defaultProps} />,
      );

      // Open the dropdown
      await user.click(getByText("Create more with AI"));

      // Find and click the glossary item
      const glossaryItem = getByRole("menuitem", { name: /Glossary/i });
      await user.click(glossaryItem);

      expect(defaultProps.trackTeachingMaterialsSelected).toHaveBeenCalledWith(
        "glossary",
      );
    });

    it("calls trackTeachingMaterialsSelected with correct parameter when comprehension task is clicked", async () => {
      const user = userEvent.setup();
      const { getByText, getByRole } = renderWithTheme(
        <LessonOverviewCreateWithAiNav {...defaultProps} />,
      );

      // Open the dropdown
      await user.click(getByText("Create more with AI"));

      const comprehensionItem = getByRole("menuitem", {
        name: /Comprehension task/i,
      });
      await user.click(comprehensionItem);

      expect(defaultProps.trackTeachingMaterialsSelected).toHaveBeenCalledWith(
        "comprehension task",
      );
    });

    it("calls trackTeachingMaterialsSelected with correct parameter when exit quiz is clicked", async () => {
      const user = userEvent.setup();
      const { getByText, getByRole } = renderWithTheme(
        <LessonOverviewCreateWithAiNav {...defaultProps} />,
      );

      // Open the dropdown
      await user.click(getByText("Create more with AI"));

      const exitQuizItem = getByRole("menuitem", { name: /Exit quiz/i });
      await user.click(exitQuizItem);

      expect(defaultProps.trackTeachingMaterialsSelected).toHaveBeenCalledWith(
        "exit quiz",
      );
    });

    it("calls trackTeachingMaterialsSelected with correct parameter when starter quiz is clicked", async () => {
      const user = userEvent.setup();
      const { getByText, getByRole } = renderWithTheme(
        <LessonOverviewCreateWithAiNav {...defaultProps} />,
      );

      // Open the dropdown
      await user.click(getByText("Create more with AI"));

      const starterQuizItem = getByRole("menuitem", { name: /Starter quiz/i });
      await user.click(starterQuizItem);

      expect(defaultProps.trackTeachingMaterialsSelected).toHaveBeenCalledWith(
        "starter quiz",
      );
    });
  });
});
