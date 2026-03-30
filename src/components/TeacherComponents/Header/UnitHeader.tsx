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
} from "../UnitDownloadButton/UnitDownloadButton";

import { CompactHeaderProps, Header } from "./Header";

export type UnitHeaderProps = Omit<CompactHeaderProps, "layoutVariant"> & {
  unitDownloadFileId?: string;
  onUnitDownloadSuccess?: () => void;
  isGeorestrictedUnit?: boolean;
  nextUnit?: string; // TODO: use type
  prevUnit?: string;
};

const UnitHeader = (props: UnitHeaderProps) => {
  const {
    backgroundColorLevel,
    unitDownloadFileId,
    onUnitDownloadSuccess,
    isGeorestrictedUnit,
  } = props;

  const {
    setShowDownloadMessage,
    setDownloadError,
    setDownloadInProgress,
    downloadInProgress,
    setShowIncompleteMessage,
  } = useUnitDownloadButtonState();
  return (
    <>
      <Header {...props} layoutVariant="compact" />
      <OakFlex
        $background={
          `bg-decorative${backgroundColorLevel}-subdued` as OakUiRoleToken
        }
        $width={"100%"}
        $pv={"spacing-24"}
        $ph={["spacing-20", "spacing-24"]}
        $flexDirection={["column", "row"]}
        $gap={"spacing-24"}
      >
        <OakFlex
          $justifyContent={"space-between"}
          $width={"100%"}
          $gap={"spacing-16"}
        >
          <OakFlex $gap={"spacing-32"} $alignItems={"center"}>
            <OakTertiaryInvertedButton iconName="filter">
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
            <UnitNavButtons display={["none", "flex"]} {...props} />
          </OakFlex>
          {unitDownloadFileId && onUnitDownloadSuccess && (
            <UnitDownloadButton
              setDownloadError={setDownloadError}
              setDownloadInProgress={setDownloadInProgress}
              setShowDownloadMessage={setShowDownloadMessage}
              setShowIncompleteMessage={setShowIncompleteMessage}
              downloadInProgress={downloadInProgress}
              unitFileId={unitDownloadFileId}
              onDownloadSuccess={onUnitDownloadSuccess}
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
        <UnitNavButtons display={["flex", "none"]} {...props} />
      </OakFlex>
    </>
  );
};

const UnitNavButtons = ({
  display,
  backgroundColorLevel,
  nextUnit,
  prevUnit,
}: {
  display: OakFlexProps["$display"];
} & UnitHeaderProps) => {
  const iconColor = `icon-decorative${backgroundColorLevel}` as OakUiRoleToken;
  return (
    <OakFlex $display={display} $gap={"spacing-16"}>
      {prevUnit && (
        <OakSmallPrimaryInvertedButton
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
