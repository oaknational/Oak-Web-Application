import { SignUpButton, useUser } from "@clerk/nextjs";
import {
  OakModalCenter,
  OakModalCenterProps,
  OakTagFunctional,
  OakFlex,
  OakHeading,
  OakP,
  OakPrimaryButton,
} from "@oaknational/oak-components";
import { useRouter } from "next/router";

import { resolveOakHref } from "@/common-lib/urls";

const SavingSignedOutModalContent = () => {
  const router = useRouter();
  const { user } = useUser();

  const showOnboardingButton = user && !user.publicMetadata?.owa?.isOnboarded;

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
      {showOnboardingButton ? (
        <OakPrimaryButton
          width="100%"
          onClick={() =>
            router.push({
              pathname: resolveOakHref({ page: "onboarding" }),
              query: { returnTo: router.asPath },
            })
          }
        >
          Finish sign up
        </OakPrimaryButton>
      ) : (
        <SignUpButton
          forceRedirectUrl={`/onboarding?returnTo=${router.asPath}`}
        >
          <OakPrimaryButton width="100%">Sign up</OakPrimaryButton>
        </SignUpButton>
      )}
    </OakFlex>
  );
};

type SavingSignedOutModalProps = Pick<
  OakModalCenterProps,
  "isOpen" | "onClose"
>;

const SavingSignedOutModal = ({
  isOpen,
  onClose,
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
  />
);

export default SavingSignedOutModal;
