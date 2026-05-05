import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import React, { Dispatch, SetStateAction, useState } from "react";
import { usePathname } from "next/navigation";
import {
  OakFlex,
  OakLoadingSpinner,
  OakPrimaryButton,
  OakPrimaryButtonProps,
  OakSmallPrimaryButton,
  OakTagFunctional,
  useMediaQuery,
} from "@oaknational/oak-components";

import useUnitDownloadExistenceCheck from "../hooks/downloadAndShareHooks/useUnitDownloadExistenceCheck";

import createAndClickHiddenDownloadLink from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";
import { createUnitDownloadLink } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink";
import { resolveOakHref } from "@/common-lib/urls";

// Used when a user is signed in but not onboarded
const UnitDownloadOnboardButton = ({
  href,
  showNewTag,
  size,
}: {
  href: string;
  showNewTag: boolean;
  size?: "small";
}) => {
  return (
    <ButtonForSize size={size} width="fit-content" element="a" href={href}>
      <OakFlex $alignItems="center" $gap="spacing-12">
        {showNewTag && (
          <OakTagFunctional
            label="New"
            $background="bg-decorative1-main"
            $color="text-primary"
            $pv={"spacing-0"}
          />
        )}
        Sign up to download
      </OakFlex>
    </ButtonForSize>
  );
};

// Used when a user is not signed in
const UnitDownloadSignInButton = ({
  redirectUrl,
  showNewTag,
  isDesktop,
  size,
  buttonLabel,
}: {
  redirectUrl: string;
  showNewTag: boolean;
  isDesktop: boolean;
  size?: "small";
  buttonLabel?: string;
}) => {
  const signInButtonLabel =
    buttonLabel ?? `Download${isDesktop ? " complete unit" : ""}`;

  return (
    <SignInButton
      forceRedirectUrl={redirectUrl}
      signUpForceRedirectUrl={redirectUrl}
    >
      <ButtonForSize size={size} iconName={"download"} isTrailingIcon>
        <OakFlex $alignItems="center" $gap="spacing-12">
          {showNewTag && (
            <OakTagFunctional
              label="New"
              $background="bg-decorative1-main"
              $color="text-primary"
              $pv={"spacing-0"}
            />
          )}
          {signInButtonLabel}
        </OakFlex>
      </ButtonForSize>
    </SignInButton>
  );
};

// Used when the user is signed in and onboarded
const DownloadButton = ({
  onUnitDownloadClick,
  downloadInProgress,
  fileSize,
  disabled,
  isDesktop,
  size,
  buttonLabel,
}: {
  onUnitDownloadClick: () => void;
  downloadInProgress: boolean;
  fileSize: string | undefined;
  disabled: boolean;
  isDesktop: boolean;
  size?: "small";
  buttonLabel?: string;
}) => {
  const zipSizeText = isDesktop ? ` (.zip ${fileSize})` : "";
  const downloadButtonText = (buttonLabel ?? "Download") + zipSizeText;

  return (
    <ButtonForSize
      size={size}
      iconName="download"
      isTrailingIcon
      onClick={onUnitDownloadClick}
      disabled={downloadInProgress || disabled}
    >
      <OakFlex $gap="spacing-12">
        {downloadInProgress && (
          <OakLoadingSpinner data-testid="loading-spinner" />
        )}
        {downloadInProgress ? "Downloading..." : downloadButtonText}
      </OakFlex>
    </ButtonForSize>
  );
};

const ButtonForSize = ({
  size,
  ...props
}: React.ComponentProps<typeof OakPrimaryButton> & { size?: "small" }) => {
  const ButtonComponent =
    size === "small" ? OakSmallPrimaryButton : OakPrimaryButton;

  // Without an explicit size, we set some responsive padding
  const defaultPaddingProps: OakPrimaryButtonProps =
    size === undefined
      ? {
          ph: ["spacing-8", "spacing-20"],
          pv: ["spacing-4", "spacing-12"],
        }
      : {};

  return <ButtonComponent {...defaultPaddingProps} {...props} />;
};

