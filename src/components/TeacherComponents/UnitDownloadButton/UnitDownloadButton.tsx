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

import useUnitDownloadExistenceCheck from "../hooks/downloadAndShareHooks/useUnitDownloadExistenceCheck";

import createUnitDownloadLink from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createUnitDownloadLink";
import createAndClickHiddenDownloadLink from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";

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

const UnitDownloadSignInButton = ({ variant }: { variant: VariantKey }) => (
  <SignUpButton>
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
  unitProgrammeSlug: string;
  onDownloadSuccess: () => void;
  setDownloadError: Dispatch<SetStateAction<boolean | undefined>>;
  setDownloadInProgress: Dispatch<SetStateAction<boolean>>;
  setShowDownloadMessage: Dispatch<SetStateAction<boolean>>;
  downloadInProgress: boolean;
};

export default function UnitDownloadButton(props: UnitDownloadButtonProps) {
  const { isSignedIn, isLoaded } = useUser();
  const featureFlag = useFeatureFlagVariantKey("teacher-unit-downloads");
  const parsedFeatureFlagKey = variantKey.safeParse(featureFlag);

  const {
    onDownloadSuccess,
    setDownloadError,
    setDownloadInProgress,
    setShowDownloadMessage,
    downloadInProgress,
    unitProgrammeSlug,
  } = props;

  const { exists, fileSize, hasCheckedFiles } =
    useUnitDownloadExistenceCheck(unitProgrammeSlug);

  const onUnitDownloadClick = async () => {
    setShowDownloadMessage(true);
    setDownloadInProgress(true);
    try {
      setDownloadError(false);
      const downloadLink = await createUnitDownloadLink({
        unitSlug: unitProgrammeSlug,
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
  const showSignInButton = !unitDownloadDisabled && isLoaded && !isSignedIn;
  const showDownloadButton = !unitDownloadDisabled && hasCheckedFiles && exists;

  return showSignInButton ? (
    <UnitDownloadSignInButton variant={parsedFeatureFlagKey.data} />
  ) : showDownloadButton ? (
    <DownloadButton
      onUnitDownloadClick={onUnitDownloadClick}
      downloadInProgress={downloadInProgress}
      fileSize={fileSize}
    />
  ) : null;
}
