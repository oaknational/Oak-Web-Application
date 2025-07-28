import React, { Dispatch, SetStateAction, useState } from "react";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { useAuth } from "@clerk/nextjs";

import useUnitDownloadExistenceCheck from "../hooks/downloadAndShareHooks/useUnitDownloadExistenceCheck";
import LoginRequiredButton from "../LoginRequiredButton/LoginRequiredButton";

import createAndClickHiddenDownloadLink from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";
import { createUnitDownloadLink } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink";
import useMediaQuery from "@/hooks/useMediaQuery";

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
  georestricted: boolean;
};

export default function UnitDownloadButton(props: UnitDownloadButtonProps) {
  const { unitFileId, showNewTag, georestricted } = props;
  const authFlagEnabled = useFeatureFlagEnabled(
    "teachers-copyright-restrictions",
  );
  const auth = useAuth();

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
        authRequired: authFlagEnabled,
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
  const isMobile = useMediaQuery("mobile");

  return showDownloadButton ? (
    <LoginRequiredButton
      sizeVariant={isMobile ? "small" : "large"}
      actionProps={{
        onClick: onUnitDownloadClick,
        loading: downloadInProgress,
        name: downloadInProgress
          ? "Downloading..."
          : `Download (.zip ${fileSize})`,
        isActionGeorestricted: georestricted,
        iconName: "download",
        isTrailingIcon: true,
      }}
      signUpProps={{
        name: "Download unit",
        iconName: "download",
        isTrailingIcon: true,
        showNewTag: showNewTag,
      }}
      onboardingProps={{
        name: "Complete sign up to download this unit",
      }}
    />
  ) : null;
}
