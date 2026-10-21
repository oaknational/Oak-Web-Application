import TopBanner from "./TopBanner";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

// to do - put in fixture
// to do - example with promo tag
const topBannerFixture = {
  messagePortableTextWithPromo: [
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
  enabled: true,
  cta: {
    label: "Explore our impact",
    linkType: "external" as const,
    external: "https://www.google.com/",
    internal: "/about-us/oaks-impact",
  },
  backgroundColour: "bg-decorative1-main" as const,
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
    expect(link).toHaveAttribute("href", "https://www.google.com/");
    expect(link).toHaveAttribute("title", "Explore our impact");

    const backgroundColourAsRgb = "rgb(190, 242, 189)";
    expect(banner.firstChild).toHaveStyle(
      `background-color: ${backgroundColourAsRgb}`,
    );
  });

  it("should render an internal link correctly", () => {
    const internalTopBannerFixture = {
      ...topBannerFixture,
      cta: { ...topBannerFixture.cta, linkType: "internal" as const },
    };

    const { getByRole } = renderWithProviders()(
      <TopBanner topBanner={internalTopBannerFixture} />,
    );

    const link = getByRole("link");
    expect(link).toHaveAttribute("href", "/about-us/oaks-impact");
  });

  it("should not render the message text if not provided", () => {
    const { queryByText } = renderWithProviders()(
      <TopBanner
        topBanner={{ ...topBannerFixture, messagePortableTextWithPromo: null }}
      />,
    );

    const message = queryByText("Oak is now used in 72% of schools");
    expect(message).not.toBeInTheDocument();
  });

  it("should not render the cta if cta is not enabled", () => {
    const { queryByRole } = renderWithProviders()(
      <TopBanner topBanner={{ ...topBannerFixture, enabled: false }} />,
    );

    const link = queryByRole("link");
    expect(link).not.toBeInTheDocument();
  });
});
