import { useState, useCallback } from "react";

import errorReporter from "../../common-lib/error-reporter";
import OakError from "../../errors/OakError";

import { BioData, BioModalProps } from "./BioModal";

const reportError = errorReporter("useBioModal");

type UseBioModalProps = {
  bios: BioData[];
};
export const useBioModal = (props: UseBioModalProps): BioModalProps => {
  const { bios } = props;
  const [bio, setBio] = useState<BioData>();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback((initialBio: BioData) => {
    setIsOpen(true);
    setBio(initialBio);
  }, []);
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const currentIndex = bios.findIndex((_bio) => _bio.id === bio?.id);

  const canGoNext = currentIndex < bios.length - 1;
  const canGoPrev = currentIndex > 0;

  const nextBio = canGoNext
    ? () => {
        const nextIndex = (currentIndex + 1) % bios.length;
        const _bio = bios[nextIndex];
        if (!_bio) {
          const error = new OakError({
            code: "misc/unexpected-type",
            meta: {
              ...props,
              impact:
                "User clicked 'next bio' button, but there was no next bio",
            },
          });
          return reportError(error, props);
        }
        setBio(_bio);
      }
    : undefined;

  const prevBio = canGoPrev
    ? () => {
        const prevIndex = (currentIndex - 1) % bios.length;
        const _bio = bios[prevIndex];
        if (!_bio) {
          const error = new OakError({
            code: "misc/unexpected-type",
            meta: {
              ...props,
              impact:
                "User clicked 'next bio' button, but there was no next bio",
            },
          });
          return reportError(error);
        }
        setBio(_bio);
      }
    : undefined;

  return {
    isOpen,
    openModal,
    closeModal,
    nextBio,
    prevBio,
    bio,
  };
};
