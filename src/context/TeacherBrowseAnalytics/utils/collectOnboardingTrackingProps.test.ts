import { OnboardingTrackingProps } from "../teacherBrowseAnalytics.types";

import { collectOnboardingTrackingProps } from "./collectOnboardingTrackingProps";

import { mockUser } from "@/__tests__/__helpers__/mockUser";
import { OnboardingFormProps } from "@/components/TeacherComponents/OnboardingForm/OnboardingForm.schema";
import { onboardingRoleOptions } from "@/components/TeacherComponents/OnboardingForm/onboardingActions/onboardingRoleOptions";
import { UserResource } from "clerk";

type EmailAddressResource = UserResource["emailAddresses"][0];

describe(collectOnboardingTrackingProps, () => {
  const submitEvent = new SubmitEvent("submit");

  it.each<
    [string, Partial<OnboardingFormProps>, Partial<OnboardingTrackingProps>]
  >([
    [
      "user",
      {},
      {
        signUpDate: "2024-10-07",
        userDetailsLastModifiedDate: "2024-10-08",
      },
    ],
    [
      "URN",
      {
        school: "123456-Grange Hill",
      },
      {
        teacherSchoolUrn: "123456",
      },
    ],
    ["works in school", { worksInSchool: true }, { userRoleType: "Teacher" }],
    [
      "works in school",
      { worksInSchool: false },
      { userRoleType: "Non Teacher" },
    ],
    [
      "role",
      {
        worksInSchool: false,
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
    [
      "manual school details",
      {
        manualSchoolName: "Grange Hill",
        schoolAddress: "London",
      },
      {
        teacherSchoolManualEntryDetails: {
          schoolNameText: "Grange Hill",
          schoolAddressText: "London",
        },
        teacherSchoolUrn: "000000",
      },
    ],
    [
      "NI IRN (they have a hyphen)",
      {
        school: "123-4567-Our Lady Immaculate College",
      },
      {
        teacherSchoolUrn: "123-4567",
      },
    ],
    [
      "Scottish URN (7 digits)",
      {
        school: "1234567-Glasgow High School",
      },
      {
        teacherSchoolUrn: "1234567",
      },
    ],
    [
      "improperly formatted school picker data",
      {
        school: "-School with no URN",
      },
      {
        teacherSchoolUrn: "000000",
      },
    ],
    [
      "invalid URN",
      {
        school: "undefined-School with no URN",
      },
      {
        teacherSchoolUrn: "000000",
      },
    ],
  ])("tracks %s %p with props %p", (_, testFormProps, trackingProperties) => {
    const props = collectOnboardingTrackingProps(
      mockUser,
      testFormProps as OnboardingFormProps,
      submitEvent,
    );

    expect(props).toEqual(expect.objectContaining(trackingProperties));
  });

  it.each<[string, UserResource, Partial<OnboardingTrackingProps>]>([
    [
      "verified email",
      {
        ...mockUser,
        emailAddresses: [
          { verification: { status: "verified" } } as EmailAddressResource,
        ],
      },
      {
        userAccountVerificationStatus: "verified",
      },
    ],
    [
      "unverified email",
      {
        ...mockUser,
        emailAddresses: [
          { verification: { status: "unverified" } } as EmailAddressResource,
        ],
      },
      {
        userAccountVerificationStatus: "awaiting-verification",
      },
    ],
    [
      "failed email verification",
      {
        ...mockUser,
        emailAddresses: [
          { verification: { status: "failed" } } as EmailAddressResource,
        ],
      },
      {
        userAccountVerificationStatus: "disabled",
      },
    ],
  ])("tracks %s %p with props %p", (_, user, trackingProperties) => {
    const props = collectOnboardingTrackingProps(
      user,
      {} as OnboardingFormProps,
      submitEvent,
    );

    expect(props).toEqual(expect.objectContaining(trackingProperties));
  });

  it("sets the componentType accordingly", () => {
    const submitter = document.createElement("button");
    const submitEvent = new SubmitEvent("submit", {
      submitter,
    });

    expect(
      collectOnboardingTrackingProps(
        mockUser,
        {} as OnboardingFormProps,
        submitEvent,
      ),
    ).toEqual(expect.objectContaining({ componentType: "continue_button" }));

    submitter.name = "skip";

    expect(
      collectOnboardingTrackingProps(
        mockUser,
        {} as OnboardingFormProps,
        submitEvent,
      ),
    ).toEqual(expect.objectContaining({ componentType: "skip_button" }));
  });
});
