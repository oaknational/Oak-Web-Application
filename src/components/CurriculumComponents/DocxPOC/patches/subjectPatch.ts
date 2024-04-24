import { TextRun, PatchType } from "@btitterington_org/docx";

import { POCFormData } from "../components/POCForm";

export const subjectPatch = (curriculumData: POCFormData) => {
  return {
    SUBJECT: {
      type: PatchType.PARAGRAPH,
      children: [new TextRun(curriculumData.subject)],
    },
  };
};
