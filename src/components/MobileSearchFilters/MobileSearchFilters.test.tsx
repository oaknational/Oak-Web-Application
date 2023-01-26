import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import MobileSearchFilters, {
  MobileSearchFiltersProps,
} from "./MobileSearchFilters";

const testProps: MobileSearchFiltersProps = {
  children: <p>search filters</p>,
};

describe("components/MobileSearchFilters", () => {
  test("it renders its children", async () => {
    const { getByText } = renderWithProviders(
      <MobileSearchFilters {...testProps} />
    );

    const searchFilters = getByText("search filters");
    expect(searchFilters).toBeInTheDocument;
  });
});
