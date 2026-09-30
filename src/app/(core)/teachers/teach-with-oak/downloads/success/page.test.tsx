/**
 * @jest-environment jsdom
 */
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { screen } from "@testing-library/dom";

import TeachWithOakDownloadSuccessPage from "./page";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import curriculumPhaseOptionsFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumPhaseOptions.fixture";
import { getFeatureFlagValue } from "@/utils/featureFlags";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("@/utils/featureFlags");

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    curriculumPhaseOptions: jest.fn(),
  },
}));

jest.mock("@/node-lib/cache", () => ({
  cacheData: <Args extends unknown[], Result>(
    fn: (...args: Args) => Promise<Result>,
  ) => fn,
}));

const mockSearchParams = jest.fn(() => new URLSearchParams());
jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  }),
  usePathname: jest.fn(),
  useRouter: jest.fn(() => ({ push: jest.fn(), replace: jest.fn() })),
  useSearchParams: () => mockSearchParams(),
}));

jest.mock("@/hocs/withPageErrorHandling", () => ({
  __esModule: true,
  default: (Page: unknown) => Page,
}));

const returnTo =
  "/teachers/programmes/art-primary-ks1/units/unitSlug/lessons/lessonSlug";
const returnToParams = {
  returnTo,
  lessonName: "Lesson Name",
  unitName: "Unit Name",
};

const renderPage = async (searchParams: Record<string, string> = {}) =>
  renderWithProviders()(
    (await TeachWithOakDownloadSuccessPage({
      params: Promise.resolve({}),
      searchParams: Promise.resolve(searchParams),
    })) as ReactElement,
  );

describe("Teach with Oak download success page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams.mockReturnValue(new URLSearchParams());
    jest.mocked(getFeatureFlagValue).mockResolvedValue("enabled");
    jest
      .mocked(curriculumApi2023.curriculumPhaseOptions)
      .mockResolvedValue(curriculumPhaseOptionsFixture());
  });

  test("renders the subject phase picker when there is no lesson to return to", async () => {
    await renderPage();

    expect(getFeatureFlagValue).toHaveBeenCalledWith(
      "teachers-teach-with-oak",
      "string",
    );
    expect(
      screen.getByRole("heading", { name: "Thanks for downloading!" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Explore curriculum plans and teaching resources",
      }),
    ).toBeInTheDocument();
  });

  test("renders a back to lesson link and skips the picker fetch when returnTo params are present", async () => {
    mockSearchParams.mockReturnValue(new URLSearchParams(returnToParams));

    await renderPage(returnToParams);

    expect(curriculumApi2023.curriculumPhaseOptions).not.toHaveBeenCalled();
    expect(
      screen.getByRole("link", { name: "Back to lesson" }),
    ).toHaveAttribute("href", returnTo);
    expect(
      screen.queryByRole("heading", {
        name: "Explore curriculum plans and teaching resources",
      }),
    ).not.toBeInTheDocument();
  });

  test("returns a not-found response when the feature is disabled", async () => {
    jest.mocked(getFeatureFlagValue).mockResolvedValue("");

    await expect(
      TeachWithOakDownloadSuccessPage({
        params: Promise.resolve({}),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    expect(notFound).toHaveBeenCalledTimes(1);
  });
});
