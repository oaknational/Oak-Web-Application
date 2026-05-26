import userEvent from "@testing-library/user-event";
import { screen, fireEvent } from "@testing-library/react";
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
      />,
    );

    const historyButton = screen.getByRole("button", { name: "History" });
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
            title: "AQA",
            programmeSlug: "biology-secondary-ks4-aqa",
            tierSlug: null,
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
          const href = getSubjectLinkHref({
            programmeCount: 1,
            subjectSlug: "maths",
            programmeSlug: "maths-foundation-early-years-foundation-stage-l",
            keyStageSlug: "early-years-foundation-stage",
            phaseSlug: "primary",
          });

          expect(href).toBe("/teachers/eyfs/maths");
        });

        it("should generate EYFS route for multi-word EYFS programmes", () => {
          const href = getSubjectLinkHref({
            programmeCount: 1,
            subjectSlug: "communication-and-language",
            programmeSlug:
              "communication-and-language-foundation-early-years-foundation-stage-l",
            keyStageSlug: "early-years-foundation-stage",
            phaseSlug: "primary",
          });

          expect(href).toBe("/teachers/eyfs/communication-and-language");
        });
      });

      describe("non-EYFS subjects with multiple programmes", () => {
        it("should link to programme-index when programmeCount > 1", () => {
          const href = getSubjectLinkHref({
            programmeCount: 2,
            subjectSlug: "maths",
            programmeSlug: "maths-primary-ks1",
            keyStageSlug: "ks1",
            phaseSlug: "primary",
          });

          expect(href).toBe(
            "/teachers/key-stages/ks1/subjects/maths/programmes",
          );
        });

        it("should link to programme-index for secondary subject with multiple programmes", () => {
          const href = getSubjectLinkHref({
            programmeCount: 3,
            subjectSlug: "science",
            programmeSlug: "science-secondary-ks4",
            keyStageSlug: "ks4",
            phaseSlug: "secondary",
          });

          expect(href).toBe(
            "/teachers/key-stages/ks4/subjects/science/programmes",
          );
        });
      });

      describe("non-EYFS subjects with single programme", () => {
        it("should link to unit-index when programmeCount is 1", () => {
          const href = getSubjectLinkHref({
            programmeCount: 1,
            subjectSlug: "history",
            programmeSlug: "history-primary-ks2",
            keyStageSlug: "ks2",
            phaseSlug: "primary",
          });

          expect(href).toBe(
            "/teachers/programmes/history-primary/units?keystages=ks2",
          );
        });

        it("should link to unit-index for secondary subject with single programme", () => {
          const href = getSubjectLinkHref({
            programmeCount: 1,
            subjectSlug: "geography",
            programmeSlug: "geography-secondary-ks3",
            keyStageSlug: "ks3",
            phaseSlug: "secondary",
          });

          expect(href).toBe(
            "/teachers/programmes/geography-secondary/units?keystages=ks3",
          );
        });

        it("should link to unit-index when keyStageSlug is not provided", () => {
          const href = getSubjectLinkHref({
            programmeCount: 1,
            subjectSlug: "english",
            programmeSlug: "english-primary-ks1",
            keyStageSlug: "ks1",
            phaseSlug: "primary",
          });

          expect(href).toBe(
            "/teachers/programmes/english-primary/units?keystages=ks1",
          );
        });

        it("should preserve ks4 option slug segments like core", () => {
          const href = getSubjectLinkHref({
            programmeCount: 1,
            subjectSlug: "citizenship",
            programmeSlug: "citizenship-secondary-ks4-core",
            keyStageSlug: "ks4",
            phaseSlug: "secondary",
          });

          expect(href).toBe(
            "/teachers/programmes/citizenship-secondary-core/units?keystages=ks4",
          );
        });

        it("should preserve option and examboard segments after ks4", () => {
          const href = getSubjectLinkHref({
            programmeCount: 1,
            subjectSlug: "biology",
            programmeSlug: "biology-secondary-ks4-higher-aqa",
            keyStageSlug: "ks4",
            phaseSlug: "secondary",
          });

          expect(href).toBe(
            "/teachers/programmes/biology-secondary-higher-aqa/units?keystages=ks4",
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
            title: "AQA",
            programmeSlug: "geography-secondary-ks4-aqa",
            tierSlug: null,
          },
          {
            slug: "edexcel",
            title: "Edexcel",
            programmeSlug: "geography-secondary-ks4-edexcel",
            tierSlug: null,
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
        />,
      );

      expect(
        screen.getByRole("button", { name: "Geography" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "History" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Maths" })).toBeInTheDocument();
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
        />,
      );

      const englishButton = screen.getByRole("button", { name: "English" });
      englishButton.focus();

      await user.keyboard("{Enter}");

      expect(onExamBoardPanelOpen).not.toHaveBeenCalled();
    });

    it("calls onSubjectBlur when subject loses focus", async () => {
      const onSubjectBlur = jest.fn();

      render(
        <TopNavSubjectButtons
          selectedMenu="secondary"
          subjects={subjects}
          selectedSubject={null}
          keyStageSlug="ks4"
          handleClick={jest.fn()}
          onExamBoardPanelOpen={jest.fn()}
          onSubjectBlur={onSubjectBlur}
        />,
      );

      const geographyButton = screen.getByRole("button", { name: "Geography" });
      geographyButton.focus();
      fireEvent.blur(geographyButton);

      expect(onSubjectBlur).toHaveBeenCalledWith(subjects[0]);
    });
  });
});
