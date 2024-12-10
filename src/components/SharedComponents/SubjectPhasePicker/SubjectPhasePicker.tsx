import { FC, useState, useId, useRef, useTransition } from "react";
import { FocusOn } from "react-focus-on";
import styled from "styled-components";
import { useRouter } from "next/router";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakIcon,
  OakJauntyAngleLabel,
  OakP,
  OakPrimaryButton,
  OakSecondaryButton,
  OakSpan,
} from "@oaknational/oak-components";
import { sortBy } from "lodash";
import { flushSync } from "react-dom";
import {
  examboardSlugs,
  ProgrammeFields,
} from "@oaknational/oak-curriculum-schema";

import OwaLink from "@/components/SharedComponents/OwaLink";
import Box from "@/components/SharedComponents/Box";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import type {
  KS4Option,
  Phase,
  Subject,
  SubjectPhaseOption,
} from "@/node-lib/curriculum-api-2023";
import Icon from "@/components/SharedComponents/Icon";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import FocusIndicator from "@/components/CurriculumComponents/OakComponentsKitchen/FocusIndicator";
import { getPhaseText } from "@/utils/curriculum/formatting";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import FocusWrap from "@/components/CurriculumComponents/OakComponentsKitchen/FocusWrap";
import { Hr } from "@/components/SharedComponents/Typography";
import Button from "@/components/SharedComponents/Button";
import { CurriculumModalCloseButton } from "@/components/CurriculumComponents/CurriculumModalCloseButton/CurriculumModalCloseButton";
import useMediaQuery from "@/hooks/useMediaQuery";
import type { CurriculumTab } from "@/pages-helpers/curriculum/docx/tab-helpers";

// FIXME: This is from <@/pages-helpers/pupil/options-pages/options-pages-helpers> being duplicated here to fix bundle issues.
const isExamboardSlug = (
  examboardSlug: ProgrammeFields["examboard_slug"] | string | null,
): examboardSlug is ProgrammeFields["examboard_slug"] =>
  Object.keys(examboardSlugs.Values).includes(examboardSlug ?? "");

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

        & img {
          filter: invert(1);
        }
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

const SubjectContainerWrapper = styled.div`
  position: relative;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  padding-left: 8px;

  @media (min-width: 769px) {
    padding-left: 0px;
    max-height: auto;
    overflow-y: visible;
  }
`;

const PhaseContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  position: relative;

  @media (min-width: 769px) {
    max-height: auto;
    overflow-y: visible;
  }
