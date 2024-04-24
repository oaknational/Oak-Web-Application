import { PatchType } from "@btitterington_org/docx";

import { POCFormData } from "../components/POCForm";
import { subjectPrinciples } from "../templates/subjectPrinciples";

export const subjectPrinciplesListPatch = (curriculumData: POCFormData) => {
  return {
    SUBJECT_PRINCIPLES_LIST: {
      type: PatchType.JSON,
      children: subjectPrinciples(curriculumData.principles.split("\n")),
    },
  };
};
