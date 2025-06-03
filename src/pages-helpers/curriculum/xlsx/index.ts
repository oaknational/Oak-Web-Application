import { cartesianToExcelCoords } from "@ooxml-tools/units";

import { generateEmptyXlsx, JSZipCached } from "../docx/docx";
import { cdata, safeXml } from "../docx/xml";
import { formatCurriculumUnitsData } from "../docx/tab-helpers";

import { Output } from "@/pages/api/curriculum-national-curriculum";
import { Unit } from "@/utils/curriculum/types";

export type Slugs = {
  subjectSlug: string;
  phaseSlug?: string;
  ks4OptionSlug?: string;
  keyStageSlug?: string;
  tierSlug?: string;
  childSubjectSlug?: string;
};

//200,242,194

function addOrUpdateSheet(zip: JSZipCached, sheetNumber: number, xml: string) {
  zip.writeString(
    `xl/worksheets/sheet${sheetNumber}.xml`,
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>${xml}`,
  );
}

function buildStyle() {
  return safeXml`
    <?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
    <styleSheet
      xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
      xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
      mc:Ignorable="x14ac x16r2 xr"
      xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"
      xmlns:x16r2="http://schemas.microsoft.com/office/spreadsheetml/2015/02/main"
      xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision"
    >
      <fonts count="1" x14ac:knownFonts="1">
        <font>
          <sz val="12" />
          <color theme="1" />
          <name val="Arial" />
          <family val="2" />
          <scheme val="minor" />
        </font>
        <font>
          <sz val="22" />
          <color rgb="FFFFFFFF" />
          <name val="Arial" />
          <family val="2" />
          <scheme val="minor" />
        </font>
        <font>
          <sz val="24" />
          <color rgb="FF000000" />
          <name val="Arial" />
          <family val="2" />
          <scheme val="minor" />
        </font>
        <font>
          <sz val="14" />
          <color rgb="FF000000" />
          <name val="Arial" />
          <family val="2" />
          <scheme val="minor" />
        </font>
      </fonts>
      <fills count="3">
        <fill>
          <patternFill patternType="none" />
        </fill>
        <fill>
          <patternFill patternType="gray125" />
        </fill>
        <fill>
          <patternFill patternType="solid">
            <fgColor rgb="FFF2F2F2" />
            <bgColor rgb="FFC6EFCE" />
          </patternFill>
        </fill>
        <fill>
          <patternFill patternType="solid">
            <fgColor rgb="FFC8F2C2" />
            <bgColor rgb="FFC6EFCE" />
          </patternFill>
        </fill>
        <fill>
          <patternFill patternType="solid">
            <fgColor rgb="FFEBFCEB" />
            <bgColor rgb="FFC6EFCE" />
          </patternFill>
        </fill>
        <fill>
          <patternFill patternType="solid">
            <fgColor rgb="FF000000" />
            <bgColor rgb="FFFFFFFF" />
          </patternFill>
        </fill>
      </fills>
      <borders count="1">
        <border>
          <left />
          <right />
          <top />
          <bottom />
          <diagonal />
        </border>
      </borders>
      <cellStyleXfs count="1">
        <xf numFmtId="0" fontId="0" fillId="0" borderId="0" />
      </cellStyleXfs>
      <cellXfs count="1">
        <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" />
        <xf numFmtId="0" fontId="2" fillId="2" borderId="0" xfId="0">
          <alignment wrapText="1" />
        </xf>
        <xf numFmtId="0" fontId="3" fillId="3" borderId="0" xfId="0">
          <alignment wrapText="1" />
        </xf>
        <xf numFmtId="0" fontId="3" fillId="3" borderId="0" xfId="0">
          <alignment wrapText="1" />
        </xf>
        <xf numFmtId="0" fontId="0" fillId="4" borderId="0" xfId="0">
          <alignment wrapText="1" />
        </xf>
        <xf numFmtId="0" fontId="1" fillId="5" borderId="0" xfId="0">
          <alignment wrapText="1" />
        </xf>
      </cellXfs>
      <cellStyles count="1">
        <cellStyle name="Normal" xfId="0" builtinId="0" />
      </cellStyles>
      <dxfs count="0" />
      <tableStyles
        count="0"
        defaultTableStyle="TableStyleMedium2"
        defaultPivotStyle="PivotStyleLight16"
      />
      <extLst>
        <ext
          uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}"
          xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main"
        >
          <x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1" />
        </ext>
        <ext
          uri="{9260A510-F301-46a8-8635-F512D64BE5F5}"
          xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"
        >
          <x15:timelineStyles defaultTimelineStyle="TimeSlicerStyleLight1" />
        </ext>
      </extLst>
    </styleSheet>
  `;
}

function buildNatCurric(data: BuildNationalCurriculumData) {
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
        <sheetView tabSelected="1" workbookViewId="0" />
      </sheetViews>
      <sheetFormatPr
        baseColWidth="10"
        defaultRowHeight="16"
        x14ac:dyDescent="0.2"
      />
      <cols>
        <col min="1" max="2" width="34" customWidth="1" />
        <col
          min="2"
          max="${data.unitData.length + 1}"
          width="26"
          customWidth="1"
        />
      </cols>
      <sheetData>
        <row r="1" spans="1:26">
          <c r="A1" t="inlineStr" s="1">
            <is>
              <t>Year ${data.unitData[0]?.unit.year ?? ""}</t>
            </is>
          </c>
        </row>
        <row r="2" spans="1:26">
          <c r="A2" t="inlineStr" s="2">
            <is>
              <t>National curriculum criteria</t>
            </is>
          </c>
          ${data.unitData.map((unit, unitIndex) => {
            return safeXml`
              <c
                r="${cartesianToExcelCoords([unitIndex + 2, 2])}"
                t="inlineStr"
                s="3"
              >
                <is>
                  <t>Unit ${unitIndex + 1}: ${cdata(unit.unit.title)}</t>
                </is>
              </c>
            `;
          })}
        </row>
        ${[...data.nationalCurric.entries()].map(
          ([id, nationalCurricText], nationalCurricTextIndex) => {
            const yPos = 3 + nationalCurricTextIndex;
            return safeXml`
              <row r="${yPos}" spans="1:${data.unitData.length + 1}">
                <c r="${cartesianToExcelCoords([1, yPos])}" t="inlineStr" s="4">
                  <is>
                    <t>${cdata(nationalCurricText)}</t>
                  </is>
                </c>
                ${data.unitData.map((unit, unitIndex) => {
                  return safeXml`
                    <c
                      r="${cartesianToExcelCoords([unitIndex + 2, yPos])}"
                      t="inlineStr"
                      s="5"
                    >
                      <is>
                        <t>
                          ${cdata(
                            unit.nationalCurricIds.includes(id) ? "✓" : "",
                          )}
                        </t>
                      </is>
                    </c>
                  `;
                })}
              </row>
            `;
          },
        )}
      </sheetData>
      <pageMargins
        left="0.7"
        right="0.7"
        top="0.75"
        bottom="0.75"
        header="0.3"
        footer="0.3"
      />
    </worksheet>
  `;
}

