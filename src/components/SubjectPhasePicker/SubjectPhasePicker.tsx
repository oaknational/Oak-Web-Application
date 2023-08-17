import { FC, useState } from "react";
import { FocusOn } from "react-focus-on";
import styled from "styled-components";
import router from "next/router";

import BrushBorders from "@/components/SpriteSheet/BrushSvgs/BrushBorders";
import Grid, { GridArea } from "@/components/Grid";
import { Heading, Span } from "@/components/Typography";
import Box from "@/components/Box";
import BoxBorders from "@/components/SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";
import Button from "@/components/Button/Button";
import P from "@/components/Typography/P";
import {
  Examboard,
  Phase,
  Subject,
  SubjectPhaseOption,
} from "@/node-lib/curriculum-api-2023";
import UnstyledButton from "@/components/UnstyledButton/UnstyledButton";
import Svg from "@/components/Svg";
import { OakColorName } from "@/styles/theme";
import Icon from "@/components/Icon";

/**
 * Interface to pick a subject (new or legacy), phase, and if applicable, an exam board.
 * ## Usage
 * Used on curriculum homepage, new curriculum pages, legacy curriculum pages.
 */

export type SubjectPhasePickerData = {
  newSubjects: SubjectPhaseOption[];
  legacySubjects: SubjectPhaseOption[];
};

const SelectButton = styled(UnstyledButton)<object>`
  position: relative;
  width: 100%;

  svg[name="box-border-left"] {
    display: none;
  }

  svg[name="underline-1"] {
    display: none;
    position: absolute;
  }

  &:focus {
    outline: none;

    svg[name="underline-1"] {
      display: block;
      bottom: -4px;
      left: -4px;
      width: calc(100% + 8px);
      height: 10px;
      transform: rotate(-1deg);
    }
  }

  &:hover {
    text-decoration: underline;
  }
`;

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

const ButtonFocusUnderline = styled(Svg)<{ $color: OakColorName }>`
  color: ${(props) => props.$color};
`;

