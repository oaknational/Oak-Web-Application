import { join } from "path";

import { safeXml } from "@ooxml-tools/xml";

import { cdata, xmlElementToJson } from "../xml";
import {
  appendBodyElements,
  cmToEmu,
  createImage,
  insertImages,
  JSZipCached,
  wrapInBookmarkPoint,
  wrapInLinkToBookmark,
} from "../docx";
import { createThreadOptions } from "../tab-helpers";

import { generateGridCols, uncapitalizeSubject } from "./helper";

import { CombinedCurriculumData } from "@/utils/curriculum/types";

export default async function generate(
  zip: JSZipCached,
  { data }: { data: CombinedCurriculumData },
) {
  const images = await insertImages(zip, {
    upArrow: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/up-arrow.png",
    ),
  });

  const threads = createThreadOptions(data.units);
  const pageXml = safeXml`
    <root>
      <w:p>
        <w:pPr>
          <w:pStyle w:val="Heading2" />
        </w:pPr>
        ${wrapInBookmarkPoint(
          "section_threads_appendix",
          safeXml`
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                <w:b />
                <w:color w:val="222222" />
                <w:sz w:val="56" />
              </w:rPr>
              <w:t>
                ${cdata(`Threads in ${uncapitalizeSubject(data.subjectTitle)}`)}
              </w:t>
            </w:r>
          `,
        )}
      </w:p>
      <w:p>
        ${wrapInLinkToBookmark(
          "section_threads",
          safeXml`
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                <w:b />
                <w:color w:val="222222" />
                <w:sz w:val="24" />
                <w:u w:val="single" />
              </w:rPr>
              <w:t>${cdata(`See how to use threads`)}</w:t>
            </w:r>
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                <w:b />
                <w:color w:val="222222" />
                <w:sz w:val="24" />
                <w:u w:val="none" />
              </w:rPr>
              ${createImage(images.upArrow, {
                width: cmToEmu(0.4),
                height: cmToEmu(0.4),
                isDecorative: true,
              })}
            </w:r>
          `,
        )}
      </w:p>
      <w:p>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:sz w:val="56" />
          </w:rPr>
          <w:t />
        </w:r>
      </w:p>
      <w:tbl>
        <w:tblPr>
          <w:tblW w:type="pct" w:w="100%" />
          <w:tblBorders>
            <w:top w:val="single" w:color="FFFFFF" w:sz="0" />
            <w:left w:val="single" w:color="FFFFFF" w:sz="0" />
            <w:bottom w:val="single" w:color="FFFFFF" w:sz="0" />
            <w:right w:val="single" w:color="FFFFFF" w:sz="0" />
            <w:insideH w:val="single" w:color="FFFFFF" w:sz="0" />
            <w:insideV w:val="single" w:color="FFFFFF" w:sz="0" />
          </w:tblBorders>
        </w:tblPr>
        <w:tblGrid>${generateGridCols(1)}</w:tblGrid>
        ${threads
          .map((thread) => {
            return safeXml`
              <w:tr>
                <w:tc>
                  <w:tcPr>
                    <w:tcW w:type="pct" w:w="33.333333333333336%" />
                    <w:tcBorders>
                      <w:top w:val="single" w:color="FFFFFF" w:sz="48" />
                      <w:left w:val="single" w:color="FFFFFF" w:sz="0" />
                      <w:bottom w:val="single" w:color="FFFFFF" w:sz="48" />
                      <w:right w:val="single" w:color="FFFFFF" w:sz="0" />
                    </w:tcBorders>
                    <w:shd w:val="solid" w:color="FEF7D0" w:fill="FEF7D0" />
                    <w:tcMar>
                      <w:top w:type="dxa" w:w="226" />
                      <w:left w:type="dxa" w:w="226" />
                      <w:bottom w:type="dxa" w:w="226" />
                      <w:right w:type="dxa" w:w="226" />
                    </w:tcMar>
                  </w:tcPr>
                  <w:p>
                    <w:r>
                      <w:rPr>
                        <w:rFonts
                          w:ascii="Arial"
                          w:hAnsi="Arial"
                          w:cs="Arial"
                        />
                        <w:b />
                        <w:color w:val="222222" />
                        <w:sz w:val="28" />
                      </w:rPr>
                      <w:t>${cdata(thread.title)}</w:t>
                    </w:r>
                  </w:p>
                </w:tc>
              </w:tr>
            `;
          })
          .join("")}
      </w:tbl>
    </root>
  `;

  await appendBodyElements(zip, xmlElementToJson(pageXml)?.elements);
}
