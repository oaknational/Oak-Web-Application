"use client";
import {
  OakBox,
  OakFlex,
  OakFlexProps,
  OakIcon,
  OakSmallPrimaryInvertedButton,
  OakTertiaryInvertedButton,
  OakUiRoleToken,
} from "@oaknational/oak-components";

import UnitDownloadButton, {
  useUnitDownloadButtonState,
} from "@/components/TeacherComponents/UnitDownloadButton/UnitDownloadButton";
import {
  CompactHeaderProps,
  Header,
} from "@/components/TeacherComponents/Header/Header";
import { NeighbourUnit } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";
import { resolveOakHref } from "@/common-lib/urls";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";

export type UnitHeaderProps = Omit<
  CompactHeaderProps,
  "layoutVariant" | "backgroundColorLevel"
> & {
  phase: "primary" | "secondary" | "foundation";
  unitDownloadFileId?: string;
  isGeorestrictedUnit?: boolean;
  nextUnit: NeighbourUnit;
  prevUnit: NeighbourUnit;
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

const UnitHeader = (props: UnitHeaderProps) => {
  const {
    subjectPhaseSlug,
    phase,
    unitDownloadFileId,
    isGeorestrictedUnit,
    trackingProps,
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
      <OakFlex
        $background={
          `bg-decorative${backgroundColorLevel}-subdued` as OakUiRoleToken
        }
        $width={"100%"}
        $pv={"spacing-24"}
        $ph={["spacing-20", "spacing-40"]}
        $flexDirection={["column", "row"]}
        $gap={"spacing-24"}
        $justifyContent="center"
      >
        <OakFlex
          $justifyContent={"space-between"}
          $width={"100%"}
          $gap={"spacing-16"}
          $maxWidth="spacing-1280"
        >
          <OakFlex $gap={"spacing-32"} $alignItems={"center"}>
            <OakTertiaryInvertedButton
              iconName="list"
              element="a"
              href={resolveOakHref({
                page: "teacher-programme",
                subjectPhaseSlug,
                tab: "units",
              })}
            >
              View all units
            </OakTertiaryInvertedButton>
            <OakBox
              $bl={"border-solid-m"}
              $display={["none", "flex"]}
              $height={"spacing-24"}
              $borderColor={
                `border-decorative${backgroundColorLevel}` as OakUiRoleToken
              }
            />
            <UnitNavButtons
              display={["none", "flex"]}
              {...props}
              backgroundColorLevel={backgroundColorLevel}
            />
          </OakFlex>
          {unitDownloadFileId && (
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
          )}
        </OakFlex>
        <OakBox
          $display={["block", "none"]}
          $bt={"border-solid-m"}
          $borderColor={
            `border-decorative${backgroundColorLevel}` as OakUiRoleToken
          }
          $width={"100%"}
        />
        <UnitNavButtons
          display={["flex", "none"]}
          {...props}
          backgroundColorLevel={backgroundColorLevel}
        />
      </OakFlex>
    </>
  );
};

const UnitNavButtons = ({
  display,
  backgroundColorLevel,
  nextUnit,
  prevUnit,
  programmeSlug,
}: {
  display: OakFlexProps["$display"];
  backgroundColorLevel: CompactHeaderProps["backgroundColorLevel"];
} & UnitHeaderProps) => {
  const iconColor = `icon-decorative${backgroundColorLevel}` as OakUiRoleToken;
  return (
    <OakFlex $display={display} $gap={"spacing-16"}>
      {prevUnit && (
        <OakSmallPrimaryInvertedButton
          element="a"
          href={resolveOakHref({
            page: "unit-page",
            unitSlug: prevUnit.slug,
            subjectPhaseSlug: programmeSlug,
          })}
          iconOverride={
            <OakIcon
              iconName="arrow-left"
              $color={iconColor}
              $width={"spacing-24"}
              $height="spacing-24"
            />
          }
        >
          Previous unit
        </OakSmallPrimaryInvertedButton>
      )}
      {nextUnit && (
        <OakSmallPrimaryInvertedButton
          element="a"
          href={resolveOakHref({
            page: "unit-page",
            unitSlug: nextUnit.slug,
            subjectPhaseSlug: programmeSlug,
          })}
          isTrailingIcon
          iconOverride={
            <OakIcon
              iconName="arrow-right"
              $color={iconColor}
              $width={"spacing-24"}
              $height="spacing-24"
            />
          }
        >
          Next unit
        </OakSmallPrimaryInvertedButton>
      )}
    </OakFlex>
  );
};

export default UnitHeader;
