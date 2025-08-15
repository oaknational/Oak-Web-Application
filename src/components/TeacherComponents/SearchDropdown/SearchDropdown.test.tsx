import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/dom";

import SearchDropdown from "./SearchDropdown";

import { SearchResultsItemProps } from "@/components/TeacherComponents/SearchResultsItem";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { searchResultsItem } from "@/node-lib/curriculum-api-2023/fixtures/searchPage.fixture";
import {
  mockLinkClick,
  setupMockLinkClick,
  teardownMockLinkClick,
} from "@/utils/mockLinkClick";

export const onClickSearchHit = jest.fn();

const searchResultsData = searchResultsItem().map((result) => {
  return {
    ...result,
    onClick: onClickSearchHit,
  };
});

const searchResultLesson = searchResultsData[0] as SearchResultsItemProps; // we know this exists

const searchResultUnit = searchResultsData[1] as SearchResultsItemProps; // we know this exists

describe("SearchDropdown component", () => {
  beforeEach(() => {
    setupMockLinkClick();
  });

  afterEach(() => {
    teardownMockLinkClick();
  });

  test("component renders the label", () => {
    renderWithTheme(
      <SearchDropdown
        {...searchResultLesson}
        isHovered
        isToggleOpen
        label="Select exam board"
        dropdownContent={[
          {
            programmeSlug: "maths-program-1",
            unitSlug: "algebra-unit",
            examBoardSlug: "exam-board-1",
            examBoardTitle: "Exam Board 1",
            tierSlug: "higher",
            tierTitle: "Higher",
            unitTitle: "Algebra Unit",
            keyStageSlug: "ks3",
            keyStageTitle: "Key Stage 3",
            subjectSlug: "maths",
            subjectTitle: "Maths",
          },
        ]}
      />,
    );

    const label = screen.getByText("Select exam board");
    expect(label).toBeInTheDocument();
  });
  test("child component to not be visible on unexpanded container", () => {
    renderWithTheme(
      <SearchDropdown
        {...searchResultLesson}
        isHovered
        isToggleOpen={false}
        label=""
        dropdownContent={[
          {
            programmeSlug: "maths-program-1",
            unitSlug: "algebra-unit",
            examBoardSlug: "exam-board-1",
            examBoardTitle: "Exam Board 1",
            tierSlug: "higher",
            tierTitle: "Higher",
            unitTitle: "Algebra Unit",
            keyStageSlug: "ks3",
            keyStageTitle: "Key Stage 3",
            subjectSlug: "maths",
            subjectTitle: "Maths",
          },
        ]}
      />,
    );

    expect(screen.getByTestId("search-dropdown-content")).not.toBeVisible();
  });
  test("child component to be visible on expanded container", () => {
    renderWithTheme(
      <SearchDropdown
        {...searchResultLesson}
        isHovered
        isToggleOpen
        label="Select tier"
        dropdownContent={[
          {
            programmeSlug: "maths-program-1",
            unitSlug: "algebra-unit",
            examBoardSlug: "exam-board-1",
            examBoardTitle: "Exam Board 1",
            tierSlug: "higher",
            tierTitle: "Higher",
            unitTitle: "Algebra Unit",
            keyStageSlug: "ks3",
            keyStageTitle: "Key Stage 3",
            subjectSlug: "maths",
            subjectTitle: "Maths",
          },
        ]}
      />,
    );

    const dropdownContent = screen.getByTestId("search-dropdown-content");
    expect(dropdownContent).toBeVisible();
  });

  test("lesson type content link to lesson-overview pages", async () => {
    renderWithTheme(
      <SearchDropdown
        {...searchResultLesson}
        isHovered={false}
        isToggleOpen
        label="Select exam board"
        dropdownContent={[
          {
            programmeSlug: "maths-program-1",
            unitSlug: "algebra-unit-1",
            examBoardSlug: "exam-board-1",
            examBoardTitle: "Exam Board 1",
            tierSlug: "higher",
            tierTitle: "Higher",
            unitTitle: "Algebra Unit",
            keyStageSlug: "ks3",
            keyStageTitle: "Key Stage 3",
            subjectSlug: "maths",
            subjectTitle: "Maths",
          },
          {
            programmeSlug: "maths-program-2",
            unitSlug: "algebra-unit-2",
            examBoardSlug: "exam-board-2",
            examBoardTitle: "Exam Board 2",
            tierSlug: "higher",
            tierTitle: "Higher",
            unitTitle: "Algebra Unit",
            keyStageSlug: "ks3",
            keyStageTitle: "Key Stage 3",
            subjectSlug: "maths",
            subjectTitle: "Maths",
          },
        ]}
      />,
    );

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);

    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining(
        "/teachers/programmes/maths-program-1/units/algebra-unit-1/lessons/the-fde-cycle-68w3ct",
      ),
    );
    expect(links[1]).toHaveAttribute(
      "href",
      expect.stringContaining(
        "/teachers/programmes/maths-program-2/units/algebra-unit-2/lessons/the-fde-cycle-68w3ct",
      ),
    );
  });

  test("unit type links, link to lesson-index pages", async () => {
    const { getAllByRole } = renderWithTheme(
      <SearchDropdown
        {...searchResultUnit}
        isHovered={false}
        isToggleOpen={true}
        label="Select exam board"
        dropdownContent={[
          {
            programmeSlug: "maths-program-1",
            unitSlug: "algebra-unit",
            unitTitle: "Algebra",
            keyStageSlug: "ks3",
            keyStageTitle: "Key Stage 3",
            subjectSlug: "maths",
            subjectTitle: "Mathematics",
            tierSlug: "higher",
            tierTitle: "Higher",
            examBoardSlug: "exam-board-1",
            examBoardTitle: "Exam Board 1",
            yearSlug: "2023",
            yearTitle: "2023-2024",
          },
          {
            programmeSlug: "maths-program-3",
            unitSlug: "world-wars-unit",
            unitTitle: "World Wars",
            keyStageSlug: "ks2",
            keyStageTitle: "Key Stage 2",
            subjectSlug: "history",
            subjectTitle: "History",
            tierSlug: "foundation",
            tierTitle: "Foundation",
            examBoardSlug: "exam-board-2",
            examBoardTitle: "Exam Board 2",
            yearSlug: "2022",
            yearTitle: "2022-2023",
          },
        ]}
      />,
    );

    const links = getAllByRole("link");

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining(
        "/teachers/programmes/maths-program-1/units/algebra-unit/lessons",
      ),
    );
    expect(links[1]).toHaveAttribute(
      "href",
      expect.stringContaining(
        "/teachers/programmes/maths-program-3/units/world-wars-unit/lessons",
      ),
    );
  });

  test("onClick is called when a dropdown link is clicked", async () => {
    const { getByText } = renderWithTheme(
      <SearchDropdown
        {...searchResultUnit}
        isHovered={false}
        isToggleOpen={false}
        label="Select exam board"
        dropdownContent={[
          {
            programmeSlug: "maths-program-1",
            unitSlug: "algebra-unit",
            examBoardSlug: "exam-board-1",
            examBoardTitle: "Exam Board 1",
            tierSlug: "higher",
            tierTitle: "Higher",
            unitTitle: "Algebra Unit",
            keyStageSlug: "ks3",
            keyStageTitle: "Key Stage 3",
            subjectSlug: "maths",
            subjectTitle: "Maths",
          },
        ]}
      />,
    );

    const button = getByText("Select exam board");

    await userEvent.click(button);

    const link = getByText("Exam Board 1 Higher");

    await userEvent.click(link);

    expect(onClickSearchHit).toHaveBeenCalled();
    expect(mockLinkClick).toHaveBeenCalledWith(
      "http://localhost/teachers/programmes/maths-program-1/units/algebra-unit/lessons",
    );
  });
});
