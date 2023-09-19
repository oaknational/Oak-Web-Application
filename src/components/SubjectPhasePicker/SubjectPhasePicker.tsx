import { FC, useEffect, useState, useRef } from "react";
import { FocusOn } from "react-focus-on";
import styled from "styled-components";
import { useRouter } from "next/router";

import OakLink from "../OakLink/OakLink";
import Svg from "../Svg";

import { Heading, Span } from "@/components/Typography";
import Box from "@/components/Box";
import BoxBorders from "@/components/SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";
import Button from "@/components/Button/Button";
import P from "@/components/Typography/P";
import Flex from "@/components/Flex";
import {
  Examboard,
  Phase,
  Subject,
  SubjectPhaseOption,
} from "@/node-lib/curriculum-api-2023";
import UnstyledButton from "@/components/UnstyledButton/UnstyledButton";
// import Svg from "@/components/Svg";
import { OakColorName } from "@/styles/theme";
import Icon from "@/components/Icon";
import { CurriculumTab } from "@/pages/[viewType]/curriculum/[subjectPhaseSlug]/[tab]";
import TagPromotional from "@/components/TagPromotional";

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

const SchoolPhaseDropDownBox = styled(Box)<object>`
  width: 200%;
  left: -100%;

  @media (min-width: 768px) {
    width: 100%;
    left: 0;
  }
`;

