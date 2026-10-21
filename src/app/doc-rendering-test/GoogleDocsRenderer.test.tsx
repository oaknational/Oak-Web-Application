import { fireEvent, screen, within } from "@testing-library/react";
import {
  parseFontSize,
  parseLineHeight,
  parseSpacing,
} from "@oaknational/oak-components";
import "jest-styled-components";

import eyfs from "./docsApiResponseJson/eyfs.json";
import peGuide from "./docsApiResponseJson/peGuide.json";
import additionalMaterials from "./docsApiResponseJson/additionalMaterials.json";
import { GoogleDocsApi } from "./GoogleDocsApi";
import { GoogleDocsDocument, GoogleDocsRenderer } from "./GoogleDocsRenderer";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);
const examples = [
  { resourceFile: "eyfs", document: eyfs },
  { resourceFile: "pe-guide", document: peGuide },
  { resourceFile: "additional-materials", document: additionalMaterials },
] as const;

function paragraph(
  text: string,
  options: {
    namedStyleType?: string;
    headingId?: string;
    bullet?: { listId: string; nestingLevel?: number };
  } = {},
) {
  return {
    paragraph: {
      elements: [{ textRun: { content: `${text}\n` } }],
      paragraphStyle: {
        namedStyleType: options.namedStyleType,
        headingId: options.headingId,
      },
      bullet: options.bullet,
    },
  };
}

function renderContent(
  content: NonNullable<GoogleDocsDocument["body"]>["content"],
  extra: Omit<GoogleDocsDocument, "body"> = {},
) {
  return render(
    <GoogleDocsRenderer document={{ body: { content }, ...extra }} />,
  );
}

