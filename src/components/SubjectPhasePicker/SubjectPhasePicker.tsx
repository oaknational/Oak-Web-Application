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
import { OakColorName } from "@/styles/theme";
import Icon from "@/components/Icon";
import { CurriculumTab } from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";
import TagPromotional from "@/components/TagPromotional";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";

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

const ButtonFocusUnderline = styled(Svg)<{ $color: OakColorName }>`
  color: ${(props) => props.$color};
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
}) => {
  const router = useRouter();
  const tab = (router.query.tab as CurriculumTab) ?? "units";
  const path = router.asPath;

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
      viewButtonRef.current?.blur();
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

  const viewButtonRef = useRef<HTMLButtonElement>(null);
  const depsRef = useRef(
    selectedSubject &&
      selectedPhase &&
      path &&
      path.startsWith("/teachers/curriculum/"),
  );

  useEffect(() => {
    let hideOuterBorders = false;
    let phaseBackgroundEnabled = true;
    let subjectBackgroundEnabled = true;

    if (selectedSubject && selectedPhase) {
      viewButtonRef.current?.focus();
    }

    if (showSubjects) {
      hideOuterBorders = true;
      phaseBackgroundEnabled = false;
    }

    if (showPhases) {
      hideOuterBorders = true;
      subjectBackgroundEnabled = false;
    }

    setDisplayNewBorders(hideOuterBorders);
    setPhaseBackground(phaseBackgroundEnabled ? "white" : "grey1");
    setSubjectBackground(subjectBackgroundEnabled ? "white" : "grey1");
  }, [selectedSubject, selectedPhase, showPhases, showSubjects]);

  useEffect(() => {
    if (depsRef) {
      viewButtonRef.current?.blur();
    }
  }, []);

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
                autoFocus={false}
                onClickOutside={() => setShowSubjects(false)}
                onEscapeKey={() => setShowSubjects(false)}
                scrollLock={false}
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
                    New curriculum plans
                  </Heading>
                  <Box $pt={6}>
                    <TagPromotional size={"medium"} $alignSelf={"flex-end"} />
                  </Box>
                </Flex>
                <P $mb={16}>Explore our new curricula for 2023/2024.</P>
                <Box aria-label="Subject" role="radiogroup">
                  {subjects.map((subject) => (
                    <ButtonContainer
                      className={isSelected(subject) ? "selected" : ""}
                      key={subject.slug}
                    >
                      <Button
                        role="radio"
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
                    Previously released plans
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
              <Box
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
                    <Box
                      $textOverflow={"ellipsis"}
                      $whiteSpace={"nowrap"}
                      $overflowX={"hidden"}
                    >
                      <Span>{selectedPhase.title}</Span>
                      {selectedExamboard && (
                        <Span>, {selectedExamboard.title}</Span>
                      )}
                    </Box>
                  </>
                )}
                {!selectedPhase &&
                  !showPhaseError &&
                  !showExamboardError &&
                  "Select"}
              </Box>
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
                  autoFocus={false}
                  onClickOutside={() => setShowPhases(false)}
                  onEscapeKey={() => setShowPhases(false)}
                  scrollLock={false}
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
                    ""
                  )}
                  <Heading tag={"h4"} $font={"heading-6"} $mb={16}>
                    Choose a school phase:
                  </Heading>
                  <Box aria-label="School phase" radioGroup="radiogroup">
                    {(selectedSubject?.phases ?? phases).map((phase, index) => (
                      <ButtonContainer className="multi-line" key={phase.slug}>
                        <Button
                          role="radio"
                          $mr={index === 0 ? 28 : 0}
                          $mb={index === 0 ? 16 : 0}
                          $mv={8}
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
                          $mb={16}
                          $mt={20}
                          tag={"h4"}
                          $font={"heading-6"}
                        >
                          Choose an exam board for KS4:
                        </Heading>

                        <Box aria-label="Exam board" role="radiogroup">
                          {selectedSubject.examboards.map(
                            (examboard, index) => (
                              <ButtonContainer key={examboard.slug}>
                                <Button
                                  role="radio"
                                  $mr={24}
                                  $mt={index >= 2 ? [16, 0] : 0}
                                  background={
                                    isSelected(examboard) ? "black" : "oakGrey1"
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
          $mt={[12, 0]}
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
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default SubjectPhasePicker;
