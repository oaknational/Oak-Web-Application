import { useRef, useState } from "react";
import styled from "styled-components";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link, { LinkProtocolOptions } from "@tiptap/extension-link";
import CharacterCount from "@tiptap/extension-character-count";
import {
  OakFlex,
  OakIcon,
  OakSpan,
  OakTeacherNotesModal,
  OakTeacherNotesModalProps,
} from "@oaknational/oak-components";
import {
  TeacherNoteCamelCase,
  TeacherNote,
  TeacherNoteError,
} from "@oaknational/oak-pupil-client";

import theme from "@/styles/theme";
import DynamicHighlightExtension, {
  HighlightSegment,
} from "@/utils/tipTap/dynamicHighlightExtension";
import { resolveOakHref } from "@/common-lib/urls";

const StyledEditorContent = styled(EditorContent)`
  .tiptap:focus {
    outline: none;
  }
  .tiptap a {
    color: #0078d4;
    text-decoration: underline;
  }
  .pii-error-highlight {
    color: ${theme.colors.red};
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
  ) => Promise<TeacherNote | TeacherNoteError>;
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
  const [piiErrors, setPiiErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(true);

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
      DynamicHighlightExtension.configure({
        className: "pii-error-highlight",
        segments: [],
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
    setPiiErrors([]);
    setIsValidating(true);
    editor?.commands?.clearDynamicHighlights();
    if (error || !editor) {
      setIsValidating(false);
      return;
    }

    const noteHtml = editor.getHTML() ?? "";
    const noteText = editor.getText() ?? "";

    // don't save if there's no change or no note text
    if (teacherNote?.noteHtml === noteHtml || noteText.length === 0) {
      setIsValidating(false);
      return;
    }

    const note: Partial<TeacherNoteCamelCase> = {
      ...teacherNote,
      noteHtml,
      noteText,
    };

    const onSaveSuccess = (res: TeacherNote) => {
      if (res && displayFeedback) {
        editor?.commands?.clearDynamicHighlights();
        setNoteSaved(true);
        setTimeout(() => {
          setNoteSaved(false);
        }, 3000);
      }
    };

    const onSaveError = (err: TeacherNoteError) => {
      if (err.type === "PII_ERROR" && !!err.pii) {
        console.log("handle pii error", err);
        const uniqInfoTypes = err.pii.piiMatches
          .map((m) => m.infoType)
          .reduce(
            (acc: string[], curr: string) =>
              acc.includes(curr) ? acc : [...acc, curr],
            [],
          );
        setPiiErrors(uniqInfoTypes);
        console.log("pii errors", uniqInfoTypes, piiErrors);
        const segmentsToHighlight: HighlightSegment[] = err.pii.piiMatches.map(
          ({ startIndex, endIndex }) => ({
            startIndex,
            endIndex,
          }),
        );
        editor?.commands?.applyDynamicHighlights(segmentsToHighlight);
      }
    };

    const res = await saveTeacherNote(note);
    if ((res as TeacherNoteError)?.type) onSaveError(res as TeacherNoteError);
    else onSaveSuccess(res as TeacherNote);
    setIsValidating(false);
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

  const getPiiErrorMessage = () => {
    if (!piiErrors.length) return undefined;
    const msg = (err: string) => {
      switch (true) {
        case err === "PERSON_NAME":
          return "Please do not include names of individuals. This information will be redacted.";
        case err === "EMAIL_ADDRESS":
          return "Please do not include email addresses. This information will be redacted.";
        case err === "PHONE_NUMBER":
          return "Please do not include phone numbers. This information will be redacted.";
        case err === "STREET_ADDRESS":
          return "Please do not include addresses. This information will be redacted.";
      }
    };
    return (
      <OakFlex $flexDirection="column">
        {piiErrors.map((error) => (
          <OakFlex
            $alignItems="center"
            $gap="space-between-ssx"
            role="alert"
            key={error}
          >
            <OakIcon iconName="error" $colorFilter="icon-error" />
            <OakSpan $color="icon-error" $font="body-3-bold">
              {msg(error)}
            </OakSpan>
          </OakFlex>
        ))}
      </OakFlex>
    );
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
      termsAndConditionsHref={resolveOakHref({
        page: "legal",
        legalSlug: "terms-and-conditions",
      })}
      shareLinkDisabled={piiErrors.length > 0 || isValidating}
      footer={getPiiErrorMessage()}
    />
  );
};