type BuildNationalCurriculumData = {
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
  data.forEach((item, index) => {
    addOrUpdateSheet(zip, 10 + index, buildNatCurric(item));
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
    `,
  );

  zip.writeString("xl/styles.xml", buildStyle());

  zip.writeString(
    "xl/workbook.xml",
    safeXml`
      <?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
      <workbook
        xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
        xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        mc:Ignorable="x15 xr xr6 xr10 xr2"
        xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"
        xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision"
        xmlns:xr6="http://schemas.microsoft.com/office/spreadsheetml/2016/revision6"
        xmlns:xr10="http://schemas.microsoft.com/office/spreadsheetml/2016/revision10"
        xmlns:xr2="http://schemas.microsoft.com/office/spreadsheetml/2015/revision2"
      >
        <fileVersion
          appName="xl"
          lastEdited="7"
          lowestEdited="7"
          rupBuild="10511"
        />
        <workbookPr defaultThemeVersion="202300" />
        <mc:AlternateContent
          xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        >
          <mc:Choice Requires="x15">
            <x15ac:absPath
              url="/Users/orangemug/Documents/"
              xmlns:x15ac="http://schemas.microsoft.com/office/spreadsheetml/2010/11/ac"
            />
          </mc:Choice>
        </mc:AlternateContent>
        <xr:revisionPtr
          revIDLastSave="0"
          documentId="8_{274615AA-ECE0-644D-AB2E-12D373184771}"
          xr6:coauthVersionLast="47"
          xr6:coauthVersionMax="47"
          xr10:uidLastSave="{00000000-0000-0000-0000-000000000000}"
        />
        <bookViews>
          <workbookView
            xWindow="1100"
            yWindow="820"
            windowWidth="28040"
            windowHeight="17440"
            xr2:uid="{C98B37CC-FD85-FE4F-984F-54449C3C0043}"
          />
        </bookViews>
        <sheets>
          ${data.map((item, index) => {
            return safeXml`
              <sheet
                name="Year ${item.year}"
                sheetId="${index + 1}"
                r:id="rId${10 + index}"
              />
            `;
          })}
        </sheets>
        <calcPr calcId="181029" />
        <extLst>
          <ext
            uri="{140A7094-0E35-4892-8432-C4D2E57EDEB5}"
            xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"
          >
            <x15:workbookPr chartTrackingRefBase="1" />
          </ext>
          <ext
            uri="{B58B0392-4F1F-4190-BB64-5DF3571DCE5F}"
            xmlns:xcalcf="http://schemas.microsoft.com/office/spreadsheetml/2018/calcfeatures"
          >
            <xcalcf:calcFeatures>
              <xcalcf:feature name="microsoft.com:RD" />
              <xcalcf:feature name="microsoft.com:Single" />
              <xcalcf:feature name="microsoft.com:FV" />
              <xcalcf:feature name="microsoft.com:CNMTM" />
              <xcalcf:feature name="microsoft.com:LET_WF" />
              <xcalcf:feature name="microsoft.com:LAMBDA_WF" />
              <xcalcf:feature name="microsoft.com:ARRAYTEXT_WF" />
            </xcalcf:calcFeatures>
          </ext>
        </extLst>
      </workbook>
    `,
  );
}

export default async function xlsxNationalCurriculum(
  data: Output,
  // slugs: Slugs,
  // ks4Options: Ks4Option[],
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