`;

type SubjectContainerProps = {
  children: React.ReactNode;
  showSubjectError: boolean;
  onClick: () => void;
};
function SubjectContainer({
  children,
  showSubjectError,
  onClick,
}: SubjectContainerProps) {
  const subjectErrorId = useId();
  const subjectInputId = useId();
  const isMobile = useMediaQuery("mobile");

  return (
    <SubjectContainerWrapper>
      {showSubjectError && (
        <OakFlex
          id={subjectErrorId}
          role="alert"
          aria-live="polite"
          $flexDirection={"row"}
          $mb={"space-between-m"}
        >
          <Icon $color={"red"} name="content-guidance" verticalAlign="bottom" />
          <OakP $color={"red"}>Select a subject to view a curriculum</OakP>
        </OakFlex>
      )}
      <OakFlex
        $flexDirection={"column"}
        $alignItems={"flex-start"}
        $gap={"all-spacing-7"}
        $mb={"space-between-sssx"}
      >
        {isMobile && (
          <OakHeading
            data-testid="mobile-subject-picker-heading"
            tag="h1"
            $font="heading-5"
          >
            Subject
          </OakHeading>
        )}

        <OakFlex
          $flexDirection={"column"}
          $gap={["all-spacing-2", "all-spacing-1"]}
        >
          {!isMobile && (
            <CurriculumModalCloseButton
              ariaLabel="Close subject picker modal"
              onClose={onClick}
              $position={"absolute"}
              $top={-12}
              $right={-12}
            />
          )}

          <OakHeading
            id={subjectInputId}
            tag={"h2"}
            $font={"heading-6"}
            $mr="space-between-xs"
            data-testid="subject-picker-heading"
          >
            Curriculum plans
          </OakHeading>
          <OakP>Explore our curricula for 2024/2025.</OakP>
        </OakFlex>
      </OakFlex>
      <Box $mv={[30, 24]}>
        <OakFlex
          role="radiogroup"
          aria-labelledby={subjectInputId}
          aria-required="true"
          aria-describedby={showSubjectError ? subjectErrorId : undefined}
          $gap={"space-between-xs"}
          $alignItems={"flex-start"}
          $flexWrap={"wrap"}
        >
          {children}
        </OakFlex>
      </Box>
      <Box $mb={[30, 0]} $ml={0}>
        <OwaLink
          page={"curriculum-previous-downloads"}
          $textDecoration={"underline"}
          $font={"heading-7"}
          data-testid="subject-picker-previous-plans-link"
        >
          Previously released plans
          <Icon $color={"black"} name="arrow-right" verticalAlign="bottom" />
        </OwaLink>
      </Box>
    </SubjectContainerWrapper>
  );
}

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
  const ks4OptionInputId = useId();

  const isMobile = useMediaQuery("mobile");
  const [isMobileLotPickerModalOpen, setIsMobileLotPickerModalOpen] =
    useState(false);

  const handleMobileLotPickerModal = () => {
    setIsMobileLotPickerModalOpen(!isMobileLotPickerModalOpen);
  };

  const toggleShowSubjects = () => {
    if (isMobile) {
      setIsMobileLotPickerModalOpen(true);
    } else {
      setShowSubjects(!showSubjects);
      setShowPhases(false);
    }
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

    if (!isMobile) {
      if (!selectedPhase) {
        setShowPhases(true);
      }
      setShowSubjects(false);
    }
  };

  const handleSelectPhase = (phase: Phase): void => {
    setShowPhaseError(false);
    setShowKS4OptionError(false);
    setSelectedKS4Option(null);
    setSelectedPhase(phase);
    if (
      !isMobile &&
      (phase.slug === "primary" ||
        !selectedSubject ||
        !selectedSubject.ks4_options)
    ) {
      setShowPhases(false);
    }
  };

  const handleSelectKS4Option = (ks4Option: KS4Option): void => {
    setShowKS4OptionError(false);
    setSelectedKS4Option(ks4Option);
    if (!isMobile) {
      setShowPhases(false);
    }
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

  const [isPending, startTransition] = useTransition();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleViewCurriculum = () => {
    let canViewCurriculum = true;

    if (!selectedSubject) {
      canViewCurriculum = false;
      setShowSubjectError(true);
      setShowSubjects(true);
      if (isMobile) {
        setShowPhases(false);
      }
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

      // For mobile, keep the modal open during navigation
      if (isMobile) {
        setIsNavigating(true);
      } else {
        setShowPhases(false);
      }

      startTransition(() => {
        router
          .push({
            pathname: `/teachers/curriculum/${subjectPhaseSlug}/${tab}`,
          })
          .finally(() => {
            setIsNavigating(false);
            setShowPhases(false);
          });
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

  const handleConfirmSubject = () => {
    setShowPhases(true);
    setIsMobileLotPickerModalOpen(false);
  };

  const isPhaseSelectionComplete = () => {
    if (!selectedPhase) return false;

    if (selectedPhase.slug === "primary") {
      return true;
    }

    if (selectedPhase.slug === "secondary") {
      // If KS4 options are available, require one to be selected
      if (selectedSubject?.ks4_options) {
        return !!selectedKS4Option;
      }
      // If no KS4 options, just secondary selection is enough
      return true;
    }

    return false;
  };

  return (
    <OakBox>
      <OakJauntyAngleLabel
        $background={"bg-decorative5-main"}
        $color={"text-primary"}
        $font={"heading-7"}
        label={"Choose a curriculum"}
        $zIndex={"banner"}
        $position="relative"
        $top={"all-spacing-2"}
        $width={"fit-content"}
        $left={"all-spacing-2"}
        $borderRadius={"border-radius-square"}
        aria-label="Choose a curriculum"
      />
      <OakBox
        $position="relative"
        data-testid="lot-picker"
        $zIndex={
          (isMobileLotPickerModalOpen || showPhases) && isMobile ? 300 : 101
        }
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
                  data-testid="subject-picker-button"
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
                      data-testid="subject-picker-button-heading"
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

            {/* DESKTOP SUBJECT PICKER */}
            {showSubjects && !isMobile && !isMobileLotPickerModalOpen && (
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
                  enabled={true}
                  autoFocus={false}
                  onClickOutside={() => setShowSubjects(false)}
                  onEscapeKey={() => setShowSubjects(false)}
                  scrollLock={false}
                >
                  <FocusWrap
                    onWrapStart={onFocusSubjectStart}
                    onWrapEnd={onFocusSubjectEnd}
                  >
                    <SubjectContainer
                      showSubjectError={showSubjectError}
                      onClick={() => setShowSubjects(false)}
                    >
                      {sortBy(subjects, "title").map((subject) => (
                        <ButtonContainer
                          className={`lot-picker subject-selection ${
                            isSelected(subject) ? "selected" : ""
                          }`}
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
                    </SubjectContainer>
                  </FocusWrap>
                </FocusOn>
              </SelectionDropDownBox>
            )}

            {/* MOBILE SUBJECT PICKER */}
            {isMobileLotPickerModalOpen && isMobile && (
              <FocusOn
                enabled={isMobile}
                autoFocus={false}
                onEscapeKey={handleMobileLotPickerModal}
                scrollLock={true}
                returnFocus
              >
                <Box
                  data-testid="mobile-subject-picker"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Subject picker"
                  aria-describedby={
                    showSubjectError ? "subject-error-message" : undefined
                  }
                  $position="fixed"
                  $bottom={0}
                  $left={0}
                  $right={0}
                  $background="white"
                  $height="100%"
                  $overflowY="auto"
                  $zIndex="modalDialog"
                  $pa={24}
                >
                  <OakFlex $flexDirection="column" $gap="space-between-m">
                    <OakFlex
                      $alignItems={"center"}
                      $justifyContent={"flex-end"}
                    >
                      <CurriculumModalCloseButton
                        ariaLabel="Close subject picker modal"
                        onClose={handleMobileLotPickerModal}
                      />
                    </OakFlex>

                    <SubjectContainer
                      showSubjectError={showSubjectError}
                      onClick={handleMobileLotPickerModal}
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
                            iconGap="space-between-sssx"
                            onClick={() => {
                              handleSelectSubject(subject);
                            }}
                            pv="inner-padding-xs"
                            ph="inner-padding-s"
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
                    </SubjectContainer>

                    <Box
                      $position="fixed"
                      $bottom={0}
                      $left={0}
                      $zIndex={"modalDialog"}
                      $display={["block"]}
                      $width={"100%"}
                      $ph={30}
                      $pb={10}
                      $pt={12}
                      $background={"white"}
                    >
                      <Hr
                        $color={"grey40"}
                        $position="absolute"
                        $left={0}
                        $top={-24}
                        $height={1}
                        $width="100%"
                      />
                      <OakPrimaryButton
                        data-testid="mobile-subject-picker-confirm-button"
                        iconName="arrow-right"
                        aria-label="Confirm subject"
                        isTrailingIcon={true}
                        onClick={handleConfirmSubject}
                        pv="inner-padding-m"
                        ph="inner-padding-l"
                        disabled={!selectedSubject}
                      >
                        Confirm subject
                      </OakPrimaryButton>
                    </Box>
                  </OakFlex>
                </Box>
              </FocusOn>
            )}
            <Box
              $height={50}
              $width={3}
              $position={"relative"}
              $display={"block"}
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
                    data-testid="phase-picker-button"
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
                        data-testid="phase-picker-button-heading"
                      >
                        School phase
                      </OakHeading>
                      <Box
                        $font={"body-2"}
                        $color={
                          !showPhaseError && !showKS4OptionError
                            ? "black"
                            : "red"
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

                {/* DESKTOP PHASE PICKER */}
                {showPhases && !isMobile && (
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
                      enabled={true}
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
                          <Flex
                            id={phaseErrorId}
                            role="alert"
                            aria-live="polite"
                            $flexDirection={"row"}
                            $mb={20}
                          >
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
                            role="alert"
                            aria-live="polite"
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
                          data-testid="phase-picker-heading"
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
                            ariaLabel="Close phase picker modal"
                            onClose={() => setShowPhases(false)}
                            $position={"absolute"}
                            $top={12}
                            $right={12}
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
                                data-testid="phase-picker-ks4-option-heading"
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
                                {[...selectedSubject.ks4_options]
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
                                      data-testid="phase-picker-ks4-option"
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
                                        hoverShadow={null}
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

                {/* MOBILE PHASE PICKER */}
                {showPhases && isMobile && (isNavigating || !isPending) && (
                  <FocusOn
                    enabled={isMobile}
                    autoFocus={false}
                    onEscapeKey={() => setShowPhases(false)}
                    scrollLock={true}
                    returnFocus
                  >
                    <Box
                      data-testid="mobile-phase-picker"
                      role="dialog"
                      aria-modal="true"
                      aria-label="Phase picker"
                      aria-describedby={
                        showPhaseError
                          ? "phase-error-message"
                          : showKS4OptionError
                            ? "ks4-error-message"
                            : undefined
                      }
                      $position="fixed"
                      $bottom={0}
                      $left={0}
                      $right={0}
                      $background="white"
                      $height="100%"
                      $overflowY="auto"
                      $zIndex="modalDialog"
                      $pa={24}
                    >
                      <OakFlex $flexDirection="column" $gap="space-between-m">
                        <OakFlex
                          $alignItems="center"
                          $justifyContent="space-between"
                        >
                          <Button
                            $ml={-8}
                            size="large"
                            label="Back"
                            data-testid="mobile-phase-picker-back-to-subject-button"
                            icon="chevron-left"
                            $iconPosition="leading"
                            variant="minimal"
                            onClick={() => {
                              setShowPhases(false);
                              setIsMobileLotPickerModalOpen(true);
                            }}
                          />
                          <CurriculumModalCloseButton
                            ariaLabel="Close phase picker modal"
                            onClose={() => setShowPhases(false)}
                          />
                        </OakFlex>

                        <PhaseContainerWrapper>
                          <OakHeading
                            data-testid="mobile-phase-picker-heading"
                            tag="h1"
                            $font="heading-5"
                          >
                            School phase
                          </OakHeading>

                          {showPhaseError && (
                            <Flex
                              id={phaseErrorId}
                              $flexDirection="row"
                              $mb={20}
                            >
                              <Icon
                                $color="red"
                                name="content-guidance"
                                verticalAlign="bottom"
                              />
                              <OakP $color="red">
                                Select a school phase to view the curriculum
                              </OakP>
                            </Flex>
                          )}

                          {showKS4OptionError && (
                            <Flex
                              id={ks4OptionErrorId}
                              $flexDirection="row"
                              $mb={20}
                            >
                              <Icon
                                $color="red"
                                name="content-guidance"
                                verticalAlign="bottom"
                              />
                              <OakP $color="red">
                                Select a KS4 option to view the curriculum
                              </OakP>
                            </Flex>
                          )}

                          <OakFlex
                            role="radiogroup"
                            aria-labelledby={schoolPhaseInputId}
                            aria-required="true"
                            aria-describedby={
                              showPhaseError ? phaseErrorId : undefined
                            }
                            $flexDirection="column"
                            $gap="space-between-s"
                          >
                            {(selectedSubject?.phases ?? phases).map(
                              (phase) => (
                                <ButtonContainer
                                  className={`lot-picker ${isSelected(phase) ? "selected" : ""}`}
                                  key={phase.slug}
                                >
                                  <OakSecondaryButton
                                    data-testid="mobile-phase-button"
                                    key={phase.slug}
                                    role="radio"
                                    pv="inner-padding-m"
                                    ph="inner-padding-s"
                                    width="100%"
                                    onClick={() => handleSelectPhase(phase)}
                                    aria-checked={isSelected(phase)}
                                    title={phase.title}
                                    textAlign="start"
                                    hoverShadow={null}
                                  >
                                    {phase.title}
                                    <OakP
                                      $font="body-2"
                                      $mt="space-between-ssx"
                                    >
                                      {getPhaseText(
                                        phase,
                                        selectedSubject?.keystages ??
                                          DEFAULT_KEYSTAGES,
                                      )}
                                    </OakP>
                                  </OakSecondaryButton>
                                </ButtonContainer>
                              ),
                            )}
                          </OakFlex>

                          {selectedPhase?.slug === "secondary" &&
                            selectedSubject?.ks4_options && (
                              <OakFlex
                                $flexDirection="column"
                                $gap="space-between-xs"
                              >
                                <OakHeading
                                  data-testid="mobile-phase-picker-ks4-option-heading"
                                  id={ks4OptionInputId}
                                  $mt="space-between-ssx"
                                  tag="h2"
                                  $font="heading-7"
                                >
                                  Choose an option for KS4:
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
                                  $flexWrap="wrap"
                                  $flexDirection="row"
                                  $gap="all-spacing-2"
                                >
                                  {selectedSubject.ks4_options
                                    .sort((a: KS4Option) =>
                                      isExamboardSlug(a.slug) ? 1 : -1,
                                    )
                                    .map((ks4Option: KS4Option) => (
                                      <ButtonContainer
                                        key={ks4Option.slug}
                                        className={`lot-picker ${isSelected(ks4Option) ? "selected" : ""}`}
                                        data-testid="mobile-phase-picker-ks4-option"
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
                                          pv="inner-padding-xs"
                                          ph="inner-padding-s"
                                          hoverShadow={null}
                                        >
                                          {createKS4OptionTitle(
                                            selectedSubject.title,
                                            ks4Option,
                                          )}
                                        </OakSecondaryButton>
                                      </ButtonContainer>
                                    ))}
                                </OakFlex>
                              </OakFlex>
                            )}
                        </PhaseContainerWrapper>
                        <Box
                          $position="fixed"
                          $bottom={0}
                          $left={0}
                          $display={["block"]}
                          $zIndex={"modalDialog"}
                          $width="100%"
                          $ph={24}
                          $pv={10}
                          $background="white"
                        >
                          <Hr
                            $color={"grey40"}
                            $position="absolute"
                            $left={0}
                            $top={-24}
                            $height={1}
                            $width="100%"
                          />
                          <OakPrimaryButton
                            data-testid="mobile-phase-picker-confirm-button"
                            iconName="arrow-right"
                            aria-label="View curriculum"
                            isTrailingIcon={true}
                            onClick={() => {
                              handleViewCurriculum();
                            }}
                            pv="inner-padding-m"
                            ph="inner-padding-l"
                            isLoading={isNavigating}
                            disabled={!isPhaseSelectionComplete()}
                          >
                            View curriculum
                          </OakPrimaryButton>
                        </Box>
                      </OakFlex>
                    </Box>
                  </FocusOn>
                )}

                <OakFlex
                  $position="absolute"
                  $right="all-spacing-0"
                  $pr="inner-padding-m"
                  $alignContent="center"
                  $maxWidth={["all-spacing-15", "all-spacing-17"]}
                  $width="fit-content"
                  $height="100%"
                  $display={["none", "block"]}
                  $zIndex={3}
                  ref={subjectPickerButtonDesktopContainer}
                >
                  <OakPrimaryButton
                    iconName="arrow-right"
                    isTrailingIcon={true}
                    onClick={handleViewCurriculum}
                    data-testid="lot-picker-view-curriculum-button"
                  >
                    View
                  </OakPrimaryButton>
                </OakFlex>
              </OakFlex>
            </Box>
          </OakFlex>
        </OakFlex>
      </OakBox>
    </OakBox>
  );
};

export default SubjectPhasePicker;
