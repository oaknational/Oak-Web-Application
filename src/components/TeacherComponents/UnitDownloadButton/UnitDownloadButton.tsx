import { SignUpButton, useUser } from "@clerk/nextjs";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  OakFlex,
  OakLoadingSpinner,
  OakPrimaryButton,
  OakTagFunctional,
} from "@oaknational/oak-components";
import { useRouter } from "next/router";

import useUnitDownloadExistenceCheck from "../hooks/downloadAndShareHooks/useUnitDownloadExistenceCheck";

import createAndClickHiddenDownloadLink from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";
import { createUnitDownloadLink } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink";
import { resolveOakHref } from "@/common-lib/urls";

// Used when a user is signed in but not onboarded
const UnitDownloadOnboardButton = ({
  onClick,
}: {
  onClick: () => Promise<boolean>;
}) => (
  <OakPrimaryButton
    width="fit-content"
    onClick={onClick}
    pv={["inner-padding-s", "inner-padding-ssx"]}
  >
    <OakFlex $alignItems="center" $gap="space-between-xs">
      <OakTagFunctional label="New" $background="mint" $color="text-primary" />
      Complete sign up to download this unit
    </OakFlex>
  </OakPrimaryButton>
);

// Used when a user is not signed in
const UnitDownloadSignInButton = ({ redirectUrl }: { redirectUrl: string }) => (
  <SignUpButton forceRedirectUrl={redirectUrl}>
    <OakPrimaryButton
      iconName={"download"}
      isTrailingIcon
      width="fit-content"
      pv={["inner-padding-s", "inner-padding-ssx"]}
    >
      <OakFlex $alignItems="center" $gap="space-between-xs">
        <OakTagFunctional
          label="New"
          $background="mint"
          $color="text-primary"
        />
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
}: {
  onUnitDownloadClick: () => void;
  downloadInProgress: boolean;
  fileSize: string | undefined;
}) => (
  <OakPrimaryButton
    iconName="download"
    isTrailingIcon
    onClick={onUnitDownloadClick}
    disabled={downloadInProgress}
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
  const [downloadInProgress, setDownloadInProgress] = useState(false);

  return {
    downloadError,
    setDownloadError,
    showDownloadMessage,
    setShowDownloadMessage,
    downloadInProgress,
    setDownloadInProgress,
  };
};

export type UnitDownloadButtonProps = {
  unitFileId: string;
  onDownloadSuccess: () => void;
  setDownloadError: Dispatch<SetStateAction<boolean | undefined>>;
  setDownloadInProgress: Dispatch<SetStateAction<boolean>>;
  setShowDownloadMessage: Dispatch<SetStateAction<boolean>>;
  downloadInProgress: boolean;
};

/**
 * Three possible states for the unit download button:
 * - Sign in to download
 * - Continue onboarding to download
 * - Download
 * If there is no download for this unit, or unit download is disabled, the button will not be shown (ie. legacy units)
 */
export default function UnitDownloadButton(props: UnitDownloadButtonProps) {
  const { unitFileId } = props;
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();

  const {
    onDownloadSuccess,
    setDownloadError,
    setDownloadInProgress,
    setShowDownloadMessage,
    downloadInProgress,
  } = props;

  const { exists, fileSize, hasCheckedFiles } =
    useUnitDownloadExistenceCheck(unitFileId);

  const onUnitDownloadClick = async () => {
    setShowDownloadMessage(true);
    setDownloadInProgress(true);
    try {
      setDownloadError(false);
      const downloadLink = await createUnitDownloadLink({
        unitFileId,
      });

      if (downloadLink) {
        createAndClickHiddenDownloadLink(downloadLink);
        onDownloadSuccess();
      }
    } catch (error) {
      setShowDownloadMessage(false);
      setDownloadError(true);
    }
    setDownloadInProgress(false);
  };

  const showDownloadButton = hasCheckedFiles && exists;

  const showSignInButton = showDownloadButton && isLoaded && !isSignedIn;

  const showOnboardButton =
    showDownloadButton && user && !user.publicMetadata?.owa?.isOnboarded;

  return showOnboardButton ? (
    <UnitDownloadOnboardButton
      onClick={() =>
        router.push({
          pathname: resolveOakHref({ page: "onboarding" }),
          query: { returnTo: router.asPath },
        })
      }
    />
  ) : showSignInButton ? (
    <UnitDownloadSignInButton
      redirectUrl={`/onboarding?returnTo=${router.asPath}`}
    />
  ) : showDownloadButton ? (
    <DownloadButton
      onUnitDownloadClick={onUnitDownloadClick}
      downloadInProgress={downloadInProgress}
      fileSize={fileSize}
    />
  ) : null;
}
