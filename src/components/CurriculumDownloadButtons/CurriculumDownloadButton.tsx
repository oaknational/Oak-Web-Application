import React, { FC, useState } from "react";
import { capitalize } from "lodash";

import ButtonAsLink from "../Button/ButtonAsLink";
import Flex from "../Flex";
import Button from "../Button";
import FieldError from "../FormFields/FieldError";
import Box from "../Box";

import downloadZip from "./helpers/downloadZip";

import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import type { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";

type CurriculumDownloadProps = {
  keyStageSlug: string;
  keyStageTitle: string;
  subjectSlug: string;
  subjectTitle: string;
  tier?: string | null;
};

const CurriculumDownloadButton: FC<CurriculumDownloadProps> = ({
  keyStageSlug,
  keyStageTitle,
  subjectSlug,
  subjectTitle,
  tier,
}) => {
  const [downloadResourceError, setDownloadResourceError] =
    useState<boolean>(false);

  const isMathsKs4ProgrammesPage =
    !tier && keyStageSlug === "ks4" && subjectSlug === "maths";

  const keyStageNum = keyStageSlug.slice(-1);
  let downloadLink = `${process.env.NEXT_PUBLIC_VERCEL_API_URL}/api/download-asset?type=curriculum-map&id=key-stage-${keyStageNum}-${subjectSlug}&extension=pdf`;
  let downloadLabel = `Curriculum download (PDF)`;

  if (tier) {
    //change download link to access only tiered curriculum
    downloadLink = `${process.env.NEXT_PUBLIC_VERCEL_API_URL}/api/download-asset?type=curriculum-map&id=key-stage-${keyStageNum}-${subjectSlug}-${tier}&extension=pdf`;
    downloadLabel = capitalize(tier) + ` curriculum download (PDF)`;
  }

  if (isMathsKs4ProgrammesPage) {
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
    <>
      <Flex>
        {isMathsKs4ProgrammesPage ? ( // if on a maths programmes page, we want to download a zip of tier.pdf curriculum maps
          <Button
            icon={"download"}
            size="large"
            variant="minimal"
            $iconPosition={"trailing"}
            iconBackground="black"
            label={downloadLabel}
            onClick={handleZipDownloadClick}
          />
        ) : (
          <>
            <ButtonAsLink
              icon={"download"}
              iconBackground="black"
              label={downloadLabel}
              href={downloadLink}
              onClick={() => trackCurriculumMapDownloaded()}
              page={null}
              size="large"
              variant="minimal"
              $iconPosition={"trailing"}
            />
          </>
        )}
      </Flex>
      <Box>
        {downloadResourceError && (
          <FieldError id={"download-resource-error"}>
            Sorry, we're having technical problems. Please try again later.
          </FieldError>
        )}
      </Box>
    </>
  );
};

export default CurriculumDownloadButton;
