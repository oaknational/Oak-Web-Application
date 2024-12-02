import { SignInButton, useUser } from "@clerk/nextjs";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  OakFlex,
  OakLoadingSpinner,
  OakPrimaryButton,
  OakTagFunctional,
} from "@oaknational/oak-components";

import useUnitDownloadExistenceCheck from "../hooks/downloadAndShareHooks/useUnitDownloadExistenceCheck";

import createUnitDownloadLink from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createUnitDownloadLink";
import createAndClickHiddenDownloadLink from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";

const UnitDownloadSignInButton = () => (
  // TODO: A/B test button text
  <SignInButton>
    <OakPrimaryButton iconName="download" isTrailingIcon>
      <OakFlex $alignItems="center" $gap="space-between-xs">
        <OakTagFunctional
          label="New"
          $background="mint"
          $color="text-primary"
        />
        Download unit
      </OakFlex>
    </OakPrimaryButton>
  </SignInButton>
);

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
  onDownloadSuccess: () => void;
  setDownloadError: Dispatch<SetStateAction<boolean | undefined>>;
  setDownloadInProgress: Dispatch<SetStateAction<boolean>>;
  setShowDownloadMessage: Dispatch<SetStateAction<boolean>>;
  downloadInProgress: boolean;
};

export default function UnitDownloadButton(props: UnitDownloadButtonProps) {
  const {
    onDownloadSuccess,
    setDownloadError,
    setDownloadInProgress,
    setShowDownloadMessage,
    downloadInProgress,
  } = props;
  // TODO: feature flag
  // TODO: use real slug
  const mockSlug = "test-unit-6-lessons";
  const { exists, fileSize, hasCheckedFiles } =
    useUnitDownloadExistenceCheck(mockSlug);

  const onUnitDownloadClick = async () => {
    setShowDownloadMessage(true);
    setDownloadInProgress(true);
    try {
      setDownloadError(false);
      const downloadLink = await createUnitDownloadLink({
        unitSlug: mockSlug,
      });

      if (downloadLink) {
        createAndClickHiddenDownloadLink(downloadLink);
        onDownloadSuccess();
      }
    } catch (error) {
      setDownloadError(true);
    }
    setDownloadInProgress(false);
  };
  const { isSignedIn, isLoaded } = useUser();

  const showSignInButton = isLoaded && !isSignedIn;
  const showDownloadButton = hasCheckedFiles && exists;

  return showSignInButton ? (
    <UnitDownloadSignInButton />
  ) : showDownloadButton ? (
    <DownloadButton
      onUnitDownloadClick={onUnitDownloadClick}
      downloadInProgress={downloadInProgress}
      fileSize={fileSize}
    />
  ) : null;
}
