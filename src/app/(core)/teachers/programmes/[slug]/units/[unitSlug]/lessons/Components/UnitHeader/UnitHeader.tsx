"use client";
import { OakBox, parseSpacing } from "@oaknational/oak-components";
import styled from "styled-components";
import { useRef, useState, useEffect } from "react";

import UnitDownloadButton, {
  useUnitDownloadButtonState,
} from "@/components/TeacherComponents/UnitDownloadButton/UnitDownloadButton";
import {
  CompactHeaderProps,
  Header,
} from "@/components/TeacherComponents/Header/Header";
import { TeachersUnitOverviewAdjacentUnit } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";
import { resolveOakHref } from "@/common-lib/urls";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import {
  HeaderNavFooter,
  StickyHeaderNavFooter,
} from "@/components/TeacherComponents/HeaderNavFooter/HeaderNavFooter";
import { useOakNotificationsContext } from "@/context/OakNotifications/useOakNotificationsContext";

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
  trackingProps: {
    unitName: string;
    unitSlug: string;
    keyStageSlug: string;
    keyStageTitle: KeyStageTitleValueType;
    subjectSlug: string;
    subjectTitle: string;
  };
  downloadButtonState: ReturnType<typeof useUnitDownloadButtonState>;
};

/**
 * Compensates for the additional height introduced by the icon in the button
 */
const NegativeBorderBox = styled(OakBox)`
  margin-block: -${parseSpacing("spacing-8")};
`;

function useDetectStuck() {
  const ref = useRef<HTMLDivElement>(null);

  const [isStuck, setIsStuck] = useState<boolean>(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(entry ? !entry.isIntersecting : false),
      { threshold: [0], rootMargin: "0px" },
    );
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return { ref, isStuck };
}

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
    downloadButtonState,
  } = props;
  const { track } = useAnalytics();
  const { setCurrentToastProps } = useOakNotificationsContext();
  const { ref, isStuck } = useDetectStuck();

  const backgroundColorLevel = phase === "primary" ? 4 : 3;

  const {
    setShowDownloadMessage,
    setDownloadError,
    setDownloadInProgress,
    downloadInProgress,
    setShowIncompleteMessage,
  } = downloadButtonState;

  const isStickyHeaderExperiement = true;

  const HeaderFooterComponent = isStickyHeaderExperiement
    ? StickyHeaderNavFooter
    : HeaderNavFooter;

  return (
    <>
      <Header
        {...props}
        layoutVariant="compact"
        backgroundColorLevel={backgroundColorLevel}
      />
      <HeaderFooterComponent
        ref={ref}
        isStuck={isStuck}
        type="unit"
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
                page: "integrated-unit-overview",
                unitSlug: prevUnit.slug,
                programmeSlug,
              })
            : undefined
        }
        nextHref={
          nextUnit
            ? resolveOakHref({
                page: "integrated-unit-overview",
                unitSlug: nextUnit.slug,
                programmeSlug,
              })
            : undefined
        }
        actionButton={
          unitDownloadFileId ? (
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
                  track.unitDownloadInitiated({
                    platform: "owa",
                    product: "teacher lesson resources",
                    engagementIntent: "use",
                    componentType: "unit_download_button",
                    eventVersion: "2.0.0",
                    analyticsUseCase: "Teacher",
                    ...trackingProps,
                  });
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
              />
            </NegativeBorderBox>
          ) : undefined
        }
      />
    </>
  );
};

export default UnitHeader;
