import { render } from "@testing-library/react";

import Page from "./page";

import { useFeatureFlag } from "@/utils/featureFlags";

jest.mock("src/utils/featureFlags");

describe("/timetabling/units", () => {
  test("when enabled", async () => {
    (useFeatureFlag as jest.Mock).mockResolvedValue(true);
    const { baseElement } = render(await Page());
    expect(baseElement).toHaveTextContent("View timetable");
  });

  test("when disabled", async () => {
    (useFeatureFlag as jest.Mock).mockResolvedValue(false);
    expect(async () => {
      return await Page();
    }).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
});
