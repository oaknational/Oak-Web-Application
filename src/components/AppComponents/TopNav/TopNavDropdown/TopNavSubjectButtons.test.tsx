import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

import TopNavSubjectButtons, {
  getSubjectLinkHref,
} from "./TopNavSubjectButtons";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

const render = renderWithProviders();

describe("TopNavSubjectButtons", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  const subjects = [
    {
      title: "Geography",
      slug: "geography",
      nonCurriculum: false,
      programmeSlug: "geography-secondary-ks4",
      programmeCount: 3,
    },
    {
      title: "History",
      slug: "history",
      nonCurriculum: false,
      programmeSlug: "history-secondary-ks4",
      programmeCount: 1,
    },
  ];

  it("calls handleClick when a subject without exam boards is clicked", async () => {
    const mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
    const handleSubjectClick = jest.fn();
    const user = userEvent.setup();

    render(
      <TopNavSubjectButtons
        selectedMenu="secondary"
        subjects={subjects}
        selectedSubject={null}
        keyStageSlug="ks4"
        handleClick={handleSubjectClick}
        onExamBoardPanelOpen={jest.fn()}
        closeExamBoardPanel={jest.fn}
        phase="secondary"
      />,
    );

    const historyButton = screen.getByRole("link", { name: "History" });
    historyButton.addEventListener("click", (e) => e.preventDefault());
    await user.click(historyButton);

    expect(handleSubjectClick).toHaveBeenCalledWith("history", "ks4");
  });

  it("prevents default and calls onExamBoardPanelOpen when clicking KS4 subject with exam boards", async () => {
    const handleSubjectClick = jest.fn();
    const onExamBoardPanelOpen = jest.fn();
    const user = userEvent.setup();

    const subjectsWithBoards = [
      {
        title: "Biology",
        slug: "biology",
        nonCurriculum: false,
        programmeSlug: "biology-secondary-ks4",
        programmeCount: 3,
        examBoards: [
          {
            slug: "aqa",
            buttonTitle: "AQA",
            programmeSlug: "biology-secondary-ks4-aqa",
          },
        ],
      },
    ];

    render(
      <TopNavSubjectButtons
        selectedMenu="secondary"
        subjects={subjectsWithBoards}
        selectedSubject={null}
        keyStageSlug="ks4"
        handleClick={handleSubjectClick}
        onExamBoardPanelOpen={onExamBoardPanelOpen}
        closeExamBoardPanel={jest.fn}
        phase="secondary"
      />,
    );

    const biologyButton = screen.getByRole("button", { name: "Biology" });
    await user.click(biologyButton);

    expect(onExamBoardPanelOpen).toHaveBeenCalledWith(subjectsWithBoards[0]);
    expect(handleSubjectClick).not.toHaveBeenCalled();
  });

  describe("TopNavSubjectButtons - Link Generation", () => {
    describe("getSubjectLinkHref", () => {
      describe("EYFS subjects", () => {
        it("should generate EYFS route for single word EYFS programmes", () => {
          const subject = {
            title: "Maths",
            slug: "maths",
            nonCurriculum: false,
            programmeSlug: "maths-foundation-early-years-foundation-stage-l",
            programmeCount: 1,
          };
          const href = getSubjectLinkHref({
            subject,
            keyStageSlug: "early-years-foundation-stage",
            phaseSlug: "primary",
          });

          expect(href).toBe("/teachers/eyfs/maths");
        });

        it("should generate EYFS route for multi-word EYFS programmes", () => {
          const subject = {
            title: "Communication and Language",
            slug: "communication-and-language",
            nonCurriculum: false,
            programmeSlug:
              "communication-and-language-foundation-early-years-foundation-stage-l",
            programmeCount: 1,
          };
          const href = getSubjectLinkHref({
            subject,
            keyStageSlug: "early-years-foundation-stage",
            phaseSlug: "primary",
          });

          expect(href).toBe("/teachers/eyfs/communication-and-language");
        });
      });

      describe("non-EYFS subjects with single programme", () => {
        it("should link to unit-index when programmeCount is 1", () => {
          const subject = {
            title: "History",
            slug: "history",
            nonCurriculum: false,
            programmeSlug: "history-primary-ks2",
            programmeCount: 1,
          };
          const href = getSubjectLinkHref({
            subject,
            keyStageSlug: "ks2",
            phaseSlug: "primary",
          });

          expect(href).toBe(
            "/teachers/programmes/history-primary/units?keystages=ks2",
          );
        });

        it("should link to unit-index for secondary subject with single programme", () => {
          const subject = {
            title: "Geography",
            slug: "geography",
            nonCurriculum: false,
            programmeSlug: "geography-secondary-ks3",
            programmeCount: 1,
          };
          const href = getSubjectLinkHref({
            subject,
            keyStageSlug: "ks3",
            phaseSlug: "secondary",
          });

          expect(href).toBe(
            "/teachers/programmes/geography-secondary/units?keystages=ks3",
          );
        });

        it("should link to unit-index when keyStageSlug is not provided", () => {
          const subject = {
            title: "English",
            slug: "english",
            nonCurriculum: false,
            programmeSlug: "english-primary",
            programmeCount: 1,
          };
          const href = getSubjectLinkHref({
            subject,
            keyStageSlug: "ks1",
            phaseSlug: "primary",
          });

          expect(href).toBe(
            "/teachers/programmes/english-primary/units?keystages=ks1",
          );
        });

        it("should preserve ks4 option slug segments like core", () => {
          const subject = {
            title: "Citizenship",
            slug: "citizenship",
            nonCurriculum: false,
            pathwaySlug: "core",
            programmeSlug: "citizenship-secondary-ks4-core",
            programmeCount: 1,
          };
          const href = getSubjectLinkHref({
            subject,
            keyStageSlug: "ks4",
            phaseSlug: "secondary",
          });

          expect(href).toBe(
            "/teachers/programmes/citizenship-secondary-core/units?keystages=ks4",
          );
        });
      });
    });
  });

  describe("TopNavSubjectButtons accessibility", () => {
    const subjects = [
      {
        title: "Geography",
        slug: "geography",
        nonCurriculum: false,
        programmeSlug: "geography-secondary-ks4",
        programmeCount: 3,
        examBoards: [
          {
            slug: "aqa",
            buttonTitle: "AQA",
            programmeSlug: "geography-secondary-ks4-aqa",
          },
          {
            slug: "edexcel",
            buttonTitle: "Edexcel",
            programmeSlug: "geography-secondary-ks4-edexcel",
          },
        ],
      },
      {
        title: "History",
        slug: "history",
        nonCurriculum: false,
        programmeSlug: "history-secondary-ks4",
        programmeCount: 1,
      },
      {
        title: "Maths",
        slug: "maths",
        nonCurriculum: false,
        programmeSlug: "maths-secondary-ks4",
        programmeCount: 2,
      },
    ];

    it("renders subject buttons with correct roles and ids", () => {
      render(
        <TopNavSubjectButtons
          selectedMenu="secondary"
          subjects={subjects}
          selectedSubject={null}
          keyStageSlug="ks4"
          handleClick={jest.fn()}
          onExamBoardPanelOpen={jest.fn()}
          closeExamBoardPanel={jest.fn}
          phase="secondary"
        />,
      );

      expect(
        screen.getByRole("button", { name: "Geography" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "History" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Maths" })).toBeInTheDocument();
    });

    it("calls onExamBoardPanelOpen when Enter is pressed on KS4 subject with exam boards", async () => {
      const onExamBoardPanelOpen = jest.fn();
      const user = userEvent.setup();

      render(
        <TopNavSubjectButtons
          selectedMenu="secondary"
          subjects={subjects}
          selectedSubject={null}
          keyStageSlug="ks4"
          handleClick={jest.fn()}
          onExamBoardPanelOpen={onExamBoardPanelOpen}
          closeExamBoardPanel={jest.fn}
          phase="secondary"
        />,
      );

      const geographyButton = screen.getByRole("button", { name: "Geography" });
      geographyButton.focus();

      await user.keyboard("{Enter}");

      expect(onExamBoardPanelOpen).toHaveBeenCalledWith(subjects[0]);
    });

    it("does not call onExamBoardPanelOpen for subjects without exam boards", async () => {
      const onExamBoardPanelOpen = jest.fn();
      const user = userEvent.setup();

      const subjectsWithoutBoards = [
        {
          title: "English",
          slug: "english",
          nonCurriculum: false,
          programmeSlug: "english-secondary-ks4",
          programmeCount: 1,
        },
      ];

      render(
        <TopNavSubjectButtons
          selectedMenu="secondary"
          subjects={subjectsWithoutBoards}
          selectedSubject={null}
          keyStageSlug="ks4"
          handleClick={jest.fn()}
          onExamBoardPanelOpen={onExamBoardPanelOpen}
          closeExamBoardPanel={jest.fn}
          phase="secondary"
        />,
      );

      const englishButton = screen.getByRole("link", { name: "English" });
      englishButton.addEventListener("click", (e) => e.preventDefault());
      englishButton.focus();

      await user.keyboard("{Enter}");

      expect(onExamBoardPanelOpen).not.toHaveBeenCalled();
    });
  });
});
