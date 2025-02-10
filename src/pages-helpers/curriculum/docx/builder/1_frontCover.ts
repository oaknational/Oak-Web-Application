import { join } from "path";

import { capitalize } from "lodash";

import { CombinedCurriculumData, Slugs } from "..";
import { cdata, safeXml, xmlElementToJson } from "../xml";
import {
  appendBodyElements,
  cmToEmu,
  createImage,
  insertImages,
  JSZipCached,
} from "../docx";

import { generateIconURL, subjectFromUnits } from "./helper";

import { getShortPhaseText } from "@/utils/curriculum/formatting";

const PARTNER_IMG_WIDTH = 475 * 2;

export default async function generate(
  zip: JSZipCached,
  { data, slugs }: { data: CombinedCurriculumData; slugs: Slugs },
) {
  const images = await insertImages(zip, {
    icon: {
      url: generateIconURL(slugs.subjectSlug),
      width: PARTNER_IMG_WIDTH,
    },
    arrow: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/arrow.png",
    ),
    logo: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/logo.png",
    ),
  });

  const phaseTitle = getShortPhaseText(
    { slug: slugs.phaseSlug ?? "primary" },
    data.units.map((u) => ({ slug: u.keystage_slug })),
  );
  const subjectTitle = data.subjectTitle;

  const examboardTitle = data.examboardTitle ? `${data.examboardTitle}` : "";
  const tierTitle = slugs.tierSlug ? `${capitalize(slugs.tierSlug)}` : "";

  const childSubjectTitle =
    subjectFromUnits(data.units, slugs.childSubjectSlug) ?? "";

  const subtitle =
    examboardTitle !== "" || tierTitle !== "" || childSubjectTitle !== ""
      ? [examboardTitle, childSubjectTitle, tierTitle]
          .filter(Boolean)
          .join(", ") + " (KS4)"
      : "";

  const pageXml = safeXml`
    <root>
      <w:p>
        <w:r>
          ${createImage(images.logo, {
            width: cmToEmu(4.36),
            height: cmToEmu(2),
            desc: "Oak National Academy logo",
          })}
        </w:r>
      </w:p>
      ${Array(6)
        .fill(true)
        .map(() => {
          return safeXml`
            <w:p>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                  <w:color w:val="222222" />
                  <w:sz w:val="24" />
                </w:rPr>
                <w:t />
              </w:r>
            </w:p>
          `;
        })
        .join("")}
      <w:p>
        <w:pPr>
          <w:pStyle w:val="Heading1" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:b w:val="true" />
            <w:color w:val="222222" />
            <w:sz w:val="80" />
          </w:rPr>
          <w:t>${cdata(`${phaseTitle} ${subjectTitle} curriculum plan`)}</w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="30" />
          </w:rPr>
          <w:t>${cdata(subtitle)}</w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:r>
          ${createImage(images.arrow, {
            width: cmToEmu(20.54),
            height: cmToEmu(15.18),
            xPos: cmToEmu(0.25),
            yPos: cmToEmu(13.13),
            isDecorative: true,
            relativeHeight: 100,
          })}
          ${createImage(images.icon, {
            width: cmToEmu(12.59),
            height: cmToEmu(12.59),
            xPos: cmToEmu(7.92),
            yPos: cmToEmu(13.11),
            isDecorative: true,
            relativeHeight: 400,
            rotation: 353.6,
          })}
        </w:r>
      </w:p>
    </root>
  `;

  await appendBodyElements(zip, xmlElementToJson(pageXml)?.elements);
}
