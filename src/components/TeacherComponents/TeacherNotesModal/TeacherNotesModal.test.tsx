import { useEditor } from "@tiptap/react";
import { act, waitFor } from "@testing-library/react";
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
jest.mock("@tiptap/react", () => {
  return {
    __esModule: true,
    ...jest.requireActual("@tiptap/react"),
    useEditor: jest.fn(({ onCreate, onUpdate, onBlur }) => {
      return {
        commands: {
          getHTML: jest.fn().mockReturnValue("<p>test</p>"),
          setContent: jest.fn(),
          clearDynamicHighlights: jest.fn(),
          applyDynamicHighlights: jest.fn(),
        },
        storage: {
          characterCount: {
            characters: jest.fn().mockReturnValue(0),
          },
        },
        isActive: jest.fn().mockReturnValue(false),
        getHTML: jest.fn().mockReturnValue(""),
        getText: jest.fn().mockReturnValue(""),
        onCreate,
        onUpdate,
        onBlur,
      };
    }),
  };
});

// mock OakTeacherNotesModal
jest.mock("@oaknational/oak-components", () => {
  return {
    __esModule: true,
    ...jest.requireActual("@oaknational/oak-components"),
    OakTeacherNotesModal: jest.fn(() => null),
  };
});

// mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});
const useEditorMock = useEditor as jest.Mock;
describe("TeacherNotesModal", () => {
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
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("isAllowedUri", () => {
    // mock context
    const context = {
      defaultProtocol: "https",
      defaultValidate: jest.fn().mockReturnValue(true),
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

  it("should populate the editor with the html from the teacher note when the onCreate event callback is triggered", async () => {
    // render the component
    render(
      <TeacherNotesModal
        isOpen={true}
        onClose={jest.fn()}
        saveTeacherNote={jest.fn()}
        teacherNote={mockTeacherNote}
        sharingUrl={"https://example.com"}
        error={null}
      />,
    );

    // get the call to useEditor
    const mockEditorArgs = useEditorMock.mock.calls?.[0];
    const mockEditorInstance = useEditorMock.mock.results?.[0]?.value;

    mockEditorArgs?.[0]?.onCreate({ editor: mockEditorInstance });

    expect(mockEditorInstance.commands.setContent).toHaveBeenCalledWith(
      mockTeacherNoteSnake.note_html,
    );
  });

  it("should save the teacher note when the editor loses focus", async () => {
    const saveTeacherNote = jest.fn(() =>
      Promise.resolve(mockTeacherNoteSnake),
    );
    // render the component
    render(
      <TeacherNotesModal
        isOpen={true}
        onClose={jest.fn()}
        saveTeacherNote={saveTeacherNote}
        teacherNote={mockTeacherNote}
        sharingUrl={"https://example.com"}
        error={null}
      />,
    );

    // get the call to useEditor
    const mockEditorArgs = useEditorMock.mock.calls?.[0];
    const mockEditorInstance = useEditorMock.mock.results?.[0]?.value;
    // mock results of getHTML and getText
    mockEditorInstance.getHTML.mockReturnValueOnce(
      "<p>this content has changed</p>",
    );
    mockEditorInstance.getText.mockReturnValueOnce("this content has changed");

    await act(async () => {
      mockEditorArgs?.[0]?.onBlur({ editor: mockEditorInstance });
    });

    expect(saveTeacherNote).toHaveBeenCalled();
  });

  it("should save the teacher note when the character count has changed by more than 50 chars", async () => {
    const saveTeacherNote = jest.fn(() =>
      Promise.resolve(mockTeacherNoteSnake),
    );
    // render the component
    render(
      <TeacherNotesModal
        isOpen={true}
        onClose={jest.fn()}
        saveTeacherNote={saveTeacherNote}
        teacherNote={mockTeacherNote}
        sharingUrl={"https://example.com"}
        error={null}
      />,
    );

    // get the call to useEditor
    const mockEditorArgs = useEditorMock.mock.calls?.[0];
    const mockEditorInstance = useEditorMock.mock.results?.[0]?.value;

    // mock results of getHTML and getText
    mockEditorInstance.getHTML.mockReturnValueOnce(
      "<p>this content has changed</p>",
    );
    mockEditorInstance.getText.mockReturnValueOnce("this content has changed");

    mockEditorInstance.storage.characterCount.characters.mockReturnValueOnce(
      51,
    );

    await act(async () => {
      mockEditorArgs?.[0]?.onUpdate({ editor: mockEditorInstance });
    });
    expect(saveTeacherNote).toHaveBeenCalled();
  });

  it("should save the teacher note when the modal is closed", () => {
    const saveTeacherNote = jest.fn(() =>
      Promise.resolve(mockTeacherNoteSnake),
    );

    const onClose = jest.fn();
    // render the component
    render(
      <TeacherNotesModal
        isOpen={true}
        onClose={onClose}
        saveTeacherNote={saveTeacherNote}
        teacherNote={{ ...mockTeacherNote }}
        sharingUrl={"https://example.com"}
        error={null}
      />,
    );

    const mockModal = OakTeacherNotesModal as jest.MockedFunction<
      typeof OakTeacherNotesModal
    >;
    const mockEditorInstance = useEditorMock.mock.results?.[0]?.value;

    const modalProps = mockModal.mock.calls?.[0]?.[0];
    if (!modalProps) {
      throw new Error("No modal props found");
    }

    // mock results of getHTML and getText
    mockEditorInstance.getHTML.mockReturnValueOnce(
      "<p>this content has changed</p>",
    );
    mockEditorInstance.getText.mockReturnValueOnce("this content has changed");

    modalProps.onClose();

    expect(saveTeacherNote).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should not save the teacher note when the note has not changed", () => {
    const mockSaveTeacherNote = jest.fn(() =>
      Promise.resolve(mockTeacherNoteSnake),
    );

    render(
      <TeacherNotesModal
        isOpen={true}
        onClose={jest.fn()}
        saveTeacherNote={mockSaveTeacherNote}
        teacherNote={{
          ...mockTeacherNote,
          noteHtml: "<p>no change</p>",
          noteText: "no change",
        }}
        sharingUrl={"https://example.com"}
        error={null}
      />,
    );

    const mockModal = OakTeacherNotesModal as jest.MockedFunction<
      typeof OakTeacherNotesModal
    >;

    const modalProps = mockModal.mock.calls?.[0]?.[0];
    if (!modalProps) {
      throw new Error("No modal props found");
    }

    const mockEditorArgs = useEditorMock.mock.calls?.[0];
    const mockEditorInstance = useEditorMock.mock.results?.[0]?.value;

    // mock results of getHTML and getText
    mockEditorInstance.getHTML.mockReturnValueOnce("<p>no change</p>");
    mockEditorInstance.getText.mockReturnValueOnce("no change");

    mockEditorArgs?.[0]?.onBlur({ editor: mockEditorInstance });

    expect(mockSaveTeacherNote).not.toHaveBeenCalled();
  });

  it("should not save the teacher note when note length is zero", () => {
    const mockSaveTeacherNote = jest.fn(() =>
      Promise.resolve(mockTeacherNoteSnake),
    );

    render(
      <TeacherNotesModal
        isOpen={true}
        onClose={jest.fn()}
        saveTeacherNote={mockSaveTeacherNote}
        teacherNote={mockTeacherNote}
        sharingUrl={"https://example.com"}
        error={null}
      />,
    );

    const mockModal = OakTeacherNotesModal as jest.MockedFunction<
      typeof OakTeacherNotesModal
    >;

    const modalProps = mockModal.mock.calls?.[0]?.[0];
    if (!modalProps) {
      throw new Error("No modal props found");
    }

    const mockEditorArgs = useEditorMock.mock.calls?.[0];
    const mockEditorInstance = useEditorMock.mock.results?.[0]?.value;

    // mock results of getHTML and getText
    mockEditorInstance.getHTML.mockReturnValueOnce("");
    mockEditorInstance.getText.mockReturnValueOnce("");

    mockEditorArgs?.[0]?.onBlur({ editor: mockEditorInstance });

    expect(mockSaveTeacherNote).not.toHaveBeenCalled();
  });

  it("should set note saved when the note has been saved", async () => {
    const mockSaveTeacherNote = jest.fn(() =>
      Promise.resolve(mockTeacherNoteSnake),
    );

    render(
      <TeacherNotesModal
        isOpen={true}
        onClose={jest.fn()}
        saveTeacherNote={mockSaveTeacherNote}
        teacherNote={mockTeacherNote}
        sharingUrl={"https://example.com"}
        error={null}
      />,
    );

    const mockModal = OakTeacherNotesModal as jest.MockedFunction<
      typeof OakTeacherNotesModal
    >;

    const modalProps = mockModal.mock.calls?.[0]?.[0];
    if (!modalProps) {
      throw new Error("No modal props found");
    }

    const mockEditorArgs = useEditorMock.mock.calls?.[0];
    const mockEditorInstance = useEditorMock.mock.results?.[0]?.value;

    // mock results of getHTML and getText
    mockEditorInstance.getHTML.mockReturnValueOnce(
      "<p>this content has changed</p>",
    );
    mockEditorInstance.getText.mockReturnValueOnce("this content has changed");

    mockEditorArgs?.[0]?.onBlur({ editor: mockEditorInstance });

    await waitFor(() => {
      const latestProps = mockModal.mock.lastCall?.[0];
      if (!latestProps) {
        throw new Error("No latest props found");
      }
      expect(latestProps.progressSaved).toBe(true);
    });
  });

  it("displays the 'progress saved' message when the note has been saved for 3 seconds", async () => {
    jest.spyOn(global, "setTimeout");

    const mockSaveTeacherNote = jest.fn(() =>
      Promise.resolve(mockTeacherNoteSnake),
    );

    render(
      <TeacherNotesModal
        isOpen={true}
        onClose={jest.fn()}
        saveTeacherNote={mockSaveTeacherNote}
        teacherNote={mockTeacherNote}
        sharingUrl={"https://example.com"}
        error={null}
      />,
    );

    const mockEditorArgs = useEditorMock.mock.calls?.[0];
    const mockEditorInstance = useEditorMock.mock.results?.[0]?.value;

    // mock results of getHTML and getText
    mockEditorInstance.getHTML.mockReturnValueOnce(
      "<p>this content has changed</p>",
    );
    mockEditorInstance.getText.mockReturnValueOnce("this content has changed");

    mockEditorArgs?.[0]?.onBlur({ editor: mockEditorInstance });

    const mockModal = OakTeacherNotesModal as jest.MockedFunction<
      typeof OakTeacherNotesModal
    >;

    await waitFor(() => {
      expect(mockModal).toHaveBeenLastCalledWith(
        expect.objectContaining({
          progressSaved: true,
        }),
        {},
      );
    });

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 3000);
  });

  it("calls shareActivated with the note length when the share button is clicked", async () => {
    const mockSaveTeacherNote = jest.fn(() =>
      Promise.resolve(mockTeacherNoteSnake),
    );

    const mockShareActivated = jest.fn();

    render(
      <TeacherNotesModal
        isOpen={true}
        onClose={jest.fn()}
        saveTeacherNote={mockSaveTeacherNote}
        teacherNote={mockTeacherNote}
        sharingUrl={"https://example.com"}
        error={null}
        shareActivated={mockShareActivated}
      />,
    );

    const mockModal = OakTeacherNotesModal as jest.MockedFunction<
      typeof OakTeacherNotesModal
    >;

    const modalProps = mockModal.mock.calls?.[0]?.[0];
    if (!modalProps) {
      throw new Error("No modal props found");
    }

    const mockEditorInstance = useEditorMock.mock.results?.[0]?.value;

    // mock results of getHTML and getText
    mockEditorInstance.getHTML.mockReturnValue(
      "<p>this content has changed</p>",
    );
    mockEditorInstance.getText.mockReturnValue("this content has changed");

    await act(async () => {
      modalProps.onShareClicked();
    });

    await waitFor(() => {
      expect(mockShareActivated).toHaveBeenCalledWith(24);
    });
  });

  it("copies the share url to clipboard when the share button is clicked", async () => {
    const mockSaveTeacherNote = jest.fn(() =>
      Promise.resolve(mockTeacherNoteSnake),
    );

    render(
      <TeacherNotesModal
        isOpen={true}
        onClose={jest.fn()}
        saveTeacherNote={mockSaveTeacherNote}
        teacherNote={mockTeacherNote}
        sharingUrl={"https://example.com"}
        error={null}
      />,
    );

    const mockModal = OakTeacherNotesModal as jest.MockedFunction<
      typeof OakTeacherNotesModal
    >;

    const modalProps = mockModal.mock.calls?.[0]?.[0];
    if (!modalProps) {
      throw new Error("No modal props found");
    }
    await act(async () => {
      modalProps.onShareClicked();
    });
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "https://example.com",
      );
    });
  });
});
