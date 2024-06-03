import { cdata, xmlElementToJson } from "../../xml";
import { CombinedCurriculumData } from "..";

import { Unit } from "@/components/CurriculumComponents/CurriculumVisualiser";

function buildOptions({ unitOptions }: { unitOptions: Unit["unit_options"] }) {
  if (unitOptions.length > 0) {
    return `
      <w:p>
          <w:pPr>
              <w:spacing w:line="240" w:lineRule="auto"/>
          </w:pPr>
          <w:r>
          </w:r>
      </w:p>
      <w:p>
        <w:r>
            <w:rPr>
                <w:color w:val="222222"/>
                <w:shd w:fill="f6e8a0" w:val="clear"/>
                <w:rtl w:val="0"/>
            </w:rPr>
            <w:t xml:space="preserve">${cdata(
              unitOptions.length,
            )} option${cdata(unitOptions.length > 1 ? "s" : "")}</w:t>
        </w:r>
      </w:p>
    `;
  }
  return "";
}

function buildYearColumn({
  index,
  title,
  unitOptions,
}: {
  title: string;
  index: number;
  unitOptions: Unit["unit_options"];
}) {
  const columnIndex = index % 3;

  return `
    <w:tc>
      <w:tcPr>
          <w:tcW w:type="pct" w:w="33.333333333333336%"/>
          <w:shd w:val="pct" w:color="FFFF00" w:fill="F5E9F2"/>
          <w:tcBorders>
              <w:top w:val="single" w:color="FFFFFF" w:sz="48"/>
              ${
                columnIndex > 0
                  ? `<w:left w:val="single" w:color="FFFFFF" w:sz="48"/>`
                  : ""
              }
              <w:bottom w:val="single" w:color="FFFFFF" w:sz="48"/>
              ${
                columnIndex < 2
                  ? `<w:right w:val="single" w:color="FFFFFF" w:sz="48"/>`
                  : ""
              }
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
              <w:t xml:space="preserve">${cdata(index + 1)}</w:t>
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
              <w:t xml:space="preserve">${cdata(title)}</w:t>
          </w:r>
      </w:p>
      ${buildOptions({ unitOptions })}
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

type Slug = { childSubject?: string; tier?: string };

function removeDups(units: Unit[]) {
  const unitSlugLookup = new Set();
  return units.filter((unit) => {
    const key = unit.slug;
    if (!unitSlugLookup.has(key)) {
      unitSlugLookup.add(key);
      return true;
    }
    return false;
  });
}

function buildYear(
  year: string,
  unitsInput: CombinedCurriculumData["units"],
  slug: Slug,
  { isCycle2Review }: { isCycle2Review: boolean; noPrePageBreak: boolean },
) {
  const rows = [];
  const units = removeDups(unitsInput);
  for (let i = 0; i < units.length; i += 3) {
    rows.push(
      buildYearRow(
        units
          .slice(i, i + 3)
          .map((unit, j) => {
            const index = i + j;
            return buildYearColumn({
              index: index,
              title: unit.title,
              unitOptions: unit.unit_options,
            });
          })
          .join(""),
      ),
    );
  }

  let subjectTierTitleSuffix = "";
  if (slug.childSubject || slug.tier) {
    subjectTierTitleSuffix =
      "- " + [slug.childSubject, slug.tier].filter(Boolean).join("/");
  }

  const xml = `
      <w:p>
        <w:pPr>
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
            <w:t xml:space="preserve">${cdata(`Year ${year} units`)} ${cdata(
              subjectTierTitleSuffix,
            )}</w:t>
        </w:r>
      </w:p>
      ${
        isCycle2Review
          ? ""
          : `
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
                                        <a:blip r:embed="rId23"/>
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
      </w:p>`
      }
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
      <w:p>
        <w:r>
            <w:t xml:space="preserve"><![CDATA[ ]]></w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:pPr>
            <w:pageBreakBefore/>
        </w:pPr>
      </w:p>
  `;
  return xml;
}

export async function unitsTablePatch(
  year: string,
  slug: Slug,
  units: CombinedCurriculumData["units"],
  {
    isCycle2Review,
    noPrePageBreak,
  }: { isCycle2Review: boolean; noPrePageBreak: boolean },
) {
  const xml = buildYear(year, units, slug, { isCycle2Review, noPrePageBreak });

  return {
    type: "element",
    name: "$FRAGMENT$",
    elements: xmlElementToJson(`<root>${xml}</root>`).elements,
  };
}
