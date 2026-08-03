import { screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import userEvent from "@testing-library/user-event";

import {
  ProgrammeDownloads,
  ProgrammeDownloadsProps,
} from "./ProgrammeDownloads";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { parseSubjectPhaseSlug } from "@/utils/curriculum/slugs";
import { createCurriculumDownloadsUrl } from "@/utils/curriculum/urls";
import { createYearData } from "@/fixtures/curriculum/yearData";
import { createUnit } from "@/fixtures/curriculum/unit";
import { CurriculumOverviewMVData } from "@/node-lib/curriculum-api-2023";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getProgrammeStateForProgramme } from "@/context/TeacherBrowseAnalytics/utils/getProgrammeState";

jest.mock("next/navigation");

(usePathname as jest.Mock).mockReturnValue("/");

const render = renderWithProvidersByName(["theme", "oakTheme"]);
const mvRefreshTime = 1721314874829;

const tiersMock = [
  { tier: "Foundation", tier_slug: "foundation" },
  { tier: "Higher", tier_slug: "higher" },
];

const childSubjectsMock = [
  {
    subject: "Combined science",
    subject_slug: "combined-science",
  },
  {
    subject: "Biology",
    subject_slug: "biology",
  },
  {
    subject: "Chemistry",
    subject_slug: "chemistry",
  },
  {
    subject: "Physics",
    subject_slug: "physics",
  },
];

const curriculumResourcesDownloadRefined = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      curriculumResourcesDownloadRefined: (...args: unknown[]) =>
        curriculumResourcesDownloadRefined(...args),
    },
    getSessionId: jest.fn(),
  }),
}));

jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(() => ({
    isLoaded: true,
    isSignedIn: false,
  })),
  useAuth: () => ({
    getToken: jest.fn().mockResolvedValue(null),
  }),
}));

jest.mock("@/components/SharedComponents/helpers/downloadFileFromUrl", () => ({
  downloadFileFromUrl: jest.fn(),
}));

jest.mock(
  "@/components/TeacherComponents/helpers/downloadAndShareHelpers/fetchHubspotContactDetails",
  () => ({
    fetchHubspotContactDetails: async () => {
      return {
        schoolId: "SCHOOL_ID",
        schoolName: "SCHOOL_NAME",
        email: "EMAIL",
      };
    },
  }),
);

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

const defaultProps = {
  curriculumSelectionSlugs: parseSubjectPhaseSlug("english-secondary-aqa")!,
  curriculumUnitsFormattedData: {
    yearOptions: [],
    threadOptions: [],
    keystages: [],
    yearData: {
      "7": createYearData({
        units: [createUnit({ slug: "test" })],
      }),
    },
  },
  curriculumDownloadsTabData: { tiers: [], child_subjects: [] },
  mvRefreshTime,
  curriculumInfo: {
    curriculaDesc: "",
    subjectTitle: "English",
    phaseTitle: "Secondary",
    examboardTitle: null,
    nonCurriculum: false,
  } satisfies CurriculumOverviewMVData,
};
const renderComponent = (overrides: Partial<ProgrammeDownloadsProps>) => {
  const programmeState = getProgrammeStateForProgramme({
    programmeSlug: "english-secondary-aqa",
    subjectSlug:
      overrides.curriculumSelectionSlugs?.subjectSlug ??
      defaultProps.curriculumSelectionSlugs.subjectSlug,
    subjectTitle: defaultProps.curriculumInfo.subjectTitle,
    phaseSlug: defaultProps.curriculumSelectionSlugs.phaseSlug,
    phaseTitle: defaultProps.curriculumInfo.phaseTitle,
  });
  return render(
    <TeacherBrowseAnalyticsStoreProvider programmeState={programmeState}>
      <ProgrammeDownloads {...defaultProps} {...overrides} />
    </TeacherBrowseAnalyticsStoreProvider>,
  );
};

