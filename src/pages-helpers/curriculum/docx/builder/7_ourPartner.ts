import { join } from "path";

import { cdata, safeXml, xmlElementToJson } from "../xml";
import { CombinedCurriculumData } from "..";
import {
  appendBodyElements,
  cmToEmu,
  cmToTwip,
  createImage,
  insertImages,
  JSZipCached,
} from "../docx";

import { generateGridCols, makeTransparentIfSanity } from "./helper";
import { getPortableTextTypes, portableTextToDocx } from "./portableText";

import { CurriculumPartnerOverview } from "@/node-lib/sanity-graphql/generated/sdk";

async function buildPartnerBioText(
  zip: JSZipCached,
  curriculumPartner: NonNullable<CurriculumPartnerOverview>,
) {
  if (curriculumPartner.partnerBioPortableTextRaw) {
    return await portableTextToDocx(
      curriculumPartner.partnerBioPortableTextRaw,
      getPortableTextTypes(zip),
    );
  } else if (curriculumPartner.partnerBio) {
    return safeXml`
      <w:p>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t>${cdata(curriculumPartner.partnerBio)}</w:t>
        </w:r>
      </w:p>
    `;
  } else {
    return safeXml`<w:p />`;
  }
}
export default async function generate(
  zip: JSZipCached,
  { data }: { data: CombinedCurriculumData },
) {
  const partnerTitle = `Our curriculum partner${
    data.curriculumPartnerOverviews?.length > 1 ? "s" : ""
  }`;
  const sanityUrls = data.curriculumPartnerOverviews?.map(
    ({ curriculumPartner }) =>
      curriculumPartner && curriculumPartner.image
        ? curriculumPartner.image?.asset?.url
        : "",
  );

  const underline = await insertImages(zip, {
    img: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/underline.png",
    ),
  });

  const partnerImages = await Promise.all(
    sanityUrls.map(
      async (sanityUrl) =>
        await insertImages(zip, {
          img: sanityUrl
            ? makeTransparentIfSanity(sanityUrl)
            : join(
                process.cwd(),
                "src/pages-helpers/curriculum/docx/builder/images/transparent_pixel.png",
              ),
        }),
    ),
  );

  const curriculumPartnerOverviewsXml = await Promise.all(
    data.curriculumPartnerOverviews.map(
      async (curriculumPartnerOverview, index) => safeXml`
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
          <w:tblGrid>${generateGridCols(2)}</w:tblGrid>
          <w:tr>
            <w:tc>
              <w:tcPr>
                <w:tcMar>
                  <w:start w:type="dxa" w:w="${cmToTwip(0)}" />
                  <w:end w:type="dxa" w:w="${cmToTwip(1)}" />
                </w:tcMar>
                <w:vAlign w:val="top" />
              </w:tcPr>

              <w:p>
                <w:r>
                  <w:rPr>
                    <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                    <w:sz w:val="36" />
                  </w:rPr>
                  <w:t />
                </w:r>
              </w:p>

              ${await buildPartnerBioText(zip, curriculumPartnerOverview)}
            </w:tc>
            <w:tc>
              <w:p>
                <w:r>
                  ${createImage(
                    partnerImages[index] ? partnerImages[index].img : "",
                    {
                      width: cmToEmu(7.95),
                      height: cmToEmu(7.95),
                      isDecorative: true,
                    },
                  )}
                </w:r>
              </w:p>
            </w:tc>
          </w:tr>
        </w:tbl>
      `,
    ),
  );

  const pageXml = safeXml`
    <root>
      <w:p>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
        </w:r>
      </w:p>
      <w:p>
        <w:pPr>
          <w:pStyle w:val="Heading3" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:b />
            <w:color w:val="222222" />
            <w:sz w:val="36" />
          </w:rPr>
          <w:t>${cdata(partnerTitle)}</w:t>
          ${createImage(underline.img, {
            width: cmToEmu(7.74),
            height: cmToEmu(0.21),
            xPos: cmToEmu(-0.19),
            yPos: cmToEmu(0.9),
            xPosAnchor: "column",
            yPosAnchor: "paragraph",
            isDecorative: true,
          })}
        </w:r>
      </w:p>
      ${curriculumPartnerOverviewsXml}
      <w:p>
        <w:r>
          <w:br w:type="page" />
        </w:r>
      </w:p>
    </root>
  `;

  await appendBodyElements(zip, xmlElementToJson(pageXml)?.elements);
}
