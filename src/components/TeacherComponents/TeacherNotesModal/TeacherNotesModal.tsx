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
import { useEffect, useState } from "react";

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

export type TeacherNotesModalProps = Pick<
  OakTeacherNotesModalProps,
  "isOpen" | "onClose"
> & {
  teacherNote?: TeacherNoteCamelCase | null;
  saveTeacherNote: (
    note: Partial<TeacherNoteCamelCase>,
  ) => Promise<TeacherNote>;
};

export const TeacherNotesModal = ({
  onClose,
  isOpen,
  teacherNote,
  saveTeacherNote,
}: TeacherNotesModalProps) => {
  const [noteSaved, setNoteSaved] = useState(false);
  const [noteShared] = useState(false);

  const editor = useEditor({
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
  });

  useEffect(() => {
    if (teacherNote) {
      editor?.commands.setContent(teacherNote.noteHtml);
    }
  }, [teacherNote, editor]);

  const editorNode = (
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

  const handleSave = async () => {
    const noteHtml = editor?.getHTML() ?? "";
    const noteText = editor?.getText() ?? "";

    const note: Partial<TeacherNoteCamelCase> = {
      ...teacherNote,
      noteHtml,
      noteText,
    };

    const res = await saveTeacherNote(note);

    if (res) {
      setNoteSaved(true);
      setTimeout(() => {
        setNoteSaved(false);
      }, 3000);
    }
  };

  const remainingCharacters =
    limit - (editor?.storage.characterCount.characters() ?? 0);

  return (
    <OakTeacherNotesModal
      onClose={onClose}
      isOpen={isOpen}
      editorNode={editorNode}
      onBulletListClick={handleBulletListToggle}
      onBoldClick={handleBoldToggle}
      isBold={editor?.isActive("bold") ?? false}
      isBulletList={editor?.isActive("bulletList") ?? false}
      remainingCharacters={remainingCharacters}
      onSaveClicked={handleSave}
      onShareClicked={() => {}}
      noteSaved={noteSaved}
      noteShared={noteShared}
    />
  );
};
