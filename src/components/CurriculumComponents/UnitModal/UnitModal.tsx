import { FC, useState, useEffect } from "react";
import { OakHeading, OakFlex, OakBox, OakP } from "@oaknational/oak-components";

import BulletList from "../OakComponentsKitchen/BulletList";
import CurriculumUnitCard from "../CurriculumUnitCard/CurriculumUnitCard";

import Flex from "@/components/SharedComponents/Flex.deprecated";
import Box from "@/components/SharedComponents/Box";
import Button from "@/components/SharedComponents/Button";
import {
  CurriculumUnitDetailsProps,
  CurriculumUnitDetails,
} from "@/components/CurriculumComponents/CurriculumUnitDetails";
import { getYearGroupTitle } from "@/utils/curriculum/formatting";
import { notUndefined, Unit, YearData } from "@/utils/curriculum/types";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { ComponentTypeValueType } from "@/browser-lib/avo/Avo";
import { getTitleFromSlug } from "@/fixtures/shared/helper";

type UnitModalProps = {
  unitData: Unit | null;
  yearData: YearData;
  displayModal: boolean;
  setUnitOptionsAvailable: (x: boolean) => void;
  setCurrentUnitLessons: (x: Lesson[]) => void;
  setUnitVariantID: (x: number | null) => void;
  unitOptionsAvailable: boolean;
  selectedThread: string | null;
};

export type Lesson = {
  title: string;
  slug?: string;
  _state?: string;
};

