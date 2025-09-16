import { SignUpButton, useAuth, useUser } from "@clerk/nextjs";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/router";
import {
  OakFlex,
  OakLoadingSpinner,
  OakPrimaryButton,
  OakTagFunctional,
} from "@oaknational/oak-components";

import useUnitDownloadExistenceCheck from "../hooks/downloadAndShareHooks/useUnitDownloadExistenceCheck";

import createAndClickHiddenDownloadLink from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";
import { createUnitDownloadLink } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink";
import { resolveOakHref } from "@/common-lib/urls";

// Used when a user is signed in but not onboarded
const UnitDownloadOnboardButton = ({
  onClick,
  showNewTag,
}: {
  onClick: () => Promise<boolean>;
  showNewTag: boolean;
}) => (
  <OakPrimaryButton
    width="fit-content"
    rel="nofollow"
    onClick={onClick}
    ph={["inner-padding-xs", "inner-padding-l"]}
    pv={["inner-padding-ssx", "inner-padding-s"]}
  >
    <OakFlex $alignItems="center" $gap="space-between-xs">
      {showNewTag && (
        <OakTagFunctional
          label="New"
          $background="mint"
          $color="text-primary"
          $pv={"inner-padding-none"}
        />
      )}
      Complete sign up to download this unit
    </OakFlex>
  </OakPrimaryButton>
);

// Used when a user is not signed in
const UnitDownloadSignInButton = ({
  redirectUrl,
  showNewTag,
}: {
  redirectUrl: string;
  showNewTag: boolean;
}) => (
  <SignUpButton forceRedirectUrl={redirectUrl}>
    <OakPrimaryButton
      rel="nofollow"
      iconName={"download"}
      isTrailingIcon
      ph={["inner-padding-xs", "inner-padding-l"]}
      pv={["inner-padding-ssx", "inner-padding-s"]}
    >
      <OakFlex $alignItems="center" $gap="space-between-xs">
        {showNewTag && (
          <OakTagFunctional
            label="New"
            $background="mint"
            $color="text-primary"
            $pv={"inner-padding-none"}
          />
        )}
        Download unit
      </OakFlex>
    </OakPrimaryButton>
  </SignUpButton>
);

// Used when the user is signed in and onboarded
const DownloadButton = ({
  onUnitDownloadClick,
  downloadInProgress,
  fileSize,
  disabled,
}: {
  onUnitDownloadClick: () => void;
  downloadInProgress: boolean;
  fileSize: string | undefined;
  disabled: boolean;
}) => (
  <OakPrimaryButton
    rel="nofollow"
    iconName="download"
    isTrailingIcon
    onClick={onUnitDownloadClick}
    disabled={downloadInProgress || disabled}
    ph={["inner-padding-xs", "inner-padding-l"]}
    pv={["inner-padding-ssx", "inner-padding-s"]}
  >
    <OakFlex $gap="space-between-xs">
      {downloadInProgress && (
        <OakLoadingSpinner data-testid="loading-spinner" />
      )}
      {downloadInProgress ? "Downloading..." : `Download (.zip ${fileSize})`}
    </OakFlex>
  </OakPrimaryButton>
);

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
  const router = useRouter();

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
    } catch (error) {
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
      onClick={() =>
        router.push({
          pathname: resolveOakHref({ page: "onboarding" }),
          query: { returnTo: router.asPath },
        })
      }
      showNewTag={props.showNewTag}
    />
  ) : showSignInButton ? (
    <UnitDownloadSignInButton
      redirectUrl={`/onboarding?returnTo=${router.asPath}`}
      showNewTag={props.showNewTag}
    />
  ) : showDownloadButton ? (
    <DownloadButton
      disabled={Boolean(isGeoBlocked)}
      onUnitDownloadClick={onUnitDownloadClick}
      downloadInProgress={downloadInProgress}
      fileSize={fileSize}
    />
  ) : null;
}
