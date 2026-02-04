import {
  OakFlex,
  OakHeading,
  OakInlineBanner,
  OakInlineRegistrationBanner,
  OakLink,
  OakP,
  OakPrimaryButton,
} from "@oaknational/oak-components";
import * as React from "react";
import { FC } from "react";

import { UnitListProps } from "./UnitList";

import { useNewsletterForm } from "@/components/GenericPagesComponents/NewsletterForm";
import { UnitsSectionData } from "@/pages/pupils/programmes/[programmeSlug]/units";

const CYCLE_2_SUBJECTS = new Set([
  "art",
  "computing",
  "design-technology",
  "geography",
  "french",
  "german",
  "spanish",
  "music",
  "physical-education",
  "religious-education",
  "rshe-pshe",
]);

export type UnitListLegacyBannerProps = {
  hasNewUnits: boolean;
  subjectSlug: string;
  allLegacyUnits: UnitListProps["currentPageItems"] | UnitsSectionData["units"];

  userType: "teacher" | "pupil";
  onButtonClick?: () => void;
};
export const UnitListLegacyBanner: FC<UnitListLegacyBannerProps> = ({
  hasNewUnits,
  subjectSlug,
  allLegacyUnits,
  userType,
  onButtonClick,
}) => {
  const newsletterFormProps = useNewsletterForm();

  // Show the take down notice banner on all cycle 2 subjects with legacy units
  const shouldShowCycle2RemovalBanner =
    CYCLE_2_SUBJECTS.has(subjectSlug) && allLegacyUnits.length > 0;

  // If any legacy units have the displayExpiringBanner action, show the banner
  const shouldShowAnExpiringBanner = allLegacyUnits.some((unit) =>
    unit?.some(
      (unitItem) => unitItem.actions && unitItem.actions?.displayExpiringBanner,
    ),
  );

  if (!shouldShowAnExpiringBanner && !shouldShowCycle2RemovalBanner) {
    return <></>;
  }

  const getBannerCopy = (): {
    headerText: React.ReactNode;
    bodyText: React.ReactNode;
  } => {
    switch (true) {
      case hasNewUnits &&
        userType === "teacher" &&
        shouldShowCycle2RemovalBanner:
        // Teacher pages, cycle 2 legacy units are being taken down
        return {
          headerText:
            "These resources will be removed by the end of the Spring Term 2026.",
          bodyText: (
            <OakP>
              Start using our brand new teaching resources now. Designed by
              teachers and subject experts, with real classrooms in mind. The
              older resources below were created for lockdown learning during
              the pandemic and are not designed for classroom teaching.
            </OakP>
          ),
        };
      case hasNewUnits && userType === "teacher" && shouldShowAnExpiringBanner:
        // Teacher pages, cycle 1 legacy unit is being removed but new units exist
        return {
          headerText:
            "These resources were made for remote use during the pandemic, not classroom teaching.",
          bodyText: (
            <OakP>
              Switch to our new teaching resources now - designed by teachers
              and leading subject experts, and tested in classrooms.
            </OakP>
          ),
        };
      case hasNewUnits && userType === "pupil" && shouldShowCycle2RemovalBanner:
        // Pupil pages, cycle 2 legacy units are being taken down
        return {
          headerText:
            "These lessons will be removed by the end of Spring Term 2026.",
          bodyText: "We’ve made brand new and improved lessons for you.",
        };
      case hasNewUnits && userType === "pupil" && shouldShowAnExpiringBanner:
        // Pupil pages, cycle 1 legacy unit is being removed but new units exist
        return {
          headerText:
            "These lessons were made for home learning during the pandemic.",
          bodyText: (
            <OakP>
              Scroll up to take a look at the brand-new and improved resources
              we've made for you.
            </OakP>
          ),
        };
      case !hasNewUnits && userType === "pupil":
        // Pupil pages, legacy unit is being removed but no new units exist
        return {
          headerText: "New units on the way!",
          bodyText: (
            <>
              <OakP>
                These resources were made for remote use during the pandemic,
                not classroom teaching.
              </OakP>
              <OakP $mt={"spacing-24"}>
                We're busy creating new lessons for you.
              </OakP>
            </>
          ),
        };
      default:
        // Teacher pages, legacy unit is being removed but no new units exist
        return {
          headerText: (
            <OakHeading
              tag="h2"
              $font={["heading-5", "heading-4", "heading-4"]}
            >
              New units on the way!
            </OakHeading>
          ),
          bodyText: (
            <>
              <OakP>
                These resources were made for remote use during the pandemic,
                not classroom teaching.
              </OakP>
              <OakP>
                We have been busy creating new units. We'll let you know when
                they are ready -and send you other helpful content and
                resources. Unsubscribe at any time. Read our{" "}
                <OakLink href="https://www.thenational.academy/legal/privacy-policy">
                  privacy policy
                </OakLink>
              </OakP>
            </>
          ),
        };
    }
  };

  // Capture emails for newsletter if user is a teacher and no new units exist
  const shouldUseEmailCapture = userType === "teacher" && !hasNewUnits;
  const { headerText, bodyText } = getBannerCopy();

  if (shouldUseEmailCapture) {
    return (
      <OakInlineRegistrationBanner
        headerText={headerText}
        bodyText={bodyText}
        onSubmit={(email) => {
          const emailPattern =
            /^[A-Z0-9._%+-]{1,64}@[A-Z0-9-]+(?:\.[A-Z0-9-]+){0,2}\.[A-Z]{2,64}$/i;
          const isValidEmail = emailPattern.test(email);
          if (!isValidEmail) {
            throw new Error("Please enter a valid email address");
          }
          return newsletterFormProps.onSubmit({
            email,
            userRole: "Teacher",
          });
        }}
      />
    );
  }

  return (
    <OakInlineBanner
      isOpen={true}
      message={bodyText}
      title={headerText?.toString()}
      $width={"100%"}
      type={"warning"}
      variant={"large"}
      cta={
        hasNewUnits &&
        userType === "teacher" &&
        onButtonClick && (
          <OakFlex>
            <OakPrimaryButton
              element="a"
              iconName="arrow-right"
              isTrailingIcon
              onClick={onButtonClick}
              tabIndex={0}
            >
              View and download new resources
            </OakPrimaryButton>
          </OakFlex>
        )
      }
    />
  );
};
