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

export type UnitListLegacyBannerProps = {
  hasNewUnits: boolean;
  allLegacyUnits: UnitListProps["currentPageItems"] | UnitsSectionData["units"];
  userType: "teacher" | "pupil";
  onButtonClick?: () => void;
};
export const UnitListLegacyBanner: FC<UnitListLegacyBannerProps> = ({
  hasNewUnits,
  allLegacyUnits,
  userType,
  onButtonClick,
}) => {
  const newsletterFormProps = useNewsletterForm();

  // If any legacy units have the displayExpiringBanner action, show the banner
  const shouldShowAnExpiringBanner = allLegacyUnits.some((unit) =>
    unit?.some(
      (unitItem) => unitItem.actions && unitItem.actions?.displayExpiringBanner,
    ),
  );

  if (!shouldShowAnExpiringBanner) {
    return <></>;
  }

  const getBannerCopy = (): [React.ReactNode, React.ReactNode] => {
    switch (true) {
      case hasNewUnits && userType === "teacher":
        // Teacher pages, legacy unit is being removed but new units exist
        return [
          "These resources were made for remote use during the pandemic, not classroom teaching.",
          <>
            <OakP>
              Switch to our new teaching resources now - designed by teachers
              and leading subject experts, and tested in classrooms.
            </OakP>
          </>,
        ];
      case hasNewUnits && userType === "pupil":
        // Pupil pages, legacy unit is being removed but new units exist
        return [
          "These lessons were made for home learning during the pandemic.",
          <OakP>
            Scroll up to take a look at the brand-new and improved resources
            we've made for you.
          </OakP>,
        ];
      case !hasNewUnits && userType === "pupil":
        // Pupil pages, legacy unit is being removed but no new units exist
        return [
          "New units on the way!",
          <>
            <OakP>
              These resources were made for remote use during the pandemic, not
              classroom teaching.
            </OakP>
            <OakP $mt={"spacing-24"}>
              We’re busy creating new lessons for you.
            </OakP>
          </>,
        ];
      default:
        // Teacher pages, legacy unit is being removed but no new units exist
        return [
          <OakHeading tag="h2" $font={["heading-5", "heading-4", "heading-4"]}>
            New units on the way!
          </OakHeading>,
          <>
            <OakP>
              These resources were made for remote use during the pandemic, not
              classroom teaching.
            </OakP>
            <OakP>
              We have been busy creating new units. We'll let you know when they
              are ready -and send you other helpful content and resources.
              Unsubscribe at any time. Read our{" "}
              <OakLink href="https://www.thenational.academy/legal/privacy-policy">
                privacy policy
              </OakLink>
            </OakP>
          </>,
        ];
    }
  };

  // Capture emails for newsletter if user is a teacher and no new units exist
  const shouldUseEmailCapture = userType === "teacher" && !hasNewUnits;
  const [headerText, bodyText] = getBannerCopy();

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
              View new resources
            </OakPrimaryButton>
          </OakFlex>
        )
      }
    />
  );
};
