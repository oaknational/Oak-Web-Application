import Page from "./page";

import { useFeatureFlag } from "@/utils/featureFlags";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

jest.mock("src/utils/featureFlags");

describe("/timetabling/units", () => {
  test("when enabled", async () => {
    (useFeatureFlag as jest.Mock).mockResolvedValue({ isEnabled: true });
    const { baseElement } = renderWithTheme(await Page());
    expect(baseElement).toHaveTextContent("Input name");
  });

  test("when disabled", () => {
    (useFeatureFlag as jest.Mock).mockResolvedValue({ isEnabled: false });
    expect(async () => {
      return await Page();
    }).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
});
