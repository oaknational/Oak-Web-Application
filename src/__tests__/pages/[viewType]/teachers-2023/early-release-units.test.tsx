import { mockSeoResult } from "@/__tests__/__helpers__/cms";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import EarlyReleaseUnits from "@/pages/[viewType]/early-release-units";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import earlyReleaseExemplarUnitsFixture from "@/node-lib/curriculum-api/fixtures/earlyReleaseExemplarUnits.fixture";

const providers = {
  theme: {},
  menu: {},
  router: {},
  analytics: {},
  cookieConsent: {},
};

const secondaryUnitTitles =
  earlyReleaseExemplarUnitsFixture().secondary.units.map((unit) => unit.title);
const primaryUnitTitles = earlyReleaseExemplarUnitsFixture().primary.units.map(
  (unit) => unit.title,
);

describe("pages/teachers-2023/early-release-units", () => {
  test("it renders a page header", () => {
    const { getByRole } = renderWithProviders()(<EarlyReleaseUnits />);

    expect(
      getByRole("heading", { name: "New teaching resources" }),
    ).toBeInTheDocument();
  });

  test("it renders primary units", () => {
    const { getByRole } = renderWithProviders()(<EarlyReleaseUnits />);

    expect(getByRole("heading", { name: "Primary units" })).toBeInTheDocument();
  });
  test("it renders the secondary units component", () => {
    const { getByRole } = renderWithProviders()(<EarlyReleaseUnits />);

    expect(
      getByRole("heading", { name: "Secondary units" }),
    ).toBeInTheDocument();
  });
  test("it renders the primary units component", () => {
    const { getByRole } = renderWithProviders()(<EarlyReleaseUnits />);

    expect(
      getByRole("heading", { name: "Secondary units" }),
    ).toBeInTheDocument();
  });
  test.each(secondaryUnitTitles)(
    "it renders the secondary %s  unit",
    (title) => {
      const { getByRole } = renderWithProviders()(<EarlyReleaseUnits />);

      const unit = getByRole("heading", { name: title });

      expect(unit).toBeInTheDocument();
    },
  );
  test.each(primaryUnitTitles)("it renders the primary %s  unit", (title) => {
    const { getByRole } = renderWithProviders()(<EarlyReleaseUnits />);

    const unit = getByRole("heading", { name: title });

    expect(unit).toBeInTheDocument();
  });

  test("renders page with correct seo", () => {
    const { seo } = renderWithSeo(providers)(<EarlyReleaseUnits />);

    expect(seo).toEqual({
      ...mockSeoResult,
      title: "NEXT_PUBLIC_SEO_APP_NAME",
      description: "NEXT_PUBLIC_SEO_APP_DESCRIPTION",
      ogTitle: "NEXT_PUBLIC_SEO_APP_NAME",
      ogDescription: "NEXT_PUBLIC_SEO_APP_DESCRIPTION",
      ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
      ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
      canonical: "NEXT_PUBLIC_SEO_APP_URL",
      robots: "noindex,nofollow",
    });
  });
});
