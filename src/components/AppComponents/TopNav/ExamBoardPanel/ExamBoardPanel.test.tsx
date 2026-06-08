import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ExamBoardPanel from "./ExamBoardPanel";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { DropdownFocusManager } from "@/components/AppComponents/TopNav/DropdownFocusManager/DropdownFocusManager";
import { buildFocusTree } from "@/components/AppComponents/TopNav/DropdownFocusManager/focusTree";
import {
  ProgrammeFactorButton,
  SubjectsNavItem,
  TeachersSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
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

describe("ExamBoardPanel", () => {
  const mockOnClick = jest.fn();
  const mockOnClose = jest.fn();
  const examBoards: ProgrammeFactorButton[] = [
    {
      buttonTitle: "AQA",
      programmeSlug: "aqa-prog",
      href: "/teachers/programmes/geography-secondary-aqa/units?keystages=ks4",
      programmeFactors: { examboard: { slug: "aqa", title: "AQA" } },
    },
    {
      buttonTitle: "Edexcel",
      programmeSlug: "edexcel-prog",
      href: "/teachers/programmes/geography-secondary-edexcel/units?keystages=ks4",
      programmeFactors: {
        examboard: { slug: "edexcel", title: "Edexcel" },
      },
    },
  ];
  const selectedSubject = {
    slug: "geography",
    title: "Geography",
    href: "/teachers/programmes/geography-secondary/units?keystages=ks4",
    examBoards,
  } as SubjectsNavItem;

  const createFocusManagerMock = () =>
    ({
      createId: jest.fn((parent: string, child: string) =>
        child ? `${parent}-${child}` : parent,
      ),
      handleKeyDown: jest.fn(),
      handleEscapeKey: jest.fn(),
    }) as unknown as DropdownFocusManager<TeachersSubNavData>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders exam board heading", () => {
    render(
      <ExamBoardPanel
        examBoards={examBoards}
        phaseSlug="secondary"
        keystageSlug="ks4"
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
        phaseSlug="secondary"
        keystageSlug="ks4"
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
        phaseSlug="secondary"
        keystageSlug="ks4"
        selectedSubject={selectedSubject}
        onClick={mockOnClick}
        onLeave={mockOnClose}
      />,
    );

    const aqaLink = screen.getByTestId("exam-board-aqa");

    expect(aqaLink).toHaveAttribute("href", examBoards[0]!.href);
  });

  it("calls onClick with subject and keystage when exam board is selected", async () => {
    const user = userEvent.setup();
    render(
      <ExamBoardPanel
        examBoards={examBoards}
        phaseSlug="secondary"
        keystageSlug="ks4"
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
        href: "/teachers/programmes/maths-secondary/units?keystages=ks4&tiers=higher",
        programmeFactors: {
          tier: { slug: "higher", description: "Higher" },
        },
      },
      {
        buttonTitle: "Foundation",
        programmeSlug: "maths-foundation",
        href: "/teachers/programmes/maths-secondary/units?keystages=ks4&tiers=foundation",
        programmeFactors: {
          tier: { slug: "foundation", description: "Foundation" },
        },
      },
    ] satisfies ProgrammeFactorButton[];

    render(
      <ExamBoardPanel
        examBoards={mathsExamBoards}
        phaseSlug="secondary"
        keystageSlug="ks4"
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
          phaseSlug="secondary"
          keystageSlug="ks4"
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

    it("keeps exam board panel open on non-boundary Tab", async () => {
      const focusManager = new DropdownFocusManager<TeachersSubNavData>(
        buildFocusTree(topNavFixture.teachers!, "teachers"),
        "teachers",
        () => undefined,
      );
      const onLeave = jest.fn();
      render(
        <ExamBoardPanel
          examBoards={examBoards}
          phaseSlug="secondary"
          keystageSlug="ks4"
          selectedSubject={selectedSubject}
          focusManager={focusManager}
          onClick={mockOnClick}
          onLeave={onLeave}
        />,
      );

      const firstLink = screen.getByRole("link", { name: "AQA" });

      firstLink.focus();
      fireEvent.keyDown(firstLink, { key: "Tab" });

      expect(onLeave).not.toHaveBeenCalled();
    });

    it("moves focus back to subject context on Shift+Tab from first exam board", async () => {
      const focusManager = new DropdownFocusManager<TeachersSubNavData>(
        [
          {
            id: "teachers-secondary",
            children: [
              {
                id: "teachers-secondary-keystages",
                children: [
                  {
                    id: "teachers-secondary-ks4",
                    children: [
                      {
                        id: "teachers-secondary-ks4-geography",
                        children: [
                          { id: "teachers-secondary-ks4-geography-aqa" },
                          { id: "teachers-secondary-ks4-geography-edexcel" },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        "teachers",
        () => undefined,
      );
      const onLeave = jest.fn();

      const subjectsContainer = document.createElement("div");
      subjectsContainer.id = "topnav-teachers-ks4-subjects";

      const parentSubject = document.createElement("a");
      parentSubject.href = "#";
      parentSubject.id = "teachers-secondary-ks4-geography";

      subjectsContainer.append(parentSubject);
      document.body.appendChild(subjectsContainer);

      render(
        <ExamBoardPanel
          examBoards={examBoards}
          phaseSlug="secondary"
          keystageSlug="ks4"
          selectedSubject={selectedSubject}
          focusManager={focusManager}
          onClick={mockOnClick}
          onLeave={onLeave}
        />,
      );

      const firstLink = screen.getByRole("link", { name: "AQA" });
      firstLink.focus();

      fireEvent.keyDown(firstLink, { key: "Tab", shiftKey: true });

      expect(parentSubject).toHaveFocus();
      expect(onLeave).toHaveBeenCalledTimes(1);

      subjectsContainer.remove();
    });

    it("calls focusManager.handleEscapeKey on Escape", () => {
      const focusManager = createFocusManagerMock();

      render(
        <ExamBoardPanel
          examBoards={examBoards}
          phaseSlug="secondary"
          keystageSlug="ks4"
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
      ).toBe("teachers-secondary-ks4-geography-aqa");
    });
  });
});
