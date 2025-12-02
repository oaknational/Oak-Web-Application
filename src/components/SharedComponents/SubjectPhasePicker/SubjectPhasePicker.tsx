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
  OakHandDrawnHR,
} from "@oaknational/oak-components";
import { sortBy } from "lodash";
import { flushSync } from "react-dom";
import {
  examboardSlugs,
  ProgrammeFields,
} from "@oaknational/oak-curriculum-schema";

import OwaLink from "@/components/SharedComponents/OwaLink";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";
import type {
  KS4Option,
  Phase,
  Subject,
  CurriculumPhaseOptions,
  CurriculumPhaseOption,
} from "@/node-lib/curriculum-api-2023";
import useAnalytics from "@/context/Analytics/useAnalytics";
import FocusIndicator from "@/components/CurriculumComponents/OakComponentsKitchen/FocusIndicator";
import { getPhaseText } from "@/utils/curriculum/formatting";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import FocusWrap from "@/components/CurriculumComponents/OakComponentsKitchen/FocusWrap";
import Button from "@/components/SharedComponents/Button";
import { CurriculumModalCloseButton } from "@/components/CurriculumComponents/CurriculumModalCloseButton/CurriculumModalCloseButton";
import useMediaQuery from "@/hooks/useMediaQuery";
import { PhaseValueType } from "@/browser-lib/avo/Avo";

const TruncatedFlex = styled(OakFlex)`
  max-width: calc(100% - 1rem);

  @media (min-width: 750px) {
    max-width: calc(100% - 8rem);
  }
`;

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
  subjects: CurriculumPhaseOptions;
  currentSelection?: {
    subject: CurriculumPhaseOption;
    phase: Phase;
    ks4Option: KS4Option | null;
  };
  tab: "overview" | "units" | "downloads";
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

