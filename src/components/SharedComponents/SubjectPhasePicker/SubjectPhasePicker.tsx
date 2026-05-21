import { useState, useId, useRef, useTransition } from "react";
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
  OakFocusIndicator,
  OakTertiaryButton,
} from "@oaknational/oak-components";
import { sortBy } from "lodash";
import { flushSync } from "react-dom";
import {
  examboardSlugs,
  ProgrammeFields,
} from "@oaknational/oak-curriculum-schema";

import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";
import type {
  KS4Option,
  Phase,
  Subject,
  CurriculumPhaseOptions,
  CurriculumPhaseOption,
} from "@/node-lib/curriculum-api-2023";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { getPhaseText } from "@/utils/curriculum/formatting";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import FocusWrap from "@/components/CurriculumComponents/OakComponentsKitchen/FocusWrap";
import { CurriculumModalCloseButton } from "@/components/CurriculumComponents/CurriculumModalCloseButton/CurriculumModalCloseButton";
import useMediaQuery from "@/hooks/useMediaQuery";
import { PhaseValueType } from "@/browser-lib/avo/Avo";

const TruncatedFlex = styled(OakFlex)`
  max-width: calc(100% - 1rem);

  @media (min-width: 750px) {
    max-width: calc(100% - 8rem);
  }
`;

const OakFocusIndicatorAlt = styled(OakFocusIndicator)<{
  assertFocus: boolean;
}>`
  box-shadow: ${(props) =>
    props.assertFocus ? `rgb(87, 87, 87) 0px 0px 0px 0.125rem` : "none"};
  z-index: ${(props) => (props.assertFocus ? "2" : "")};
`;

const isExamboardSlug = (
  examboardSlug: unknown,
): examboardSlug is ProgrammeFields["examboard_slug"] => {
  const parsedSlug = examboardSlugs.safeParse(examboardSlug);
  return parsedSlug.success;
};

const DEFAULT_KEYSTAGES = [
  { slug: "ks1" },
  { slug: "ks2" },
  { slug: "ks3" },
  { slug: "ks4" },
];

const DEFAULT_PHASES = [
  { title: "Primary", slug: "primary" },
  { title: "Secondary", slug: "secondary" },
];

export type SubjectPhasePickerData = {
  subjects: CurriculumPhaseOptions;
  currentSelection?: {
    subject: CurriculumPhaseOption;
    phase: Phase;
    ks4Option: KS4Option | null;
  };
  tab: "overview" | "units" | "downloads";
};

type ValidationResult = {
  canProceed: boolean;
  errors: { subject?: boolean; phase?: boolean; ks4?: boolean };
};

const validateSelection = (
  selectedSubject: CurriculumPhaseOption | null,
  selectedPhase: Phase | null,
  selectedKS4Option: KS4Option | null,
): ValidationResult => {
  const errors: ValidationResult["errors"] = {};

  if (!selectedSubject) {
    errors.subject = true;
  }
  if (!selectedPhase) {
    errors.phase = true;
  }
  if (
    selectedSubject?.ks4_options &&
    selectedPhase?.slug === "secondary" &&
    !selectedKS4Option
  ) {
    errors.ks4 = true;
  }

  return {
    canProceed: Object.keys(errors).length === 0,
    errors,
  };
};

const createKS4OptionTitle = (subject: string, option: KS4Option) => {
  const { title, slug } = option;
  if (subject === "Computing" && isExamboardSlug(slug)) {
    return `${title} (Computer Science)`;
  }
  return title;
};

