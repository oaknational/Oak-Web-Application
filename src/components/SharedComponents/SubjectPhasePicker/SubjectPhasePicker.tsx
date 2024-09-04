import { FC, useState, useId } from "react";
import { FocusOn } from "react-focus-on";
import styled from "styled-components";
import { useRouter } from "next/router";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakP,
  OakPrimaryButton,
  OakSpan,
} from "@oaknational/oak-components";

import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";

import OwaLink from "@/components/SharedComponents/OwaLink";
import Box from "@/components/SharedComponents/Box";
import Button from "@/components/SharedComponents/Button/Button";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import {
  Examboard,
  Phase,
  Subject,
  SubjectPhaseOption,
} from "@/node-lib/curriculum-api-2023";
import Icon from "@/components/SharedComponents/Icon";
import { CurriculumTab } from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import FocusIndicator from "@/components/CurriculumComponents/OakComponentsKitchen/FocusIndicator";

/**
 * Interface to pick a subject, phase, and if applicable, an exam board.
 * ## Usage
 * Used on curriculum homepage, new curriculum pages.
 */

export type SubjectPhasePickerData = {
  subjects: SubjectPhaseOption[];
  currentSelection?: {
    subject: SubjectPhaseOption;
    phase: Phase;
    examboard: Examboard | null;
  };
  tab?: CurriculumTab;
};

const ButtonContainer = styled.div`
  display: inline-block;

  &.multi-line {
    button {
      height: auto;
      padding-top: 10px;
      padding-bottom: 10px;
    }

    span {
      white-space: pre;
    }
  }

  &.selected img {
    filter: invert(1);
  }
`;

const FocusIndicatorAlt = styled(FocusIndicator)<object>`
  &:hover {
    background: #f2f2f2;
  }
`;

const SchoolPhaseDropDownBox = styled(Box)<object>`
  width: 204%;
  left: -104%;

  @media (min-width: 768px) {
    width: 100%;
    left: 0;
  }
`;

