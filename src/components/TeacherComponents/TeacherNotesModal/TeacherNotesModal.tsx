import { useRef, useState } from "react";
import styled from "styled-components";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link, { LinkProtocolOptions } from "@tiptap/extension-link";
import CharacterCount from "@tiptap/extension-character-count";
import {
  OakTeacherNotesModal,
  OakTeacherNotesModalProps,
} from "@oaknational/oak-components";
import {
  TeacherNoteCamelCase,
  TeacherNote,
} from "@oaknational/oak-pupil-client";

const StyledEditorContent = styled(EditorContent)`
  .tiptap:focus {
    outline: none;
  }
  .tiptap a {
    color: #0078d4;
    text-decoration: underline;
  }
`;

export const isAllowedUri = (
  url: string,
  ctx: {
    defaultValidate: (url: string) => boolean;
    protocols: Array<LinkProtocolOptions | string>;
    defaultProtocol: string;
  },
) => {
  try {
    // construct URL
    const parsedUrl = url.includes(":")
      ? new URL(url)
      : new URL(`${ctx.defaultProtocol}://${url}`);

    // use default validation
    if (!ctx.defaultValidate(parsedUrl.href)) {
      return false;
    }

    // disallowed protocols
    const disallowedProtocols = ["ftp", "file", "mailto"];
    const protocol = parsedUrl.protocol.replace(":", "");

    if (disallowedProtocols.includes(protocol)) {
      return false;
    }

    // only allow protocols specified in ctx.protocols
    const allowedProtocols = ctx.protocols.map((p) =>
      typeof p === "string" ? p : p.scheme,
    );

    if (!allowedProtocols.includes(protocol)) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

export const shouldAutoLink = (url: string) => {
  try {
    // construct URL
    if (url.includes(":")) {
      new URL(url);
    } else {
      new URL(`https://${url}`);
    }

    return true;
  } catch (error) {
    return false;
  }
};

const limit = 2000;
const saveProgressAfter = 50;

export type TeacherNotesModalProps = Pick<
  OakTeacherNotesModalProps,
  "isOpen" | "onClose"
> & {
  teacherNote?: TeacherNoteCamelCase | null;
  saveTeacherNote: (
    note: Partial<TeacherNoteCamelCase>,
  ) => Promise<TeacherNote>;
  shareActivated?: (noteLengthChars?: number) => void;
  sharingUrl: string | null;
  error: string | null;
};

export const TeacherNotesModal = ({
  onClose,
  isOpen,
  teacherNote,
  saveTeacherNote,
  shareActivated,
  sharingUrl,
  error,
}: TeacherNotesModalProps) => {
  const [noteSaved, setNoteSaved] = useState(false);
  const [noteShared, setNoteShared] = useState(false);
  const lastSavedAtRemaining = useRef(limit);
  const [remainingCharacters, setRemainingCharacters] = useState(limit);

  const editor = useEditor({
    editable: !error,
    extensions: [
      StarterKit,
      CharacterCount.configure({
        limit,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        isAllowedUri,
        shouldAutoLink,
      }),
    ],
    immediatelyRender: false,
    onCreate: ({ editor }) => {
      if (error) {
        editor.setEditable(false);
      }
      editor.commands.setContent(teacherNote?.noteHtml ?? "");
      const r = limit - (editor?.storage.characterCount.characters() ?? 0);
      setRemainingCharacters(r);
      lastSavedAtRemaining.current = r;
    },
    onUpdate: ({ editor }) => {
      const numChars = editor?.storage.characterCount.characters() ?? 0;
      const r = limit - numChars;
      setRemainingCharacters(r);
      const delta = Math.abs(lastSavedAtRemaining.current - r);
      if (delta > saveProgressAfter) {
        lastSavedAtRemaining.current = r;
        handleSave(true);
      }
    },
    onBlur: () => {
      handleSave(true);
      lastSavedAtRemaining.current = remainingCharacters;
    },
  });

  const editorNode = editor && (
    <StyledEditorContent
      editor={editor}
      style={{ flexDirection: "column", flex: 1 }}
    />
  );

  const handleBoldToggle = () => {
    editor?.chain().focus().toggleBold().run();
  };

  const handleBulletListToggle = () => {
    editor?.chain().focus().toggleBulletList().run();
  };

  const handleSave = async (displayFeedback: boolean) => {
    if (error || !editor) {
      return;
    }

    const noteHtml = editor.getHTML() ?? "";
    const noteText = editor.getText() ?? "";

    // don't save if there's no change or no note text
    if (teacherNote?.noteHtml === noteHtml || noteText.length === 0) {
      return;
    }

    const note: Partial<TeacherNoteCamelCase> = {
      ...teacherNote,
      noteHtml,
      noteText,
    };

    const res = await saveTeacherNote(note);

    if (res && displayFeedback) {
      setNoteSaved(true);
      setTimeout(() => {
        setNoteSaved(false);
      }, 3000);
    }
  };

  const handleShare = () => {
    handleSave(false);
    if (sharingUrl) {
      navigator.clipboard.writeText(sharingUrl);
    }

    if (shareActivated) {
      shareActivated(editor?.getText()?.length);
    }

    setNoteShared(true);
    setTimeout(() => {
      setNoteShared(false);
    }, 3000);
  };

  return (
    <OakTeacherNotesModal
      onClose={() => {
        handleSave(false);
        onClose();
      }}
      isOpen={isOpen}
      editorNode={editorNode}
      onBulletListClick={handleBulletListToggle}
      onBoldClick={handleBoldToggle}
      isBold={editor?.isActive("bold") ?? false}
      isBulletList={editor?.isActive("bulletList") ?? false}
      remainingCharacters={remainingCharacters}
      onShareClicked={handleShare}
      progressSaved={noteSaved && !noteShared}
      noteShared={noteShared}
      error={Boolean(error)}
    />
  );
};