describe("GoogleDocsRenderer", () => {
  it.each([true, false])(
    "selects header headings using the first-page setting (%s)",
    (useFirstPageHeaderFooter) => {
      renderContent([paragraph("Body content")], {
        documentStyle: {
          useFirstPageHeaderFooter,
          firstPageHeaderId: "first",
          defaultHeaderId: "default",
        },
        headers: {
          first: {
            content: [
              paragraph("First-page title", { namedStyleType: "TITLE" }),
            ],
          },
          default: {
            content: [
              paragraph("Running title", { namedStyleType: "HEADING_1" }),
              paragraph("Page number"),
            ],
          },
        },
      });
      expect(
        screen.getByRole("heading", {
          level: 1,
          name: useFirstPageHeaderFooter ? "First-page title" : "Running title",
        }),
      ).toBeInTheDocument();
      expect(screen.getAllByRole("heading")).toHaveLength(1);
      expect(screen.queryByText("Page number")).not.toBeInTheDocument();
      expect(screen.getByText("Body content")).toBeInTheDocument();
    },
  );

  it.each([
    { document: peGuide, heading: "Front crawl over increasing distance" },
    { document: additionalMaterials, heading: "Getting ready to swim" },
    { document: eyfs, heading: "One more than a number to 5" },
  ])(
    "renders the first-page header title once: $heading",
    ({ document, heading }) => {
      render(<GoogleDocsRenderer document={document} />);
      expect(
        screen.getAllByRole("heading", { level: 1, name: heading }),
      ).toHaveLength(1);
      expect(
        screen.queryByText(
          /Front crawl over increasing distance and water polo/,
        ),
      ).not.toBeInTheDocument();
    },
  );

  it("renders the EYFS example as an accessible article with headings, lists, tables and images", () => {
    const { container } = render(<GoogleDocsRenderer document={eyfs} />);
    expect(
      screen.getByRole("article", { name: eyfs.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Reconnect",
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("table")).toHaveLength(4);
    expect(screen.getAllByRole("list").length).toBeGreaterThan(0);
    expect(container.querySelectorAll("img").length).toBeGreaterThan(0);
    expect(container.querySelector("h3:empty")).not.toBeInTheDocument();
    expect(screen.queryByText(/Unsupported document/)).not.toBeInTheDocument();
  });

  it.each(examples)(
    "preserves every body text run for $resourceFile",
    ({ document }) => {
      const { container } = render(<GoogleDocsRenderer document={document} />);
      const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
      const rendered = normalize(container.textContent ?? "");
      function assertText(value: unknown) {
        if (!value || typeof value !== "object") return;
        if ("textRun" in value) {
          const run = value.textRun;
          if (run && typeof run === "object" && "content" in run) {
            expect(rendered).toContain(normalize(String(run.content)));
          }
        }
        Object.values(value).forEach((child: unknown) => {
          if (Array.isArray(child)) child.forEach(assertText);
          else assertText(child);
        });
      }
      assertText(document.body);
      expect(
        screen.queryByText(/Unsupported document/),
      ).not.toBeInTheDocument();
    },
  );

  it("renders the PE guide's inline and paragraph-anchored floating images", () => {
    const { container } = render(<GoogleDocsRenderer document={peGuide} />);
    // Three decorative floating images now surround their linked content.
    expect(container.querySelectorAll("img")).toHaveLength(6);
    expect(container.querySelectorAll(".docx-callout")).toHaveLength(3);
    expect(container.querySelector("ol")).toBeInTheDocument();
  });

  it("uses Oak component typography and spacing independently of Mammoth styles", () => {
    const { container } = render(<GoogleDocsRenderer document={peGuide} />);
    const article = screen.getByRole("article");
    expect(article).toHaveStyleRule(
      "font-size",
      String(parseFontSize("body-2")),
    );
    expect(article).toHaveStyleRule(
      "line-height",
      String(parseLineHeight("body-2")),
    );
    expect(screen.getByRole("heading", { name: "Warm up" })).toHaveStyleRule(
      "font-size",
      String(parseFontSize("heading-6")),
    );
    expect(container.querySelector(".docx-callout")).toHaveStyleRule(
      "padding",
      parseSpacing("spacing-12"),
    );
    expect(article).not.toHaveStyleRule(
      "font-size",
      String(parseFontSize("heading-6")),
      { modifier: "h2" },
    );
  });

  it("matches the PE guide's coloured outlines, vertical dividers and link callouts", () => {
    const { container } = render(<GoogleDocsRenderer document={peGuide} />);
    expect(
      Array.from(container.querySelectorAll('[class*="docx-section-"]')).map(
        (section) =>
          Array.from(section.classList).find((name) =>
            name.startsWith("docx-section-"),
          ),
      ),
    ).toEqual([
      "docx-section-mint",
      "docx-section-purple",
      "docx-section-teal",
      "docx-section-blue",
      "docx-section-mint",
    ]);
    for (const colour of ["purple", "teal", "blue"]) {
      expect(
        container.querySelector(`.docx-border-right-${colour}`),
      ).toBeInTheDocument();
      expect(
        container.querySelector(`.docx-border-left-${colour}`),
      ).toBeInTheDocument();
    }
    const callouts = container.querySelectorAll(".docx-callout");
    expect(
      Array.from(callouts).map((box) => box.querySelector("h3")?.textContent),
    ).toEqual(["Demo videos", "Further guidance", "Risk assessment "]);
    callouts.forEach((box) => {
      expect(box.querySelector("a[href]")).toBeInTheDocument();
      expect(box.querySelector("img")).toBeNull();
      expect(box.getAttribute("style")).toContain("background-image:");
    });
    container.querySelectorAll("img").forEach((image) => {
      expect(Number(image.getAttribute("width"))).toBeLessThanOrEqual(43);
    });
  });

  it("renders additional-materials heading bands with fills and white text, not outlines", () => {
    const { container } = render(
      <GoogleDocsRenderer document={additionalMaterials} />,
    );
    expect(container.querySelector(".docx-fill-teal")).toHaveTextContent(
      "Expectations and ground rules",
    );
    expect(container.querySelector(".docx-fill-blue")).toHaveTextContent(
      "Entries, exits and regaining standing",
    );
    expect(
      container.querySelector(".docx-fill-teal .docx-text-inverted"),
    ).toBeInTheDocument();
    expect(
      container.querySelector(".docx-fill-blue .docx-text-inverted"),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        '[class*="docx-section-"], [class*="docx-border-"]',
      ),
    ).toBeNull();
    const second = screen.getByText(/2 short blasts:/);
    const list = second.closest("ul");
    expect(second.closest("h3")).toBeNull();
    expect(second.closest("strong")).toBeNull();
    expect(list?.children).toHaveLength(4);
    expect(list?.children[0]).toHaveTextContent("1 short whistle blast:");
    expect(list?.children[3]).toHaveTextContent("1 long blast:");
  });

  it("ignores zero-width borders even if their colours match an Oak token", () => {
    renderContent([
      {
        table: {
          tableRows: [
            {
              tableCells: [
                {
                  content: [paragraph("No border")],
                  tableCellStyle: {
                    borderLeft: {
                      width: { magnitude: 0 },
                      color: {
                        color: {
                          rgbColor: {
                            red: 132 / 255,
                            green: 90 / 255,
                            blue: 217 / 255,
                          },
                        },
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    ]);
    expect(screen.getByText("No border").closest("td")).not.toHaveClass(
      "docx-border-left-purple",
    );
    expect(screen.getByRole("table").parentElement).not.toHaveClass(
      "docx-section-purple",
    );
  });

  it("preserves an image anchored to an otherwise empty paragraph", () => {
    renderContent([{ paragraph: { positionedObjectIds: ["floating"] } }], {
      positionedObjects: {
        floating: {
          positionedObjectProperties: {
            embeddedObject: {
              description: "Swimming technique",
              imageProperties: { contentUri: "https://example.com/swim.png" },
            },
          },
        },
      },
    });
    expect(
      screen.getByRole("img", { name: "Swimming technique" }),
    ).toBeInTheDocument();
  });

  it("preserves heading levels and IDs, skips empty paragraphs, and keeps internal line breaks", () => {
    const { container } = renderContent([
      ...[1, 2, 3, 4, 5, 6].map((level) =>
        paragraph(`Heading ${level}`, {
          namedStyleType: `HEADING_${level}`,
          headingId: `heading-${level}`,
        }),
      ),
      paragraph(""),
      paragraph("First\nSecond\vThird"),
    ]);
    for (let level = 1; level <= 6; level++) {
      expect(
        screen.getByRole("heading", { level, name: `Heading ${level}` }),
      ).toHaveAttribute("id", `heading-${level}`);
    }
    expect(container.querySelectorAll("p")).toHaveLength(1);
    expect(container.querySelectorAll("br")).toHaveLength(2);
  });

  it("uses semantic marks, inherits named styles, and allows explicit overrides", () => {
    const { container } = renderContent(
      [
        {
          paragraph: {
            elements: [
              { textRun: { content: "Inherited" } },
              {
                textRun: {
                  content: "Plain",
                  textStyle: { bold: false },
                },
              },
              {
                textRun: {
                  content: "Marked",
                  textStyle: {
                    bold: true,
                    italic: true,
                    underline: true,
                    strikethrough: true,
                    baselineOffset: "SUPERSCRIPT",
                  },
                },
              },
              {
                textRun: {
                  content: "Subscript\n",
                  textStyle: { baselineOffset: "SUBSCRIPT" },
                },
              },
            ],
          },
        },
      ],
      {
        namedStyles: {
          styles: [
            { namedStyleType: "NORMAL_TEXT", textStyle: { bold: true } },
          ],
        },
      },
    );
    expect(screen.getByText("Inherited").tagName).toBe("STRONG");
    expect(screen.getByText("Plain").closest("strong")).toBeNull();
    expect(container.querySelector("sup s u em strong")).toHaveTextContent(
      "Marked",
    );
    expect(container.querySelector("sub")).toHaveTextContent("Subscript");
  });

  it("renders safe external and heading links without creating unsafe links", () => {
    renderContent([
      {
        paragraph: {
          elements: [
            {
              textRun: {
                content: "External",
                textStyle: { link: { url: "https://example.com" } },
              },
            },
            {
              textRun: {
                content: "Heading",
                textStyle: { link: { headingId: "h.intro" } },
              },
            },
            {
              textRun: {
                content: "Unsafe\n",
                textStyle: { link: { url: "javascript:alert(1)" } },
              },
            },
          ],
        },
      },
    ]);
    expect(screen.getByRole("link", { name: "External" })).toHaveAttribute(
      "href",
      "https://example.com",
    );
    expect(screen.getByRole("link", { name: "Heading" })).toHaveAttribute(
      "href",
      "#h.intro",
    );
    expect(screen.queryByRole("link", { name: "Unsafe" })).toBeNull();
    expect(screen.getByText("Unsafe")).toBeInTheDocument();
  });

  it("groups adjacent lists, nests children inside list items, and continues numbering across paragraphs", () => {
    const bullet = (text: string, listId: string, nestingLevel = 0) =>
      paragraph(text, { bullet: { listId, nestingLevel } });
    const { container } = renderContent(
      [
        bullet("First", "ordered"),
        bullet("Nested", "ordered", 1),
        bullet("Second", "ordered"),
        paragraph("Interruption"),
        bullet("Third", "ordered"),
        bullet("Unordered", "bullets"),
        bullet("Different list", "other"),
      ],
      {
        lists: {
          ordered: {
            listProperties: {
              nestingLevels: [
                { glyphType: "DECIMAL", startNumber: 3 },
                { glyphSymbol: "●" },
              ],
            },
          },
        },
      },
    );
    const ordered = container.querySelectorAll("ol");
    expect(ordered).toHaveLength(2);
    expect(ordered[0]).toHaveAttribute("start", "3");
    expect(ordered[1]).toHaveAttribute("start", "5");
    const firstItem = screen.getByText("First").closest("li");
    expect(firstItem).not.toBeNull();
    expect(firstItem?.querySelector("ul")).toHaveTextContent("Nested");
    expect(container.querySelectorAll("ul")).toHaveLength(3);
    expect(container.querySelector("ul > ul, ol > ul")).toBeNull();
  });

  it("supports a list starting at an indented level and changing list IDs at that level", () => {
    const { container } = renderContent([
      paragraph("Indented first", {
        bullet: { listId: "first", nestingLevel: 2 },
      }),
      paragraph("Indented other", {
        bullet: { listId: "other", nestingLevel: 2 },
      }),
      paragraph("Back to root", { bullet: { listId: "first" } }),
    ]);
    expect(container.querySelectorAll("article > ul")).toHaveLength(3);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders merged table cells and nested tables without the zero-span placeholders", () => {
    renderContent([
      {
        table: {
          tableRows: [
            {
              tableCells: [
                {
                  tableCellStyle: { rowSpan: 2, columnSpan: 2 },
                  content: [
                    paragraph("Merged"),
                    {
                      table: {
                        tableRows: [
                          { tableCells: [{ content: [paragraph("Nested")] }] },
                        ],
                      },
                    },
                  ],
                },
                {
                  tableCellStyle: { rowSpan: 0, columnSpan: 0 },
                  content: [paragraph("Placeholder")],
                },
              ],
            },
          ],
        },
      },
    ]);
    expect(screen.getAllByRole("table")).toHaveLength(2);
    const cell = screen.getByText("Merged").closest("td");
    expect(cell).toHaveAttribute("colspan", "2");
    expect(cell).toHaveAttribute("rowspan", "2");
    expect(screen.queryByText("Placeholder")).toBeNull();
  });

  it("renders image descriptions and dimensions, with an explicit missing-image message", () => {
    renderContent(
      [
        {
          paragraph: {
            elements: [
              { inlineObjectElement: { inlineObjectId: "image" } },
              { inlineObjectElement: { inlineObjectId: "missing" } },
            ],
          },
        },
      ],
      {
        inlineObjects: {
          image: {
            inlineObjectProperties: {
              embeddedObject: {
                description: "Five counters in a frame",
                imageProperties: {
                  contentUri: "https://example.com/frame.png",
                },
                size: {
                  width: { magnitude: 72, unit: "PT" },
                  height: { magnitude: 36, unit: "PT" },
                },
              },
            },
          },
        },
      },
    );
    const image = screen.getByRole("img", { name: "Five counters in a frame" });
    expect(image).toHaveAttribute("width", "96");
    expect(image).toHaveAttribute("height", "48");
    expect(screen.getByRole("note")).toHaveTextContent("Image unavailable");
    fireEvent.error(image);
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getAllByRole("note")).toHaveLength(2);
    expect(
      screen.getByText("[Image unavailable: Five counters in a frame]"),
    ).toBeInTheDocument();
  });

  it("renders a table of contents as navigation, ignores print breaks, and flags unsupported content", () => {
    const { container } = renderContent([
      { sectionBreak: {} },
      { tableOfContents: { content: [paragraph("Contents")] } },
      {
        paragraph: {
          elements: [{ pageBreak: {} }, { columnBreak: {} }],
        },
      },
      { paragraph: { elements: [{ horizontalRule: {} }] } },
      { paragraph: { elements: [{}] } },
      {},
    ]);
    expect(
      within(
        screen.getByRole("navigation", { name: "Table of contents" }),
      ).getByText("Contents"),
    ).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
    expect(container.querySelector("p hr")).toBeNull();
    expect(screen.getAllByRole("note")).toHaveLength(2);
  });

  it("reports missing body content", () => {
    render(<GoogleDocsRenderer document={{ title: "Empty" }} />);
    expect(screen.getByRole("alert")).toHaveTextContent("no body content");
  });

  it("reports malformed list items", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation();
    try {
      expect(() => renderContent([{ paragraph: { bullet: {} } }])).toThrow(
        "missing a listId",
      );
    } finally {
      consoleError.mockRestore();
    }
  });
});

describe("GoogleDocsApi", () => {
  it.each(examples)(
    "renders the selected $resourceFile example",
    ({ resourceFile, document }) => {
      render(<GoogleDocsApi resourceFile={resourceFile} />);
      expect(
        screen.getByRole("article", { name: document.title }),
      ).toBeInTheDocument();
    },
  );

  it("switches the rendered document when the selection changes", () => {
    const { rerender } = render(<GoogleDocsApi resourceFile="eyfs" />);
    rerender(<GoogleDocsApi resourceFile="pe-guide" />);
    expect(screen.queryByRole("article", { name: eyfs.title })).toBeNull();
    expect(
      screen.getByRole("article", { name: peGuide.title }),
    ).toBeInTheDocument();
    rerender(<GoogleDocsApi resourceFile="additional-materials" />);
    expect(screen.queryByRole("article", { name: peGuide.title })).toBeNull();
    expect(
      screen.getByRole("article", { name: additionalMaterials.title }),
    ).toBeInTheDocument();
  });
});
