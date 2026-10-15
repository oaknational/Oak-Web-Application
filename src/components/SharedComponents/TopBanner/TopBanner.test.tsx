import TopBanner from "./TopBanner";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("TopBanner", () => {
  const topBannerFixture = {
    messagePortableText: [
      {
        _key: "967be59f8853",
        _type: "block",
        children: [
          {
            _key: "24221de4ae210",
            _type: "span",
            marks: [],
            text: "Oak is now used in 72% of schools",
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
    ctaText: "Explore our impact",
    ctaLink: "https://www.thenational.academy/about-us/oaks-impact",
  };

  it("should render the top banner component correctly", () => {
    const { container, getByRole, getByText } = renderWithProviders()(
      <TopBanner topBanner={topBannerFixture} />,
    );

    expect(container).toBeInTheDocument();

    const banner = getByRole("banner");
    expect(banner).toBeInTheDocument();

    const message = getByText("Oak is now used in 72% of schools");
    expect(banner).toContainElement(message);

    const link = getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      "https://www.thenational.academy/about-us/oaks-impact",
    );
    expect(link).toHaveAttribute("title", "Explore our impact");
  });
});
