import { FC, useState, useId, useRef } from "react";
import { FocusOn } from "react-focus-on";
import styled from "styled-components";
import { useRouter } from "next/router";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakIcon,
  OakP,
  OakPrimaryButton,
  OakSecondaryButton,
  OakSpan,
} from "@oaknational/oak-components";
import { sortBy } from "lodash";
import { flushSync } from "react-dom";

import OwaLink from "@/components/SharedComponents/OwaLink";
import Box from "@/components/SharedComponents/Box";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import {
  KS4Option,
  Phase,
  Subject,
  SubjectPhaseOption,
} from "@/node-lib/curriculum-api-2023";
import Icon from "@/components/SharedComponents/Icon";
import { CurriculumTab } from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import { isExamboardSlug } from "@/pages-helpers/pupil/options-pages/options-pages-helpers";
import FocusIndicator from "@/components/CurriculumComponents/OakComponentsKitchen/FocusIndicator";
import { getPhaseText } from "@/utils/curriculum/formatting";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import FocusWrap from "@/components/CurriculumComponents/OakComponentsKitchen/FocusWrap";
import { CurriculumModalCloseButton } from "@/components/CurriculumComponents/CurriculumModalCloseButton";

const DEFAULT_KEYSTAGES = [
  { slug: "ks1" },
  { slug: "ks2" },
  { slug: "ks3" },
  { slug: "ks4" },
];

/**
 * Interface to pick a subject, phase, and if applicable, an option for KS4 (pathway/exam board).
 * ## Usage
 * Used on curriculum homepage, new curriculum pages.
 */

