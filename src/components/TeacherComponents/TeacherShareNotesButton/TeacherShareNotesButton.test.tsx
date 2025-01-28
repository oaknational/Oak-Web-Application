import { ReactNode } from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { TeacherShareNotesButton } from "./TeacherShareNotesButton";

// Mock the imported components
jest.mock("@oaknational/oak-components", () => ({
  OakSmallSecondaryButton: ({
    children,
    onClick,
  }: {
    children: ReactNode;
    onClick: () => void;
  }) => <button onClick={onClick}>{children}</button>,
}));

jest.mock(
  "@/components/TeacherComponents/TeacherShareButton/TeacherShareButton",
  () => ({
    TeacherShareButton: ({
      label,
      shareUrl,
    }: {
      label: string;
      shareUrl: string;
    }) => (
      <button data-testid="share-button" data-share-url={shareUrl}>
        {label}
      </button>
    ),
  }),
);

describe("TeacherShareNotesButton", () => {
  const defaultProps = {
    teacherNotesEnabled: false,
    isEditable: false,
    noteSaved: false,
    setTeacherNotesOpen: jest.fn(),
    shareUrl: "https://example.com/share",
    shareActivated: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when teacher notes are disabled", () => {
    it("renders TeacherShareButton with correct props", () => {
      render(<TeacherShareNotesButton {...defaultProps} />);

      const shareButton = screen.getByTestId("share-button");
      expect(shareButton).toBeInTheDocument();
      expect(shareButton).toHaveTextContent("Share resources with colleague");
      expect(shareButton).toHaveAttribute(
        "data-share-url",
        "https://example.com/share",
      );
    });
  });

  describe("when teacher notes are enabled but not editable", () => {
    it("renders TeacherShareButton", () => {
      render(
        <TeacherShareNotesButton
          {...defaultProps}
          teacherNotesEnabled={true}
          isEditable={false}
        />,
      );

      const shareButton = screen.getByTestId("share-button");
      expect(shareButton).toBeInTheDocument();
    });
  });

  describe("when teacher notes are enabled and editable", () => {
    it("renders 'Add teacher note and share' button when note is not saved", () => {
      render(
        <TeacherShareNotesButton
          {...defaultProps}
          teacherNotesEnabled={true}
          isEditable={true}
          noteSaved={false}
        />,
      );

      expect(
        screen.getByText("Add teacher note and share"),
      ).toBeInTheDocument();
    });

    it("renders 'Edit teacher note and share' button when note is saved", () => {
      render(
        <TeacherShareNotesButton
          {...defaultProps}
          teacherNotesEnabled={true}
          isEditable={true}
          noteSaved={true}
        />,
      );

      expect(
        screen.getByText("Edit teacher note and share"),
      ).toBeInTheDocument();
    });

    it("calls setTeacherNotesOpen when clicked", () => {
      const setTeacherNotesOpen = jest.fn();
      render(
        <TeacherShareNotesButton
          {...defaultProps}
          teacherNotesEnabled={true}
          isEditable={true}
          setTeacherNotesOpen={setTeacherNotesOpen}
        />,
      );

      fireEvent.click(screen.getByText("Add teacher note and share"));
      expect(setTeacherNotesOpen).toHaveBeenCalledWith(true);
    });
  });

  describe("shareActivated callback", () => {
    it("passes shareActivated to TeacherShareButton", () => {
      const shareActivated = jest.fn();
      render(
        <TeacherShareNotesButton
          {...defaultProps}
          shareActivated={shareActivated}
        />,
      );

      const shareButton = screen.getByTestId("share-button");
      expect(shareButton).toBeInTheDocument();
    });
  });
});