describe("Programme Downloads", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Curriculum Downloads Tab: Secondary Maths", () => {
    test("user can see the tier selector for secondary maths", async () => {
      renderComponent({
        curriculumDownloadsTabData: {
          ...defaultProps.curriculumDownloadsTabData,
          tiers: tiersMock,
        },
      });
      const foundationTierRadioButton = screen.getByRole("radio", {
        name: "Foundation",
      });
      expect(foundationTierRadioButton).toBeInTheDocument();

      const higherTierRadioButton = screen.getByRole("radio", {
        name: "Higher",
      });
      expect(higherTierRadioButton).toBeInTheDocument();
    });
  });

  describe("Curriculum Downloads Tab: Secondary Science", () => {
    test("user can see the tiers and child subject selector for secondary science", async () => {
      const { findByTestId } = renderComponent({
        curriculumDownloadsTabData: {
          child_subjects: childSubjectsMock,
          tiers: tiersMock,
        },
        curriculumSelectionSlugs: parseSubjectPhaseSlug(
          "science-secondary-aqa",
        ),
      });
      const childSubjectSelector = await findByTestId("child-subject-selector");
      const tierSelector = await findByTestId("tier-selector");
      expect(childSubjectSelector).toBeInTheDocument();
      expect(tierSelector).toBeInTheDocument();
    });

    test("user can see the correct child subjects in the correct order", async () => {
      const { findAllByTestId } = renderComponent({
        curriculumDownloadsTabData: {
          child_subjects: childSubjectsMock,
          tiers: tiersMock,
        },
        curriculumSelectionSlugs: parseSubjectPhaseSlug(
          "science-secondary-aqa",
        ),
      });

      const childSubjectRadios = await findAllByTestId(
        "child-subject-radio-button",
      );
      expect(childSubjectRadios).toHaveLength(4);
      expect(childSubjectRadios[0]).toHaveAccessibleName("Combined science");
      expect(childSubjectRadios[1]).toHaveAccessibleName("Biology");
      expect(childSubjectRadios[2]).toHaveAccessibleName("Chemistry");
      expect(childSubjectRadios[3]).toHaveAccessibleName("Physics");
    });
  });
  describe("analytics: curriculumResourcesDownloadRefined", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("sends a tracking event when curriculum downloads are refined", async () => {
      const { findByTestId, findByText } = renderComponent({
        curriculumDownloadsTabData: {
          child_subjects: childSubjectsMock,
          tiers: tiersMock,
        },
        curriculumSelectionSlugs: parseSubjectPhaseSlug(
          "science-secondary-aqa",
        ),
      });

      const childSubjectSelector = await findByTestId("child-subject-selector");
      const tierSelector = await findByTestId("tier-selector");

      const user = userEvent.setup();
      await user.click(childSubjectSelector);
      await user.click(tierSelector);

      const nextButton = await findByText("Next step");
      await user.click(nextButton);

      expect(curriculumResourcesDownloadRefined).toHaveBeenCalledTimes(1);
      expect(curriculumResourcesDownloadRefined).toHaveBeenCalledWith({
        analyticsUseCase: "Teacher",
        childSubjectName: "Combined",
        childSubjectSlug: "combined-science",
        componentType: "download_tab",
        engagementIntent: "refine",
        eventVersion: "2.0.0",
        learningTier: "Foundation",
        platform: "owa",
        product: "teacher lesson resources",
        phase: "secondary",
        subjectSlug: "science",
        subjectTitle: "English",
      });
    });
  });
});

describe("Downloads tab: unit tests", () => {
  const mvRefreshTime = 1721314874829;
  test("URL is created properly: Science secondary AQA", async () => {
    const data = {
      mvRefreshTime: 1721314874829,
      subjectSlug: "science",
      phaseSlug: "secondary",
      ks4OptionSlug: "aqa",
      tierSlug: "foundation",
      childSubjectSlug: "combined-science",
    };
    const {
      mvRefreshTime,
      subjectSlug,
      phaseSlug,
      ks4OptionSlug,
      tierSlug,
      childSubjectSlug,
    } = data;
    const url = createCurriculumDownloadsUrl(
      ["curriculum-plans"],
      "published",
      mvRefreshTime,
      subjectSlug,
      phaseSlug,
      ks4OptionSlug,
      tierSlug,
      childSubjectSlug,
    );
    expect(url).toEqual(
      `/api/curriculum-downloads/?types=curriculum-plans&mvRefreshTime=1721314874829&subjectSlug=science&phaseSlug=secondary&state=published&ks4OptionSlug=aqa&tierSlug=foundation&childSubjectSlug=combined-science`,
    );
  });

  test("URL is created properly: English primary", async () => {
    const url = createCurriculumDownloadsUrl(
      ["curriculum-plans"],
      "published",
      mvRefreshTime,
      "english",
      "primary",
      null,
      null,
      null,
    );
    expect(url).toEqual(
      `/api/curriculum-downloads/?types=curriculum-plans&mvRefreshTime=1721314874829&subjectSlug=english&phaseSlug=primary&state=published`,
    );
  });
});
