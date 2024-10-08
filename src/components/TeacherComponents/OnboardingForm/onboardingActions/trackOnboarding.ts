import { useUser } from "@clerk/nextjs";

import { OnboardingFormProps } from "../OnboardingForm.schema";

import {
  onboardingRoleOptions,
  OnboardingRoleValue,
} from "./onboardingRoleOptions";

import Avo, {
  AnalyticsUseCaseValueType,
  ComponentTypeValueType,
  EngagementIntentValueType,
  EventVersionValueType,
  PlatformValueType,
  ProductValueType,
  UserAccountVerificationStatusValueType,
  UserRoleTypeValueType,
} from "@/browser-lib/avo/Avo";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

const reportError = errorReporter("trackOnboarding");

type UserResource = NonNullable<ReturnType<typeof useUser>["user"]>;

type CommonTrackingProps = {
  platform: PlatformValueType;
  product: ProductValueType;
  engagementIntent: EngagementIntentValueType;
  componentType: ComponentTypeValueType;
  eventVersion: EventVersionValueType;
  analyticsUseCase: AnalyticsUseCaseValueType;
  userId_: string;
  signUpDate: string;
  userRoleType: UserRoleTypeValueType | null;
  teacherSchoolUrn: string | null;
  userDefinedRole: string | null;
  userDetailsLastModifiedDate: string;
  userAccountVerificationStatus: UserAccountVerificationStatusValueType;
};

/**
 * Tracks the user's progress through the onboarding journey
 */
export function trackUserOnboardingProgressed(
  track: typeof Avo.userOnboardingProgressed,
  user: UserResource,
  data: OnboardingFormProps,
) {
  return track(collectOnboardingProps(user, data));
}

/**
 * Tracks when the user completes onboarding
 */
export function trackUserOnboardingCompleted(
  track: typeof Avo.userOnboardingCompleted,
  user: UserResource,
  data: OnboardingFormProps,
) {
  const { userRoleType, ...trackingProps } = collectOnboardingProps(user, data);

  // Guard against `userRoleType` being `null`. This shouldn't be possible with our current
  // implementation, but the types allow for it
  if (userRoleType === null) {
    reportError(
      new OakError({
        code: "onboarding/tracking",
        originalError: new TypeError(
          "`userRoleType` is null but required by `userOnboardingCompleted`",
        ),
        meta: data,
      }),
    );
    return;
  }

  track({ ...trackingProps, userRoleType });
}

function collectOnboardingProps(
  user: UserResource,
  data: OnboardingFormProps,
): CommonTrackingProps {
  const signUpDate = (user.createdAt ?? new Date())?.toISOString().slice(0, 10);
  const userDetailsLastModifiedDate = (user.updatedAt ?? new Date())
    .toISOString()
    .slice(0, 10);

  return {
    platform: "owa",
    product: "teacher lesson resources",
    engagementIntent: "explore",
    componentType: "continue_button",
    eventVersion: "2.0.0",
    analyticsUseCase: "Teacher",
    userId_: user.id,
    signUpDate,
    userRoleType: pickUserRole(data),
    teacherSchoolUrn: "school" in data ? data.school : null,
    userDefinedRole: pickUserDefinedRole(data),
    userDetailsLastModifiedDate,
    userAccountVerificationStatus: "verified",
  };
}

function isValidRoleOption(value: unknown): value is OnboardingRoleValue {
  return Object.values(onboardingRoleOptions).includes(
    value as OnboardingRoleValue,
  );
}

function pickUserRole(data: OnboardingFormProps): UserRoleTypeValueType | null {
  if ("role" in data && isValidRoleOption(data.role)) {
    return mapOnboardingUserRole(data.role);
  }

  if ("worksInSchool" in data && data.worksInSchool) {
    return "Teacher";
  }

  return null;
}

function mapOnboardingUserRole(
  roleValue: OnboardingRoleValue,
): UserRoleTypeValueType {
  switch (roleValue) {
    case onboardingRoleOptions["adult-helping-child"]:
      return "Adult (Other)";
    case onboardingRoleOptions["mat-or-lea"]:
      return "LEA/MAT Professional";
    case onboardingRoleOptions["private-tutor"]:
      return "Private Tutor";
    case onboardingRoleOptions["nonprofit"]:
      return "Educational Not-for-Profit Professional";
    case onboardingRoleOptions["teacher-training"]:
      return "Trainee Teacher";
    case onboardingRoleOptions["teacher-trainer"]:
      return "Teacher Training Professional";
    case onboardingRoleOptions["other"]:
      return "Other";
  }
}

function pickUserDefinedRole(data: OnboardingFormProps) {
  if (
    "role" in data &&
    data.role === onboardingRoleOptions.other &&
    "other" in data
  ) {
    return data.other ?? null;
  }

  return null;
}
