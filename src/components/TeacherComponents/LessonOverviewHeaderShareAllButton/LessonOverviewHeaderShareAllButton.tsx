import { FC } from "react";
import { OakSmallSecondaryButton } from "@oaknational/oak-components";

import { LessonOverviewHeaderProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import { resolveOakHref } from "@/common-lib/urls";
import { invariant } from "@/utils/invariant";
import { useCopyrightRequirements } from "@/hooks/useCopyrightRequirements";
import RedirectToSignUpWhenRestrictedWrapper from "@/components/TeacherComponents/RedirectToSignInWhenRestrictedWrapper/RedirectToSignInWhenRestrictedWrapper";

export const LessonOverviewHeaderShareAllButton: FC<
  LessonOverviewHeaderProps
> = (props) => {
  const {
    lessonSlug,
    unitSlug,
    programmeSlug,
    isShareable,
    onClickShareAll,
    isSpecialist,
    isCanonical,
    geoRestricted,
    loginRequired,
  } = props;
  const { showSignedOutGeoRestricted, showSignedOutLoginRequired } =
    useCopyrightRequirements({
      geoRestricted: geoRestricted ?? false,
      loginRequired: loginRequired ?? false,
    });
  const preselected = "all";

  const contentRestricted =
    showSignedOutGeoRestricted || showSignedOutLoginRequired;
  const href = (() => {
    if (isCanonical) {
      return resolveOakHref({
        page: "lesson-share-canonical",
        lessonSlug,
        query: { preselected },
      });
    }

    invariant(typeof unitSlug === "string", "unitSlug is required");
    invariant(typeof programmeSlug === "string", "programmeSlug is required");

    if (isSpecialist) {
      return resolveOakHref({
        page: "specialist-lesson-share",
        lessonSlug,
        unitSlug,
        programmeSlug,
        query: { preselected },
      });
    }

    return resolveOakHref({
      page: "lesson-share",
      lessonSlug,
      unitSlug,
      programmeSlug,
      query: { preselected },
    });
  })();

  if (!isShareable || !href) {
    return (
      <OakSmallSecondaryButton
        iconName="arrow-right"
        isTrailingIcon
        disabled={true}
        data-testid="share-all-button"
      >
        Share activities with pupils
      </OakSmallSecondaryButton>
    );
  }

  return (
    <RedirectToSignUpWhenRestrictedWrapper
      contentRestricted={contentRestricted}
    >
      <OakSmallSecondaryButton
        element="a"
        iconName="arrow-right"
        isTrailingIcon
        data-testid="share-all-button"
        {...(!contentRestricted && { href })}
        {...(!contentRestricted && { onClick: onClickShareAll })}
      >
        Share activities with pupils
      </OakSmallSecondaryButton>
    </RedirectToSignUpWhenRestrictedWrapper>
  );
};