const SubjectPhasePicker: FC<SubjectPhasePickerData> = ({
  subjects,
  currentSelection,
}) => {
  const router = useRouter();
  const tab = (router.query.tab as CurriculumTab) ?? "overview";
  const path = router.asPath;

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
  const [displayNewBorders, setDisplayNewBorders] = useState<boolean>(true);
  const [phaseBackground, setPhaseBackground] = useState<OakColorName>("white");
  const [subjectBackground, setSubjectBackground] =
    useState<OakColorName>("white");

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
    if (selectedPhase) {
      viewButtonRef.current?.focus();
    } else {
      setShowPhases(true);
    }
    setShowSubjects(false);
  };

  const handleSelectPhase = (phase: Phase): void => {
    setShowPhaseError(false);
    setShowExamboardError(false);
    setSelectedExamboard(null);
    setSelectedPhase(phase);
    viewButtonRef.current?.focus();
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
      viewButtonRef.current?.blur();
      let subjectPhaseSlug = selectedSubject?.slug + "-" + selectedPhase?.slug;
      if (selectedExamboard) {
        subjectPhaseSlug += "-" + selectedExamboard.slug;
      }
      router.push({
        pathname: `/teachers/curriculum/${subjectPhaseSlug}/${tab}`,
      });
    }
  };

  // const labelColor = (hasError: boolean) => {
  //   return hasError ? "failure" : "inherit";
  // };

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

  const ButtonFocusUnderline = styled(Svg)<{ $color: OakColorName }>`
    color: ${(props) => props.$color};
  `;

  /**
   * ! - TODO LIST
   * TODO: Refactor to break down into smaller components
   */

  const viewButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selectedSubject && selectedPhase) {
      setDisplayNewBorders(false);
      setPhaseBackground("white");
      setSubjectBackground("white");
      viewButtonRef.current?.focus();
      console.log("SELECTED SUBJECT AND PHASE");
    }
    // if (
    //   selectedSubject &&
    //   selectedPhase &&
    //   path &&
    //   path.startsWith("/teachers/curriculum/")
    // ) {
    //   viewButtonRef.current?.blur();
    // }

    if (!showPhases && !showSubjects && !selectedSubject && !selectedPhase) {
      setDisplayNewBorders(false);
      setPhaseBackground("white");
      setSubjectBackground("white");
      console.log("ERROR CONSOLE");
    }
    if (showSubjects) {
      setDisplayNewBorders(true);
      setPhaseBackground("grey1");
      setSubjectBackground("white");
      console.log("SHOW SUBJECTS");
    }
    if (showPhases) {
      setDisplayNewBorders(true);
      setPhaseBackground("white");
      setSubjectBackground("grey1");
      console.log("SHOW PHASES");
    }
  }, [selectedSubject, selectedPhase, showPhases, showSubjects, path]);

  return (
    <Box
      $position="relative"
      data-testid="subjectPhasePicker"
      $zIndex={"mobileFilters"}
      $background={phaseBackground}
      $maxWidth={960}
    >
      <BoxBorders
        gapPosition="rightTop"
        $zIndex={"inFront"}
        hideRight={displayNewBorders}
        hideBottom={displayNewBorders}
        hideLeft={displayNewBorders}
        hideTop={displayNewBorders}
      />
      <Flex
        $position="relative"
        $alignItems={"center"}
        $justifyContent={"space-between"}
        $gap={0}
        $flexDirection={["column", "row"]}
        $width={"100%"}
      >
        <Flex
          $flexDirection={"row"}
          $alignItems={"center"}
          $justifyContent={"flex-start"}
          $width={["100%", "100%", "100%"]}
        >
          <Box
            $position={"relative"}
            $width={["50%", "50%"]}
            $borderColor={showSubjects ? "lemon" : "transparent"}
            $ba={3}
            $background={subjectBackground}
          >
            <BoxBorders
              $color={showSubjects ? "black" : "transparent"}
              gapPosition="rightTop"
            />

            <SelectButton
              $ph={24}
              $pv={24}
              onClick={toggleShowSubjects}
              title="Subject"
            >
              <Heading
                tag={"h3"}
                $font={"heading-light-7"}
                $mb={4}
                $color={!showSubjectError ? "black" : "failure"}
              >
                Subject
              </Heading>
              <P
                $font={"body-2"}
                $color={!showSubjectError ? "black" : "failure"}
              >
                {showSubjectError && (
                  <>
                    <Icon
                      $color={"failure"}
                      name="content-guidance"
                      verticalAlign="bottom"
                    />
                    <span>Select a subject</span>
                  </>
                )}
                {selectedSubject && <>{selectedSubject.title}</>}
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
              $top={["50%", "100%"]}
              $zIndex={"inFront"}
              $width={"100%"}
            >
              <BoxBorders />

              <FocusOn
                onClickOutside={() => setShowSubjects(false)}
                onEscapeKey={() => setShowSubjects(false)}
                scrollLock={false}
                returnFocus={false}
              >
                {showSubjectError && (
                  <Flex $flexDirection={"row"} $mb={20}>
                    <Icon
                      $color={"failure"}
                      name="content-guidance"
                      verticalAlign="bottom"
                    />
                    <P $color={"failure"}>
                      Select a subject to view a curriculum
                    </P>
                  </Flex>
                )}
                <Flex $flexDirection={"row"} $alignItems={"center"} $mb={16}>
                  <Heading tag={"h4"} $font={"heading-6"} $mr={12}>
                    Latest resources
                  </Heading>
                  <Box $pt={6}>
                    <TagPromotional
                      size={"medium"}
                      $color="mint"
                      $alignSelf={"flex-end"}
                    />
                  </Box>
                </Flex>
                <P $mb={16}>Explore our new curricula for 2023/2024.</P>
                <Box aria-label="Subject">
                  {subjects.map((subject) => (
                    <ButtonContainer
                      className={isSelected(subject) ? "selected" : ""}
                      key={subject.slug}
                    >
                      <Button
                        $mb={24}
                        $mr={24}
                        background={isSelected(subject) ? "black" : "oakGrey1"}
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
                  <OakLink
                    page={"oak-curriculum"}
                    $textDecoration={"underline"}
                    $font={"heading-7"}
                  >
                    See curricula from previous academic years
                    <Icon
                      $color={"black"}
                      name="external"
                      verticalAlign="bottom"
                    />
                  </OakLink>
                </Box>
              </FocusOn>
            </Box>
          )}
          <Box
            $height={80}
            $position={"relative"}
            $display={displayNewBorders ? "none" : "block"}
            $zIndex={"inFront"}
          >
            <BoxBorders
              $color="grey2"
              hideBottom={true}
              hideTop={true}
              hideRight={true}
            />
          </Box>
          <Flex
            $position={"relative"}
            $width={["50%", "60%"]}
            $borderColor={showPhases ? "lemon" : "transparent"}
            $ba={3}
            $background={phaseBackground}
            $flexDirection={"row"}
          >
            <BoxBorders
              $color={showPhases ? "black" : "transparent"}
              gapPosition="rightTop"
            />
            <SelectButton
              $ph={24}
              $pv={24}
              onClick={toggleShowPhases}
              title="Phase"
            >
              <Heading
                tag={"h3"}
                $font={"heading-light-7"}
                $mb={4}
                $color={!showSubjectError ? "black" : "failure"}
              >
                School phase
              </Heading>
              <P
                $font={"body-2"}
                $color={
                  !showPhaseError && !showExamboardError ? "black" : "failure"
                }
              >
                {showPhaseError && (
                  <>
                    <Icon
                      $color={"failure"}
                      name="content-guidance"
                      verticalAlign="bottom"
                    />
                    Select a school phase
                  </>
                )}
                {showExamboardError && (
                  <>
                    <Icon
                      $color={"failure"}
                      name="content-guidance"
                      verticalAlign="bottom"
                    />
                    Select an exam board option
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
                <BoxBorders />
                <FocusOn
                  onClickOutside={() => setShowPhases(false)}
                  onEscapeKey={() => setShowPhases(false)}
                  scrollLock={false}
                  returnFocus={false}
                >
                  {showPhaseError && (
                    <Flex $flexDirection={"row"} $mb={20}>
                      <Icon
                        $color={"failure"}
                        name="content-guidance"
                        verticalAlign="bottom"
                      />
                      <P $color={"failure"}>
                        Select a school phase to view the curriculum
                      </P>
                    </Flex>
                  )}
                  {showExamboardError ? (
                    <Flex $flexDirection={"row"} $mb={20}>
                      <Icon
                        $color={"failure"}
                        name="content-guidance"
                        verticalAlign="bottom"
                      />
                      <P $color={"failure"}>
                        Select an exam board to view the curriculum
                      </P>
                    </Flex>
                  ) : (
                    "Exam board"
                  )}
                  <Heading tag={"h4"} $font={"heading-6"} $mb={16}>
                    Choose a school phase:
                  </Heading>
                  <Box aria-label="School phase">
                    {(selectedSubject?.phases ?? phases).map((phase, index) => (
                      <ButtonContainer className="multi-line" key={phase.slug}>
                        <Button
                          $mr={index === 0 ? 28 : 0}
                          $mv={index === 0 ? 12 : 0}
                          background={isSelected(phase) ? "black" : "oakGrey1"}
                          label={phaseLabel(phase)}
                          onClick={() => handleSelectPhase(phase)}
                          aria-checked={isSelected(phase)}
                          title={phase.title}
                        />
                      </ButtonContainer>
                    ))}
                  </Box>
                  {selectedPhase?.slug === "secondary" &&
                    selectedSubject?.examboards && (
                      <>
                        <Heading
                          tag={"h4"}
                          $font={"heading-6"}
                          $mb={16}
                          $mt={16}
                        >
                          Exam board
                        </Heading>
                        <Box aria-label="Exam board">
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
                                aria-checked={isSelected(examboard)}
                              />
                            </ButtonContainer>
                          ))}
                        </Box>
                      </>
                    )}
                </FocusOn>
              </SchoolPhaseDropDownBox>
            )}
            <Box
              $pl={18}
              $pr={18}
              $pt={[18, 0]}
              $pb={[18, 0]}
              $width={["100%", "fit-content"]}
              $display={["none", "block"]}
              $mt={22}
            >
              <Button
                label="View"
                icon="arrow-right"
                $iconPosition="trailing"
                iconBackground="transparent"
                onClick={handleViewCurriculum}
                size="large"
                $fullWidth={false}
                ref={viewButtonRef}
              />
            </Box>
          </Flex>
        </Flex>
        <Box
          $width={"90%"}
          $position={"relative"}
          $mt={[18, 0]}
          $display={["block", " none"]}
        >
          <BoxBorders
            $color="grey2"
            hideTop={true}
            hideRight={true}
            hideLeft={true}
          />
        </Box>

        <Box
          $pl={18}
          $pr={18}
          $pt={[18, 0]}
          $pb={[18, 0]}
          $width={["100%", "fit-content"]}
          $display={["block", "none"]}
        >
          <Button
            label="View curriculum"
            icon="arrow-right"
            $iconPosition="trailing"
            iconBackground="transparent"
            onClick={handleViewCurriculum}
            size="large"
            $fullWidth={true}
            // ref={viewButtonRef}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default SubjectPhasePicker;
