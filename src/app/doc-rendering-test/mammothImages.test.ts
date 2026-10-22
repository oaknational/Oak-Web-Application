import JSZip from "jszip";
import Mammoth from "mammoth/mammoth.browser";

import { prepareMammothImages, restoreMammothCallouts } from "./mammothImages";

const wordNamespace =
  "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const relationshipNamespace =
  "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

describe("Mammoth accessibility semantics", () => {
  it.each(["0", "false", "off"])(
    "does not treat a disabled table header flag (%s) as a header",
    async (value) => {
      const zip = new JSZip();
      zip.file(
        "word/document.xml",
        `<w:document xmlns:w="${wordNamespace}"><w:body><w:tbl>
          <w:tr><w:trPr><w:tblHeader w:val="${value}"/></w:trPr>
            <w:tc><w:p><w:r><w:t>Layout content</w:t></w:r></w:p></w:tc>
          </w:tr>
        </w:tbl></w:body></w:document>`,
      );
      const prepared = await prepareMammothImages(
        await zip.generateAsync({ type: "arraybuffer" }),
      );
      const result = await Mammoth.convertToHtml({
        arrayBuffer: prepared.arrayBuffer,
      });
      const root = document.createElement("div");
      root.innerHTML = result.value;
      expect(root.querySelector("th")).toBeNull();
      expect(root.querySelector("td")).toHaveTextContent("Layout content");
    },
  );

  it.each(["", ' w:val="1"', ' w:val="true"'])(
    "retains genuine table header flags (%s)",
    async (attribute) => {
      const zip = new JSZip();
      zip.file(
        "word/document.xml",
        `<w:document xmlns:w="${wordNamespace}"><w:body><w:tbl>
          <w:tr><w:trPr><w:tblHeader${attribute}/></w:trPr>
            <w:tc><w:p><w:r><w:t>Column heading</w:t></w:r></w:p></w:tc>
          </w:tr>
        </w:tbl></w:body></w:document>`,
      );
      const prepared = await prepareMammothImages(
        await zip.generateAsync({ type: "arraybuffer" }),
      );
      const result = await Mammoth.convertToHtml({
        arrayBuffer: prepared.arrayBuffer,
      });
      const root = document.createElement("div");
      root.innerHTML = result.value;
      expect(root.querySelector("th")).toHaveTextContent("Column heading");
    },
  );

  it("replaces empty semantic elements without losing anchors, images, spans or styles", () => {
    const root = document.createElement("div");
    root.innerHTML = restoreMammothCallouts(
      `<h2 id="empty-heading" class="source-heading"><a id="bookmark"></a><strong> </strong></h2>
       <h3><img src="decoration.png" alt=""></h3>
       <h2>Real heading</h2>
       <h3><img src="meaningful.png" alt="Swimming demonstration"></h3>
       <table><thead><tr>
         <th scope="col" rowspan="2" colspan="2" class="docx-fill-mint"><a id="cell-bookmark"></a></th>
         <th scope="col">Column heading</th>
       </tr></thead></table>`,
    );
    expect(root.querySelector("#empty-heading")?.tagName).toBe("P");
    expect(root.querySelector("#empty-heading")).toHaveClass("source-heading");
    expect(root.querySelector("#bookmark")).toBeInTheDocument();
    expect(
      root.querySelector('p > img[src="decoration.png"]'),
    ).toBeInTheDocument();
    expect(root.querySelectorAll("h2, h3")).toHaveLength(2);
    const cell = root.querySelector("td");
    expect(cell).toHaveAttribute("rowspan", "2");
    expect(cell).toHaveAttribute("colspan", "2");
    expect(cell).toHaveClass("docx-fill-mint");
    expect(cell).not.toHaveAttribute("scope");
    expect(cell?.querySelector("#cell-bookmark")).toBeInTheDocument();
    expect(root.querySelector("th")).toHaveTextContent("Column heading");
    expect(root.querySelector("th")).toHaveAttribute("scope", "col");
  });
});

