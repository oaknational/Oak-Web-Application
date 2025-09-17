import { render } from "@testing-library/react";

import Page from "./page";

import { useFeatureFlag } from "@/utils/featureFlags";

jest.mock("src/utils/featureFlags");

describe("/timetabling/units", () => {
  test("when enabled", async () => {
    (useFeatureFlag as jest.Mock).mockResolvedValue({ isEnabled: true });
    const { baseElement } = render(await Page());
    expect(baseElement).toHaveTextContent("Input name");
  });

  test("when disabled", () => {
    (useFeatureFlag as jest.Mock).mockResolvedValue({ isEnabled: false });
    expect(async () => {
      return await Page();
    }).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
});
