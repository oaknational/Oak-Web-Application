import Page from "./layout";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { getFeatureFlagValue } from "@/utils/featureFlags";

jest.mock("@/utils/featureFlags");

// Unmock the mock created in jest setup to get access to the notFound function
jest.unmock("next/navigation");

describe("/timetabling/layout.tsx", () => {
  test("basic", async () => {
    (getFeatureFlagValue as jest.Mock).mockResolvedValue(true);
    const { baseElement } = renderWithTheme(
      await Page({ children: <div>TESTING</div> }),
    );
    expect(baseElement).toBeTruthy();
  });

  test("when disabled", async () => {
    (getFeatureFlagValue as jest.Mock).mockResolvedValue(false);
    expect(async () => {
      return await Page({
        children: <div>TESTING</div>,
      });
    }).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
});
