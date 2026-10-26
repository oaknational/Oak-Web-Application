import { renderHook } from "@testing-library/react";

import { useComplexCopyright } from "./useComplexCopyright";

import {
  mockGeorestrictedUser,
  mockLoadingUser,
  mockLoggedIn,
  mockLoggedOut,
  mockNotOnboardedUser,
  mockUserWithDownloadAccess,
} from "@/__tests__/__helpers__/mockUser";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import type { UseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { useProgrammeState } from "@/context/TeacherBrowseAnalytics/hooks/useProgrammeState";
import { getProgrammeStateForProgramme } from "@/context/TeacherBrowseAnalytics/utils/getProgrammeState";
import teachersUnitOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersUnitOverview.fixture";

jest.mock("@/context/TeacherBrowseAnalytics/hooks/useProgrammeState", () => ({
  useProgrammeState: jest.fn(),
}));

const mockUseProgrammeState = jest.mocked(useProgrammeState);
const musicProgrammeState = getProgrammeStateForProgramme(
  teachersUnitOverviewFixture({ subjectSlug: "music" }),
);

const scenarios: {
  name: string;
  user: UseUserReturn;
  loginRequired: boolean;
  geoRestricted: boolean;
  isMusic?: boolean;
  expected: ReturnType<typeof useComplexCopyright>;
}[] = [
  {
    name: "requires sign-in for a signed-out user",
    user: mockLoggedOut,
    loginRequired: true,
    geoRestricted: false,
    expected: {
      showSignedOutLoginRequired: true,
      showSignedOutGeoRestricted: false,
      showSignedInNotOnboarded: false,
      showGeoBlocked: false,
      isLoaded: true,
      isResourceGeorestricted: false,
    },
  },
  {
    name: "shows the geo-restriction message to a signed-out user",
    user: mockLoggedOut,
    loginRequired: false,
    geoRestricted: true,
    expected: {
      showSignedOutLoginRequired: false,
      showSignedOutGeoRestricted: true,
      showSignedInNotOnboarded: false,
      showGeoBlocked: false,
      isLoaded: true,
      isResourceGeorestricted: true,
    },
  },
  {
    name: "blocks an onboarded user without regional access",
    user: mockGeorestrictedUser,
    loginRequired: false,
    geoRestricted: true,
    expected: {
      showSignedOutLoginRequired: false,
      showSignedOutGeoRestricted: false,
      showSignedInNotOnboarded: false,
      showGeoBlocked: true,
      isLoaded: true,
      isResourceGeorestricted: true,
    },
  },
  {
    name: "does not block an onboarded user with regional access",
    user: { ...mockLoggedIn, user: mockUserWithDownloadAccess },
    loginRequired: false,
    geoRestricted: true,
    expected: {
      showSignedOutLoginRequired: false,
      showSignedOutGeoRestricted: false,
      showSignedInNotOnboarded: false,
      showGeoBlocked: false,
      isLoaded: true,
      isResourceGeorestricted: true,
    },
  },
  {
    name: "prompts a signed-in user who has not completed onboarding",
    user: mockNotOnboardedUser,
    loginRequired: true,
    geoRestricted: false,
    expected: {
      showSignedOutLoginRequired: false,
      showSignedOutGeoRestricted: false,
      showSignedInNotOnboarded: true,
      showGeoBlocked: false,
      isLoaded: true,
      isResourceGeorestricted: false,
    },
  },
  {
    name: "treats music as geo-restricted even when the prop is false",
    user: mockLoggedOut,
    loginRequired: false,
    geoRestricted: false,
    isMusic: true,
    expected: {
      showSignedOutLoginRequired: true,
      showSignedOutGeoRestricted: true,
      showSignedInNotOnboarded: false,
      showGeoBlocked: false,
      isLoaded: true,
      isResourceGeorestricted: true,
    },
  },
  {
    name: "requires login for music even when the prop is false",
    user: mockLoggedOut,
    loginRequired: false,
    geoRestricted: false,
    isMusic: true,
    expected: {
      showSignedOutLoginRequired: true,
      showSignedOutGeoRestricted: true,
      showSignedInNotOnboarded: false,
      showGeoBlocked: false,
      isLoaded: true,
      isResourceGeorestricted: true,
    },
  },
  {
    name: "shows onboarding required for music even when the prop is false",
    user: mockNotOnboardedUser,
    loginRequired: false,
    geoRestricted: false,
    isMusic: true,
    expected: {
      showSignedOutLoginRequired: false,
      showSignedOutGeoRestricted: false,
      showSignedInNotOnboarded: true,
      showGeoBlocked: false,
      isLoaded: true,
      isResourceGeorestricted: true,
    },
  },
  {
    name: "reports the loading state",
    user: mockLoadingUser,
    loginRequired: false,
    geoRestricted: false,
    expected: {
      showSignedOutLoginRequired: false,
      showSignedOutGeoRestricted: false,
      showSignedInNotOnboarded: false,
      showGeoBlocked: false,
      isLoaded: false,
      isResourceGeorestricted: false,
    },
  },
];

describe("useComplexCopyright", () => {
  beforeEach(() => {
    mockUseProgrammeState.mockReturnValue({
      currentHref: null,
      lessonState: null,
      unitState: null,
      coreProgrammeState: null,
    });
  });

  it.each(scenarios)("$name", (scenario) => {
    setUseUserReturn(scenario.user);
    if (scenario.isMusic) {
      mockUseProgrammeState.mockReturnValue({
        currentHref: null,
        lessonState: null,
        unitState: null,
        coreProgrammeState: musicProgrammeState,
      });
    }

    const { result } = renderHook(() =>
      useComplexCopyright({
        loginRequired: scenario.loginRequired,
        geoRestricted: scenario.geoRestricted,
      }),
    );

    expect(result.current).toEqual(scenario.expected);
  });
});
