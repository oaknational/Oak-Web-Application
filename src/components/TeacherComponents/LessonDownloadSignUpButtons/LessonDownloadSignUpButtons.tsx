import { SignUpButton, useUser } from "@clerk/nextjs";
import {
  OakFlex,
  OakPrimaryButton,
  OakTertiaryButton,
} from "@oaknational/oak-components";
import { useRouter } from "next/router";

import { resolveOakHref } from "@/common-lib/urls";
import useOptionalDownloadSignUp from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useOptionalDownloadSignUp";

// Used when a user is signed in but not onboarded
const LessonDownloadOnboardButton = ({
  onClick,
}: {
  onClick: () => Promise<boolean>;
}) => (
  <OakPrimaryButton
    width="fit-content"
    onClick={onClick}
    iconName="download"
    isTrailingIcon
  >
    Download .zip
  </OakPrimaryButton>
);

// Used when a user is not signed in
const LessonDownloadSignUpButton = ({
  redirectUrl,
}: {
  redirectUrl: string;
}) => (
  <SignUpButton forceRedirectUrl={redirectUrl}>
    <OakPrimaryButton width="fit-content">Download & sign up</OakPrimaryButton>
  </SignUpButton>
);

const LessonDownloadWithoutSignUpButton = ({
  onClick,
}: {
  onClick: () => void;
}) => (
  <OakTertiaryButton iconName="chevron-right" isTrailingIcon onClick={onClick}>
    Download without signing up
  </OakTertiaryButton>
);

export type LessonDownloadSignUpButtonsProps = {
  onDownloadWithoutSignUpClick: () => void;
};

/**
 * Buttons to choose to sign up/in or download without signing up/in
 * - Signed out: Download & sign up and Download without signing up buttons
 * - Signed in: No buttons
 * - Signed in but not onboarded: only Download button which redirects to onboarding
 */
export default function LessonDownloadSignUpButtons(
  props: Readonly<LessonDownloadSignUpButtonsProps>,
) {
  const { onDownloadWithoutSignUpClick } = props;
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();
  const { showDownloadSignUpButtons } = useOptionalDownloadSignUp();

  const showSignUpButton = showDownloadSignUpButtons && isLoaded && !isSignedIn;
  const showOnboardButton =
    showDownloadSignUpButtons && user && !user.publicMetadata?.owa?.isOnboarded;

  return (
    <OakFlex
      $gap={"space-between-m"}
      $mt={"space-between-xl"}
      $flexDirection={["column", "row"]}
    >
      {showOnboardButton && (
        <LessonDownloadOnboardButton
          onClick={() =>
            router.push({
              pathname: resolveOakHref({ page: "onboarding" }),
              query: { returnTo: router.asPath },
            })
          }
        />
      )}
      {showSignUpButton && (
        <>
          <LessonDownloadSignUpButton
            redirectUrl={`/onboarding?returnTo=${router.asPath}`}
          />
          <LessonDownloadWithoutSignUpButton
            onClick={onDownloadWithoutSignUpClick}
          />
        </>
      )}
    </OakFlex>
  );
}
