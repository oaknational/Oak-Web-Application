import {
  OakModalCenter,
  OakModalCenterProps,
  OakTagFunctional,
  OakFlex,
  OakHeading,
  OakP,
} from "@oaknational/oak-components";

import LoginRequiredButton from "../LoginRequiredButton/LoginRequiredButton";

import { ComponentTypeValueType } from "@/browser-lib/avo/Avo";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

const SavingSignedOutModalContent = ({
  componentType,
}: {
  componentType: ComponentTypeValueType;
}) => {
  const { signInStarted } = useTeacherBrowseAnalytics((store) => store.track);

  return (
    <OakFlex $flexDirection="column">
      <OakFlex $alignItems="start" $gap="spacing-12" $mb="spacing-24">
        <OakTagFunctional
          label="New"
          $background="bg-decorative1-main"
          $color="text-primary"
          $ph="spacing-4"
        />
        <OakHeading tag="h2" $font="heading-5" id="saving-modal-heading">
          Saving is here
        </OakHeading>
      </OakFlex>
      <OakP $mb="spacing-48" $font={"body-1"} id="saving-modal-description">
        Easily save lesson units that you want to revisit. Access what you need,
        whenever you need it – anytime, anywhere. Getting started is simple;
        quickly sign up and start saving.
      </OakP>
      <LoginRequiredButton
        loginRequired={true}
        geoRestricted={false}
        onboardingProps={{ name: "Finish sign up" }}
        signUpProps={{ onClick: () => signInStarted({ componentType }) }}
        width="100%"
      />
    </OakFlex>
  );
};

type SavingSignedOutModalProps = Pick<
  OakModalCenterProps,
  "isOpen" | "onClose"
> & {
  componentType: ComponentTypeValueType;
  returnToElementId?: string;
};

const SavingSignedOutModal = ({
  isOpen,
  onClose,
  componentType,
  returnToElementId: elementId,
}: SavingSignedOutModalProps) => (
  <OakModalCenter
    isOpen={isOpen}
    onClose={onClose}
    modalFlexProps={{
      $pa: ["spacing-32", "spacing-56"],
      $mh: "auto",
      "aria-modal": true,
      "aria-labelledby": "saving-modal-heading",
      "aria-describedby": "saving-modal-description",
    }}
    modalInnerFlexProps={{ $ph: "spacing-0" }}
    modalOuterFlexProps={{
      $maxWidth: "spacing-640",
      $pa: "spacing-16",
    }}
    returnFocus={() => {
      if (elementId) {
        document.getElementById(elementId)?.focus();
        // prevent default returnTo behaviour as we're managing focus manually
        return false;
      }
      return true;
    }}
  >
    <SavingSignedOutModalContent componentType={componentType} />
  </OakModalCenter>
);

export default SavingSignedOutModal;
