import React, { FC, useState } from "react";
import { capitalize } from "lodash";

import ButtonAsLink from "../Button/ButtonAsLink";
import Flex from "../Flex";
import Button from "../Button";
import FieldError from "../FormFields/FieldError";
import useAnalytics from "../../context/Analytics/useAnalytics";
import useAnalyticsPageProps from "../../hooks/useAnalyticsPageProps";
import type { KeyStageTitleValueType } from "../../browser-lib/avo/Avo";

import downloadZip from "./helpers/downloadZip";

type CurriculumDownloadProps = {
  keyStageSlug: string;
  keyStageTitle: string;
  subjectSlug: string;
  subjectTitle: string;
  tier?: string | null;
  lessonPage?: boolean;
};

const CurriculumDownloadButton: FC<CurriculumDownloadProps> = ({
  keyStageSlug,
  keyStageTitle,
  subjectSlug,
  subjectTitle,
  tier,
  lessonPage,
}) => {
  const [downloadResourceError, setDownloadResourceError] =
    useState<boolean>(false);

  const keyStageNum = keyStageSlug.slice(-1);
  let downloadLink = `${process.env.NEXT_PUBLIC_VERCEL_API_URL}/api/download-asset?type=curriculum-map&id=key-stage-${keyStageNum}-${subjectSlug}&extension=pdf`;
  let downloadLabel = `Curriculum download (PDF)`;

  if (tier) {
    //change download link to access only tiered curriculum
    downloadLink = `${process.env.NEXT_PUBLIC_VERCEL_API_URL}/api/download-asset?type=curriculum-map&id=key-stage-${keyStageNum}-${subjectSlug}-${tier}&extension=pdf`;
    downloadLabel = capitalize(tier) + ` curriculum download (PDF)`;
  }

  if (keyStageSlug === "ks4" && subjectSlug === "maths" && !tier) {
    downloadLink = `${process.env.NEXT_PUBLIC_VERCEL_API_URL}/api/download-asset?type=curriculum-map&id=key-stage-${keyStageNum}-${subjectSlug}&tiers=core,higher,foundation`;
    downloadLabel = `Curriculum download (.zip)`;
  }

  const { track } = useAnalytics();
  const { analyticsUseCase, pageName } = useAnalyticsPageProps();

  const trackCurriculumMapDownloaded = () => {
    track.curriculumMapDownloaded({
      subjectTitle,
      subjectSlug,
      keyStageTitle: keyStageTitle as KeyStageTitleValueType,
      keyStageSlug,
      pageName,
      analyticsUseCase,
    });
  };

  const handleZipDownloadClick = async () => {
    try {
      await downloadZip(keyStageNum, subjectSlug);
      setDownloadResourceError(false);
      trackCurriculumMapDownloaded();
    } catch (error) {
      setDownloadResourceError(true);
    }
  };

  return (
    <Flex $mb={[20, 0]}>
      {lessonPage && keyStageSlug === "ks4" && subjectSlug === "maths" ? (
        <Flex $flexDirection={"column"}>
          <Button
            icon="download"
            size="large"
            variant="minimal"
            $iconPosition={"trailing"}
            iconBackground="teachersHighlight"
            label={downloadLabel}
            onClick={handleZipDownloadClick}
          />
          {downloadResourceError && (
            <FieldError id={"download-resource-error"}>
              Sorry, we're having technical problems. Please try again later.
            </FieldError>
          )}
        </Flex>
      ) : (
        <ButtonAsLink
          icon="download"
          iconBackground="teachersHighlight"
          label={downloadLabel}
          href={downloadLink}
          onClick={() => trackCurriculumMapDownloaded()}
          page={null}
          size="large"
          variant="minimal"
          $iconPosition={"trailing"}
        />
      )}
    </Flex>
  );
};

export default CurriculumDownloadButton;
