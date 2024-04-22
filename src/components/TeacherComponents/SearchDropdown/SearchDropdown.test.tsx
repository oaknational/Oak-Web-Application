import userEvent from "@testing-library/user-event";

import SearchDropdown from "./SearchDropdown";

import { SearchResultsItemProps } from "@/components/TeacherComponents/SearchResultsItem";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { searchResultsItem } from "@/node-lib/curriculum-api-2023/fixtures/searchPage.fixture";

export const onClickSearchHit = jest.fn();

const searchResultsData = searchResultsItem().map((result) => {
  return {
    ...result,
    onClick: onClickSearchHit,
  };
});

const searchResultLesson = searchResultsData[0] as SearchResultsItemProps; // we know this exists

const searchResultUnit = searchResultsData[1] as SearchResultsItemProps; // we know this exists

const searchResultTierPathways = searchResultsData[2] as SearchResultsItemProps; // we know this exists

describe("SearchDropdown component", () => {
  test("component renders with correct title for pathways with exam boards", () => {
    const { getByText } = renderWithTheme(
      <SearchDropdown {...searchResultLesson} />,
    );

    expect(getByText("Select exam board")).toBeInTheDocument();
  });
  test("component renders with correct title for pathways without exam boards", () => {
    const { getByText } = renderWithTheme(
      <SearchDropdown {...searchResultTierPathways} />,
    );

    expect(getByText("Select tier")).toBeInTheDocument();
  });

  test("child component to not be visible on unexpanded container", () => {
    const { getByTestId } = renderWithTheme(
      <SearchDropdown {...searchResultLesson} />,
    );

    expect(getByTestId("search-dropdown-content")).not.toBeVisible();
  });

  test("container expands on click, child component to become visible", async () => {
    const { getByRole, getByTestId } = renderWithTheme(
      <SearchDropdown {...searchResultLesson} />,
    );

    const button = getByRole("button", { name: "Select exam board" });

    await userEvent.click(button);

    expect(getByTestId("search-dropdown-content")).toBeVisible();
    expect(button).toHaveAttribute("aria-expanded", "true");
  });
  test("when a pathway has exam boards other pathways are filtered out", async () => {
    const { getByRole, getAllByRole } = renderWithTheme(
      <SearchDropdown {...searchResultLesson} />,
    );

    const button = getByRole("button", { name: "Select exam board" });

    await userEvent.click(button);

    const links = getAllByRole("link");

    expect(links).toHaveLength(2);
  });
  test("when a pathway has no exam boards paths are filtered by tiers", async () => {
    const { getByRole, getAllByRole } = renderWithTheme(
      <SearchDropdown {...searchResultTierPathways} />,
    );

    const button = getByRole("button", { name: "Select tier" });

    await userEvent.click(button);

    const links = getAllByRole("link");

    expect(links).toHaveLength(2);
  });
  test("lesson type content link to lesson-overview pages", async () => {
    const { getByRole, getAllByRole } = renderWithTheme(
      <SearchDropdown {...searchResultLesson} />,
    );

    const button = getByRole("button", { name: "Select exam board" });

    await userEvent.click(button);

    const links = getAllByRole("link");

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining(
        "/teachers/programmes/maths-program-1/units/algebra-unit/lessons/the-fde-cycle-68w3ct",
      ),
    );
    expect(links[1]).toHaveAttribute(
      "href",
      expect.stringContaining(
        "/teachers/programmes/maths-program-3/units/world-wars-unit/lessons/the-fde-cycle-68w3ct",
      ),
    );
  });

  test("unit type links, link to lesson-index pages", async () => {
    const { getByRole, getAllByRole } = renderWithTheme(
      <SearchDropdown {...searchResultUnit} />,
    );

    const button = getByRole("button", { name: "Select exam board" });

    await userEvent.click(button);

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
    const { getByRole, getByText } = renderWithTheme(
      <SearchDropdown {...searchResultUnit} />,
    );

    const button = getByRole("button", { name: "Select exam board" });

    await userEvent.click(button);

    const link = getByText("Exam Board 1 Higher");

    await userEvent.click(link);

    expect(onClickSearchHit).toHaveBeenCalled();
  });
});
