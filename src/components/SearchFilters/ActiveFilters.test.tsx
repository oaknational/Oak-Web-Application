import { renderHook, act } from "@testing-library/react";
import { useRouter } from "next/router";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";
import { SearchProvider, KeyStage } from "../../context/Search/SearchContext";

import ActiveFilters from "./ActiveFilters";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

jest.mock("../../context/Search/useSearchQuery", () =>
  jest.fn(() => ({
    keyStages: new Set<KeyStage>(["1", "2", "4"]),
    setKeyStages: jest.fn(),
  }))
);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ActiveFilters", () => {
  test("should render an array of active filters buttons based on the selected keystages", () => {
    const { getAllByRole, queryByText } = renderWithTheme(<ActiveFilters />);
    const activeFilterButtons = getAllByRole("button");

    expect(activeFilterButtons).toHaveLength(3);
    expect(activeFilterButtons[0]).toContainElement(queryByText("KS1"));
    expect(activeFilterButtons[1]).toContainElement(queryByText("KS2"));
    expect(activeFilterButtons[2]).toContainElement(queryByText("KS4"));
  });

  test("on filter click url should update", () => {
    const useRouterHook = renderHook(() => useRouter(), {
      wrapper: SearchProvider,
    });

    useRouterHook.result.current.query.keystages = "1,2,4";

    const { getAllByRole } = renderWithTheme(
      <SearchProvider>
        <ActiveFilters />
      </SearchProvider>
    );
    const activeFilterButton1 = getAllByRole("button")[0];

    act(() => {
      activeFilterButton1?.click();
    });

    expect(useRouterHook.result.current.query.keystages).toEqual("2,4");
  });
});
