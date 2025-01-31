import { SignUpButton, useUser } from "@clerk/nextjs";
import {
  OakFlex,
  OakPrimaryButton,
  OakTertiaryButton,
} from "@oaknational/oak-components";
import { useRouter } from "next/router";

import { resolveOakHref } from "@/common-lib/urls";
import useOptionalDownloadSignIn from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useOptionalDownloadSignIn";

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
const LessonDownloadSignInButton = ({
  redirectUrl,
}: {
  redirectUrl: string;
}) => (
  <SignUpButton forceRedirectUrl={redirectUrl}>
    <OakPrimaryButton width="fit-content">Download & sign in</OakPrimaryButton>
  </SignUpButton>
);

const LessonDownloadWithoutSignInButton = ({
  onClick,
}: {
  onClick: () => void;
}) => (
  <OakTertiaryButton iconName="chevron-right" isTrailingIcon onClick={onClick}>
    Download without signing in
  </OakTertiaryButton>
);

export type LessonDownloadSignInButtonsProps = {
  onDownloadWithoutSignInClick: () => void;
};

/**
 * Buttons to choose to sign in or download without signing in
 * - Logged out: Download & sign in and Download without signing in buttons
 * - Logged in: No buttons
 * - Logged in but not onboarded: only Download button which redirects to onboarding
 */
export default function LessonDownloadSignInButtons(
  props: Readonly<LessonDownloadSignInButtonsProps>,
) {
  const { onDownloadWithoutSignInClick } = props;
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();
  const { showDownloadSignInButtons } = useOptionalDownloadSignIn();

  const showSignInButton = showDownloadSignInButtons && isLoaded && !isSignedIn;
  const showOnboardButton =
    showDownloadSignInButtons && user && !user.publicMetadata?.owa?.isOnboarded;

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
      {showSignInButton && (
        <>
          <LessonDownloadSignInButton
            redirectUrl={`/onboarding?returnTo=${router.asPath}`}
          />
          <LessonDownloadWithoutSignInButton
            onClick={onDownloadWithoutSignInClick}
          />
        </>
      )}
    </OakFlex>
  );
}
