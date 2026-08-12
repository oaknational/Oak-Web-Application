import { screen } from "@testing-library/dom";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSyncExternalStore } from "react";

import { ProgrammePageProps, ProgrammeView } from "./ProgrammeView";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { resolveOakHref } from "@/common-lib/urls";
import curriculumUnitsTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumUnits.fixture";
import { formatCurriculumUnitsData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import {
  curriculumOverviewCMSFixture,
  curriculumOverviewMVFixture,
} from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import {
  CurriculumSelectionSlugs,
  CurriculumSelectionTitles,
} from "@/utils/curriculum/slugs";

const subjectPhaseSlug = "science-secondary-aqa";

const pathnameSubscribers = new Set<() => void>();
const defaultProgrammePathname = resolveOakHref({
  page: "teacher-programme",
  subjectPhaseSlug,
  tab: "units",
});
let mockedPathname = defaultProgrammePathname;

const setMockedPathname = (nextPathname: string) => {
  act(() => {
    mockedPathname = nextPathname;
    pathnameSubscribers.forEach((subscriber) => subscriber());
  });
};

const usePathnameMock = jest.fn(() => {
  return useSyncExternalStore(
    (subscriber) => {
      pathnameSubscribers.add(subscriber);

      return () => {
        pathnameSubscribers.delete(subscriber);
      };
    },
    () => mockedPathname,
    () => mockedPathname,
  );
});
const useSearchParamsMock = jest.fn().mockReturnValue({ get: () => null });
const useRouterMock = jest.fn();
const mockUseFetchResult = { data: [], error: null, isLoading: false };

jest.mock("next/navigation", () => {
  return {
    __esModule: true,
    usePathname: () => usePathnameMock(),
    useSearchParams: () => useSearchParamsMock(),
    useRouter: () => useRouterMock,
    notFound: () => {
      throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
    },
  };
});

jest.mock(
  "@/components/TeacherComponents/ResourcePageSchoolPicker/useSchoolPicker",
  () => ({
    __esModule: true,
    default: () => ({
      schools: [],
      error: null,
      schoolPickerInputValue: "",
      setSchoolPickerInputValue: jest.fn(),
      selectedSchool: undefined,
      setSelectedSchool: jest.fn(),
    }),
  }),
);

jest.mock("@/hooks/useFetch", () => ({
  __esModule: true,
  useFetch: () => mockUseFetchResult,
}));

// Mock window history
let pushSpy: jest.SpyInstance;
beforeEach(() => {
  pushSpy = jest.spyOn(globalThis.history, "pushState");
  useSearchParamsMock.mockReturnValue({ get: () => null });
  setMockedPathname(defaultProgrammePathname);
});
afterEach(() => {
  pushSpy.mockRestore();
});

const defaultProps = {
  curriculumSelectionSlugs: {
    phaseSlug: "secondary",
    subjectSlug: "science",
    ks4OptionSlug: "aqa",
  } as CurriculumSelectionSlugs,
  curriculumSelectionTitles: {
    subjectTitle: "Science",
    phaseTitle: "Secondary",
    examboardTitle: "AQA",
  } as CurriculumSelectionTitles,
  subjectPhaseSlug,
  ks4Options: [],
  ks4OptionFilterDimensions: {},
  curriculumUnitsFormattedData: formatCurriculumUnitsData(
    curriculumUnitsTabFixture(),
  ),
  curriculumDownloadsTabData: {
    tiers: [],
    child_subjects: [],
  },
  mvRefreshTime: 0,
  nonCurriculum: curriculumOverviewMVFixture().nonCurriculum,
  curriculumCMSInfo: curriculumOverviewCMSFixture(),
  subjectPhaseSanityData: null,
  tabSlug: "units" as const,
  trackingData: {
    phaseSlug: "secondary",
    subjectSlug: "maths",
    ks4OptionSlug: "aqa",
    subjectTitle: "Science",
    ks4OptionTitle: "AQA",
  },
  featureFlags: {},
  implementationGuides: {},
};

const lightweightUnitsProps = {
  ...defaultProps,
  curriculumUnitsFormattedData: formatCurriculumUnitsData(
    curriculumUnitsTabFixture({
      units: curriculumUnitsTabFixture().units.slice(0, 1),
    }),
  ),
};

const renderProgrammeView = (props?: Partial<ProgrammePageProps>) => {
  return renderWithProviders()(<ProgrammeView {...defaultProps} {...props} />);
};

describe("ProgrammeView", () => {
  it("renders the programme header", () => {
    renderWithProviders()(<ProgrammeView {...defaultProps} />);
    const heading = screen.getByRole("heading", {
      name: "Science secondary AQA",
    });
    expect(heading).toBeInTheDocument();
  });
  it("highlights the correct tab", () => {
    renderProgrammeView({ ...lightweightUnitsProps });
    const unitsTab = screen.getByRole("link", { name: "Unit sequence" });
    expect(unitsTab).toHaveStyle("background: #bef2bd");

    const overviewTab = screen.getByRole("link", { name: "Explainer" });
    expect(overviewTab).toHaveStyle("background: #222222");
  });
  it("renders the correct tab content for units", () => {
    renderProgrammeView();
    const heading = screen.getByRole("heading", { name: "Year 7 units" });
    expect(heading).toBeInTheDocument();
  });
  it("renders the correct tab content for overview", () => {
    setMockedPathname(
      resolveOakHref({
        page: "teacher-programme",
        subjectPhaseSlug,
        tab: "curriculum-explainer",
      }),
    );
    renderProgrammeView({ tabSlug: "curriculum-explainer" });
    const heading = screen.getByRole("heading", { name: "Aims and purpose" });
    expect(heading).toBeInTheDocument();
  });
  it("renders the correct tab content for download", () => {
    setMockedPathname(
      resolveOakHref({
        page: "teacher-programme",
        subjectPhaseSlug,
        tab: "download",
      }),
    );
    renderProgrammeView({ tabSlug: "download" });
    const content = screen.getByText("Download curriculum resources");
    expect(content).toBeInTheDocument();
  });
  it("navigates on tab click", async () => {
    renderProgrammeView({ ...lightweightUnitsProps });
    const overviewTabButton = screen.getByRole("link", { name: "Explainer" });
    const user = userEvent.setup({ delay: null });
    await user.click(overviewTabButton);
    expect(pushSpy).toHaveBeenCalledWith(null, "", "curriculum-explainer");
  });

  it("preserves the keystages param when present", async () => {
    useSearchParamsMock.mockReturnValue({
      get: (key: string) => (key === "keystages" ? "ks4" : null),
    });
    renderProgrammeView({ ...lightweightUnitsProps });
    const overviewTabButton = screen.getByRole("link", { name: "Explainer" });

    const user = userEvent.setup({ delay: null });
    await user.click(overviewTabButton);
    expect(pushSpy).toHaveBeenCalledWith(
      null,
      "",
      "curriculum-explainer?keystages=ks4",
    );
  });

  it("strips the subject category from heading when navigating away from units tab", async () => {
    const englishCategoryId = 101;
    const baseUnit = curriculumUnitsTabFixture().units[0]!;
    const englishProps = {
      ...defaultProps,
      curriculumSelectionSlugs: {
        phaseSlug: "primary",
        subjectSlug: "english",
        ks4OptionSlug: null,
      } satisfies CurriculumSelectionSlugs,
      curriculumSelectionTitles: {
        subjectTitle: "English",
        phaseTitle: "Primary",
        examboardTitle: undefined,
      } satisfies CurriculumSelectionTitles,
      curriculumUnitsFormattedData: formatCurriculumUnitsData(
        curriculumUnitsTabFixture({
          units: [
            {
              ...baseUnit,
              phase: "Primary",
              phase_slug: "primary",
              keystage_slug: "ks2",
              year: "3",
              subject: "English",
              subject_slug: "english",
              subject_parent: null,
              subject_parent_slug: null,
              subjectcategories: [
                {
                  id: englishCategoryId,
                  slug: "reading-writing-oracy",
                  title: "Reading, writing & oracy",
                },
              ],
              actions: {
                subject_category_actions: {
                  group_by_subjectcategory: true,
                },
              },
              features: {
                subjectcategories: {
                  default_category_id: englishCategoryId,
                },
              },
            },
          ],
        }),
      ),
    };
    renderProgrammeView({ ...englishProps });
    const heading = screen.getByRole("heading", {
      name: "English: Reading, writing & oracy primary",
    });
    expect(heading).toBeInTheDocument();
    const overviewTabButton = screen.getByRole("link", { name: "Explainer" });

    const user = userEvent.setup({ delay: null });
    await user.click(overviewTabButton);

    setMockedPathname(
      resolveOakHref({
        page: "teacher-programme",
        subjectPhaseSlug,
        tab: "curriculum-explainer",
      }),
    );

    await screen.findByRole("heading", {
      name: "English primary",
    });
  });

  describe("non-curriculum subjects", () => {
    const nonCurriculumProps = {
      ...defaultProps,
      nonCurriculum: true,
      curriculumCMSInfo: null,
    };

    it("does not render tabs", () => {
      renderProgrammeView({ ...nonCurriculumProps });
      expect(screen.queryByTestId("programme-tabs")).not.toBeInTheDocument();
    });

    it("calls notFound when the overview tab is active", () => {
      expect(() =>
        renderProgrammeView({
          ...nonCurriculumProps,
          tabSlug: "curriculum-explainer",
        }),
      ).toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    });
  });

  describe("initialFilter prop (SSR filter resolution)", () => {
    beforeEach(() => {
      setMockedPathname(
        resolveOakHref({
          page: "teacher-programme",
          subjectPhaseSlug,
          tab: "units",
        }),
      );
    });

    it("accepts initialFilter prop without error", () => {
      const initialFilter = {
        years: ["7"],
        tiers: ["foundation"],
        childSubjects: [],
        subjectCategories: [],
        threads: [],
        pathways: [],
        keystages: [],
      };
      renderProgrammeView({ initialFilter });
      const heading = screen.getByRole("heading", {
        name: "Science secondary AQA",
      });
      expect(heading).toBeInTheDocument();
    });

    it("renders correctly with initialFilter for a single year", () => {
      const initialFilter = {
        years: ["7"],
        tiers: ["foundation"],
        childSubjects: [],
        subjectCategories: [],
        threads: [],
        pathways: [],
        keystages: [],
      };

      renderProgrammeView({ initialFilter });
      // The heading should reflect the single year selection
      const heading = screen.getByRole("heading", { name: "Year 7 units" });
      expect(heading).toBeInTheDocument();
    });

    it("gracefully falls back when initialFilter is not provided", () => {
      renderProgrammeView();
      const heading = screen.getByRole("heading", { name: "Year 7 units" });
      expect(heading).toBeInTheDocument();
    });
  });

  describe("search param validation", () => {
    beforeEach(() => {
      usePathnameMock.mockReturnValue(
        resolveOakHref({
          page: "teacher-programme",
          subjectPhaseSlug,
          tab: "units",
        }),
      );
    });

    it("ignores invalid years param in heading", () => {
      useSearchParamsMock.mockReturnValue({
        get: (key: string) => (key === "years" ? "invalid" : null),
      });
      renderProgrammeView();
      const heading = screen.getByRole("heading", {
        name: "Science secondary AQA",
      });
      expect(heading).toBeInTheDocument();
    });

    it("ignores invalid keystages param in heading", () => {
      useSearchParamsMock.mockReturnValue({
        get: (key: string) => (key === "keystages" ? "invalid" : null),
      });
      renderProgrammeView();
      const heading = screen.getByRole("heading", {
        name: "Science secondary AQA",
      });
      expect(heading).toBeInTheDocument();
    });
  });
});
