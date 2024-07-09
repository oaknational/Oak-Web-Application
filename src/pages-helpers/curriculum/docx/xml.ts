import { js2xml, xml2js } from "xml-js";
import type { Element } from "xml-js";

export function xmlRootToJson(xmlData: string) {
  return xml2js(xmlData, {
    compact: false,
    captureSpacesBetweenElements: false,
  });
}

/**
 * To support <https://prettier.io/docs/en/options#embedded-language-formatting> as well as assertion.
 *
 * NOTE: This must called `xml`
 *
 * @param strings template strings
 * @param values tamplate values
 * @returns xml string
 */
export function safeXml(
  strings: TemplateStringsArray,
  ...values: (string | number | string[])[]
) {
  let outXml = "";
  for (let i = 0; i < strings.length; i++) {
    if (values[i] !== undefined) {
      const valueRaw = values[i];
      const value = Array.isArray(valueRaw) ? valueRaw.join("") : valueRaw;
      outXml += `${strings[i]!}${value}`;
    } else {
      outXml += `${strings[i]!}`;
    }
  }

  // Just for assertion
  xmlRootToJson(outXml);

  return outXml;
}

export function xmlElementToJson(xmlData?: string) {
  if (!xmlData) return;
  const rootNode = xmlRootToJson(xmlData);
  if (rootNode.elements.length !== 1) {
    throw new Error("Expecting a single root node in XML");
  }
  return collapseFragments(rootNode as Element)?.elements?.[0];
}

export function createFragment(elements: Element[]): Element {
  return {
    type: "element",
    name: "XML_FRAGMENT",
    elements: elements,
  };
}

export function collapseFragments(root: Element) {
  const run = (orig: Element) => {
    let node = orig;
    const cloneIfRequired = () => {
      if (node === orig) {
        return {
          ...node,
          elements: node.elements ? [...node.elements] : undefined,
        };
      }
      return node;
    };
    if (node.elements) {
      for (let i = node.elements.length - 1; i >= 0; i--) {
        if (node.elements) {
          const child = node.elements[i]!;
          const out = run(child);

          if (Array.isArray(out)) {
            node = cloneIfRequired();
            node.elements!.splice(i, 1, ...out);
          } else if (out !== child) {
            node = cloneIfRequired();
            if (node.elements) {
              node.elements[i] = out;
            }
          }
        }
      }
    }

    if (node.name === "XML_FRAGMENT") {
      return node.elements ?? [];
    }
    return node;
  };

  const out = run(root);
  if (Array.isArray(out)) {
    return createFragment(out);
  }
  return out;
}

export function jsonXmlToXmlString(json: Element): string {
  const root = "name" in json ? { elements: [json] } : json;
  const output = js2xml(collapseFragments(root));
  return output;
}

export function cdata(input: string | number) {
  return `<![CDATA[${input}]]>`;
}

export function cdataJson(input: Element): Element {
  if (input.type !== "text") {
    throw new Error("Expecting text node");
  }
  return {
    type: "cdata",
    cdata: String(input.text),
  };
}
