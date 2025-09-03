import {
  OakFlex,
  OakHeading,
  OakModalCenter,
  OakModalCenterBody,
  OakPrimaryButton,
} from "@oaknational/oak-components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const TeacherRedirectedOverlay = () => {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const { redirected } = router.query;
  useEffect(() => {
    if (redirected) setShow(true);
  }, [redirected, setShow]);
  return (
    <OakModalCenter
      isOpen={!!redirected && show}
      onClose={() => setShow(false)}
      footerSlot={
        <OakFlex
          $mt={"space-between-xl"}
          $pb={"inner-padding-xl5"}
          $justifyContent={"center"}
          $alignItems={"center"}
        >
          <OakPrimaryButton
            onClick={() => setShow(false)}
            data-testid={"teacher-redirected-overlay-btn"}
          >
            Continue
          </OakPrimaryButton>
        </OakFlex>
      }
    >
      <OakModalCenterBody
        iconName={"info"}
        title={
          "The resource you were looking for was created for use during the pandemic, and has been removed."
        }
        hideIcon
      >
        <OakHeading tag={"h2"} $font={"heading-light-7"} $textAlign={"center"}>
          Use our new teaching resources designed by teachers and leading
          subject experts, and tested in classrooms.
        </OakHeading>
      </OakModalCenterBody>
    </OakModalCenter>
  );
};
