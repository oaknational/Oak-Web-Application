import { FC } from "react";
import { OakSmallPrimaryButton } from "@oaknational/oak-components";
import { SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/router";

import { LessonOverviewHeaderProps as LessonOverviewHeaderDownloadAllButtonProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import { resolveOakHref } from "@/common-lib/urls";
import { useCopyrightRequirements } from "@/hooks/useCopyrightRequirements";

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
  const router = useRouter();
  const { showSignedOutGeoRestricted, showSignedOutLoginRequired } =
    useCopyrightRequirements({
      geoRestricted: geoRestricted ?? false,
      loginRequired: loginRequired ?? false,
    });

  const redirectToSignIn =
    showSignedOutGeoRestricted || showSignedOutLoginRequired;

  if (expired || !showDownloadAll) {
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

  if (redirectToSignIn) {
    return (
      <SignUpButton forceRedirectUrl={router.asPath}>
        <OakSmallPrimaryButton
          data-testid="sign-up-button"
          iconName="arrow-right"
          isTrailingIcon
        >
          Download all resources
        </OakSmallPrimaryButton>
      </SignUpButton>
    );
  }

  return (
    <OakSmallPrimaryButton
      element="a"
      data-testid="download-all-button"
      href={href}
      iconName="arrow-right"
      isTrailingIcon
      aria-label="Download all resources"
      onClick={onClickDownloadAll}
    >
      Download all resources
    </OakSmallPrimaryButton>
  );
};
