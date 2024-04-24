import { TextRun, PatchType, InternalHyperlink } from "@btitterington_org/docx";

import { POCFormData } from "../components/POCForm";

export const linkToNewUnitTablePatch = (curriculumData: POCFormData) => {
  return {
    LINK_TO_NEW_UNIT_TABLE: {
      type: PatchType.PARAGRAPH,
      children: [
        new InternalHyperlink({
          children: [
            new TextRun({
              text: curriculumData.link_to_new_table,
              style: "Hyperlink",
            }),
          ],
          anchor: "unit_table_link",
        }),
      ],
    },
  };
};
