import {
  OakBox,
  OakFlex,
  OakFlexProps,
  OakLeftAlignedButton,
  OakTertiaryInvertedButton,
  OakUiRoleToken,
} from "@oaknational/oak-components";

import UnitDownloadButton, {
  useUnitDownloadButtonState,
} from "../UnitDownloadButton/UnitDownloadButton";

import { CompactHeaderProps, Header } from "./Header";

export type UnitHeaderProps = CompactHeaderProps & {
  unitDownloadFileId?: string;
  onUnitDownloadSuccess?: () => void;
  isGeorestrictedUnit?: boolean;
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
            <UnitNavButtons display={["none", "flex"]} />
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
        <UnitNavButtons display={["flex", "none"]} />
      </OakFlex>
    </>
  );
};

const UnitNavButtons = ({ display }: { display: OakFlexProps["$display"] }) => {
  return (
    <OakFlex $display={display} $gap={"spacing-16"}>
      <OakLeftAlignedButton iconName="arrow-left">
        Previous unit
      </OakLeftAlignedButton>
      <OakLeftAlignedButton isTrailingIcon iconName="arrow-right">
        Next unit
      </OakLeftAlignedButton>
    </OakFlex>
  );
};

export default UnitHeader;
