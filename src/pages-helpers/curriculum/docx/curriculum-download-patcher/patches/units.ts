import type { Element } from "xml-js";
import { uniqBy } from "lodash";

import { checkWithinElement } from "../../docx";
import { CombinedCurriculumData } from "..";
import { cdata, xmlElementToJson } from "../../xml";

import { notUndefined, textIncludes } from "./util";
import { unitsTablePatch } from "./unitsTable";

import {
  CurriculumUnitsFormattedData,
  formatCurriculumUnitsData,
} from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";

function generateGroupedUnits(combinedCurriculumData: CombinedCurriculumData) {
  const data = formatCurriculumUnitsData(
    combinedCurriculumData,
  ) as CurriculumUnitsFormattedData<CombinedCurriculumData["units"][number]>;
  const unitOptions = Object.entries(data.yearData).flatMap(
    ([year, { childSubjects, tiers, units, pathways }]) => {
      let options: {
        year: string;
        tier?: string;
        childSubject?: string;
        pathway?: string;
      }[] = [];

      options.push({
        year,
      });
      if (pathways.length > 0) {
        options = options.flatMap((option) => {
          return pathways.map((pathway) => {
            return {
              ...option,
              pathway: pathway.pathway_slug,
            };
          });
        });
      }
      if (childSubjects.length > 0) {
        options = options.flatMap((option) => {
          return childSubjects.map((childSubject) => {
            return {
              ...option,
              childSubject: childSubject.subject_slug,
            };
          });
        });
      }
      if (tiers.length > 0) {
        options = options.flatMap((option) => {
          return tiers.map((tier) => {
            return {
              ...option,
              tier: tier.tier_slug,
            };
          });
        });
      }

      return options.map((option) => {
        return {
          ...option,
          units: units.filter((unit) => {
            if (
              option.tier &&
              unit.tier_slug !== null &&
              unit.tier_slug !== option.tier
            ) {
              return false;
            }
            if (
              option.pathway &&
              unit.pathway_slug !== null &&
              unit.pathway_slug !== option.pathway
            ) {
              return false;
            }
            if (
              option.childSubject &&
              unit.subject_slug !== option.childSubject
            ) {
              return false;
            }
            return true;
          }),
        };
      });
    },
  );

  return unitOptions;
}

type Unit = CombinedCurriculumData["units"][number];

function buildUnitLessons(unit: Unit | Unit["unit_options"][number]) {
  const listRules = {
    // TODO: We should be using numbering here, but the numbered lists don't reset currently.
    numbering: `
          <w:ilvl w:val="0"/>
          <w:numId w:val="8"/>
        `,
    bullets: `
          <w:ilvl w:val="0"/>
          <w:numId w:val="3"/>
        `,
  };

  const lessonsXmls =
    unit.lessons?.map((lesson) => {
      return `
          <w:p>
              <w:pPr>
                  <w:numPr>
                    ${listRules.bullets}
                  </w:numPr>
                  <w:spacing w:line="240" w:lineRule="auto"/>
                  <w:ind w:left="425" w:right="-17"/>
              </w:pPr>
              <w:r>
                  <w:rPr>
                      <w:rFonts w:ascii="Lexend-Light" w:eastAsia="Lexend-Light" w:hAnsi="Lexend-Light" w:cs="Lexend-Light"/>
                      <w:color w:val="222222"/>
                  </w:rPr>
                  <w:t>${cdata(lesson.title)}</w:t>
              </w:r>
          </w:p>
        ` as Element;
    }) ?? [];

  return lessonsXmls.join("");
}

function buildUnitThreads(unit: Unit) {
  const threadsXmls =
    unit.threads.map((thread) => {
      return `
          <w:p>
              <w:pPr>
                <w:widowControl w:val="0"/>
                <w:numPr>
                    <w:ilvl w:val="0"/>
                    <w:numId w:val="3"/>
                </w:numPr>
                <w:spacing w:line="240" w:lineRule="auto"/>
                <w:ind w:left="425" w:right="0"/>
              </w:pPr>
              <w:r>
                  <w:rPr>
                      <w:rFonts w:ascii="Lexend-Light" w:eastAsia="Lexend-Light" w:hAnsi="Lexend-Light" w:cs="Lexend-Light"/>
                      <w:color w:val="222222"/>
                  </w:rPr>
                  <w:t>${cdata(thread.title)}</w:t>
              </w:r>
          </w:p>
        ` as Element;
    }) ?? [];
  return threadsXmls.join("");
}

