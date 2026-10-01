/**
 * @jest-environment jsdom
 */
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { screen } from "@testing-library/dom";

import TeachWithOakDownloadPage from "./page";

import { getTeachWithOakDownloadFileExistence } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence";
import { getFeatureFlagValue } from "@/utils/featureFlags";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("@/utils/featureFlags");
jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence",
);

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  }),
  usePathname: jest.fn(),
  useRouter: jest.fn(() => ({ replace: jest.fn() })),
  useSearchParams: jest.fn(),
}));

jest.mock("@/hocs/withPageErrorHandling", () => ({
  __esModule: true,
  default: (Page: unknown) => Page,
}));

const renderPage = async () =>
  renderWithProviders()(
    (await TeachWithOakDownloadPage({
      params: Promise.resolve({}),
      searchParams: Promise.resolve({}),
    })) as ReactElement,
  );

describe("Teach with Oak download page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(getFeatureFlagValue).mockResolvedValue("enabled");
    jest.mocked(getTeachWithOakDownloadFileExistence).mockResolvedValue({
      resources: [{ type: "explanation", exists: true, fileSize: "2 MB" }],
    } as never);
  });

  test("renders the download view when the feature is enabled", async () => {
    await renderPage();

    expect(getFeatureFlagValue).toHaveBeenCalledWith(
      "teachers-teach-with-oak",
      "string",
    );
    const downloadPageHeader = screen.getByRole("heading", {
      name: "Download short read guides",
    });
    expect(downloadPageHeader).toBeInTheDocument();
  });

  test("returns a not-found response when the feature is disabled", async () => {
    jest.mocked(getFeatureFlagValue).mockResolvedValue("");

    await expect(
      TeachWithOakDownloadPage({
        params: Promise.resolve({}),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    expect(notFound).toHaveBeenCalledTimes(1);
  });
});
