import React, { FC } from "react";

import ButtonAsLink from "../Button/ButtonAsLink";
import Flex from "../Flex";

type CurriculumDownloadProps = {
  keyStage: string;
  subject: string;
  tier?: string | null;
};

const CurriculumDownloadButton: FC<CurriculumDownloadProps> = ({
  keyStage,
  subject,
  tier,
}) => {
  function isString(x: unknown): x is string {
    return typeof x === "string";
  }

  const keyStageNum = keyStage.slice(-1);
  let downloadLink = `${process.env.NEXT_PUBLIC_VERCEL_API_URL}/api/download-asset?type=curriculum-map&id=key-stage-${keyStageNum}-${subject}&extension=pdf`;
  let downloadLabel = `Curriculum download (PDF)`;

  if (tier) {
    //change download link to access only tiered curriculum
    downloadLink = `${process.env.NEXT_PUBLIC_VERCEL_API_URL}/api/download-asset?type=curriculum-map&id=key-stage-${keyStageNum}-${subject}-${tier}&extension=pdf`;
    // change download label amendments for tiers
    const tierStr = isString(tier) ? tier : "";
    const upperCase = tierStr.charAt(0).toUpperCase() + tierStr.slice(1);
    downloadLabel = upperCase + ` curriculum download (PDF)`;
  }

  return (
    <Flex $mb={[20, 0]}>
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
    </Flex>
  );
};

export default CurriculumDownloadButton;
