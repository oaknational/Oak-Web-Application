import React from "react";
import userEvent from "@testing-library/user-event";

import {
  LessonOverviewCreateWithAiDropdown,
  LessonOverviewCreateWithAiProps,
} from "./LessonOverviewCreateWithAiDropdown";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";

const createTeachingMaterialsInitiated = jest.fn();
const teachingMaterialsSelected = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    getSessionId: jest.fn(),
    track: {
      createTeachingMaterialsInitiated: (...args: unknown[]) =>
        createTeachingMaterialsInitiated(...args),
      teachingMaterialsSelected: (...args: unknown[]) =>
        teachingMaterialsSelected(...args),
    },
  }),
}));

const render = renderWithProviders();

describe("LessonOverviewCreateWithAiDropdown", () => {
  let defaultProps: LessonOverviewCreateWithAiProps;

  beforeEach(() => {
    jest.clearAllMocks();
    setUseUserReturn(mockLoggedIn);

    defaultProps = {
      lessonSlug: "test-lesson-slug",
      programmeSlug: "test-programme-slug",
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

    it("tracks createTeachingMaterialsInitiated when primary button is clicked", async () => {
      const user = userEvent.setup();
      const { getByText } = render(
        <LessonOverviewCreateWithAiDropdown {...defaultProps} />,
      );

      await user.click(getByText("Create more with AI"));

      expect(createTeachingMaterialsInitiated).toHaveBeenCalledWith(
        expect.objectContaining({ isLoggedIn: true }),
      );
    });

    it("tracks teachingMaterialsSelected with correct parameter when glossary is clicked", async () => {
      const user = userEvent.setup();
      const { getByText } = render(
        <LessonOverviewCreateWithAiDropdown {...defaultProps} />,
      );

      // Open the dropdown
      await user.click(getByText("Create more with AI"));

      // Find and click the glossary item
      const button = getByText("Glossary");
      expect(button).toBeInTheDocument();

      await user.click(button);

      expect(teachingMaterialsSelected).toHaveBeenCalledWith(
        expect.objectContaining({ teachingMaterialType: "glossary" }),
      );
    });

    it("tracks teachingMaterialsSelected with correct parameter when comprehension task is clicked", async () => {
      const user = userEvent.setup();
      const { getByText } = render(
        <LessonOverviewCreateWithAiDropdown {...defaultProps} />,
      );

      // Open the dropdown
      await user.click(getByText("Create more with AI"));

      await user.click(getByText("Comprehension task"));

      expect(teachingMaterialsSelected).toHaveBeenCalledWith(
        expect.objectContaining({
          teachingMaterialType: "comprehension task",
        }),
      );
    });

    it("tracks teachingMaterialsSelected with correct parameter when exit quiz is clicked", async () => {
      const user = userEvent.setup();
      const { getByText } = render(
        <LessonOverviewCreateWithAiDropdown {...defaultProps} />,
      );

      // Open the dropdown
      await user.click(getByText("Create more with AI"));

      await user.click(getByText("More exit quiz questions"));

      expect(teachingMaterialsSelected).toHaveBeenCalledWith(
        expect.objectContaining({ teachingMaterialType: "exit quiz" }),
      );
    });

    it("tracks teachingMaterialsSelected with correct parameter when starter quiz is clicked", async () => {
      const user = userEvent.setup();
      const { getByText } = render(
        <LessonOverviewCreateWithAiDropdown {...defaultProps} />,
      );

      // Open the dropdown
      await user.click(getByText("Create more with AI"));

      await user.click(getByText("More starter quiz questions"));

      expect(teachingMaterialsSelected).toHaveBeenCalledWith(
        expect.objectContaining({ teachingMaterialType: "starter quiz" }),
      );
    });
  });
});
