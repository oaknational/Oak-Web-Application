import Page from "./page";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { useFeatureFlag } from "@/utils/featureFlags";

jest.mock("src/utils/featureFlags");

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

describe("/timetabling/units", () => {
  test("when enabled", async () => {
    (useFeatureFlag as jest.Mock).mockResolvedValue(true);
    const { baseElement } = renderWithTheme(
      await Page({
        params: Promise.resolve({ subjectPhaseSlug: "maths-primary" }),
      }),
    );
    expect(baseElement).toHaveTextContent("Year 1 maths");
  });

  test("when disabled", async () => {
    (useFeatureFlag as jest.Mock).mockResolvedValue(false);
    expect(async () => {
      return await Page({
        params: Promise.resolve({ subjectPhaseSlug: "maths-primary" }),
      });
    }).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
});
