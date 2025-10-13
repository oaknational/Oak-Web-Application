import Page from "./page";

import { useFeatureFlag } from "@/utils/featureFlags";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

jest.mock("@/utils/featureFlags");

jest.mock("next/navigation", () => {
  const defaultSearchParams = new URLSearchParams("");
  return {
    __esModule: true,
    usePathname: () => "/timetabling/maths-primary/new",
    useSearchParams: () => defaultSearchParams,
    notFound: () => {
      throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
    },
  };
});

describe("/timetabling/new", () => {
  test("basic", async () => {
    (useFeatureFlag as jest.Mock).mockResolvedValue(true);
    const { baseElement } = renderWithTheme(
      await Page({
        params: Promise.resolve({ subjectPhaseSlug: "maths-primary" }),
      }),
    );
    expect(baseElement).toHaveTextContent("Enter lessons per term");
  });
});
