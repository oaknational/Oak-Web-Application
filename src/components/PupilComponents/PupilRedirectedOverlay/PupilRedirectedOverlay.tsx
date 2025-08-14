import {
  OakFlex,
  OakHeading,
  OakModalCenter,
  OakModalCenterBody,
  OakPrimaryButton,
} from "@oaknational/oak-components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type PupilRedirectedOverlayProps = {
  onLoaded?: (isShowing: boolean) => void;
  onClose?: () => void;
  isLessonPage?: boolean;
};
export const PupilRedirectedOverlay = ({
  onLoaded,
  onClose,
  isLessonPage,
}: PupilRedirectedOverlayProps) => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();
  const { redirected } = router.query;
  const close = () => {
    setShow(false);
    setDismissed(true);
    if (onClose) onClose();
  };
  useEffect(() => {
    if (router.isReady && !dismissed) {
      if (redirected) setShow(true);
      if (onLoaded) onLoaded(!!redirected);
    }
  }, [redirected, setShow, router.isReady, onLoaded, dismissed]);
  return (
    <OakModalCenter
      isOpen={!!redirected && show}
      onClose={close}
      footerSlot={
        <OakFlex
          $mt={"space-between-xl"}
          $pb={"inner-padding-xl5"}
          $justifyContent={"center"}
          $alignItems={"center"}
        >
          <OakPrimaryButton
            onClick={close}
            data-testid={"pupil-redirected-overlay-btn"}
          >
            Continue
          </OakPrimaryButton>
        </OakFlex>
      }
    >
      <OakModalCenterBody
        iconName={"info"}
        title={
          isLessonPage
            ? "Sorry, the lesson you were looking for isn't here anymore."
            : "Sorry, this resource isn't here anymore."
        }
        hideIcon
      >
        <OakHeading tag={"h2"} $font={"heading-light-7"} $textAlign={"center"}>
          {isLessonPage
            ? "We have taken you to a new lesson on a similar topic."
            : "No worries - just check with your teacher to find out what to do next."}
        </OakHeading>
      </OakModalCenterBody>
    </OakModalCenter>
  );
};
