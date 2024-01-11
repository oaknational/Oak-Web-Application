import {
  useState,
  useCallback,
  createRef,
  useEffect,
  MutableRefObject,
} from "react";

import { BioData, BioCardListModalProps } from "./BioCardListModal";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

const reportError = errorReporter("useBioModal");

type UseBioCardListModalProps = {
  bios: BioData[];
};
export type ModalControllerRefs = Record<
  string,
  MutableRefObject<HTMLButtonElement | null>
>;
export const useBioCardListModal = (
  props: UseBioCardListModalProps,
): BioCardListModalProps => {
  const { bios } = props;
  const [bio, setBio] = useState<BioData>();
  const [initialBio, setInitialBio] = useState<BioData>();
  const [isOpen, setIsOpen] = useState(false);
  const [modalControllerRefs, setModalControllerRefs] =
    useState<ModalControllerRefs>({});

  useEffect(() => {
    setModalControllerRefs((modalControllerRefs) => {
      return bios.reduce((acc: ModalControllerRefs, cur) => {
        acc[cur.id] = modalControllerRefs[cur.id] || createRef();
        return acc;
      }, {});
    });

    /**
     * Ignoring exhaustive deps as we can't guarantee bios will have the same
     * ref, and bios should not change dynamically, and we only need to set
     * controller refs once.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const returnFocusRef = initialBio
    ? modalControllerRefs[initialBio.id]
    : undefined;

  const openModal = useCallback((initialBio: BioData) => {
    setIsOpen(true);
    setBio(initialBio);
    setInitialBio(initialBio);
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
    returnFocusRef,
    modalControllerRefs,
  };
};
