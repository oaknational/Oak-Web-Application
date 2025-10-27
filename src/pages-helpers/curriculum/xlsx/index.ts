import { safeXml } from "@ooxml-tools/xml";

import { generateEmptyXlsx, JSZipCached } from "../docx/docx";
import {
  CurriculumUnitsFormattedData,
  formatCurriculumUnitsData,
} from "../docx/tab-helpers";
import { Slugs } from "../docx";

import { buildStyles } from "./builders/buildStyles";
import { addOrUpdateSheet, generateSheetTitle } from "./helper";
import { buildSheet } from "./builders/buildSheet";
import { buildWorkbook } from "./builders/buildWorkbook";

import {
  CurriculumOverviewMVData,
  CurriculumUnitsTabData,
} from "@/node-lib/curriculum-api-2023";
import { CombinedCurriculumData } from "@/utils/curriculum/types";

export type FormattedData = CurriculumUnitsFormattedData<
  CombinedCurriculumData["units"][number]
>;

async function buildNationalCurriculum(
  zip: JSZipCached,
  slugs: Slugs,
  formattedData: CurriculumUnitsFormattedData,
) {
  const { styleXml, cellStyleIndexMap } = buildStyles();
  zip.writeString("xl/styles.xml", styleXml);

  const yearOptions = formattedData.yearOptions.filter((year) => {
    const units = formattedData.yearData[year]!.units;

    const shouldRenderSheet = units.every((unit) => {
      return unit.features.national_curriculum_content;
    });
    return shouldRenderSheet;
  });

  yearOptions.forEach((year, index) => {
    const units = formattedData.yearData[year]!.units;
    const linksXml = [];
    for (const unit of units) {
      linksXml.push(safeXml`
        <Relationship
          Id="rId${1000 + linksXml.length}"
          Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink"
          Target="https://www.thenational.academy/teachers/curriculum/${unit.subject_slug}-${unit.phase_slug}/units/${unit.slug}"
          TargetMode="External"
        />
      `);

      for (const unitOption of unit.unit_options) {
        linksXml.push(safeXml`
          <Relationship
            Id="rId${1000 + linksXml.length}"
            Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink"
            Target="https://www.thenational.academy/teachers/curriculum/${unit.subject_slug}-${unit.phase_slug}/units/${unitOption.slug!}"
            TargetMode="External"
          />
        `);
      }
    }

    zip.writeString(
      `xl/worksheets/_rels/sheet${10 + index}.xml.rels`,
      safeXml`
        <?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
        <Relationships
          xmlns="http://schemas.openxmlformats.org/package/2006/relationships"
        >
          ${linksXml}
        </Relationships>
      `.trim(),
    );
    addOrUpdateSheet(
      zip,
      10 + index,
      buildSheet(cellStyleIndexMap, formattedData, year, slugs),
    );
  });

  zip.writeString(
    "xl/_rels/workbook.xml.rels",
    safeXml`
      <?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
      <Relationships
        xmlns="http://schemas.openxmlformats.org/package/2006/relationships"
      >
        <Relationship
          Id="rId3"
          Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles"
          Target="styles.xml"
        />
        <Relationship
          Id="rId2"
          Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme"
          Target="theme/theme1.xml"
        />
        ${formattedData.yearOptions.map((_, index) => {
          return safeXml`
            <Relationship
              Id="rId${10 + index}"
              Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet"
              Target="worksheets/sheet${10 + index}.xml"
            />
          `;
        })}
      </Relationships>
    `.trim(),
  );

  zip.writeString(
    "xl/workbook.xml",
    buildWorkbook({
      sheets: yearOptions.map((year, index) => {
        return safeXml`
          <sheet
            name="${generateSheetTitle(formattedData, year)}"
            sheetId="${index + 1}"
            r:id="rId${10 + index}"
          />
        `;
      }),
    }),
  );
}

export default async function xlsxNationalCurriculum(
  data: CurriculumUnitsTabData & CurriculumOverviewMVData,
  slugs: Slugs,
) {
  const zip = await generateEmptyXlsx();
  const formattedData = formatCurriculumUnitsData(data);
  await buildNationalCurriculum(zip, slugs, formattedData);
  return await zip.zipToBuffer();
}
