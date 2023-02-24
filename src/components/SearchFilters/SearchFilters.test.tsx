import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";
import { ALL_KEY_STAGES } from "../../context/Search/SearchContext";

import SearchFilters from "./SearchFilters";

jest.mock("../../context/Search/SearchContext", () => ({
  __esModule: true,
  ...jest.requireActual("../../context/Search/SearchContext"),
  useSearchQuery: () => ({
    keyStages: new Set(["1", "2", "3"]),
    setKeyStages: jest.fn(),
  }),
}));
jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("SearchFilters", () => {
  test("should render SearchFilters based on ALL_KEY_STAGES", () => {
    const { getAllByRole } = renderWithTheme(<SearchFilters />);
    const searchFilters = getAllByRole("checkbox");
    expect(searchFilters).toHaveLength(ALL_KEY_STAGES.length);
  });
});
