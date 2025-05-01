import { join } from "path";

import { FC } from "react";
import { OakHeading, OakFlex, OakBox } from "@oaknational/oak-components";
import { useRouter } from "next/router";

import BulletList from "../OakComponentsKitchen/BulletList";
import CurricUnitCard from "../CurricUnitCard/CurricUnitCard";

import Button from "@/components/SharedComponents/Button";
import { CurricUnitDetails } from "@/components/CurriculumComponents/CurricUnitDetails";
import { getYearGroupTitle } from "@/utils/curriculum/formatting";
import {
  notUndefined,
  Unit,
  YearData,
  UnitOption,
} from "@/utils/curriculum/types";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { ComponentTypeValueType } from "@/browser-lib/avo/Avo";
import { getTitleFromSlug } from "@/fixtures/shared/helper";
import { getIsUnitDescriptionEnabled } from "@/utils/curriculum/features";

type CurricUnitModalProps = {
  unitData: Unit | null;
  yearData: YearData;
  selectedThread: string | null;
  basePath: string;
  unitOptionData: UnitOption | undefined;
};

const CurricUnitModal: FC<CurricUnitModalProps> = ({
  unitData,
  unitOptionData,
  yearData,
  selectedThread,
  basePath,
}) => {
  const unitOptionsAvailable =
    !unitOptionData && (unitData?.unit_options ?? []).length > 0;
  const router = useRouter();
  const { track } = useAnalytics();
  const optionalityModalOpen = false;

  const subjectTitle =
    unitData?.actions?.programme_field_overrides?.subject ?? unitData?.subject;

  const yearTitle = unitData
    ? getYearGroupTitle(
        yearData,
        unitData.actions?.programme_field_overrides?.year_slug ?? unitData.year,
      )
    : "";

  const handleUnitOverviewExploredAnalytics = (
    componentType: ComponentTypeValueType,
  ) => {
    if (unitData) {
      track.unitOverviewExplored({
        subjectTitle: unitData.subject,
        subjectSlug: unitData.subject_slug,
        yearGroupName: `Year ${unitData.year}`,
        yearGroupSlug: `year-${unitData.year}`,
        unitName: unitData.title,
        unitSlug: unitData.slug,
        platform: "owa",
        product: "curriculum visualiser",
        engagementIntent: "explore",
        componentType,
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
        threadTitle: getTitleFromSlug(selectedThread || undefined) || "",
        threadSlug: selectedThread || "",
      });
    }
  };

  const isUnitDescriptionEnabled = getIsUnitDescriptionEnabled(unitData);

  return (
    <>
      {unitData && (
        <OakFlex
          $flexDirection={"column"}
          $maxWidth={"100%"}
          $justifyContent={"space-between"}
          $width={"100%"}
          $overflowY={"scroll"}
          $mt="space-between-xxl"
        >
          <OakBox $ph={["inner-padding-xl", "inner-padding-xl7"]}>
            <OakBox
              $display={unitOptionData ? "block" : "none"}
              $mb="space-between-s"
            >
              <Button
                $mt={2}
                icon="chevron-left"
                label="Back to unit options info"
                variant="minimal"
                $font={"heading-7"}
                iconBackground={undefined}
                background={undefined}
                onClick={() => {
                  const url = join(basePath, unitData.slug);
                  router.push(url, undefined, { shallow: true });
                }}
              />
            </OakBox>

            <OakFlex $gap="all-spacing-2" $flexWrap={"wrap"}>
              <BulletList
                items={[subjectTitle, yearTitle]
                  .filter(notUndefined)
                  .map((text) => ({ text }))}
              />
            </OakFlex>

            <OakHeading tag="h2" $font={"heading-5"}>
              {unitData.title}
            </OakHeading>
            {!unitOptionsAvailable && (
              <OakBox $display={optionalityModalOpen ? "none" : "block"}>
                <CurricUnitDetails
                  unit={unitData}
                  handleUnitOverviewExploredAnalytics={
                    handleUnitOverviewExploredAnalytics
                  }
                  isUnitDescriptionEnabled={isUnitDescriptionEnabled}
                />
              </OakBox>
            )}

            <OakFlex
              $flexDirection={"column"}
              $display={optionalityModalOpen ? "none" : "flex"}
            >
              {unitOptionsAvailable && (
                <OakBox
                  $position={"relative"}
                  $background={"pink30"}
                  $pa={"inner-padding-xl"}
                  $mt={"space-between-l"}
                  $pb={"inner-padding-none"}
                  data-testid="unit-options-card"
                  $borderRadius={"border-radius-s"}
                >
                  <OakHeading
                    tag="h4"
                    $font={"heading-6"}
                    $mb="space-between-m"
                    data-testid="unit-options-heading"
                  >
                    Unit options
                  </OakHeading>
                  <OakFlex
                    key={`unit-options-${unitData.slug}-list`}
                    $flexDirection={["row"]}
                    $gap="all-spacing-6"
                    $flexWrap={"wrap"}
                    role="list"
                  >
                    {unitData.unit_options.map((optionalUnit, index) => {
                      const href = join(basePath, optionalUnit.slug ?? "");
                      return (
                        <OakFlex
                          key={`unit-option-${optionalUnit.unitvariant_id}-${index}`}
                          $width={"all-spacing-19"}
                          $flexGrow={1}
                          $position={"relative"}
                          role="listitem"
                        >
                          <CurricUnitCard
                            unit={optionalUnit}
                            index={index}
                            isHighlighted={false}
                            href={href}
                          />
                        </OakFlex>
                      );
                    })}
                    {/* Empty tiles for correct flex wrapping */}
                    {Array(2)
                      .fill(true)
                      .map((item, index) => {
                        return (
                          <OakFlex
                            key={`unit-options-${index}-${item}-item`}
                            $width={"all-spacing-19"}
                            $flexGrow={1}
                            $position={"relative"}
                          />
                        );
                      })}
                  </OakFlex>
                </OakBox>
              )}
            </OakFlex>
          </OakBox>
        </OakFlex>
      )}
    </>
  );
};
export default CurricUnitModal;
