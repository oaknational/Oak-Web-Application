import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

import { SearchResultsItemProps } from "../SearchResultsItem/SearchResultsItem";

import SearchDropdown from "./SearchDropdown";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import {
  onClickSearchHit,
  searchResultsItem,
} from "@/node-lib/curriculum-api-2023/fixtures/searchPage.fixture";

const searchResultLesson = searchResultsItem()[0] as SearchResultsItemProps;

const searchResultUnit = searchResultsItem()[1] as SearchResultsItemProps;

describe("SearchDropdown component", () => {
  test("component renders with correct title", () => {
    const { getByText } = renderWithTheme(
      <SearchDropdown label={"Select exam board"} {...searchResultLesson} />,
    );

    expect(getByText("Select exam board")).toBeInTheDocument();
  });

  test("child component to not be visible on unexpanded container", () => {
    const { getByTestId } = renderWithTheme(
      <SearchDropdown label={"Select exam board"} {...searchResultLesson} />,
    );

    expect(getByTestId("search-dropdown-content")).not.toBeVisible();
  });

  test("container expands on click, child component to become visible", async () => {
    const { getByRole, getByTestId } = renderWithTheme(
      <SearchDropdown label={"Select exam board"} {...searchResultLesson} />,
    );

    const button = getByRole("button", { name: "Select exam board" });

    await act(async () => {
      await userEvent.click(button);
    });

    expect(getByTestId("search-dropdown-content")).toBeVisible();
    expect(button).toHaveAttribute("aria-expanded", "true");
  });
  test("pathways without exam boards are filtered out", async () => {
    const { getByRole, getAllByRole } = renderWithTheme(
      <SearchDropdown label={"Select exam board"} {...searchResultLesson} />,
    );

    const button = getByRole("button", { name: "Select exam board" });

    await act(async () => {
      await userEvent.click(button);
    });

    const links = getAllByRole("link");

    expect(links).toHaveLength(2);
  });
  test("lesson type content link to lesson-overview pages", async () => {
    const { getByRole, getAllByRole } = renderWithTheme(
      <SearchDropdown label={"Select exam board"} {...searchResultLesson} />,
    );

    const button = getByRole("button", { name: "Select exam board" });

    await act(async () => {
      await userEvent.click(button);
    });

    const links = getAllByRole("link");

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining(
        "/teachers/programmes/maths-program-1/units/computer-systems-e17a/lessons/the-fde-cycle-68w3ct",
      ),
    );
    expect(links[1]).toHaveAttribute(
      "href",
      expect.stringContaining(
        "/teachers/programmes/maths-program-3/units/computer-systems-e17a/lessons/the-fde-cycle-68w3ct",
      ),
    );
  });

  test("unit type links, link to lesson-index pages", async () => {
    const { getByRole, getAllByRole } = renderWithTheme(
      <SearchDropdown label={"Select exam board"} {...searchResultUnit} />,
    );

    const button = getByRole("button", { name: "Select exam board" });

    await act(async () => {
      await userEvent.click(button);
    });

    const links = getAllByRole("link");

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining(
        "/teachers/programmes/maths-program-1/units/computing-systems-1558/lessons",
      ),
    );
    expect(links[1]).toHaveAttribute(
      "href",
      expect.stringContaining(
        "/teachers/programmes/maths-program-3/units/computing-systems-1558/lessons",
      ),
    );
  });
  test("onClick is called when a dropdown link is clicked", async () => {
    const { getByRole, getByText } = renderWithTheme(
      <SearchDropdown label={"Select exam board"} {...searchResultUnit} />,
    );

    const button = getByRole("button", { name: "Select exam board" });

    await act(async () => {
      await userEvent.click(button);
    });

    const link = getByText("Exam Board 1 Higher");

    await act(async () => {
      await userEvent.click(link);
    });

    expect(onClickSearchHit).toHaveBeenCalled();
  });
});
