import {
  OakModalCenter,
  OakModalCenterProps,
  OakTagFunctional,
  OakFlex,
  OakHeading,
  OakP,
} from "@oaknational/oak-components";

import LoginRequiredButton from "../LoginRequiredButton/LoginRequiredButton";

const SavingSignedOutModalContent = () => {
  return (
    <OakFlex $flexDirection="column">
      <OakFlex
        $alignItems="start"
        $gap="space-between-xs"
        $mb="space-between-m"
      >
        <OakTagFunctional
          label="New"
          $background="mint"
          $color="text-primary"
          $ph="inner-padding-ssx"
        />
        <OakHeading tag="h2" $font="heading-5" id="saving-modal-heading">
          Saving is here
        </OakHeading>
      </OakFlex>
      <OakP
        $mb="space-between-l"
        $font={"body-1"}
        id="saving-modal-description"
      >
        Easily save lesson units that you want to revisit. Access what you need,
        whenever you need it – anytime, anywhere. Getting started is simple;
        quickly sign up and start saving.
      </OakP>
      <LoginRequiredButton
        onboardingProps={{ name: "Finish sign up" }}
        width="100%"
      />
    </OakFlex>
  );
};

type SavingSignedOutModalProps = Pick<
  OakModalCenterProps,
  "isOpen" | "onClose"
> & {
  returnToElementId?: string;
};

const SavingSignedOutModal = ({
  isOpen,
  onClose,
  returnToElementId: elementId,
}: SavingSignedOutModalProps) => (
  <OakModalCenter
    isOpen={isOpen}
    onClose={onClose}
    children={<SavingSignedOutModalContent />}
    modalFlexProps={{
      $pa: ["inner-padding-xl2", "inner-padding-xl5"],
      $mh: "auto",
      "aria-modal": true,
      "aria-labelledby": "saving-modal-heading",
      "aria-describedby": "saving-modal-description",
    }}
    modalInnerFlexProps={{ $ph: "inner-padding-none" }}
    modalOuterFlexProps={{
      $maxWidth: "all-spacing-22",
      $pa: "inner-padding-m",
    }}
    returnFocus={() => {
      if (elementId) {
        document.getElementById(elementId)?.focus();
        // prevent default returnTo behaviour as we're managing focus manually
        return false;
      }
      return true;
    }}
  />
);

export default SavingSignedOutModal;
