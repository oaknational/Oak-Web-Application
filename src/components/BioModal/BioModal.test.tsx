import { OverlayProvider } from "react-aria";
import userEvent from "@testing-library/user-event";

import { portableTextFromString } from "../../__tests__/__helpers__/cms";
import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import BioModal from "./BioModal";

const bio = {
  name: "Ramender Crompton",
  bioPortableText: portableTextFromString(
    "Ramender is an assistant principal and head of English at Dixons City Academy. She previously worked for the NHS Trust in Bradford before embarking on her PGCSE and taking up a role as English teacher. In addition to her teaching commitments, Ramender is also an assistant lead examiner for AQA, CPD author and virtual community trainer. She was also one of the original 40 teachers who created resources for Oak. Throughout her career, Ramender has remained committed to challenging disadvantage in the North."
  ),
  image: {
    asset: {
      _id: "image-ae507d3e43c24385f78f46cf63054e7659d729eb-1728x1728-png",
      url: "https://cdn.sanity.io/images/cuvjke51/production/ae507d3e43c24385f78f46cf63054e7659d729eb-1728x1728.png",
    },
    hotspot: null,
  },
  id: "7ca0431a-2c45-4e3e-9694-9b13cd3fb205",
  role: "Board member",
  socials: null,
};

const defaultProps = {
  bio,
  isOpen: true,
  closeModal: jest.fn(),
  openModal: jest.fn(),
  nextBio: jest.fn(),
  prevBio: jest.fn(),
  modalControllerRefs: {},
};

describe("BioModal", () => {
  const user = userEvent.setup();
  test("doesn't render if isOpen false", () => {
    const { container } = renderWithTheme(
      <OverlayProvider>
        <BioModal {...defaultProps} isOpen={false} />
      </OverlayProvider>
    );

    expect(container).toHaveTextContent("");
  });
  test("doesn't render if bio is undefined", () => {
    const { container } = renderWithTheme(
      <OverlayProvider>
        <BioModal {...defaultProps} bio={undefined} />
      </OverlayProvider>
    );

    expect(container).toHaveTextContent("");
  });
  test("dialog has correct title", () => {
    const { getByRole } = renderWithTheme(
      <OverlayProvider>
        <BioModal {...defaultProps} />
      </OverlayProvider>
    );
    const dialog = getByRole("dialog");

    expect(dialog).toHaveAccessibleName(bio.name);
  });
  test("tabbing works as expected (focus is trapped within modal)", async () => {
    const { getByRole } = renderWithTheme(
      <OverlayProvider>
        <BioModal {...defaultProps} />
      </OverlayProvider>
    );

    const closeButton = getByRole("button", { name: "close modal" });
    const prevButton = getByRole("button", { name: "previous board member" });
    const nextButton = getByRole("button", { name: "next board member" });

    await user.tab();
    expect(closeButton).toHaveFocus();
    await user.tab();
    expect(prevButton).toHaveFocus();
    await user.tab();
    expect(nextButton).toHaveFocus();
    await user.tab();
    expect(closeButton).toHaveFocus();
  });

  test("pressing 'next' button calls 'nextBio'", async () => {
    const nextBio = jest.fn();
    const { getByRole } = renderWithTheme(
      <OverlayProvider>
        <BioModal {...defaultProps} nextBio={nextBio} />
      </OverlayProvider>
    );
    const nextButton = getByRole("button", { name: "next board member" });

    await user.click(nextButton);
    expect(nextBio).toHaveBeenCalled();
  });
  test("pressing 'prev' button calls 'prevBio'", async () => {
    const prevBio = jest.fn();
    const { getByRole } = renderWithTheme(
      <OverlayProvider>
        <BioModal {...defaultProps} prevBio={prevBio} />
      </OverlayProvider>
    );
    const prevButton = getByRole("button", { name: "previous board member" });

    await user.click(prevButton);
    expect(prevBio).toHaveBeenCalled();
  });
  test("pressing 'close' button calls 'closeModal'", async () => {
    const closeModal = jest.fn();
    const { getByRole } = renderWithTheme(
      <OverlayProvider>
        <BioModal {...defaultProps} closeModal={closeModal} />
      </OverlayProvider>
    );
    const closeButton = getByRole("button", { name: "close modal" });

    await user.click(closeButton);
    expect(closeModal).toHaveBeenCalled();
  });
  test("'prev' button disabled if 'prevBio' is undefined", () => {
    const { getByRole } = renderWithTheme(
      <OverlayProvider>
        <BioModal {...defaultProps} prevBio={undefined} />
      </OverlayProvider>
    );
    const prevButton = getByRole("button", { name: "previous board member" });

    expect(prevButton).toBeDisabled();
  });
});
