import {
  OakFlex,
  OakHeading,
  OakModalCenter,
  OakModalCenterBody,
  OakPrimaryButton,
} from "@oaknational/oak-components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const PupilRedirectedOverlay = () => {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const { redirected } = router.query;
  useEffect(() => {
    if (redirected) setShow(true);
  }, [redirected, setShow]);
  return (
    <OakModalCenter
      isOpen={!!redirected && show}
      footerSlot={
        <OakFlex
          $mt={"space-between-xl"}
          $pb={"inner-padding-xl5"}
          $justifyContent={"center"}
          $alignItems={"center"}
        >
          <OakPrimaryButton
            onClick={() => setShow(false)}
            data-testid={"pupil-redirected-overlay-btn"}
          >
            Continue
          </OakPrimaryButton>
        </OakFlex>
      }
    >
      <OakModalCenterBody
        iconName={"info"}
        title={"Sorry, this resource isn't here anymore."}
        hideIcon
      >
        <OakHeading tag={"h2"} $font={"heading-light-7"} $textAlign={"center"}>
          No worries - just check with your teacher to find out what to do next.
        </OakHeading>
      </OakModalCenterBody>
    </OakModalCenter>
  );
};
