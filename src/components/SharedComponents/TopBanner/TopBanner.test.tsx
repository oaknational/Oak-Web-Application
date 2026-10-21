import TopBanner from "./TopBanner";
import { topBannerFixture } from "./TopBanner.fixture";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("TopBanner", () => {
  it("should render the top banner component correctly", () => {
    const { getByRole, getByText } = renderWithProviders()(
      <TopBanner topBanner={topBannerFixture} />,
    );

    const banner = getByRole("banner");
    expect(banner).toBeInTheDocument();
    expect(banner).toMatchSnapshot();

    const message = getByText("Oak is now used in of schools!");
    const promoTag = getByText("72%");
    expect(banner).toContainElement(message);
    expect(banner).toContainElement(promoTag);

    const link = getByRole("link");
    expect(link).toHaveAttribute("href", "/about-us/oaks-impact");
    expect(link).toHaveAttribute("title", "Explore our impact");

    const backgroundColourAsRgb = "rgb(190, 242, 189)";
    expect(banner.firstChild).toHaveStyle(
      `background-color: ${backgroundColourAsRgb}`,
    );
  });

  it("should render an external link correctly", () => {
    const externalTopBannerFixture = {
      ...topBannerFixture,
      cta: {
        label: "Explore our impact",
        linkType: "external" as const,
        external: "https://www.google.com/",
      },
    };

    const { getByRole } = renderWithProviders()(
      <TopBanner topBanner={externalTopBannerFixture} />,
    );

    const link = getByRole("link");
    expect(link).toHaveAttribute("href", "https://www.google.com/");
  });

  it("should not render the message text if not provided", () => {
    const { queryByText } = renderWithProviders()(
      <TopBanner
        topBanner={{ ...topBannerFixture, messagePortableTextWithPromo: null }}
      />,
    );

    const message = queryByText("Oak is now used in of schools!");
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
