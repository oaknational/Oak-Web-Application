import { act, screen, waitFor } from "@testing-library/react";
import Mammoth from "mammoth/mammoth.browser";
import JSZip from "jszip";
import "jest-styled-components";
import {
  oakColorTokens,
  oakDefaultTheme,
  parseFontSize,
  parseFontWeight,
  parseLineHeight,
  parseSpacing,
} from "@oaknational/oak-components";

import { getParsedDocx, MammothJs } from "./MammothJs";
import { prepareMammothImages, restoreMammothCallouts } from "./mammothImages";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

let emptyDocx: ArrayBuffer;

beforeEach(async () => {
  jest.clearAllMocks();
  emptyDocx = await createDocx();
});

async function createDocx() {
  const zip = new JSZip();
  zip.file(
    "[Content_Types].xml",
    `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
      <Default Extension="xml" ContentType="application/xml"/>
      <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
      <Default Extension="png" ContentType="image/png"/>
    </Types>`,
  );
  zip.file(
    "_rels/.rels",
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="document" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
    </Relationships>`,
  );
  zip.file(
    "word/_rels/document.xml.rels",
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="styles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
      <Relationship Id="numbering" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
    </Relationships>`,
  );
  zip.file(
    "word/styles.xml",
    `<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      ${["Title", "Subtitle", "Heading2", "Caption"]
        .map(
          (id) =>
            `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${id}"/></w:style>`,
        )
        .join("")}
    </w:styles>`,
  );
  zip.file(
    "word/numbering.xml",
    `<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      <w:abstractNum w:abstractNumId="0">
        <w:lvl w:ilvl="0"><w:numFmt w:val="bullet"/><w:lvlText w:val="&#x2022;"/></w:lvl>
        <w:lvl w:ilvl="1"><w:numFmt w:val="decimal"/><w:lvlText w:val="%2."/></w:lvl>
      </w:abstractNum>
      <w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
    </w:numbering>`,
  );
  zip.file(
    "word/document.xml",
    `<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      <w:body>
        ${["Title", "Subtitle", "Heading2", "Heading2", "Caption"]
          .map(
            (id, index) =>
              `<w:p><w:pPr><w:pStyle w:val="${id}"/></w:pPr><w:r><w:t>${id} ${index}</w:t></w:r></w:p>`,
          )
          .join("")}
        <w:p><w:r><w:rPr><w:b/><w:i/><w:u w:val="single"/><w:strike/></w:rPr><w:t>Emphasis</w:t></w:r></w:p>
        <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr><w:r><w:t>Bullet</w:t></w:r></w:p>
        <w:p><w:pPr><w:numPr><w:ilvl w:val="1"/><w:numId w:val="1"/></w:numPr></w:pPr><w:r><w:t>Nested numbered</w:t></w:r></w:p>
        <w:tbl><w:tr><w:tc><w:tcPr><w:gridSpan w:val="2"/></w:tcPr><w:p><w:r><w:t>Merged cell</w:t></w:r></w:p></w:tc></w:tr></w:tbl>
        <w:tbl><w:tr><w:tc><w:p><w:r><w:t>Separate table</w:t></w:r></w:p></w:tc></w:tr></w:tbl>
      </w:body>
    </w:document>`,
  );
  return zip.generateAsync({ type: "arraybuffer" });
}

function mockExport(arrayBuffer = emptyDocx) {
  return jest.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    arrayBuffer: async () => arrayBuffer,
  } as Response);
}

describe("Mammoth DOCX style rules", () => {
  afterEach(() => jest.restoreAllMocks());

  it("converts an actual DOCX with semantic styles, nested lists and separate merged tables", async () => {
    const fetch = mockExport(await createDocx());
    const result = await getParsedDocx("public-document");
    expect(fetch).toHaveBeenCalledWith(
      "https://docs.google.com/document/d/public-document/export?format=docx",
      { signal: undefined },
    );
    expect(result.messages).toEqual([]);
    const html = document.createElement("div");
    html.innerHTML = result.value;
    expect(html.querySelector("h1.docx-title")).toHaveTextContent("Title 0");
    expect(html.querySelector("p.docx-subtitle")).toHaveTextContent(
      "Subtitle 1",
    );
    expect(html.querySelectorAll("h2")).toHaveLength(2);
    expect(html.querySelector("p.docx-caption")).toHaveTextContent("Caption 4");
    for (const tag of ["strong", "em", "u", "s"]) {
      expect(html.querySelector(tag)).toHaveTextContent("Emphasis");
    }
    expect(html.querySelector("ul > li > ol > li")).toHaveTextContent(
      "Nested numbered",
    );
    expect(html.querySelectorAll(".docx-table > table")).toHaveLength(2);
    expect(html.querySelector("td")).toHaveAttribute("colspan", "2");
  });

  it("surfaces failed exports", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      statusText: "Forbidden",
    } as Response);
    await expect(getParsedDocx("private")).rejects.toThrow(
      "Google Docs export failed: Forbidden",
    );
  });

  it("restores source drawing dimensions and keeps original image alt text", async () => {
    const zip = await JSZip.loadAsync(emptyDocx);
    const drawing = (width: number, background = false) =>
      `<w:p><w:r><w:drawing>
        <wp:${background ? 'anchor behindDoc="1"' : "inline"} xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">
          <wp:extent cx="${width * 9525}" cy="${30 * 9525}"/>
          <wp:docPr id="${width}" name="image.png" descr="Video demonstration"/>
          <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
            <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
              <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                <pic:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="image"/></pic:blipFill>
              </pic:pic>
            </a:graphicData>
          </a:graphic>
        </wp:${background ? "anchor" : "inline"}>
      </w:drawing></w:r></w:p>`;
    const xml = await zip.file("word/document.xml")!.async("string");
    zip.file(
      "word/document.xml",
      xml.replace("</w:body>", `${drawing(30)}${drawing(257, true)}</w:body>`),
    );
    const relationships = await zip
      .file("word/_rels/document.xml.rels")!
      .async("string");
    zip.file(
      "word/_rels/document.xml.rels",
      relationships.replace(
        "</Relationships>",
        '<Relationship Id="image" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/icon.png"/></Relationships>',
      ),
    );
    zip.file(
      "word/media/icon.png",
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6GrsAAAAASUVORK5CYII=",
      { base64: true },
    );
    mockExport(await zip.generateAsync({ type: "arraybuffer" }));
    const result = await getParsedDocx("with-images");
    expect(result.messages).toEqual([]);
    const html = document.createElement("div");
    html.innerHTML = result.value;
    const images = html.querySelectorAll("img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("width", "30");
    expect(images[0]).toHaveAttribute("height", "30");
    expect(images[0]).toHaveAttribute("alt", "Video demonstration");
    expect(images[0]).not.toHaveAttribute("data-docx-background");
    expect(images[1]).toHaveAttribute("width", "257");
    expect(images[1]).toHaveAttribute("data-docx-background", "true");
  });

  it("wraps each background around its own heading and linked text without swallowing the next section", () => {
    const image =
      '<img data-docx-background="true" width="257" src="data:image/png;base64,aGVsbG8=">';
    const result = restoreMammothCallouts(
      `<table><tbody><tr><td><p><a id="bookmark"></a>${image}</p><h3>Demo videos</h3><p><a href="https://example.com/video">Video</a></p><h3>${image}</h3><h3>Further guidance</h3><p>Refer to <a href="https://example.com/help">guidance</a>.</p><h3>Next section</h3><p>Keep outside</p></td></tr></tbody></table>`,
    );
    const html = document.createElement("div");
    html.innerHTML = result;
    const callouts = html.querySelectorAll(".docx-callout");
    expect(callouts).toHaveLength(2);
    expect(callouts[0]).toHaveTextContent("Demo videosVideo");
    expect(callouts[0]?.querySelector("a[id]")).toHaveAttribute(
      "id",
      "bookmark",
    );
    expect(callouts[0]?.querySelector("a[href]")).toHaveAttribute(
      "href",
      "https://example.com/video",
    );
    expect(callouts[0]?.getAttribute("style")).toContain("background-image:");
    expect(callouts[1]).toHaveTextContent("Further guidanceRefer to guidance.");
    expect(html.querySelector("img")).toBeNull();
    expect(callouts[1]).not.toHaveTextContent("Keep outside");
    expect(html.querySelector("td > h3")).toHaveTextContent("Next section");
  });

  it("does not remove ordinary images or backgrounds without an unambiguous linked section", () => {
    const html =
      '<p><img src="data:image/png;base64,aGVsbG8="></p><h3>Image</h3><p>Text</p><p><img data-docx-background="true" src="data:image/png;base64,aGVsbG8="></p><h3>Not linked</h3><p>Keep image</p>';
    const result = restoreMammothCallouts(html);
    const root = document.createElement("div");
    root.innerHTML = result;
    expect(root.querySelectorAll("img")).toHaveLength(2);
    expect(root.querySelector(".docx-callout")).toBeNull();
  });

  it("reports invalid document XML", async () => {
    const zip = new JSZip();
    zip.file("word/document.xml", "<broken>");
    await expect(
      prepareMammothImages(await zip.generateAsync({ type: "arraybuffer" })),
    ).rejects.toThrow("invalid document XML");
  });
});

describe("MammothJs", () => {
  afterEach(() => jest.restoreAllMocks());

  it("explains the unavailable EYFS document without fetching", () => {
    const fetch = jest.spyOn(global, "fetch");
    render(<MammothJs fileId={null} />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "EYFS document is not publicly available",
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it("sanitizes the article, retains embedded images, and only fetches once", async () => {
    const fetch = mockExport();
    jest.spyOn(Mammoth, "convertToHtml").mockResolvedValue({
      value:
        '<h2>Lesson</h2><p>Text</p><img alt="Diagram" src="data:image/png;base64,aGVsbG8=" onerror="alert(1)"><script>alert(1)</script><a href="javascript:alert(1)">Unsafe</a>',
      messages: [],
    });
    const { rerender } = render(<MammothJs fileId="public" />);
    expect(screen.getByRole("status")).toHaveAccessibleName(
      "Loading DOCX preview",
    );
    const article = await screen.findByRole("article");
    expect(article).toHaveAccessibleName("Mammoth document preview");
    expect(article.querySelector("h2")).toHaveTextContent("Lesson");
    expect(article.querySelector("script")).toBeNull();
    expect(screen.getByRole("img", { name: "Diagram" })).not.toHaveAttribute(
      "onerror",
    );
    expect(screen.getByRole("img", { name: "Diagram" })).toHaveAttribute(
      "src",
      "data:image/png;base64,aGVsbG8=",
    );
    expect(screen.getByText("Unsafe")).not.toHaveAttribute("href");
    rerender(<MammothJs fileId="public" />);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(article).toHaveStyleRule("overflow-x", "auto", {
      modifier: ".docx-table",
    });
    expect(article).toHaveStyleRule("height", "auto", { modifier: "img" });
    expect(article).toHaveStyleRule(
      "font-size",
      String(parseFontSize("body-2")),
    );
    expect(article).toHaveStyleRule(
      "line-height",
      String(parseLineHeight("body-2")),
    );
    expect(article).toHaveStyleRule(
      "font-size",
      String(parseFontSize("heading-6")),
      {
        modifier: "h2",
      },
    );
    expect(article).toHaveStyleRule(
      "font-weight",
      String(parseFontWeight("body-2-bold")),
      {
        modifier: "strong",
      },
    );
    expect(article).toHaveStyleRule("padding", parseSpacing("spacing-12"), {
      modifier: ".docx-callout",
    });
    const linkColor = oakDefaultTheme.uiColors["text-link-active"];
    if (!linkColor)
      throw new Error("Oak theme is missing the active link colour");
    expect(article).toHaveStyleRule("color", oakColorTokens[linkColor], {
      modifier: "a",
    });
  });

  it("shows conversion warnings instead of silently dropping them", async () => {
    mockExport();
    jest.spyOn(Mammoth, "convertToHtml").mockResolvedValue({
      value: "<p>Converted</p>",
      messages: [{ type: "warning", message: "Unsupported drawing" }],
    });
    render(<MammothJs fileId="public" />);
    await screen.findByRole("article");
    expect(screen.getByRole("status")).toHaveTextContent("Unsupported drawing");
  });

  it("shows a load error", async () => {
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));
    const log = jest.spyOn(console, "error").mockImplementation();
    render(<MammothJs fileId="public" />);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to load",
    );
    expect(log).toHaveBeenCalledWith("Failed to parse DOCX", expect.any(Error));
  });

  it("clears old content while switching and ignores a stale conversion result", async () => {
    const fetch = mockExport();
    let resolveFirst:
      | ((result: { value: string; messages: [] }) => void)
      | undefined;
    jest
      .spyOn(Mammoth, "convertToHtml")
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveFirst = resolve;
          }),
      )
      .mockResolvedValueOnce({ value: "<p>Second document</p>", messages: [] });
    const { rerender } = render(<MammothJs fileId="first" />);
    await waitFor(() => expect(resolveFirst).toBeDefined());
    const signal = fetch.mock.calls[0]?.[1]?.signal;
    rerender(<MammothJs fileId="second" />);
    expect(signal?.aborted).toBe(true);
    expect(screen.queryByRole("article")).toBeNull();
    expect(await screen.findByText("Second document")).toBeInTheDocument();
    await act(async () => {
      resolveFirst?.({ value: "<p>Stale document</p>", messages: [] });
    });
    expect(screen.queryByText("Stale document")).toBeNull();
    expect(screen.getByText("Second document")).toBeInTheDocument();
  });
});
