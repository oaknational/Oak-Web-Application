import type { Element } from "xml-js";

import { cdata, xmlElementToJson } from "../../xml";
import { checkWithinElement } from "../../docx";
import { CombinedCurriculumData } from "..";

import { hyperlinkBlock, textIncludes } from "./util";

function getYears(data: CombinedCurriculumData) {
  const years = new Set<number>();
  for (const unit of data.units) {
    years.add(Number(unit.year));
  }
  return Array.from(years).sort((a, b) => a - b);
}

function buildToc(data: CombinedCurriculumData) {
  const years = getYears(data);
  const items: { id: string; text: string; anchor?: string }[] = [
    // {id: "1", text: "Our curriculum"},
    // {id: "1", text: "Threads"},
    // {id: "1", text: `${data.subjectTitle} curriculum overview`},
    ...years.map((year) => {
      return {
        id: `year_${year}`,
        text: `Year ${year}`,
        anchor: `year_${year}`,
      };
    }),
    { id: "1", text: "Threads appendix", anchor: "threads" },
  ];

  const xml = `
    <root>
      <w:p>
          <w:r>
              <w:rPr>
                  <w:sz w:val="56" />
                  <w:rFonts w:ascii="Lexend Bold" w:eastAsia="Lexend Bold" w:hAnsi="Lexend Bold" w:cs="Lexend Bold"/>
                  <w:color w:val="222222"/>
              </w:rPr>
              <w:t xml:space="preserve">Contents</w:t>
          </w:r>
      </w:p>
      <w:p>
      </w:p>
      <w:p>
      </w:p>
      ${items
        .map((item) => {
          return `
          <w:p>
              ${hyperlinkBlock(
                item.anchor,
                `
                <w:r>
                  <w:rPr>
                      <w:sz w:val="32" />
                      <w:rFonts w:ascii="Lexend Bold" w:eastAsia="Lexend Bold" w:hAnsi="Lexend Bold" w:cs="Lexend Bold"/>
                      <w:color w:val="222222"/>
                  </w:rPr>
                  <w:t xml:space="preserve">${cdata(item.text)}</w:t>
                </w:r>
              `,
              )}
          </w:p>
        `;
        })
        .join("")}
      <w:p>
        <w:pPr>
          <w:pageBreakBefore/>
        </w:pPr>
      </w:p>
    </root>
  `;

  return {
    type: "element",
    name: "$FRAGMENT$",
    elements: xmlElementToJson(xml).elements,
  };
}

export function tableOfContentsPatch(data: CombinedCurriculumData) {
  return async (el: Element) => {
    if (
      el.type === "element" &&
      el.name === "w:p" &&
      checkWithinElement(
        el,
        (el: Element) =>
          el.type === "text" && textIncludes(el.text, "{{=TABLE_OF_CONTENTS}}"),
      )
    ) {
      return buildToc(data);
    }
    return el;
  };
}
