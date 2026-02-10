import {
  OakFlex,
  OakInlineBanner,
  OakPrimaryButton,
} from "@oaknational/oak-components";

import { getBannerContent, CYCLE_2_SUBJECTS } from "./getBannerContent";
import { EmailCaptureBanner } from "./EmailCaptureBanner";

import { UnitListProps } from "@/components/TeacherComponents/UnitList/UnitList";
import { UnitsSectionData } from "@/pages/pupils/programmes/[programmeSlug]/units";
import useMediaQuery from "@/hooks/useMediaQuery";

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
  const isMobile = useMediaQuery("mobile");
  const isCycle2 = CYCLE_2_SUBJECTS.has(subjectSlug);

  if (!isLegacy || (!isExpiring && !isCycle2)) {
    return null;
  }

  const bannerContent = getBannerContent({
    isCycle2,
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
      <EmailCaptureBanner
        header={bannerContent.header}
        body={bannerContent.body}
      />
    );
  }

  const buttonText = `View ${!isMobile && userType === "teacher" ? "and download " : ""}new ${userType === "teacher" ? "resources" : "lessons"}`;

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
              {buttonText}
            </OakPrimaryButton>
          </OakFlex>
        )
      }
    />
  );
};
