import type { Element } from "xml-js";

import { checkWithinElement } from "../../docx";
import { xmlElementToJson } from "../../xml";
import { CombinedCurriculumData } from "..";

import { createThreadOptions, textIncludes } from "./util";

function buildColumn(text: string) {
  return `
    <w:tc>
      <w:tcPr>
          <w:shd w:val="pct" w:color="FFFF00" w:fill="FEF7D0"/>
          <w:tcW w:type="pct" w:w="33.333333333333336%"/>
          <w:tcBorders>
              <w:top w:val="single" w:color="FFFFFF" w:sz="48"/>
              <w:left w:val="single" w:color="FFFFFF" w:sz="0"/>
              <w:bottom w:val="single" w:color="FFFFFF" w:sz="48"/>
              <w:right w:val="single" w:color="FFFFFF" w:sz="0"/>
          </w:tcBorders>
          <w:tcMar>
              <w:top w:type="dxa" w:w="226"/>
              <w:left w:type="dxa" w:w="226"/>
              <w:bottom w:type="dxa" w:w="226"/>
              <w:right w:type="dxa" w:w="226"/>
          </w:tcMar>
      </w:tcPr>
      <w:p>
          <w:pPr>
              <w:spacing w:line="240" w:lineRule="auto"/>
          </w:pPr>
          <w:r>
              <w:rPr>
                  <w:color w:val="222222"/>
                  <w:sz w:val="30"/>
                  <w:szCs w:val="30"/>
                  <w:rFonts w:ascii="Lexend SemiBold" w:cs="Lexend SemiBold" w:eastAsia="Lexend SemiBold" w:hAnsi="Lexend SemiBold"/>
              </w:rPr>
              <w:t xml:space="preserve">${text}</w:t>
          </w:r>
      </w:p>
    </w:tc>
    `;
}

function buildRow(children: string) {
  return `
      <w:tr>
        <w:trPr>
          <w:cantSplit/>
        </w:trPr>
        ${children}
      </w:tr>
    `;
}

export function threadsTablePatch(
  combinedCurriculumData: CombinedCurriculumData,
) {
  return async (el: Element) => {
    if (
      el.type === "element" &&
      el.name === "w:p" &&
      checkWithinElement(
        el,
        (el: Element) =>
          el.type === "text" && textIncludes(el.text, "{{=THREADS_TABLE}}"),
      )
    ) {
      const items = createThreadOptions(combinedCurriculumData.units);

      const rows = items.map((item) => {
        return buildRow(buildColumn(item.title));
      });

      return xmlElementToJson(`
        <w:sectPr>
            <w:p>
            <w:r>
                <w:rPr>
                    <w:color w:val="222222"/>
                    <w:sz w:val="44"/>
                    <w:szCs w:val="44"/>
                    <w:rFonts w:ascii="Lexend SemiBold" w:cs="Lexend SemiBold" w:eastAsia="Lexend SemiBold" w:hAnsi="Lexend SemiBold"/>
                </w:rPr>
                <w:t xml:space="preserve"> </w:t>
            </w:r>
            </w:p>
            <w:tbl>
                <w:tblPr>
                    <w:tblW w:type="pct" w:w="100%"/>
                    <w:tblBorders>
                        <w:top w:val="single" w:color="F5E9F2" w:sz="48"/>
                        <w:left w:val="single" w:color="F5E9F2" w:sz="48"/>
                        <w:bottom w:val="single" w:color="F5E9F2" w:sz="48"/>
                        <w:right w:val="single" w:color="F5E9F2" w:sz="48"/>
                        <w:insideH w:val="single" w:color="auto" w:sz="4"/>
                        <w:insideV w:val="single" w:color="auto" w:sz="4"/>
                    </w:tblBorders>
                </w:tblPr>
                <w:tblGrid>
                    <w:gridCol w:w="3505"/>
                </w:tblGrid>
                ${rows.join("")}
            </w:tbl>
        </w:sectPr>
        `);
    }
    return el;
  };
}
