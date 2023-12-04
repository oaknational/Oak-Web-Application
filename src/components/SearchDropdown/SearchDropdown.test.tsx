import userEvent from "@testing-library/user-event";

import SearchDropdown from "./SearchDropdown";
import { unitListData, lessonListData } from "./SearchDropdown.fixture";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("SearchDropdown component", () => {
  test("component renders with correct title", () => {
    const { getByText } = renderWithTheme(
      <SearchDropdown
        dropdownTitle={"Select exam board"}
        dropdownContent={unitListData}
      />,
    );

    expect(getByText("Select exam board")).toBeInTheDocument();
  });

  test("child component to not be visible on unexpanded container", () => {
    const { getByTestId } = renderWithTheme(
      <SearchDropdown
        dropdownTitle={"Select exam board"}
        dropdownContent={unitListData}
      />,
    );

    expect(getByTestId("search-dropdown-content")).not.toBeVisible();
  });

  test("container expands on click, child component to become visible", async () => {
    const { getByRole, getByTestId } = renderWithTheme(
      <SearchDropdown
        dropdownTitle={"Select exam board"}
        dropdownContent={lessonListData}
      />,
    );

    const button = getByRole("button", { name: "Select exam board" });

    await userEvent.click(button);

    expect(getByTestId("search-dropdown-content")).toBeVisible();
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  test("lesson type content link to lesson-overview pages", async () => {
    const { getByRole, getAllByRole } = renderWithTheme(
      <SearchDropdown
        dropdownTitle={"Select exam board"}
        dropdownContent={lessonListData}
      />,
    );

    const button = getByRole("button", { name: "Select exam board" });

    await userEvent.click(button);

    const links = getAllByRole("link");

    expect(links).toHaveLength(4);

    links.forEach((link) => {
      expect(link).toHaveAttribute("href");
      expect(link).toHaveAttribute(
        "href",
        expect.stringContaining("/lessons/lesson-1"),
      );
    });
  });

  test("unit type links, link to lesson-index pages", async () => {
    const { getByRole, getAllByRole } = renderWithTheme(
      <SearchDropdown
        dropdownTitle={"Select exam board"}
        dropdownContent={unitListData}
      />,
    );

    const button = getByRole("button", { name: "Select exam board" });

    await userEvent.click(button);

    const links = getAllByRole("link");

    expect(links).toHaveLength(4);

    links.forEach((link) => {
      expect(link).toHaveAttribute("href");
      expect(link).toHaveAttribute(
        "href",
        expect.not.stringContaining("/lessons/unit-1"),
      );
      expect(link).toHaveAttribute(
        "href",
        expect.stringContaining("/units/unit-1"),
      );
    });
  });
});
