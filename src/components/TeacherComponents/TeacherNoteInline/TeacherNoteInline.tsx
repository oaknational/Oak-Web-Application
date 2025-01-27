import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import {
  OakFlex,
  OakHeading,
  OakTeacherNotesInline,
} from "@oaknational/oak-components";

export type TeacherNoteInlineProps = {
  unsafeHtml?: string;
  error?: string | null;
};

export const TeacherNoteInline = ({
  unsafeHtml,
  error,
}: TeacherNoteInlineProps) => {
  const [safeHtml, setSafeHtml] = useState(() => {
    return unsafeHtml ? DOMPurify.sanitize(unsafeHtml) : null;
  });

  useEffect(() => {
    if (!unsafeHtml) {
      setSafeHtml(null);
      return;
    }
    setSafeHtml(DOMPurify.sanitize(unsafeHtml));
  }, [unsafeHtml]);

  if (safeHtml === null || error) {
    return null;
  }

  return (
    <OakFlex
      $gap="space-between-m"
      $flexDirection={"column"}
      $pb={"inner-padding-xl4"}
    >
      <OakHeading $font={["heading-5", "heading-4"]} tag={"h2"}>
        Teacher Note
      </OakHeading>
      <OakTeacherNotesInline sanitizedHtml={safeHtml} />
    </OakFlex>
  );
};