function buildUnitOptionTitle(
  unitOption: CombinedCurriculumData["units"][number]["unit_options"][number],
  unitOptionIndex: number,
) {
  return `
        <w:p>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Lexend-Bold" w:eastAsia="Lexend-Bold" w:hAnsi="Lexend-Bold" w:cs="Lexend-Bold"/>
                    <w:color w:val="222222"/>
                    <w:sz w:val="32"/>
                </w:rPr>
                <w:t>Option ${cdata(unitOptionIndex + 1)}: ${cdata(
                  unitOption.title,
                )}</w:t>
            </w:r>

            <w:r>
                <w:drawing>
                    <wp:anchor distT="114300" distB="114300" distL="114300" distR="114300" simplePos="0" relativeHeight="251735040" behindDoc="1" locked="0" layoutInCell="1" hidden="0" allowOverlap="1" wp14:anchorId="63FFAED0" wp14:editId="008BED1E">
                        <wp:simplePos x="0" y="0"/>
                        <wp:positionH relativeFrom="column">
                            <wp:posOffset>0</wp:posOffset>
                        </wp:positionH>
                        <wp:positionV relativeFrom="paragraph">
                            <wp:posOffset>219075</wp:posOffset>
                        </wp:positionV>
                        <wp:extent cx="954964" cy="104140"/>
                        <wp:effectExtent b="0" l="0" r="0" t="0"/>
                        <wp:wrapNone/>
                        <wp:docPr id="47" name="image10.png" descr="A purple circle with black background&#xA;&#xA;Description automatically generated"/>
                        <wp:cNvGraphicFramePr/>
                        <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
                            <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                                <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                                    <pic:nvPicPr>
                                        <pic:cNvPr id="47" name="image10.png" descr="A purple circle with black background&#xA;&#xA;Description automatically generated"/>
                                        <pic:cNvPicPr preferRelativeResize="0"/>
                                    </pic:nvPicPr>
                                    <pic:blipFill>
                                        <a:blip r:embed="rId24"/>
                                        <a:srcRect/>
                                        <a:stretch>
                                            <a:fillRect/>
                                        </a:stretch>
                                    </pic:blipFill>
                                    <pic:spPr>
                                        <a:xfrm>
                                            <a:off x="0" y="0"/>
                                            <a:ext cx="1954964" cy="104140"/>
                                        </a:xfrm>
                                        <a:prstGeom prst="rect">
                                            <a:avLst/>
                                        </a:prstGeom>
                                        <a:ln/>
                                    </pic:spPr>
                                </pic:pic>
                            </a:graphicData>
                        </a:graphic>
                        <wp14:sizeRelH relativeFrom="margin">
                            <wp14:pctWidth>0</wp14:pctWidth>
                        </wp14:sizeRelH>
                        <wp14:sizeRelV relativeFrom="margin">
                            <wp14:pctHeight>0</wp14:pctHeight>
                        </wp14:sizeRelV>
                    </wp:anchor>
                </w:drawing>
            </w:r>

        </w:p>
        <w:p>
            <w:r>
                <w:t></w:t>
            </w:r>
        </w:p>
        <w:p>
            <w:r>
                <w:t></w:t>
            </w:r>
        </w:p>
    `;
}

