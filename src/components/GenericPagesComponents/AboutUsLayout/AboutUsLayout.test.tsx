import { useRouter } from "next/router";

import { AboutUsLayout } from "./index";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("AboutUsLayout", () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      pathname: "/",
      query: {},
      asPath: "/",
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
      isLocaleDomain: false,
      isReady: true,
      isPreview: false,
    } as never);
    process.env.FORCE_FEATURE_FLAG_OAKS_IMPACT = "false";
  });

  it("renders children correctly", () => {
    const { getByText } = renderWithProviders()(
      <AboutUsLayout>
        <div>Test Content</div>
      </AboutUsLayout>,
    );

    expect(getByText("Test Content")).toBeInTheDocument();
  });

  it("renders explore section with correct title", () => {
    const { getByText } = renderWithProviders()(
      <AboutUsLayout>
        <div>Test</div>
      </AboutUsLayout>,
    );

    expect(getByText("Explore more about Oak")).toBeInTheDocument();
  });

  it("renders all explore links when on a different page", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/some-other-page",
      query: {},
      asPath: "/some-other-page",
    } as never);

    const { getByText } = renderWithProviders()(
      <AboutUsLayout>
        <div>Test</div>
      </AboutUsLayout>,
    );

    expect(getByText("About Oak")).toBeInTheDocument();
    expect(getByText("Oak's curricula")).toBeInTheDocument();
    expect(getByText("Meet the team")).toBeInTheDocument();
    expect(getByText("Get involved")).toBeInTheDocument();
  });

  it("excludes 'About Oak' link when on who-we-are page", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/about-us/who-we-are",
      query: {},
      asPath: "/about-us/who-we-are",
    } as never);

    const { queryByText, getByText } = renderWithProviders()(
      <AboutUsLayout>
        <div>Test</div>
      </AboutUsLayout>,
    );

    // Should not render "About Oak" link
    expect(queryByText("About Oak")).not.toBeInTheDocument();

    // Should still render other links
    expect(getByText("Oak's curricula")).toBeInTheDocument();
    expect(getByText("Meet the team")).toBeInTheDocument();
    expect(getByText("Get involved")).toBeInTheDocument();
  });

  it("excludes 'Get involved' link when on get-involved page", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/about-us/get-involved",
      query: {},
      asPath: "/about-us/get-involved",
    } as never);

    const { queryByText, getByText } = renderWithProviders()(
      <AboutUsLayout>
        <div>Test</div>
      </AboutUsLayout>,
    );

    // Should not render "Get involved" link
    expect(queryByText("Get involved")).not.toBeInTheDocument();

    // Should still render other links
    expect(getByText("About Oak")).toBeInTheDocument();
    expect(getByText("Oak's curricula")).toBeInTheDocument();
    expect(getByText("Meet the team")).toBeInTheDocument();
  });

  it("renders newsletter form", () => {
    const { container } = renderWithProviders()(
      <AboutUsLayout>
        <div>Test</div>
      </AboutUsLayout>,
    );

    // Newsletter form should be present
    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
  });

  it("only shows 3 links when current page matches one of the explore items", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/about-us/who-we-are",
      query: {},
      asPath: "/about-us/who-we-are",
    } as never);

    const { container } = renderWithProviders()(
      <AboutUsLayout>
        <div>Test</div>
      </AboutUsLayout>,
    );

    // Count the number of explore item links (they have data-testid="who-we-are-explore-item")
    const exploreItems = container.querySelectorAll(
      '[data-testid="who-we-are-explore-item"]',
    );
    expect(exploreItems).toHaveLength(3);
  });

  it("shows 4 links when current page does not match any explore item", () => {
    mockUseRouter.mockReturnValue({
      pathname: "/different-page",
      query: {},
      asPath: "/different-page",
    } as never);

    const { container } = renderWithProviders()(
      <AboutUsLayout>
        <div>Test</div>
      </AboutUsLayout>,
    );

    // Count the number of explore item links
    const exploreItems = container.querySelectorAll(
      '[data-testid="who-we-are-explore-item"]',
    );
    expect(exploreItems).toHaveLength(4);
  });

  it("does not render Oak's impact link when feature flag is false", () => {
    process.env.FORCE_FEATURE_FLAG_OAKS_IMPACT = "false";

    const { queryByText } = renderWithProviders()(
      <AboutUsLayout>
        <div>Test</div>
      </AboutUsLayout>,
    );

    expect(queryByText("Oak's impact")).not.toBeInTheDocument();
  });

  describe("when Oak's impact feature flag is enabled", () => {
    beforeEach(() => {
      process.env.FORCE_FEATURE_FLAG_OAKS_IMPACT = "true";
    });

    afterEach(() => {
      process.env.FORCE_FEATURE_FLAG_OAKS_IMPACT = "false";
    });

    it("renders Oak's impact link", () => {
      const { getByText } = renderWithProviders()(
        <AboutUsLayout>
          <div>Test</div>
        </AboutUsLayout>,
      );

      expect(getByText("Oak's impact")).toBeInTheDocument();
    });

    it("excludes 'Oak's Impact' link when on oaks-impact page", () => {
      mockUseRouter.mockReturnValue({
        pathname: "/about-us/oaks-impact",
        query: {},
        asPath: "/about-us/oaks-impact",
      } as never);

      const { queryByText, getByText } = renderWithProviders()(
        <AboutUsLayout>
          <div>Test</div>
        </AboutUsLayout>,
      );

      // Should not render "Oak's impact" link
      expect(queryByText("Oak's impact")).not.toBeInTheDocument();

      // Should still render other links
      expect(getByText("About Oak")).toBeInTheDocument();
      expect(getByText("Oak's curricula")).toBeInTheDocument();
      expect(getByText("Get involved")).toBeInTheDocument();
      expect(getByText("Meet the team")).toBeInTheDocument();
    });

    it("only shows 4 links when current page matches one of the explore items", () => {
      mockUseRouter.mockReturnValue({
        pathname: "/about-us/who-we-are",
        query: {},
        asPath: "/about-us/who-we-are",
      } as never);

      const { container } = renderWithProviders()(
        <AboutUsLayout>
          <div>Test</div>
        </AboutUsLayout>,
      );

      // Count the number of explore item links (they have data-testid="who-we-are-explore-item")
      const exploreItems = container.querySelectorAll(
        '[data-testid="who-we-are-explore-item"]',
      );
      expect(exploreItems).toHaveLength(4);
    });

    it("shows 5 links when current page does not match any explore item", () => {
      mockUseRouter.mockReturnValue({
        pathname: "/different-page",
        query: {},
        asPath: "/different-page",
      } as never);

      const { container } = renderWithProviders()(
        <AboutUsLayout>
          <div>Test</div>
        </AboutUsLayout>,
      );

      // Count the number of explore item links
      const exploreItems = container.querySelectorAll(
        '[data-testid="who-we-are-explore-item"]',
      );
      expect(exploreItems).toHaveLength(5);
    });
  });
});
