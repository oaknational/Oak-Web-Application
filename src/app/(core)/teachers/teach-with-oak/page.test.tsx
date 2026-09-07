/**
 * @jest-environment jsdom
 */
import { notFound } from "next/navigation";
import type { ReactElement } from "react";

import TeachWithOakPage from "./page";

import { getFeatureFlagValue } from "@/utils/featureFlags";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("@/utils/featureFlags");

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  }),
  usePathname: jest.fn(),
}));

jest.mock("@/hocs/withPageErrorHandling", () => ({
  __esModule: true,
  default: (Page: unknown) => Page,
}));

jest.mock("./components/TeachWithOakView", () => ({
  TeachWithOakView: ({ backToLessonLink }: { backToLessonLink?: string }) => (
    <div data-testid="teach-with-oak-view">{backToLessonLink}</div>
  ),
}));

const renderPage = async (searchParams = {}) =>
  renderWithProviders()(
    (await TeachWithOakPage({
      params: Promise.resolve({}),
      searchParams: Promise.resolve(searchParams),
    })) as ReactElement,
  );

describe("Teach with Oak page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(getFeatureFlagValue).mockResolvedValue("enabled");
  });

  test("renders the view inside the teach-with-oak analytics context", async () => {
    const { getByTestId } = await renderPage();

    expect(getFeatureFlagValue).toHaveBeenCalledWith(
      "teachers-teach-with-oak",
      "string",
    );
    expect(getByTestId("teach-with-oak-view")).toBeInTheDocument();
  });

  test("passes a valid return link to the view", async () => {
    const { getByTestId } = await renderPage({
      returnTo: "https://thenational.academy/teachers/lessons/example",
    });

    expect(getByTestId("teach-with-oak-view")).toHaveTextContent(
      "/teachers/lessons/example",
    );
  });

  test("does not pass an invalid return link to the view", async () => {
    const { getByTestId } = await renderPage({
      returnTo: ["/teachers/lessons/example"],
    });

    expect(getByTestId("teach-with-oak-view")).toBeEmptyDOMElement();
  });

  test("does not pass a return link from an invalid hostname to the view", async () => {
    const { getByTestId } = await renderPage({
      returnTo: "https://google.com",
    });

    expect(getByTestId("teach-with-oak-view")).toBeEmptyDOMElement();
  });

  test("returns a not-found response when the feature is disabled", async () => {
    jest.mocked(getFeatureFlagValue).mockResolvedValue("");

    await expect(
      TeachWithOakPage({
        params: Promise.resolve({}),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    expect(notFound).toHaveBeenCalledTimes(1);
  });
});
