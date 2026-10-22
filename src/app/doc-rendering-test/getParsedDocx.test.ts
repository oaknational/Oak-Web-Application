import JSZip from "jszip";

import { getParsedDocx } from "./getParsedDocx";

describe("browser DOCX callout conversion", () => {
  it("retains decorative background images after DOM processing and sanitization", async () => {
    const zip = new JSZip();
    const w = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
    const wp =
      "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing";
    const a = "http://schemas.openxmlformats.org/drawingml/2006/main";
    const r =
      "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
    const pic = "http://schemas.openxmlformats.org/drawingml/2006/picture";
    zip.file(
      "word/document.xml",
      `<w:document xmlns:w="${w}" xmlns:wp="${wp}" xmlns:a="${a}" xmlns:r="${r}" xmlns:pic="${pic}">
        <w:body>
          <w:p><w:r><w:drawing><wp:anchor behindDoc="1">
            <wp:extent cx="2447925" cy="622300"/><wp:docPr id="1" name="background"/>
            <a:graphic><a:graphicData uri="${pic}"><pic:pic>
              <pic:blipFill><a:blip r:embed="background"/></pic:blipFill>
            </pic:pic></a:graphicData></a:graphic>
          </wp:anchor></w:drawing></w:r></w:p>
          <w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:t>Demo videos</w:t></w:r></w:p>
          <w:p><w:hyperlink r:id="link"><w:r><w:t>Watch</w:t></w:r></w:hyperlink></w:p>
        </w:body>
      </w:document>`,
    );
    zip.file(
      "word/styles.xml",
      `<w:styles xmlns:w="${w}"><w:style w:type="paragraph" w:styleId="Heading3">
        <w:name w:val="heading 3"/></w:style></w:styles>`,
    );
    zip.file(
      "word/_rels/document.xml.rels",
      `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
        <Relationship Id="background" Type="${r}/image" Target="media/background.png"/>
        <Relationship Id="link" Type="${r}/hyperlink" Target="https://example.com" TargetMode="External"/>
      </Relationships>`,
    );
    zip.file(
      "[Content_Types].xml",
      `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
        <Default Extension="png" ContentType="image/png"/>
      </Types>`,
    );
    zip.file("word/media/background.png", "AAAA", { base64: true });
    const response = new Response();
    jest
      .spyOn(response, "arrayBuffer")
      .mockImplementation(async () =>
        zip.generateAsync({ type: "arraybuffer" }),
      );
    const fetch = jest.spyOn(globalThis, "fetch").mockResolvedValue(response);
    try {
      const result = await getParsedDocx("test-document");
      const root = document.createElement("div");
      root.innerHTML = result.html;
      const callout = root.querySelector(".docx-callout");
      expect(callout?.getAttribute("style")).toContain(
        'background-image: url("data:image/png;base64,AAAA")',
      );
      expect(callout?.querySelector("h3")?.textContent).toBe("Demo videos");
      expect(callout?.querySelector("a[href]")?.getAttribute("href")).toBe(
        "https://example.com",
      );
      expect(callout?.querySelector("img")).toBeNull();
    } finally {
      fetch.mockRestore();
    }
  });
});