const SubjectPhasePicker: FC<SubjectPhasePickerData> = ({
  newSubjects,
  legacySubjects,
}) => {
  interface SelectedSubject extends SubjectPhaseOption {
    isNew: boolean;
  }

  const phases = [
    { title: "Primary", slug: "primary", isHidden: false },
    { title: "Secondary", slug: "secondary", isHidden: false },
  ];

  const [showSubjects, setShowSubjects] = useState(false);
  const [showPhases, setShowPhases] = useState(false);
  const [selectedSubject, setSelectedSubject] =
    useState<SelectedSubject | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [selectedExamboard, setSelectedExamboard] = useState<Examboard | null>(
    null
  );
  const [showSubjectError, setShowSubjectError] = useState(false);
  const [showPhaseError, setShowPhaseError] = useState(false);
  const [showExamboardError, setShowExamboardError] = useState(false);

  const toggleShowSubjects = () => {
    setShowSubjects(!showSubjects);
    setShowPhases(false);
  };

  const toggleShowPhases = () => {
    setShowPhases(!showPhases);
    setShowSubjects(false);
  };

  const handleSelectSubject = (
    subject: SubjectPhaseOption,
    isNew: boolean
  ): void => {
    setShowSubjectError(false);
    setSelectedExamboard(null);
    setSelectedSubject({
      ...subject,
      isNew,
    });
    if (
      selectedPhase &&
      !subject.phases.some((phase) => phase.slug === selectedPhase.slug)
    ) {
      setSelectedPhase(null);
    }
    setShowSubjects(false);
    setShowPhases(true);
  };

  const handleSelectPhase = (phase: Phase): void => {
    setShowPhaseError(false);
    setShowExamboardError(false);
    setSelectedExamboard(null);
    setSelectedPhase(phase);
    if (
      phase.slug == "primary" ||
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
      selectedPhase?.slug == "secondary" &&
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
      router.push({
        pathname: `/beta/teachers/curriculum/${subjectPhaseSlug}`,
      });
    }
  };

  const labelColor = (hasError: boolean) => {
    return hasError ? "failure" : "inherit";
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

  const isSelected = (option: Subject | Phase | Examboard, isNew = false) => {
    return (
      (option.slug == selectedSubject?.slug &&
        isNew == selectedSubject?.isNew) ||
      option.slug == selectedPhase?.slug ||
      option.slug == selectedExamboard?.slug
    );
  };

  return (
    <Box
      $position="relative"
      data-testid="subjectPhasePicker"
      $zIndex={"mobileFilters"}
      $background="white"
    >
      <BoxBorders />
      <Grid $position="relative">
        <GridArea $colSpan={[12, 5]} $mr={8}>
          <Box $ph={16} $pv={12}>
            <SelectButton
              $ph={16}
              $pv={12}
              onClick={toggleShowSubjects}
              title="Subject"
            >
              <BoxBorders hideBottom={true} hideTop={true} />
              <Heading tag={"h3"} $font={"heading-light-7"} $mb={4}>
                Subject
              </Heading>
              <P $color={labelColor(showSubjectError)}>
                {showSubjectError && (
                  <>
                    <Icon
                      $color={"failure"}
                      name="content-guidance"
                      verticalAlign="bottom"
                    />
                    <span>Please select a subject</span>
                  </>
                )}
                {selectedSubject && (
                  <>
                    {selectedSubject.title}
                    {selectedSubject.isNew && " (new)"}
                  </>
                )}
                {!showSubjectError && !selectedSubject && "Select"}
              </P>
              <ButtonFocusUnderline $color={"black"} name="underline-1" />
            </SelectButton>
          </Box>
          {showSubjects && (
            <Box
              $background={"white"}
              $dropShadow="interactiveCardHover"
              $left={0}
              $mt={8}
              $pa={32}
              $position="absolute"
              $top={"100%"}
              $zIndex={"inFront"}
              $width={"100%"}
            >
              <BoxBorders />
              <FocusOn
                onClickOutside={() => setShowSubjects(false)}
                onEscapeKey={() => setShowSubjects(false)}
                scrollLock={false}
              >
                <Heading tag={"h4"} $font={"heading-light-7"} $mb={16}>
                  Latest Resources
                  <Box
                    $background="black"
                    $color="white"
                    $display="inline-block"
                    $dropShadow="subjectCard"
                    $font="heading-light-7"
                    $ml={12}
                    $pa={1}
                    $position="relative"
                  >
                    <BrushBorders color="black" />
                    New
                  </Box>
                </Heading>
                <P $mb={16}>Explore our new curricula for 2023/2024.</P>
                {newSubjects.map((subject) => (
                  <ButtonContainer
                    className={isSelected(subject, true) ? "selected" : ""}
                    key={subject.slug}
                  >
                    <Button
                      $mb={24}
                      $mr={24}
                      background={
                        isSelected(subject, true) ? "black" : "oakGrey1"
                      }
                      subjectIcon={subject.slug}
                      label={subject.title}
                      onClick={() => handleSelectSubject(subject, true)}
                      title={subject.title}
                    />
                  </ButtonContainer>
                ))}
                <Heading tag={"h4"} $font={"heading-light-7"} $mb={16} $mt={16}>
                  Legacy Resources
                </Heading>
                <P $mb={16}>Curricula from year 2020-2022.</P>
                {legacySubjects.map((subject) => (
                  <ButtonContainer
                    className={isSelected(subject) ? "selected" : ""}
                    key={subject.slug}
                  >
                    <Button
                      background={isSelected(subject) ? "black" : "oakGrey1"}
                      subjectIcon={subject.slug}
                      label={subject.title}
                      $mb={16}
                      $mr={16}
                      onClick={() => handleSelectSubject(subject, false)}
                      title={subject.title}
                    />
                  </ButtonContainer>
                ))}
              </FocusOn>
            </Box>
          )}
        </GridArea>

        <GridArea $colSpan={[12, 5]} $position="relative" $mr={16}>
          <Box $ph={16} $pv={12}>
            <SelectButton
              $ph={16}
              $pv={12}
              onClick={toggleShowPhases}
              title="Phase"
            >
              <Heading tag={"h3"} $font={"heading-light-7"} $mb={4}>
                Phase
              </Heading>
              <P $color={labelColor(showPhaseError || showExamboardError)}>
                {showPhaseError && (
                  <>
                    <Icon
                      $color={"failure"}
                      name="content-guidance"
                      verticalAlign="bottom"
                    />
                    Please select a phase
                  </>
                )}
                {showExamboardError && (
                  <>
                    <Icon
                      $color={"failure"}
                      name="content-guidance"
                      verticalAlign="bottom"
                    />
                    Select an exam board
                  </>
                )}
                {selectedPhase && !showExamboardError && (
                  <>
                    <Span>{selectedPhase.title}</Span>
                    {selectedExamboard && (
                      <Span>, {selectedExamboard.title}</Span>
                    )}
                  </>
                )}
                {!selectedPhase &&
                  !showPhaseError &&
                  !showExamboardError &&
                  "Select"}
              </P>
              <ButtonFocusUnderline $color={"black"} name="underline-1" />
            </SelectButton>
          </Box>
          {showPhases && (
            <Box
              $background={"white"}
              $dropShadow="interactiveCardHover"
              $left={0}
              $mt={8}
              $pa={32}
              $position="absolute"
              $top={"100%"}
              $zIndex={"inFront"}
            >
              <BoxBorders />
              <FocusOn
                onClickOutside={() => setShowPhases(false)}
                onEscapeKey={() => setShowPhases(false)}
                scrollLock={false}
              >
                <Heading tag={"h4"} $font={"heading-light-7"} $mb={16}>
                  Choose a school phase:
                </Heading>
                {(selectedSubject?.phases ?? phases).map((phase) => (
                  <ButtonContainer className="multi-line" key={phase.slug}>
                    <Button
                      $mr={24}
                      background={isSelected(phase) ? "black" : "oakGrey1"}
                      label={phaseLabel(phase)}
                      onClick={() => handleSelectPhase(phase)}
                      title={phase.title}
                    />
                  </ButtonContainer>
                ))}
                {selectedPhase?.slug == "secondary" &&
                  selectedSubject?.examboards && (
                    <>
                      <Heading
                        tag={"h4"}
                        $color={labelColor(showExamboardError)}
                        $font={"heading-light-7"}
                        $mb={16}
                        $mt={16}
                      >
                        {showExamboardError ? (
                          <>
                            <Icon
                              $color={"failure"}
                              name="content-guidance"
                              verticalAlign="bottom"
                            />
                            <span>Please select an exam board</span>
                          </>
                        ) : (
                          "Exam board"
                        )}
                      </Heading>
                      {selectedSubject.examboards.map((examboard) => (
                        <ButtonContainer key={examboard.slug}>
                          <Button
                            $mr={24}
                            background={
                              isSelected(examboard) ? "black" : "oakGrey1"
                            }
                            label={examboard.title}
                            onClick={() => handleSelectExamboard(examboard)}
                            size="large"
                            title={examboard.title}
                          />
                        </ButtonContainer>
                      ))}
                    </>
                  )}
              </FocusOn>
            </Box>
          )}
        </GridArea>

        <GridArea $colSpan={[12, 2]}>
          <Button
            $ma={24}
            label="View"
            icon="arrow-right"
            $iconPosition="trailing"
            iconBackground="transparent"
            onClick={handleViewCurriculum}
            size="large"
          />
        </GridArea>
      </Grid>
    </Box>
  );
};

export default SubjectPhasePicker;