function buildUnit(
  unit: Unit,
  unitIndex: number,
  unitOption?: Unit["unit_options"][number] | null,
  unitOptionIndex?: number,
) {
  const unitOptionIfAvailable = unitOption ?? unit;
  const unitNumber = unitIndex + 1;
  const description = unitOptionIfAvailable.description
    ? unitOptionIfAvailable.description
    : "-";
  const whyThisWhyNow = unitOptionIfAvailable.why_this_why_now
    ? unitOptionIfAvailable.why_this_why_now
    : "-";
  const lessons = buildUnitLessons(unitOptionIfAvailable);
  const threads = buildUnitThreads(unit);

  const xml = `
        <root>
            <w:tbl>
                <w:tblPr>
                    <w:tblStyle w:val="TableGrid"/>
                    <w:tblpPr w:leftFromText="181" w:rightFromText="181" w:vertAnchor="page" w:horzAnchor="margin" w:tblpY="568"/>
                    <w:tblW w:w="10481" w:type="dxa"/>
                    <w:tblBorders>
                        <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                        <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                        <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                        <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                        <w:insideH w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                        <w:insideV w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                    </w:tblBorders>
                    <w:tblLayout w:type="fixed"/>
                    <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
                </w:tblPr>
                <w:tblGrid>
                    <w:gridCol w:w="1092"/>
                    <w:gridCol w:w="9389"/>
                </w:tblGrid>
                <w:tr>
                    <w:tc>
                        <w:tcPr>
                            <w:tcW w:w="1092" w:type="dxa"/>
                        </w:tcPr>
                        <w:p>
                            <w:pPr>
                                <w:jc w:val="center"/>
                                <w:rPr>
                                    <w:rFonts w:ascii="Lexend-Bold" w:eastAsia="Lexend-Bold" w:hAnsi="Lexend-Bold" w:cs="Lexend-Bold"/>
                                    <w:color w:val="222222"/>
                                </w:rPr>
                            </w:pPr>
                            <w:r>
                                <w:rPr>
                                    <w:noProof/>
                                    <w:color w:val="222222"/>
                                </w:rPr>
                                <w:lastRenderedPageBreak/>
                                <w:drawing>
                                    <wp:anchor distT="114300" distB="114300" distL="114300" distR="114300" simplePos="0" relativeHeight="251735040" behindDoc="1" locked="0" layoutInCell="1" hidden="0" allowOverlap="1" wp14:anchorId="63FFAED0" wp14:editId="008BED1E">
                                        <wp:simplePos x="0" y="0"/>
                                        <wp:positionH relativeFrom="column">
                                            <wp:posOffset>-46990</wp:posOffset>
                                        </wp:positionH>
                                        <wp:positionV relativeFrom="paragraph">
                                            <wp:posOffset>32385</wp:posOffset>
                                        </wp:positionV>
                                        <wp:extent cx="630000" cy="630000"/>
                                        <wp:effectExtent l="0" t="0" r="5080" b="5080"/>
                                        <wp:wrapNone/>
                                        <wp:docPr id="47" name="image10.png" descr="A purple circle with black background&#xA;&#xA;Description automatically generated"/>
                                        <wp:cNvGraphicFramePr/>
                                        <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
                                            <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                                                <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                                                    <pic:nvPicPr>
                                                        <pic:cNvPr id="47" name="image10.png" descr="A purple circle with black background&#xA;&#xA;Description automatically generated"/>
                                                        <pic:cNvPicPr preferRelativeResize="0"/>
                                                    </pic:nvPicPr>
                                                    <pic:blipFill>
                                                        <a:blip r:embed="rId25"/>
                                                        <a:srcRect/>
                                                        <a:stretch>
                                                            <a:fillRect/>
                                                        </a:stretch>
                                                    </pic:blipFill>
                                                    <pic:spPr>
                                                        <a:xfrm>
                                                            <a:off x="0" y="0"/>
                                                            <a:ext cx="630000" cy="630000"/>
                                                        </a:xfrm>
                                                        <a:prstGeom prst="rect">
                                                            <a:avLst/>
                                                        </a:prstGeom>
                                                        <a:ln/>
                                                    </pic:spPr>
                                                </pic:pic>
                                            </a:graphicData>
                                        </a:graphic>
                                        <wp14:sizeRelH relativeFrom="margin">
                                            <wp14:pctWidth>0</wp14:pctWidth>
                                        </wp14:sizeRelH>
                                        <wp14:sizeRelV relativeFrom="margin">
                                            <wp14:pctHeight>0</wp14:pctHeight>
                                        </wp14:sizeRelV>
                                    </wp:anchor>
                                </w:drawing>
                            </w:r>
                        </w:p>
                        <w:p>
                            <w:pPr>
                                <w:jc w:val="center"/>
                            </w:pPr>
                            <w:r>
                                <w:rPr>
                                    <w:rFonts w:ascii="Lexend-Bold" w:eastAsia="Lexend-Bold" w:hAnsi="Lexend-Bold" w:cs="Lexend-Bold"/>
                                    <w:color w:val="222222"/>
                                    <w:sz w:val="36"/>
                                    <w:szCs w:val="36"/>
                                </w:rPr>
                                <w:t>${cdata(unitNumber)}</w:t>
                            </w:r>
                            <w:r>
                                <w:rPr>
                                    <w:noProof/>
                                    <w:color w:val="222222"/>
                                </w:rPr>
                                <w:t xml:space="preserve"> </w:t>
                            </w:r>
                        </w:p>
                    </w:tc>
                    <w:tc>
                        <w:tcPr>
                            <w:tcW w:w="9389" w:type="dxa"/>
                        </w:tcPr>
                        <w:p>
                            <w:r>
                                <w:rPr>
                                    <w:rFonts w:ascii="Lexend-Bold" w:eastAsia="Lexend-Bold" w:hAnsi="Lexend-Bold" w:cs="Lexend-Bold"/>
                                    <w:color w:val="222222"/>
                                </w:rPr>
                                <w:t>Year ${cdata(unit.year)}</w:t>
                            </w:r>
                        </w:p>
                        <w:p>
                            <w:r>
                                <w:rPr>
                                    <w:rFonts w:ascii="Lexend-Bold" w:eastAsia="Lexend-Bold" w:hAnsi="Lexend-Bold" w:cs="Lexend-Bold"/>
                                    <w:color w:val="222222"/>
                                    <w:sz w:val="36"/>
                                    <w:szCs w:val="36"/>
                                </w:rPr>
                                <w:t>${cdata(unit.title)}</w:t>
                            </w:r>
                        </w:p>
                    </w:tc>
                </w:tr>
            </w:tbl>
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
                    <w:gridCol w:w="10481"/>
                </w:tblGrid>
                <w:tr>
                    <w:trPr>
                        <w:trHeight w:val="787"/>
                    </w:trPr>
                    <w:tc>
                        <w:tcPr>
                            <w:tcW w:w="10481" w:type="dxa"/>
                        </w:tcPr>
                        <w:p>
                            <w:r>
                                <w:rPr>
                                    <w:rFonts w:ascii="Lexend-Bold" w:eastAsia="Lexend-Bold" w:hAnsi="Lexend-Bold" w:cs="Lexend-Bold"/>
                                    <w:color w:val="222222"/>
                                    <w:sz w:val="36"/>
                                    <w:szCs w:val="36"/>
                                </w:rPr>
                                <w:t xml:space="preserve"> </w:t>
                            </w:r>
                        </w:p>
                    </w:tc>
                </w:tr>
            </w:tbl>
            <w:p>
                <w:pPr>
                    <w:rPr>
                        <w:rFonts w:ascii="Lexend-Bold" w:eastAsia="Lexend-Bold" w:hAnsi="Lexend-Bold" w:cs="Lexend-Bold"/>
                        <w:color w:val="222222"/>
                        <w:sz w:val="36"/>
                        <w:szCs w:val="36"/>
                    </w:rPr>
                </w:pPr>
                <w:r>
                    <w:rPr>
                        <w:noProof/>
                        <w:color w:val="222222"/>
                    </w:rPr>
                    <mc:AlternateContent>
                        <mc:Choice Requires="wps">
                            <w:drawing>
                                <wp:anchor distT="114300" distB="114300" distL="114300" distR="114300" simplePos="0" relativeHeight="251732992" behindDoc="1" locked="0" layoutInCell="1" hidden="0" allowOverlap="1" wp14:anchorId="3DDDBE16" wp14:editId="3C1FC2FA">
                                    <wp:simplePos x="0" y="0"/>
                                    <wp:positionH relativeFrom="page">
                                        <wp:posOffset>14990</wp:posOffset>
                                    </wp:positionH>
                                    <wp:positionV relativeFrom="page">
                                        <wp:posOffset>-464695</wp:posOffset>
                                    </wp:positionV>
                                    <wp:extent cx="7549200" cy="1768839"/>
                                    <wp:effectExtent l="0" t="0" r="0" b="0"/>
                                    <wp:wrapNone/>
                                    <wp:docPr id="10" name="Rectangle 10"/>
                                    <wp:cNvGraphicFramePr/>
                                    <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
                                        <a:graphicData uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                                            <wps:wsp>
                                                <wps:cNvSpPr/>
                                                <wps:spPr>
                                                    <a:xfrm>
                                                        <a:off x="0" y="0"/>
                                                        <a:ext cx="7549200" cy="1768839"/>
                                                    </a:xfrm>
                                                    <a:prstGeom prst="rect">
                                                        <a:avLst/>
                                                    </a:prstGeom>
                                                    <a:solidFill>
                                                        <a:srgbClr val="EFEFEF"/>
                                                    </a:solidFill>
                                                    <a:ln>
                                                        <a:noFill/>
                                                    </a:ln>
                                                </wps:spPr>
                                                <wps:txbx>
                                                    <w:txbxContent>
                                                        <w:p w14:paraId="2AE5D6A0" w14:textId="77777777" w:rsidR="009F6245" w:rsidRDefault="009F6245" w:rsidP="009F6245">
                                                            <w:pPr>
                                                                <w:spacing w:line="240" w:lineRule="auto"/>
                                                                <w:jc w:val="center"/>
                                                                <w:textDirection w:val="btLr"/>
                                                            </w:pPr>
                                                        </w:p>
                                                    </w:txbxContent>
                                                </wps:txbx>
                                                <wps:bodyPr spcFirstLastPara="1" wrap="square" lIns="91425" tIns="91425" rIns="91425" bIns="91425" anchor="ctr" anchorCtr="0">
                                                    <a:noAutofit/>
                                                </wps:bodyPr>
                                            </wps:wsp>
                                        </a:graphicData>
                                    </a:graphic>
                                    <wp14:sizeRelH relativeFrom="margin">
                                        <wp14:pctWidth>0</wp14:pctWidth>
                                    </wp14:sizeRelH>
                                    <wp14:sizeRelV relativeFrom="margin">
                                        <wp14:pctHeight>0</wp14:pctHeight>
                                    </wp14:sizeRelV>
                                </wp:anchor>
                            </w:drawing>
                        </mc:Choice>
                        <mc:Fallback>
                            <w:pict>
                                <v:rect w14:anchorId="3DDDBE16" id="Rectangle 10" o:spid="_x0000_s1028" style="position:absolute;margin-left:1.2pt;margin-top:-36.6pt;width:594.45pt;height:139.3pt;z-index:-251583488;visibility:visible;mso-wrap-style:square;mso-width-percent:0;mso-height-percent:0;mso-wrap-distance-left:9pt;mso-wrap-distance-top:9pt;mso-wrap-distance-right:9pt;mso-wrap-distance-bottom:9pt;mso-position-horizontal:absolute;mso-position-horizontal-relative:page;mso-position-vertical:absolute;mso-position-vertical-relative:page;mso-width-percent:0;mso-height-percent:0;mso-width-relative:margin;mso-height-relative:margin;v-text-anchor:middle" o:gfxdata="UEsDBBQABgAIAAAAIQC2gziS/gAAAOEBAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbJSRQU7DMBBF&#xD;&#xA;90jcwfIWJU67QAgl6YK0S0CoHGBkTxKLZGx5TGhvj5O2G0SRWNoz/78nu9wcxkFMGNg6quQqL6RA&#xD;&#xA;0s5Y6ir5vt9lD1JwBDIwOMJKHpHlpr69KfdHjyxSmriSfYz+USnWPY7AufNIadK6MEJMx9ApD/oD&#xD;&#xA;OlTrorhX2lFEilmcO2RdNtjC5xDF9pCuTyYBB5bi6bQ4syoJ3g9WQ0ymaiLzg5KdCXlKLjvcW893&#xD;&#xA;SUOqXwnz5DrgnHtJTxOsQfEKIT7DmDSUCaxw7Rqn8787ZsmRM9e2VmPeBN4uqYvTtW7jvijg9N/y&#xD;&#xA;JsXecLq0q+WD6m8AAAD//wMAUEsDBBQABgAIAAAAIQA4/SH/1gAAAJQBAAALAAAAX3JlbHMvLnJl&#xD;&#xA;bHOkkMFqwzAMhu+DvYPRfXGawxijTi+j0GvpHsDYimMaW0Yy2fr2M4PBMnrbUb/Q94l/f/hMi1qR&#xD;&#xA;JVI2sOt6UJgd+ZiDgffL8ekFlFSbvV0oo4EbChzGx4f9GRdb25HMsYhqlCwG5lrLq9biZkxWOiqY&#xD;&#xA;22YiTra2kYMu1l1tQD30/bPm3wwYN0x18gb45AdQl1tp5j/sFB2T0FQ7R0nTNEV3j6o9feQzro1i&#xD;&#xA;OWA14Fm+Q8a1a8+Bvu/d/dMb2JY5uiPbhG/ktn4cqGU/er3pcvwCAAD//wMAUEsDBBQABgAIAAAA&#xD;&#xA;IQBLLDKnxQEAAIEDAAAOAAAAZHJzL2Uyb0RvYy54bWysU9uK2zAQfS/0H4TeG8fpXhITZym7TSks&#xD;&#xA;bWC3HyDLUiyQJXVGiZ2/70hJk7T7VopB1hmNjs+cGS8fxt6yvQI03tW8nEw5U0761rhtzX+8rj/M&#xD;&#xA;OcMoXCusd6rmB4X8YfX+3XIIlZr5zttWASMSh9UQat7FGKqiQNmpXuDEB+XoUHvoRSQI26IFMRB7&#xD;&#xA;b4vZdHpXDB7aAF4qRIo+HQ/5KvNrrWT8rjWqyGzNSVvMK+S1SWuxWopqCyJ0Rp5kiH9Q0Qvj6KNn&#xD;&#xA;qicRBduBeUPVGwkevY4T6fvCa22kyjVQNeX0r2peOhFUroXMwXC2Cf8frfy2fwkbIBuGgBXSNlUx&#xD;&#xA;aujTm/SxMZt1OJulxsgkBe9vbxbUAc4knZX3d/P5x0Wys7hcD4Dxi/I9S5uaA3UjmyT2zxiPqb9T&#xD;&#xA;0tfQW9OujbUZwLZ5tMD2gjr3eZ2eE/sfadalZOfTtSNjihSXYtIujs3ITFvzWaJIkca3hw0wDHJt&#xD;&#xA;SNuzwLgRQJ0vORtoGmqOP3cCFGf2qyO7F+XN7JbG5xrANWiugXCy8zRkMgJnR/AY89AdxX7aRa9N&#xD;&#xA;duAi5qSa+pw9PM1kGqRrnLMuf87qFwAAAP//AwBQSwMEFAAGAAgAAAAhAP8Id43iAAAADwEAAA8A&#xD;&#xA;AABkcnMvZG93bnJldi54bWxMj8FuwjAQRO+V+g/WIvUGTkJa3BAHVUU9U0I/wMRLEhHbkW0g7dd3&#xD;&#xA;ObWXlVZvdnam3ExmYFf0oXdWQrpIgKFtnO5tK+Hr8DEXwEJUVqvBWZTwjQE21eNDqQrtbnaP1zq2&#xD;&#xA;jExsKJSELsax4Dw0HRoVFm5ES+zkvFGRVt9y7dWNzM3AsyR54Ub1lj50asT3DptzfTESPncTD8Lv&#xD;&#xA;Ttt8X3tciZ8gxEHKp9m0XdN4WwOLOMW/C7h3oPxQUbCju1gd2CAhy0koYb5aZsDuPH1Nl8CORJLn&#xD;&#xA;HHhV8v89ql8AAAD//wMAUEsBAi0AFAAGAAgAAAAhALaDOJL+AAAA4QEAABMAAAAAAAAAAAAAAAAA&#xD;&#xA;AAAAAFtDb250ZW50X1R5cGVzXS54bWxQSwECLQAUAAYACAAAACEAOP0h/9YAAACUAQAACwAAAAAA&#xD;&#xA;AAAAAAAAAAAvAQAAX3JlbHMvLnJlbHNQSwECLQAUAAYACAAAACEASywyp8UBAACBAwAADgAAAAAA&#xD;&#xA;AAAAAAAAAAAuAgAAZHJzL2Uyb0RvYy54bWxQSwECLQAUAAYACAAAACEA/wh3jeIAAAAPAQAADwAA&#xD;&#xA;AAAAAAAAAAAAAAAfBAAAZHJzL2Rvd25yZXYueG1sUEsFBgAAAAAEAAQA8wAAAC4FAAAAAA==&#xD;&#xA;" fillcolor="#efefef" stroked="f">
                                    <v:textbox inset="2.53958mm,2.53958mm,2.53958mm,2.53958mm">
                                        <w:txbxContent>
                                            <w:p w14:paraId="2AE5D6A0" w14:textId="77777777" w:rsidR="009F6245" w:rsidRDefault="009F6245" w:rsidP="009F6245">
                                                <w:pPr>
                                                    <w:spacing w:line="240" w:lineRule="auto"/>
                                                    <w:jc w:val="center"/>
                                                    <w:textDirection w:val="btLr"/>
                                                </w:pPr>
                                            </w:p>
                                        </w:txbxContent>
                                    </v:textbox>
                                    <w10:wrap anchorx="page" anchory="page"/>
                                </v:rect>
                            </w:pict>
                        </mc:Fallback>
                    </mc:AlternateContent>
                </w:r>
            </w:p>
            ${
              unitOption && unitOptionIndex !== undefined
                ? buildUnitOptionTitle(unitOption, unitOptionIndex)
                : ""
            }
            <w:p>
                <w:pPr>
                    <w:sectPr>
                        <w:pgSz w:w="11909" w:h="16834"/>
                        <w:pgMar w:top="567" w:right="709" w:bottom="709" w:left="709" w:header="720" w:footer="720" w:gutter="0"/>
                        <w:cols w:space="720"/>
                    </w:sectPr>
                </w:pPr>
            </w:p>
            <w:p>
                <w:r>
                    <w:rPr>
                        <w:rFonts w:ascii="Lexend-Bold" w:eastAsia="Lexend-Bold" w:hAnsi="Lexend-Bold" w:cs="Lexend-Bold"/>
                    </w:rPr>
                    <w:t>Threads</w:t>
                </w:r>
            </w:p>
            ${threads}
            <w:p>
                <w:pPr>
                    <w:ind w:left="30" w:hanging="30"/>
                    <w:rPr>
                        <w:color w:val="222222"/>
                    </w:rPr>
                </w:pPr>
            </w:p>
            <w:p>
                <w:r>
                    <w:rPr>
                        <w:rFonts w:ascii="Lexend-Bold" w:eastAsia="Lexend-Bold" w:hAnsi="Lexend-Bold" w:cs="Lexend-Bold"/>
                    </w:rPr>
                    <w:t>Unit description</w:t>
                </w:r>
            </w:p>
            <w:p>
                <w:bookmarkStart w:id="13" w:name="_wf3kyqlrau0x" w:colFirst="0" w:colLast="0"/>
                <w:bookmarkEnd w:id="13"/>
                <w:r>
                    <w:rPr>
                        <w:rFonts w:ascii="Lexend-Light" w:hAnsi="Lexend-Light"/>
                        <w:b w:val="0"/>
                    </w:rPr>
                    <w:t>${cdata(description)}</w:t>
                </w:r>
            </w:p>
            <w:p>
                <w:pPr>
                </w:pPr>
            </w:p>
            <w:p>
                <w:r>
                    <w:rPr>
                        <w:rFonts w:ascii="Lexend-Bold" w:eastAsia="Lexend-Bold" w:hAnsi="Lexend-Bold" w:cs="Lexend-Bold"/>
                    </w:rPr>
                    <w:t>Why this, why now?</w:t>
                </w:r>
            </w:p>
            <w:p>
                <w:pPr>
                    <w:ind w:left="30" w:hanging="30"/>
                </w:pPr>
                <w:bookmarkStart w:id="14" w:name="_dt40g52dsciy" w:colFirst="0" w:colLast="0"/>
                <w:bookmarkEnd w:id="14"/>
                <w:r>
                    <w:rPr>
                        <w:color w:val="222222"/>
                        <w:rFonts w:ascii="Lexend-Light" w:eastAsia="Lexend-Light" w:hAnsi="Lexend-Light" w:cs="Lexend-Light"/>
                    </w:rPr>
                    <w:t>${cdata(whyThisWhyNow)}</w:t>
                </w:r>
            </w:p>
            <w:p>
                <w:bookmarkStart w:id="15" w:name="_96kd3c8qkmgf" w:colFirst="0" w:colLast="0"/>
                <w:bookmarkEnd w:id="15"/>
                <w:r>
                    <w:br w:type="column"/>
                </w:r>
                <w:r>
                    <w:rPr>
                        <w:rFonts w:ascii="Lexend-Bold" w:eastAsia="Lexend-Bold" w:hAnsi="Lexend-Bold" w:cs="Lexend-Bold"/>
                    </w:rPr>
                    <w:t>Lessons in unit</w:t>
                </w:r>
            </w:p>
            ${lessons}
            <w:p>
                <w:pPr>
                    <w:ind w:right="-1032"/>
                    <w:sectPr>
                        <w:type w:val="continuous"/>
                        <w:pgSz w:w="11909" w:h="16834"/>
                        <w:pgMar w:top="567" w:right="709" w:bottom="709" w:left="709" w:header="720" w:footer="720" w:gutter="0"/>
                        <w:cols w:num="2" w:space="720"/>
                    </w:sectPr>
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

async function buildUnits(
  combinedCurriculumData: CombinedCurriculumData,
  isCycle2Review: boolean,
) {
  const groupedUnits = generateGroupedUnits(combinedCurriculumData);
  const promises = groupedUnits.map(
    async ({ units, year, childSubject, tier, pathway }, index) => {
      // HACK: this should be in a function higher in the stack somewhere, we need to rewrite that logic anyway.
      const unitUnitsBySlug = uniqBy(units, "slug");

      const table = await unitsTablePatch(
        year,
        { childSubject, tier, pathway },
        unitUnitsBySlug,
        {
          isCycle2Review: isCycle2Review,
          noPrePageBreak: index === 0,
        },
      );

      const unitsEls = await Promise.all(
        unitUnitsBySlug.flatMap((unit, unitIndex) => {
          if (unit.unit_options.length > 0) {
            return unit.unit_options.map((unitOption, unitOptionIndex) => {
              return buildUnit(unit, unitIndex, unitOption, unitOptionIndex);
            });
          } else {
            return buildUnit(unit, unitIndex);
          }
        }),
      );

      return {
        type: "element",
        name: "$FRAGMENT$",
        elements: [table, ...unitsEls.filter(notUndefined)],
      } as Element;
    },
  );

  return {
    type: "element",
    name: "$FRAGMENT$",
    elements: await Promise.all(promises),
  };
}

export function unitsPatch(
  data: CombinedCurriculumData,
  isCycle2Review: boolean,
) {
  return async (el: Element, parent?: Element) => {
    if (
      parent?.name === "w:body" &&
      checkWithinElement(el, (el: Element) => {
        return el.type === "text" && textIncludes(el.text, "{{=UNITS}}");
      })
    ) {
      // This is here so we can hide assets after this marker in the document
      return buildUnits(data, isCycle2Review);
    }
    return el;
  };
}
