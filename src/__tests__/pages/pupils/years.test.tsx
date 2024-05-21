import YearListingPage from "@/pages/pupils/beta/years";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("YearListingPage", () => {
  it.each([
    "Year 1",
    "Year 2",
    "Year 3",
    "Year 4",
    "Year 5",
    "Year 6",
    "Year 7",
    "Year 8",
    "Year 9",
    "Year 10",
    "Year 11",
  ])("renders buttons for all of the years", (expected) => {
    const { getByText } = render(<YearListingPage />);
    expect(getByText(expected)).toBeInTheDocument();
  });
});
