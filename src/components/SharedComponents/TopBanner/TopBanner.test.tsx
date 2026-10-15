import TopBanner from "./TopBanner";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

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

describe("TopBanner", () => {
  it("should render the top banner component correctly", () => {
    const { getByRole, getByText } = renderWithProviders()(
      <TopBanner topBanner={topBannerFixture} />,
    );

    const banner = getByRole("banner");
    expect(banner).toBeInTheDocument();
    expect(banner).toMatchSnapshot();

    const message = getByText("Oak is now used in 72% of schools");
    expect(banner).toContainElement(message);

    const link = getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      "https://www.thenational.academy/about-us/oaks-impact",
    );
    expect(link).toHaveAttribute("title", "Explore our impact");
  });

  it("should not render the cta if ctaText is not provided", () => {
    const { queryByRole } = renderWithProviders()(
      <TopBanner topBanner={{ ...topBannerFixture, ctaText: undefined }} />,
    );

    const link = queryByRole("link");
    expect(link).not.toBeInTheDocument();
  });

  it("should not render the cta if ctaLink is not provided", () => {
    const { queryByRole } = renderWithProviders()(
      <TopBanner topBanner={{ ...topBannerFixture, ctaLink: undefined }} />,
    );

    const link = queryByRole("link");
    expect(link).not.toBeInTheDocument();
  });
});
