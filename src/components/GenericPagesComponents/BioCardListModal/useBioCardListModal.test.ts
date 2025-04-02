import { renderHook, act } from "@testing-library/react";

import { useBioCardListModal } from "./useBioCardListModal";

import { portableTextFromString } from "@/__tests__/__helpers__/cms";

const bios = ["Ramender Crompton", "Matt Hood"].map((name, i) => ({
  name,
  bioPortableText: portableTextFromString(
    "Ramender is an assistant principal and head of English at Dixons City Academy. She previously worked for the NHS Trust in Bradford before embarking on her PGCSE and taking up a role as English teacher. In addition to her teaching commitments, Ramender is also an assistant lead examiner for AQA, CPD author and virtual community trainer. She was also one of the original 40 teachers who created resources for Oak. Throughout her career, Ramender has remained committed to challenging disadvantage in the North.",
  ),
  image: {
    asset: {
      _id: "image-ae507d3e43c24385f78f46cf63054e7659d729eb-1728x1728-png",
      url: "https://cdn.sanity.io/images/cuvjke51/production/ae507d3e43c24385f78f46cf63054e7659d729eb-1728x1728.png",
    },
    hotspot: null,
  },
  id: String(i),
  role: "Board member",
  socials: null,
}));

describe("useBioModal", () => {
  test("isOpen defaults to false", () => {
    const { result } = renderHook(() => useBioCardListModal({ bios }));

    expect(result.current.isOpen).toBe(false);
  });
  test("openModal() sets the bio and sets isOpen true", () => {
    const { result } = renderHook(() => useBioCardListModal({ bios }));
    const { openModal } = result.current;
    const initialBio = bios[0];
    if (!initialBio) throw new Error("initialBio must exist");
    act(() => {
      openModal(initialBio);
    });
    const { bio, isOpen } = result.current;
    expect(bio).toBe(initialBio);
    expect(isOpen).toBe(true);
  });
  test("nextBio() undefined if last bio", () => {
    const { result } = renderHook(() => useBioCardListModal({ bios }));
    const initialBio = bios[1];
    if (!initialBio) throw new Error("initialBio must exist");
    const { openModal } = result.current;
    act(() => {
      openModal(initialBio);
    });
    const { nextBio } = result.current;
    expect(nextBio).toBe(undefined);
  });
  test("nextBio() sets the bio to the next bio", () => {
    const { result } = renderHook(() => useBioCardListModal({ bios }));
    const initialBio = bios[0];
    if (!initialBio) throw new Error("initialBio must exist");
    const { openModal } = result.current;
    act(() => {
      openModal(initialBio);
    });
    const { nextBio } = result.current;
    expect(nextBio).toBeTruthy();
    if (!nextBio) throw new Error("nextBio() should exist");

    act(() => {
      nextBio();
    });

    const { bio } = result.current;

    expect(bio).toBe(bios[1]);
  });
  test("prevBio() undefined if first bio", () => {
    const { result } = renderHook(() => useBioCardListModal({ bios }));
    const initialBio = bios[0];
    if (!initialBio) throw new Error("initialBio must exist");
    const { openModal } = result.current;
    act(() => {
      openModal(initialBio);
    });
    const { prevBio } = result.current;
    expect(prevBio).toBe(undefined);
  });
  test("prevBio() sets the bio to the previous bio", () => {
    const { result } = renderHook(() => useBioCardListModal({ bios }));
    const initialBio = bios[1];
    if (!initialBio) throw new Error("initialBio must exist");
    const { openModal } = result.current;
    act(() => {
      openModal(initialBio);
    });
    const { prevBio } = result.current;
    expect(prevBio).toBeTruthy();
    if (!prevBio) throw new Error("prevBio() should exist");

    act(() => {
      prevBio();
    });

    const { bio } = result.current;

    expect(bio).toBe(bios[0]);
  });
  test("closeModal() sets isOpen to false", () => {
    const { result } = renderHook(() => useBioCardListModal({ bios }));
    const initialBio = bios[1];
    if (!initialBio) throw new Error("initialBio must exist");
    const { openModal } = result.current;
    act(() => {
      openModal(initialBio);
    });
    const { closeModal } = result.current;
    expect(closeModal).toBeTruthy();
    if (!closeModal) throw new Error("closeModal() should exist");

    act(() => {
      closeModal();
    });

    const { isOpen } = result.current;

    expect(isOpen).toBe(false);
  });
});
