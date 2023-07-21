import { FC, useState } from "react";
import { FocusOn } from "react-focus-on";

import BrushBorders from "../SpriteSheet/BrushSvgs/BrushBorders";
import Grid, { GridArea } from "../Grid";
import { Heading } from "../Typography";

import Box from "components/Box";
import BoxBorders from "components/SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";
import Button from "components/Button/Button";
import P from "components/Typography/P";
import { Phase, Subject } from "node-lib/curriculum-api-2023";
// import useAnalytics from "../../context/Analytics/useAnalytics";

export type SubjectPhaseOptions = {
  newSubjects: Subject[];
  legacySubjects: Subject[];
  phases: Phase[];
};

/**
 * Interface to pick a subject (new or legacy), phase, and if applicable, an exam board.
 * ## Usage
 * Used on curriculum homepage, new curriculum pages, legacy curriculum pages.
 */

const SubjectPhasePicker: FC<SubjectPhaseOptions> = ({
  newSubjects,
  legacySubjects,
  phases,
}) => {
  // const { track } = useAnalytics();

  // TODO: Move exam board definition
  type Examboard = {
    title: string;
    slug: string;
  };

  // TODO: Determine if these types are needed for lookups
  // type SubjectPhase = {
  //   [key: string]: Phase[];
  // }

  // type PhaseSubject = {
  //   [key: string]: Subject[];
  // }

  // type PhaseExamboard = {
  //   [key: string]: Examboard[];
  // }

  interface SelectedSubject extends Subject {
    isNew: boolean;
  }

  const [showSubjects, setShowSubjects] = useState(false);
  const [showPhases, setShowPhases] = useState(false);
  // const [showExamboards, setShowExamboards] = useState(false);
  const [canViewCurriculum, setCanViewCurriculum] = useState(false);
  const [selectedSubject, setSelectedSubject] =
    useState<SelectedSubject | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [selectedExamboard, setSelectedExamboard] = useState<Examboard | null>(
    null
  );

  const toggleShowSubjects = () => {
    setShowSubjects(!showSubjects);
    setShowPhases(false);
  };

  const toggleShowPhases = () => {
    setShowPhases(!showPhases);
    setShowSubjects(false);
  };

  const handleSelectSubject = (subject: Subject, isNew = false): void => {
    // TODO: Update phase options based on subject selection
    setSelectedSubject({
      ...subject,
      isNew,
    });
  };

  const handleSelectPhase = (phase: Phase): void => {
    // TODO: Update subject & exam board options based on phase selection
    setSelectedPhase(phase);
    setSelectedExamboard(null);
  };

  // const handleSelectExamboard = (examboard: Examboard): void => {
  //   setSelectedExamboard(examboard);
  // }

  const handleViewCurriculum = () => {
    setCanViewCurriculum(!!(selectedSubject && selectedPhase));
  };

  return (
    // TODO: Add appropriate aria labels for accessibility?
    <Box $position="relative">
      <BoxBorders />
      <Grid $position="relative">
        <GridArea $colSpan={[12, 5]} $mr={8}>
          <Box $ph={32} $pv={24} onClick={toggleShowSubjects}>
            <Heading tag={"h3"} $font={"heading-light-7"} $mb={4}>
              Subject
            </Heading>
            <P>
              {selectedSubject
                ? `${selectedSubject.title}${
                    selectedSubject.isNew ? " (New)" : ""
                  }`
                : "Choose a subject..."}
            </P>
          </Box>
          <Box
            $background={"white"}
            $display={showSubjects ? "" : "none"}
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
              enabled={showSubjects}
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
                  $dropShadow="interactiveCardHover"
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
                <Button
                  background={
                    selectedSubject?.isNew &&
                    selectedSubject.slug == subject.slug
                      ? "black"
                      : "oakGrey1"
                  }
                  key={subject.slug}
                  label={subject.title}
                  $mb={24}
                  $mr={24}
                  onClick={() => handleSelectSubject(subject, true)}
                />
              ))}
              <Heading tag={"h4"} $font={"heading-light-7"} $mb={16} $mt={16}>
                Legacy Resources
              </Heading>
              <P $mb={16}>Curricula from year 2020-2022.</P>
              {legacySubjects.map((subject) => (
                <Button
                  background={
                    !selectedSubject?.isNew &&
                    selectedSubject?.slug == subject.slug
                      ? "black"
                      : "oakGrey1"
                  }
                  key={subject.slug}
                  label={subject.title}
                  $mb={16}
                  $mr={16}
                  onClick={() => handleSelectSubject(subject, false)}
                />
              ))}
            </FocusOn>
          </Box>
        </GridArea>

        <GridArea $colSpan={[12, 5]} $position="relative" $mr={16}>
          <Box $ph={32} $pv={24} onClick={toggleShowPhases}>
            <Heading tag={"h3"} $font={"heading-light-7"} $mb={4}>
              Phase
            </Heading>
            <P>
              {selectedPhase
                ? `${selectedPhase.title}${
                    selectedExamboard ? `, ${selectedExamboard.title}` : ``
                  }`
                : "Choose a phase..."}
            </P>
          </Box>
          <FocusOn
            enabled={showPhases}
            onClickOutside={() => setShowPhases(false)}
            onEscapeKey={() => setShowPhases(false)}
            scrollLock={false}
          >
            <Box
              $background={"white"}
              $display={showPhases ? "" : "none"}
              $dropShadow="interactiveCardHover"
              $left={0}
              $mt={8}
              $pa={32}
              $position="absolute"
              $top={"100%"}
            >
              <BoxBorders />
              <Heading tag={"h4"} $font={"heading-light-7"} $mb={16}>
                Phases
              </Heading>
              {phases.map((phase) => (
                <Button
                  $mr={24}
                  background={
                    selectedPhase?.slug == phase.slug ? "black" : "oakGrey1"
                  }
                  key={phase.slug}
                  label={phase.title}
                  onClick={() => handleSelectPhase(phase)}
                >
                  {phase.title}
                </Button>
              ))}
            </Box>
          </FocusOn>
        </GridArea>

        <GridArea $colSpan={[12, 2]}>
          <Button
            $ma={24}
            disabled={!canViewCurriculum}
            label="View ->"
            onClick={handleViewCurriculum}
            size="large"
          />
        </GridArea>
      </Grid>
    </Box>
  );
};

export default SubjectPhasePicker;
