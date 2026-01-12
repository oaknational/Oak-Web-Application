import Page from "./page";

import { getFeatureFlagValue } from "@/utils/featureFlags";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

jest.mock("@/utils/featureFlags");
jest.mock("@/node-lib/curriculum-api-2023");

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
  beforeEach(() => {
    (curriculumApi2023.curriculumPhaseOptions as jest.Mock).mockResolvedValue([
      { slug: "maths", title: "Maths", phases: [] },
      { slug: "religious-education", title: "Religious Education", phases: [] },
    ]);
  });

  test("basic", async () => {
    (getFeatureFlagValue as jest.Mock).mockResolvedValue(true);
    const { baseElement } = renderWithTheme(
      await Page({
        params: Promise.resolve({ subjectPhaseSlug: "maths-primary" }),
      }),
    );
    expect(baseElement).toHaveTextContent("Create your maths year 1 timetable");
  });

  test("displays proper subject title for multi-word subjects", async () => {
    (getFeatureFlagValue as jest.Mock).mockResolvedValue(true);
    const { baseElement } = renderWithTheme(
      await Page({
        params: Promise.resolve({
          subjectPhaseSlug: "religious-education-primary",
        }),
      }),
    );
    expect(baseElement).toHaveTextContent(
      "Create your religious education year 1 timetable",
    );
  });
});
