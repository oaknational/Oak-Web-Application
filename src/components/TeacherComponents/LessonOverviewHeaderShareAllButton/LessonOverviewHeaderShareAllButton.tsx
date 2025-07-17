import { FC } from "react";
import { OakSmallSecondaryButton } from "@oaknational/oak-components";
import { SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/router";

import { LessonOverviewHeaderProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import { resolveOakHref } from "@/common-lib/urls";
import { invariant } from "@/utils/invariant";
import { useCopyrightRequirements } from "@/hooks/useCopyrightRequirements";

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
  const router = useRouter();
  const preselected = "all";

  const redirectToSignUp =
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

  if (redirectToSignUp) {
    return (
      <SignUpButton forceRedirectUrl={router.asPath}>
        <OakSmallSecondaryButton
          iconName="arrow-right"
          isTrailingIcon
          data-testid="sign-up-button"
        >
          Share activities with pupils
        </OakSmallSecondaryButton>
      </SignUpButton>
    );
  }

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
    <OakSmallSecondaryButton
      element="a"
      href={href}
      iconName="arrow-right"
      isTrailingIcon
      onClick={onClickShareAll}
      data-testid="share-all-button"
    >
      Share activities with pupils
    </OakSmallSecondaryButton>
  );
};
