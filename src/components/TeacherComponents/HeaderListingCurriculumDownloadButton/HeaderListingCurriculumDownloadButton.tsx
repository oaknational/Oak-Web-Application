import React, { FC } from "react";
import { OakFlex } from "@oaknational/oak-components";

import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";

type HeaderListingCurriculumDownloadButtonProps = {
  keyStageSlug: string;
  subjectSlug: string;
};

const HeaderListingCurriculumDownloadButton: FC<
  HeaderListingCurriculumDownloadButtonProps
> = ({ keyStageSlug, subjectSlug }) => {
  return (
    <>
      <OakFlex>
        <ButtonAsLink
          icon={"arrow-right"}
          iconBackground="black"
          label={"Curriculum download"}
          page={"curriculum-previous-downloads"}
          size="large"
          variant="minimal"
          $iconPosition={"trailing"}
          query={{
            subject: subjectSlug,
            keystage: keyStageSlug,
          }}
          data-testid="curriculum-download-link"
        />
      </OakFlex>
    </>
  );
};

export default HeaderListingCurriculumDownloadButton;
