import { groupBy } from "lodash";
import type { Element } from "xml-js";

import { xmlElementToJson } from "../../xml";
import { CombinedCurriculumData } from "..";

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

type Slug = { childSubject?: string; tier?: string };

function buildYear(
  year: string,
  unitListData: CombinedCurriculumData["units"],
  index: number,
  slug: Slug,
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

  const subjectTierTitle = [slug.childSubject, slug.tier]
    .filter(Boolean)
    .join("/");

  const xml = `
    <w:sectPr>
      <w:p>
        <w:pPr>
            ${index > 0 && `<w:pageBreakBefore/>`}
        </w:pPr>
        <w:r>
            <w:rPr>
                <w:color w:val="222222"/>
                <w:sz w:val="44"/>
                <w:szCs w:val="44"/>
                <w:rFonts w:ascii="Lexend SemiBold" w:cs="Lexend SemiBold" w:eastAsia="Lexend SemiBold" w:hAnsi="Lexend SemiBold"/>
            </w:rPr>
            <w:t xml:space="preserve">Year ${year} units - ${subjectTierTitle}</w:t>
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
  return xmlElementToJson(xml);
}

export default async function buildUnitsTable(
  slug: Slug,
  unitsDataList: CombinedCurriculumData["units"],
) {
  const unitsData = groupBy(unitsDataList, "year");
  const sections = Object.entries(unitsData).map(([key, val], index) => {
    return buildYear(key, val, index, slug);
  });

  sections.push(
    xmlElementToJson(`
      <w:p>
        <w:pPr>
          <w:pageBreakBefore />
        </w:pPr>
      </w:p>
    `),
  );

  return sections;
}

export function unitsTablePatch(
  slug: Slug,
  units: CombinedCurriculumData["units"],
) {
  return async (): Promise<Element> => {
    return {
      type: "element",
      name: "$FRAGMENT$",
      elements: await buildUnitsTable(slug, units),
    };
  };
}
