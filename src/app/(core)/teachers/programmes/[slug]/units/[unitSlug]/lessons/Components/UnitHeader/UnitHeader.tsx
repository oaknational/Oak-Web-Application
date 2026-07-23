"use client";
import {
  OakBox,
  parseSpacing,
  getMediaQuery,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { useStickyUnitHeader } from "./useStickyUnitHeader";

import UnitDownloadButton, {
  useUnitDownloadButtonState,
} from "@/components/TeacherComponents/UnitDownloadButton/UnitDownloadButton";
import {
  CompactHeaderProps,
  Header,
} from "@/components/TeacherComponents/Header/Header";
import { TeachersUnitOverviewAdjacentUnit } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";
import { resolveOakHref } from "@/common-lib/urls";
import { UnitHeaderNavFooter } from "@/components/TeacherComponents/HeaderNavFooter/UnitHeaderNavFooter/UnitHeaderNavFooter";
import { useOakNotificationsContext } from "@/context/OakNotifications/useOakNotificationsContext";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

export type UnitHeaderProps = Omit<
  CompactHeaderProps,
  "layoutVariant" | "backgroundColorLevel"
> & {
  phase: "primary" | "secondary" | "foundation";
  unitDownloadFileId?: string;
  isGeorestrictedUnit?: boolean;
  nextUnit: TeachersUnitOverviewAdjacentUnit;
  prevUnit: TeachersUnitOverviewAdjacentUnit;
  subjectPhaseSlug: string;
  programmeSlug: string;
  downloadButtonState: ReturnType<typeof useUnitDownloadButtonState>;
};

/**
 * Compensates for the additional height introduced by the icon in the button
 */
const NegativeBorderBox = styled(OakBox)`
  margin-block: -${parseSpacing("spacing-8")};

  @media (${getMediaQuery("mobile")}) {
    margin-block: 0;
  }
`;

const UnitHeader = (props: UnitHeaderProps) => {
  const {
    subjectPhaseSlug,
    phase,
    unitDownloadFileId,
    isGeorestrictedUnit,
    prevUnit,
    nextUnit,
    programmeSlug,
    downloadButtonState,
  } = props;
  const { unitDownloadInitiated } = useTeacherBrowseAnalytics(
    (store) => store.track,
  );
  const { setCurrentToastProps } = useOakNotificationsContext();
  const { sentinelRef, isStuck } = useStickyUnitHeader();

  const backgroundColorLevel = phase === "primary" ? 4 : 3;

  const {
    setShowDownloadMessage,
    setDownloadError,
    setDownloadInProgress,
    downloadInProgress,
    setShowIncompleteMessage,
  } = downloadButtonState;

  const unitDownloadButtonRenderer = unitDownloadFileId
    ? (isStuck: boolean) => (
        <NegativeBorderBox $width={["100%", "auto"]}>
          <UnitDownloadButton
            isStuck={isStuck}
            longTextOnMobile={true}
            fullWidthOnMobile
            setDownloadError={setDownloadError}
            setDownloadInProgress={setDownloadInProgress}
            setShowDownloadMessage={setShowDownloadMessage}
            setShowIncompleteMessage={setShowIncompleteMessage}
            downloadInProgress={downloadInProgress}
            unitFileId={unitDownloadFileId}
            onDownloadSuccess={() => {
              unitDownloadInitiated();
              setCurrentToastProps({
                message: "Download started. This may take a few minutes.",
                variant: "success",
                autoDismiss: true,
                autoDismissDuration: 10000,
                showIcon: true,
              });
            }}
            showNewTag={false}
            geoRestricted={Boolean(isGeorestrictedUnit)}
            size={isStuck ? "small" : undefined}
          />
        </NegativeBorderBox>
      )
    : undefined;

  return (
    <>
      <Header
        {...props}
        layoutVariant="compact"
        backgroundColorLevel={backgroundColorLevel}
      />
      <UnitHeaderNavFooter
        sentinelRef={sentinelRef}
        isStuck={isStuck}
        title={props.heading}
        backgroundColorLevel={backgroundColorLevel}
        viewHref={resolveOakHref({
          page: "teacher-programme",
          subjectPhaseSlug,
          tab: "units",
        })}
        prevHref={
          prevUnit
            ? resolveOakHref({
                page: "unit-overview",
                unitSlug: prevUnit.slug,
                programmeSlug,
              })
            : undefined
        }
        nextHref={
          nextUnit
            ? resolveOakHref({
                page: "unit-overview",
                unitSlug: nextUnit.slug,
                programmeSlug,
              })
            : undefined
        }
        downloadButton={unitDownloadButtonRenderer}
      />
    </>
  );
};

export default UnitHeader;
