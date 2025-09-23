import Page from "./page";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { useFeatureFlag } from "@/utils/featureFlags";

jest.mock("src/utils/featureFlags");

describe("/timetabling/units", () => {
  test("when enabled", async () => {
    (useFeatureFlag as jest.Mock).mockResolvedValue(true);
    const { baseElement } = renderWithTheme(await Page());
    expect(baseElement).toHaveTextContent("View timetable");
  });

  test("when disabled", async () => {
    (useFeatureFlag as jest.Mock).mockResolvedValue(false);
    expect(async () => {
      return await Page();
    }).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
});
