import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";

import ExamBoardPanel from "./ExamBoardPanel";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { DropdownFocusManager } from "@/components/AppComponents/TopNav/DropdownFocusManager/DropdownFocusManager";
import {
  SubjectsNavItem,
  TeachersSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

const render = renderWithProviders();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => "/test-path"),
}));

jest.mock("@/common-lib/urls", () => ({
  resolveOakHref: jest.fn(
    (config) => `/test-path/${config.subjectPhaseSlug}/${config.tab}`,
  ),
}));

jest.mock("@/utils/curriculum/slugs", () => ({
  getTeacherSubjectPhaseSlug: jest.fn(() => "test-programme-slug"),
}));

const mockPush = jest.fn();

describe("ExamBoardPanel", () => {
  const mockOnClick = jest.fn();
  const mockOnClose = jest.fn();
  const examBoards = [
    { slug: "aqa", title: "AQA", programmeSlug: "aqa-prog", tierSlug: null },
    {
      slug: "edexcel",
      title: "Edexcel",
      programmeSlug: "edexcel-prog",
      tierSlug: null,
    },
  ];
  const selectedSubject = {
    slug: "geography",
    title: "Geography",
    examBoards,
  } as SubjectsNavItem;

  const createFocusManagerMock = () =>
    ({
      createId: jest.fn((parent: string, child: string) =>
        child ? `${parent}-${child}` : parent,
      ),
      registerChildren: jest.fn(),
      unregisterChildren: jest.fn(),
      handleEscapeKey: jest.fn(),
    }) as unknown as DropdownFocusManager<TeachersSubNavData>;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders exam board heading", () => {
    render(
      <ExamBoardPanel
        examBoards={examBoards}
        selectedSubject={selectedSubject}
        onClick={mockOnClick}
        onClose={mockOnClose}
        onLeave={mockOnClose}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Choose exam board for KS4 Geography",
      }),
    ).toBeInTheDocument();
  });

  it("renders all exam board options", () => {
    render(
      <ExamBoardPanel
        examBoards={examBoards}
        selectedSubject={selectedSubject}
        onClick={mockOnClick}
        onClose={mockOnClose}
        onLeave={mockOnClose}
      />,
    );

    expect(screen.getByText("AQA")).toBeInTheDocument();
    expect(screen.getByText("Edexcel")).toBeInTheDocument();
  });

  it("navigates when exam board is selected", async () => {
    const user = userEvent.setup();
    render(
      <ExamBoardPanel
        examBoards={examBoards}
        selectedSubject={selectedSubject}
        onClick={mockOnClick}
        onClose={mockOnClose}
        onLeave={mockOnClose}
      />,
    );

    const aqaRadio = screen.getByTestId("exam-board-aqa");
    await user.click(aqaRadio);

    expect(mockPush).toHaveBeenCalledWith(
      "/test-path/test-programme-slug/units?keystages=ks4",
    );
  });

  it("calls onClick with subject and keystage when exam board is selected", async () => {
    const user = userEvent.setup();
    render(
      <ExamBoardPanel
        examBoards={examBoards}
        selectedSubject={selectedSubject}
        onClick={mockOnClick}
        onClose={mockOnClose}
        onLeave={mockOnClose}
      />,
    );

    const aqaRadio = screen.getByTestId("exam-board-aqa");
    await user.click(aqaRadio);

    expect(mockOnClick).toHaveBeenCalledWith("geography", "ks4");
  });

  it("should generate correct title for Maths", () => {
    const maths = {
      slug: "maths",
      title: "Maths",
      examBoards,
    } as SubjectsNavItem;

    const mathsExamBoards = [
      {
        slug: "higher",
        title: "Higher",
        programmeSlug: "maths-higher",
        tierSlug: "higher",
      },
      {
        slug: "foundation",
        title: "Foundation",
        programmeSlug: "maths-foundation",
        tierSlug: "foundation",
      },
    ];

    render(
      <ExamBoardPanel
        examBoards={mathsExamBoards}
        selectedSubject={maths}
        onClick={mockOnClick}
        onClose={mockOnClose}
        onLeave={mockOnClose}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Choose exam board for KS4 Maths",
      }),
    ).toBeInTheDocument();

    expect(screen.getByDisplayValue("Higher")).toBeInTheDocument();
  });

  describe("ExamBoardPanel accessibility", () => {
    it("focuses the first exam board radio when the panel opens", async () => {
      render(
        <ExamBoardPanel
          examBoards={examBoards}
          selectedSubject={selectedSubject}
          onClick={mockOnClick}
          onClose={mockOnClose}
          onLeave={mockOnClose}
        />,
      );

      const firstRadio = screen.getByRole("radio", { name: "AQA" });

      await waitFor(() => {
        expect(firstRadio).toHaveFocus();
      });
    });

    it("moves focus to the next exam board on Tab when using focusManager", async () => {
      const focusManager = createFocusManagerMock();
      render(
        <ExamBoardPanel
          examBoards={examBoards}
          selectedSubject={selectedSubject}
          focusManager={focusManager}
          onClick={mockOnClick}
          onClose={mockOnClose}
          onLeave={mockOnClose}
        />,
      );

      const firstRadio = screen.getByRole("radio", { name: "AQA" });
      const secondRadio = screen.getByRole("radio", { name: "Edexcel" });

      firstRadio.focus();
      fireEvent.keyDown(firstRadio, { key: "Tab" });

      expect(secondRadio).toHaveFocus();
    });

    it("moves focus back to subject context on Shift+Tab from first exam board", async () => {
      const focusManager = createFocusManagerMock();
      const onLeave = jest.fn();

      const subjectsContainer = document.createElement("div");
      subjectsContainer.id = "topnav-teachers-ks4-subjects";

      const previousSibling = document.createElement("button");
      previousSibling.id = "teachers-secondary-ks4-history";

      const parentSubject = document.createElement("button");
      parentSubject.id = "teachers-secondary-ks4-geography";

      subjectsContainer.append(previousSibling, parentSubject);
      document.body.appendChild(subjectsContainer);

      render(
        <ExamBoardPanel
          examBoards={examBoards}
          selectedSubject={selectedSubject}
          focusManager={focusManager}
          onClick={mockOnClick}
          onClose={mockOnClose}
          onLeave={onLeave}
        />,
      );

      const firstRadio = screen.getByRole("radio", { name: "AQA" });
      firstRadio.focus();

      fireEvent.keyDown(firstRadio, { key: "Tab", shiftKey: true });

      expect(previousSibling).toHaveFocus();
      expect(onLeave).toHaveBeenCalledTimes(1);

      subjectsContainer.remove();
    });

    it("calls focusManager.handleEscapeKey on Escape", () => {
      const focusManager = createFocusManagerMock();

      render(
        <ExamBoardPanel
          examBoards={examBoards}
          selectedSubject={selectedSubject}
          focusManager={focusManager}
          onClick={mockOnClick}
          onClose={mockOnClose}
          onLeave={mockOnClose}
        />,
      );

      const firstRadio = screen.getByRole("radio", { name: "AQA" });
      firstRadio.setAttribute("id", "exam-board-aqa-radio");
      firstRadio.focus();

      fireEvent.keyDown(firstRadio, { key: "Escape" });

      expect(focusManager.handleEscapeKey).toHaveBeenCalledTimes(1);
      expect(
        (focusManager.handleEscapeKey as jest.Mock).mock.calls[0][0].elementId,
      ).toBe("exam-board-aqa-radio");
    });
  });
});