export const useUnitDownloadButtonState = () => {
  const [downloadError, setDownloadError] = useState<boolean | undefined>();
  const [showDownloadMessage, setShowDownloadMessage] = useState(false);
  const [showIncompleteMessage, setShowIncompleteMessage] = useState(false);
  const [downloadInProgress, setDownloadInProgress] = useState(false);

  return {
    downloadError,
    setDownloadError,
    showDownloadMessage,
    setShowDownloadMessage,
    downloadInProgress,
    setDownloadInProgress,
    showIncompleteMessage,
    setShowIncompleteMessage,
  };
};

export type UnitDownloadButtonProps = {
  unitFileId: string;
  onDownloadSuccess: () => void;
  setDownloadError: Dispatch<SetStateAction<boolean | undefined>>;
  setDownloadInProgress: Dispatch<SetStateAction<boolean>>;
  setShowDownloadMessage: Dispatch<SetStateAction<boolean>>;
  setShowIncompleteMessage: Dispatch<SetStateAction<boolean>>;
  downloadInProgress: boolean;
  showNewTag: boolean;
  geoRestricted: boolean;
  size?: "small";
  buttonLabel?: string;
};

/**
 * Three possible states for the unit download button:
 * - Sign in to download
 * - Continue onboarding to download
 * - Download
 * If there is no download for this unit, or unit download is disabled, the button will not be shown (ie. legacy units)
 */
export default function UnitDownloadButton(props: UnitDownloadButtonProps) {
  const { unitFileId, geoRestricted } = props;
  const { isSignedIn, isLoaded, user } = useUser();
  const auth = useAuth();
  const pathname = usePathname();
  const isDesktop = useMediaQuery("desktop");

  const {
    onDownloadSuccess,
    setDownloadError,
    setDownloadInProgress,
    setShowDownloadMessage,
    setShowIncompleteMessage,
    downloadInProgress,
  } = props;

  const { exists, fileSize, hasCheckedFiles } =
    useUnitDownloadExistenceCheck(unitFileId);

  const onUnitDownloadClick = async () => {
    setShowDownloadMessage(true);
    setShowIncompleteMessage(true);
    setDownloadInProgress(true);
    try {
      setDownloadError(false);
      const downloadLink = await createUnitDownloadLink({
        unitFileId,
        getToken: auth.getToken,
      });

      if (downloadLink) {
        createAndClickHiddenDownloadLink(downloadLink);
        onDownloadSuccess();
      }
    } catch (_error) {
      setShowDownloadMessage(false);
      setShowIncompleteMessage(false);
      setDownloadError(true);
    }
    setDownloadInProgress(false);
  };

  const showDownloadButton = hasCheckedFiles && exists;

  const showSignInButton = showDownloadButton && isLoaded && !isSignedIn;

  const showOnboardButton =
    showDownloadButton && user && !user.publicMetadata?.owa?.isOnboarded;

  const isGeoBlocked =
    showDownloadButton &&
    isSignedIn &&
    geoRestricted &&
    !user.publicMetadata?.owa?.isRegionAuthorised;

  return showOnboardButton ? (
    <UnitDownloadOnboardButton
      href={resolveOakHref({
        page: "onboarding",
        query: { returnTo: pathname ?? "" },
      })}
      showNewTag={props.showNewTag}
      size={props.size}
    />
  ) : showSignInButton ? (
    <UnitDownloadSignInButton
      redirectUrl={`/onboarding?returnTo=${pathname}`}
      showNewTag={props.showNewTag}
      isDesktop={isDesktop}
      size={props.size}
      buttonLabel={props.buttonLabel}
    />
  ) : showDownloadButton ? (
    <DownloadButton
      disabled={Boolean(isGeoBlocked)}
      onUnitDownloadClick={onUnitDownloadClick}
      downloadInProgress={downloadInProgress}
      fileSize={fileSize}
      isDesktop={isDesktop}
      size={props.size}
      buttonLabel={props.buttonLabel}
    />
  ) : null;
}
