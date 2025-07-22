import { FC } from "react";
import { OakSmallPrimaryButton } from "@oaknational/oak-components";

import { LessonOverviewHeaderProps as LessonOverviewHeaderDownloadAllButtonProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import { resolveOakHref } from "@/common-lib/urls";
import { useCopyrightRequirements } from "@/hooks/useCopyrightRequirements";
import RedirectToSignUpWhenRestrictedWrapper from "@/components/TeacherComponents/RedirectToSignUpWhenRestrictedWrapper/RedirectToSignUpWhenRestrictedWrapper";

export const LessonOverviewHeaderDownloadAllButton: FC<
  LessonOverviewHeaderDownloadAllButtonProps
> = (props) => {
  const {
    expired,
    showDownloadAll,
    programmeSlug,
    lessonSlug,
    unitSlug,
    onClickDownloadAll,
    isSpecialist,
    isCanonical,
    geoRestricted,
    loginRequired,
  } = props;

  const preselected = "all";
  const {
    showSignedOutGeoRestricted,
    showSignedOutLoginRequired,
    showGeoBlocked,
  } = useCopyrightRequirements({
    geoRestricted: geoRestricted ?? false,
    loginRequired: loginRequired ?? false,
  });

  const contentRestricted =
    showSignedOutGeoRestricted || showSignedOutLoginRequired;

  if (expired || !showDownloadAll || showGeoBlocked) {
    return null;
  }

  const href =
    programmeSlug && unitSlug && isSpecialist
      ? resolveOakHref({
          page: "specialist-lesson-downloads",
          lessonSlug,
          unitSlug,
          programmeSlug,
          query: { preselected },
        })
      : programmeSlug && unitSlug && !isSpecialist && !isCanonical
        ? resolveOakHref({
            page: "lesson-downloads",
            lessonSlug,
            unitSlug,
            programmeSlug,
            query: { preselected },
          })
        : resolveOakHref({
            page: "lesson-downloads-canonical",
            lessonSlug,
            query: { preselected },
          });

  return (
    <RedirectToSignUpWhenRestrictedWrapper
      contentRestricted={contentRestricted}
    >
      <OakSmallPrimaryButton
        element="a"
        data-testid="download-all-button"
        iconName="arrow-right"
        isTrailingIcon
        aria-label="Download all resources"
        {...(!contentRestricted && { href })}
        {...(!contentRestricted && { onClick: onClickDownloadAll })}
      >
        Download all resources
      </OakSmallPrimaryButton>
    </RedirectToSignUpWhenRestrictedWrapper>
  );
};