export type SubjectPhasePickerData = {
  subjects: SubjectPhaseOption[];
  currentSelection?: {
    subject: SubjectPhaseOption;
    phase: Phase;
    ks4Option: KS4Option | null;
  };
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

  &.lot-picker {
    button {
      border-radius: var(--Border-Radius-border-radius-s, 4px);
      border: 1px solid var(--Tokens-Border-border-neutral-lighter, #cacaca);
      background: var(--Tokens-Background-bg-primary, #fff);

      :focus-visible {
        /* drop-shadow-focus  */
        box-shadow:
          0px 0px 0px 2px #ffe555,
          0px 0px 0px 5px #575757;
      }

      :active {
        border-radius: var(--Border-Radius-border-radius-s, 4px);
        border: 1px solid var(--Tokens-Border-border-neutral-lighter, #cacaca);
        background: var(--Tokens-Background-bg-primary, #fff);

        /* drop-shadow-pressed */
        box-shadow:
          2px 2px 0px 0px #ffe555,
          4px 4px 0px 0px #575757;
      }

      :hover {
        border-radius: var(--Border-Radius-border-radius-s, 4px);
        border: 1px solid var(--Tokens-Border-border-neutral-lighter, #cacaca);
        background: var(--Tokens-Background-bg-neutral, #f2f2f2);
        color: #222222;

        img {
          filter: invert(0);
        }
      }
    }

    div {
      justify-content: flex-start;
    }
  }

  &.selected {
    button {
      border-radius: var(--Border-Radius-border-radius-s, 4px);
      border: 1px solid var(--Tokens-Border-border-neutral-lighter, #cacaca);
      background-color: #222222;
      color: #fff;

      :hover {
        background: #222222;
        color: #fff;
      }
    }
  }

  &.selected img {
    filter: invert(1);
  }

  &.subject-selection {
    button {
      padding: var(--Tokens-Inner-Padding-inner-padding-ssx, 4px)
        var(--Tokens-Inner-Padding-inner-padding-s, 12px);
      min-height: var(--All-spacing-Number-8, 40px);
    }
  }
`;

const PickerButton = styled.button`
  background: none;
  width: 100%;
  border: none;
  padding: 0px;
  outline: none;
  text-align: left;
  user-select: none;
  cursor: pointer;
`;

const FocusIndicatorAlt = styled(FocusIndicator)<object>`
  &:hover {
    background: #f2f2f2;
  }
`;

const SelectionDropDownBox = styled(Box)<object>`
  width: calc(100% + 2px);
  margin-left: -2px;

  &.phase-selection {
    width: calc(200% + 4px);
    left: -100%;

    @media (min-width: 768px) {
      width: calc(100% + 4px);
      left: 0;
    }
  }

  border-radius: 4px;
  border: 2px solid var(--Tokens-Border-border-primary, #222);
  background: var(--Primitives-Brand-white, #fff);

  /* drop-shadow-standard */
  box-shadow: 0px 8px 8px 0px rgba(92, 92, 92, 0.2);
`;

const SubjectPhasePicker: FC<SubjectPhasePickerData> = ({
  subjects,
  currentSelection,
}) => {
  const phasePickerButton = useRef<HTMLButtonElement>(null);
  const subjectPickerButton = useRef<HTMLButtonElement>(null);
  const subjectPickerButtonDesktopContainer = useRef<HTMLDivElement>(null);
  const subjectPickerButtonMobileContainer = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const tab = (router.query.tab as CurriculumTab) ?? "units";

  const ks4OptionErrorId = useId();
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

  const initialKS4Option = initialSubject?.ks4_options?.find(
    (option) => option.slug === currentSelection?.ks4Option?.slug,
  );

  const [showSubjects, setShowSubjects] = useState(false);
  const [showPhases, setShowPhases] = useState(false);
  const [selectedSubject, setSelectedSubject] =
    useState<SubjectPhaseOption | null>(initialSubject || null);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(
    initialPhase || null,
  );
  const [selectedKS4Option, setSelectedKS4Option] = useState<KS4Option | null>(
    initialKS4Option || null,
  );
  const [showSubjectError, setShowSubjectError] = useState(false);
  const [showPhaseError, setShowPhaseError] = useState(false);
  const [showKS4OptionError, setShowKS4OptionError] = useState(false);

  const schoolPhaseInputId = useId();
  const subjectInputId = useId();
  const ks4OptionInputId = useId();

  const toggleShowSubjects = () => {
    setShowSubjects(!showSubjects);
    setShowPhases(false);
  };

  // Lazy version of process.nextTick
  const nextTick = async () => {
    return new Promise((resolve) => setTimeout(resolve, 0));
  };
  const onFocusSubjectStart = async () => {
    setShowSubjects(false);
  };
  const onFocusSubjectEnd = async () => {
    flushSync(() => {
      setShowSubjects(false);
    });

    await nextTick();
    phasePickerButton.current?.focus();
  };

  const onFocusPhasesStart = async () => {
    flushSync(() => {
      setShowPhases(false);
    });

    await nextTick();
    subjectPickerButton.current?.focus();
  };
  const onFocusPhasesEnd = async () => {
    flushSync(() => {
      setShowPhases(false);
    });

    const desktopEl =
      subjectPickerButtonDesktopContainer.current?.querySelector("button");
    const mobileEl =
      subjectPickerButtonMobileContainer.current?.querySelector("button");

    // Focus the last element
    if (desktopEl && desktopEl.checkVisibility()) {
      await nextTick();
      desktopEl.focus();
    } else if (mobileEl && mobileEl.checkVisibility()) {
      await nextTick();
      mobileEl.focus();
    }
  };

  const toggleShowPhases = () => {
    setShowPhases(!showPhases);
    setShowSubjects(false);
  };

  const handleSelectSubject = (subject: SubjectPhaseOption): void => {
    setShowSubjectError(false);
    setSelectedKS4Option(null);
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
    setShowKS4OptionError(false);
    setSelectedKS4Option(null);
    setSelectedPhase(phase);
    if (
      phase.slug === "primary" ||
      !selectedSubject ||
      !selectedSubject.ks4_options
    ) {
      setShowPhases(false);
    }
  };

  const handleSelectKS4Option = (ks4Option: KS4Option): void => {
    setShowKS4OptionError(false);
    setSelectedKS4Option(ks4Option);
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
      selectedSubject?.ks4_options &&
      selectedPhase?.slug === "secondary" &&
      !selectedKS4Option
    ) {
      canViewCurriculum = false;
      setShowKS4OptionError(true);
      setShowPhases(true);
    }
    if (canViewCurriculum) {
      let subjectPhaseSlug = selectedSubject?.slug + "-" + selectedPhase?.slug;
      if (selectedKS4Option) {
        subjectPhaseSlug += "-" + selectedKS4Option.slug;
      }
      trackViewCurriculum();
      router.push({
        pathname: `/teachers/curriculum/${subjectPhaseSlug}/${tab}`,
      });
    }
  };

  const isSelected = (option: Subject | Phase | KS4Option) => {
    return (
      option.slug === selectedSubject?.slug ||
      option.slug === selectedPhase?.slug ||
      option.slug === selectedKS4Option?.slug
    );
  };

  const createKS4OptionTitle = (subject: string, option: KS4Option) => {
    const { title, slug } = option;
    if (subject === "Computing" && isExamboardSlug(slug)) {
      return `${title} (Computer Science)`;
    }
    return title;
  };

  return (
    <OakBox
      $position="relative"
      data-testid="subjectPhasePicker"
      $zIndex={101}
      $maxWidth="all-spacing-23"
      $borderRadius="border-radius-s"
      $borderColor={showSubjects || showPhases ? "transparent" : "black"}
      $ba="border-solid-m"
    >
      <OakFlex
        $position="relative"
        $borderRadius="border-radius-s"
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
              disableActive={true}
              $width={"100%"}
              $bblr={["border-radius-square", "border-radius-s"]}
              $bbrr={["border-radius-square", "border-radius-s"]}
              $btlr={["border-radius-s", "border-radius-s"]}
              $btrr={["border-radius-square", "border-radius-s"]}
            >
              <PickerButton
                ref={subjectPickerButton}
                onClick={toggleShowSubjects}
                title="Subject"
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
              </PickerButton>
            </FocusIndicatorAlt>
          </OakFlex>
          {showSubjects && (
            <SelectionDropDownBox
              $background={"white"}
              $dropShadow="interactiveCardHover"
              $left={0}
              $mt={8}
              $pa={24}
              $position="absolute"
              $top={["50%", "100%"]}
              $zIndex={"modalDialog"}
              $width={"100%"}
            >
              <FocusOn
                autoFocus={false}
                onClickOutside={() => setShowSubjects(false)}
                onEscapeKey={() => setShowSubjects(false)}
                scrollLock={false}
              >
                <FocusWrap
                  onWrapStart={onFocusSubjectStart}
                  onWrapEnd={onFocusSubjectEnd}
                >
                  <CurriculumModalCloseButton
                    onClose={toggleShowSubjects}
                    $position={"absolute"}
                    $top={[8, 12]}
                    $right={[8, 12]}
                  />
                  {showSubjectError && (
                    <OakFlex
                      id={subjectErrorId}
                      $flexDirection={"row"}
                      $mb={"space-between-m"}
                    >
                      <Icon
                        $color={"red"}
                        name="content-guidance"
                        verticalAlign="bottom"
                      />
                      <OakP $color={"red"}>
                        Select a subject to view a curriculum
                      </OakP>
                    </OakFlex>
                  )}
                  <OakFlex
                    $flexDirection={"column"}
                    $alignItems={"flex-start"}
                    $gap={"all-spacing-1"}
                    $mb={"space-between-sssx"}
                  >
                    <OakHeading
                      id={subjectInputId}
                      tag={"h4"}
                      $font={"heading-6"}
                      $mr="space-between-xs"
                      data-testid="subjectDropdownHeading"
                    >
                      Curriculum plans
                    </OakHeading>
                    <OakP $mb="space-between-s">
                      Explore our curricula for 2024/2025.
                    </OakP>
                  </OakFlex>
                  <OakFlex
                    role="radiogroup"
                    aria-labelledby={subjectInputId}
                    aria-required="true"
                    aria-describedby={
                      showSubjectError ? subjectErrorId : undefined
                    }
                    $gap={"space-between-xs"}
                    $alignItems={"flex-start"}
                    $flexWrap={"wrap"}
                    $mt={"space-between-none"}
                  >
                    {sortBy(subjects, "title").map((subject) => (
                      <ButtonContainer
                        className={`lot-picker subject-selection ${
                          isSelected(subject) ? "selected" : ""
                        }`}
                        key={subject.slug}
                      >
                        <OakSecondaryButton
                          role="radio"
                          iconGap={"space-between-sssx"}
                          onClick={() => handleSelectSubject(subject)}
                          aria-checked={isSelected(subject)}
                          title={subject.title}
                          hoverShadow={null}
                          iconOverride={
                            <OakIcon
                              iconName={getValidSubjectIconName(subject.slug)}
                              alt=""
                            />
                          }
                        >
                          {subject.title}
                        </OakSecondaryButton>
                      </ButtonContainer>
                    ))}
                  </OakFlex>
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
                </FocusWrap>
              </FocusOn>
            </SelectionDropDownBox>
          )}
          <Box
            $height={50}
            $width={3}
            $position={"relative"}
            $display={"block"}
            $zIndex={"modalDialog"}
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
                subFocus={showPhases}
                disableActive={true}
                $width={"100%"}
                $bblr={["border-radius-square", "border-radius-s"]}
                $bbrr={["border-radius-square", "border-radius-s"]}
                $btlr={["border-radius-square", "border-radius-s"]}
                $btrr={["border-radius-s", "border-radius-s"]}
              >
                <PickerButton
                  ref={phasePickerButton}
                  data-testid="phasePickerButton"
                  onClick={toggleShowPhases}
                  title="Phase"
                >
                  <OakBox
                    $pl="inner-padding-m"
                    $pt="inner-padding-s"
                    $pb="inner-padding-s"
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
                        !showPhaseError && !showKS4OptionError ? "black" : "red"
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
                      {showKS4OptionError && (
                        <>
                          <Icon
                            $color={"red"}
                            name="content-guidance"
                            verticalAlign="bottom"
                          />
                          Select an option for KS4
                        </>
                      )}
                      {selectedPhase && !showKS4OptionError && (
                        <>
                          <Box
                            $textOverflow={"ellipsis"}
                            $whiteSpace={"nowrap"}
                            $overflowX={"hidden"}
                          >
                            <OakSpan>{selectedPhase.title}</OakSpan>
                            {selectedKS4Option && (
                              <OakSpan>, {selectedKS4Option.title}</OakSpan>
                            )}
                          </Box>
                        </>
                      )}
                      {!selectedPhase &&
                        !showPhaseError &&
                        !showKS4OptionError &&
                        "Select"}
                    </Box>
                  </OakBox>
                </PickerButton>
              </FocusIndicatorAlt>

              {showPhases && (
                <SelectionDropDownBox
                  $background={"white"}
                  $dropShadow="interactiveCardHover"
                  $mt={8}
                  $pa={28}
                  $position="absolute"
                  $top={"100%"}
                  $zIndex={"modalDialog"}
                  className="phase-selection"
                >
                  <FocusOn
                    autoFocus={false}
                    onClickOutside={() => setShowPhases(false)}
                    onEscapeKey={() => setShowPhases(false)}
                    scrollLock={false}
                  >
                    <FocusWrap
                      onWrapStart={onFocusPhasesStart}
                      onWrapEnd={onFocusPhasesEnd}
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
                      {showKS4OptionError ? (
                        <Flex
                          id={ks4OptionErrorId}
                          $flexDirection={"row"}
                          $mb={20}
                        >
                          <Icon
                            $color={"red"}
                            name="content-guidance"
                            verticalAlign="bottom"
                          />
                          <OakP $color={"red"}>
                            Select a KS4 option to view the curriculum
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
                        Choose a school phase
                      </OakHeading>
                      <OakFlex
                        radioGroup="radiogroup"
                        aria-labelledby={schoolPhaseInputId}
                        aria-required="true"
                        aria-describedby={
                          showPhaseError ? phaseErrorId : undefined
                        }
                        $flexDirection={"column"}
                        $gap={"space-between-s"}
                      >
                        <CurriculumModalCloseButton
                          onClose={toggleShowPhases}
                          $position={"absolute"}
                          $top={[8, 12]}
                          $right={[8, 12]}
                        />
                        {(selectedSubject?.phases ?? phases).map((phase) => (
                          <ButtonContainer
                            className={`lot-picker ${
                              isSelected(phase) ? "selected" : ""
                            }`}
                            key={phase.slug}
                          >
                            <OakSecondaryButton
                              key={phase.slug}
                              role="radio"
                              pv={"inner-padding-s"}
                              ph={"inner-padding-s"}
                              width={"100%"}
                              onClick={() => handleSelectPhase(phase)}
                              aria-checked={isSelected(phase)}
                              title={phase.title}
                              textAlign={"start"}
                              hoverShadow={null}
                            >
                              {phase.title}
                              <OakP $font={"body-2"}>
                                {getPhaseText(
                                  phase,
                                  selectedSubject?.keystages ??
                                    DEFAULT_KEYSTAGES,
                                )}
                              </OakP>
                            </OakSecondaryButton>
                          </ButtonContainer>
                        ))}
                      </OakFlex>
                      {selectedPhase?.slug === "secondary" &&
                        selectedSubject?.ks4_options && (
                          <>
                            <OakHeading
                              id={ks4OptionInputId}
                              $mb="space-between-s"
                              $mt="space-between-m"
                              tag={"h4"}
                              $font={"heading-6"}
                            >
                              Choose an option for KS4
                            </OakHeading>
                            <OakFlex
                              role="radiogroup"
                              aria-labelledby={ks4OptionInputId}
                              aria-required="true"
                              aria-describedby={
                                showKS4OptionError
                                  ? ks4OptionErrorId
                                  : undefined
                              }
                              $flexWrap={"wrap"}
                              $flexDirection={"row"}
                              $gap={"all-spacing-2"}
                            >
                              {selectedSubject.ks4_options
                                // sort Core/GSCE first
                                .sort((a: KS4Option) =>
                                  isExamboardSlug(a.slug) ? 1 : -1,
                                )
                                .map((ks4Option: KS4Option) => (
                                  <ButtonContainer
                                    key={ks4Option.slug}
                                    className={`lot-picker ${
                                      isSelected(ks4Option) ? "selected" : ""
                                    }`}
                                    data-testid="ks4-option-lot-picker"
                                  >
                                    <OakSecondaryButton
                                      role="radio"
                                      onClick={() =>
                                        handleSelectKS4Option(ks4Option)
                                      }
                                      title={createKS4OptionTitle(
                                        selectedSubject.title,
                                        ks4Option,
                                      )}
                                      aria-checked={isSelected(ks4Option)}
                                    >
                                      {createKS4OptionTitle(
                                        selectedSubject.title,
                                        ks4Option,
                                      )}
                                    </OakSecondaryButton>
                                  </ButtonContainer>
                                ))}
                            </OakFlex>
                          </>
                        )}
                    </FocusWrap>
                  </FocusOn>
                </SelectionDropDownBox>
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
                ref={subjectPickerButtonDesktopContainer}
              >
                <OakPrimaryButton
                  iconName="arrow-right"
                  isTrailingIcon={true}
                  onClick={handleViewCurriculum}
                  data-testid="view-desktop"
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
          ref={subjectPickerButtonMobileContainer}
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
