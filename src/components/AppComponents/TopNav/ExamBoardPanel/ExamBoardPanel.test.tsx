import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ExamBoardPanel from "./ExamBoardPanel";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { DropdownFocusManager } from "@/components/AppComponents/TopNav/DropdownFocusManager/DropdownFocusManager";
import {
  ProgrammeFactorButton,
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

describe("ExamBoardPanel", () => {
  const mockOnClick = jest.fn();
  const mockOnClose = jest.fn();
  const examBoards: ProgrammeFactorButton[] = [
    {
      buttonTitle: "AQA",
      programmeSlug: "aqa-prog",
      programmeFactors: { examboard: { slug: "aqa", title: "AQA" } },
    },
    {
      buttonTitle: "Edexcel",
      programmeSlug: "edexcel-prog",
      programmeFactors: {
        examboard: { slug: "edexcel", title: "Edexcel" },
      },
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
  });

  it("renders exam board heading", () => {
    render(
      <ExamBoardPanel
        examBoards={examBoards}
        selectedSubject={selectedSubject}
        onClick={mockOnClick}
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
        onLeave={mockOnClose}
      />,
    );

    expect(screen.getByText("AQA")).toBeInTheDocument();
    expect(screen.getByText("Edexcel")).toBeInTheDocument();
  });

  it("renders exam board links with the expected destination", () => {
    render(
      <ExamBoardPanel
        examBoards={examBoards}
        selectedSubject={selectedSubject}
        onClick={mockOnClick}
        onLeave={mockOnClose}
      />,
    );

    const aqaLink = screen.getByTestId("exam-board-aqa");

    expect(aqaLink).toHaveAttribute(
      "href",
      "/test-path/test-programme-slug/units",
    );
  });

  it("calls onClick with subject and keystage when exam board is selected", async () => {
    const user = userEvent.setup();
    render(
      <ExamBoardPanel
        examBoards={examBoards}
        selectedSubject={selectedSubject}
        onClick={mockOnClick}
        onLeave={mockOnClose}
      />,
    );

    const aqaLink = screen.getByTestId("exam-board-aqa");
    aqaLink.addEventListener("click", (e) => e.preventDefault());
    await user.click(aqaLink);

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
        buttonTitle: "Higher",
        programmeSlug: "maths-higher",
        programmeFactors: {
          tier: { slug: "higher", description: "Higher" },
        },
      },
      {
        buttonTitle: "Foundation",
        programmeSlug: "maths-foundation",
        programmeFactors: {
          tier: { slug: "foundation", description: "Foundation" },
        },
      },
    ] satisfies ProgrammeFactorButton[];

    render(
      <ExamBoardPanel
        examBoards={mathsExamBoards}
        selectedSubject={maths}
        onClick={mockOnClick}
        onLeave={mockOnClose}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Choose tier for KS4 Maths",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Higher")).toBeInTheDocument();
  });

  describe("ExamBoardPanel accessibility", () => {
    it("focuses the first exam board link when the panel opens", async () => {
      render(
        <ExamBoardPanel
          examBoards={examBoards}
          selectedSubject={selectedSubject}
          onClick={mockOnClick}
          onLeave={mockOnClose}
        />,
      );

      const firstLink = screen.getByRole("link", { name: "AQA" });

      await waitFor(() => {
        expect(firstLink).toHaveFocus();
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
          onLeave={mockOnClose}
        />,
      );

      const firstLink = screen.getByRole("link", { name: "AQA" });
      const secondLink = screen.getByRole("link", { name: "Edexcel" });

      firstLink.focus();
      fireEvent.keyDown(firstLink, { key: "Tab" });

      expect(secondLink).toHaveFocus();
    });

    it("moves focus back to subject context on Shift+Tab from first exam board", async () => {
      const focusManager = createFocusManagerMock();
      const onLeave = jest.fn();

      const subjectsContainer = document.createElement("div");
      subjectsContainer.id = "topnav-teachers-ks4-subjects";

      const previousSibling = document.createElement("a");
      previousSibling.href = "#";
      previousSibling.id = "teachers-secondary-ks4-history";

      const parentSubject = document.createElement("a");
      parentSubject.href = "#";
      parentSubject.id = "teachers-secondary-ks4-geography";

      subjectsContainer.append(previousSibling, parentSubject);
      document.body.appendChild(subjectsContainer);

      render(
        <ExamBoardPanel
          examBoards={examBoards}
          selectedSubject={selectedSubject}
          focusManager={focusManager}
          onClick={mockOnClick}
          onLeave={onLeave}
        />,
      );

      const firstLink = screen.getByRole("link", { name: "AQA" });
      firstLink.focus();

      fireEvent.keyDown(firstLink, { key: "Tab", shiftKey: true });

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
          onLeave={mockOnClose}
        />,
      );

      const firstRadio = screen.getByRole("link", { name: "AQA" });
      firstRadio.setAttribute("id", "exam-board-aqa-link");
      firstRadio.focus();

      fireEvent.keyDown(firstRadio, { key: "Escape" });

      expect(focusManager.handleEscapeKey).toHaveBeenCalledTimes(1);
      expect(
        (focusManager.handleEscapeKey as jest.Mock).mock.calls[0][0].elementId,
      ).toBe("exam-board-aqa-link");
    });
  });
});
