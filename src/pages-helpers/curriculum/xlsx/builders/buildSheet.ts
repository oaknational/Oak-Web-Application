import { cartesianToExcelCoords, pxToColumnWidth } from "@ooxml-tools/units";

import { BuildNationalCurriculumData } from "..";
import { cdata, safeXml } from "../../docx/xml";
import { getFlatUnits } from "../helper";

import { buildGoToUnitResourceCell } from "./buildGoToUnitResourceCell";
import { buildTickCell } from "./buildTickCell";
import { buildNcCriteriaText } from "./buildNcCriteriaText";
import { buildUnitOptionCell } from "./buildUnitOptionCell";
import { buildUnitCell } from "./buildUnitCell";

export function buildSheet<T extends Record<string, string>>(
  cellStyleIndexMap: T,
  data: BuildNationalCurriculumData,
) {
  const unitXml: string[] = [];
  const linkXml: string[] = [];
  const goToUnitResourcesXml: string[] = [];
  const flatUnits = getFlatUnits(data.unitData.map((item) => item.unit));

  for (const unit of flatUnits) {
    linkXml.push(safeXml`
      <hyperlink
        ref="${cartesianToExcelCoords([linkXml.length + 2, 3])}"
        r:id="rId${1000 + linkXml.length}"
      />
    `);
    goToUnitResourcesXml.push(
      buildGoToUnitResourceCell(
        cellStyleIndexMap,
        goToUnitResourcesXml.length + 2,
        3,
      ),
    );
    unitXml.push(
      buildUnitCell(
        cellStyleIndexMap,
        unitXml.length + 2,
        2,
        unit,
        unit.unitIndex,
        unit.subjectCategory?.title,
      ),
    );

    for (const [unitOptionIndex, unitOption] of unit.unit_options.entries()) {
      linkXml.push(safeXml`
        <hyperlink
          ref="${cartesianToExcelCoords([linkXml.length + 2, 3])}"
          r:id="rId${1000 + linkXml.length}"
        />
      `);
      goToUnitResourcesXml.push(
        buildGoToUnitResourceCell(
          cellStyleIndexMap,
          goToUnitResourcesXml.length + 2,
          3,
        ),
      );
      unitXml.push(
        buildUnitOptionCell(
          cellStyleIndexMap,
          unitXml.length + 2,
          2,
          unitOption,
          unitOptionIndex,
        ),
      );
    }
  }

  return safeXml`
    <worksheet
      xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
      xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
      xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
      mc:Ignorable="x14ac xr xr2 xr3"
      xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"
      xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision"
      xmlns:xr2="http://schemas.microsoft.com/office/spreadsheetml/2015/revision2"
      xmlns:xr3="http://schemas.microsoft.com/office/spreadsheetml/2016/revision3"
      xr:uid="{BBB25A11-9FE4-904C-97A9-5616457FC1B3}"
    >
      <dimension ref="A1" />
      <sheetViews>
        <sheetView tabSelected="1" workbookViewId="0">
          <pane
            xSplit="1"
            ySplit="3"
            topLeftCell="B4"
            activePane="bottomLeft"
            state="frozen"
          />
          <selection pane="bottomLeft" activeCell="A1" sqref="A1" />
        </sheetView>
      </sheetViews>
      <sheetFormatPr
        baseColWidth="10"
        defaultRowHeight="16"
        x14ac:dyDescent="0.2"
      />
      <cols>
        <col
          min="1"
          max="2"
          width="${pxToColumnWidth(285, 7)}"
          customWidth="1"
        />
        <col
          min="2"
          max="${unitXml.length + 1}"
          width="${pxToColumnWidth(185, 7)}"
          customWidth="1"
        />
      </cols>
      <sheetData>
        <row r="1" spans="1:${unitXml.length + 1}">
          <c
            r="${cartesianToExcelCoords([1, 1])}"
            t="inlineStr"
            s="${cellStyleIndexMap.temp1!}"
          >
            <is>
              <t>
                ${cdata(
                  `Year ${data.unitData[0]?.unit.year ?? ""} ${data.unitData[0]!.unit.subject}`,
                )}
              </t>
            </is>
          </c>
        </row>
        <row r="2" spans="1:${unitXml.length + 1}">
          <c r="A2" t="inlineStr" s="${cellStyleIndexMap.temp2!}">
            <is>
              <t xml:space="preserve">${cdata(
                  `\nNational curriculum statement\n`,
                )}</t>
            </is>
          </c>
          ${unitXml}
        </row>
        <row r="3" spans="1:${unitXml.length + 1}">
          <c
            r="${cartesianToExcelCoords([1, 3])}"
            t="inlineStr"
            s="${cellStyleIndexMap.temp2!}"
          >
            <is>
              <t />
            </is>
          </c>
          ${goToUnitResourcesXml}
        </row>
        ${[...data.nationalCurric.entries()].map(
          ([id, nationalCurricText], nationalCurricTextIndex) => {
            const yPos = 4 + nationalCurricTextIndex;
            const tickXml: string[] = [];

            for (const unit of flatUnits) {
              const hasNcCriteria = !!unit.national_curriculum_content?.find(
                (item) => item.id === id,
              );
              tickXml.push(
                buildTickCell(
                  cellStyleIndexMap,
                  hasNcCriteria,
                  tickXml.length + 2,
                  yPos,
                ),
              );

              unit.unit_options.forEach(() => {
                tickXml.push(
                  buildTickCell(
                    cellStyleIndexMap,
                    hasNcCriteria,
                    tickXml.length + 2,
                    yPos,
                  ),
                );
              });
            }

            return safeXml`
              <row r="${yPos}" spans="1:${tickXml.length + 1}">
                ${buildNcCriteriaText(
                  cellStyleIndexMap,
                  nationalCurricText,
                  1,
                  yPos,
                )}
                ${tickXml}
              </row>
            `;
          },
        )}
      </sheetData>
      <hyperlinks>${linkXml}</hyperlinks>
      <pageMargins
        left="0.7"
        right="0.7"
        top="0.75"
        bottom="0.75"
        header="0.3"
        footer="0.3"
      />
    </worksheet>
  `.trim();
}
