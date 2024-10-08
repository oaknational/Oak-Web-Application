import { OnboardingFormProps } from "../OnboardingForm.schema";

import { onboardingRoleOptions } from "./onboardingRoleOptions";
import {
  trackUserOnboardingProgressed,
  trackUserOnboardingCompleted,
} from "./trackOnboarding";

import OakError from "@/errors/OakError";
import { mockUser } from "@/__tests__/__helpers__/mockUser";
import { UserOnboardingProgressedProperties } from "@/browser-lib/avo/Avo";

const reportError = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

describe(trackUserOnboardingProgressed, () => {
  it.each<
    [
      string,
      Partial<OnboardingFormProps>,
      Partial<UserOnboardingProgressedProperties>,
    ]
  >([
    [
      "user",
      {},
      {
        signUpDate: "2024-10-07",
        userDetailsLastModifiedDate: "2024-10-08",
        userId_: "user-123",
      },
    ],
    [
      "URN",
      {
        school: "123456",
      },
      {
        teacherSchoolUrn: "123456",
      },
    ],
    [
      "role",
      {
        role: onboardingRoleOptions["teacher-trainer"],
      },
      {
        userRoleType: "Teacher Training Professional",
      },
    ],
    [
      "user defined role",
      {
        role: onboardingRoleOptions.other,
        other: "Troop leader",
      },
      {
        userRoleType: "Other",
        userDefinedRole: "Troop leader",
      },
    ],
  ])("tracks %s %p with props %p", (_, testFormProps, trackingProperties) => {
    const trackSpy = jest.fn();

    trackUserOnboardingProgressed(
      trackSpy,
      mockUser,
      testFormProps as OnboardingFormProps,
    );

    expect(trackSpy).toHaveBeenCalledWith(
      expect.objectContaining(trackingProperties),
    );
  });
});

describe(trackUserOnboardingCompleted, () => {
  it.each<
    [
      string,
      Partial<OnboardingFormProps>,
      Partial<UserOnboardingProgressedProperties>,
    ]
  >([
    [
      "user",
      {
        role: onboardingRoleOptions["teacher-training"],
      },
      {
        signUpDate: "2024-10-07",
        userDetailsLastModifiedDate: "2024-10-08",
        userId_: "user-123",
      },
    ],
    [
      "URN",
      {
        role: onboardingRoleOptions["teacher-training"],
        school: "123456",
      },
      {
        teacherSchoolUrn: "123456",
      },
    ],
    [
      "role",
      {
        role: onboardingRoleOptions["teacher-trainer"],
      },
      {
        userRoleType: "Teacher Training Professional",
      },
    ],
    [
      "user defined role",
      {
        role: onboardingRoleOptions.other,
        other: "Troop leader",
      },
      {
        userRoleType: "Other",
        userDefinedRole: "Troop leader",
      },
    ],
  ])("tracks %s %p with props %p", (_, testFormProps, trackingProperties) => {
    const trackSpy = jest.fn();

    trackUserOnboardingCompleted(
      trackSpy,
      mockUser,
      testFormProps as OnboardingFormProps,
    );

    expect(trackSpy).toHaveBeenCalledWith(
      expect.objectContaining(trackingProperties),
    );
  });

  it("reports an error when `role` is missing", () => {
    reportError.mockReset();
    const trackSpy = jest.fn();

    trackUserOnboardingCompleted(trackSpy, mockUser, {} as OnboardingFormProps);

    expect(reportError).toHaveBeenCalledWith(expect.any(OakError));
    expect(trackSpy).not.toHaveBeenCalled();
  });
});
