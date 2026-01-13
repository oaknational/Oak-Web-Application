import ProgrammePage from "@/app/(core)/programmes/[subjectPhaseSlug]/page";
import { createUnit } from "@/fixtures/curriculum/unit";
import { curriculumOverviewMVFixture } from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

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

const featureFlagMock = jest.fn().mockResolvedValue(false);
jest.mock("@/utils/featureFlags", () => ({
  getFeatureFlagValue: () => featureFlagMock(),
}));

jest.mock("@/node-lib/cms", () => ({
  __esModule: true,
  default: {
    curriculumOverviewPage: async () => jest.fn(),
  },
}));

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  curriculumSequence: () =>
    jest.fn().mockResolvedValue({
      units: [createUnit({ slug: "test" })],
    })(),
  curriculumPhaseOptions: jest.fn().mockResolvedValue([
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
  ]),
  curriculumOverview: () =>
    jest.fn().mockResolvedValue(curriculumOverviewMVFixture())(),
  refreshedMVTime: jest.fn().mockResolvedValue({}),
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const render = renderWithProviders();

describe("Programme page", () => {
  it("renders 404 page if feature flag is disabled", async () => {
    expect(async () =>
      render(
        await ProgrammePage({
          params: Promise.resolve({ subjectPhaseSlug: "maths-primary" }),
        }),
      ),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
  it("renders when the feature flag is enabled", async () => {
    featureFlagMock.mockResolvedValue(true);
    const { getByText } = render(
      await ProgrammePage({
        params: Promise.resolve({ subjectPhaseSlug: "maths-primary" }),
      }),
    );

    const title = getByText("Unit sequence");
    expect(title).toBeInTheDocument();
  });
  it("returns 404 page if params are invalid", async () => {
    featureFlagMock.mockResolvedValue(true);
    expect(async () =>
      render(
        await ProgrammePage({
          params: Promise.resolve({ subjectPhaseSlug: "fake-slug" }),
        }),
      ),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
});
