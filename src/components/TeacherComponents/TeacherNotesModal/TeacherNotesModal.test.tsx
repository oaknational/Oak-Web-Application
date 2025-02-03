import { Mock, MockedFunction, vi } from "vitest";
import { useEditor } from "@tiptap/react";
import { waitFor } from "@testing-library/react";
import {
  TeacherNote,
  TeacherNoteCamelCase,
} from "@oaknational/oak-pupil-client";
import { OakTeacherNotesModal } from "@oaknational/oak-components";

import {
  isAllowedUri,
  shouldAutoLink,
  TeacherNotesModal,
} from "./TeacherNotesModal";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

// mock the useEditor hook
vi.mock("@tiptap/react", async () => {
  return {
    __esModule: true,
    ...(await vi.importActual("@tiptap/react")),
    useEditor: vi.fn().mockReturnValue({
      commands: {
        getHTML: vi.fn().mockReturnValue("<p>test</p>"),
        setContent: vi.fn(),
      },
      storage: {
        characterCount: {
          characters: vi.fn().mockReturnValue(0),
        },
      },
      isActive: vi.fn().mockReturnValue(false),
      getHTML: vi.fn().mockReturnValue(""),
      getText: vi.fn().mockReturnValue(""),
    }),
  };
});

// mock OakTeacherNotesModal
vi.mock("@oaknational/oak-components", async () => {
  return {
    __esModule: true,
    ...(await vi.importActual("@oaknational/oak-components")),
    OakTeacherNotesModal: vi.fn(() => null),
  };
});

describe("TeacherNotesModal", () => {
  const useEditorMock = useEditor as Mock;
  const mockTeacherNote: TeacherNoteCamelCase = {
    noteHtml: "<p>test</p>",
    sidKey: "sid-ARHMdf",
    noteId: "hkk2-NIFaM",
    noteText: "test",
    lessonPath: "teachers/lessons/transverse-waves",
  };

  const mockTeacherNoteSnake: TeacherNote = {
    note_html: "<p>test</p>",
    sid_key: "sid-ARHMdf",
    note_id: "hkk2-NIFaM",
    note_text: "test",
    lesson_path: "teachers/lessons/transverse-waves",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("isAllowedUri", () => {
    // mock context
    const context = {
      defaultProtocol: "https",
      defaultValidate: vi.fn().mockReturnValue(true),
      protocols: ["http", "https"],
    };

    it("should return false if the protocol is not allowed", () => {
      const result = isAllowedUri("ftp://example.com", context);
      expect(result).toBe(false);
    });

    it("should return true if the protocol is allowed", () => {
      const result = isAllowedUri("https://example.com", context);
      expect(result).toBe(true);
    });

    it("should return true if the protocol is allowed", () => {
      const result = isAllowedUri("http://example.com", context);
      expect(result).toBe(true);
    });

    it("should return false if the URL is invalid", () => {
      context.defaultValidate.mockReturnValueOnce(false);
      const result = isAllowedUri("https://", context);
      expect(result).toBe(false);
    });

    it("should return false if the URL is invalid", () => {
      const result = isAllowedUri("https://", context);
      expect(result).toBe(false);
    });

    it("should return false if the URL is not in the allowed list of protocols", () => {
      const result = isAllowedUri("http://example.com", {
        ...context,
        protocols: ["https"],
      });
      expect(result).toBe(false);
    });
  });

  describe("shouldAutoLink", () => {
    it("should return true if the URL is valid", () => {
      const result = shouldAutoLink("https://example.com");
      expect(result).toBe(true);
    });

    it("should return true if the URL is valid", () => {
      const result = shouldAutoLink("example.com");
      expect(result).toBe(true);
    });

    it("should return false if the URL is invalid", () => {
      const result = shouldAutoLink("https://");
      expect(result).toBe(false);
    });

    it("should return false if the URL is invalid", () => {
      const result = shouldAutoLink("https://");
      expect(result).toBe(false);
    });
  });

  it("should populate the editor with the html from the teacher note", async () => {
    const mockEditorSetContent = useEditorMock().commands.setContent;
    // render the component
    render(
      <TeacherNotesModal
        isOpen={true}
        onClose={vi.fn()}
        saveTeacherNote={vi.fn()}
        teacherNote={mockTeacherNote}
      />,
    );

    await waitFor(() => {
      expect(mockEditorSetContent).toHaveBeenCalledWith("<p>test</p>");
    });
  });
  it("should call save teacher note when the save button is clicked", async () => {
    const mockSaveTeacherNote = vi
      .fn(() => Promise.resolve(mockTeacherNoteSnake))
      .mockName("saveTeacherNote");

    render(
      <TeacherNotesModal
        isOpen={true}
        onClose={vi.fn()}
        saveTeacherNote={mockSaveTeacherNote}
        teacherNote={mockTeacherNote}
      />,
    );

    const mockModal = OakTeacherNotesModal as MockedFunction<
      typeof OakTeacherNotesModal
    >;

    const modalProps = mockModal.mock.calls?.[0]?.[0];
    if (!modalProps) {
      throw new Error("No modal props found");
    }

    modalProps.onSaveClicked();

    await waitFor(() => {
      console.log(mockSaveTeacherNote.getMockName());
      expect(mockSaveTeacherNote).toHaveBeenCalled();
    });
  });

  it("should set note saved when the note has been saved", async () => {
    const mockSaveTeacherNote = vi
      .fn(() => Promise.resolve(mockTeacherNoteSnake))
      .mockName("saveTeacherNote");

    render(
      <TeacherNotesModal
        isOpen={true}
        onClose={vi.fn()}
        saveTeacherNote={mockSaveTeacherNote}
        teacherNote={mockTeacherNote}
      />,
    );

    const mockModal = OakTeacherNotesModal as MockedFunction<
      typeof OakTeacherNotesModal
    >;

    const modalProps = mockModal.mock.calls?.[0]?.[0];
    if (!modalProps) {
      throw new Error("No modal props found");
    }

    modalProps.onSaveClicked();

    await waitFor(() => {
      const latestProps = mockModal.mock.lastCall?.[0];
      if (!latestProps) {
        throw new Error("No latest props found");
      }
      expect(latestProps.noteSaved).toBe(true);
    });
  });
});
