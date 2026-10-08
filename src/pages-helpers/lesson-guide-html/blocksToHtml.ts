import { escapeRegExp } from "lodash";

import type { Block, Inline, ListBlock } from "./documentToBlocks";

export type RenderOptions = {
  /**
   * The HTML level for the document's top headings. Defaults to 2 because the
   * page's h1 is the lesson title, which lives in the guide's page header.
   */
  topHeadingLevel?: number;
  /**
   * Hidden text that screen readers announce in place of symbols that carry
   * meaning, which would otherwise be read as "check mark" or "downwards arrow".
   */
  symbolLabels?: Record<string, string>;
};

export const DEFAULT_SYMBOL_LABELS: Record<string, string> = {
  "✓": "(correct answer)",
  "✔": "(correct answer)",
  "↓": "Easier:",
  "↑": "Harder:",
};

export const VISUALLY_HIDDEN_CLASS = "visually-hidden";

/** Escapes text and double-quoted attribute values. */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function blocksToHtml(blocks: Block[], options: RenderOptions = {}) {
  const headingLevel = createHeadingLevelMapper(options.topHeadingLevel ?? 2);
  const symbolLabels = options.symbolLabels ?? DEFAULT_SYMBOL_LABELS;
  const symbols = Object.keys(symbolLabels);
  const symbolPattern =
    symbols.length > 0
      ? new RegExp(`(${symbols.map(escapeRegExp).join("|")})`, "u")
      : undefined;

  const renderText = (text: string) =>
    symbolPattern
      ? text
          .split(symbolPattern)
          .map((part, index) =>
            index % 2 === 1
              ? `<span aria-hidden="true">${part}</span><span class="${VISUALLY_HIDDEN_CLASS}">${escapeHtml(symbolLabels[part] ?? "")}</span>`
              : escapeHtml(part),
          )
          .join("")
      : escapeHtml(text);

  const renderInline = (inline: Inline, inHeading: boolean) => {
    switch (inline.type) {
      case "break":
        return "<br>";
      case "image": {
        const size =
          (inline.width ? ` width="${inline.width}"` : "") +
          (inline.height ? ` height="${inline.height}"` : "");
        return `<img src="${escapeHtml(inline.src)}" alt="${escapeHtml(inline.alt)}"${size}>`;
      }
      case "text": {
        // Keep surrounding spaces outside the formatting: "what to <strong>expect</strong>".
        const [, before = "", text = "", after = ""] =
          /^(\s*)(.*?)(\s*)$/su.exec(inline.text) ?? [];
        let html = renderText(text);
        if (inline.verticalAlign === "superscript") html = `<sup>${html}</sup>`;
        if (inline.verticalAlign === "subscript") html = `<sub>${html}</sub>`;
        if (inline.italic) html = `<em>${html}</em>`;
        // Headings are already bold.
        if (inline.bold && !inHeading) html = `<strong>${html}</strong>`;
        return `${escapeHtml(before)}${html}${escapeHtml(after)}`;
      }
    }
  };

  // One <a> per run of inlines that share a link, so a link with mixed
  // formatting is announced once.
  const renderInlines = (inlines: Inline[], inHeading = false) => {
    let html = "";
    for (let start = 0; start < inlines.length; ) {
      const href = inlines[start]?.href;
      let end = start;
      while (end < inlines.length && inlines[end]?.href === href) end++;
      const inner = inlines
        .slice(start, end)
        .map((inline) => renderInline(inline, inHeading))
        .join("");
      html += href ? `<a href="${escapeHtml(href)}">${inner}</a>` : inner;
      start = end;
    }
    return html;
  };

  const renderList = (list: ListBlock): string => {
    const tag = list.ordered ? "ol" : "ul";
    const items = list.items
      .map(
        (item) =>
          `<li>${renderInlines(item.content)}${item.lists.map(renderList).join("")}</li>`,
      )
      .join("");
    return `<${tag}>${items}</${tag}>`;
  };

  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading": {
          const level = headingLevel(block.level);
          return `<h${level}>${renderInlines(block.content, true)}</h${level}>`;
        }
        case "paragraph":
          return `<p>${renderInlines(block.content)}</p>`;
        case "list":
          return renderList(block);
      }
    })
    .join("\n");
}

/**
 * Maps Word heading levels to HTML ones without gaps in the outline. Guides
 * often start at Heading 3, which would otherwise follow the page's h1, and
 * a Heading 3 straight after a Heading 2 always nests one level below it.
 */
function createHeadingLevelMapper(topLevel: number) {
  const open: { source: number; level: number }[] = [];
  return (source: number) => {
    let parent = open[open.length - 1];
    while (parent && parent.source >= source) {
      open.pop();
      parent = open[open.length - 1];
    }
    const level = Math.min((parent?.level ?? topLevel - 1) + 1, 6);
    open.push({ source, level });
    return level;
  };
}

const STANDALONE_STYLES = `
body { margin: 0; background: #fff; color: #222; font-family: Lexend, Arial, sans-serif; font-size: 1rem; line-height: 1.5; }
main { box-sizing: border-box; max-width: 48rem; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
h1 { font-size: 2rem; line-height: 1.2; }
h2 { font-size: 1.5rem; line-height: 1.3; margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid #ccc; }
h3 { font-size: 1.25rem; line-height: 1.3; margin-top: 1.75rem; }
li + li { margin-top: 0.25rem; }
img { max-width: 100%; height: auto; vertical-align: middle; }
.${VISUALLY_HIDDEN_CLASS} { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
`.trim();

/** Wraps converted guide HTML in a complete page, for downloading as a file. */
export function renderStandaloneHtml({
  title,
  bodyHtml,
  lang = "en-GB",
}: {
  title: string;
  bodyHtml: string;
  lang?: string;
}) {
  return `<!doctype html>
<html lang="${escapeHtml(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
${STANDALONE_STYLES}
</style>
</head>
<body>
<main>
<h1>${escapeHtml(title)}</h1>
${bodyHtml}
</main>
</body>
</html>
`;
}
