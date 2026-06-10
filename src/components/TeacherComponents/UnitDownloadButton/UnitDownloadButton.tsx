import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { usePathname } from "next/navigation";
import {
  OakFlex,
  OakLoadingSpinner,
  OakPrimaryButton,
  OakPrimaryButtonProps,
  OakSmallPrimaryButton,
  OakSpan,
  OakTagFunctional,
  useMediaQuery,
} from "@oaknational/oak-components";

import useUnitDownloadExistenceCheck from "../hooks/downloadAndShareHooks/useUnitDownloadExistenceCheck";

import createAndClickHiddenDownloadLink from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";
import { createUnitDownloadLink } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink";
import { resolveOakHref } from "@/common-lib/urls";

const getLabel = ({
  isStuck,
  isDesktop,
  isMobile,
  longTextOnMobile,
  longerText,
}: {
  isStuck: boolean | undefined;
  isDesktop: boolean;
  isMobile: boolean;
  longTextOnMobile?: boolean;
  longerText: string;
}) => {
  const label = "Download";
  // Long text shows when stuck, on desktop, or - only where the caller opts in
  // via longTextOnMobile (e.g. the full-width unit header button) - on mobile.
  // This leaves tablet as the only breakpoint showing the short label.
  if (isStuck || isDesktop || (longTextOnMobile && isMobile)) {
    return label + " " + longerText;
  }
  return label;
};

// Used when a user is signed in but not onboarded
const UnitDownloadOnboardButton = ({
  href,
  showNewTag,
  size,
  ariaLabel,
  fullWidthOnMobile,
}: {
  href: string;
  showNewTag: boolean;
  size?: "small";
  ariaLabel?: string;
  fullWidthOnMobile?: boolean;
}) => {
  return (
    <ButtonForSize
      size={size}
      fullWidthOnMobile={fullWidthOnMobile}
      element="a"
      href={href}
      aria-label={ariaLabel}
    >
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
  isMobile,
  longTextOnMobile,
  fullWidthOnMobile,
  size,
  buttonLabel,
  ariaLabel,
  isStuck,
}: {
  redirectUrl: string;
  showNewTag: boolean;
  isDesktop: boolean;
  isMobile: boolean;
  longTextOnMobile?: boolean;
  fullWidthOnMobile?: boolean;
  size?: "small";
  buttonLabel?: ReactNode;
  ariaLabel?: string;
  isStuck?: boolean;
}) => {
  const signInButtonLabel =
    buttonLabel ??
    getLabel({
      isStuck,
      isDesktop,
      isMobile,
      longTextOnMobile,
      longerText: "complete unit",
    });

  return (
    <SignInButton
      forceRedirectUrl={redirectUrl}
      signUpForceRedirectUrl={redirectUrl}
    >
      <ButtonForSize
        size={size}
        fullWidthOnMobile={fullWidthOnMobile}
        iconName={"download"}
        isTrailingIcon
        aria-label={ariaLabel}
      >
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
  isMobile,
  longTextOnMobile,
  fullWidthOnMobile,
  size,
  buttonLabel,
  ariaLabel,
  isStuck,
}: {
  onUnitDownloadClick: () => void;
  downloadInProgress: boolean;
  fileSize: string | undefined;
  disabled: boolean;
  isDesktop: boolean;
  isMobile: boolean;
  longTextOnMobile?: boolean;
  fullWidthOnMobile?: boolean;
  isStuck?: boolean;
  size?: "small";
  buttonLabel?: ReactNode;
  ariaLabel?: string;
}) => {
  const zipSizeText = getLabel({
    isStuck,
    isDesktop,
    isMobile,
    longTextOnMobile,
    longerText: `(.zip ${fileSize})`,
  });
  const downloadButtonText: ReactNode = (
    <OakSpan>{buttonLabel ?? zipSizeText}</OakSpan>
  );

  return (
    <ButtonForSize
      size={size}
      fullWidthOnMobile={fullWidthOnMobile}
      iconName="download"
      isTrailingIcon
      onClick={onUnitDownloadClick}
      disabled={downloadInProgress || disabled}
      aria-label={ariaLabel}
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
  fullWidthOnMobile,
  ...props
}: React.ComponentProps<typeof OakPrimaryButton> & {
  size?: "small";
  fullWidthOnMobile?: boolean;
}) => {
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

  return (
    <ButtonComponent
      {...defaultPaddingProps}
      {...props}
      width={fullWidthOnMobile ? ["100%", "auto"] : "auto"}
    />
  );
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
  buttonLabel?: ReactNode;
  ariaLabel?: string;
  isStuck?: boolean;
  longTextOnMobile?: boolean;
  fullWidthOnMobile?: boolean;
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
  const isMobile = useMediaQuery("mobile");

  const {
    onDownloadSuccess,
    setDownloadError,
    setDownloadInProgress,
    setShowDownloadMessage,
    setShowIncompleteMessage,
    downloadInProgress,
    isStuck,
    longTextOnMobile,
    fullWidthOnMobile,
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
      ariaLabel={props.ariaLabel}
      fullWidthOnMobile={fullWidthOnMobile}
    />
  ) : showSignInButton ? (
    <UnitDownloadSignInButton
      isStuck={isStuck}
      redirectUrl={`/onboarding?returnTo=${pathname}`}
      showNewTag={props.showNewTag}
      isDesktop={isDesktop}
      isMobile={isMobile}
      longTextOnMobile={longTextOnMobile}
      fullWidthOnMobile={fullWidthOnMobile}
      size={props.size}
      buttonLabel={props.buttonLabel}
      ariaLabel={props.ariaLabel}
    />
  ) : showDownloadButton ? (
    <DownloadButton
      isStuck={isStuck}
      disabled={Boolean(isGeoBlocked)}
      onUnitDownloadClick={onUnitDownloadClick}
      downloadInProgress={downloadInProgress}
      fileSize={fileSize}
      isDesktop={isDesktop}
      isMobile={isMobile}
      longTextOnMobile={longTextOnMobile}
      fullWidthOnMobile={fullWidthOnMobile}
      size={props.size}
      buttonLabel={props.buttonLabel}
      ariaLabel={props.ariaLabel}
    />
  ) : null;
}
