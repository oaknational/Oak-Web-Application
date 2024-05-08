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
import { elementContains, elementMapper, modifyXmlBySelector } from "./docx";
import { xmlElementToJson } from "./patches/xml";

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

      // Safe version of String#includes(...)
      const textIncludes = (str: unknown, matchText: string) => {
        if (typeof str === "string") {
          return str.includes(matchText);
        }
        return false;
      };

      const moddedFile = await modifyXmlBySelector(
        uint8Array,
        "w:document",
        async (doc) => {
          const newDoc = await elementMapper(
            doc,
            async (el: Element, parent?: Element) => {
              if (el.type === "text" && textIncludes(el.text, "{{SUBJECT}}")) {
                return {
                  type: "text",
                  text: "TODO",
                };
              }
              if (el.type === "text" && textIncludes(el.text, "{{TOC}}")) {
                return {
                  type: "text",
                  text: "TODO",
                };
              }
              if (
                el.type === "text" &&
                textIncludes(el.text, "{{SUBJECT_EXPLAINER}}")
              ) {
                return {
                  type: "text",
                  text: "TODO: Subject Explainer",
                };
              }
              if (
                el.type === "text" &&
                textIncludes(el.text, "{{PARTNER_DETAIL}}")
              ) {
                return {
                  type: "text",
                  text: "TODO: Partner detail",
                };
              }
              if (el.type === "text" && textIncludes(el.text, "{{YEAR}}")) {
                return {
                  type: "text",
                  text: "TODO",
                };
              }
              if (
                el.type === "text" &&
                textIncludes(el.text, "{{TRANSITION_YEAR}}")
              ) {
                return {
                  type: "text",
                  text: "TODO",
                };
              }
              if (
                el.type === "element" &&
                el.name === "w:p" &&
                elementContains(
                  el,
                  (el: Element) =>
                    el.type === "text" && el.text === "{{UNIT_TABLE}}",
                )
              ) {
                const out = xmlElementToJson(`<w:sectPr></w:sectPr>`);
                out.elements = await buildUnitsTable(STUB_UNITS_DATA);
              }
              if (
                parent?.name === "w:body" &&
                elementContains(
                  el,
                  (el: Element) =>
                    el.type === "text" &&
                    textIncludes(el.text, "{{END_DOCUMENT}}"),
                )
              ) {
                // This is here so we can hide assets after this marker in the document
                return;
              }
              if (
                el.type === "element" &&
                el.name === "w:p" &&
                elementContains(
                  el,
                  (el: Element) =>
                    el.type === "text" &&
                    textIncludes(el.text, "{{THREADS_TABLE}}"),
                )
              ) {
                return xmlElementToJson(`
                  <w:p>
                    <w:r>
                      <w:rPr>
                        <w:color w:val="222222"/>
                      </w:rPr>
                      <w:t xml:space="preserve">TODO:Threads</w:t>
                    </w:r>
                  </w:p>
                `);
              }
              if (
                el.type === "element" &&
                el.name === "w:p" &&
                elementContains(
                  el,
                  (el: Element) =>
                    el.type === "text" &&
                    textIncludes(el.text, "{{TRANSITION_TABLE}}"),
                )
              ) {
                return xmlElementToJson(`
                  <w:p>
                    <w:r>
                      <w:rPr>
                        <w:color w:val="222222"/>
                      </w:rPr>
                      <w:t xml:space="preserve">TODO:Transition table</w:t>
                    </w:r>
                  </w:p>
                `);
              }
              return el;
            },
          );

          if (!newDoc) {
            throw new Error("Invalid document!");
          }

          return newDoc;
        },
      );

      download(moddedFile, "generated_curriculum.docx");
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
