import { useUser } from "@clerk/nextjs";

import { OnboardingFormProps } from "../OnboardingForm.schema";

import {
  onboardingRoleOptions,
  OnboardingRoleValue,
} from "./onboardingRoleOptions";

import {
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
  user: NonNullable<ReturnType<typeof useUser>["user"]>,
  data: OnboardingFormProps,
): UserOnboardingCompletedProperties & UserOnboardingProgressedProperties {
  const signUpDate = (user.createdAt ?? new Date())?.toISOString().slice(0, 10);
  const userDetailsLastModifiedDate = (user.updatedAt ?? new Date())
    .toISOString()
    .slice(0, 10);

  return {
    platform: "owa",
    product: "user account management",
    engagementIntent: "explore",
    componentType: "continue_button",
    eventVersion: "2.0.0",
    analyticsUseCase: "Teacher",
    userId_: user.id,
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
    return extractUrn(data.school) ?? DUMMY_URN;
  }

  if ("manualSchoolName" in data) {
    return DUMMY_URN;
  }

  return null;
}

/**
 * Pulls the URN/IRN from the school picker output
 *
 * English and Welsh URNs are 6 digits
 * NI IRNs include a hypen `999-9999`
 * Scottish URNs are 7 digits
 */
function extractUrn(school: string) {
  return /^\d{6,7}|^\d{3}-\d{4}/.exec(school)?.at(0);
}
