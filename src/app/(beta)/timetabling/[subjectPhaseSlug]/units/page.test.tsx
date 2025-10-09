import Page from "./page";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { useFeatureFlag } from "@/utils/featureFlags";

jest.mock("@/utils/featureFlags");

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  curriculumSequence: jest.fn(() => ({ units: [] })),
  curriculumPhaseOptions: jest.fn(() => {
    return [
      {
        tab: "units",
        slug: "maths",
        title: "Maths",
        phases: [
          {
            slug: "primary",
            title: "Primary",
          },
        ],
        ks4_options: [],
      },
    ];
  }),
}));

jest.mock("next/navigation", () => {
  const defaultSearchParams = new URLSearchParams("");
  return {
    __esModule: true,
    usePathname: () => "/timetabling/maths-primary/units",
    useSearchParams: () => defaultSearchParams,
    notFound: () => {
      throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
    },
  };
});

describe("/timetabling/units", () => {
  test("basic", async () => {
    (useFeatureFlag as jest.Mock).mockResolvedValue(true);
    const { baseElement } = renderWithTheme(
      await Page({
        params: Promise.resolve({ subjectPhaseSlug: "maths-primary" }),
      }),
    );
    expect(baseElement).toHaveTextContent("Year 1 maths");
  });
});
