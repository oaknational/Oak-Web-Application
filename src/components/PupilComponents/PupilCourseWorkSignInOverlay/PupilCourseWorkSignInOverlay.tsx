import { useEffect, useRef } from "react";
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

  // Pre-fetch the sign-in URL
  const signInUrlRef = useRef<string | null>(null);
  useEffect(() => {
    googleClassroomApi
      .getGoogleSignInUrl(null, false, true)
      .then((url) => {
        signInUrlRef.current = url;
      })
      .catch(() => {
        // Leave ref null; GoogleSignInView handles a null URL gracefully.
      });
  }, []);

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
          getGoogleSignInLink={() => Promise.resolve(signInUrlRef.current)}
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
