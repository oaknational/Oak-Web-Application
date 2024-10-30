import { useUser } from "@clerk/nextjs";

import { OnboardingFormProps } from "../OnboardingForm.schema";
import { extractUrnAndSchool } from "../../helpers/downloadAndShareHelpers/getFormattedDetailsForTracking";

import {
  onboardingRoleOptions,
  OnboardingRoleValue,
} from "./onboardingRoleOptions";

import {
  ComponentTypeValueType,
  UserAccountVerificationStatusValueType,
  UserOnboardingCompletedProperties,
  UserOnboardingProgressedProperties,
  UserRoleTypeValueType,
} from "@/browser-lib/avo/Avo";
import { UserResource } from "clerk";

/* Reported for manually entered schools or as a fallback when the URN cannot be extracted
from the school picker data */
const DUMMY_URN = "000000";

/**
 * Produces onboarding tracking properties from the user and onboarding form
 */
export function collectOnboardingTrackingProps(
  distinctUserId: string,
  user: NonNullable<ReturnType<typeof useUser>["user"]>,
  data: OnboardingFormProps,
  nativeEvent: object | undefined,
): UserOnboardingCompletedProperties & UserOnboardingProgressedProperties {
  const signUpDate = (user.createdAt ?? new Date())?.toISOString().slice(0, 10);
  const userDetailsLastModifiedDate = (user.updatedAt ?? new Date())
    .toISOString()
    .slice(0, 10);

  return {
    platform: "owa",
    product: "user account management",
    engagementIntent: "explore",
    componentType: pickComponentType(nativeEvent),
    eventVersion: "2.0.0",
    analyticsUseCase: "Teacher",
    userId_: distinctUserId,
    signUpDate,
    userRoleType: pickUserRole(data),
    teacherSchoolUrn: pickSchoolUrn(data),
    teacherSchoolManualEntryDetails:
      "manualSchoolName" in data
        ? {
            schoolNameText: data.manualSchoolName,
            schoolAddressText: data.schoolAddress,
          }
        : null,
    userDefinedRole: pickUserDefinedRole(data),
    userDetailsLastModifiedDate,
    userAccountVerificationStatus: pickVerificationStatus(user),
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

  if ("worksInSchool" in data) {
    return data.worksInSchool ? "Teacher" : "Non Teacher";
  }

  return null;
}

function pickVerificationStatus(
  user: UserResource,
): UserAccountVerificationStatusValueType {
  const verificationStatuses = user.emailAddresses.map(
    (address) => address.verification.status,
  );

  switch (true) {
    case verificationStatuses.includes("verified"):
      return "verified";
    case verificationStatuses.includes("failed"):
      return "disabled";
    default:
      return "awaiting-verification";
  }
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
  if ("role" in data && data.role === onboardingRoleOptions.other) {
    return data.other ?? null;
  }

  return null;
}

function pickSchoolUrn(data: OnboardingFormProps) {
  if ("school" in data) {
    return extractUrnAndSchool(data.school).urn ?? DUMMY_URN;
  }

  if ("manualSchoolName" in data) {
    return DUMMY_URN;
  }

  return null;
}

/**
 * Maps the form submitter element's name to an event component type
 */
function pickComponentType(
  nativeEvent: object | undefined,
): ComponentTypeValueType {
  let buttonName = "continue";

  if (
    nativeEvent instanceof SubmitEvent &&
    nativeEvent.submitter instanceof HTMLButtonElement
  ) {
    buttonName = nativeEvent.submitter.name;
  }

  if (buttonName === "skip") {
    return "skip_button";
  }

  return "continue_button";
}
