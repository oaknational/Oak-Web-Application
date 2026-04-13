"use client";
import { OakBox, parseSpacing } from "@oaknational/oak-components";
import styled from "styled-components";

import UnitDownloadButton, {
  useUnitDownloadButtonState,
} from "@/components/TeacherComponents/UnitDownloadButton/UnitDownloadButton";
import {
  CompactHeaderProps,
  Header,
} from "@/components/TeacherComponents/Header/Header";
import { NeighbourUnitOrLesson } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";
import { resolveOakHref } from "@/common-lib/urls";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import HeaderNavFooter from "@/components/TeacherComponents/HeaderNavFooter/HeaderNavFooter";

export type UnitHeaderProps = Omit<
  CompactHeaderProps,
  "layoutVariant" | "backgroundColorLevel"
> & {
  phase: "primary" | "secondary" | "foundation";
  unitDownloadFileId?: string;
  isGeorestrictedUnit?: boolean;
  nextUnit: NeighbourUnitOrLesson;
  prevUnit: NeighbourUnitOrLesson;
  subjectPhaseSlug: string;
  programmeSlug: string;
  trackingProps: {
    unitName: string;
    unitSlug: string;
    keyStageSlug: string;
    keyStageTitle: KeyStageTitleValueType;
    subjectSlug: string;
    subjectTitle: string;
  };
};

/**
 * Compensates for the additional height introduced by the icon in the button
 */
const NegativeBorderBox = styled(OakBox)`
  margin-block: -${parseSpacing("spacing-8")};
`;

const UnitHeader = (props: UnitHeaderProps) => {
  const {
    subjectPhaseSlug,
    phase,
    unitDownloadFileId,
    isGeorestrictedUnit,
    trackingProps,
    prevUnit,
    nextUnit,
    programmeSlug,
  } = props;
  const { track } = useAnalytics();

  const backgroundColorLevel = phase === "primary" ? 4 : 3;

  const {
    setShowDownloadMessage,
    setDownloadError,
    setDownloadInProgress,
    downloadInProgress,
    setShowIncompleteMessage,
  } = useUnitDownloadButtonState();

  return (
    <>
      <Header
        {...props}
        layoutVariant="compact"
        backgroundColorLevel={backgroundColorLevel}
      />
      <HeaderNavFooter
        type="unit"
        backgroundColorLevel={backgroundColorLevel}
        viewHref={resolveOakHref({
          page: "teacher-programme",
          subjectPhaseSlug,
          tab: "units",
        })}
        prevHref={
          prevUnit
            ? resolveOakHref({
                page: "unit-page",
                unitSlug: prevUnit.slug,
                subjectPhaseSlug: programmeSlug,
              })
            : undefined
        }
        nextHref={
          nextUnit
            ? resolveOakHref({
                page: "unit-page",
                unitSlug: nextUnit.slug,
                subjectPhaseSlug: programmeSlug,
              })
            : undefined
        }
        actionButton={
          unitDownloadFileId ? (
            <NegativeBorderBox>
              <UnitDownloadButton
                setDownloadError={setDownloadError}
                setDownloadInProgress={setDownloadInProgress}
                setShowDownloadMessage={setShowDownloadMessage}
                setShowIncompleteMessage={setShowIncompleteMessage}
                downloadInProgress={downloadInProgress}
                unitFileId={unitDownloadFileId}
                onDownloadSuccess={() => {
                  track.unitDownloadInitiated({
                    platform: "owa",
                    product: "teacher lesson resources",
                    engagementIntent: "use",
                    componentType: "unit_download_button",
                    eventVersion: "2.0.0",
                    analyticsUseCase: "Teacher",
                    ...trackingProps,
                  });
                }}
                showNewTag={false}
                geoRestricted={Boolean(isGeorestrictedUnit)}
              />
            </NegativeBorderBox>
          ) : undefined
        }
      />
    </>
  );
};

export default UnitHeader;