describe("section label images", () => {
  const image =
    '<img src="book.png" width="40" height="26" data-docx-label-background="true">';

  it.each(["header", "label"])(
    "places a book anchored to the %s below the shaded header with its letter on the left page",
    (anchor) => {
      const root = document.createElement("div");
      root.innerHTML = restoreMammothCallouts(
        `<p class="docx-paragraph-fill">Section${anchor === "header" ? image : ""}</p>
         <p><strong> A</strong>${anchor === "label" ? image : ""}</p><p>Narrative</p>`,
      );
      const header = root.querySelector(".docx-paragraph-fill");
      const label = header?.nextElementSibling;
      expect(header?.querySelector("img")).toBeNull();
      expect(label).toHaveClass("docx-section-label");
      expect(
        label?.querySelector(".docx-labelled-image > img"),
      ).toHaveAttribute("width", "40");
      expect(label?.querySelector(".docx-image-label")).toHaveTextContent("A");
      expect(
        label?.querySelector(".docx-image-label strong"),
      ).toBeInTheDocument();
      expect(root.querySelectorAll("img")).toHaveLength(1);
      expect(root.querySelector("[data-docx-label-background]")).toBeNull();
      expect(root).toHaveTextContent("Narrative");
    },
  );

  it("does not move unrelated inline images or infer labels from narrative text", () => {
    const html = `<p class="docx-paragraph-fill">Section${image}</p><p>A paragraph of narrative</p>`;
    const root = document.createElement("div");
    root.innerHTML = restoreMammothCallouts(html);
    expect(root.querySelector(".docx-paragraph-fill img")).toBeInTheDocument();
    expect(root.querySelector(".docx-labelled-image")).toBeNull();
  });
});

describe("paragraph shading", () => {
  it("preserves Oak and custom source fills without changing paragraph semantics", async () => {
    const zip = new JSZip();
    zip.file(
      "word/document.xml",
      `<w:document xmlns:w="${wordNamespace}"><w:body>
        <w:p><w:pPr><w:shd w:fill="7F5DD3" w:val="clear"/></w:pPr>
          <w:r><w:rPr><w:color w:val="FFFFFF"/></w:rPr><w:t>Custom purple</w:t></w:r>
        </w:p>
        <w:p><w:pPr><w:shd w:fill="037b7d"/></w:pPr><w:r><w:t>Oak teal</w:t></w:r></w:p>
        <w:p><w:pPr><w:shd w:fill="auto"/></w:pPr><w:r><w:t>No fill</w:t></w:r></w:p>
        <w:p><w:pPr><w:shd w:fill="374cf1" w:val="nil"/></w:pPr><w:r><w:t>Disabled fill</w:t></w:r></w:p>
        <w:p><w:pPr><w:shd w:fill="FFFFFF"/></w:pPr><w:r><w:t> </w:t></w:r></w:p>
      </w:body></w:document>`,
    );
    const prepared = await prepareMammothImages(
      await zip.generateAsync({ type: "arraybuffer" }),
    );
    const converted = await Mammoth.convertToHtml(
      { arrayBuffer: prepared.arrayBuffer },
      { idPrefix: "mammoth-" },
    );
    const root = document.createElement("div");
    root.innerHTML = restoreMammothCallouts(
      converted.value,
      prepared.sectionBorders,
      document,
      prepared.paragraphFills,
    );
    expect(prepared.paragraphFills.size).toBe(2);
    expect(root.querySelectorAll("p.docx-paragraph-fill")).toHaveLength(2);
    expect(root.querySelector("p")).toHaveStyle({ backgroundColor: "#7f5dd3" });
    expect(root.querySelector("p")).toHaveClass("docx-text-inverted");
    expect(root.querySelector(".docx-fill-teal")).toHaveTextContent("Oak teal");
    expect(root.querySelector('a[id*="oak-paragraph-fill"]')).toBeNull();
    expect(root).toHaveTextContent("No fill");
    expect(root).toHaveTextContent("Disabled fill");
  });

  it("reports missing conversion markers rather than dropping source fills", () => {
    expect(() =>
      restoreMammothCallouts(
        "<p>Text</p>",
        [],
        document,
        new Map([["missing", { colour: "#037b7d", inverted: false }]]),
      ),
    ).toThrow("DOCX paragraph fills do not match");
  });
});

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
