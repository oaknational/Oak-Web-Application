import Page from "./page";

import { useFeatureFlag } from "@/utils/featureFlags";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

jest.mock("src/utils/featureFlags");

describe("/timetabling/units", () => {
  test("when enabled", async () => {
    (useFeatureFlag as jest.Mock).mockResolvedValue(true);
    const { baseElement } = renderWithTheme(await Page());
    expect(baseElement).toHaveTextContent("New timetable");
  });

  test("when disabled", async () => {
    (useFeatureFlag as jest.Mock).mockResolvedValue(false);
    expect(async () => {
      return await Page();
    }).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
});
