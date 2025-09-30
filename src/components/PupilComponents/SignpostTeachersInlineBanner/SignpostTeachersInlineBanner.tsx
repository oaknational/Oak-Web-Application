import {
  OakBox,
  OakInlineBanner,
  OakSecondaryLink,
} from "@oaknational/oak-components";
import { useRef, useState } from "react";
import { Transition, TransitionStatus } from "react-transition-group";
import styled from "styled-components";

import useReferrer, { referrerSources } from "@/hooks/useReferrer";

type SignpostTeachersInlineBannerProps = {
  onCallBack?: () => void;
};

const durationInSeconds = 0.5;

const ExpandInBox = styled(OakBox)<{ $state: TransitionStatus }>`
  transition: all ${durationInSeconds}s ease;
  max-height: ${({ $state }) => {
    switch ($state) {
      case "entered":
      case "entering":
        return "500px"; // Even on mobiles this is a reasonable height for the banner.
      default:
        return "0";
    }
  }};
  opacity: ${({ $state }) => {
    switch ($state) {
      case "entered":
      case "entering":
        return 1;
      default:
        return 0;
    }
  }};
`;

export default function SignpostTeachersInlineBanner({
  onCallBack,
}: SignpostTeachersInlineBannerProps) {
  const [userIsOpen, setUserIsOpen] = useState(true);
  const transitionRef = useRef<HTMLDivElement>(null);
  const source = useReferrer();
  const showInlineBanner = source && source !== referrerSources.internal;

  const handleClose = () => {
    setUserIsOpen(false);
    onCallBack?.();
  };

  return (
    <Transition
      in={(showInlineBanner && userIsOpen) || false}
      nodeRef={transitionRef}
      addEndListener={(done) => {
        transitionRef.current?.addEventListener("transitionend", done);
      }}
      timeout={durationInSeconds * 1000}
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <ExpandInBox ref={transitionRef} $state={state} $overflow={"hidden"}>
          <OakInlineBanner
            canDismiss
            type="neutral"
            title="Teachers"
            message="Download adaptable teaching resources"
            isOpen
            $width="100%"
            onDismiss={handleClose}
            cta={
              <OakSecondaryLink
                href="/"
                iconName="chevron-right"
                isTrailingIcon
              >
                View resources
              </OakSecondaryLink>
            }
          />
        </ExpandInBox>
      )}
    </Transition>
  );
}
