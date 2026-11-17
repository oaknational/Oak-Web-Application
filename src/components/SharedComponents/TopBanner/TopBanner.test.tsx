import TopBanner from "./TopBanner";
import { topBannerFixture } from "./TopBanner.fixture";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("TopBanner", () => {
  it("should render the top banner component correctly", () => {
    const { getByRole, getByText } = renderWithProviders()(
      <TopBanner {...topBannerFixture} />,
    );

    const banner = getByRole("banner");
    expect(banner).toBeInTheDocument();
    expect(banner).toMatchSnapshot();

    const newTag = getByText("New");
    expect(banner).toContainElement(newTag);

    const message = getByText("Oak is now used in of schools!");
    const boldSpan = getByText("72%");
    expect(banner).toContainElement(message);
    expect(banner).toContainElement(boldSpan);

    const link = getByRole("link");
    expect(link).toHaveAttribute("href", "/about-us/oaks-impact");
    expect(link).toHaveAttribute("title", "Explore our impact");

    const backgroundColorAsRgb = "rgb(190, 242, 189)";
    expect(banner.firstChild).toHaveStyle(
      `background-color: ${backgroundColorAsRgb}`,
    );
  });

  it("should render an external link correctly", () => {
    const externalTopBannerFixture = {
      ...topBannerFixture,
      cta: {
        label: "Explore our impact",
        linkType: "external" as const,
        external: "https://www.google.com/",
        internal: null,
      },
    };

    const { getByRole } = renderWithProviders()(
      <TopBanner {...externalTopBannerFixture} />,
    );

    const link = getByRole("link");
    expect(link).toHaveAttribute("href", "https://www.google.com/");
  });

  it("should not render the 'New' tag if not enabled", () => {
    const { queryByText } = renderWithProviders()(
      <TopBanner {...topBannerFixture} displayNewTag={false} />,
    );

    const newTag = queryByText("New");
    expect(newTag).not.toBeInTheDocument();
  });

  it("should not render the message text if not provided", () => {
    const { queryByText } = renderWithProviders()(
      <TopBanner {...topBannerFixture} messagePortableText={null} />,
    );

    const message = queryByText("Oak is now used in of schools!");
    expect(message).not.toBeInTheDocument();
  });

  it("should not render the cta if cta is not enabled", () => {
    const { queryByRole } = renderWithProviders()(
      <TopBanner {...topBannerFixture} displayCta={false} cta={null} />,
    );

    const link = queryByRole("link");
    expect(link).not.toBeInTheDocument();
  });
});
