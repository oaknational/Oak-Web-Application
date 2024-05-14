import { chunk } from "lodash";

import { CombinedCurriculumData } from "../../../pages/teachers/curriculum/docx-poc/[...slugs]";

import { createThreadOptions, threadUnitByYear } from "./util";

import { xmlElementToJson } from "@/components/CurriculumComponents/DocxPOC/patches/xml";

export function mainThreadsPatch(data: CombinedCurriculumData) {
  return async () => {
    const container = xmlElementToJson(`<w:sectPr />`);
    container.elements = createThreadOptions(data.units).map(
      (thread, threadIndex) => {
        const threadContainer = xmlElementToJson(`<w:sectPr />`);
        const threadInfo = threadUnitByYear(data.units, thread.slug);

        const rawXml = `
      <root>
        <w:p>
          <w:pPr>
              ${threadIndex > 0 && `<w:pageBreakBefore/>`}
              ${/*<w:pStyle w:val="Heading2"/>*/ ""}
              <w:rPr>
                  <w:color w:val="222222"/>
              </w:rPr>
          </w:pPr>
          <w:r>
              <w:rPr>
                  <w:rFonts w:ascii="Lexend Light" w:eastAsia="Lexend Light" w:hAnsi="Lexend Light" w:cs="Lexend Light"/>
                  <w:b w:val="0"/>
                  <w:color w:val="222222"/>
              </w:rPr>
              <w:t>Thread:</w:t>
          </w:r>
          <w:r>
              <w:rPr>
                  <w:color w:val="222222"/>
              </w:rPr>
              <w:t xml:space="preserve"> ${thread.title}</w:t>
          </w:r>
        </w:p>
        <w:tbl>
            <w:tblPr>
                <w:tblStyle w:val="TableGrid"/>
                <w:tblW w:w="0" w:type="auto"/>
                <w:tblBorders>
                    <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                    <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                    <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                    <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                    <w:insideH w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                    <w:insideV w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                </w:tblBorders>
                <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
            </w:tblPr>
            <w:tblGrid>
                <w:gridCol w:w="5240"/>
                <w:gridCol w:w="5241"/>
            </w:tblGrid>
            ${chunk(Object.entries(threadInfo), 2)
              .map((rowUnits) => {
                return `
                <w:tr>
                  ${rowUnits
                    .map(([year, threadUnits]) => {
                      return `
                      <w:tc>
                        <w:tcPr>
                            <w:tcW w:w="5240" w:type="dxa"/>
                        </w:tcPr>
                        <w:p w14:paraId="5E38E0C5" w14:textId="77777777" w:rsidR="00CC26C2" w:rsidRDefault="00CC26C2" w:rsidP="00CC26C2">
                          <w:pPr>
                              <w:pStyle w:val="Heading3"/>
                              <w:widowControl w:val="0"/>
                          </w:pPr>
                          <w:r>
                              <w:t>Year ${year}</w:t>
                          </w:r>
                        </w:p>
                        ${threadUnits
                          .map(({ unit }) => {
                            return `
                            <w:p w14:paraId="4713D6A2" w14:textId="77777777" w:rsidR="00CC26C2" w:rsidRDefault="00CC26C2" w:rsidP="00CC26C2">
                              <w:pPr>
                                  <w:numPr>
                                      <w:ilvl w:val="0"/>
                                      <w:numId w:val="4"/>
                                  </w:numPr>
                                  <w:ind w:left="425"/>
                                  <w:rPr>
                                      <w:color w:val="222222"/>
                                  </w:rPr>
                              </w:pPr>
                              <w:r>
                                  <w:rPr>
                                      <w:color w:val="222222"/>
                                  </w:rPr>
                                  <w:t>UNIT ${unit.order}: ${unit.title}</w:t>
                              </w:r>
                            </w:p>
                          `;
                          })
                          .join("")}
                      </w:tc>
                    `;
                    })
                    .join("")}
                </w:tr>
              `;
              })
              .join("")}
        </w:tbl>
      </root>`;
        threadContainer.elements = xmlElementToJson(rawXml).elements;
        return threadContainer;
      },
    );
    return container;
  };
}
