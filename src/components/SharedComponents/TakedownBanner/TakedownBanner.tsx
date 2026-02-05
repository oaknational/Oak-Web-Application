import {
  OakFlex,
  OakInlineBanner,
  OakPrimaryButton,
  OakInlineRegistrationBanner,
  OakHeading,
} from "@oaknational/oak-components";

import { getBannerContent, CYCLE_2_SUBJECTS } from "./getBannerContent";

import { useNewsletterForm } from "@/components/GenericPagesComponents/NewsletterForm";
import { UnitListProps } from "@/components/TeacherComponents/UnitList/UnitList";
import { UnitsSectionData } from "@/pages/pupils/programmes/[programmeSlug]/units";

export const getIsUnitExpiring = (
  units: UnitListProps["currentPageItems"] | UnitsSectionData["units"],
) => {
  return units.some((unit) =>
    unit?.some((unitItem) => unitItem.actions?.displayExpiringBanner),
  );
};

export const getDoesSubjectHaveNewUnits = (subjectSlug: string) => {
  return subjectSlug !== "drama" && subjectSlug !== "latin";
};

export const TakedownBanner = ({
  hasNewUnits,
  subjectSlug,
  userType,
  onButtonClick,
  onwardHref,
  isLegacy,
  isExpiring,
}: {
  hasNewUnits: boolean;
  subjectSlug: string;
  userType: "teacher" | "pupil";
  onButtonClick?: () => void;
  onwardHref?: string;
  isLegacy: boolean;
  isExpiring: boolean;
}) => {
  const newsletterFormProps = useNewsletterForm();
  const bannerContent = getBannerContent({
    isLegacy,
    isCycle2: CYCLE_2_SUBJECTS.has(subjectSlug),
    isExpiring,
    hasNewUnits,
    user: userType,
  });

  if (!bannerContent) {
    return null;
  }

  // Capture emails for newsletter if user is a teacher and no new units exist
  const shouldUseEmailCapture =
    userType === "teacher" && !hasNewUnits && isExpiring;

  if (shouldUseEmailCapture) {
    return (
      <OakInlineRegistrationBanner
        headerText={
          <OakHeading tag="h2" $font={["heading-5", "heading-4", "heading-4"]}>
            {bannerContent.header}
          </OakHeading>
        }
        bodyText={bannerContent.body}
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
      message={bannerContent.body}
      title={bannerContent.header}
      $width={"100%"}
      type={"warning"}
      variant={"large"}
      cta={
        (onwardHref || onButtonClick) && (
          <OakFlex>
            <OakPrimaryButton
              element="a"
              iconName="arrow-right"
              isTrailingIcon
              onClick={onButtonClick}
              tabIndex={0}
              href={onwardHref}
            >
              View and download new resources
            </OakPrimaryButton>
          </OakFlex>
        )
      }
    />
  );
};
