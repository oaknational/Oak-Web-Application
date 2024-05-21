import { groupBy } from "lodash";
import type { Element } from "xml-js";

import { xmlElementToJson } from "../../xml";
import { checkWithinElement } from "../../docx";
import { CombinedCurriculumData } from "..";

import { textIncludes } from "./util";

function buildYearColumn({ index, title }: { title: string; index: number }) {
  return `
    <w:tc>
      <w:tcPr>
          <w:tcW w:type="pct" w:w="33.333333333333336%"/>
          <w:tcBorders>
              <w:top w:val="single" w:color="F5E9F2" w:sz="48"/>
              <w:left w:val="single" w:color="F5E9F2" w:sz="48"/>
              <w:bottom w:val="single" w:color="F5E9F2" w:sz="48"/>
              <w:right w:val="single" w:color="F5E9F2" w:sz="48"/>
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
                  <w:sz w:val="44"/>
                  <w:szCs w:val="44"/>
                  <w:b/>
                  <w:rFonts w:ascii="Lexend" w:cs="Lexend" w:eastAsia="Lexend" w:hAnsi="Lexend"/>
              </w:rPr>
              <w:t xml:space="preserve">${index}</w:t>
          </w:r>
      </w:p>
      <w:p>
          <w:r>
              <w:rPr>
                  <w:color w:val="222222"/>
                  <w:sz w:val="28"/>
                  <w:szCs w:val="28"/>
                  <w:rFonts w:ascii="Lexend SemiBold" w:cs="Lexend SemiBold" w:eastAsia="Lexend SemiBold" w:hAnsi="Lexend SemiBold"/>
              </w:rPr>
              <w:t xml:space="preserve">${title}</w:t>
          </w:r>
      </w:p>
    </w:tc>
  `;
}

function buildYearRow(children: string) {
  return `
    <w:tr>
      <w:trPr>
        <w:cantSplit/>
      </w:trPr>
      ${children}
    </w:tr>
  `;
}

function buildYear(
  year: string,
  unitListData: CombinedCurriculumData["units"],
  index: number,
) {
  const rows = [];
  const units = unitListData;
  for (let i = 0; i < units.length; i += 3) {
    rows.push(
      buildYearRow(
        units
          .slice(i, i + 3)
          .map((unit, j) => {
            const index = i + j + 1;
            return buildYearColumn({ index: index, title: unit.title });
          })
          .join(""),
      ),
    );
  }

  const xml = `
    <w:sectPr>
      <w:p>
        <w:pPr>
            ${index > 0 && `<w:pageBreakBefore/>`}
            <w:sz w:val="44"/>
            <w:szCs w:val="44"/>
        </w:pPr>
        <w:r>
            <w:rPr>
                <w:color w:val="222222"/>
                <w:sz w:val="56"/>
                <w:szCs w:val="56"/>
                <w:b/>
                <w:rFonts w:ascii="Lexend" w:cs="Lexend" w:eastAsia="Lexend" w:hAnsi="Lexend"/>
            </w:rPr>
            <w:t xml:space="preserve">Year ${year} units</w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:pPr>
            <w:rPr>
                <w:sz w:val="28"/>
                <w:szCs w:val="28"/>
            </w:rPr>
        </w:pPr>
        <w:r>
            <w:rPr>
                <w:rFonts w:ascii="Lexend" w:eastAsia="Lexend" w:hAnsi="Lexend" w:cs="Lexend"/>
                <w:b/>
                <w:sz w:val="28"/>
                <w:szCs w:val="28"/>
                <w:u w:val="single"/>
            </w:rPr>
            <w:t>View interactive sequence online</w:t>
        </w:r>
        <w:r>
                <w:rPr>
                    <w:noProof/>
                </w:rPr>
                <w:drawing>
                    <wp:anchor distT="114300" distB="114300" distL="114300" distR="114300" simplePos="0" relativeHeight="251691008" behindDoc="0" locked="0" layoutInCell="1" hidden="0" allowOverlap="1" wp14:anchorId="485FEB59" wp14:editId="5459E64E">
                        <wp:simplePos x="0" y="0"/>
                        <wp:positionH relativeFrom="column">
                            <wp:posOffset>2976500</wp:posOffset>
                        </wp:positionH>
                        <wp:positionV relativeFrom="paragraph">
                            <wp:posOffset>-28575</wp:posOffset>
                        </wp:positionV>
                        <wp:extent cx="275852" cy="275852"/>
                        <wp:effectExtent l="0" t="0" r="0" b="0"/>
                        <wp:wrapNone/>
                        <wp:docPr id="50" name="image8.png" descr="Open link"/>
                        <wp:cNvGraphicFramePr/>
                        <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
                            <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                                <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                                    <pic:nvPicPr>
                                        <pic:cNvPr id="50" name="image8.png" descr="Open link"/>
                                        <pic:cNvPicPr preferRelativeResize="0"/>
                                    </pic:nvPicPr>
                                    <pic:blipFill>
                                        <a:blip r:embed="rId30"/>
                                        <a:srcRect/>
                                        <a:stretch>
                                            <a:fillRect/>
                                        </a:stretch>
                                    </pic:blipFill>
                                    <pic:spPr>
                                        <a:xfrm>
                                            <a:off x="0" y="0"/>
                                            <a:ext cx="275852" cy="275852"/>
                                        </a:xfrm>
                                        <a:prstGeom prst="rect">
                                            <a:avLst/>
                                        </a:prstGeom>
                                        <a:ln/>
                                    </pic:spPr>
                                </pic:pic>
                            </a:graphicData>
                        </a:graphic>
                    </wp:anchor>
                </w:drawing>
            </w:r>
      </w:p>
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
            <w:gridCol w:w="3505"/>
            <w:gridCol w:w="3505"/>
        </w:tblGrid>
        ${rows.join("")}
      </w:tbl>
    </w:sectPr>
  `;
  return xml;
}

export default function buildUnitsTable(
  unitsDataList: CombinedCurriculumData["units"],
) {
  const unitsData = groupBy(unitsDataList, "year");
  const sections = Object.entries(unitsData).map(([key, val], index) => {
    return buildYear(key, val, index);
  });

  return sections.join("");
}

export function unitsTablePatch(
  combinedCurriculumData: CombinedCurriculumData,
) {
  return async (el: Element) => {
    if (
      el.type === "element" &&
      el.name === "w:p" &&
      checkWithinElement(
        el,
        (el: Element) =>
          el.type === "text" && textIncludes(el.text, "{{=UNITS_TABLE}}"),
      )
    ) {
      const out = xmlElementToJson(`<w:sectPr>
        ${buildUnitsTable(combinedCurriculumData.units)}
      </w:sectPr>`);
      return out;
    }
    return el;
  };
}
