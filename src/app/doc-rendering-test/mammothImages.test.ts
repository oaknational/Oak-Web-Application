import JSZip from "jszip";
import Mammoth from "mammoth/mammoth.browser";

import { prepareMammothImages, restoreMammothCallouts } from "./mammothImages";

const wordNamespace =
  "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const relationshipNamespace =
  "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

async function headerDocument(firstPage: boolean) {
  const zip = new JSZip();
  zip.file(
    "word/document.xml",
    `<w:document xmlns:w="${wordNamespace}" xmlns:r="${relationshipNamespace}">
      <w:body>
        <w:p><w:r><w:t>Body content</w:t></w:r></w:p>
        <w:sectPr>
          <w:headerReference r:id="first" w:type="first"/>
          <w:headerReference r:id="default" w:type="default"/>
          <w:titlePg w:val="${firstPage ? "1" : "0"}"/>
        </w:sectPr>
      </w:body>
    </w:document>`,
  );
  zip.file(
    "word/_rels/document.xml.rels",
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="first" Type="${relationshipNamespace}/header" Target="header1.xml"/>
      <Relationship Id="default" Type="${relationshipNamespace}/header" Target="header2.xml"/>
    </Relationships>`,
  );
  for (const [index, title] of [
    "First-page title",
    "Running title",
  ].entries()) {
    zip.file(
      `word/header${index + 1}.xml`,
      `<w:hdr xmlns:w="${wordNamespace}">
        <w:tbl><w:tr><w:tc>
          <w:p>
            <w:pPr><w:pStyle w:val="Heading1"/></w:pPr>
            <w:r><w:t>${title}</w:t></w:r>
          </w:p>
          <w:p><w:r><w:t>Page number</w:t></w:r></w:p>
        </w:tc></w:tr></w:tbl>
      </w:hdr>`,
    );
  }
  return zip;
}

describe("prepareMammothImages header headings", () => {
  it.each([true, false])(
    "restores only the selected header heading once (first page: %s)",
    async (firstPage) => {
      const zip = await headerDocument(firstPage);
      const prepared = await prepareMammothImages(
        await zip.generateAsync({ type: "arraybuffer" }),
      );
      const result = await Mammoth.convertToHtml(
        { arrayBuffer: prepared.arrayBuffer },
        { styleMap: ["p.Heading1 => h1:fresh"] },
      );
      expect(result.value).toBe(
        `<h1>${firstPage ? "First-page title" : "Running title"}</h1><p>Body content</p>`,
      );
      expect(prepared.sectionBorders).toEqual([]);
    },
  );

  it("reports a missing referenced header instead of silently omitting it", async () => {
    const zip = await headerDocument(true);
    zip.remove("word/header1.xml");
    await expect(
      prepareMammothImages(await zip.generateAsync({ type: "arraybuffer" })),
    ).rejects.toThrow("DOCX is missing header part: word/header1.xml");
  });

  describe("restoreMammothCallouts icons", () => {
    const icons = `<p>
      <img src="risk.png" width="30" height="30" data-docx-page-x="100" data-docx-page-y="300">
      <img src="guidance.png" width="30" height="30" data-docx-page-x="100" data-docx-page-y="200">
      <img src="demo.png" width="29" height="29" data-docx-page-x="100" data-docx-page-y="100">
    </p>`;
    const callouts = `<div class="docx-table"><table><tbody><tr><td>${[
      "Demo videos",
      "Further guidance",
      "Risk assessment",
    ]
      .map(
        (
          title,
        ) => `<p><img data-docx-background="true" src="data:image/png;base64,AAAA"></p>
        <h3>${title}</h3><p><a href="https://example.com">${title} link</a></p>`,
      )
      .join("")}</td></tr></tbody></table></div>`;

    it("moves page-anchored icons into callout headings in visual order", () => {
      const root = document.createElement("div");
      root.innerHTML = restoreMammothCallouts(icons + callouts);
      expect(root.children).toHaveLength(1);
      expect(
        Array.from(root.querySelectorAll(".docx-callout > img")).map((image) =>
          image.getAttribute("src"),
        ),
      ).toEqual(["demo.png", "guidance.png", "risk.png"]);
      expect(root.querySelector(".docx-callout-icon")).toHaveAttribute(
        "width",
        "29",
      );
      expect(root.querySelectorAll(".docx-callout a[href]")).toHaveLength(3);
      for (const callout of Array.from(
        root.querySelectorAll(".docx-callout"),
      )) {
        expect(callout).toHaveClass("docx-callout-with-icon");
        expect(callout.firstElementChild).toHaveClass("docx-callout-text");
        expect(callout.firstElementChild?.querySelector("h3")).not.toBeNull();
        expect(
          callout.firstElementChild?.querySelector("a[href]"),
        ).not.toBeNull();
        expect(callout.lastElementChild).toHaveClass("docx-callout-icon");
      }
      expect(root.querySelector("[data-docx-page-x]")).toBeNull();
    });

    it("does not guess associations when the icon and callout counts differ", () => {
      const root = document.createElement("div");
      root.innerHTML = restoreMammothCallouts(
        icons.replace(/<img src="demo.png"[^>]*>/, "") + callouts,
      );
      expect(root.querySelectorAll("p > img[data-docx-page-x]")).toHaveLength(
        2,
      );
      expect(root.querySelectorAll(".docx-callout-icon")).toHaveLength(0);
    });

    it("keeps images in place when they do not share a page column", () => {
      const root = document.createElement("div");
      root.innerHTML = restoreMammothCallouts(
        icons.replace('data-docx-page-x="100"', 'data-docx-page-x="200"') +
          callouts,
      );
      expect(root.querySelectorAll("p > img[data-docx-page-x]")).toHaveLength(
        3,
      );
      expect(root.querySelectorAll(".docx-callout-icon")).toHaveLength(0);
    });
  });

  it("leaves documents without headers unchanged", async () => {
    const zip = new JSZip();
    zip.file(
      "word/document.xml",
      `<w:document xmlns:w="${wordNamespace}"><w:body>
        <w:p><w:r><w:t>Body content</w:t></w:r></w:p>
      </w:body></w:document>`,
    );
    const prepared = await prepareMammothImages(
      await zip.generateAsync({ type: "arraybuffer" }),
    );
    const result = await Mammoth.convertToHtml({
      arrayBuffer: prepared.arrayBuffer,
    });
    expect(result.value).toBe("<p>Body content</p>");
  });
});