const isPhaseSelectionComplete = (
  selectedPhase: Phase | null,
  selectedSubject: CurriculumPhaseOption | null,
  selectedKS4Option: KS4Option | null,
): boolean => {
  if (!selectedPhase) return false;
  if (selectedPhase.slug === "primary") return true;
  if (selectedPhase.slug === "secondary") {
    if (selectedSubject?.ks4_options) {
      return !!selectedKS4Option;
    }
    return true;
  }
  return false;
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
        box-shadow:
          0px 0px 0px 2px #ffe555,
          0px 0px 0px 5px #575757;
      }

      :active {
        border-radius: var(--Border-Radius-border-radius-s, 4px);
        border: 1px solid var(--Tokens-Border-border-neutral-lighter, #cacaca);
        background: var(--Tokens-Background-bg-primary, #fff);
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

type PickerErrorProps = {
  id: string;
  message: string;
};

function PickerError({ id, message }: Readonly<PickerErrorProps>) {
  return (
    <OakFlex id={id} role="alert" $flexDirection="row" $mb="spacing-24">
      <OakIcon
        iconName="content-guidance"
        $colorFilter="icon-error"
        $height="spacing-24"
      />
      <OakP $color="text-error">{message}</OakP>
    </OakFlex>
  );
}

type MobilePickerFooterProps = {
  buttonText: string;
  ariaLabel: string;
  onClick: () => void;
  disabled: boolean;
  isLoading?: boolean;
  testId: string;
};

function MobilePickerFooter({
  buttonText,
  ariaLabel,
  onClick,
  disabled,
  isLoading = false,
  testId,
}: Readonly<MobilePickerFooterProps>) {
  return (
    <OakBox
      $position="fixed"
      $bottom="spacing-0"
      $left="spacing-0"
      $zIndex="modal-dialog"
      $display={["block"]}
      $width="100%"
      $background="bg-primary"
    >
      <OakHandDrawnHR
        hrColor="bg-interactive-element2"
        $height="spacing-2"
        $width="100%"
      />
      <OakBox $ph="spacing-24" $pv="spacing-12">
        <OakPrimaryButton
          data-testid={testId}
          iconName="arrow-right"
          aria-label={ariaLabel}
          isTrailingIcon
          onClick={onClick}
          pv="spacing-16"
          ph="spacing-20"
          disabled={disabled}
          isLoading={isLoading}
        >
          {buttonText}
        </OakPrimaryButton>
      </OakBox>
    </OakBox>
  );
}

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
        <PickerError
          id={subjectErrorId}
          message="Select a subject to view a curriculum"
        />
      )}
      <OakFlex
        $flexDirection="column"
        $alignItems="flex-start"
        $gap="spacing-32"
        $mb="spacing-4"
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

        <OakFlex $flexDirection="column" $gap={["spacing-8", "spacing-4"]}>
          {!isMobile && (
            <CurriculumModalCloseButton
              ariaLabel="Close subject picker modal"
              onClose={onClick}
              $position="absolute"
              $top="spacing-12"
              $right="spacing-12"
            />
          )}

          <OakHeading
            id={subjectInputId}
            tag="h2"
            $font="heading-6"
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
          $gap="spacing-12"
          $alignItems="flex-start"
          $flexWrap="wrap"
        >
          {children}
        </OakFlex>
      </OakBox>
    </SubjectContainerWrapper>
  );
}

type SubjectListProps = {
  subjects: CurriculumPhaseOptions;
  isSelected: (option: Subject | Phase | KS4Option) => boolean;
  onSelectSubject: (subject: CurriculumPhaseOption) => void;
  isMobile?: boolean;
};