const SubjectPhasePicker: FC<SubjectPhasePickerData> = ({
  subjects,
  currentSelection,
  tab = "units",
}) => {
  const router = useRouter();
  const examboardErrorId = useId();
  const phaseErrorId = useId();
  const subjectErrorId = useId();

  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

  const phases = [
    { title: "Primary", slug: "primary" },
    { title: "Secondary", slug: "secondary" },
  ];

  const initialSubject = subjects.find(
    (option) => option.slug === currentSelection?.subject.slug,
  );

  const initialPhase = initialSubject?.phases.find(
    (option) => option.slug === currentSelection?.phase.slug,
  );

  const initialExamboard = initialSubject?.examboards?.find(
    (option) => option.slug === currentSelection?.examboard?.slug,
  );

  const [showSubjects, setShowSubjects] = useState(false);
  const [showPhases, setShowPhases] = useState(false);
  const [selectedSubject, setSelectedSubject] =
    useState<SubjectPhaseOption | null>(initialSubject || null);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(
    initialPhase || null,
  );
  const [selectedExamboard, setSelectedExamboard] = useState<Examboard | null>(
    initialExamboard || null,
  );
  const [showSubjectError, setShowSubjectError] = useState(false);
  const [showPhaseError, setShowPhaseError] = useState(false);
  const [showExamboardError, setShowExamboardError] = useState(false);

  const schoolPhaseInputId = useId();
  const examBoardInputId = useId();
  const subjectInputId = useId();

  const toggleShowSubjects = () => {
    setShowSubjects(!showSubjects);
    setShowPhases(false);
  };

  const toggleShowPhases = () => {
    setShowPhases(!showPhases);
    setShowSubjects(false);
  };

  const handleSelectSubject = (subject: SubjectPhaseOption): void => {
    setShowSubjectError(false);
    setSelectedExamboard(null);
    setSelectedSubject(subject);
    if (
      selectedPhase &&
      !subject.phases.some((phase) => phase.slug === selectedPhase.slug)
    ) {
      setSelectedPhase(null);
    }
    if (!selectedPhase) {
      setShowPhases(true);
    }
    setShowSubjects(false);
  };

  const handleSelectPhase = (phase: Phase): void => {
    setShowPhaseError(false);
    setShowExamboardError(false);
    setSelectedExamboard(null);
    setSelectedPhase(phase);
    if (
      phase.slug === "primary" ||
      !selectedSubject ||
      !selectedSubject.examboards
    ) {
      setShowPhases(false);
    }
  };

  const handleSelectExamboard = (examboard: Examboard): void => {
    setShowExamboardError(false);
    setSelectedExamboard(examboard);
    setShowPhases(false);
  };

  const trackViewCurriculum = () => {
    if (selectedPhase && selectedSubject) {
      track.curriculumVisualiserAccessed({
        subjectTitle: selectedSubject.title,
        subjectSlug: selectedSubject.slug,
        phase: selectedPhase.slug === "primary" ? "primary" : "secondary",
        analyticsUseCase: analyticsUseCase,
      });
    }
  };

  const handleViewCurriculum = () => {
    let canViewCurriculum = true;
    if (!selectedSubject) {
      canViewCurriculum = false;
      setShowSubjectError(true);
      setShowSubjects(true);
    }
    if (!selectedPhase) {
      canViewCurriculum = false;
      setShowPhaseError(true);
      if (selectedSubject) {
        setShowPhases(true);
      }
    }
    if (
      selectedSubject?.examboards &&
      selectedPhase?.slug === "secondary" &&
      !selectedExamboard
    ) {
      canViewCurriculum = false;
      setShowExamboardError(true);
      setShowPhases(true);
    }
    if (canViewCurriculum) {
      let subjectPhaseSlug = selectedSubject?.slug + "-" + selectedPhase?.slug;
      if (selectedExamboard) {
        subjectPhaseSlug += "-" + selectedExamboard.slug;
      }
      trackViewCurriculum();
      router.push({
        pathname: `/teachers/curriculum/${subjectPhaseSlug}/${tab}`,
      });
    }
  };

  const phaseLabel = (phase: Phase) => {
    switch (phase.slug) {
      case "primary":
        return "Primary\r\nKey Stage 1&2\r\nYears 1-6";
      case "secondary":
        return "Secondary\r\nKey Stage 3&4\r\nYears 7-11";
      default:
        throw new Error("Invalid phase: " + phase.title);
    }
  };

  const isSelected = (option: Subject | Phase | Examboard) => {
    return (
      option.slug === selectedSubject?.slug ||
      option.slug === selectedPhase?.slug ||
      option.slug === selectedExamboard?.slug
    );
  };

  return (
    <OakBox
      $position="relative"
      data-testid="subjectPhasePicker"
      $zIndex={99}
      $maxWidth="all-spacing-23"
      $borderRadius="border-radius-m"
      $borderColor={showSubjects || showPhases ? "transparent" : "black"}
      $ba="border-solid-m"
    >
      <OakFlex
        $position="relative"
        $borderRadius="border-radius-m"
        $alignItems={"center"}
        $justifyContent={"space-between"}
        $gap="space-between-none"
        $flexDirection={["column", "row"]}
        $width={"100%"}
        $background={showSubjects || showPhases ? "grey30" : "white"}
      >
        <OakFlex
          $flexDirection={"row"}
          $alignItems={"center"}
          $justifyContent={"flex-start"}
          $width={["100%", "100%", "100%"]}
        >
          <OakFlex
            $position={"relative"}
            $alignSelf={"stretch"}
            $background={showSubjects ? "white" : null}
            style={{ width: "50%" }}
          >
            <FocusIndicatorAlt
              disableMouseHover={true}
              subFocus={showSubjects}
              $width={"100%"}
            >
              <button
                onClick={toggleShowSubjects}
                title="Subject"
                style={{
                  background: "none",
                  width: "100%",
                  border: "none",
                  padding: 0,
                  outline: "none",
                  textAlign: "left",
                  userSelect: "none",
                }}
              >
                <OakBox
                  $pl="inner-padding-m"
                  $pr="inner-padding-m"
                  $pt="inner-padding-s"
                  $pb="inner-padding-s"
                >
                  <OakHeading
                    tag={"h3"}
                    $font={"heading-light-7"}
                    $mb="space-between-sssx"
                    $color={!showSubjectError ? "black" : "red"}
                    data-testid="selectSubjectHeading"
                  >
                    Subject
                  </OakHeading>
                  <OakP
                    $font={"body-2"}
                    $color={!showSubjectError ? "black" : "red"}
                  >
                    {showSubjectError && (
                      <>
                        <Icon
                          $color={"red"}
                          name="content-guidance"
                          verticalAlign="bottom"
                        />
                        <OakSpan>Select a subject</OakSpan>
                      </>
                    )}
                    {selectedSubject && selectedSubject.title}
                    {!showSubjectError && !selectedSubject && "Select"}
                  </OakP>
                </OakBox>
              </button>
            </FocusIndicatorAlt>
          </OakFlex>
          {showSubjects && (
            <Box
              $background={"white"}
              $dropShadow="interactiveCardHover"
              $left={0}
              $mt={8}
              $pa={32}
              $position="absolute"
              $top={["50%", "100%"]}
              $zIndex={"inFront"}
              $width={"100%"}
            >
              <FocusOn
                autoFocus={false}
                onClickOutside={() => setShowSubjects(false)}
                onEscapeKey={() => setShowSubjects(false)}
                scrollLock={false}
              >
                {showSubjectError && (
                  <Flex id={subjectErrorId} $flexDirection={"row"} $mb={20}>
                    <Icon
                      $color={"red"}
                      name="content-guidance"
                      verticalAlign="bottom"
                    />
                    <OakP $color={"red"}>
                      Select a subject to view a curriculum
                    </OakP>
                  </Flex>
                )}
                <Flex $flexDirection={"row"} $alignItems={"center"} $mb={16}>
                  <OakHeading
                    id={subjectInputId}
                    tag={"h4"}
                    $font={"heading-6"}
                    $mr="space-between-xs"
                    data-testid="subjectDropdownHeading"
                  >
                    Curriculum plans
                  </OakHeading>
                </Flex>
                <OakP $mb="space-between-s">
                  Explore our new curricula for 2023/2024.
                </OakP>
                <Box
                  role="radiogroup"
                  aria-labelledby={subjectInputId}
                  aria-required="true"
                  aria-describedby={
                    showSubjectError ? subjectErrorId : undefined
                  }
                >
                  {subjects.map((subject) => (
                    <ButtonContainer
                      className={isSelected(subject) ? "selected" : ""}
                      key={subject.slug}
                    >
                      <Button
                        role="radio"
                        $mb={24}
                        $mr={24}
                        background={isSelected(subject) ? "black" : "grey20"}
                        subjectIcon={subject.slug}
                        label={subject.title}
                        onClick={() => handleSelectSubject(subject)}
                        aria-checked={isSelected(subject)}
                        title={subject.title}
                      />
                    </ButtonContainer>
                  ))}
                </Box>
                <Box $mt={24}>
                  <OwaLink
                    page={"curriculum-previous-downloads"}
                    $textDecoration={"underline"}
                    $font={"heading-7"}
                    data-testid="previousPlansLink"
                  >
                    Previously released plans
                    <Icon
                      $color={"black"}
                      name="arrow-right"
                      verticalAlign="bottom"
                    />
                  </OwaLink>
                </Box>
              </FocusOn>
            </Box>
          )}
          <Box
            $height={50}
            $width={3}
            $position={"relative"}
            $display={"block"}
            $zIndex={"inFront"}
            style={{ transform: "translate(-50%, 0)" }}
            $visibility={showSubjects || showPhases ? "hidden" : null}
          >
            <BoxBorders
              $color="grey30"
              hideBottom={true}
              hideTop={true}
              hideRight={true}
            />
          </Box>
          <Box $width={["50%", "60%"]} $position={"relative"}>
            <OakFlex
              $position={"relative"}
              $flexDirection={"row"}
              $gap="space-between-s"
              $background={showPhases ? "white" : null}
            >
              <FocusIndicatorAlt
                disableMouseHover={true}
                $borderRadius={"border-radius-m"}
                subFocus={showPhases}
                $width={"100%"}
              >
                <button
                  onClick={toggleShowPhases}
                  title="Phase"
                  style={{
                    background: "none",
                    width: "100%",
                    border: "none",
                    padding: 0,
                    outline: "none",
                    textAlign: "left",
                    userSelect: "none",
                  }}
                >
                  <OakBox
                    $pl="inner-padding-m"
                    $pt="inner-padding-s"
                    $pb="inner-padding-s"
                    style={{ paddingRight: "9rem" }}
                  >
                    <OakHeading
                      tag={"h3"}
                      $font={"heading-light-7"}
                      $mb="space-between-sssx"
                      $color={!showSubjectError ? "black" : "red"}
                      data-testid="selectPhaseHeading"
                    >
                      School phase
                    </OakHeading>
                    <Box
                      $font={"body-2"}
                      $color={
                        !showPhaseError && !showExamboardError ? "black" : "red"
                      }
                    >
                      {showPhaseError && (
                        <>
                          <Icon
                            $color={"red"}
                            name="content-guidance"
                            verticalAlign="bottom"
                          />
                          Select a school phase
                        </>
                      )}
                      {showExamboardError && (
                        <>
                          <Icon
                            $color={"red"}
                            name="content-guidance"
                            verticalAlign="bottom"
                          />
                          Select an exam board option
                        </>
                      )}
                      {selectedPhase && !showExamboardError && (
                        <>
                          <Box
                            $textOverflow={"ellipsis"}
                            $whiteSpace={"nowrap"}
                            $overflowX={"hidden"}
                          >
                            <OakSpan>{selectedPhase.title}</OakSpan>
                            {selectedExamboard && (
                              <OakSpan>, {selectedExamboard.title}</OakSpan>
                            )}
                          </Box>
                        </>
                      )}
                      {!selectedPhase &&
                        !showPhaseError &&
                        !showExamboardError &&
                        "Select"}
                    </Box>
                  </OakBox>
                </button>
              </FocusIndicatorAlt>
              {showPhases && (
                <SchoolPhaseDropDownBox
                  $background={"white"}
                  $dropShadow="interactiveCardHover"
                  $mt={8}
                  $pa={28}
                  $position="absolute"
                  $top={"100%"}
                  $zIndex={"inFront"}
                >
                  <FocusOn
                    autoFocus={false}
                    onClickOutside={() => setShowPhases(false)}
                    onEscapeKey={() => setShowPhases(false)}
                    scrollLock={false}
                  >
                    {showPhaseError && (
                      <Flex id={phaseErrorId} $flexDirection={"row"} $mb={20}>
                        <Icon
                          $color={"red"}
                          name="content-guidance"
                          verticalAlign="bottom"
                        />
                        <OakP $color={"red"}>
                          Select a school phase to view the curriculum
                        </OakP>
                      </Flex>
                    )}
                    {showExamboardError ? (
                      <Flex
                        id={examboardErrorId}
                        $flexDirection={"row"}
                        $mb={20}
                      >
                        <Icon
                          $color={"red"}
                          name="content-guidance"
                          verticalAlign="bottom"
                        />
                        <OakP $color={"red"}>
                          Select an exam board to view the curriculum
                        </OakP>
                      </Flex>
                    ) : (
                      ""
                    )}
                    <OakHeading
                      id={schoolPhaseInputId}
                      tag={"h4"}
                      $font={"heading-6"}
                      $mb="space-between-s"
                      data-testid="phaseDropdownHeading"
                    >
                      Choose a school phase:
                    </OakHeading>
                    <Box
                      radioGroup="radiogroup"
                      aria-labelledby={schoolPhaseInputId}
                      aria-required="true"
                      aria-describedby={
                        showPhaseError ? phaseErrorId : undefined
                      }
                    >
                      {(selectedSubject?.phases ?? phases).map(
                        (phase, index) => (
                          <ButtonContainer
                            className="multi-line"
                            key={phase.slug}
                          >
                            <Button
                              role="radio"
                              $mr={index === 0 ? 28 : 0}
                              $mb={index === 0 ? 16 : 0}
                              $mv={8}
                              background={
                                isSelected(phase) ? "black" : "grey20"
                              }
                              label={phaseLabel(phase)}
                              onClick={() => handleSelectPhase(phase)}
                              aria-checked={isSelected(phase)}
                              title={phase.title}
                            />
                          </ButtonContainer>
                        ),
                      )}
                    </Box>
                    {selectedPhase?.slug === "secondary" &&
                      selectedSubject?.examboards && (
                        <>
                          <OakHeading
                            id={examBoardInputId}
                            $mb="space-between-s"
                            $mt="space-between-m"
                            tag={"h4"}
                            $font={"heading-6"}
                          >
                            Choose an exam board for KS4:
                          </OakHeading>

                          <Box
                            role="radiogroup"
                            aria-labelledby={examBoardInputId}
                            aria-required="true"
                            aria-describedby={
                              showExamboardError ? examboardErrorId : undefined
                            }
                          >
                            {selectedSubject.examboards.map(
                              (examboard, index) => (
                                <ButtonContainer key={examboard.slug}>
                                  <Button
                                    role="radio"
                                    $mr={24}
                                    $mt={index >= 2 ? [16, 0] : 0}
                                    background={
                                      isSelected(examboard) ? "black" : "grey20"
                                    }
                                    label={examboard.title}
                                    onClick={() =>
                                      handleSelectExamboard(examboard)
                                    }
                                    size="large"
                                    title={examboard.title}
                                    aria-checked={isSelected(examboard)}
                                  />
                                </ButtonContainer>
                              ),
                            )}
                          </Box>
                        </>
                      )}
                  </FocusOn>
                </SchoolPhaseDropDownBox>
              )}
              <OakFlex
                $position={"absolute"}
                $right="all-spacing-0"
                $pr="inner-padding-m"
                $alignContent={"center"}
                $maxWidth={"all-spacing-17"}
                $width={["100%", "fit-content"]}
                $height={"100%"}
                $display={["none", "block"]}
                $zIndex={3}
              >
                <OakPrimaryButton
                  iconName="arrow-right"
                  isTrailingIcon={true}
                  onClick={handleViewCurriculum}
                >
                  View
                </OakPrimaryButton>
              </OakFlex>
            </OakFlex>
          </Box>
        </OakFlex>

        <Box
          style={{
            width: "calc(100% - 1rem * 2)",
            transform: "translate(0, 50%)",
          }}
          $height={3}
          $position={"relative"}
          $display={["block", " none"]}
        >
          <BoxBorders
            $color="grey30"
            hideTop={true}
            hideRight={true}
            hideLeft={true}
          />
        </Box>

        <OakFlex
          $pl={"inner-padding-m"}
          $pr={"inner-padding-m"}
          $pt={["inner-padding-s"]}
          $pb={["inner-padding-s"]}
          $width={["100%", "fit-content"]}
          $display={["flex", "none"]}
          $justifyContent="stretch"
        >
          <OakPrimaryButton
            width="100%"
            iconName="arrow-right"
            isTrailingIcon={true}
            onClick={handleViewCurriculum}
          >
            View
          </OakPrimaryButton>
        </OakFlex>
      </OakFlex>
    </OakBox>
  );
};

export default SubjectPhasePicker;
