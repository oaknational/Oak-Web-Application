import { OakBox, OakFlex } from "@oaknational/oak-components";
import {
  AuthCookieKeys,
  GoogleSignInView,
} from "@oaknational/google-classroom-addon/ui";
import { usePreventScroll } from "react-aria";

import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";

type PupilCourseWorkSignInOverlayProps = {
  onSuccessfulSignIn: () => void | Promise<void>;
};

export const PupilCourseWorkSignInOverlay = ({
  onSuccessfulSignIn,
}: PupilCourseWorkSignInOverlayProps) => {
  usePreventScroll();

  return (
    <OakFlex
      $position="fixed"
      $inset="spacing-0"
      $zIndex="modal-dialog"
      $background="bg-neutral"
      $justifyContent="center"
    >
      <OakBox $maxWidth="spacing-480" $width="100%" $pa="spacing-8">
        <GoogleSignInView
          getGoogleSignInLink={() =>
            googleClassroomApi.getGoogleSignInUrl(null, false, true)
          }
          onSuccessfulSignIn={onSuccessfulSignIn}
          privacyPolicyUrl="/legal/privacy-policy"
          showMailingListOption={false}
          cookieKeys={[
            AuthCookieKeys.PupilAccessToken,
            AuthCookieKeys.PupilSession,
          ]}
        />
      </OakBox>
    </OakFlex>
  );
};
