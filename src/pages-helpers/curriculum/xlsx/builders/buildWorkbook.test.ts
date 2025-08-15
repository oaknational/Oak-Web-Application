import { safeXml } from "@ooxml-tools/xml";

import { prettyFormat } from "../../docx/xml";

import { buildWorkbook } from "./buildWorkbook";

describe("buildWorkbook", () => {
  test("with sheets", () => {
    const output = buildWorkbook({
      sheets: [
        safeXml`<stubSheet>STUB_1</stubSheet>`,
        safeXml`<stubSheet>STUB_2</stubSheet>`,
        safeXml`<stubSheet>STUB_3</stubSheet>`,
      ],
    });
    expect(prettyFormat(output)).toMatchSnapshot();
  });

  test("without sheets", () => {
    const output = buildWorkbook({
      sheets: [],
    });
    expect(prettyFormat(output)).toMatchSnapshot();
  });
});