const UnitModal: FC<UnitModalProps> = ({
  unitData,
  yearData,
  displayModal,
  setUnitOptionsAvailable,
  setCurrentUnitLessons,
  setUnitVariantID,
  unitOptionsAvailable,
  selectedThread,
}) => {
  const { track } = useAnalytics();

  const [optionalityModalOpen, setOptionalityModalOpen] =
    useState<boolean>(false);

  const [curriculumUnitDetails, setCurriculumUnitDetails] =
    useState<CurriculumUnitDetailsProps | null>(null);

  const handleOptionalityModal = () => {
    setOptionalityModalOpen((prev) => !prev);
  };

  useEffect(() => {
    if (displayModal === false) {
      setCurriculumUnitDetails(null);
      setOptionalityModalOpen(false);
      setUnitOptionsAvailable(false);
      setUnitVariantID(null);
    }

    if (optionalityModalOpen) {
      setUnitOptionsAvailable(false);
    }
  }, [
    displayModal,
    setUnitOptionsAvailable,
    optionalityModalOpen,
    setUnitVariantID,
  ]);

  const subjectTitle =
    unitData?.actions?.programme_field_overrides?.subject ?? unitData?.subject;

  const yearTitle = unitData
    ? getYearGroupTitle(
        yearData,
        unitData.actions?.programme_field_overrides?.Year ?? unitData.year,
      )
    : "";

  const handleUnitOverviewExploredAnalytics = (
    componentType: ComponentTypeValueType,
  ) => {
    track.unitOverviewExplored({
      subjectTitle: unitData?.subject || "", // string
      subjectSlug: unitData?.subject_slug || "", // string
      threadTitle: getTitleFromSlug(selectedThread || undefined) || "", // string // check if this is selected thread??
      threadSlug: selectedThread || "", // string
      yearGroupName: `Year ${unitData?.year}`, // string
      yearGroupSlug: `year-${unitData?.year}`, // string
      unitName: unitData?.title || "", // string
      unitSlug: unitData?.slug || "", // string
      platform: "owa", // string ( allowed values: "owa", "aila-beta")
      product: "curriculum visualiser", // string ( allowed values: "ai lesson assistant", "curriculum visualiser", "curriculum resources", "pupil lesson activities", "teacher lesson resources")
      engagementIntent: "explore", // string ( allowed values: "explore", "refine", "use", "advocate")
      componentType, // string ( allowed values: "hamburger_menu_button", "text_input", "regenerate_response_button", "select_oak_lesson", "type_edit", "lesson_finish_check", "continue_button", "continue_text", "go_to_share_page_button", "example_lesson_button", "homepage_primary_create_a_lesson_button", "homepage_secondary_create_a_lesson_button", "footer_menu_link", "download_button", "homepage_button", "curriculum_visualiser_button", "see_lessons_in_unit_button", "year_group_button", "learning_tier_button", "subject_category_button", "unit_info_button", "lessons_in_unit", "previous_unit_desc", "following_unit_desc", "video", "filter_link", "keystage_keypad_button", "lesson_card", "lesson_download_button", "programme_card", "search_button", "search_result_item", "share_button", "subject_card", "unit_card", "homepage_tab", "landing_page_button", "why_this_why_now", "unit_sequence_tab", "download_tab", "explainer_tab", "aims_and_purpose", "oak_curriculum_principles", "oak_subject_principles", "national_curriculum", "curriculum_delivery", "curiculum_coherence", "recommendations_from_subject_specific_reports", "subject_specific_needs", "our_curriculum_partner")
      eventVersion: "2.0.0", // string ( allowed values: "2.0.0")
      analyticsUseCase: "Teacher", // string ( allowed values: "Pupil", "Teacher")
    });
  };

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
              $display={optionalityModalOpen ? "block" : "none"}
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
                  handleOptionalityModal();
                  setUnitOptionsAvailable(true);
                  setCurriculumUnitDetails(null);
                  setUnitVariantID(null);
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

            {curriculumUnitDetails && (
              <OakP
                $mt={"space-between-ssx"}
                $mb={"space-between-xs"}
                data-testid="unit-optionality-title"
              >
                {unitData.title}
              </OakP>
            )}

            <OakHeading tag="h2" $font={"heading-5"}>
              {!curriculumUnitDetails
                ? unitData.title
                : curriculumUnitDetails.unitTitle}
            </OakHeading>
            {!unitOptionsAvailable && (
              <OakBox $display={optionalityModalOpen ? "none" : "block"}>
                <CurriculumUnitDetails
                  handleUnitOverviewExploredAnalytics={
                    handleUnitOverviewExploredAnalytics
                  }
                  threads={unitData.threads}
                  cycle={unitData.cycle}
                  whyThisWhyNow={unitData.why_this_why_now}
                  description={unitData.description}
                  lessons={unitData.lessons}
                  priorUnitDescription={
                    unitData.connection_prior_unit_description
                  }
                  futureUnitDescription={
                    unitData.connection_future_unit_description
                  }
                  priorUnitTitle={unitData.connection_prior_unit_title}
                  futureUnitTitle={unitData.connection_future_unit_title}
                />
              </OakBox>
            )}

            {/* @todo replace with OakFlex once display is fixed in OakFlex - currently display: flex overwrites "none" */}
            <Flex
              $flexDirection={"column"}
              $display={optionalityModalOpen ? "none" : "flex"}
            >
              {unitOptionsAvailable && (
                <Box
                  $position={"relative"}
                  $background={"pink30"}
                  $pa={24}
                  $mt={40}
                  $pb={0}
                  data-testid="unit-options-card"
                  $borderRadius={4}
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
                    $flexDirection={["row"]}
                    $gap="all-spacing-6"
                    $flexWrap={"wrap"}
                  >
                    {unitData.unit_options.map((optionalUnit, index) => {
                      return (
                        <OakFlex
                          $width={"all-spacing-19"}
                          $flexGrow={1}
                          $position={"relative"}
                        >
                          <CurriculumUnitCard
                            unit={optionalUnit}
                            index={index}
                            isHighlighted={false}
                            onClick={() => {
                              handleOptionalityModal();
                              setUnitOptionsAvailable(false);
                              setUnitVariantID(optionalUnit.unitvariant_id);
                              setCurrentUnitLessons(optionalUnit.lessons);
                              setCurriculumUnitDetails({
                                unitTitle: optionalUnit.title,
                                threads: unitData.threads,
                                lessons: optionalUnit.lessons,
                                priorUnitDescription:
                                  optionalUnit.connection_prior_unit_description,
                                futureUnitDescription:
                                  optionalUnit.connection_future_unit_description,
                                priorUnitTitle:
                                  optionalUnit.connection_prior_unit_title,
                                futureUnitTitle:
                                  optionalUnit.connection_future_unit_title,
                                description: optionalUnit.description,
                                whyThisWhyNow: optionalUnit.why_this_why_now,
                                cycle: unitData.cycle,
                                handleUnitOverviewExploredAnalytics:
                                  handleUnitOverviewExploredAnalytics,
                              });
                            }}
                          />
                        </OakFlex>
                      );
                    })}
                    {/* Empty tiles for correct flex wrapping */}
                    {Array(2)
                      .fill(true)
                      .map(() => {
                        return (
                          <OakFlex
                            $width={"all-spacing-19"}
                            $flexGrow={1}
                            $position={"relative"}
                          />
                        );
                      })}
                  </OakFlex>
                </Box>
              )}
            </Flex>

            {curriculumUnitDetails && (
              <OakBox $display={optionalityModalOpen ? "block" : "none"}>
                <CurriculumUnitDetails {...curriculumUnitDetails} />
              </OakBox>
            )}
          </OakBox>
        </OakFlex>
      )}
    </>
  );
};
export default UnitModal;
