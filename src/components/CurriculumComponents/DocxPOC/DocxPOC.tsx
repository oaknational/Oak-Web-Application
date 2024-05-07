import { patchDocument } from "@btitterington_org/docx";
import { Element } from "xml-js";

import { download } from "./util";
import {
  subjectPatch,
  curriculumExplainerPatch,
  linkToNewUnitTablePatch,
  subjectPrinciplesListPatch,
  buildUnitsTable,
} from "./patches";
import POCForm, { POCFormData } from "./components/POCForm";
import { STUB_UNITS_DATA } from "./patches/stubData";
import { docToJson, findAnyReplaceByName } from "./docx";

export default function DocxPOC() {
  const onGenerateDemoFile = (
    type: "unit_table",
    formData: POCFormData,
    file: File,
  ) => {
    if (type !== "unit_table") {
      return;
    }
    const reader = new FileReader();

    reader.onload = async function (event) {
      if (!event.target?.result) {
        return;
      }
      const fileContent = event.target.result as ArrayBuffer;
      const uint8Array = new Uint8Array(fileContent);

      const docPass1 = await docToJson(
        uint8Array,
        "w:document",
        async (doc) => {
          return await findAnyReplaceByName(doc, "w:body", async (el) => {
            return {
              ...el,
              elements: [
                ...(await buildUnitsTable(STUB_UNITS_DATA)),
                ...(el.elements ?? []),
              ],
            } as Element;
          });
        },
      );

      const docPass2 = await docToJson(docPass1, "w:styles", async (doc) => {
        return await findAnyReplaceByName(doc, "w:docDefaults", async () => {
          return {
            type: "element",
            name: "w:style",
            elements: [
              {
                type: "element",
                name: "w:name",
                attributes: {
                  "w:val": "DEFAULT_STYLES",
                },
              },
              // FIXME: We should not be nuking the default styles here...
              // ...el.elements,
            ],
          };
        });
      });

      download(docPass2, "generated_curriculum.docx");
    };

    // Read the file as an ArrayBuffer (binary string)
    reader.readAsArrayBuffer(file);
  };

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
        },
      }).then((doc) => {
        download(doc, "generated_curriculum.docx");
      });
    };

    // Read the file as an ArrayBuffer (binary string)
    reader.readAsArrayBuffer(file);
  };

  return (
    <POCForm
      onSubmit={handlePOCFormSubmit}
      onGenerateDemoFile={onGenerateDemoFile}
    />
  );
}
