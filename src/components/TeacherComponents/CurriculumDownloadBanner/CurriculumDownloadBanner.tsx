import {
  OakLinkCard,
  OakFlex,
  OakHeading,
  OakP,
  OakSmallPrimaryButton,
} from "@oaknational/oak-components";
import React from "react";

import { getSubjectPhaseSlug } from "../helpers/getSubjectPhaseSlug";

import useCurriculumDownloads from "./useCurriculumDownloads";

import { resolveOakHref } from "@/common-lib/urls";

export type CurriculumDownloadBannerProps = {
  hasCycle2Content?: boolean;
  subjectSlug: string;
  subjectTitle: string;
  phase: string;
  examBoardSlug?: string | null;
  ks4OptionSlug: string | null;
  tierSlug: string | null;
};

const CurriculumDownloadBanner = (props: CurriculumDownloadBannerProps) => {
  const {
    hasCycle2Content,
    subjectSlug,
    subjectTitle,
    phase,
    examBoardSlug,
    tierSlug,
    ks4OptionSlug,
  } = props;

  // TODO: props
  const { onSubmit, hasSavedDetails, isSubmitting } = useCurriculumDownloads({
    mvRefreshTime: 0,
    phaseSlug: phase,
    subjectSlug,
    ks4OptionSlug,
    tierSlug,
  });

  return hasCycle2Content ? (
    <OakLinkCard
      mainSection={
        <OakFlex $flexDirection="column" $gap="space-between-s">
          <OakHeading tag="h2">
            Fully resourced {subjectTitle.toLocaleLowerCase()} curriculum is
            coming this autumn.
          </OakHeading>
          <OakP $font="heading-light-7">
            We’re busy creating the final lessons and units. Download the
            curriculum plan now to explore what’s coming and the thinking behind
            our curriculum design.
          </OakP>
          <OakSmallPrimaryButton
            isTrailingIcon
            iconName="download"
            isLoading={isSubmitting}
            onClick={
              hasSavedDetails
                ? (e) => {
                    e.preventDefault();
                    onSubmit();
                  }
                : undefined
            }
          >
            Download curriculum plan
          </OakSmallPrimaryButton>
        </OakFlex>
      }
      href={resolveOakHref({
        page: "curriculum-downloads",
        subjectPhaseSlug: getSubjectPhaseSlug({
          subject: subjectSlug,
          phaseSlug: phase,
          examBoardSlug: examBoardSlug,
        }),
      })}
      iconName="homepage-teacher-map"
      iconFill="white"
      iconAlt="Curriculum map icon"
      showNew={false}
    />
  ) : null;
};

export default CurriculumDownloadBanner;
