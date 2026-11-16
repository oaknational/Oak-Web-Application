import type { ReactElement } from "react";

import NcAlignmentChecker from "./page";

import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve({})),
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

const renderPage = () => NcAlignmentChecker({ params: Promise.resolve({}) });

describe("/nc-alignment-checker", () => {
  it("renders the page when the feature flag is enabled", async () => {
    jest.mocked(isFeatureFlagEnabledServer).mockResolvedValue(true);

    const { getByText } = render((await renderPage()) as ReactElement);

    expect(getByText("NC Alignment Checker")).toBeInTheDocument();
  });

  it("returns not found when the feature flag is disabled", async () => {
    jest.mocked(isFeatureFlagEnabledServer).mockResolvedValue(false);

    await expect(renderPage()).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  });
});