const SelectionDropDownBox = styled(OakBox)<object>`
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

  @media (min-width: 749px) {
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

  @media (min-width: 749px) {
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
}: Readonly<SubjectContainerProps>) {
  const subjectErrorId = useId();
  const subjectInputId = useId();
  const isMobile = useMediaQuery("mobile");

  return (
    <SubjectContainerWrapper>
      {showSubjectError && (
        <OakFlex
          id={subjectErrorId}
          role="alert"
          $flexDirection={"row"}
          $mb={"spacing-24"}
        >
          <OakIcon
            iconName="content-guidance"
            $colorFilter={"red"}
            $height={"spacing-24"}
          />
          <OakP $color={"text-error"}>
            Select a subject to view a curriculum
          </OakP>
        </OakFlex>
      )}
      <OakFlex
        $flexDirection={"column"}
        $alignItems={"flex-start"}
        $gap={"spacing-32"}
        $mb={"spacing-4"}
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

        <OakFlex $flexDirection={"column"} $gap={["spacing-8", "spacing-4"]}>
          {!isMobile && (
            <CurriculumModalCloseButton
              ariaLabel="Close subject picker modal"
              onClose={onClick}
              $position={"absolute"}
              $top={"spacing-12"}
              $right={"spacing-12"}
            />
          )}

          <OakHeading
            id={subjectInputId}
            tag={"h2"}
            $font={"heading-6"}
            $mr="spacing-12"
            data-testid="subject-picker-heading"
          >
            Curriculum plans
          </OakHeading>
          <OakP>Explore our curricula for 2024/2025.</OakP>
        </OakFlex>
      </OakFlex>
      <OakBox $mv={["spacing-32", "spacing-24"]}>
        <OakFlex
          role="radiogroup"
          aria-labelledby={subjectInputId}
          aria-required="true"
          aria-describedby={showSubjectError ? subjectErrorId : undefined}
          $gap={"spacing-12"}
          $alignItems={"flex-start"}
          $flexWrap={"wrap"}
        >
          {children}
        </OakFlex>
      </OakBox>
      <OakBox $mb={["spacing-32", "spacing-0"]}>
        <OwaLink
          page={"curriculum-previous-downloads"}
          $textDecoration={"underline"}
          $font={"heading-7"}
          data-testid="subject-picker-previous-plans-link"
          $display={"flex"}
          $alignItems={"center"}
        >
          Previously released plans
          <OakIcon iconName="arrow-right" $width={"spacing-24"} />
        </OwaLink>
      </OakBox>
    </SubjectContainerWrapper>
  );
}

const SubjectPhasePicker: FC<SubjectPhasePickerData> = ({
  subjects,
  currentSelection,
  tab,
}) => {
  const phasePickerButton = useRef<HTMLButtonElement>(null);
  const subjectPickerButton = useRef<HTMLButtonElement>(null);
  const subjectPickerButtonDesktopContainer = useRef<HTMLDivElement>(null);
  const subjectPickerButtonMobileContainer = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const ks4OptionErrorId = useId();
  const phaseErrorId = useId();

  const { track } = useAnalytics();

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
    useState<CurriculumPhaseOption | null>(initialSubject || null);
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

  const handleSelectSubject = (subject: CurriculumPhaseOption): void => {
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
        platform: "owa",
        product: "curriculum visualiser",
        engagementIntent: "use",
        componentType: "curriculum_visualiser_button",
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
        phase: selectedPhase.slug as PhaseValueType,
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
      const newPathname = `/teachers/curriculum/${subjectPhaseSlug}/${tab}`;
      trackViewCurriculum();

      // For mobile, keep the modal open during navigation
      if (isMobile) {
        setIsNavigating(true);
      } else {
        setIsNavigating(true);
        setShowPhases(false);
      }

      startTransition(() => {
        router
          .push({
            pathname: newPathname,
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

  const ks4Options = selectedSubject?.ks4_options ?? [];

  return (
    <OakBox as="nav" aria-labelledby="choose-curriculum-label">
      <OakJauntyAngleLabel
        id="choose-curriculum-label"
        $background={"bg-decorative5-main"}
        $color={"text-primary"}
        $font={"heading-7"}
        label={"Choose a curriculum"}
        $zIndex={298}
        $position="relative"
        $top={"spacing-8"}
        $width={"fit-content"}
        $left={"spacing-8"}
        $borderRadius={"border-radius-square"}
      />
      <OakBox
        $position="relative"
        data-testid="lot-picker"
        $zIndex={
          (isMobileLotPickerModalOpen || showPhases) && isMobile
            ? "modal-dialog"
            : "modal-close-button"
        }
        $maxWidth="spacing-960"
        $borderRadius="border-radius-s"
        $borderColor={
          showSubjects || showPhases ? "transparent" : "border-primary"
        }
        $ba="border-solid-m"
      >
        {/* Subject button */}
        <OakFlex
          $position="relative"
          $borderRadius="border-radius-s"
          $alignItems={"center"}
          $justifyContent={"space-between"}
          $gap="spacing-0"
          $flexDirection={["column", "row"]}
          $width={"100%"}
          $background={
            showSubjects || showPhases ? "bg-neutral-stronger" : "bg-primary"
          }
        >
          <OakFlex
            $flexDirection={"row"}
            $alignItems={"center"}
            $justifyContent={"flex-start"}
            $width={"100%"}
          >
            <OakFlex
              $position={"relative"}
              $alignSelf={"stretch"}
              $background={showSubjects ? "bg-primary" : null}
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
                  aria-expanded={isMobileLotPickerModalOpen || showSubjects}
                >
                  <OakBox
                    $pl="spacing-16"
                    $pr="spacing-16"
                    $pt="spacing-12"
                    $pb="spacing-12"
                  >
                    <OakSpan
                      $font={"heading-light-7"}
                      $mb="spacing-4"
                      $color={!showSubjectError ? "text-primary" : "text-error"}
                      data-testid="subject-picker-button-heading"
                    >
                      Subject
                    </OakSpan>
                    {showSubjectError && (
                      <OakFlex>
                        <OakIcon
                          iconName="content-guidance"
                          $colorFilter={"red"}
                          $height={"spacing-24"}
                        />
                        <OakSpan
                          $color={
                            !showSubjectError ? "text-primary" : "text-error"
                          }
                        >
                          Select a subject
                        </OakSpan>
                      </OakFlex>
                    )}
                    <OakP
                      $font={"body-2"}
                      $color={!showSubjectError ? "text-primary" : "text-error"}
                    >
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
                $left={"spacing-0"}
                $mt={"spacing-8"}
                $pa={"spacing-24"}
                $position="absolute"
                $top={"spacing-72"}
                $zIndex={"modal-dialog"}
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
                      {sortBy(subjects, "title").map((subject, index) => (
                        <ButtonContainer
                          key={`${subject.slug}-selection-${index}`}
                          className={`lot-picker subject-selection ${
                            isSelected(subject) ? "selected" : ""
                          }`}
                        >
                          <OakSecondaryButton
                            role="radio"
                            iconGap={"spacing-4"}
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
                <OakBox
                  data-testid="mobile-subject-picker"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Subject picker"
                  aria-describedby={
                    showSubjectError ? "subject-error-message" : undefined
                  }
                  $position="fixed"
                  $bottom={"spacing-0"}
                  $left={"spacing-0"}
                  $right={"spacing-0"}
                  $background="bg-primary"
                  $height="100%"
                  $overflowY="auto"
                  $zIndex="modal-dialog"
                  $pa={"spacing-24"}
                >
                  <OakFlex $flexDirection="column" $gap="spacing-24">
                    <OakFlex
                      $alignItems={"center"}
                      $justifyContent={"flex-end"}
                    >
                      <CurriculumModalCloseButton
                        ariaLabel="Close subject picker"
                        onClose={handleMobileLotPickerModal}
                      />
                    </OakFlex>

                    <SubjectContainer
                      showSubjectError={showSubjectError}
                      onClick={handleMobileLotPickerModal}
                    >
                      {sortBy(subjects, "title").map((subject, index) => (
                        <ButtonContainer
                          className={`lot-picker subject-selection ${
                            isSelected(subject) ? "selected" : ""
                          }`}
                          key={`${subject.slug}-mobile-selection-${index}`}
                        >
                          <OakSecondaryButton
                            role="radio"
                            iconGap="spacing-4"
                            onClick={() => {
                              handleSelectSubject(subject);
                            }}
                            pv="spacing-8"
                            ph="spacing-12"
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

                    <OakBox
                      $position="fixed"
                      $bottom={"spacing-0"}
                      $left={"spacing-0"}
                      $zIndex={"modal-dialog"}
                      $display={["block"]}
                      $width={"100%"}
                      $background={"bg-primary"}
                    >
                      <OakHandDrawnHR
                        hrColor={"bg-interactive-element2"}
                        $height={"spacing-2"}
                        $width="100%"
                      />
                      <OakBox
                        $ph={"spacing-32"}
                        $pb={"spacing-12"}
                        $pt={"spacing-12"}
                      >
                        <OakPrimaryButton
                          data-testid="mobile-subject-picker-confirm-button"
                          iconName="arrow-right"
                          aria-label="Confirm subject"
                          isTrailingIcon={true}
                          onClick={handleConfirmSubject}
                          pv="spacing-16"
                          ph="spacing-20"
                          disabled={!selectedSubject}
                        >
                          Confirm subject
                        </OakPrimaryButton>
                      </OakBox>
                    </OakBox>
                  </OakFlex>
                </OakBox>
              </FocusOn>
            )}
            {/* SEPARATOR */}
            <OakBox
              $height={"spacing-48"}
              $width={"spacing-2"}
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
            </OakBox>
            {/* PHASE Button */}
            <OakBox $position={"relative"} style={{ width: "50%" }}>
              <OakFlex
                $position={"relative"}
                $flexDirection={"row"}
                $gap="spacing-16"
                $background={showPhases ? "bg-primary" : null}
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
                    aria-expanded={showPhases}
                  >
                    <OakBox $pl="spacing-16" $pt="spacing-12" $pb="spacing-12">
                      <OakSpan
                        $font={"heading-light-7"}
                        $mb="spacing-4"
                        $color={
                          !showSubjectError ? "text-primary" : "text-error"
                        }
                        data-testid="phase-picker-button-heading"
                      >
                        School phase
                      </OakSpan>
                      <OakBox
                        $font={"body-2"}
                        $color={
                          !showPhaseError && !showKS4OptionError
                            ? "text-primary"
                            : "text-error"
                        }
                      >
                        {showPhaseError && (
                          <OakFlex>
                            <OakIcon
                              iconName="content-guidance"
                              $colorFilter={"red"}
                              $height={"spacing-24"}
                            />
                            Select a school phase
                          </OakFlex>
                        )}
                        {showKS4OptionError && (
                          <TruncatedFlex>
                            <OakIcon
                              iconName="content-guidance"
                              $colorFilter={"red"}
                              $height={"spacing-24"}
                            />
                            <OakSpan
                              $textOverflow="ellipsis"
                              $overflow="hidden"
                              $whiteSpace="nowrap"
                            >
                              Select an option for KS4
                            </OakSpan>
                          </TruncatedFlex>
                        )}
                        {selectedPhase && !showKS4OptionError && (
                          <OakBox
                            $textOverflow={"ellipsis"}
                            $whiteSpace={"nowrap"}
                            $overflowX={"hidden"}
                          >
                            <OakSpan>{selectedPhase.title}</OakSpan>
                            {selectedKS4Option && (
                              <OakSpan>, {selectedKS4Option.title}</OakSpan>
                            )}
                          </OakBox>
                        )}
                        {!selectedPhase &&
                          !showPhaseError &&
                          !showKS4OptionError &&
                          "Select"}
                      </OakBox>
                    </OakBox>
                  </PickerButton>
                </FocusIndicatorAlt>

                {/* DESKTOP PHASE PICKER */}
                {showPhases && !isMobile && (
                  <SelectionDropDownBox
                    $background={"white"}
                    $mt={"spacing-8"}
                    $pa={"spacing-32"}
                    $position="absolute"
                    $top={"spacing-72"}
                    $zIndex={"modal-dialog"}
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
                          <OakFlex
                            id={phaseErrorId}
                            role="alert"
                            $flexDirection={"row"}
                            $mb={"spacing-24"}
                          >
                            <OakIcon
                              iconName="content-guidance"
                              $colorFilter={"red"}
                              $height={"spacing-24"}
                            />
                            <OakP $color={"text-error"}>
                              Select a school phase to view the curriculum
                            </OakP>
                          </OakFlex>
                        )}
                        {showKS4OptionError ? (
                          <OakFlex
                            id={ks4OptionErrorId}
                            role="alert"
                            aria-live="polite"
                            $flexDirection={"row"}
                            $mb={"spacing-24"}
                          >
                            <OakIcon
                              iconName="content-guidance"
                              $colorFilter={"red"}
                              $height={"spacing-24"}
                            />
                            <OakP $color={"text-error"}>
                              Select a KS4 option to view the curriculum
                            </OakP>
                          </OakFlex>
                        ) : (
                          ""
                        )}
                        <OakHeading
                          id={schoolPhaseInputId}
                          tag={"h4"}
                          $font={"heading-6"}
                          $mb="spacing-16"
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
                          $gap={"spacing-16"}
                        >
                          <CurriculumModalCloseButton
                            ariaLabel="Close phase picker"
                            onClose={() => setShowPhases(false)}
                            $position={"absolute"}
                            $top={"spacing-12"}
                            $right={"spacing-12"}
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
                                pv={"spacing-12"}
                                ph={"spacing-12"}
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
                          ks4Options.length > 0 && (
                            <>
                              <OakHeading
                                data-testid="phase-picker-ks4-option-heading"
                                id={ks4OptionInputId}
                                $mb="spacing-16"
                                $mt="spacing-24"
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
                                $gap={"spacing-8"}
                              >
                                {selectedSubject &&
                                  [...ks4Options]
                                    // sort Core/GSCE first
                                    .sort((a: KS4Option) =>
                                      isExamboardSlug(a.slug) ? 1 : -1,
                                    )
                                    .map((ks4Option: KS4Option) => (
                                      <ButtonContainer
                                        key={ks4Option.slug}
                                        className={`lot-picker ${
                                          isSelected(ks4Option)
                                            ? "selected"
                                            : ""
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
                    <OakBox
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
                      $bottom={"spacing-0"}
                      $left={"spacing-0"}
                      $right={"spacing-0"}
                      $background="bg-primary"
                      $height="100%"
                      $overflowY="auto"
                      $zIndex="modal-dialog"
                      $pa={"spacing-24"}
                    >
                      <OakFlex $flexDirection="column" $gap="spacing-24">
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
                            <OakFlex
                              id={phaseErrorId}
                              $flexDirection="row"
                              $mb={"spacing-24"}
                            >
                              <OakIcon
                                iconName="content-guidance"
                                $colorFilter={"red"}
                                $height={"spacing-24"}
                              />
                              <OakP $color="text-error">
                                Select a school phase to view the curriculum
                              </OakP>
                            </OakFlex>
                          )}

                          {showKS4OptionError && (
                            <OakFlex
                              id={ks4OptionErrorId}
                              $flexDirection="row"
                              $mb={"spacing-24"}
                            >
                              <OakIcon
                                iconName="content-guidance"
                                $colorFilter={"red"}
                                $height={"spacing-24"}
                              />
                              <OakP $color="text-error">
                                Select a KS4 option to view the curriculum
                              </OakP>
                            </OakFlex>
                          )}

                          <OakFlex
                            role="radiogroup"
                            aria-labelledby={schoolPhaseInputId}
                            aria-required="true"
                            aria-describedby={
                              showPhaseError ? phaseErrorId : undefined
                            }
                            $flexDirection="column"
                            $gap="spacing-16"
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
                                    pv="spacing-16"
                                    ph="spacing-12"
                                    width="100%"
                                    onClick={() => handleSelectPhase(phase)}
                                    aria-checked={isSelected(phase)}
                                    title={phase.title}
                                    textAlign="start"
                                    hoverShadow={null}
                                  >
                                    {phase.title}
                                    <OakP $font="body-2" $mt="spacing-8">
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
                            ks4Options.length > 0 && (
                              <OakFlex
                                $flexDirection="column"
                                $gap="spacing-12"
                              >
                                <OakHeading
                                  data-testid="mobile-phase-picker-ks4-option-heading"
                                  id={ks4OptionInputId}
                                  $mt="spacing-8"
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
                                  $gap="spacing-8"
                                >
                                  {selectedSubject &&
                                    [...ks4Options]
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
                                            pv="spacing-8"
                                            ph="spacing-12"
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
                        <OakBox
                          $position="fixed"
                          $bottom={"spacing-0"}
                          $left={"spacing-0"}
                          $display={["block"]}
                          $zIndex={"modal-dialog"}
                          $width="100%"
                          $background="bg-primary"
                        >
                          <OakHandDrawnHR
                            hrColor={"bg-interactive-element2"}
                            $height={"spacing-2"}
                            $width="100%"
                          />
                          <OakBox $ph={"spacing-24"} $pv={"spacing-12"}>
                            <OakPrimaryButton
                              data-testid="mobile-phase-picker-confirm-button"
                              iconName="arrow-right"
                              aria-label="View curriculum"
                              isTrailingIcon={true}
                              onClick={() => {
                                handleViewCurriculum();
                              }}
                              pv="spacing-16"
                              ph="spacing-20"
                              isLoading={isNavigating}
                              disabled={!isPhaseSelectionComplete()}
                            >
                              View curriculum
                            </OakPrimaryButton>
                          </OakBox>
                        </OakBox>
                      </OakFlex>
                    </OakBox>
                  </FocusOn>
                )}

                <OakFlex
                  $position="absolute"
                  $right="spacing-0"
                  $pr="spacing-16"
                  $alignContent="center"
                  $maxWidth={["spacing-100", "spacing-160"]}
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
                    isLoading={isNavigating}
                  >
                    View
                  </OakPrimaryButton>
                </OakFlex>
              </OakFlex>
            </OakBox>
          </OakFlex>
        </OakFlex>
      </OakBox>
    </OakBox>
  );
};

export default SubjectPhasePicker;
