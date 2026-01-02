import { screen } from "@testing-library/dom";

import MyLibraryPage from "@/pages/teachers/my-library";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: () => true,
  useFeatureFlagEnabled: () => true,
}));
jest.mock("next/navigation");
globalThis.matchMedia = jest.fn().mockReturnValue({
  matches: true,
});
const render = renderWithProviders();

jest.mock("@/node-lib/educator-api/helpers/saveUnits/useMyLibrary", () => ({
  useMyLibrary: jest.fn(() => ({
    collectionData: [],
    isLoading: false,
  })),
}));

describe("pages/teachers/my-library.tsx", () => {
  beforeEach(() => {
    setUseUserReturn(mockLoggedIn);
  });
  it("should render a header", async () => {
    render(<MyLibraryPage topNav={topNavFixture} />);
    const header = await screen.findByRole("heading", {
      name: "My library",
    });
    expect(header).toBeInTheDocument();
  });
  it("should render a no saved content heading", async () => {
    render(<MyLibraryPage topNav={topNavFixture} />);
    const noSavedContent = await screen.findByRole("heading", {
      name: "No units yet",
    });
    expect(noSavedContent).toBeInTheDocument();
  });
  it("should generate the correct SEO", () => {
    const { seo } = renderWithSeo()(<MyLibraryPage topNav={topNavFixture} />);
    expect(seo).toEqual({
      title: "My library | NEXT_PUBLIC_SEO_APP_NAME",
      description: "Save units to your own personal library",
      ogTitle: "My library | NEXT_PUBLIC_SEO_APP_NAME",
      ogDescription: "Save units to your own personal library",
      ogImage:
        "NEXT_PUBLIC_SEO_APP_URL/images/sharing/default-social-sharing-2022.png?2026",
      ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
      ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
      canonical: "NEXT_PUBLIC_SEO_APP_URL",
      robots: "noindex,nofollow",
    });
  });
});
