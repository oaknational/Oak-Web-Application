import React, { FC, useState } from "react";
import { capitalize } from "lodash";

import ButtonAsLink from "../Button/ButtonAsLink";
import Flex from "../Flex";
import createAndClickHiddenDownloadLink from "../DownloadComponents/helpers/createAndClickHiddenDownloadLink";
import Button from "../Button";
import FieldError from "../FormFields/FieldError";

type CurriculumDownloadProps = {
  keyStage: string;
  subject: string;
  tier?: string | null;
  lessonPage?: boolean;
};

const CurriculumDownloadButton: FC<CurriculumDownloadProps> = ({
  keyStage,
  subject,
  tier,
  lessonPage,
}) => {
  const [downloadResourceError, setDownloadResourceError] =
    useState<boolean>(false);

  const keyStageNum = keyStage.slice(-1);
  let downloadLink = `${process.env.NEXT_PUBLIC_VERCEL_API_URL}/api/download-asset?type=curriculum-map&id=key-stage-${keyStageNum}-${subject}&extension=pdf`;
  let downloadLabel = `Curriculum download (PDF)`;

  if (tier) {
    //change download link to access only tiered curriculum
    downloadLink = `${process.env.NEXT_PUBLIC_VERCEL_API_URL}/api/download-asset?type=curriculum-map&id=key-stage-${keyStageNum}-${subject}-${tier}&extension=pdf`;
    downloadLabel = capitalize(tier) + ` curriculum download (PDF)`;
  }

  if (keyStage === "ks4" && subject === "maths" && !tier) {
    downloadLink = `${process.env.NEXT_PUBLIC_VERCEL_API_URL}/api/download-asset?type=curriculum-map&id=key-stage-${keyStageNum}-${subject}&tiers=core,higher,foundation`;
    downloadLabel = `Curriculum download (.zip)`;
  }

  const downloadZip = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_VERCEL_API_URL}/api/download-asset?type=curriculum-map&id=key-stage-${keyStageNum}-${subject}&tiers=core,higher,foundation`
      );
      if (res.status >= 200 && res.status < 300) {
        downloadLink = (await res.json()).data.url;
        createAndClickHiddenDownloadLink(downloadLink);
        setDownloadResourceError(false);
      } else {
        throw new Error("Resource does not exist");
      }
    } catch (error) {
      setDownloadResourceError(true);
    }
  };

  return (
    <Flex $mb={[20, 0]}>
      {lessonPage && keyStage === "ks4" && subject === "maths" ? (
        <Flex $flexDirection={"column"}>
          <Button
            icon="download"
            size="large"
            variant="minimal"
            $iconPosition={"trailing"}
            iconBackground="teachersHighlight"
            label={downloadLabel}
            onClick={() => {
              downloadZip();
            }}
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
