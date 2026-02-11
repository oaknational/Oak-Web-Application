import Page from "./page";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { createUnit } from "@/fixtures/curriculum/unit";
import { useFeatureFlag } from "@/utils/featureFlags";

jest.mock("@/utils/featureFlags");

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  curriculumSequence: jest.fn(() => ({
    units: [createUnit({ slug: "test", subject_slug: "maths" })],
  })),
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

const defaultParams = new URLSearchParams("");
const mockUseSearchParams = jest.fn(() => defaultParams);
jest.mock("next/navigation", () => {
  return {
    __esModule: true,
    usePathname: () => "/timetabling/maths-primary/units",
    useSearchParams: () => mockUseSearchParams(),
    useRouter: () => ({
      replace: jest.fn(),
      push: jest.fn(),
    }),
    notFound: () => {
      throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
    },
  };
});

const unitOverviewExplored = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      unitOverviewExplored: (...args: unknown[]) =>
        unitOverviewExplored(...args),
    },
  }),
}));

describe("/timetabling/units", () => {
  test("basic", async () => {
    (useFeatureFlag as jest.Mock).mockResolvedValue(true);
    const { baseElement } = renderWithTheme(
      await Page({
        params: Promise.resolve({ subjectPhaseSlug: "maths-primary" }),
      }),
    );
    expect(baseElement).toHaveTextContent("Your Maths timetable");
  });

  test("with name", async () => {
    (useFeatureFlag as jest.Mock).mockResolvedValue(true);
    mockUseSearchParams.mockReturnValue(new URLSearchParams("?name=Testing"));
    const { baseElement } = renderWithTheme(
      await Page({
        params: Promise.resolve({ subjectPhaseSlug: "maths-primary" }),
      }),
    );
    expect(baseElement).toHaveTextContent("Testing");
  });
});
