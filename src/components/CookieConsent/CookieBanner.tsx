import { useButton } from "@react-aria/button";
import Link from "next/link";
import { FC, useRef } from "react";

import { useCookieConsents } from "../../context/CookieConsents/CookieConsents";

import CookieModal from "./CookieModal";

const CookieBanner: FC = () => {
  const { shouldShowBanner, saveConsents, setModalOpen, userHasResponded } =
    useCookieConsents();

  const acceptDefaults = () => saveConsents();

  const openButtonRef = useRef(null);

  // useButton ensures that focus management is handled correctly,
  // across all browsers. Focus is restored to the button once the
  // dialog closes.
  const { buttonProps: openButtonProps } = useButton(
    {
      onPress: () => setModalOpen(true),
    },
    openButtonRef
  );

  if (!shouldShowBanner) {
    return null;
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          left: 0,
          background: "white",
          padding: "1rem",
        }}
      >
        <h2>
          {userHasResponded
            ? "We've updated our cookie policy"
            : "Can we store cookies?"}
        </h2>
        <p>
          {userHasResponded
            ? "We've had to make some changes to our cookie policy."
            : "Oak National Academy uses cookies."}{" "}
          For more information, view our{" "}
          <Link href="https://privacy.thenational.academy/">
            <a target="_blank">privacy centre</a>
          </Link>
          .{" "}
          {userHasResponded &&
            "Features you’ve previously opted out of will remain disabled."}
        </p>
        <button
          onClick={() => setModalOpen(true)}
          {...openButtonProps}
          ref={openButtonRef}
        >
          Review preferences
        </button>
        <button onClick={acceptDefaults}>
          Accept {userHasResponded ? "changes" : "defaults"}
        </button>
      </div>
      <CookieModal />
    </>
  );
};

export default CookieBanner;
