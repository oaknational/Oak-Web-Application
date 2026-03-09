"use client";

import React from "react";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import {
  OakBox,
  OakInformativeModal,
  OakPrimaryButton,
} from "@oaknational/oak-components";

/**
 * Wraps the @modal slot in OakInformativeModal. Lives in the programmes layout
 * (not the slot layout) so it's always mounted when on programmes routes,
 * avoiding the Next.js behavior where slot layouts don't render until the slot is active.
 */
export function ModalSlotWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  // To ensure that modal animation works we need to have it mounted at all times.
  // We use the segment to determine if the modal should be open or not.
  const segment = useSelectedLayoutSegment("modal");

  const handleClose = () => {
    router.back();
  };

  return (
    <OakInformativeModal
      isOpen={Boolean(segment)}
      onClose={handleClose}
      largeScreenMaxWidth={600}
      footerSlot={
        <OakBox
          $pa={"spacing-12"}
          $bt={"border-solid-s"}
          $borderColor={"border-neutral-lighter"}
        >
          <OakPrimaryButton onClick={handleClose}>Close</OakPrimaryButton>
        </OakBox>
      }
    >
      {children}
    </OakInformativeModal>
  );
}
