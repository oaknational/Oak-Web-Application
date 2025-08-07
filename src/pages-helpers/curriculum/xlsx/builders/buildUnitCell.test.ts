import { prettyFormat } from "../../docx/xml";

import { buildUnitCell } from "./buildUnitCell";

import { createUnit } from "@/fixtures/curriculum/unit";

describe("buildUnitCall", () => {
  test("with prefix", () => {
    const output = buildUnitCell({
      cellStyleIndexMap: { temp3: "TEMP_3" },
      x: 1,
      y: 1,
      unit: createUnit(),
      unitIndex: 1,
      prefix: "PREFIX",
    });
    expect(prettyFormat(output)).toMatchSnapshot();
  });

  test("without prefix", () => {
    const output = buildUnitCell({
      cellStyleIndexMap: {},
      x: 1,
      y: 1,
      unit: createUnit(),
      unitIndex: 1,
    });
    expect(prettyFormat(output)).toMatchSnapshot();
  });
});
