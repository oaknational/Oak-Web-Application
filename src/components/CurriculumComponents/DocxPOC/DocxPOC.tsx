import { patchDocument } from "@btitterington_org/docx";

import { download } from "./util";
import {
  subjectPatch,
  curriculumExplainerPatch,
  linkToNewUnitTablePatch,
  subjectPrinciplesListPatch,
  unitListTablePatch,
} from "./patches";
import POCForm, { POCFormData } from "./components/POCForm";

export default function DocxPOC() {
  const handlePOCFormSubmit = (formData: POCFormData, file: File) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      if (!event.target?.result) {
        return;
      }
      const fileContent = event.target.result as ArrayBuffer;
      const uint8Array = new Uint8Array(fileContent);

      patchDocument(uint8Array, {
        patches: {
          ...subjectPatch(formData),
          ...curriculumExplainerPatch(formData),
          ...linkToNewUnitTablePatch(formData),
          ...subjectPrinciplesListPatch(formData),
          ...unitListTablePatch(formData),
        },
      }).then((doc) => {
        download(doc, "generated_curriculum.docx");
      });
    };

    // Read the file as an ArrayBuffer (binary string)
    reader.readAsArrayBuffer(file);
  };

  return <POCForm onSubmit={handlePOCFormSubmit} />;
}
