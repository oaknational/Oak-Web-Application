import { compact, safeXml } from "@ooxml-tools/xml";

import { generateEmptyXlsx, JSZipCached } from "../docx/docx";
import {
  CurriculumUnitsFormattedData,
  formatCurriculumUnitsData,
} from "../docx/tab-helpers";

import { buildStyle } from "./builders/buildStyles";
import { addOrUpdateSheet } from "./helper";
import { buildSheet } from "./builders/buildSheet";
import { buildWorkbook } from "./builders/buildWorkbook";

import {
  CurriculumOverviewMVData,
  CurriculumUnitsTabData,
} from "@/node-lib/curriculum-api-2023";
import { CombinedCurriculumData, Unit } from "@/utils/curriculum/types";

export type FormattedData = CurriculumUnitsFormattedData<
  CombinedCurriculumData["units"][number]
>;

export type BuildNationalCurriculumData = {
  year: string;
  nationalCurric: Map<number, string>;
  unitData: {
    unit: Unit;
    nationalCurricIds: number[];
  }[];
};
async function buildNationalCurriculum(
  zip: JSZipCached,
  data: BuildNationalCurriculumData[],
) {
  const { styleXml, cellStyleIndexMap } = buildStyle();
  zip.writeString("xl/styles.xml", styleXml);

  const flatUnits = data.flatMap((bar) => bar.unitData.map((foo) => foo.unit));

  data.forEach((item, index) => {
    const linksXml = [];
    for (const unit of flatUnits) {
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
      compact(buildSheet(cellStyleIndexMap, item)),
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
        ${data.map((_, index) => {
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
      sheets: data.map((item, index) => {
        return safeXml`
          <sheet
            name="Year ${item.year}"
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
) {
  const zip = await generateEmptyXlsx();

  const formattedData = formatCurriculumUnitsData(data);

  const obj = Object.entries(formattedData.yearData).map(
    ([year, { units }]) => {
      const nationalCurric = new Map<number, string>();

      const unitData = units.map((unit) => {
        const ids: number[] = [];
        unit.national_curriculum_content?.forEach((cc) => {
          nationalCurric.set(cc.id, cc.title);
          ids.push(cc.id);
        });

        return {
          unit,
          nationalCurricIds: ids,
        };
      });

      return {
        year,
        nationalCurric,
        unitData,
      };
    },
  );

  await buildNationalCurriculum(zip, obj);

  return await zip.zipToBuffer();
}
