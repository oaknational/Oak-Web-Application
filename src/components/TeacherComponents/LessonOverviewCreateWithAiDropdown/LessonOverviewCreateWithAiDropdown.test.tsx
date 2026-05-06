import React from "react";
import userEvent from "@testing-library/user-event";

import {
  LessonOverviewCreateWithAiDropdown,
  LessonOverviewCreateWithAiProps,
} from "./LessonOverviewCreateWithAiDropdown";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("LessonOverviewCreateWithAiDropdown", () => {
  let mockTrackCreateWithAiButtonClicked: jest.Mock;
  let mockTrackTeachingMaterialsSelected: jest.Mock;
  let defaultProps: LessonOverviewCreateWithAiProps;

  beforeEach(() => {
    mockTrackCreateWithAiButtonClicked = jest.fn();
    mockTrackTeachingMaterialsSelected = jest.fn();

    defaultProps = {
      lessonSlug: "test-lesson-slug",
      programmeSlug: "test-programme-slug",
      trackCreateWithAiButtonClicked: mockTrackCreateWithAiButtonClicked,
      trackTeachingMaterialsSelected: mockTrackTeachingMaterialsSelected,
      subjectSlug: "test-subject",
      subjectCategories: ["category1", "category2"],
    };
  });

  describe("Analytics Tracking", () => {
    let stopNav: (e: Event) => void;

    beforeEach(() => {
      stopNav = (e: Event) => {
        const t = e.target as HTMLElement | null;
        if (t && t.closest("a[href]")) e.preventDefault();
      };
      document.addEventListener("click", stopNav, true); // capture phase
    });

    afterEach(() => {
      document.removeEventListener("click", stopNav, true);
    });

    it("calls trackCreateWithAiButtonClicked when primary button is clicked", async () => {
      const user = userEvent.setup();
      const { getByText } = renderWithTheme(
        <LessonOverviewCreateWithAiDropdown {...defaultProps} />,
      );

      await user.click(getByText("Create more with AI"));

      expect(mockTrackCreateWithAiButtonClicked).toHaveBeenCalledTimes(1);
    });

    it("calls trackTeachingMaterialsSelected with correct parameter when glossary is clicked", async () => {
      const user = userEvent.setup();
      const { getByText } = renderWithTheme(
        <LessonOverviewCreateWithAiDropdown {...defaultProps} />,
      );

      // Open the dropdown
      await user.click(getByText("Create more with AI"));

      // Find and click the glossary item
      const button = getByText("Glossary");
      expect(button).toBeInTheDocument();

      await user.click(button);

      expect(mockTrackTeachingMaterialsSelected).toHaveBeenCalledWith(
        "glossary",
      );
    });

    it("calls trackTeachingMaterialsSelected with correct parameter when comprehension task is clicked", async () => {
      const user = userEvent.setup();
      const { getByText } = renderWithTheme(
        <LessonOverviewCreateWithAiDropdown {...defaultProps} />,
      );

      // Open the dropdown
      await user.click(getByText("Create more with AI"));

      await user.click(getByText("Comprehension task"));

      expect(mockTrackTeachingMaterialsSelected).toHaveBeenCalledWith(
        "comprehension task",
      );
    });

    it("calls trackTeachingMaterialsSelected with correct parameter when exit quiz is clicked", async () => {
      const user = userEvent.setup();
      const { getByText } = renderWithTheme(
        <LessonOverviewCreateWithAiDropdown {...defaultProps} />,
      );

      // Open the dropdown
      await user.click(getByText("Create more with AI"));

      await user.click(getByText("More exit quiz questions"));

      expect(mockTrackTeachingMaterialsSelected).toHaveBeenCalledWith(
        "exit quiz",
      );
    });

    it("calls trackTeachingMaterialsSelected with correct parameter when starter quiz is clicked", async () => {
      const user = userEvent.setup();
      const { getByText } = renderWithTheme(
        <LessonOverviewCreateWithAiDropdown {...defaultProps} />,
      );

      // Open the dropdown
      await user.click(getByText("Create more with AI"));

      await user.click(getByText("More starter quiz questions"));

      expect(mockTrackTeachingMaterialsSelected).toHaveBeenCalledWith(
        "starter quiz",
      );
    });
  });
});
