import type { ReactElement } from "react";

import NcAlignmentChecker from "./page";

import "@/__tests__/__helpers__/ResizeObserverMock";
import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";
import CMSClient from "@/node-lib/cms";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve({})),
  draftMode: jest.fn(() => Promise.resolve({ isEnabled: false })),
}));

jest.mock("@/node-lib/cms", () => ({
  __esModule: true,
  default: {
    ncAlignmentCheckerLandingPage: jest.fn(),
  },
}));

jest.mock("@/node-lib/cache", () => ({
  cacheData: (fn: unknown) => fn,
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  notFound: jest.fn(() => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  }),
}));

jest.mock("@/hocs/withPageErrorHandling", () => ({
  __esModule: true,
  default: (Page: unknown) => Page,
}));

jest.mock("@/utils/featureFlagChecks/server", () => ({
  isFeatureFlagEnabledServer: jest.fn(),
}));

/**
 * The default export returns `<InnerMcpPage />`, an async server component,
 * which React 18 can't render client-side, so resolve it manually.
 */
const renderPage = async () => {
  const element = (await NcAlignmentChecker({
    params: Promise.resolve({}),
  })) as ReactElement;
  const Inner = element.type as (props: unknown) => Promise<ReactElement>;
  return Inner(element.props);
};

describe("/nc-alignment-checker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the CMS blocks when the feature flag is enabled", async () => {
    jest.mocked(isFeatureFlagEnabledServer).mockResolvedValue(true);
    jest.mocked(CMSClient.ncAlignmentCheckerLandingPage).mockResolvedValue({
      blocks: [
        {
          _key: "1111",
          __typename: "NcAlignmentCheckerLandingPageQuotes",
          quotes: [],
        },
      ],
    } as never);

    const { container } = render(await renderPage());

    expect(container).toHaveTextContent("NcAlignmentCheckerLandingPageQuotes");
  });

  it("returns not found when the feature flag is disabled", async () => {
    jest.mocked(isFeatureFlagEnabledServer).mockResolvedValue(false);

    await expect(renderPage()).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    expect(CMSClient.ncAlignmentCheckerLandingPage).not.toHaveBeenCalled();
  });

  it("returns not found when there is no CMS page data", async () => {
    jest.mocked(isFeatureFlagEnabledServer).mockResolvedValue(true);
    jest
      .mocked(CMSClient.ncAlignmentCheckerLandingPage)
      .mockResolvedValue(null as never);

    await expect(renderPage()).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  });
});
