import { SignUpButton, useUser } from "@clerk/nextjs";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  OakFlex,
  OakLoadingSpinner,
  OakPrimaryButton,
  OakTagFunctional,
} from "@oaknational/oak-components";
import { useFeatureFlagVariantKey } from "posthog-js/react";
import { z } from "zod";
import { useRouter } from "next/router";

import useUnitDownloadExistenceCheck from "../hooks/downloadAndShareHooks/useUnitDownloadExistenceCheck";

import createAndClickHiddenDownloadLink from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";
import { createUnitDownloadLink } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink";

// teacher-unit-downloads experiment A/B test group keys and test values
const variantKey = z
  .literal("option-a")
  .or(z.literal("option-b"))
  .or(z.literal("control"));
type VariantKey = z.infer<typeof variantKey>;

const unitButtonSignInText = {
  "option-a": "Download unit",
  "option-b": "Create a free account to download unit",
  control: "Download unit", // should not be used
};

// Used when a user is signed in but not onboarded
const UnitDownloadOnboardButton = () => (
  <OakPrimaryButton width="fit-content">
    <OakFlex $alignItems="center" $gap="space-between-xs">
      <OakTagFunctional label="New" $background="mint" $color="text-primary" />
      Complete sign up to download this unit
    </OakFlex>
  </OakPrimaryButton>
);

// Used when a user is not signed in
const UnitDownloadSignInButton = ({
  variant,
  redirectUrl,
}: {
  variant: VariantKey;
  redirectUrl: string;
}) => (
  <SignUpButton forceRedirectUrl={redirectUrl}>
    <OakPrimaryButton
      iconName={variant === "option-a" ? "download" : undefined}
      isTrailingIcon
      width="fit-content"
    >
      <OakFlex $alignItems="center" $gap="space-between-xs">
        <OakTagFunctional
          label="New"
          $background="mint"
          $color="text-primary"
        />
        {unitButtonSignInText[variant]}
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
  const featureFlag = useFeatureFlagVariantKey("teacher-unit-downloads");
  const parsedFeatureFlagKey = variantKey.safeParse(featureFlag);

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

  const unitDownloadDisabled =
    !parsedFeatureFlagKey.success || parsedFeatureFlagKey.data === "control";

  const showDownloadButton = !unitDownloadDisabled && hasCheckedFiles && exists;

  const showSignInButton =
    showDownloadButton && !unitDownloadDisabled && isLoaded && !isSignedIn;

  const showOnboardButton =
    showDownloadButton &&
    !unitDownloadDisabled &&
    user &&
    !user.publicMetadata?.owa?.isOnboarded;

  return showOnboardButton ? (
    <UnitDownloadOnboardButton />
  ) : showSignInButton ? (
    <UnitDownloadSignInButton
      variant={parsedFeatureFlagKey.data}
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