function SubjectList({
  subjects,
  isSelected,
  onSelectSubject,
  isMobile = false,
}: Readonly<SubjectListProps>) {
  return (
    <>
      {sortBy(subjects, "title").map((subject, index) => (
        <ButtonContainer
          key={`${subject.slug}-${isMobile ? "mobile-" : ""}selection-${index}`}
          className={`lot-picker subject-selection ${isSelected(subject) ? "selected" : ""}`}
        >
          <OakSecondaryButton
            role="radio"
            iconGap="spacing-4"
            onClick={() => onSelectSubject(subject)}
            aria-checked={isSelected(subject)}
            title={subject.title}
            hoverShadow={null}
            pv={isMobile ? "spacing-8" : undefined}
            ph={isMobile ? "spacing-12" : undefined}
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
    </>
  );
}

type KS4OptionsSectionProps = {
  ks4Options: KS4Option[];
  selectedSubject: CurriculumPhaseOption;
  showError: boolean;
  errorId: string;
  inputId: string;
  isSelected: (option: KS4Option) => boolean;
  onSelect: (option: KS4Option) => void;
  isMobile?: boolean;
};

function KS4OptionsSection({
  ks4Options,
  selectedSubject,
  showError,
  errorId,
  inputId,
  isSelected,
  onSelect,
  isMobile = false,
}: Readonly<KS4OptionsSectionProps>) {
  const sortedOptions = [...ks4Options].sort((a) =>
    isExamboardSlug(a.slug) ? 1 : -1,
  );

  return (
    <OakFlex $flexDirection="column" $gap="spacing-12">
      <OakHeading
        data-testid={
          isMobile
            ? "mobile-phase-picker-ks4-option-heading"
            : "phase-picker-ks4-option-heading"
        }
        id={inputId}
        $mt={isMobile ? "spacing-8" : "spacing-24"}
        $mb={isMobile ? undefined : "spacing-16"}
        tag={isMobile ? "h2" : "h4"}
        $font={isMobile ? "heading-7" : "heading-6"}
      >
        Choose an option for KS4{isMobile ? ":" : ""}
      </OakHeading>
      <OakFlex
        role="radiogroup"
        aria-labelledby={inputId}
        aria-required="true"
        aria-describedby={showError ? errorId : undefined}
        $flexWrap="wrap"
        $flexDirection="row"
        $gap="spacing-8"
      >
        {sortedOptions.map((ks4Option) => (
          <ButtonContainer
            key={ks4Option.slug}
            className={`lot-picker ${isSelected(ks4Option) ? "selected" : ""}`}
            data-testid={
              isMobile
                ? "mobile-phase-picker-ks4-option"
                : "phase-picker-ks4-option"
            }
          >
            <OakSecondaryButton
              role="radio"
              onClick={() => onSelect(ks4Option)}
              title={createKS4OptionTitle(selectedSubject.title, ks4Option)}
              aria-checked={isSelected(ks4Option)}
              pv={isMobile ? "spacing-8" : undefined}
              ph={isMobile ? "spacing-12" : undefined}
              hoverShadow={null}
            >
              {createKS4OptionTitle(selectedSubject.title, ks4Option)}
            </OakSecondaryButton>
          </ButtonContainer>
        ))}
      </OakFlex>
    </OakFlex>
  );
}

type PhaseListProps = {
  phases: Phase[];
  selectedSubject: CurriculumPhaseOption | null;
  schoolPhaseInputId: string;
  showPhaseError: boolean;
  phaseErrorId: string;
  isSelected: (option: Phase) => boolean;
  onSelectPhase: (phase: Phase) => void;
  isMobile?: boolean;
};

function PhaseList({
  phases,
  selectedSubject,
  schoolPhaseInputId,
  showPhaseError,
  phaseErrorId,
  isSelected,
  onSelectPhase,
  isMobile = false,
}: Readonly<PhaseListProps>) {
  return (
    <OakFlex
      role="radiogroup"
      aria-labelledby={schoolPhaseInputId}
      aria-required="true"
      aria-describedby={showPhaseError ? phaseErrorId : undefined}
      $flexDirection="column"
      $gap="spacing-16"
    >
      {phases.map((phase) => (
        <ButtonContainer
          className={`lot-picker ${isSelected(phase) ? "selected" : ""}`}
          key={phase.slug}
        >
          <OakSecondaryButton
            data-testid={isMobile ? "mobile-phase-button" : undefined}
            key={phase.slug}
            role="radio"
            pv={isMobile ? "spacing-16" : "spacing-12"}
            ph="spacing-12"
            width="100%"
            onClick={() => onSelectPhase(phase)}
            aria-checked={isSelected(phase)}
            title={phase.title}
            textAlign="start"
            hoverShadow={null}
          >
            {phase.title}
            <OakP $font="body-2" $mt={isMobile ? "spacing-8" : undefined}>
              {getPhaseText(
                phase,
                selectedSubject?.keystages ?? DEFAULT_KEYSTAGES,
              )}
            </OakP>
          </OakSecondaryButton>
        </ButtonContainer>
      ))}
    </OakFlex>
  );
}

type DesktopSubjectPickerProps = {
  subjects: CurriculumPhaseOptions;
  showSubjectError: boolean;
  isSelected: (option: Subject | Phase | KS4Option) => boolean;
  onSelectSubject: (subject: CurriculumPhaseOption) => void;
  onClose: () => void;
  onFocusStart: () => Promise<void>;
  onFocusEnd: () => Promise<void>;
};

function DesktopSubjectPicker({
  subjects,
  showSubjectError,
  isSelected,
  onSelectSubject,
  onClose,
  onFocusStart,
  onFocusEnd,
}: Readonly<DesktopSubjectPickerProps>) {
  return (
    <SelectionDropDownBox
      $background="bg-primary"
      $left="spacing-0"
      $mt="spacing-8"
      $pa="spacing-24"
      $position="absolute"
      $top="spacing-72"
      $zIndex="modal-dialog"
      $width="100%"
    >
      <FocusOn
        enabled
        autoFocus={false}
        onClickOutside={onClose}
        onEscapeKey={onClose}
        scrollLock={false}
      >
        <FocusWrap onWrapStart={onFocusStart} onWrapEnd={onFocusEnd}>
          <SubjectContainer
            showSubjectError={showSubjectError}
            onClick={onClose}
          >
            <SubjectList
              subjects={subjects}
              isSelected={isSelected}
              onSelectSubject={onSelectSubject}
            />
          </SubjectContainer>
        </FocusWrap>
      </FocusOn>
    </SelectionDropDownBox>
  );
}

type MobileSubjectPickerProps = {
  subjects: CurriculumPhaseOptions;
  showSubjectError: boolean;
  selectedSubject: CurriculumPhaseOption | null;
  isSelected: (option: Subject | Phase | KS4Option) => boolean;
  onSelectSubject: (subject: CurriculumPhaseOption) => void;
  onClose: () => void;
  onConfirm: () => void;
};

function MobileSubjectPicker({
  subjects,
  showSubjectError,
  selectedSubject,
  isSelected,
  onSelectSubject,
  onClose,
  onConfirm,
}: Readonly<MobileSubjectPickerProps>) {
  return (
    <FocusOn
      enabled
      autoFocus={false}
      onEscapeKey={onClose}
      scrollLock
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
        $bottom="spacing-0"
        $left="spacing-0"
        $right="spacing-0"
        $background="bg-primary"
        $height="100%"
        $overflowY="auto"
        $zIndex="modal-dialog"
        $pa="spacing-24"
      >
        <OakFlex $flexDirection="column" $gap="spacing-24">
          <OakFlex $alignItems="center" $justifyContent="flex-end">
            <CurriculumModalCloseButton
              ariaLabel="Close subject picker"
              onClose={onClose}
            />
          </OakFlex>
          <SubjectContainer
            showSubjectError={showSubjectError}
            onClick={onClose}
          >
            <SubjectList
              subjects={subjects}
              isSelected={isSelected}
              onSelectSubject={onSelectSubject}
              isMobile
            />
          </SubjectContainer>
          <MobilePickerFooter
            testId="mobile-subject-picker-confirm-button"
            buttonText="Confirm subject"
            ariaLabel="Confirm subject"
            onClick={onConfirm}
            disabled={!selectedSubject}
          />
        </OakFlex>
      </OakBox>
    </FocusOn>
  );
}

type DesktopPhasePickerProps = {
  phases: Phase[];
  selectedSubject: CurriculumPhaseOption | null;
  selectedPhase: Phase | null;
  ks4Options: KS4Option[];
  showPhaseError: boolean;
  showKS4OptionError: boolean;
  phaseErrorId: string;
  ks4OptionErrorId: string;
  schoolPhaseInputId: string;
  ks4OptionInputId: string;
  isSelected: (option: Subject | Phase | KS4Option) => boolean;
  onSelectPhase: (phase: Phase) => void;
  onSelectKS4Option: (option: KS4Option) => void;
  onClose: () => void;
  onFocusStart: () => Promise<void>;
  onFocusEnd: () => Promise<void>;
};

function DesktopPhasePicker({
  phases,
  selectedSubject,
  selectedPhase,
  ks4Options,
  showPhaseError,
  showKS4OptionError,
  phaseErrorId,
  ks4OptionErrorId,
  schoolPhaseInputId,
  ks4OptionInputId,
  isSelected,
  onSelectPhase,
  onSelectKS4Option,
  onClose,
  onFocusStart,
  onFocusEnd,
}: Readonly<DesktopPhasePickerProps>) {
  const showKS4Section =
    selectedPhase?.slug === "secondary" && ks4Options.length > 0;

  return (
    <SelectionDropDownBox
      $background="bg-primary"
      $mt="spacing-8"
      $pa="spacing-32"
      $position="absolute"
      $top="spacing-72"
      $zIndex="modal-dialog"
      className="phase-selection"
    >
      <FocusOn
        enabled
        autoFocus={false}
        onClickOutside={onClose}
        onEscapeKey={onClose}
        scrollLock={false}
      >
        <FocusWrap onWrapStart={onFocusStart} onWrapEnd={onFocusEnd}>
          {showPhaseError && (
            <PickerError
              id={phaseErrorId}
              message="Select a school phase to view the curriculum"
            />
          )}
          {showKS4OptionError && (
            <OakFlex
              id={ks4OptionErrorId}
              role="alert"
              aria-live="polite"
              $flexDirection="row"
              $mb="spacing-24"
            >
              <OakIcon
                iconName="content-guidance"
                $colorFilter="icon-error"
                $height="spacing-24"
              />
              <OakP $color="text-error">
                Select a KS4 option to view the curriculum
              </OakP>
            </OakFlex>
          )}
          <OakHeading
            id={schoolPhaseInputId}
            tag="h4"
            $font="heading-6"
            $mb="spacing-16"
            data-testid="phase-picker-heading"
          >
            Choose a school phase
          </OakHeading>
          <CurriculumModalCloseButton
            ariaLabel="Close phase picker"
            onClose={onClose}
            $position="absolute"
            $top="spacing-12"
            $right="spacing-12"
          />
          <PhaseList
            phases={phases}
            selectedSubject={selectedSubject}
            schoolPhaseInputId={schoolPhaseInputId}
            showPhaseError={showPhaseError}
            phaseErrorId={phaseErrorId}
            isSelected={isSelected}
            onSelectPhase={onSelectPhase}
          />
          {showKS4Section && selectedSubject && (
            <KS4OptionsSection
              ks4Options={ks4Options}
              selectedSubject={selectedSubject}
              showError={showKS4OptionError}
              errorId={ks4OptionErrorId}
              inputId={ks4OptionInputId}
              isSelected={isSelected}
              onSelect={onSelectKS4Option}
            />
          )}
        </FocusWrap>
      </FocusOn>
    </SelectionDropDownBox>
  );
}

type MobilePhasePickerProps = {
  phases: Phase[];
  selectedSubject: CurriculumPhaseOption | null;
  selectedPhase: Phase | null;
  selectedKS4Option: KS4Option | null;
  ks4Options: KS4Option[];
  showPhaseError: boolean;
  showKS4OptionError: boolean;
  phaseErrorId: string;
  ks4OptionErrorId: string;
  schoolPhaseInputId: string;
  ks4OptionInputId: string;
  isNavigating: boolean;
  isSelected: (option: Subject | Phase | KS4Option) => boolean;
  onSelectPhase: (phase: Phase) => void;
  onSelectKS4Option: (option: KS4Option) => void;
  onClose: () => void;
  onBack: () => void;
  onViewCurriculum: () => void;
};

function MobilePhasePicker({
  phases,
  selectedSubject,
  selectedPhase,
  selectedKS4Option,
  ks4Options,
  showPhaseError,
  showKS4OptionError,
  phaseErrorId,
  ks4OptionErrorId,
  schoolPhaseInputId,
  ks4OptionInputId,
  isNavigating,
  isSelected,
  onSelectPhase,
  onSelectKS4Option,
  onClose,
  onBack,
  onViewCurriculum,
}: Readonly<MobilePhasePickerProps>) {
  const showKS4Section =
    selectedPhase?.slug === "secondary" && ks4Options.length > 0;

  const getAriaDescribedBy = () => {
    if (showPhaseError) return "phase-error-message";
    if (showKS4OptionError) return "ks4-error-message";
    return undefined;
  };

  return (
    <FocusOn
      enabled
      autoFocus={false}
      onEscapeKey={onClose}
      scrollLock
      returnFocus
    >
      <OakBox
        data-testid="mobile-phase-picker"
        role="dialog"
        aria-modal="true"
        aria-label="Phase picker"
        aria-describedby={getAriaDescribedBy()}
        $position="fixed"
        $bottom="spacing-0"
        $left="spacing-0"
        $right="spacing-0"
        $background="bg-primary"
        $height="100%"
        $overflowY="auto"
        $zIndex="modal-dialog"
        $pa="spacing-24"
      >
        <OakFlex $flexDirection="column" $gap="spacing-24">
          <OakFlex $alignItems="center" $justifyContent="space-between">
            <OakTertiaryButton
              data-testid="mobile-phase-picker-back-to-subject-button"
              iconName="chevron-left"
              onClick={onBack}
            >
              Back
            </OakTertiaryButton>
            <CurriculumModalCloseButton
              ariaLabel="Close phase picker modal"
              onClose={onClose}
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
              <PickerError
                id={phaseErrorId}
                message="Select a school phase to view the curriculum"
              />
            )}

            {showKS4OptionError && (
              <PickerError
                id={ks4OptionErrorId}
                message="Select a KS4 option to view the curriculum"
              />
            )}

            <PhaseList
              phases={phases}
              selectedSubject={selectedSubject}
              schoolPhaseInputId={schoolPhaseInputId}
              showPhaseError={showPhaseError}
              phaseErrorId={phaseErrorId}
              isSelected={isSelected}
              onSelectPhase={onSelectPhase}
              isMobile
            />

            {showKS4Section && selectedSubject && (
              <KS4OptionsSection
                ks4Options={ks4Options}
                selectedSubject={selectedSubject}
                showError={showKS4OptionError}
                errorId={ks4OptionErrorId}
                inputId={ks4OptionInputId}
                isSelected={isSelected}
                onSelect={onSelectKS4Option}
                isMobile
              />
            )}
          </PhaseContainerWrapper>

          <MobilePickerFooter
            testId="mobile-phase-picker-confirm-button"
            buttonText="View curriculum"
            ariaLabel="View curriculum"
            onClick={onViewCurriculum}
            disabled={
              !isPhaseSelectionComplete(
                selectedPhase,
                selectedSubject,
                selectedKS4Option,
              )
            }
            isLoading={isNavigating}
          />
        </OakFlex>
      </OakBox>
    </FocusOn>
  );
}

type SubjectButtonContentProps = {
  showSubjectError: boolean;
  selectedSubject: CurriculumPhaseOption | null;
};

function SubjectButtonContent({
  showSubjectError,
  selectedSubject,
}: Readonly<SubjectButtonContentProps>) {
  return (
    <OakBox $pl="spacing-16" $pr="spacing-16" $pt="spacing-12" $pb="spacing-12">
      <OakSpan
        $font="heading-light-7"
        $mb="spacing-4"
        $color={showSubjectError ? "text-error" : "text-primary"}
        data-testid="subject-picker-button-heading"
      >
        Subject
      </OakSpan>
      {showSubjectError && (
        <OakFlex>
          <OakIcon
            iconName="content-guidance"
            $colorFilter="icon-error"
            $height="spacing-24"
          />
          <OakSpan $color="text-error">Select a subject</OakSpan>
        </OakFlex>
      )}
      <OakP
        $font="body-2"
        $color={showSubjectError ? "text-error" : "text-primary"}
      >
        {selectedSubject?.title}
        {!showSubjectError && !selectedSubject && "Select"}
      </OakP>
    </OakBox>
  );
}

type PhaseButtonContentProps = {
  showSubjectError: boolean;
  showPhaseError: boolean;
  showKS4OptionError: boolean;
  selectedPhase: Phase | null;
  selectedKS4Option: KS4Option | null;
};

function PhaseButtonContent({
  showSubjectError,
  showPhaseError,
  showKS4OptionError,
  selectedPhase,
  selectedKS4Option,
}: Readonly<PhaseButtonContentProps>) {
  const renderContent = () => {
    if (showPhaseError) {
      return (
        <OakFlex>
          <OakIcon
            iconName="content-guidance"
            $colorFilter="icon-error"
            $height="spacing-24"
          />
          Select a school phase
        </OakFlex>
      );
    }

    if (showKS4OptionError) {
      return (
        <TruncatedFlex>
          <OakIcon
            iconName="content-guidance"
            $colorFilter="icon-error"
            $height="spacing-24"
          />
          <OakSpan
            $textOverflow="ellipsis"
            $overflow="hidden"
            $whiteSpace="nowrap"
          >
            Select an option for KS4
          </OakSpan>
        </TruncatedFlex>
      );
    }

    if (selectedPhase && !showKS4OptionError) {
      return (
        <OakBox
          $textOverflow="ellipsis"
          $whiteSpace="nowrap"
          $overflowX="hidden"
        >
          <OakSpan>{selectedPhase.title}</OakSpan>
          {selectedKS4Option && <OakSpan>, {selectedKS4Option.title}</OakSpan>}
        </OakBox>
      );
    }

    return "Select";
  };

  return (
    <OakBox $pl="spacing-16" $pt="spacing-12" $pb="spacing-12">
      <OakSpan
        $font="heading-light-7"
        $mb="spacing-4"
        $color={showSubjectError ? "text-error" : "text-primary"}
        data-testid="phase-picker-button-heading"
      >
        School phase
      </OakSpan>
      <OakBox
        $font="body-2"
        $color={
          !showPhaseError && !showKS4OptionError ? "text-primary" : "text-error"
        }
      >
        {renderContent()}
      </OakBox>
    </OakBox>
  );
}

const SubjectPhasePicker = ({
  subjects,
  currentSelection,
  tab,
  id = "choose-curriculum-label",
}: SubjectPhasePickerData & { id?: string }) => {
  const phasePickerButton = useRef<HTMLButtonElement>(null);
  const subjectPickerButton = useRef<HTMLButtonElement>(null);
  const subjectPickerButtonDesktopContainer = useRef<HTMLDivElement>(null);
  const subjectPickerButtonMobileContainer = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const ks4OptionErrorId = useId();
  const phaseErrorId = useId();
  const schoolPhaseInputId = useId();
  const ks4OptionInputId = useId();

  const { track } = useAnalytics();

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

  const isMobile = useMediaQuery("mobile");
  const [isMobileLotPickerModalOpen, setIsMobileLotPickerModalOpen] =
    useState(false);

  const [isPending, startTransition] = useTransition();
  const [isNavigating, setIsNavigating] = useState(false);

  const ks4Options = selectedSubject?.ks4_options ?? [];
  const phases = selectedSubject?.phases ?? DEFAULT_PHASES;

  const nextTick = async () => {
    return new Promise((resolve) => setTimeout(resolve, 0));
  };

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

    if (desktopEl?.checkVisibility()) {
      await nextTick();
      desktopEl.focus();
    } else if (mobileEl?.checkVisibility()) {
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
      (phase.slug === "primary" || !selectedSubject?.ks4_options)
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

  const applyValidationErrors = (errors: ValidationResult["errors"]) => {
    if (errors.subject) {
      setShowSubjectError(true);
      setShowSubjects(true);
      if (isMobile) {
        setShowPhases(false);
      }
    }
    if (errors.phase) {
      setShowPhaseError(true);
      if (selectedSubject) {
        setShowPhases(true);
      }
    }
    if (errors.ks4) {
      setShowKS4OptionError(true);
      setShowPhases(true);
    }
  };

  const navigateToCurriculum = () => {
    let subjectPhaseSlug = selectedSubject?.slug + "-" + selectedPhase?.slug;
    if (selectedKS4Option) {
      subjectPhaseSlug += "-" + selectedKS4Option.slug;
    }
    const newPathname = `/teachers/curriculum/${subjectPhaseSlug}/${tab}`;
    trackViewCurriculum();

    setIsNavigating(true);
    if (!isMobile) {
      setShowPhases(false);
    }

    startTransition(() => {
      router.push({ pathname: newPathname }).finally(() => {
        setIsNavigating(false);
        setShowPhases(false);
      });
    });
  };

  const handleViewCurriculum = () => {
    const { canProceed, errors } = validateSelection(
      selectedSubject,
      selectedPhase,
      selectedKS4Option,
    );

    if (!canProceed) {
      applyValidationErrors(errors);
      return;
    }

    navigateToCurriculum();
  };

  const isSelected = (option: Subject | Phase | KS4Option) => {
    return (
      option.slug === selectedSubject?.slug ||
      option.slug === selectedPhase?.slug ||
      option.slug === selectedKS4Option?.slug
    );
  };

  const handleConfirmSubject = () => {
    setShowPhases(true);
    setIsMobileLotPickerModalOpen(false);
  };

  const handleMobilePhaseBack = () => {
    setShowPhases(false);
    setIsMobileLotPickerModalOpen(true);
  };

  const showDesktopSubjectPicker =
    showSubjects && !isMobile && !isMobileLotPickerModalOpen;
  const showMobileSubjectPicker = isMobileLotPickerModalOpen && isMobile;
  const showDesktopPhasePicker = showPhases && !isMobile;
  const showMobilePhasePicker =
    showPhases && isMobile && (isNavigating || !isPending);

  return (
    <OakBox as="nav" aria-labelledby={id} $width="100%">
      <OakJauntyAngleLabel
        id={id}
        $background="bg-decorative5-main"
        $color="text-primary"
        $font="heading-7"
        label="Choose a curriculum"
        $zIndex={298}
        $position="relative"
        $top="spacing-8"
        $width="fit-content"
        $left="spacing-8"
        $borderRadius="border-radius-square"
      />
      <OakBox
        $position="relative"
        data-testid="lot-picker"
        $zIndex={
          (isMobileLotPickerModalOpen || showPhases) && isMobile
            ? "modal-dialog"
            : "modal-close-button"
        }
        $borderRadius="border-radius-s"
        $borderColor={
          showSubjects || showPhases ? "transparent" : "border-primary"
        }
        $ba="border-solid-m"
      >
        <OakFlex
          $position="relative"
          $borderRadius="border-radius-s"
          $alignItems="center"
          $justifyContent="space-between"
          $gap="spacing-0"
          $flexDirection={["column", "row"]}
          $width="100%"
          $background={
            showSubjects || showPhases ? "bg-neutral-stronger" : "bg-primary"
          }
        >
          <OakFlex
            $flexDirection="row"
            $alignItems="center"
            $justifyContent="flex-start"
            $width="100%"
          >
            <OakFlex
              $position="relative"
              $alignSelf="stretch"
              $background={showSubjects ? "bg-primary" : null}
              style={{ width: "50%" }}
            >
              <OakFocusIndicatorAlt
                dropShadow="drop-shadow-centered-grey"
                assertFocus={showSubjects}
                activeDropShadow="drop-shadow-none"
                $width="100%"
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
                  <SubjectButtonContent
                    showSubjectError={showSubjectError}
                    selectedSubject={selectedSubject}
                  />
                </PickerButton>
              </OakFocusIndicatorAlt>
            </OakFlex>

            {showDesktopSubjectPicker && (
              <DesktopSubjectPicker
                subjects={subjects}
                showSubjectError={showSubjectError}
                isSelected={isSelected}
                onSelectSubject={handleSelectSubject}
                onClose={() => setShowSubjects(false)}
                onFocusStart={onFocusSubjectStart}
                onFocusEnd={onFocusSubjectEnd}
              />
            )}

            {showMobileSubjectPicker && (
              <MobileSubjectPicker
                subjects={subjects}
                showSubjectError={showSubjectError}
                selectedSubject={selectedSubject}
                isSelected={isSelected}
                onSelectSubject={handleSelectSubject}
                onClose={handleMobileLotPickerModal}
                onConfirm={handleConfirmSubject}
              />
            )}

            <OakBox
              $height="spacing-48"
              $width="spacing-2"
              $position="relative"
              $display="block"
              $visibility={showSubjects || showPhases ? "hidden" : null}
            >
              <BoxBorders
                $color="bg-neutral-stronger"
                hideBottom
                hideTop
                hideRight
              />
            </OakBox>

            <OakBox $position="relative" style={{ width: "50%" }}>
              <OakFlex
                $position="relative"
                $flexDirection="row"
                $gap="spacing-16"
                $background={showPhases ? "bg-primary" : null}
              >
                <OakFocusIndicatorAlt
                  dropShadow="drop-shadow-centered-grey"
                  assertFocus={showPhases}
                  activeDropShadow="drop-shadow-none"
                  $width="100%"
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
                    <PhaseButtonContent
                      showSubjectError={showSubjectError}
                      showPhaseError={showPhaseError}
                      showKS4OptionError={showKS4OptionError}
                      selectedPhase={selectedPhase}
                      selectedKS4Option={selectedKS4Option}
                    />
                  </PickerButton>
                </OakFocusIndicatorAlt>

                {showDesktopPhasePicker && (
                  <DesktopPhasePicker
                    phases={phases}
                    selectedSubject={selectedSubject}
                    selectedPhase={selectedPhase}
                    ks4Options={ks4Options}
                    showPhaseError={showPhaseError}
                    showKS4OptionError={showKS4OptionError}
                    phaseErrorId={phaseErrorId}
                    ks4OptionErrorId={ks4OptionErrorId}
                    schoolPhaseInputId={schoolPhaseInputId}
                    ks4OptionInputId={ks4OptionInputId}
                    isSelected={isSelected}
                    onSelectPhase={handleSelectPhase}
                    onSelectKS4Option={handleSelectKS4Option}
                    onClose={() => setShowPhases(false)}
                    onFocusStart={onFocusPhasesStart}
                    onFocusEnd={onFocusPhasesEnd}
                  />
                )}

                {showMobilePhasePicker && (
                  <MobilePhasePicker
                    phases={phases}
                    selectedSubject={selectedSubject}
                    selectedPhase={selectedPhase}
                    selectedKS4Option={selectedKS4Option}
                    ks4Options={ks4Options}
                    showPhaseError={showPhaseError}
                    showKS4OptionError={showKS4OptionError}
                    phaseErrorId={phaseErrorId}
                    ks4OptionErrorId={ks4OptionErrorId}
                    schoolPhaseInputId={schoolPhaseInputId}
                    ks4OptionInputId={ks4OptionInputId}
                    isNavigating={isNavigating}
                    isSelected={isSelected}
                    onSelectPhase={handleSelectPhase}
                    onSelectKS4Option={handleSelectKS4Option}
                    onClose={() => setShowPhases(false)}
                    onBack={handleMobilePhaseBack}
                    onViewCurriculum={handleViewCurriculum}
                  />
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
                    isTrailingIcon
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
