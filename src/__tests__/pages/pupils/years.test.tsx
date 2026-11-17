import YearListingPage from "@/pages/pupils/years";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const renderForSeo = renderWithSeo();
const render = renderWithProviders();

describe("YearListingPage", () => {
  it("keeps the year hub indexed and followed", () => {
    const { seo } = renderForSeo(<YearListingPage topNav={topNavFixture} />);

    expect(seo.robots).toBe("index,follow");
  });

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
    const { getByText } = render(<YearListingPage topNav={topNavFixture} />);
    expect(getByText(expected)).toBeInTheDocument();
  });
});
