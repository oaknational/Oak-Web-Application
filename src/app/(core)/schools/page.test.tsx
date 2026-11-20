import type { ReactElement } from "react";

import SchoolsPage from "./page";

import "@/__tests__/__helpers__/ResizeObserverMock";
import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve({ getAll: () => [] })),
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
 * The default export returns `<SchoolsPage />`, an async server component,
 * which React 18 can't render client-side, so resolve it manually.
 */
const renderPage = async () => {
  const element = (await SchoolsPage({
    params: Promise.resolve({}),
  })) as ReactElement;
  const Inner = element.type as (props: unknown) => Promise<ReactElement>;
  return Inner(element.props);
};

describe("/schools", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders when the feature flag is enabled", async () => {
    jest.mocked(isFeatureFlagEnabledServer).mockResolvedValue(true);
    const { container } = render(await renderPage());
    expect(container).toHaveTextContent(/Schools page/);
  });

  it("returns not found when the feature flag is disabled", async () => {
    jest.mocked(isFeatureFlagEnabledServer).mockResolvedValue(false);

    await expect(renderPage()).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  });
});
