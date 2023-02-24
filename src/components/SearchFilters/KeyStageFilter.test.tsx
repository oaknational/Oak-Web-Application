import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import KeyStageFilter from "./KeyStageFilter";

jest.mock("../../context/Search/SearchContext", () => ({
  __esModule: true,
  ...jest.requireActual("../../context/Search/SearchContext"),
  useSearchQuery: () => ({
    keyStages: new Set(),
    setKeyStages: jest.fn(),
  }),
}));
jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("KeyStageFilter", () => {
  test("should render a custom checkbox with correct text and attributes", () => {
    const { getByRole } = renderWithTheme(<KeyStageFilter ks="1" />);
    const checkbox = getByRole("checkbox");
    expect(checkbox.id).toEqual("custom-checkbox-1");
    expect(checkbox.getAttribute("name")).toEqual("keyStageFilters");
    expect(checkbox).not.toBeChecked();
  });

  test("should render a checked custom checkbox if checked is set to true", () => {
    jest.mock("../../context/Search/SearchContext", () => ({
      __esModule: true,
      ...jest.requireActual("../../context/Search/SearchContext"),
      useSearchQuery: () => ({
        keyStages: new Set(["3"]),
        setKeyStages: jest.fn(),
      }),
    }));

    const { getByRole } = renderWithTheme(<KeyStageFilter ks="3" />);

    const checkbox = getByRole("checkbox");
    expect(checkbox.id).toEqual("custom-checkbox-3");
  });
});
