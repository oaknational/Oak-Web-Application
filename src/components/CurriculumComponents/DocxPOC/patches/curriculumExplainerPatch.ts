import { TextRun, PatchType } from "@btitterington_org/docx";

import { POCFormData } from "../components/POCForm";

export const curriculumExplainerPatch = (curriculumData: POCFormData) => {
  return {
    CURRICULUM_EXPLAINER: {
      type: PatchType.PARAGRAPH,
      children: [new TextRun(curriculumData.curriculum_explainer)],
    },
  };
};
