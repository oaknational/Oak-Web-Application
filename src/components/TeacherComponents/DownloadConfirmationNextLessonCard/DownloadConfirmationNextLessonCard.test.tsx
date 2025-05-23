import userEvent from "@testing-library/user-event";

import DownloadConfirmationNextLessonCard from "./DownloadConfirmationNextLessonCard";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { OnwardContentSelectedProperties } from "@/browser-lib/avo/Avo";
import {
  mockLinkClick,
  setupMockLinkClick,
  teardownMockLinkClick,
} from "@/utils/mockLinkClick";

const onwardContentSelected = jest.fn() as unknown as (
  properties: Omit<
    OnwardContentSelectedProperties,
    "lessonReleaseDate" | "lessonReleaseCohort"
  >,
) => void;

describe("DownloadConfirmationNextLessonCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockLinkClick();
  });

  afterEach(() => {
    teardownMockLinkClick();
  });

  it("should render component", () => {
    const { getByText } = renderWithTheme(
      <DownloadConfirmationNextLessonCard
        unitTitle="Test unit"
        onwardContentSelected={onwardContentSelected}
        lessonTitle="test-lesson"
        programmeSlug="test-programme"
        unitSlug="test-unit"
        lessonSlug="test-slug"
      />,
    );

    const nextLessonCardTitle = getByText("test-lesson");

    expect(nextLessonCardTitle).toBeInTheDocument();
  });
  it("should render see lesson link with correct href", () => {
    const { getByRole } = renderWithTheme(
      <DownloadConfirmationNextLessonCard
        onwardContentSelected={onwardContentSelected}
        unitTitle="Test unit"
        lessonTitle="test-lesson"
        programmeSlug="test-programme"
        unitSlug="test-unit"
        lessonSlug="test-slug"
      />,
    );

    const seeLessonLink = getByRole("link", { name: "See lesson" });

    expect(seeLessonLink).toBeInTheDocument();
    expect(seeLessonLink).toHaveAttribute(
      "href",
      "/teachers/programmes/test-programme/units/test-unit/lessons/test-slug",
    );
  });

  it("should render download lesson link with correct href", () => {
    const { getByRole } = renderWithTheme(
      <DownloadConfirmationNextLessonCard
        onwardContentSelected={onwardContentSelected}
        unitTitle="Test unit"
        lessonTitle="test-lesson"
        programmeSlug="test-programme"
        unitSlug="test-unit"
        lessonSlug="test-slug"
      />,
    );

    const downloadResourcesLink = getByRole("link", {
      name: "Download resources",
    });

    expect(downloadResourcesLink).toBeInTheDocument();
    expect(downloadResourcesLink).toHaveAttribute(
      "href",
      "/teachers/programmes/test-programme/units/test-unit/lessons/test-slug/downloads",
    );
  });
  it("should call onwardContSelected fn on See lesson button", async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(
      <DownloadConfirmationNextLessonCard
        onwardContentSelected={onwardContentSelected}
        unitTitle="Test unit"
        lessonTitle="test-lesson"
        programmeSlug="test-programme"
        unitSlug="test-unit"
        lessonSlug="test-slug"
      />,
    );

    const seeLessonLink = getByRole("link", { name: "See lesson" });

    await user.click(seeLessonLink);
    expect(mockLinkClick).toHaveBeenCalledWith(
      "http://localhost/teachers/programmes/test-programme/units/test-unit/lessons/test-slug",
    );

    expect(onwardContentSelected).toHaveBeenCalledTimes(1);
    expect(onwardContentSelected).toHaveBeenCalledWith({
      lessonName: "test-lesson",
      lessonSlug: "test-slug",
      unitSlug: "test-unit",
      unitName: "Test unit",
      onwardIntent: "view-lesson",
    });
  });

  it("should call onwardContSelected fn on Download resources button", async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(
      <DownloadConfirmationNextLessonCard
        onwardContentSelected={onwardContentSelected}
        unitTitle="Test unit"
        lessonTitle="test-lesson"
        programmeSlug="test-programme"
        unitSlug="test-unit"
        lessonSlug="test-slug"
      />,
    );

    const downloadResourcesLink = getByRole("link", {
      name: "Download resources",
    });

    await user.click(downloadResourcesLink);
    expect(mockLinkClick).toHaveBeenCalledWith(
      "http://localhost/teachers/programmes/test-programme/units/test-unit/lessons/test-slug/downloads",
    );

    expect(onwardContentSelected).toHaveBeenCalledTimes(1);
    expect(onwardContentSelected).toHaveBeenCalledWith({
      lessonName: "test-lesson",
      lessonSlug: "test-slug",
      unitSlug: "test-unit",
      unitName: "Test unit",
      onwardIntent: "download-lesson-resources",
    });
  });
});
